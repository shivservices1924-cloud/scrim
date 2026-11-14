import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, User, ArrowRight, AlertCircle, Key, CheckCircle, X } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = '/control-room-777';
  const { adminLogin } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password Reset Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await adminLogin(username.trim(), password);
      navigate(basePath);
    } catch (err) {
      setError(err.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');

    if (newPassword.length < 6) {
      setResetError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('New password and confirmation do not match.');
      return;
    }

    try {
      setResetLoading(true);
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          masterRecoveryKey: recoveryKey.trim(),
          newPassword: newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed.');
      }

      setResetSuccess(data.message || 'Password successfully reset!');
      setPassword(newPassword);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSuccess('');
        setRecoveryKey('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      setResetError(err.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030610] text-white flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full">
        {/* Isolated Branding Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-amber-400 p-1 mx-auto mb-3 shadow-xl shadow-amber-500/25 flex items-center justify-center overflow-hidden">
            <img src="/app-logo.png" alt="RushX Admin Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="font-heading font-black text-2xl tracking-wider text-white">
            RUSHX ADMIN CONSOLE
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Management Portal • Authorized Personnel Only
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#0b1326] border border-blue-900/60 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          {error && (
            <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resetSuccess && !showResetModal && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{resetSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#070c18] border border-blue-900 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Master Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetError('');
                    setResetSuccess('');
                    setShowResetModal(true);
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter master password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#070c18] border border-blue-900 focus:border-amber-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? 'Authenticating...' : 'Enter Admin Console'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <Key className="w-3 h-3 text-slate-400" />
              Secured with End-to-End Encryption & Supabase Auth
            </span>
          </div>
        </div>
      </div>

      {/* Master Recovery Key Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c152a] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Key className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base">
                    Master Password Reset
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Use your platform Master Security Recovery Key
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resetError && (
              <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 text-[11px] text-blue-200">
              Enter the platform Master Security Recovery Key configured in your server environment variables.
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Master Security Recovery Key <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Master Recovery Key"
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                  className="w-full bg-[#070d1a] border border-blue-900 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Admin Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#070d1a] border border-blue-900 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm New Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#070d1a] border border-blue-900 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white rounded-xl text-xs font-heading font-bold shadow-lg shadow-red-600/30 flex items-center justify-center gap-1.5"
                >
                  {resetLoading ? 'Resetting...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}