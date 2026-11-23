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
  Award
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

  const matchesPlayed = user?.matchesPlayed ?? 0;
  const totalKills = user?.totalKills ?? 0;
  const totalEarning = user?.totalEarning ?? 0;
  const currentAvatar = selectedAvatar || getUserAvatar(user);

  // Approximate win rate
  const winRate = matchesPlayed > 0 ? Math.min(100, Math.round((totalEarning > 0 ? (totalKills * 15) / matchesPlayed : 10))) : 0;
  const kdRatio = matchesPlayed > 0 ? (totalKills / matchesPlayed).toFixed(1) : '0.0';

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Player Profile • RushX Esports"
        description="View your match statistics, Free Fire credentials, and recent match results."
        path="/profile"
      />

      {/* Screen 10 Header */}
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
        <div className="w-6"></div>
      </div>

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
              className="absolute -bottom-1 -right-1 bg-[#F5C400] text-black p-1 rounded-full shadow"
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

        {/* Tab Toggle: Stats vs Matches (Strictly NO Achievements tab per request) */}
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

        {/* Quick Menu Actions */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl divide-y divide-[#1f2738] overflow-hidden shadow-xl mt-4">
          {/* Edit Game Details */}
          <button
            onClick={() => setEditingProfile(!editingProfile)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Edit2 className="w-4 h-4 text-[#F5C400]" />
              <span className="text-xs font-bold text-white">Edit In-Game Free Fire Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Wallet */}
          <button
            onClick={() => navigate('/wallet')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4 text-[#F5C400]" />
              <span className="text-xs font-bold text-white">My Wallet & Cash Payouts</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Rules & Support */}
          <button
            onClick={() => navigate('/rules')}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#1a202e] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-4 h-4 text-[#F5C400]" />
              <span className="text-xs font-bold text-white">Tournament Rules & Anti-Cheat</span>
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
    </div>
  );
}
