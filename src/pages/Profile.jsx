import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout, refreshUser } = useAuth();

  const [noticeToggle, setNoticeToggle] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [ffIgn, setFfIgn] = useState(user?.ffIgn || '');
  const [ffUid, setFfUid] = useState(user?.ffUid || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFfIgn(user.ffIgn || '');
      setFfUid(user.ffUid || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSaving(true);
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ffIgn, ffUid, phone })
      });
      if (res.ok) {
        setMsg('Profile updated!');
        setTimeout(() => setMsg(''), 3000);
        setEditingProfile(false);
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

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#f3f4f8] text-slate-800">
      <SEO
        title="Player Profile & Settings"
        description="View and update your Free Fire IGN, game UID, match statistics, and wallet balance on RushX Esports."
        path="/profile"
      />
      {/* Blue Header with Menu title (Exact match to Screenshot 1) */}
      <div className="bg-[#003874] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to home"
          className="text-white hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading font-extrabold text-lg tracking-wide">
          Menu
        </h1>
        <div className="w-6"></div> {/* Spacer */}
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Avatar & Username Section (Screenshot 1) */}
        <div className="text-center pt-4 pb-2">
          {/* Avatar with yellow outer ring and blue inner circle */}
          <div className="w-24 h-24 mx-auto rounded-full bg-[#f6b400] p-1.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0084ff] rounded-full flex items-center justify-center text-white">
              <User className="w-12 h-12 fill-white stroke-none" />
            </div>
          </div>

          {/* Username */}
          <h2 className="font-heading font-extrabold text-[#0066cc] text-2xl mt-3 tracking-wide">
            {user ? user.username : 'Guest Player'}
          </h2>

          {user && (
            <p className="text-xs text-slate-500 font-medium">
              FF IGN: {user.ffIgn || 'Not set'} • UID: {user.ffUid || 'Not set'}
            </p>
          )}
        </div>

        {/* 3 Stats Counters in White Card Row (Screenshot 1) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-3 divide-x divide-slate-100 text-center">
          {/* Matches Played */}
          <div className="flex flex-col items-center px-1">
            <span className="font-heading font-black text-2xl text-[#0084ff]">
              {matchesPlayed}
            </span>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Matches Played
            </span>
          </div>

          {/* Total Kills */}
          <div className="flex flex-col items-center px-1">
            <span className="font-heading font-black text-2xl text-[#0084ff]">
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
              <span className="font-heading font-black text-2xl text-[#0084ff]">
                {totalEarning}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Total Earning
            </span>
          </div>
        </div>

        {msg && (
          <div className="bg-emerald-100 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-300">
            {msg}
          </div>
        )}

        {/* Edit Profile Form Popup/Section */}
        {editingProfile && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3 animate-fade-in"
          >
            <h3 className="font-heading font-bold text-sm text-slate-800 uppercase tracking-wider">
              Update Free Fire In-Game Details
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Free Fire In-Game Name (IGN)
              </label>
              <input
                type="text"
                required
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Free Fire Player UID
              </label>
              <input
                type="text"
                required
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
              >
                {saving ? 'Saving...' : 'Save Details'}
              </button>
              <button
                type="button"
                onClick={() => setEditingProfile(false)}
                className="py-2 px-4 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Menu Options List (Screenshot 1) */}
        <div className="space-y-2">
          {/* My Profile */}
          <div
            onClick={() => setEditingProfile(!editingProfile)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <User className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                My Profile
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="text-xs text-blue-500 font-semibold">Edit</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* My Wallet */}
          <div
            onClick={() => navigate('/wallet')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                My Wallet
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* My Statistics */}
          <div
            onClick={() => navigate('/my-matches')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                My Statistics
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Top Players */}
          <div
            onClick={() => navigate('/leaderboard')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                Top Players
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Notifications / Rules */}
          <div
            onClick={() => navigate('/rules')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Bell className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                Notifications
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Contact Us */}
          <div
            onClick={() => navigate('/contact')}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                Contact Us
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Importance Notice Toggle Switch (Screenshot 1) */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <Bell className="w-5 h-5 fill-current" />
              </div>
              <span className="font-heading font-bold text-slate-700 text-base">
                Importance Notice
              </span>
            </div>
            <button
              onClick={() => setNoticeToggle(!noticeToggle)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                noticeToggle ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  noticeToggle ? 'translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Bottom Options: Admin Panel Portal Link & Logout */}
        <div className="pt-2 space-y-2">
          {user ? (
            <button
              onClick={logout}
              className="w-full py-3 rounded-2xl bg-white text-red-500 border border-red-200 font-heading font-bold text-sm shadow-sm hover:bg-red-50 flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-heading font-bold text-sm shadow-sm hover:bg-blue-500 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Log In / Create Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
