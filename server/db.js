import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), 'rushx_data')
  : path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'rushx_db.json');
const SEED_FILE = path.join(__dirname, '../data/rushx_db.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  // Safe handling for serverless environments
  console.warn('Notice: DATA_DIR creation:', err.message);
}

const defaultAdminPasswordHash = bcrypt.hashSync('RushX#Ujjwal@2026Master!', 10);
const defaultDemoPasswordHash = bcrypt.hashSync('123456', 10);

const DEFAULT_SETTINGS = {
  id: 'default_settings',
  upiId: 'rushx.esports@upi',
  upiName: 'RushX Esports Official',
  upiQrImage: '/phonepe-qr.jpg',
  minDeposit: 50,
  maxDeposit: 500,
  minWithdrawal: 100,
  maxWithdrawal: 1000,
  maxWithdrawalsPerDay: 2,
  supportWhatsapp: '+91 7079789108',
  supportPhone: '7079789108',
  supportTelegram: '@RushXSupport',
  telegramUrl: 'https://t.me/RushXSupport',
  discordUrl: 'https://discord.gg/rushx',
  supportEmail: 'rushxsupportteam@gmail.com',
  whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb3RushXEsports',
  instagramUrl: 'https://www.instagram.com/rushx_scrim/',
  youtubeUrl: 'https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ',
  leaderboardVisible: true,
  tickerAnnouncement: '⚡ Welcome to RushX Esports! Verified Free Fire BR & CS Tournaments. Fair play guaranteed. Read rules before registering.',
  rulesNotice: '1. Map is strictly Bermuda. 2. Custom Room ID & Password unlocked for registered players 10-15m before match. 3. Deposit ₹50 - ₹500. Withdrawal ₹100 - ₹1000 from Win Balance (Max 2/day).',
  adminRecoveryKey: process.env.ADMIN_RECOVERY_KEY || null,
  appVersion: '1.0.0',
  minRequiredVersion: '1.0.0',
  forceUpdateEnabled: false,
  updateDownloadUrl: '/download',
  updateMessage: 'A new mandatory update is available with new tournaments and anti-cheat updates. Please update the app to continue playing!'
};

const DEFAULT_DATA = {
  users: [
    {
      id: 'usr_admin',
      username: 'rushx_ujjwal_admin',
      fullName: 'RushX Master Admin',
      email: 'admin@rushx.in',
      phone: '9580014807',
      passwordHash: defaultAdminPasswordHash,
      ffIgn: 'RushX_Admin',
      ffUid: '100000001',
      depositBalance: 0,
      winBalance: 0,
      totalEarning: 0,
      totalKills: 0,
      matchesPlayed: 0,
      referralCode: 'ADMIN777',
      referredBy: null,
      role: 'admin',
      createdAt: '2026-11-01T10:00:00Z',
      updatedAt: '2026-11-07T12:00:00Z'
    }
  ],
  tournaments: [],
  joined_players: [],
  transactions: [],
  deposit_requests: [],
  withdrawal_requests: [],
  settings: DEFAULT_SETTINGS
};

// Object mapper helpers strictly matching Supabase schemas (prevents schema cache errors!)
const toUserSnake = (u) => {
  let role = u.role || 'user';
  if (u.isBanned && role !== 'admin') {
    role = 'banned';
  }
  const passwordHash = u.password_hash || u.passwordHash || '';
  const fullName = u.full_name || u.fullName || u.username || '';
  const ffIgn = u.ff_ign || u.ffIgn || '';
  const ffUid = u.ff_uid || u.ffUid || '';
  const referralCode = u.referral_code || u.referralCode || null;
  const referredBy = u.referred_by || u.referredBy || null;
  const avatar = u.avatar || u.profilePic || u.profile_pic || null;

  return {
    id: String(u.id),
    username: String(u.username || '').trim(),
    full_name: fullName,
    email: String(u.email || '').trim().toLowerCase(),
    phone: String(u.phone || '').trim(),
    password_hash: passwordHash,
    ff_ign: ffIgn,
    ff_uid: ffUid,
    avatar: avatar,
    deposit_balance: Number(u.depositBalance ?? u.deposit_balance ?? 0),
    win_balance: Number(u.winBalance ?? u.win_balance ?? 0),
    total_earning: Number(u.totalEarning ?? u.total_earning ?? 0),
    total_kills: Number(u.totalKills ?? u.total_kills ?? 0),
    matches_played: Number(u.matchesPlayed ?? u.matches_played ?? 0),
    referral_code: referralCode,
    referred_by: referredBy,
    role: role,
    created_at: u.createdAt || u.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const toUserCamel = (u) => {
  const hash = u.password_hash || u.passwordHash || '';
  const fullName = u.full_name || u.fullName || u.username || '';
  const ffIgn = u.ff_ign || u.ffIgn || '';
  const ffUid = u.ff_uid || u.ffUid || '';
  const depBal = Number(u.deposit_balance ?? u.depositBalance ?? 0);
  const winBal = Number(u.win_balance ?? u.winBalance ?? 0);
  const totalEarn = Number(u.total_earning ?? u.totalEarning ?? 0);
  const totalKills = Number(u.total_kills ?? u.totalKills ?? 0);
  const matches = Number(u.matches_played ?? u.matchesPlayed ?? 0);
  const refCode = u.referral_code || u.referralCode || null;
  const refBy = u.referred_by || u.referredBy || null;
  const isBanned = u.role === 'banned' || Boolean(u.is_banned) || Boolean(u.isBanned);
  const role = u.role === 'admin' ? 'admin' : (isBanned ? 'banned' : (u.role || 'user'));

  let avatar = u.avatar || u.profilePic || u.profile_pic;
  if (!avatar) {
    let sum = 0;
    const str = String(u.id || u.username || 'rushx');
    for (let i = 0; i < str.length; i++) sum = (sum * 31 + str.charCodeAt(i)) >>> 0;
    avatar = `/avatars/avatar-${(sum % 6) + 1}.svg`;
  }

  return {
    id: String(u.id),
    username: u.username,
    fullName,
    full_name: fullName,
    email: u.email,
    phone: u.phone,
    passwordHash: hash,
    password_hash: hash,
    ffIgn,
    ff_ign: ffIgn,
    ffUid,
    ff_uid: ffUid,
    avatar,
    profilePic: avatar,
    depositBalance: depBal,
    deposit_balance: depBal,
    winBalance: winBal,
    win_balance: winBal,
    totalEarning: totalEarn,
    total_earning: totalEarn,
    totalKills,
    total_kills: totalKills,
    matchesPlayed: matches,
    matches_played: matches,
    referralCode: refCode,
    referral_code: refCode,
    referredBy: refBy,
    referred_by: refBy,
    role: role === 'banned' ? 'user' : role,
    isBanned,
    banReason: isBanned ? 'Account suspended by Admin for rule violation' : '',
    createdAt: u.created_at || u.createdAt || new Date().toISOString(),
    updatedAt: u.updated_at || u.updatedAt || new Date().toISOString()
  };
};

const toTournamentSnake = (t) => {
  // Store noticeMsg safely inside rules text so it survives in Supabase without non-existent schema column
  let combinedRules = t.rules || '';
  if (t.noticeMsg) {
    combinedRules = `${combinedRules.replace(/\[NOTICE:.*?\]/g, '')}\n[NOTICE:${t.noticeMsg}]`.trim();
  } else {
    combinedRules = combinedRules.replace(/\[NOTICE:.*?\]/g, '').trim();
  }

  return {
    id: t.id,
    match_id: t.matchId || t.match_id,
    title: t.title,
    game_type: t.gameType || t.game_type || 'BR',
    match_type: t.matchType || t.match_type || 'SOLO',
    category: t.category || 'BR_FULL_MAP',
    map: 'BERMUDA',
    match_time: t.matchTime || t.match_time,
    entry_fee: Number(t.entryFee ?? t.entry_fee ?? 0),
    per_kill: Number(t.perKill ?? t.per_kill ?? 0),
    prize_pool: Number(t.prizePool ?? t.prize_pool ?? 0),
    win_prize: Number(t.winPrize ?? t.win_prize ?? 0),
    total_spots: Number(t.totalSpots ?? t.total_spots ?? 48),
    joined_spots: Number(t.joinedSpots ?? t.joined_spots ?? 0),
    status: t.status || 'UPCOMING',
    room_id: t.roomId || t.room_id || '',
    room_password: t.roomPassword || t.room_password || '',
    rules: combinedRules,
    banner: t.banner || '',
    created_at: t.createdAt || t.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const toTournamentCamel = (t) => {
  let noticeMsg = '';
  let rules = t.rules || '';
  const match = rules.match(/\[NOTICE:(.*?)\]/);
  if (match) {
    noticeMsg = match[1];
    rules = rules.replace(/\[NOTICE:.*?\]/g, '').trim();
  }

  return {
    id: t.id,
    matchId: t.match_id,
    title: t.title,
    gameType: t.game_type,
    matchType: t.match_type,
    category: t.category,
    map: 'BERMUDA',
    matchTime: t.match_time,
    scheduledAt: t.scheduled_at || parseMatchTimeString(t.match_time),
    entryFee: Number(t.entry_fee),
    perKill: Number(t.per_kill) || 0,
    prizePool: Number(t.prize_pool) || 0,
    winPrize: Number(t.win_prize) || 0,
    totalSpots: Number(t.total_spots),
    joinedSpots: Number(t.joined_spots) || 0,
    status: t.status,
    roomId: t.room_id || '',
    roomPassword: t.room_password || '',
    rules: rules,
    banner: t.banner || '',
    noticeMsg: noticeMsg,
    createdAt: t.created_at,
    updatedAt: t.updated_at
  };
};

const toJoinedPlayerCamel = (j) => ({
  id: j.id,
  tournamentId: j.tournament_id,
  userId: j.user_id,
  username: j.username,
  ffIgn: j.ff_ign,
  ffUid: j.ff_uid,
  teammateIgn: j.teammate_ign || '',
  teammateUid: j.teammate_uid || '',
  kills: Number(j.kills) || 0,
  winAmount: Number(j.win_amount) || 0,
  joinedAt: j.joined_at
});

const toDepositCamel = (d) => ({
  id: d.id,
  userId: d.user_id,
  username: d.username,
  amount: Number(d.amount),
  utrNumber: d.utr_number,
  screenshotUrl: d.screenshot_url || '',
  status: d.status,
  adminNote: d.admin_note || '',
  createdAt: d.created_at,
  processedAt: d.processed_at
});

const toWithdrawalCamel = (w) => ({
  id: w.id,
  userId: w.user_id,
  username: w.username,
  amount: Number(w.amount),
  method: w.method || 'UPI',
  upiId: w.upi_id || '',
  accountDetails: w.account_details || '',
  status: w.status,
  adminNote: w.admin_note || '',
  createdAt: w.created_at,
  processedAt: w.processed_at
});

const toTransactionCamel = (tx) => ({
  id: tx.id,
  userId: tx.user_id,
  type: tx.type,
  walletType: tx.wallet_type,
  amount: Number(tx.amount),
  newBalance: Number(tx.new_balance),
  date: tx.date_formatted,
  txId: tx.tx_id,
  description: tx.description,
  createdAt: tx.created_at
});

// Helpers for Match Time and Auto-Expiry
export function parseMatchTimeString(str) {
  if (!str) return 0;
  const direct = new Date(str).getTime();
  if (!isNaN(direct) && str.includes('-') && str.includes(':')) {
    return direct;
  }

  const now = new Date();
  let baseDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const lower = str.toLowerCase();
  if (lower.includes('tomorrow')) {
    baseDate.setDate(baseDate.getDate() + 1);
  }

  const m = str.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (m) {
    let hours = parseInt(m[1], 10);
    const minutes = m[2] ? parseInt(m[2], 10) : 0;
    const meridian = m[3] ? m[3].toUpperCase() : null;

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate.getTime();
  }

  return 0;
}

export function getTournamentScheduledTime(t) {
  if (!t) return 0;
  if (t.scheduledAt) {
    const ts = new Date(t.scheduledAt).getTime();
    if (!isNaN(ts) && ts > 0) return ts;
  }
  return parseMatchTimeString(t.matchTime);
}

class Database {
  constructor() {
    this.data = null;
    this.supabaseReady = false;
    this.init();
  }

  async init() {
    // 1. Initialize local cache from DB_FILE or SEED_FILE
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else if (fs.existsSync(SEED_FILE)) {
        const raw = fs.readFileSync(SEED_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        this.saveLocal();
      } else {
        this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
        this.saveLocal();
      }
    } catch (err) {
      console.warn('DB cache init notice:', err.message);
      this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
      this.saveLocal();
    }

    // Normalize all user models in memory so both camelCase and snake_case properties are present
    if (this.data && Array.isArray(this.data.users)) {
      this.data.users = this.data.users.map(toUserCamel);
    }

    // Ensure complete settings defaults without leaking owner personal details
    this.data.settings = { ...DEFAULT_SETTINGS, ...this.data.settings };
    this.data.settings.upiQrImage = this.data.settings.upiQrImage || '/phonepe-qr.jpg';

    // 2. Connect and sync with Supabase
    this.initPromise = this.initSupabaseSync();

    // 3. Start auto status transition timer (Checks tournament times every 30s)
    if (!process.env.VERCEL) {
      setInterval(() => {
        this.checkAndTransitionTournamentStatuses();
      }, 30000);
    }
  }

  saveLocal() {
    try {
      const tempPath = DB_FILE + '.tmp';
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving local cache:', err);
    }
  }

  async initSupabaseSync() {
    try {
      // Parallel fast-sync with timeout guard (Prevents cold-start blocking or hang)
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase sync timeout')), 4000));
      
      const syncTask = Promise.all([
        supabase.from('tournaments').select('*'),
        supabase.from('users').select('*'),
        supabase.from('joined_players').select('*'),
        supabase.from('deposit_requests').select('*'),
        supabase.from('withdrawal_requests').select('*'),
        supabase.from('transactions').select('*')
      ]);

      const [
        { data: remoteTourneys },
        { data: remoteUsers },
        { data: remoteJoined },
        { data: remoteDeposits },
        { data: remoteWithdrawals },
        { data: remoteTx }
      ] = await Promise.race([syncTask, timeoutPromise]);

      if (remoteTourneys) {
        this.data.tournaments = remoteTourneys.map(toTournamentCamel);
      }

      if (remoteUsers) {
        const remoteMap = new Map();
        remoteUsers.forEach(ru => {
          remoteMap.set(ru.id, toUserCamel(ru));
        });

        const missingToUpsert = [];
        for (const localU of this.data.users) {
          if (!remoteMap.has(localU.id)) {
            missingToUpsert.push(toUserSnake(localU));
            remoteMap.set(localU.id, localU);
          } else {
            const remoteU = remoteMap.get(localU.id);
            const merged = {
              ...remoteU,
              ...localU,
              depositBalance: Math.max(Number(localU.depositBalance) || 0, Number(remoteU.depositBalance) || 0),
              winBalance: Math.max(Number(localU.winBalance) || 0, Number(remoteU.winBalance) || 0),
              isBanned: localU.isBanned || remoteU.isBanned,
              role: localU.role === 'admin' || remoteU.role === 'admin' ? 'admin' : (localU.isBanned || remoteU.isBanned ? 'banned' : 'user')
            };
            remoteMap.set(localU.id, merged);
          }
        }

        if (missingToUpsert.length > 0) {
          try {
            await supabase.from('users').upsert(missingToUpsert);
          } catch (e) {
            console.warn('Batch user upsert notice:', e.message);
          }
        }

        this.data.users = Array.from(remoteMap.values());
      }

      if (remoteJoined) this.data.joined_players = remoteJoined.map(toJoinedPlayerCamel);
      if (remoteDeposits) this.data.deposit_requests = remoteDeposits.map(toDepositCamel);
      if (remoteWithdrawals) this.data.withdrawal_requests = remoteWithdrawals.map(toWithdrawalCamel);
      if (remoteTx) this.data.transactions = remoteTx.map(toTransactionCamel);

      this.saveLocal();
      this.supabaseReady = true;
      console.log('✅ Supabase synchronization active for RushX! Users synced:', this.data.users.length, 'Tournaments:', this.data.tournaments.length);
    } catch (err) {
      console.error('Supabase initial sync warning (using local fallback):', err.message);
    }
  }

  /**
   * Automatic Tournament Lifecycle Transition:
   * "isse phle jab bhi koi tournament ka time ho to wo ongoing me chala jaye
   *  aur jb mai usme sb kuch updtae kr du to wo complate section me chla jaye"
   */
  async checkAndTransitionTournamentStatuses() {
    const now = Date.now();
    let updatedAny = false;

    for (const t of this.data.tournaments) {
      if (t.status === 'UPCOMING') {
        const schedTime = getTournamentScheduledTime(t);
        const hasTimePassed = schedTime > 0 && schedTime <= now;

        if (hasTimePassed) {
          const newStatus = (Number(t.joinedSpots) || 0) > 0 ? 'ONGOING' : 'EXPIRED';
          console.log(`⏱️ Tournament time reached (${t.matchTime})! Moving ${t.title} (${t.matchId}) to ${newStatus}.`);
          t.status = newStatus;
          updatedAny = true;

          supabase.from('tournaments').update({ status: newStatus }).eq('id', t.id).then();
        } else if (t.roomId && t.roomPassword) {
          t.status = 'ONGOING';
          updatedAny = true;
          supabase.from('tournaments').update({ status: 'ONGOING' }).eq('id', t.id).then();
        }
      }
    }

    if (updatedAny) {
      this.saveLocal();
    }
  }

  // Users
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u.id === id); }
  getUserByUsername(username) {
    if (!username || typeof username !== 'string') return null;
    return this.data.users.find(u => u.username && u.username.toLowerCase() === username.trim().toLowerCase());
  }
  getUserByEmail(email) {
    if (!email || typeof email !== 'string') return null;
    return this.data.users.find(u => u.email && u.email.toLowerCase() === email.trim().toLowerCase());
  }
  getUserByPhone(phone) {
    if (!phone) return null;
    const clean = String(phone).replace(/\D/g, '');
    if (!clean) return null;
    return this.data.users.find(u => {
      if (!u.phone) return false;
      const uClean = String(u.phone).replace(/\D/g, '');
      return uClean === clean || (clean.length >= 10 && uClean.endsWith(clean.slice(-10)));
    });
  }
  getUserByFfUid(ffUid) {
    if (!ffUid) return null;
    const clean = String(ffUid).trim().toLowerCase();
    return this.data.users.find(u => u.ffUid && String(u.ffUid).trim().toLowerCase() === clean);
  }

  // Resilient multi-instance user finders that fall back to Supabase directly
  async findUserAsync(identifier) {
    if (!identifier || typeof identifier !== 'string') return null;
    const clean = identifier.trim().toLowerCase();
    const cleanDigits = clean.replace(/\D/g, '');

    // 1. Check local cache first
    let user = this.data.users.find(u =>
      (u.username && u.username.toLowerCase() === clean) ||
      (u.email && u.email.toLowerCase() === clean)
    );
    if (!user && cleanDigits) {
      user = this.data.users.find(u => {
        if (!u.phone) return false;
        const uClean = String(u.phone).replace(/\D/g, '');
        return uClean === cleanDigits || (cleanDigits.length >= 10 && uClean.endsWith(cleanDigits.slice(-10)));
      });
    }
    if (user) return toUserCamel(user);

    // 2. Query Supabase directly
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.${clean},email.ilike.${clean},phone.eq.${clean}`)
        .limit(1);

      if (!error && data && data.length > 0) {
        const fetchedUser = toUserCamel(data[0]);
        const existingIdx = this.data.users.findIndex(u => u.id === fetchedUser.id);
        if (existingIdx !== -1) {
          this.data.users[existingIdx] = fetchedUser;
        } else {
          this.data.users.push(fetchedUser);
        }
        this.saveLocal();
        return fetchedUser;
      }
    } catch (e) {
      console.warn('findUserAsync Supabase query notice:', e.message);
    }
    return null;
  }

  async findUserByIdAsync(id) {
    if (!id || typeof id !== 'string') return null;
    let user = this.getUserById(id);
    if (user) return toUserCamel(user);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .limit(1);

      if (!error && data && data.length > 0) {
        const fetchedUser = toUserCamel(data[0]);
        const existingIdx = this.data.users.findIndex(u => u.id === fetchedUser.id);
        if (existingIdx !== -1) {
          this.data.users[existingIdx] = fetchedUser;
        } else {
          this.data.users.push(fetchedUser);
        }
        this.saveLocal();
        return fetchedUser;
      }
    } catch (e) {
      console.warn('findUserByIdAsync Supabase notice:', e.message);
    }
    return null;
  }

  async isUsernameTakenAsync(username) {
    if (!username) return false;
    const clean = String(username).trim().toLowerCase();
    if (this.getUserByUsername(clean)) return true;
    try {
      const { data, error } = await supabase.from('users').select('id').ilike('username', clean).limit(1);
      return !error && data && data.length > 0;
    } catch (e) {
      return false;
    }
  }

  async isEmailTakenAsync(email) {
    if (!email) return false;
    const clean = String(email).trim().toLowerCase();
    if (this.getUserByEmail(clean)) return true;
    try {
      const { data, error } = await supabase.from('users').select('id').ilike('email', clean).limit(1);
      return !error && data && data.length > 0;
    } catch (e) {
      return false;
    }
  }

  async isPhoneTakenAsync(phone) {
    if (!phone) return false;
    const clean = String(phone).replace(/\D/g, '');
    if (!clean) return false;
    if (this.getUserByPhone(clean)) return true;
    try {
      const { data, error } = await supabase.from('users').select('id').eq('phone', clean).limit(1);
      return !error && data && data.length > 0;
    } catch (e) {
      return false;
    }
  }

  async createUser(userData) {
    const normalizedUser = toUserCamel(userData);
    const existingIdx = this.data.users.findIndex(
      u => u.id === normalizedUser.id || (u.username && u.username.toLowerCase() === normalizedUser.username.toLowerCase())
    );
    if (existingIdx !== -1) {
      this.data.users[existingIdx] = normalizedUser;
    } else {
      this.data.users.push(normalizedUser);
    }
    this.saveLocal();

    // Direct write to Supabase cloud
    try {
      const snake = toUserSnake(normalizedUser);
      const { error } = await supabase.from('users').upsert(snake);
      if (error) {
        console.error('Supabase user upsert error:', error.message, error.details);
      } else {
        console.log('✅ User successfully persisted in Supabase cloud:', normalizedUser.username);
      }
    } catch (e) {
      console.error('Supabase user insert exception:', e.message);
    }
    return normalizedUser;
  }

  async updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.data.users[idx] = toUserCamel({ ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() });
      this.saveLocal();

      // Direct write to Supabase using validated schema mapping
      try {
        const fullSnake = toUserSnake(this.data.users[idx]);
        const { error } = await supabase.from('users').upsert(fullSnake);
        if (error) {
          console.error('Supabase user update error:', error.message);
        }
      } catch (e) {
        console.error('Supabase user update exception:', e.message);
      }
      return this.data.users[idx];
    }
    return null;
  }

  async banUser(id, reason) {
    return this.updateUser(id, {
      isBanned: true,
      banReason: reason || 'Violation of Fair Play / Suspected Hacking'
    });
  }

  async unbanUser(id) {
    return this.updateUser(id, {
      isBanned: false,
      banReason: ''
    });
  }

  // Tournaments
  async syncTournamentsFromSupabase() {
    const now = Date.now();
    // Cache for 3 seconds to prevent excessive roundtrips, but stay ultra-fresh
    if (this._lastTourneySync && now - this._lastTourneySync < 3000) {
      this.checkAndTransitionTournamentStatuses();
      return this.data.tournaments;
    }
    this._lastTourneySync = now;

    try {
      const syncTask = supabase.from('tournaments').select('*').order('created_at', { ascending: false });
      const timeoutTask = new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timeout')), 3000));
      const { data: remoteTourneys, error } = await Promise.race([syncTask, timeoutTask]);

      if (!error && Array.isArray(remoteTourneys) && remoteTourneys.length > 0) {
        this.data.tournaments = remoteTourneys.map(toTournamentCamel);
        this.saveLocal();
      }
    } catch (err) {
      // Fallback seamlessly to in-memory cached tournaments
    }

    this.checkAndTransitionTournamentStatuses();
    return this.data.tournaments;
  }

  getTournaments() {
    this.checkAndTransitionTournamentStatuses();
    return this.data.tournaments;
  }
  getTournamentById(id) {
    this.checkAndTransitionTournamentStatuses();
    return this.data.tournaments.find(t => t.id === id);
  }

  async createTournament(tData) {
    this.data.tournaments.unshift(tData);
    this.saveLocal();

    // Await cloud insert with 3.5s timeout for serverless persistence
    try {
      const snake = toTournamentSnake(tData);
      const insertTask = supabase.from('tournaments').insert(snake);
      const timeoutTask = new Promise((_, reject) => setTimeout(() => reject(new Error('Insert timeout')), 3500));
      const { error } = await Promise.race([insertTask, timeoutTask]);
      if (error) {
        console.error('Supabase tournament insert error:', error.message);
      } else {
        console.log('✅ Tournament successfully saved in Supabase cloud:', tData.title);
      }
    } catch (e) {
      console.warn('Supabase tournament insert notice:', e.message);
    }
    return tData;
  }

  async updateTournament(id, updates) {
    const idx = this.data.tournaments.findIndex(t => t.id === id);
    if (idx !== -1) {
      this.data.tournaments[idx] = { ...this.data.tournaments[idx], ...updates };
      this.saveLocal();

      try {
        const fullSnake = toTournamentSnake(this.data.tournaments[idx]);
        const updateTask = supabase.from('tournaments').update(fullSnake).eq('id', id);
        const timeoutTask = new Promise((_, reject) => setTimeout(() => reject(new Error('Update timeout')), 3500));
        const { error } = await Promise.race([updateTask, timeoutTask]);
        if (error) {
          console.error('Supabase tournament update error:', error.message);
        } else {
          console.log('✅ Tournament updated in Supabase cloud:', id);
        }
      } catch (e) {
        console.warn('Supabase tournament update notice:', e.message);
      }
      return this.data.tournaments[idx];
    }
    return null;
  }

  async deleteTournament(id) {
    const idx = this.data.tournaments.findIndex(t => t.id === id);
    if (idx !== -1) {
      const removed = this.data.tournaments.splice(idx, 1)[0];
      this.data.joined_players = this.data.joined_players.filter(jp => jp.tournamentId !== id);
      this.saveLocal();

      try {
        await supabase.from('tournaments').delete().eq('id', id);
      } catch (e) {}
      return removed;
    }
    return null;
  }

  // Joined Players
  getJoinedPlayers(tournamentId) {
    return this.data.joined_players.filter(jp => jp.tournamentId === tournamentId);
  }
  getJoinedMatchesByUser(userId) {
    return this.data.joined_players.filter(jp => jp.userId === userId);
  }

  async joinTournament(joinData) {
    this.data.joined_players.push(joinData);
    const tournament = this.getTournamentById(joinData.tournamentId);
    if (tournament) {
      tournament.joinedSpots = (tournament.joinedSpots || 0) + 1;
      this.updateTournament(tournament.id, { joinedSpots: tournament.joinedSpots });
    }
    this.saveLocal();

    try {
      await supabase.from('joined_players').insert({
        id: joinData.id,
        tournament_id: joinData.tournamentId,
        user_id: joinData.userId,
        username: joinData.username,
        ff_ign: joinData.ffIgn,
        ff_uid: joinData.ffUid,
        teammate_ign: joinData.teammateIgn || '',
        teammate_uid: joinData.teammateUid || '',
        kills: 0,
        win_amount: 0,
        joined_at: joinData.joinedAt || new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase join insert error:', e.message);
    }
    return joinData;
  }

  async updateJoinedPlayer(id, updates) {
    const idx = this.data.joined_players.findIndex(jp => jp.id === id);
    if (idx !== -1) {
      this.data.joined_players[idx] = { ...this.data.joined_players[idx], ...updates };
      this.saveLocal();

      try {
        const snakeUpdates = {};
        if (updates.kills !== undefined) snakeUpdates.kills = updates.kills;
        if (updates.winAmount !== undefined) snakeUpdates.win_amount = updates.winAmount;
        await supabase.from('joined_players').update(snakeUpdates).eq('id', id);
      } catch (e) {}
      return this.data.joined_players[idx];
    }
    return null;
  }

  // Transactions
  getTransactions(userId) {
    if (userId) {
      return this.data.transactions
        .filter(t => t.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return this.data.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async createTransaction(txData) {
    this.data.transactions.unshift(txData);
    this.saveLocal();

    try {
      await supabase.from('transactions').insert({
        id: txData.id,
        user_id: txData.userId,
        type: txData.type,
        wallet_type: txData.walletType,
        amount: txData.amount,
        new_balance: txData.newBalance,
        date_formatted: txData.date,
        tx_id: txData.txId,
        description: txData.description,
        created_at: txData.createdAt || new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase transaction insert error:', e.message);
    }
    return txData;
  }

  // Deposits
  getDepositRequests(userId) {
    if (userId) {
      return this.data.deposit_requests
        .filter(d => d.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return this.data.deposit_requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async createDepositRequest(depData) {
    this.data.deposit_requests.unshift(depData);
    this.saveLocal();

    try {
      await supabase.from('deposit_requests').insert({
        id: depData.id,
        user_id: depData.userId,
        username: depData.username,
        amount: depData.amount,
        utr_number: depData.utrNumber,
        screenshot_url: depData.screenshotUrl || '',
        status: depData.status || 'PENDING',
        admin_note: depData.adminNote || '',
        created_at: depData.createdAt || new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase deposit insert error:', e.message);
    }
    return depData;
  }

  async updateDepositRequest(id, updates) {
    const idx = this.data.deposit_requests.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.data.deposit_requests[idx] = { ...this.data.deposit_requests[idx], ...updates };
      this.saveLocal();

      try {
        const snakeUpdates = {};
        if (updates.status !== undefined) snakeUpdates.status = updates.status;
        if (updates.adminNote !== undefined) snakeUpdates.admin_note = updates.adminNote;
        if (updates.processedAt !== undefined) snakeUpdates.processed_at = updates.processedAt;
        await supabase.from('deposit_requests').update(snakeUpdates).eq('id', id);
      } catch (e) {}
      return this.data.deposit_requests[idx];
    }
    return null;
  }

  // Withdrawals
  getWithdrawalRequests(userId) {
    if (userId) {
      return this.data.withdrawal_requests
        .filter(w => w.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return this.data.withdrawal_requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async createWithdrawalRequest(wData) {
    this.data.withdrawal_requests.unshift(wData);
    this.saveLocal();

    try {
      await supabase.from('withdrawal_requests').insert({
        id: wData.id,
        user_id: wData.userId,
        username: wData.username,
        amount: wData.amount,
        method: wData.method || 'UPI',
        upi_id: wData.upiId || '',
        account_details: wData.accountDetails || '',
        status: wData.status || 'PENDING',
        admin_note: wData.adminNote || '',
        created_at: wData.createdAt || new Date().toISOString()
      });
    } catch (e) {
      console.error('Supabase withdrawal insert error:', e.message);
    }
    return wData;
  }

  async updateWithdrawalRequest(id, updates) {
    const idx = this.data.withdrawal_requests.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.data.withdrawal_requests[idx] = { ...this.data.withdrawal_requests[idx], ...updates };
      this.saveLocal();

      try {
        const snakeUpdates = {};
        if (updates.status !== undefined) snakeUpdates.status = updates.status;
        if (updates.adminNote !== undefined) snakeUpdates.admin_note = updates.adminNote;
        if (updates.processedAt !== undefined) snakeUpdates.processed_at = updates.processedAt;
        await supabase.from('withdrawal_requests').update(snakeUpdates).eq('id', id);
      } catch (e) {}
      return this.data.withdrawal_requests[idx];
    }
    return null;
  }

  getTodayWithdrawalCount(userId) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.data.withdrawal_requests.filter(
      w => w.userId === userId && new Date(w.createdAt) >= oneDayAgo && w.status !== 'REJECTED'
    ).length;
  }

  // Settings
  getSettings() { return this.data.settings; }
  
  // Publicly exposed settings: Strictly sanitized (NO admin keys, NO owner full name / private PII)
  getPublicSettings() {
    const s = this.data.settings || DEFAULT_SETTINGS;
    return {
      tickerAnnouncement: s.tickerAnnouncement || '⚡ Welcome to RushX Esports! Verified Free Fire BR & CS Tournaments.',
      rulesNotice: s.rulesNotice || '',
      supportWhatsapp: s.supportWhatsapp || '+91 7079789108',
      supportPhone: s.supportPhone || '7079789108',
      supportTelegram: s.supportTelegram || '@RushXSupport',
      telegramUrl: s.telegramUrl || 'https://t.me/RushXSupport',
      discordUrl: s.discordUrl || 'https://discord.gg/rushx',
      supportEmail: s.supportEmail || 'rushxsupportteam@gmail.com',
      whatsappChannelUrl: s.whatsappChannelUrl || 'https://whatsapp.com/channel/0029Vb3RushXEsports',
      instagramUrl: s.instagramUrl || 'https://www.instagram.com/rushx_scrim/',
      youtubeUrl: s.youtubeUrl || 'https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ',
      leaderboardVisible: s.leaderboardVisible !== false,
      appVersion: s.appVersion || '1.0.0',
      minRequiredVersion: s.minRequiredVersion || '1.0.0',
      forceUpdateEnabled: Boolean(s.forceUpdateEnabled),
      updateDownloadUrl: s.updateDownloadUrl || '/download',
      updateMessage: s.updateMessage || ''
    };
  }

  // Deposit settings for authenticated players
  getDepositSettings() {
    const s = this.data.settings || DEFAULT_SETTINGS;
    return {
      upiId: s.upiId || 'rushx.esports@upi',
      upiName: s.upiName || 'RushX Esports Official',
      upiQrImage: s.upiQrImage || '/phonepe-qr.jpg',
      minDeposit: Number(s.minDeposit) || 50,
      maxDeposit: Number(s.maxDeposit) || 500
    };
  }

  // Admin settings for authenticated admins
  getAdminSettings() {
    const s = this.data.settings || DEFAULT_SETTINGS;
    return {
      ...s,
      adminRecoveryKey: s.adminRecoveryKey ? '••••••••' : ''
    };
  }

  async updateSettings(updates) {
    const safeUpdates = { ...updates };
    if (safeUpdates.adminRecoveryKey === '••••••••' || !safeUpdates.adminRecoveryKey) {
      delete safeUpdates.adminRecoveryKey;
    }
    this.data.settings = { ...this.data.settings, ...safeUpdates };
    this.saveLocal();

    try {
      await supabase.from('platform_settings').upsert({
        id: 'default_settings',
        upi_id: this.data.settings.upiId,
        upi_name: this.data.settings.upiName,
        upi_qr_image: this.data.settings.upiQrImage,
        min_deposit: this.data.settings.minDeposit,
        max_deposit: this.data.settings.maxDeposit || 500,
        min_withdrawal: this.data.settings.minWithdrawal,
        max_withdrawal: this.data.settings.maxWithdrawal || 1000,
        max_withdrawals_per_day: this.data.settings.maxWithdrawalsPerDay,
        support_whatsapp: this.data.settings.supportWhatsapp,
        support_telegram: this.data.settings.supportTelegram,
        telegram_url: this.data.settings.telegramUrl,
        discord_url: this.data.settings.discordUrl,
        support_email: this.data.settings.supportEmail,
        instagram_url: this.data.settings.instagramUrl,
        youtube_url: this.data.settings.youtubeUrl,
        ticker_announcement: this.data.settings.tickerAnnouncement,
        rules_notice: this.data.settings.rulesNotice,
        updated_at: new Date().toISOString()
      });
    } catch (e) {}
    return this.data.settings;
  }

  // Financial Stats & Donut Accounting Tracker
  getFinancialStats(period = 'today') {
    const now = Date.now();
    let startTime = 0;

    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startTime = today.getTime();
    } else if (period === '2days') {
      startTime = now - (2 * 24 * 60 * 60 * 1000);
    } else if (period === '7days') {
      startTime = now - (7 * 24 * 60 * 60 * 1000);
    } else if (period === '30days') {
      startTime = now - (30 * 24 * 60 * 60 * 1000);
    } else {
      startTime = 0; // All time
    }

    // 1. Entry fees collected from joined players
    const filteredJoined = this.data.joined_players.filter(jp => {
      const t = new Date(jp.joinedAt || 0).getTime();
      return startTime === 0 || t >= startTime;
    });

    let entryFeesCollected = 0;
    filteredJoined.forEach(jp => {
      const tourney = this.data.tournaments.find(t => t.id === jp.tournamentId);
      if (tourney && tourney.entryFee) {
        entryFeesCollected += Number(tourney.entryFee) || 0;
      }
    });

    // 2. Verified player deposits in period
    const filteredDeposits = this.data.deposit_requests.filter(d => {
      if (d.status !== 'APPROVED') return false;
      const t = new Date(d.processedAt || d.createdAt || 0).getTime();
      return startTime === 0 || t >= startTime;
    });
    const depositsApproved = filteredDeposits.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);

    // 3. Match prize money & kill earnings distributed
    let prizesDistributed = 0;
    filteredJoined.forEach(jp => {
      prizesDistributed += (Number(jp.winAmount) || 0);
    });

    const filteredTxWins = this.data.transactions.filter(tx => {
      if (tx.type !== 'credit') return false;
      if (!tx.description || (!tx.description.includes('Won') && !tx.description.includes('Kill') && !tx.description.includes('Match'))) return false;
      const t = new Date(tx.createdAt || 0).getTime();
      return startTime === 0 || t >= startTime;
    });
    const txWinTotal = filteredTxWins.reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);
    const totalPrizesDistributed = Math.max(prizesDistributed, txWinTotal);

    // 4. Approved player withdrawals paid out
    const filteredWithdrawals = this.data.withdrawal_requests.filter(w => {
      if (w.status !== 'APPROVED') return false;
      const t = new Date(w.processedAt || w.createdAt || 0).getTime();
      return startTime === 0 || t >= startTime;
    });
    const withdrawalsApproved = filteredWithdrawals.reduce((acc, w) => acc + (Number(w.amount) || 0), 0);

    // Comprehensive platform totals
    const totalMoneyIn = entryFeesCollected + depositsApproved;
    const totalMoneyOut = totalPrizesDistributed + withdrawalsApproved;
    const netProfit = totalMoneyIn - totalMoneyOut;
    const profitMargin = totalMoneyIn > 0 ? Math.round((netProfit / totalMoneyIn) * 100) : 0;

    const tournamentProfit = entryFeesCollected - totalPrizesDistributed;
    const tournamentMargin = entryFeesCollected > 0 ? Math.round((tournamentProfit / entryFeesCollected) * 100) : 0;

    return {
      period,
      startTime,
      totalMoneyIn,
      totalMoneyOut,
      netProfit,
      profitMargin,
      entryFeesCollected,
      prizesDistributed: totalPrizesDistributed,
      tournamentProfit,
      tournamentMargin,
      depositsApproved,
      withdrawalsApproved,
      joinedCount: filteredJoined.length,
      depositsCount: filteredDeposits.length,
      withdrawalsCount: filteredWithdrawals.length
    };
  }
}

export const db = new Database();
