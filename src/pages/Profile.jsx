import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Wallet,
  BarChart2,
  Trophy,
  Bell,
  Headphones,
  ShieldAlert,
  ChevronRight,
  LogOut,
  Edit2,
  Check,
  ShieldCheck,
  Lock,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import { GAMING_AVATARS, getUserAvatar } from '../utils/avatar';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, refreshUser } = useAuth();

  const [editingProfile, setEditingProfile] = useState(false);
  const [selectingAvatar, setSelectingAvatar] = useState(false);
  const [ffIgn, setFfIgn] = useState(user?.ffIgn || '');
  const [ffUid, setFfUid] = useState(user?.ffUid || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || getUserAvatar(user));
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

  const matchesPlayed = user?.matchesPlayed ?? 0;
  const totalKills = user?.totalKills ?? 0;
  const totalEarning = user?.totalEarning ?? 0;
  const currentAvatar = selectedAvatar || getUserAvatar(user);

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-slate-100">
      <SEO
        title="Player Profile & Menu"
        description="View and update your Free Fire IGN, game UID, match statistics, and wallet balance on RushX Esports."
        path="/profile"
      />

      {/* Header matching Logo Obsidian & Purple Neon Aesthetic */}
      <div className="bg-[#0f0422] border-b border-purple-900/60 text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to home"
          className="text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-300 to-amber-300">
          Player Menu & Profile
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Avatar & Username Section */}
        <div className="text-center pt-3 pb-2">
          {/* Avatar with purple neon glowing ring */}
          <div className="relative inline-block group">
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-amber-400 p-1 shadow-xl shadow-purple-950/60 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d021a] rounded-full overflow-hidden flex items-center justify-center border-2 border-purple-400/40">
                <img
                  src={currentAvatar}
                  alt={user?.username || 'Player Avatar'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Change Avatar Button Pill */}
            <button
              onClick={() => setSelectingAvatar(!selectingAvatar)}
              className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold px-2 py-1 rounded-full border border-purple-300 shadow-md flex items-center gap-1 active:scale-95 transition-transform"
              title="Change Gaming Avatar"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Change</span>
            </button>
          </div>

          {/* Username */}
          <h2 className="font-heading font-black text-2xl mt-3 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-200">
            {user ? user.username : 'Guest Player'}
          </h2>

          {user && (
            <p className="text-xs text-purple-300/80 font-medium mt-0.5">
              FF IGN: <span className="text-white font-bold">{user.ffIgn || 'Not set'}</span> • UID: <span className="text-amber-400 font-mono">{user.ffUid || 'Not set'}</span>
            </p>
          )}
        </div>

        {/* Avatar Picker Modal / Section */}
        {selectingAvatar && (
          <div className="bg-[#120524] rounded-2xl p-4 border border-purple-500/50 shadow-xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Your Gaming Avatar
              </span>
              <button
                onClick={() => setSelectingAvatar(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {GAMING_AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => handleSelectAvatar(av.path)}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1.5 border transition-all ${
                    currentAvatar === av.path
                      ? 'bg-purple-900/60 border-amber-400 shadow-lg shadow-purple-900/50 scale-105'
                      : 'bg-[#180930] border-purple-900/40 hover:border-purple-500 hover:scale-102'
                  }`}
                >
                  <img src={av.path} alt={av.name} className="w-14 h-14 rounded-full object-cover" />
                  <span className="text-[10.5px] font-bold text-slate-300 text-center leading-tight">
                    {av.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3 Stats Counters in Purple Obsidian Card Row */}
        <div className="bg-[#120524] rounded-2xl p-4 shadow-xl border border-purple-900/50 grid grid-cols-3 divide-x divide-purple-900/50 text-center">
          {/* Matches Played */}
          <div className="flex flex-col items-center px-1">
            <span className="font-heading font-black text-2xl text-purple-400">
              {matchesPlayed}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Matches Played
            </span>
          </div>

          {/* Total Kills */}
          <div className="flex flex-col items-center px-1">
            <span className="font-heading font-black text-2xl text-fuchsia-400">
              {totalKills}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Total Kills
            </span>
          </div>

          {/* Total Earning */}
          <div className="flex flex-col items-center px-1">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                ₹
              </div>
              <span className="font-heading font-black text-2xl text-amber-400">
                {totalEarning}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Total Earning
            </span>
          </div>
        </div>

        {msg && (
          <div className="bg-emerald-950/80 text-emerald-200 text-xs font-bold p-3 rounded-xl border border-emerald-500/50 shadow flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {/* Edit Profile Form */}
        {editingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-[#120524] rounded-2xl p-4 shadow-xl border border-purple-500/50 space-y-3 animate-fadeIn"
          >
            <h3 className="font-heading font-bold text-sm text-purple-200 uppercase tracking-wider">
              Update Free Fire In-Game Details
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
                className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Free Fire Character / Game UID
              </label>
              <input
                type="text"
                required
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91..."
                className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-bold text-xs tracking-wider shadow-md"
              >
                {saving ? 'Saving...' : 'Save In-Game Details'}
              </button>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="py-2.5 px-4 rounded-xl bg-[#1b0833] hover:bg-[#250b45] text-slate-300 text-xs font-bold border border-purple-900"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Action Menu List */}
        <div className="bg-[#120524] rounded-2xl shadow-xl border border-purple-900/50 divide-y divide-purple-900/40 overflow-hidden">
          {/* Edit In-Game Profile */}
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Edit2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Edit Game Details & IGN
                </span>
                <span className="text-[11px] text-slate-400">
                  Update your Free Fire IGN & UID
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Change Avatar */}
          <button
            onClick={() => setSelectingAvatar(!selectingAvatar)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-fuchsia-900/40 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Select Gaming Avatar
                </span>
                <span className="text-[11px] text-slate-400">
                  Choose from 6 Free Fire badge avatars
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Wallet / Add Money */}
          <button
            onClick={() => navigate('/wallet')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Wallet & Payouts
                </span>
                <span className="text-[11px] text-slate-400">
                  Deposit money, view win balance & withdraw
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* My Matches */}
          <button
            onClick={() => navigate('/my-matches')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-blue-300">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  My Registered Matches
                </span>
                <span className="text-[11px] text-slate-400">
                  View room ID, pass & ongoing matches
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Tournament Leaderboard
                </span>
                <span className="text-[11px] text-slate-400">
                  Top kill leaders & champion rankings
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Anti-Cheat & Rules */}
          <button
            onClick={() => navigate('/rules')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Rules & Fair Play
                </span>
                <span className="text-[11px] text-slate-400">
                  Banned weapons, emulator policy & penalties
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* 24/7 Support Desk */}
          <button
            onClick={() => navigate('/contact')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-950/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-900/40 border border-pink-500/30 flex items-center justify-center text-pink-300">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">
                  Customer Support Desk
                </span>
                <span className="text-[11px] text-slate-400">
                  WhatsApp, Telegram, YouTube & Email help
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </button>

          {/* Logout Button */}
          {user && (
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-red-950/30 transition-colors text-red-400"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold">
                  Logout Account
                </span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
