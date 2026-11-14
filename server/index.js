import express from 'express';
import cors from 'cors';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import fs from 'fs';
import { db, getTournamentScheduledTime, parseMatchTimeString } from './db.js';
import { PaymentGateway } from './gateway.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');

const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || 'rushx_jwt_secret_v2_9f83b2a7e4d1c6058e';

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Cookie parser middleware (supporting HttpOnly auth cookies)
app.use((req, res, next) => {
  req.cookies = {};
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    cookieHeader.split(';').forEach(c => {
      const idx = c.indexOf('=');
      if (idx !== -1) {
        const key = c.substring(0, idx).trim();
        const val = c.substring(idx + 1).trim();
        try {
          req.cookies[key] = decodeURIComponent(val);
        } catch (e) {
          req.cookies[key] = val;
        }
      }
    });
  }
  next();
});

// URL prefix normalizer for Vercel / serverless routing
app.use((req, res, next) => {
  if (req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '/api');
  }
  if (process.env.VERCEL && !req.url.startsWith('/api') && !req.url.startsWith('/uploads')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Cold-start Supabase sync ready check
app.use(async (req, res, next) => {
  if (db.initPromise) {
    try {
      await db.initPromise;
    } catch (e) {
      // Continue even if initial sync caught error
    }
  }
  next();
});

// Rate Limiting Storage & Handlers
const loginAttempts = new Map();
const resetAttempts = new Map();

const rateLimitLogin = (req, res, next) => {
  // Safe body extraction to prevent crashes on non-object / array / mongo-style payload
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Invalid request payload format.' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
  const rawId = typeof req.body.identifier === 'string'
    ? req.body.identifier
    : (typeof req.body.username === 'string' ? req.body.username : (typeof req.body.email === 'string' ? req.body.email : ''));
  const identifier = rawId.trim().toLowerCase();

  const ipKey = `ip_${ip}`;
  const userKey = identifier ? `user_${identifier}` : null;
  const now = Date.now();

  const ipRecord = loginAttempts.get(ipKey) || { count: 0, firstAttempt: now, lockedUntil: 0 };
  const userRecord = userKey ? (loginAttempts.get(userKey) || { count: 0, firstAttempt: now, lockedUntil: 0 }) : null;

  if (ipRecord.lockedUntil > now) {
    const remainingSec = Math.ceil((ipRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed login attempts. Temporarily locked for security. Please try again in ${remainingSec} seconds.`
    });
  }

  if (userRecord && userRecord.lockedUntil > now) {
    const remainingSec = Math.ceil((userRecord.lockedUntil - now) / 1000);
    return res.status(429).json({
      error: `Too many failed login attempts for this account. Temporarily locked for security. Please try again in ${remainingSec} seconds.`
    });
  }

  // Reset window after 15 minutes
  if (now - ipRecord.firstAttempt > 15 * 60 * 1000) {
    ipRecord.count = 0;
    ipRecord.firstAttempt = now;
  }
  if (userRecord && now - userRecord.firstAttempt > 15 * 60 * 1000) {
    userRecord.count = 0;
    userRecord.firstAttempt = now;
  }

  req.rateLimitKeys = [ipKey];
  if (userKey) req.rateLimitKeys.push(userKey);
  req.rateLimitKey = ipKey;
  next();
};

const recordFailedLogin = (keys) => {
  const keyList = Array.isArray(keys) ? keys : (keys ? [keys] : []);
  const now = Date.now();
  for (const key of keyList) {
    const record = loginAttempts.get(key) || { count: 0, firstAttempt: now, lockedUntil: 0 };
    record.count += 1;
    if (record.count >= 5) {
      record.lockedUntil = now + (15 * 60 * 1000); // 15 min lock
    }
    loginAttempts.set(key, record);
  }
};

const recordSuccessfulLogin = (keys) => {
  const keyList = Array.isArray(keys) ? keys : (keys ? [keys] : []);
  for (const key of keyList) {
    loginAttempts.delete(key);
  }
};

// Helper: Set secure HttpOnly cookie & return token
const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  res.cookie('rushx_token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

// Helper: Extract token from Authorization Bearer or HttpOnly Cookie
const extractToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies && req.cookies.rushx_token) {
    return req.cookies.rushx_token;
  }
  return null;
};

// Uploads directory (Safe for serverless environments)
const UPLOADS_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'rushx_uploads')
  : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Notice: UPLOADS_DIR creation:', err.message);
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure multer memory storage (Works seamlessly on Vercel, Serverless, and Node)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Auth Middleware (Supporting Bearer token + HttpOnly cookie + multi-instance async lookup)
const authenticateToken = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    let user = db.getUserById(decoded.id);
    if (!user) {
      user = await db.findUserByIdAsync(decoded.id);
    }
    if (!user) {
      return res.status(404).json({ error: 'User no longer exists.' });
    }
    if (user.isBanned) {
      return res.status(403).json({
        error: `Your account has been suspended/banned by Admin. Reason: ${user.banReason || 'Fair play violation / suspected cheating'}. Contact support.`
      });
    }
    req.user = user;
    next();
  });
};

// Admin Auth Middleware
const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
    }
    next();
  });
};

// Helper: Try to extract user from optional token (Bearer or Cookie)
const getOptionalUser = (req) => {
  const token = extractToken(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return db.getUserById(decoded.id) || null;
  } catch (e) {
    return null;
  }
};

// ==========================================
// PUBLIC & AUTH ROUTES
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, fullName, email, phone, password, ffIgn, ffUid, referredBy } = req.body;

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      typeof phone !== 'string'
    ) {
      return res.status(400).json({ error: 'Username, Email, Phone, and Password must be valid strings.' });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanFullName = typeof fullName === 'string' && fullName.trim() ? fullName.trim() : cleanUsername;
    const cleanFfIgn = typeof ffIgn === 'string' ? ffIgn.trim() : '';
    const cleanFfUid = typeof ffUid === 'string' ? ffUid.trim() : '';
    const cleanReferredBy = typeof referredBy === 'string' && referredBy.trim() ? referredBy.trim().toLowerCase() : null;

    // Strict XSS & Tag Protection: Reject any angle brackets or script patterns
    const dangerousPattern = /[<>"']/;
    if (
      dangerousPattern.test(cleanUsername) ||
      dangerousPattern.test(cleanFullName) ||
      dangerousPattern.test(cleanFfIgn) ||
      dangerousPattern.test(cleanFfUid) ||
      (cleanReferredBy && dangerousPattern.test(cleanReferredBy))
    ) {
      return res.status(400).json({ error: 'Special characters (<, >, \", \') are not allowed in any field.' });
    }

    // Username format: alphanumeric and underscore only, 3-20 chars
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(cleanUsername)) {
      return res.status(400).json({
        error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores.'
      });
    }

    // Full name length cap
    if (cleanFullName.length < 2 || cleanFullName.length > 50) {
      return res.status(400).json({ error: 'Full name must be between 2 and 50 characters.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Phone / WhatsApp validation: 10 to 15 digits
    const phoneClean = cleanPhone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 15) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    // Password rules: min 8, max 64, requires special character
    if (password.length < 8 || password.length > 64) {
      return res.status(400).json({ error: 'Password must be between 8 and 64 characters long.' });
    }

    const specialSymbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialSymbolRegex.test(password)) {
      return res.status(400).json({
        error: 'Password must include at least one special symbol (e.g. @, #, $, %, etc.).'
      });
    }

    if (cleanReferredBy && !usernameRegex.test(cleanReferredBy)) {
      return res.status(400).json({ error: 'Referral code can only contain letters, numbers, and underscores.' });
    }

    // Unique Username Check (case-insensitive across cache & Supabase cloud)
    if (await db.isUsernameTakenAsync(cleanUsername)) {
      return res.status(400).json({ error: 'Username is already taken. Please choose another.' });
    }

    // Unique Email Check (across cache & Supabase cloud)
    if (await db.isEmailTakenAsync(cleanEmail)) {
      return res.status(400).json({ error: 'This email is already registered with another account.' });
    }

    // Strict Unique Phone / WhatsApp Check (across cache & Supabase cloud)
    if (await db.isPhoneTakenAsync(phoneClean)) {
      return res.status(400).json({
        error: 'This Phone / WhatsApp number is already registered with another account. Multiple accounts per number are strictly prohibited.'
      });
    }

    // Optional Free Fire UID unique check if provided
    if (cleanFfUid) {
      if (cleanFfUid.length > 20) {
        return res.status(400).json({ error: 'Free Fire UID must be 20 characters or fewer.' });
      }
      if (db.getUserByFfUid(cleanFfUid)) {
        return res.status(400).json({
          error: 'This Free Fire Player UID is already registered with another account.'
        });
      }
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = {
      id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      fullName: cleanFullName,
      email: cleanEmail,
      phone: cleanPhone,
      passwordHash,
      password_hash: passwordHash,
      ffIgn: cleanFfIgn,
      ff_ign: cleanFfIgn,
      ffUid: cleanFfUid,
      ff_uid: cleanFfUid,
      avatar: `/avatars/avatar-${Math.floor(Math.random() * 6) + 1}.svg`,
      depositBalance: 0,
      winBalance: 0,
      totalEarning: 0,
      totalKills: 0,
      matchesPlayed: 0,
      referralCode: cleanUsername.toLowerCase(),
      referredBy: cleanReferredBy,
      role: 'user',
      isBanned: false,
      banReason: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedUser = await db.createUser(newUser);

    const token = jwt.sign(
      { id: savedUser.id, username: savedUser.username, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    setAuthCookie(res, token);

    const { passwordHash: _, password_hash: __, ...userWithoutPass } = savedUser;
    return res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userWithoutPass
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// Login (With Rate Limiting, Brute-Force Delay, Anti-Account-Enumeration, and HttpOnly Cookie)
app.post('/api/auth/login', rateLimitLogin, async (req, res) => {
  try {
    const identifier = req.body.identifier || req.body.username || req.body.email;
    const { password } = req.body;

    if (typeof identifier !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Username/email and password must be valid strings.' });
    }

    const cleanIdentifier = identifier.trim();
    const cleanPassword = password;

    if (!cleanIdentifier || !cleanPassword || cleanIdentifier.length > 100 || cleanPassword.length > 100) {
      return res.status(400).json({ error: 'Invalid username/email or password.' });
    }

    // Resilient lookup across multi-instance serverless instances
    let user = await db.findUserAsync(cleanIdentifier);

    // Constant-time compare to prevent user enumeration timing attacks
    const dummyHash = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
    const targetHash = (user && (user.passwordHash || user.password_hash)) ? (user.passwordHash || user.password_hash) : dummyHash;
    const isMatch = bcrypt.compareSync(cleanPassword, targetHash);

    // Uniform error message for non-existent user and incorrect password (prevents account enumeration!)
    if (!user || !isMatch) {
      recordFailedLogin(req.rateLimitKeys || req.rateLimitKey);
      await new Promise(r => setTimeout(r, 400)); // Thwart high-speed brute force
      return res.status(401).json({ error: 'Invalid username/email or password. Please try again.' });
    }

    if (user.isBanned) {
      return res.status(403).json({
        error: `Your account has been suspended/banned by Admin. Reason: ${user.banReason || 'Violation of Fair Play / Anti-Cheat rules'}. Contact support.`
      });
    }

    recordSuccessfulLogin(req.rateLimitKeys || req.rateLimitKey);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    setAuthCookie(res, token);

    const { passwordHash: _, password_hash: __, ...userWithoutPass } = user;
    return res.json({
      message: 'Login successful!',
      token,
      user: userWithoutPass
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('rushx_token', { path: '/' });
  return res.json({ message: 'Logged out successfully.' });
});

// Admin Login (Protected with Rate Limiting & HttpOnly Cookie)
app.post('/api/admin/login', rateLimitLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Admin username and password required.' });
    }

    const cleanUsername = username.trim();
    if (!cleanUsername || !password || cleanUsername.length > 50 || password.length > 100) {
      return res.status(400).json({ error: 'Invalid admin credentials format.' });
    }

    let user = await db.findUserAsync(cleanUsername);

    const dummyHash = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';
    const targetHash = (user && (user.passwordHash || user.password_hash)) ? (user.passwordHash || user.password_hash) : dummyHash;
    const isMatch = bcrypt.compareSync(password, targetHash);

    if (!user || user.role !== 'admin' || !isMatch) {
      recordFailedLogin(req.rateLimitKeys || req.rateLimitKey);
      await new Promise(r => setTimeout(r, 500));
      return res.status(403).json({ error: 'Invalid admin credentials.' });
    }

    recordSuccessfulLogin(req.rateLimitKeys || req.rateLimitKey);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    setAuthCookie(res, token);

    const { passwordHash: _, password_hash: __, ...userWithoutPass } = user;
    return res.json({
      message: 'Admin authentication successful.',
      token,
      admin: userWithoutPass
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Admin login failed.' });
  }
});

// Admin Master Password Reset via Security Recovery Key (Rate-limited & Constant-time protected)
app.post('/api/admin/reset-password', async (req, res) => {
  try {
    const { masterRecoveryKey, newPassword } = req.body;

    if (
      typeof masterRecoveryKey !== 'string' ||
      typeof newPassword !== 'string' ||
      !masterRecoveryKey.trim() ||
      !newPassword
    ) {
      return res.status(400).json({ error: 'Master Recovery Key and New Password must be valid strings.' });
    }

    if (newPassword.length < 8 || newPassword.length > 64) {
      return res.status(400).json({ error: 'New password must be between 8 and 64 characters long.' });
    }

    // Rate-limiting on recovery attempts (max 3 failed attempts per 30 minutes)
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const attempts = resetAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    if (attempts.lockedUntil > now) {
      const waitMins = Math.ceil((attempts.lockedUntil - now) / 60000);
      return res.status(429).json({ error: `Too many failed recovery attempts. Locked for ${waitMins} minutes.` });
    }

    const settings = db.getSettings();
    const expectedKey = String(process.env.ADMIN_RECOVERY_KEY || settings.adminRecoveryKey || '').trim();

    if (!expectedKey) {
      return res.status(403).json({ error: 'Master security recovery key is not configured on this server.' });
    }

    const givenBuf = Buffer.from(masterRecoveryKey.trim());
    const expectedBuf = Buffer.from(expectedKey);
    const isKeyValid = givenBuf.length === expectedBuf.length && crypto.timingSafeEqual(givenBuf, expectedBuf);

    if (!isKeyValid) {
      attempts.count += 1;
      if (attempts.count >= 3) {
        attempts.lockedUntil = now + (30 * 60 * 1000);
      }
      resetAttempts.set(ip, attempts);
      await new Promise(r => setTimeout(r, 800));
      return res.status(403).json({ error: 'Invalid Master Recovery Key! Unauthorized access attempt rejected.' });
    }

    resetAttempts.delete(ip);
    const salt = bcrypt.genSaltSync(10);
    const newPasswordHash = bcrypt.hashSync(newPassword, salt);

    const adminUser = db.getUsers().find(u => u.role === 'admin' || u.username === 'admin');
    if (!adminUser) {
      return res.status(404).json({ error: 'Admin account not found.' });
    }

    // Update both local and Supabase password_hash
    adminUser.passwordHash = newPasswordHash;
    adminUser.password_hash = newPasswordHash;
    await db.updateUser(adminUser.id, { passwordHash: newPasswordHash, password_hash: newPasswordHash });

    return res.json({
      success: true,
      message: 'Admin Master Password has been successfully reset! You can now log into Admin Portal.'
    });
  } catch (error) {
    console.error('Reset admin password error:', error);
    return res.status(500).json({ error: 'Failed to reset admin password.' });
  }
});

// App Version & Force Update Check
app.get('/api/app-version', (req, res) => {
  const s = db.getSettings();
  return res.json({
    currentVersion: s.appVersion || '1.0.0',
    minRequiredVersion: s.minRequiredVersion || '1.0.0',
    forceUpdateEnabled: Boolean(s.forceUpdateEnabled),
    updateDownloadUrl: s.updateDownloadUrl || '/download',
    updateMessage: s.updateMessage || 'Please update RushX to continue playing!'
  });
});

// Direct Android APK Download Route
app.get('/rushx.apk', (req, res) => {
  const releasesApk = path.join(__dirname, '../releases/rushx.apk');
  const buildApk = path.join(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');
  const localApk = path.join(__dirname, '../public/rushx.apk');
  const distApk = path.join(__dirname, '../dist/rushx.apk');

  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="RushX-v1.0.0.apk"');

  if (fs.existsSync(releasesApk)) {
    return res.download(releasesApk, 'RushX-v1.0.0.apk');
  } else if (fs.existsSync(buildApk)) {
    return res.download(buildApk, 'RushX-v1.0.0.apk');
  } else if (fs.existsSync(localApk)) {
    return res.download(localApk, 'RushX-v1.0.0.apk');
  } else if (fs.existsSync(distApk)) {
    return res.download(distApk, 'RushX-v1.0.0.apk');
  } else {
    return res.status(404).send('RushX APK file is currently being packaged. Please try again in 1 minute.');
  }
});

// Admin: Update App Version & Force Update Gate
app.post('/api/admin/update-version', requireAdmin, async (req, res) => {
  try {
    const { appVersion, minRequiredVersion, forceUpdateEnabled, updateDownloadUrl, updateMessage } = req.body;
    const updates = {};
    if (appVersion !== undefined) updates.appVersion = appVersion.trim();
    if (minRequiredVersion !== undefined) updates.minRequiredVersion = minRequiredVersion.trim();
    if (forceUpdateEnabled !== undefined) updates.forceUpdateEnabled = Boolean(forceUpdateEnabled);
    if (updateDownloadUrl !== undefined) updates.updateDownloadUrl = updateDownloadUrl.trim();
    if (updateMessage !== undefined) updates.updateMessage = updateMessage.trim();

    const updated = await db.updateSettings(updates);
    return res.json({ message: 'App version and force-update settings saved successfully!', settings: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update version settings.' });
  }
});

// Current User Info & Real-Time Stats
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const userJoined = db.getJoinedMatchesByUser(user.id);
  const matchesPlayed = Math.max(userJoined.length, Number(user.matchesPlayed) || 0);
  const totalKills = Math.max(
    userJoined.reduce((sum, j) => sum + (Number(j.kills) || 0), 0),
    Number(user.totalKills) || 0
  );
  const totalEarning = Math.max(
    userJoined.reduce((sum, j) => sum + (Number(j.winAmount) || 0), 0),
    Number(user.totalEarning) || 0
  );

  const { passwordHash: _, ...safeUser } = user;
  return res.json({
    user: {
      ...safeUser,
      totalBalance: (Number(safeUser.depositBalance) || 0) + (Number(safeUser.winBalance) || 0),
      matchesPlayed,
      totalKills,
      totalEarning
    }
  });
});

// Update Profile Free Fire Credentials
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { ffIgn, ffUid, phone, fullName } = req.body;
    const updates = {};
    if (ffIgn !== undefined) updates.ffIgn = ffIgn.trim();
    if (ffUid !== undefined) updates.ffUid = ffUid.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (fullName !== undefined) updates.fullName = fullName.trim();

    const updated = db.updateUser(req.user.id, updates);
    const { passwordHash: _, ...safeUser } = updated;
    return res.json({ message: 'Profile updated successfully!', user: safeUser });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ==========================================
// TOURNAMENT ROUTES (SECURE CREDENTIALS)
// ==========================================

// Get All Tournaments
// STRICT SECURITY RULE: Room ID & Password only returned to JOINED players or Admin!
app.get('/api/tournaments', async (req, res) => {
  const { status, category, gameType } = req.query;
  let list = await db.syncTournamentsFromSupabase();
  const now = Date.now();

  const currentUser = getOptionalUser(req);
  const userJoinedIds = currentUser
    ? new Set(db.getJoinedMatchesByUser(currentUser.id).map(j => j.tournamentId))
    : new Set();
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (status) {
    if (status.toUpperCase() === 'UPCOMING') {
      // STRICT REQUIREMENT: If match scheduled time has passed (e.g. 4:00 PM at 4:01 PM),
      // DO NOT show in upcoming list!
      list = list.filter(t => {
        if (t.status.toUpperCase() !== 'UPCOMING') return false;
        const schedTime = getTournamentScheduledTime(t);
        return schedTime === 0 || schedTime > now;
      });
    } else {
      list = list.filter(t => t.status.toUpperCase() === status.toUpperCase());
    }
  }
  if (category) {
    list = list.filter(t => t.category.toUpperCase() === category.toUpperCase());
  }
  if (gameType) {
    list = list.filter(t => t.gameType.toUpperCase() === gameType.toUpperCase());
  }

  // Room credentials revealed ONLY if user has joined or is admin!
  const safeList = list.map(t => {
    const isJoined = userJoinedIds.has(t.id);
    const canSeeCredentials = isAdmin || isJoined;
    return {
      ...t,
      map: t.map && t.map.toUpperCase().includes('BERMUDA') ? t.map : 'BERMUDA',
      roomId: canSeeCredentials ? (t.roomId || '') : '',
      roomPassword: canSeeCredentials ? (t.roomPassword || '') : '',
      noticeMsg: t.noticeMsg || '',
      isJoined,
      hasCredentialsReady: Boolean(t.roomId && t.roomPassword)
    };
  });

  return res.json(safeList);
});

// Get Single Tournament Details (Strict Registered-Player-Only Room Credentials!)
app.get('/api/tournaments/:id', async (req, res) => {
  await db.syncTournamentsFromSupabase();
  const tournament = db.getTournamentById(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }

  const joinedPlayers = db.getJoinedPlayers(tournament.id);
  const currentUser = getOptionalUser(req);

  const hasJoined = currentUser ? joinedPlayers.some(jp => jp.userId === currentUser.id) : false;
  const isAdmin = currentUser ? currentUser.role === 'admin' : false;

  // STRICT REQUIREMENT: "agr mai admin panel se kisi tournament ka id pass gernate kru to wo sirf registered players ko show kre id and pass"
  // ONLY registered players who joined, or the admin can see Room ID & Password!
  const isAuthorized = hasJoined || isAdmin;

  return res.json({
    ...tournament,
    map: tournament.map && tournament.map.toUpperCase().includes('BERMUDA') ? tournament.map : 'BERMUDA',
    roomId: isAuthorized ? tournament.roomId : '',
    roomPassword: isAuthorized ? tournament.roomPassword : '',
    isCredentialsLocked: !isAuthorized,
    hasJoined,
    joinedPlayersCount: joinedPlayers.length,
    userJoinedRecord: currentUser ? joinedPlayers.find(jp => jp.userId === currentUser.id) || null : null,
    joinedPlayers: joinedPlayers.map(jp => ({
      id: jp.id,
      username: jp.username,
      ffIgn: jp.ffIgn,
      kills: jp.kills,
      winAmount: jp.winAmount
    }))
  });
});

// Join Tournament
app.post('/api/tournaments/:id/join', authenticateToken, async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = db.getTournamentById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }

    if (tournament.status !== 'UPCOMING') {
      return res.status(400).json({ error: 'Registration is closed for this tournament.' });
    }

    // STRICT MATCH TIME CHECK: If scheduled time has passed, reject entry
    const schedTime = getTournamentScheduledTime(tournament);
    if (schedTime > 0 && Date.now() >= schedTime) {
      return res.status(400).json({
        error: 'Match entry closed! This tournament scheduled time has already passed.'
      });
    }

    if ((tournament.joinedSpots || 0) >= tournament.totalSpots) {
      return res.status(400).json({ error: 'Tournament is full! All spots are booked.' });
    }

    // Check if already joined
    const joinedList = db.getJoinedPlayers(tournamentId);
    if (joinedList.some(jp => jp.userId === req.user.id)) {
      return res.status(400).json({ error: 'You have already joined this tournament.' });
    }

    const { ffIgn, ffUid, inGameName, inGameId, teammateIgn, teammateUid } = req.body;
    const playerIgn = ffIgn || inGameName || req.user.ffIgn;
    const playerUid = ffUid || inGameId || req.user.ffUid;

    if (!playerIgn || !playerUid) {
      return res.status(400).json({ error: 'Free Fire In-Game Name (IGN) and Player UID are required to join!' });
    }

    if (tournament.matchType === 'DUO' && (!teammateIgn || !teammateUid)) {
      return res.status(400).json({ error: 'Teammate Free Fire IGN and UID are required for Duo matches.' });
    }

    const entryFee = Number(tournament.entryFee);
    const user = db.getUserById(req.user.id);
    const totalBalance = (Number(user.depositBalance) || 0) + (Number(user.winBalance) || 0);

    if (totalBalance < entryFee) {
      return res.status(400).json({
        error: `Insufficient balance! Entry fee is ₹${entryFee}, your total balance is ₹${totalBalance}. Minimum deposit is ₹50.`
      });
    }

    // Deduct entry fee: deposit balance first, remainder from win balance
    let newDeposit = Number(user.depositBalance) || 0;
    let newWin = Number(user.winBalance) || 0;

    if (newDeposit >= entryFee) {
      newDeposit -= entryFee;
    } else {
      const remainder = entryFee - newDeposit;
      newDeposit = 0;
      newWin -= remainder;
    }

    await db.updateUser(user.id, {
      depositBalance: newDeposit,
      winBalance: newWin,
      ffIgn: playerIgn,
      ffUid: playerUid
    });

    // Create joined record
    const joinRecord = {
      id: 'jp_' + Date.now() + Math.random().toString(36).substring(2, 6),
      tournamentId,
      userId: user.id,
      username: user.username,
      ffIgn: playerIgn,
      ffUid: playerUid,
      teammateIgn: teammateIgn ? teammateIgn.trim() : '',
      teammateUid: teammateUid ? teammateUid.trim() : '',
      kills: 0,
      winAmount: 0,
      joinedAt: new Date().toISOString()
    };
    await db.joinTournament(joinRecord);

    // Create wallet transaction
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    await db.createTransaction({
      id: 'tx_' + Date.now(),
      userId: user.id,
      type: 'debit',
      walletType: 'entry_fee',
      amount: entryFee,
      newBalance: newDeposit + newWin,
      date: dateFormatted,
      txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
      description: `Entry fee joined contest ${tournament.title} ${tournament.matchId}`,
      createdAt: now.toISOString()
    });

    return res.json({
      message: 'Successfully joined! Room ID & Password will unlock for you 10-15 mins before match time.',
      joinedSpots: (tournament.joinedSpots || 0) + 1,
      totalSpots: tournament.totalSpots,
      remainingBalance: newDeposit + newWin
    });
  } catch (error) {
    console.error('Join tournament error:', error);
    return res.status(500).json({ error: 'Failed to join tournament.' });
  }
});

// My Joined Matches (Only joined by user)
app.get('/api/my-matches', authenticateToken, (req, res) => {
  const userJoined = db.getJoinedMatchesByUser(req.user.id);
  const tournaments = db.getTournaments();

  const joinedMatches = userJoined.map(jp => {
    const t = tournaments.find(tour => tour.id === jp.tournamentId);
    if (!t) return null;
    return {
      ...t,
      // Room credentials revealed because this user HAS registered!
      roomId: t.roomId,
      roomPassword: t.roomPassword,
      joinedRecord: jp
    };
  }).filter(Boolean);

  return res.json(joinedMatches);
});

// ==========================================
// WALLET & PAYMENT ROUTES
// ==========================================

// Get Wallet Balance & Transactions
app.get('/api/wallet', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  const transactions = db.getTransactions(user.id);

  const depositBal = Number(user.depositBalance) || 0;
  const winBal = Number(user.winBalance) || 0;

  return res.json({
    totalBalance: depositBal + winBal,
    depositBalance: depositBal,
    winBalance: winBal,
    transactions
  });
});

// Get User's Deposit Requests History
app.get('/api/wallet/deposits', authenticateToken, (req, res) => {
  const deposits = db.getDepositRequests(req.user.id);
  return res.json(deposits);
});

// Get User's Withdrawal Requests History
app.get('/api/wallet/withdrawals', authenticateToken, (req, res) => {
  const withdrawals = db.getWithdrawalRequests(req.user.id);
  return res.json(withdrawals);
});

// Submit Deposit Request (Minimum ₹50)
app.post('/api/wallet/deposit', authenticateToken, upload.single('screenshot'), async (req, res) => {
  try {
    const { amount, utrNumber } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || isNaN(numAmount)) {
      return res.status(400).json({ error: 'Please enter a valid deposit amount.' });
    }

    if (numAmount < 50) {
      return res.status(400).json({ error: 'Minimum deposit amount is ₹50.' });
    }

    if (numAmount > 500) {
      return res.status(400).json({ error: 'Maximum deposit allowed in one transaction is ₹500.' });
    }

    if (!utrNumber || utrNumber.trim().length < 6) {
      return res.status(400).json({ error: 'Please enter a valid 12-digit UPI UTR / Transaction Reference number.' });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'Payment screenshot proof is mandatory! Please upload the screenshot of your successful UPI payment.'
      });
    }

    let screenshotUrl = '';
    if (req.file) {
      const mime = req.file.mimetype || 'image/png';
      if (req.file.buffer) {
        screenshotUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      } else if (req.file.path && fs.existsSync(req.file.path)) {
        screenshotUrl = `data:${mime};base64,${fs.readFileSync(req.file.path).toString('base64')}`;
      } else if (req.file.filename) {
        screenshotUrl = `/uploads/${req.file.filename}`;
      }
    }

    const newDeposit = {
      id: 'dep_' + Date.now(),
      userId: req.user.id,
      username: req.user.username,
      amount: numAmount,
      utrNumber: utrNumber.trim(),
      screenshotUrl,
      status: 'PENDING',
      adminNote: '',
      createdAt: new Date().toISOString(),
      processedAt: null
    };

    await db.createDepositRequest(newDeposit);

    return res.status(201).json({
      message: 'Deposit request submitted successfully! Funds will be credited after admin verification (2-5 mins).',
      deposit: newDeposit
    });
  } catch (error) {
    console.error('Deposit request error:', error);
    return res.status(500).json({ error: 'Failed to submit deposit request.' });
  }
});

// Submit Withdrawal Request (Minimum ₹100, WINNING AMOUNT ONLY, Max 2 per day)
app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, method, upiId, accountDetails } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || isNaN(numAmount)) {
      return res.status(400).json({ error: 'Please enter a valid withdrawal amount.' });
    }

    if (numAmount < 100) {
      return res.status(400).json({ error: 'Minimum withdrawal amount is ₹100.' });
    }

    if (numAmount > 1000) {
      return res.status(400).json({ error: 'Maximum withdrawal allowed in one transaction is ₹1,000.' });
    }

    const user = db.getUserById(req.user.id);
    const winBalance = Number(user.winBalance) || 0;

    if (numAmount > winBalance) {
      return res.status(400).json({
        error: `Withdrawal is only permitted from Win Balance. You have ₹${winBalance} in Win Balance. Deposit balance cannot be withdrawn.`
      });
    }

    const todayCount = db.getTodayWithdrawalCount(user.id);
    if (todayCount >= 2) {
      return res.status(400).json({
        error: 'Daily limit reached! Maximum 2 withdrawals per day are permitted. Please request again tomorrow.'
      });
    }

    if (!upiId && !accountDetails) {
      return res.status(400).json({ error: 'Please provide your UPI ID or Bank account details.' });
    }

    const newWinBal = winBalance - numAmount;
    await db.updateUser(user.id, { winBalance: newWinBal });

    const newWithdrawal = {
      id: 'wdr_' + Date.now(),
      userId: user.id,
      username: user.username,
      amount: numAmount,
      method: method || 'UPI',
      upiId: upiId ? upiId.trim() : '',
      accountDetails: accountDetails ? accountDetails.trim() : '',
      status: 'PENDING',
      adminNote: '',
      createdAt: new Date().toISOString(),
      processedAt: null
    };
    await db.createWithdrawalRequest(newWithdrawal);

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    await db.createTransaction({
      id: 'tx_' + Date.now(),
      userId: user.id,
      type: 'debit',
      walletType: 'win',
      amount: numAmount,
      newBalance: (Number(user.depositBalance) || 0) + newWinBal,
      date: dateFormatted,
      txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
      description: `Withdrawal request submitted to ${upiId || accountDetails} (Pending Approval)`,
      createdAt: now.toISOString()
    });

    return res.status(201).json({
      message: 'Withdrawal request submitted! Payout will be sent to your UPI/Bank shortly.',
      withdrawal: newWithdrawal,
      remainingWinBalance: newWinBal,
      withdrawalsRemainingToday: 2 - (todayCount + 1)
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return res.status(500).json({ error: 'Failed to process withdrawal request.' });
  }
});

// ==========================================
// PAYMENT GATEWAY INTEGRATION ENDPOINTS
// ==========================================

app.post('/api/payment/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || Number(amount) < 50) {
      return res.status(400).json({ error: 'Minimum deposit is ₹50.' });
    }
    const order = await PaymentGateway.createOrder({
      userId: req.user.id,
      username: req.user.username,
      amount: Number(amount)
    });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

app.post('/api/payment/webhook', async (req, res) => {
  try {
    const result = await PaymentGateway.handleWebhook(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// ==========================================
// LEADERBOARD & MISC ROUTES
// ==========================================

app.get('/api/leaderboard', (req, res) => {
  const settings = db.getSettings();
  const currentUser = getOptionalUser(req);
  const isAdmin = currentUser && currentUser.role === 'admin';

  if (settings.leaderboardVisible === false && !isAdmin) {
    return res.json({
      visible: false,
      message: 'Leaderboard is currently paused or being updated by Admin.',
      leaderboard: []
    });
  }

  const users = db.getUsers().filter(u => u.role !== 'admin' && !u.isBanned);
  const allJoined = db.data.joined_players;

  // Strict Privacy Rule: ONLY show users who have actually played at least 1 match!
  const leaderboard = users
    .map(u => {
      const userJoined = allJoined.filter(j => j.userId === u.id);
      const totalKills = Math.max(
        userJoined.reduce((sum, j) => sum + (Number(j.kills) || 0), 0),
        Number(u.totalKills) || 0
      );
      const totalEarned = Math.max(
        userJoined.reduce((sum, j) => sum + (Number(j.winAmount) || 0), 0),
        Number(u.totalEarning) || 0,
        Number(u.winBalance) || 0
      );
      const matchesPlayed = Math.max(userJoined.length, Number(u.matchesPlayed) || 0);

      return {
        id: u.id,
        username: u.username,
        ffIgn: u.ffIgn || u.username,
        matchesPlayed,
        totalKills,
        totalEarned
      };
    })
    .filter(p => p.matchesPlayed >= 1);

  leaderboard.sort((a, b) => b.totalEarned - a.totalEarned || b.totalKills - a.totalKills);
  return res.json({
    visible: true,
    leaderboard: leaderboard.slice(0, 50).map((p, idx) => ({ ...p, rank: idx + 1 }))
  });
});

// Public Settings: Strictly Sanitized (NO adminRecoveryKey, NO owner personal full name / private PII)
app.get('/api/settings', (req, res) => {
  return res.json(db.getPublicSettings());
});

// Authenticated Deposit Info (For logged in players depositing funds)
app.get('/api/wallet/deposit-info', authenticateToken, (req, res) => {
  return res.json(db.getDepositSettings());
});

// ==========================================
// ADMIN PANEL ROUTES
// ==========================================

app.get('/api/admin/dashboard', requireAdmin, (req, res) => {
  const users = db.getUsers().filter(u => u.role !== 'admin');
  const tournaments = db.getTournaments();
  const deposits = db.getDepositRequests();
  const withdrawals = db.getWithdrawalRequests();

  const pendingDeposits = deposits.filter(d => d.status === 'PENDING');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING');
  const activeTournaments = tournaments.filter(t => t.status === 'UPCOMING' || t.status === 'ONGOING');

  const totalPrizePool = tournaments.reduce((acc, t) => acc + (Number(t.prizePool) || 0), 0);

  return res.json({
    totalUsers: users.length,
    activeTournamentsCount: activeTournaments.length,
    pendingDepositsCount: pendingDeposits.length,
    pendingWithdrawalsCount: pendingWithdrawals.length,
    totalPrizePool,
    recentTournaments: tournaments.slice(0, 5),
    pendingDeposits: pendingDeposits.slice(0, 5),
    pendingWithdrawals: pendingWithdrawals.slice(0, 5)
  });
});

// Create Tournament (Map default to BERMUDA)
app.post('/api/admin/tournaments', requireAdmin, async (req, res) => {
  try {
    const {
      title, gameType, matchType, category, map, matchTime,
      entryFee, perKill, prizePool, winPrize, totalSpots, rules, banner
    } = req.body;

    if (!title || !entryFee || !matchTime) {
      return res.status(400).json({ error: 'Title, Entry Fee, and Match Time are required.' });
    }

    const matchIdNum = '#' + Math.floor(300000 + Math.random() * 700000);
    const chosenMap = (map && map.trim()) ? map.trim().toUpperCase() : 'BERMUDA';

    // Parse exact ISO scheduledAt timestamp
    let scheduledAtIso = null;
    if (req.body.scheduledAt) {
      const parsedExplicit = new Date(req.body.scheduledAt).getTime();
      if (!isNaN(parsedExplicit) && parsedExplicit > 0) {
        scheduledAtIso = new Date(parsedExplicit).toISOString();
      }
    }
    if (!scheduledAtIso) {
      const parsedTime = parseMatchTimeString(matchTime);
      if (parsedTime > 0) {
        scheduledAtIso = new Date(parsedTime).toISOString();
      }
    }

    const newTournament = {
      id: 't_' + Date.now(),
      matchId: matchIdNum,
      title: title.trim(),
      gameType: gameType || 'BR',
      matchType: matchType || 'SOLO',
      category: category || (gameType === 'CS' ? 'CS_HEADSHOT' : 'BR_FULL_MAP'),
      map: chosenMap.includes('BERMUDA') ? chosenMap : 'BERMUDA',
      matchTime: matchTime.trim(),
      scheduledAt: scheduledAtIso,
      entryFee: Number(entryFee),
      perKill: Number(perKill) || 0,
      prizePool: Number(prizePool) || 0,
      winPrize: Number(winPrize) || 0,
      totalSpots: Number(totalSpots) || 48,
      joinedSpots: 0,
      status: 'UPCOMING',
      roomId: '',
      roomPassword: '',
      rules: rules ? rules.trim() : 'MAP: BERMUDA ONLY! IDP TIME 10 MINS BEFORE MATCH!',
      banner: banner || '/poster-br-solo.svg',
      createdAt: new Date().toISOString()
    };

    await db.createTournament(newTournament);
    return res.status(201).json({ message: 'Tournament created successfully!', tournament: newTournament });
  } catch (error) {
    console.error('Create tournament error:', error);
    return res.status(500).json({ error: 'Failed to create tournament.' });
  }
});

app.put('/api/admin/tournaments/:id', requireAdmin, async (req, res) => {
  const updated = await db.updateTournament(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }
  return res.json({ message: 'Tournament updated successfully!', tournament: updated });
});

app.delete('/api/admin/tournaments/:id', requireAdmin, async (req, res) => {
  const deleted = await db.deleteTournament(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }
  return res.json({ message: 'Tournament deleted successfully!' });
});

// Admin: Set Room ID & Password manually
app.post('/api/admin/tournaments/:id/credentials', requireAdmin, async (req, res) => {
  const { roomId, roomPassword, status } = req.body;
  const updates = {};
  if (roomId !== undefined) updates.roomId = roomId.trim();
  if (roomPassword !== undefined) updates.roomPassword = roomPassword.trim();
  if (status) updates.status = status;

  const updated = await db.updateTournament(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }
  return res.json({ message: 'Room credentials updated! Only registered players can see these details.', tournament: updated });
});

// Admin: 1-Click Generate Random Room ID and Password!
app.post('/api/admin/tournaments/:id/generate-room', requireAdmin, async (req, res) => {
  const randomRoomId = Math.floor(1000000 + Math.random() * 9000000).toString();
  const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();

  const updated = await db.updateTournament(req.params.id, {
    roomId: randomRoomId,
    roomPassword: randomPassword,
    status: 'ONGOING'
  });

  if (!updated) {
    return res.status(404).json({ error: 'Tournament not found.' });
  }

  return res.json({
    message: `Generated Room ID: ${randomRoomId} | Password: ${randomPassword} (Status set to ONGOING). Registered players can view it now!`,
    roomId: randomRoomId,
    roomPassword: randomPassword,
    tournament: updated
  });
});

// Admin: Settle Match Results & Distribute Winnings (Direct Money & Player Stats Update!)
app.post('/api/admin/tournaments/:id/settle', requireAdmin, async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournament = db.getTournamentById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }

    const { playerKills, playerResults } = req.body;
    const killsList = Array.isArray(playerKills) ? playerKills : (Array.isArray(playerResults) ? playerResults : []);
    
    const winnerInput = req.body.csWinnerId || req.body.winnerUserId || req.body.winnerId;

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const joinedPlayers = db.getJoinedPlayers(tournamentId);

    let csWinnerId = null;
    if (winnerInput) {
      const matchJp = joinedPlayers.find(j => j.id === winnerInput || j.userId === winnerInput);
      if (matchJp) csWinnerId = matchJp.id;
    }

    // Unified Settlement: Process Kills & Event Winner Rewards for all registered players
    const winPrize = Number(tournament.winPrize) || Number(tournament.prizePool) || 0;
    const perKillRate = Number(tournament.perKill) || 0;

    for (const jp of joinedPlayers) {
      const pkObj = killsList.find(k => k.joinedPlayerId === jp.id || k.userId === jp.userId || k.id === jp.id);
      const kills = pkObj ? (Number(pkObj.kills) || 0) : (Number(jp.kills) || 0);
      const isWinner = Boolean(csWinnerId && jp.id === csWinnerId);
      
      const killReward = perKillRate > 0 ? (kills * perKillRate) : 0;
      const winnerReward = isWinner ? winPrize : 0;
      const totalReward = killReward + winnerReward;

      await db.updateJoinedPlayer(jp.id, {
        kills,
        winAmount: totalReward,
        isWinner
      });

      const user = db.getUserById(jp.userId);
      if (user) {
        const currentWin = Number(user.winBalance) || 0;
        const newWin = currentWin + totalReward;
        const updatedEarnings = (Number(user.totalEarning) || 0) + totalReward;
        const updatedMatches = (Number(user.matchesPlayed) || 0) + 1;
        const updatedKills = (Number(user.totalKills) || 0) + kills;

        await db.updateUser(user.id, {
          winBalance: newWin,
          totalKills: updatedKills,
          totalEarning: updatedEarnings,
          matchesPlayed: updatedMatches
        });

        if (killReward > 0) {
          await db.createTransaction({
            id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 5),
            userId: user.id,
            type: 'credit',
            walletType: 'win',
            amount: killReward,
            newBalance: (Number(user.depositBalance) || 0) + currentWin + killReward,
            date: dateFormatted,
            txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
            description: `Kill Reward (${kills} kills @ ₹${perKillRate}/kill) in ${tournament.title} ${tournament.matchId}`,
            createdAt: now.toISOString()
          });
        }

        if (winnerReward > 0) {
          await db.createTransaction({
            id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 5),
            userId: user.id,
            type: 'credit',
            walletType: 'win',
            amount: winnerReward,
            newBalance: (Number(user.depositBalance) || 0) + newWin,
            date: dateFormatted,
            txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
            description: `Winner Prize in ${tournament.title} ${tournament.matchId}`,
            createdAt: now.toISOString()
          });
        }
      }
    }

    // Mark tournament completed
    await db.updateTournament(tournamentId, { status: 'COMPLETED' });
    db.saveLocal();

    return res.json({ message: 'Match settled! Account money and player stats updated successfully in backend.' });
  } catch (error) {
    console.error('Settle match error:', error);
    return res.status(500).json({ error: 'Failed to settle match.' });
  }
});

// Admin: Get all Deposits
app.get('/api/admin/deposits', requireAdmin, (req, res) => {
  return res.json(db.getDepositRequests());
});

// Admin: Verify Deposit
app.post('/api/admin/deposits/:id/verify', requireAdmin, async (req, res) => {
  try {
    const { action, adminNote } = req.body;
    const deposit = db.data.deposit_requests.find(d => d.id === req.params.id);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit request not found.' });
    }

    if (deposit.status !== 'PENDING') {
      return res.status(400).json({ error: `Deposit is already ${deposit.status}.` });
    }

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (action === 'APPROVE') {
      const user = db.getUserById(deposit.userId);
      if (!user) {
        return res.status(404).json({ error: 'Associated user not found.' });
      }

      const newDepositBal = (Number(user.depositBalance) || 0) + Number(deposit.amount);
      await db.updateUser(user.id, { depositBalance: newDepositBal });

      await db.updateDepositRequest(deposit.id, {
        status: 'APPROVED',
        adminNote: adminNote || 'Deposit verified and approved',
        processedAt: now.toISOString()
      });

      await db.createTransaction({
        id: 'tx_' + Date.now(),
        userId: user.id,
        type: 'credit',
        walletType: 'deposit',
        amount: Number(deposit.amount),
        newBalance: newDepositBal + (Number(user.winBalance) || 0),
        date: dateFormatted,
        txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
        description: `Deposit Approved via UTR: ${deposit.utrNumber}`,
        createdAt: now.toISOString()
      });

      return res.json({ message: `Deposit of ₹${deposit.amount} approved and credited to ${user.username}.` });
    } else {
      await db.updateDepositRequest(deposit.id, {
        status: 'REJECTED',
        adminNote: adminNote || 'UTR verification failed or duplicate transaction ID.',
        processedAt: now.toISOString()
      });
      return res.json({ message: 'Deposit request rejected.' });
    }
  } catch (error) {
    console.error('Verify deposit error:', error);
    return res.status(500).json({ error: 'Failed to verify deposit.' });
  }
});

// Admin: Get all Withdrawals
app.get('/api/admin/withdrawals', requireAdmin, (req, res) => {
  return res.json(db.getWithdrawalRequests());
});

// Admin: Verify Withdrawal
app.post('/api/admin/withdrawals/:id/verify', requireAdmin, async (req, res) => {
  try {
    const { action, adminNote } = req.body;
    const withdrawal = db.data.withdrawal_requests.find(w => w.id === req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found.' });
    }

    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({ error: `Withdrawal request is already ${withdrawal.status}.` });
    }

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (action === 'APPROVE') {
      await db.updateWithdrawalRequest(withdrawal.id, {
        status: 'APPROVED',
        adminNote: adminNote || 'Transferred to UPI successfully',
        processedAt: now.toISOString()
      });
      return res.json({ message: `Withdrawal of ₹${withdrawal.amount} marked as Paid/Approved.` });
    } else {
      const user = db.getUserById(withdrawal.userId);
      if (user) {
        const refundedWinBal = (Number(user.winBalance) || 0) + Number(withdrawal.amount);
        await db.updateUser(user.id, { winBalance: refundedWinBal });

        await db.createTransaction({
          id: 'tx_' + Date.now(),
          userId: user.id,
          type: 'credit',
          walletType: 'win',
          amount: Number(withdrawal.amount),
          newBalance: (Number(user.depositBalance) || 0) + refundedWinBal,
          date: dateFormatted,
          txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
          description: `Withdrawal Refund: ${adminNote || 'Payment failed or incorrect UPI details'}`,
          createdAt: now.toISOString()
        });
      }

      await db.updateWithdrawalRequest(withdrawal.id, {
        status: 'REJECTED',
        adminNote: adminNote || 'Rejected by Admin. Amount refunded to Win Balance.',
        processedAt: now.toISOString()
      });

      return res.json({ message: `Withdrawal rejected and ₹${withdrawal.amount} refunded back to player.` });
    }
  } catch (error) {
    console.error('Verify withdrawal error:', error);
    return res.status(500).json({ error: 'Failed to verify withdrawal.' });
  }
});

// Admin: Users List
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = db.getUsers().map(u => {
    const { passwordHash: _, ...safe } = u;
    const joined = db.getJoinedMatchesByUser(u.id);
    return {
      ...safe,
      isBanned: Boolean(u.isBanned),
      banReason: u.banReason || '',
      matchesPlayed: Math.max(joined.length, Number(u.matchesPlayed) || 0),
      totalKills: Math.max(
        joined.reduce((s, j) => s + (Number(j.kills) || 0), 0),
        Number(u.totalKills) || 0
      ),
      totalEarning: Math.max(
        joined.reduce((s, j) => s + (Number(j.winAmount) || 0), 0),
        Number(u.totalEarning) || 0
      )
    };
  });
  return res.json(users);
});

// Admin: Ban Player (Anti-Cheat & Hacker Protection)
app.post('/api/admin/users/:id/ban', requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Player account not found.' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot ban an admin account.' });
    }

    const banReasonText = reason ? reason.trim() : 'Violation of Fair Play & Anti-Cheat rules (Suspected Hacking/Teaming)';
    const updated = await db.banUser(user.id, banReasonText);

    return res.json({
      message: `Player ${user.username} has been BANNED successfully! Their access is blocked.`,
      user: updated
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to ban player.' });
  }
});

// Admin: Unban Player
app.post('/api/admin/users/:id/unban', requireAdmin, async (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Player account not found.' });
    }

    const updated = await db.unbanUser(user.id);
    return res.json({
      message: `Player ${user.username} has been UNBANNED and can now log in.`,
      user: updated
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to unban player.' });
  }
});

// Admin: Update Tournament Notice / Post-Match Announcement
app.put('/api/admin/tournaments/:id/notice', requireAdmin, async (req, res) => {
  try {
    const { noticeMsg } = req.body;
    const updated = await db.updateTournament(req.params.id, {
      noticeMsg: noticeMsg ? noticeMsg.trim() : ''
    });
    if (!updated) {
      return res.status(404).json({ error: 'Tournament not found.' });
    }
    return res.json({ message: 'Tournament announcement notice updated!', tournament: updated });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update tournament notice.' });
  }
});

// Admin: Manual Balance Adjustment
app.post('/api/admin/users/:id/adjust-balance', requireAdmin, (req, res) => {
  try {
    const { depositAdjustment, winAdjustment, note } = req.body;
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const newDep = Math.max(0, (Number(user.depositBalance) || 0) + (Number(depositAdjustment) || 0));
    const newWin = Math.max(0, (Number(user.winBalance) || 0) + (Number(winAdjustment) || 0));

    db.updateUser(user.id, {
      depositBalance: newDep,
      winBalance: newWin
    });

    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    db.createTransaction({
      id: 'tx_' + Date.now(),
      userId: user.id,
      type: 'credit',
      walletType: 'adjustment',
      amount: (Number(depositAdjustment) || 0) + (Number(winAdjustment) || 0),
      newBalance: newDep + newWin,
      date: dateFormatted,
      txId: Math.floor(1000000 + Math.random() * 9000000).toString(),
      description: `Admin Balance Adjustment: ${note || 'Manual change'}`,
      createdAt: now.toISOString()
    });

    return res.json({ message: 'User balance updated successfully.', depositBalance: newDep, winBalance: newWin });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to adjust balance.' });
  }
});

// Admin: Financial Stats & Donut Accounting (Today, 2 Days, 7 Days, 30 Days, All)
app.get('/api/admin/financial-stats', requireAdmin, (req, res) => {
  const period = req.query.period || 'today';
  const stats = db.getFinancialStats(period);
  return res.json(stats);
});

// Admin: Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  return res.json(db.getAdminSettings());
});

app.put('/api/admin/settings', requireAdmin, (req, res) => {
  const updated = db.updateSettings(req.body);
  return res.json({ message: 'Settings updated successfully!', settings: updated });
});

app.post('/api/admin/upload-qr', requireAdmin, upload.single('qrImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select an image file to upload.' });
    }
    const mime = req.file.mimetype || 'image/jpeg';
    const base64Data = req.file.buffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64Data}`;

    try {
      const publicPath = path.join(__dirname, '../public/phonepe-qr.jpg');
      fs.writeFileSync(publicPath, req.file.buffer);
    } catch (e) {
      console.warn('Notice: writing to public folder:', e.message);
    }

    db.updateSettings({ upiQrImage: dataUri });
    return res.json({ message: 'QR Code updated successfully!', upiQrImage: dataUri });
  } catch (error) {
    console.error('QR upload error:', error);
    return res.status(500).json({ error: 'Failed to upload QR Code.' });
  }
});

// Hard block /admin paths at the HTTP server level -> redirect to home page immediately
app.get(['/admin', '/admin/*', '/admin-portal', '/admin-portal/*'], (req, res) => {
  return res.redirect('/');
});

// Universal API 404 JSON Handler (Prevents default Express HTML stack leak)
app.all(['/api', '/api/*'], (req, res) => {
  return res.status(404).json({
    error: 'Requested API endpoint not found.',
    status: 404
  });
});

// Universal Error Handler (Hides server stack traces)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  if (res.headersSent) return next(err);
  return res.status(500).json({
    error: 'An internal server error occurred. Please try again later.'
  });
});

// Serve frontend build if exists (for standalone / Render mode)
if (!process.env.VERCEL) {
  const CLIENT_BUILD = path.join(__dirname, '../dist');
  if (fs.existsSync(CLIENT_BUILD)) {
    app.use(express.static(CLIENT_BUILD));
    app.get('*', (req, res) => {
      res.sendFile(path.join(CLIENT_BUILD, 'index.html'));
    });
  }

  // Start Server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RushX Server running on http://localhost:${PORT}`);
    console.log(`📱 Local Network Phone Access: http://192.168.29.71:${PORT}`);
  });
}

export default app;
export { app };
