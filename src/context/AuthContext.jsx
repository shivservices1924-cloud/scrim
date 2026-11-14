import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

async function safeJson(res, defaultMsg = 'Request failed') {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (text.includes('Tunnel Reminder') || text.includes('localtunnel')) {
      throw new Error('Localtunnel password required (49.36.209.123). Please open the link in browser once.');
    }
    if (res.status === 404) {
      throw new Error('API server endpoint not found (404). Please ensure the backend server is running.');
    }
    throw new Error(`Server returned non-JSON response (${res.status}). Please check network connection.`);
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || defaultMsg);
  }
  return data;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rushx_token') || null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('rushx_admin_token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount (supporting HttpOnly Cookie & Bearer Token)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/auth/me', {
          credentials: 'include',
          headers
        });

        if (res.ok) {
          const data = await safeJson(res, 'Token validation failed');
          setUser(data.user);
          if (data.token) {
            setToken(data.token);
          }
        } else {
          localStorage.removeItem('rushx_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Failed to verify session:', err.message);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [token]);

  // Check admin session
  useEffect(() => {
    if (adminToken) {
      try {
        const storedAdmin = localStorage.getItem('rushx_admin_user');
        if (storedAdmin) {
          setAdmin(JSON.parse(storedAdmin));
        }
      } catch (e) {
        localStorage.removeItem('rushx_admin_token');
        localStorage.removeItem('rushx_admin_user');
        setAdminToken(null);
        setAdmin(null);
      }
    }
  }, [adminToken]);

  const login = async (identifier, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await safeJson(res, 'Login failed');
    localStorage.setItem('rushx_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await safeJson(res, 'Registration failed');
    localStorage.setItem('rushx_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const adminLogin = async (username, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await safeJson(res, 'Admin login failed');
    localStorage.setItem('rushx_admin_token', data.token);
    localStorage.setItem('rushx_admin_user', JSON.stringify(data.admin));
    setAdminToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const refreshUser = async () => {
    try {
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers
      });
      if (res.ok) {
        const data = await safeJson(res, 'Failed to refresh');
        setUser(data.user);
      }
    } catch (e) {
      console.error('Error refreshing user:', e);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (e) {}
    localStorage.removeItem('rushx_token');
    setToken(null);
    setUser(null);
  };

  const adminLogout = () => {
    localStorage.removeItem('rushx_admin_token');
    localStorage.removeItem('rushx_admin_user');
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        token,
        adminToken,
        loading,
        login,
        register,
        adminLogin,
        logout,
        adminLogout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
