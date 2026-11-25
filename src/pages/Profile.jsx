import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Wallet,
  Trophy,
  ChevronRight,
  LogOut,
  Edit2,
  Check,
  Sparkles,
  ShieldAlert,
  Flame,
  Crosshair,
  Award,
  Settings,
  Share2,
  Download,
  HelpCircle,
  FileText,
  Bell,
  Volume2,
  Lock,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { GAMING_AVATARS, getUserAvatar, getPlayerAvatar } from '../utils/avatar';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState('STATS'); // 'STATS' or 'MATCHES'
  const [editingProfile, setEditingProfile] = useState(false);
  const [selectingAvatar, setSelectingAvatar] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Settings state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const [ffIgn, setFfIgn] = useState(user?.ffIgn || '');
  const [ffUid, setFfUid] = useState(user?.ffUid || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || getUserAvatar(user));
  const [recentMatches, setRecentMatches] = useState([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFfIgn(user.ffIgn || '');
      setFfUid(user.ffUid || '');
      setPhone(user.phone || '');
      setSelectedAvatar(user.avatar || getUserAvatar(user));
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/my-matches', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecentMatches(data.slice(0, 5));
        }
      })
      .catch(() => {});
  }, [token]);

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ffIgn, ffUid, phone, avatar: selectedAvatar })
      });
      if (res.ok) {
        setMsg('Profile & Avatar updated successfully!');
        setTimeout(() => setMsg(''), 3000);
        setEditingProfile(false);
        setSelectingAvatar(false);
        refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAvatar = async (avatarPath) => {
    setSelectedAvatar(avatarPath);
    if (!token) return;
    try {
      setSaving(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: avatarPath })
      });
      if (res.ok) {
        setMsg('Gaming Avatar updated!');
        setTimeout(() => setMsg(''), 2500);
        setSelectingAvatar(false);
        refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Please fill in both password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    try {
      setChangingPassword(true);
      setPasswordMsg({ type: '', text: '' });
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ type: 'success', text: data.message || 'Password changed successfully!' });
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => setPasswordMsg({ type: '', text: '' }), 3000);
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'Network error. Try again.' });
    } finally {
      setChangingPassword(false);
    }
  };

  const matchesPlayed = user?.matchesPlayed ?? 0;
  const totalKills = user?.totalKills ?? 0;
  const totalEarning = user?.totalEarning ?? 0;
  const currentAvatar = selectedAvatar || getUserAvatar(user);

  // Approximate win rate
  const winRate = matchesPlayed > 0 ? Math.min(100, Math.round((totalEarning > 0 ? (totalKills * 15) / matchesPlayed : 10))) : 0;

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Player Profile • RushX Esports"
        description="View your match statistics, Free Fire credentials, settings, and recent match results."
        path="/profile"
      />

      {/* Screen 10 Header with Settings Icon */}
      <div className="bg-[#0b0e14]/95 border-b border-[#1f2738] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to home"
          className="text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading font-black text-lg tracking-wider text-white">
          Profile
        </h1>
        <button
          onClick={() => setShowSettingsModal(true)}
          aria-label="Settings"
          className="w-8 h-8 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-slate-300 hover:text-[#F5C400] transition-colors"
          title="App Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Toast Message */}
      {msg && (
        <div className="mx-4 mt-3 bg-emerald-950/90 border border-emerald-500/80 p-3 rounded-xl text-emerald-200 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>✅</span>
          <span>{msg}</span>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Profile Card Header (Screen 10) */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 flex items-center gap-4 shadow-xl">
          <div className="relative">
            <div className="w-18 h-18 rounded-full border-2 border-[#F5C400] p-0.5 bg-black shadow-lg">
              <img
                src={currentAvatar}
                alt={user?.username || 'Avatar'}
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <button
              onClick={() => setSelectingAvatar(!selectingAvatar)}
              className="absolute -bottom-1 -right-1 bg-[#F5C400] text-black p-1 rounded-full shadow hover:scale-110 transition-transform"
              title="Change Avatar"
            >
              <Sparkles className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1">
            <h2 className="font-heading font-black text-lg text-white tracking-wide">
              {user?.username?.toUpperCase() || 'PLAYER'}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              ID: {user?.ffUid || user?.id?.substring(0, 8) || '123456789'}
            </p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-[10px] font-heading font-black bg-[#F5C400]/20 text-[#F5C400] border border-[#F5C400]/40 px-2 py-0.5 rounded-full uppercase">
                {user?.ffIgn ? `IGN: ${user.ffIgn}` : 'Bronze 1'}
              </span>
            </div>
          </div>
        </div>

        {/* Avatar Selector Grid */}
        {selectingAvatar && (
          <div className="bg-[#121620] border border-[#F5C400]/50 rounded-2xl p-4 space-y-2 animate-fadeIn shadow-2xl">
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-heading font-black text-xs text-[#F5C400] uppercase tracking-wider">
                Select Gaming Avatar
              </h3>
              <button
                onClick={() => setSelectingAvatar(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2 pt-1">
              {GAMING_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAvatar(av)}
                  className={`relative rounded-full p-0.5 border-2 transition-all ${
                    selectedAvatar === av ? 'border-[#F5C400] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={av} alt={`Avatar ${idx + 1}`} className="w-10 h-10 rounded-full object-cover bg-black" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab Toggle: Stats vs Matches */}
        <div className="grid grid-cols-2 gap-2 bg-[#121620] p-1.5 rounded-xl border border-[#1f2738]">
          <button
            onClick={() => setActiveTab('STATS')}
            className={`py-2 text-xs font-heading font-black rounded-lg transition-all ${
              activeTab === 'STATS'
                ? 'bg-[#F5C400] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('MATCHES')}
            className={`py-2 text-xs font-heading font-black rounded-lg transition-all ${
              activeTab === 'MATCHES'
                ? 'bg-[#F5C400] text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Matches
          </button>
        </div>

        {/* TAB 1: STATS */}
        {activeTab === 'STATS' && (
          <div className="space-y-4 animate-fadeIn">
            {/* 3-Column Stats Grid (Screen 10) */}
            <div className="bg-[#121620] rounded-2xl p-4 shadow-xl border border-[#1f2738] grid grid-cols-3 divide-x divide-[#1f2738] text-center">
              <div>
                <span className="font-heading font-black text-2xl text-white">
                  {matchesPlayed}
                </span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">
                  Total Matches
                </span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-[#F5C400]">
                  {winRate}%
                </span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">
                  Win Rate
                </span>
              </div>
              <div>
                <span className="font-heading font-black text-2xl text-emerald-400">
                  {totalKills}
                </span>
                <span className="text-[11px] text-slate-400 block font-semibold mt-0.5">
                  Total Kills
                </span>
              </div>
            </div>

            {/* Recent Matches Section (Screen 10) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-black text-sm text-white tracking-wide">
                  Recent Matches
                </h3>
                <Link
                  to="/my-matches"
                  className="text-xs text-[#F5C400] hover:text-[#FFD000] font-bold"
                >
                  View All
                </Link>
              </div>

              {recentMatches.length === 0 ? (
                <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-5 text-center text-xs text-slate-400">
                  No recent matches yet. Join an upcoming tournament!
                </div>
              ) : (
                <div className="space-y-2">
                  {recentMatches.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      onClick={() => navigate(`/contest/${m.id}`)}
                      className="bg-[#121620] border border-[#1f2738] hover:border-[#F5C400]/50 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                          <Trophy className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-heading font-black text-xs text-white">
                            {m.title}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            Time: {m.matchTime || 'Recent'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-heading font-black text-[#F5C400] block">
                          ₹{m.winPrize || m.prizePool}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {m.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MATCHES */}
        {activeTab === 'MATCHES' && (
          <div className="space-y-3 animate-fadeIn">
            {recentMatches.length === 0 ? (
              <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-8 text-center text-xs text-slate-400 space-y-2">
                <Trophy className="w-8 h-8 text-[#F5C400]/40 mx-auto" />
                <p className="font-bold text-white">No registered matches</p>
                <p>Register for Solo, Duo, or Clash Squad to view your match lobby.</p>
              </div>
            ) : (
              recentMatches.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="bg-[#121620] border border-[#1f2738] rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-heading font-black text-xs text-white">
                      {m.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Entry: ₹{m.entryFee} • Mode: {m.matchType || 'Solo'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/contest/${m.id}`)}
                    className="bg-[#F5C400] text-black font-heading font-black text-[11px] px-3 py-1.5 rounded-lg shadow uppercase"
                  >
                    View Lobby
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* COMPREHENSIVE PROFILE MENU BUTTONS (Reference-Matching) */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl divide-y divide-[#1f2738] overflow-hidden shadow-xl mt-4">
          {/* Settings & Security */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Settings & Security</span>
                <span className="text-[10px] text-slate-400">Notifications, sounds, change password</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Edit Game Details */}
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Edit Free Fire Details</span>
                <span className="text-[10px] text-slate-400">Update In-Game IGN & Game UID</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Wallet */}
          <button
            onClick={() => navigate('/wallet')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">My Wallet & Cash Payouts</span>
                <span className="text-[10px] text-slate-400">Deposit, withdraw, passbook transactions</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* My Matches / Joined Tournaments */}
          <button
            onClick={() => navigate('/my-matches')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">My Registered Matches</span>
                <span className="text-[10px] text-slate-400">Room ID & credentials, match schedule</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Refer & Earn */}
          <button
            onClick={() => navigate('/refer')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Refer & Earn Cash</span>
                <span className="text-[10px] text-slate-400">Earn bonus cash for every invited squad member</span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              ₹50 FREE
            </span>
          </button>

          {/* Download App APK */}
          <button
            onClick={() => navigate('/download')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Download Android App</span>
                <span className="text-[10px] text-slate-400">Install APK for instant match notifications</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Rules & Anti-Cheat */}
          <button
            onClick={() => navigate('/rules')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Tournament Rules & Anti-Cheat</span>
                <span className="text-[10px] text-slate-400">Bermuda map, gun restrictions, fairplay</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Helpdesk & Support */}
          <button
            onClick={() => navigate('/contact-us')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Customer Support & Helpdesk</span>
                <span className="text-[10px] text-slate-400">WhatsApp, Telegram, YouTube & Instagram</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Terms & Privacy */}
          <button
            onClick={() => setShowTermsModal(true)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b0e14] border border-[#1f2738] flex items-center justify-center text-[#F5C400]">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Terms & Fair Play Policies</span>
                <span className="text-[10px] text-slate-400">Player guidelines and legal policy</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Edit Profile Form */}
        {editingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#121620] rounded-2xl p-4 shadow-xl border border-[#F5C400]/40 space-y-3 animate-fadeIn"
          >
            <h3 className="font-heading font-black text-xs text-[#F5C400] uppercase tracking-wider">
              Update Free Fire Details
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Free Fire In-Game Name (IGN)
              </label>
              <input
                type="text"
                required
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#1f2738] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F5C400]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Free Fire Game UID
              </label>
              <input
                type="text"
                required
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#1f2738] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F5C400]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-xl bg-[#F5C400] text-black font-heading font-black text-xs tracking-wider"
              >
                {saving ? 'Saving...' : 'Save Details'}
              </button>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="py-2 px-4 rounded-xl bg-[#1a202e] text-slate-300 text-xs font-bold border border-[#1f2738]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full py-3 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-950/20 font-heading font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#121620] border-t sm:border border-[#1f2738] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2738]">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F5C400]" />
                <h3 className="font-heading font-black text-base text-white">App & Account Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-[#1a202e] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Preferences */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-[#F5C400] uppercase tracking-wider">
                App Preferences
              </h4>

              {/* Sound & Haptics Toggle */}
              <div className="bg-[#0b0e14] border border-[#1f2738] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Sound & Audio FX</span>
                    <span className="text-[10px] text-slate-400">Match click and win sounds</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    soundEnabled ? 'bg-[#F5C400]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications Toggle */}
              <div className="bg-[#0b0e14] border border-[#1f2738] rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Room ID Notifications</span>
                    <span className="text-[10px] text-slate-400">Alerts 10 mins before match start</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    notificationsEnabled ? 'bg-[#F5C400]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition-transform ${
                      notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Security: Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-3 pt-2">
              <h4 className="text-[11px] font-black text-[#F5C400] uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Change Password</span>
              </h4>

              {passwordMsg.text && (
                <div className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-300'
                    : 'bg-rose-950/80 border border-rose-500/80 text-rose-300'
                }`}>
                  <span>{passwordMsg.type === 'success' ? '✅' : '⚠️'}</span>
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C400]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F5C400]"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-2.5 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {changingPassword ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>

            {/* App Version Info */}
            <div className="pt-2 border-t border-[#1f2738] text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">
                RushX Esports Official App • v1.0.0
              </span>
              <span className="text-[9px] text-[#F5C400] font-bold block">
                FAIR PLAY & ANTI-CHEAT CERTIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TERMS & FAIR PLAY POLICIES MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#121620] border-t sm:border border-[#1f2738] rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2738]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F5C400]" />
                <h3 className="font-heading font-black text-base text-white">Terms & Fair Play Policies</h3>
              </div>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-[#1a202e] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1f2738] space-y-1">
                <h4 className="font-heading font-bold text-white text-xs">1. Fair Play & Anti-Cheat</h4>
                <p>Use of hacks, config files, third-party APKs, emulators, or teaming up is strictly prohibited and results in immediate permanent ban with forfeiture of balance.</p>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1f2738] space-y-1">
                <h4 className="font-heading font-bold text-white text-xs">2. Custom Room Access</h4>
                <p>Room ID and password are given only to joined players 10-15 minutes prior to match schedule. Sharing room credentials outside results in disqualification.</p>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1f2738] space-y-1">
                <h4 className="font-heading font-bold text-white text-xs">3. Deposits & Withdrawals</h4>
                <p>Withdrawals are processed directly to user verified UPI IDs. Minimum withdrawal ₹100, maximum ₹1000 per transaction (up to 2 withdrawals per day).</p>
              </div>
            </div>

            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1a202e] text-white font-heading font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
