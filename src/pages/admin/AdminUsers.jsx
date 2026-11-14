import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPlayerAvatar } from '../../utils/avatar';
import { Users, Search, Edit3, DollarSign, X, CheckCircle, RefreshCw, ShieldAlert, ShieldCheck, Ban } from 'lucide-react';

export default function AdminUsers() {
  const { adminToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [adjustingUser, setAdjustingUser] = useState(null);
  const [banModalUser, setBanModalUser] = useState(null);
  const [banReason, setBanReason] = useState('Suspected Hacking / Script usage in tournament');
  const [depAdj, setDepAdj] = useState(0);
  const [winAdj, setWinAdj] = useState(0);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminToken]);

  const handleBanUser = async (e) => {
    e.preventDefault();
    if (!banModalUser) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${banModalUser.id}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ reason: banReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to ban player');
      setMsg(data.message || `Player ${banModalUser.username} has been BANNED.`);
      setTimeout(() => setMsg(''), 4000);
      setBanModalUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnbanUser = async (user) => {
    if (!window.confirm(`Are you sure you want to UNBAN ${user.username}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}/unban`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to unban player');
      setMsg(data.message || `Player ${user.username} has been UNBANNED.`);
      setTimeout(() => setMsg(''), 4000);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!adjustingUser) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/admin/users/${adjustingUser.id}/adjust-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          depositAdjustment: Number(depAdj),
          winAdjustment: Number(winAdj),
          note
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to adjust');
      setMsg(`Balance updated for ${adjustingUser.username}.`);
      setTimeout(() => setMsg(''), 4000);
      setAdjustingUser(null);
      setDepAdj(0);
      setWinAdj(0);
      setNote('');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.ffIgn && u.ffIgn.toLowerCase().includes(q)) ||
      (u.ffUid && u.ffUid.includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
            REGISTERED PLAYERS MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View registered user accounts, Free Fire UIDs, balances, and kill statistics
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 text-slate-400 hover:text-white self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by username, email, phone, FF IGN or UID..."
          className="w-full bg-[#10051e] border border-purple-900/60 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Table & Mobile Cards */}
      <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading players...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No players match the search.</div>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-purple-900/30">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 space-y-3 bg-[#10051e]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={getPlayerAvatar(u)} alt="Avatar" className="w-9 h-9 rounded-full border border-purple-500/40 p-0.5 bg-black object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-black text-white text-base">{u.username}</span>
                          {u.role === 'admin' ? (
                            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-1.5 py-0.5 rounded">
                              ADMIN
                            </span>
                          ) : u.isBanned ? (
                            <span className="bg-red-600/30 text-red-400 border border-red-500/50 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <Ban className="w-2.5 h-2.5" /> BANNED
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {u.phone} • {u.email}
                        </p>
                        {u.isBanned && u.banReason && (
                          <p className="text-[10px] text-red-400 italic mt-0.5">
                            Ban Reason: {u.banReason}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Free Fire details & Balances */}
                  <div className="grid grid-cols-2 gap-2 bg-[#0a0216] p-2.5 rounded-xl border border-purple-900/40 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">FREE FIRE:</span>
                      <span className="text-cyan-300 font-bold block truncate">{u.ffIgn || 'No IGN'}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">UID: {u.ffUid || 'Not set'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">WALLET:</span>
                      <span className="text-emerald-400 font-bold block">Dep: ₹{u.depositBalance || 0}</span>
                      <span className="text-green-400 font-bold block">Win: ₹{u.winBalance || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Played: <b className="text-white">{u.matchesPlayed || 0}</b> Matches</span>
                    <span className="text-amber-400 font-bold">{u.totalKills || 0} Kills</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {u.role !== 'admin' && (
                      u.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(u)}
                          className="py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 font-heading font-black text-xs active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Unban Player</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setBanModalUser(u);
                            setBanReason('Suspected Hacking / Script usage in tournament');
                          }}
                          className="py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-heading font-black text-xs active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Ban className="w-4 h-4" />
                          <span>Ban Player</span>
                        </button>
                      )
                    )}

                    <button
                      onClick={() => {
                        setAdjustingUser(u);
                        setDepAdj(0);
                        setWinAdj(0);
                        setNote('');
                      }}
                      className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-black text-xs active:scale-95 flex items-center justify-center gap-1.5 shadow"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Adjust Balance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0a0216] border-b border-purple-900/40 text-slate-400 uppercase font-semibold">
                    <th className="p-3.5">Player User</th>
                    <th className="p-3.5">Contact (Phone/Email)</th>
                    <th className="p-3.5">Free Fire (IGN / UID)</th>
                    <th className="p-3.5">Deposit Bal</th>
                    <th className="p-3.5">Win Bal (Withdrawable)</th>
                    <th className="p-3.5">Matches / Kills</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-[#180930] transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img src={getPlayerAvatar(u)} alt="Avatar" className="w-8 h-8 rounded-full border border-purple-500/40 p-0.5 bg-black object-cover shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{u.username}</span>
                              {u.role === 'admin' ? (
                                <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-black px-1.5 py-0.5 rounded">
                                  ADMIN
                                </span>
                              ) : u.isBanned ? (
                                <span className="bg-red-600/30 text-red-400 border border-red-500/50 text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Ban className="w-2.5 h-2.5" /> BANNED
                                </span>
                              ) : (
                                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{u.fullName}</span>
                            {u.isBanned && u.banReason && (
                              <p className="text-[10px] text-red-400/90 italic mt-0.5">
                                Reason: {u.banReason}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{u.phone}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-heading font-bold text-cyan-300">
                          {u.ffIgn || 'Not set'}
                        </span>
                        <div className="text-[11px] text-slate-400 font-mono">
                          UID: {u.ffUid || 'Not set'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-heading font-bold text-emerald-400">
                          ₹{u.depositBalance || 0}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-heading font-bold text-green-400">
                          ₹{u.winBalance || 0}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <div>{u.matchesPlayed || 0} Matches</div>
                        <div className="text-[11px] text-amber-400 font-semibold">{u.totalKills || 0} Kills</div>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role !== 'admin' && (
                            u.isBanned ? (
                              <button
                                onClick={() => handleUnbanUser(u)}
                                className="bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/50 text-emerald-300 hover:text-white font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                title="Unban player"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Unban</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setBanModalUser(u);
                                  setBanReason('Suspected Hacking / Script usage in tournament');
                                }}
                                className="bg-red-950/40 hover:bg-red-900 border border-red-500/40 text-red-400 hover:text-white font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                title="Ban player for hacks"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Ban</span>
                              </button>
                            )
                          )}

                          <button
                            onClick={() => {
                              setAdjustingUser(u);
                              setDepAdj(0);
                              setWinAdj(0);
                              setNote('');
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Adjust</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Adjust Balance Modal */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10051e] border border-purple-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setAdjustingUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-lg text-white mb-1">
              Adjust Player Balance
            </h3>
            <p className="text-xs text-blue-300 mb-4">
              Player: <b>{adjustingUser.username}</b> (UID: {adjustingUser.ffUid})
            </p>

            <form onSubmit={handleAdjustBalance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Add / Subtract Deposit Balance (₹)
                </label>
                <input
                  type="number"
                  value={depAdj}
                  onChange={(e) => setDepAdj(e.target.value)}
                  placeholder="e.g. +50 or -25"
                  className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white"
                />
                <span className="text-[10px] text-slate-500">Current: ₹{adjustingUser.depositBalance}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Add / Subtract Win Balance (₹)
                </label>
                <input
                  type="number"
                  value={winAdj}
                  onChange={(e) => setWinAdj(e.target.value)}
                  placeholder="e.g. +100 or -50"
                  className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white"
                />
                <span className="text-[10px] text-slate-500">Current: ₹{adjustingUser.winBalance}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Audit Reason / Note
                </label>
                <input
                  type="text"
                  required
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Compensation, tournament prize adjust"
                  className="w-full bg-[#0a0216] border border-purple-900 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-heading font-bold text-sm mt-2"
              >
                {saving ? 'Updating...' : 'Save Balance Change'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ban Player Modal */}
      {banModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10051e] border border-red-600/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setBanModalUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-400 font-heading font-black text-lg mb-1">
              <ShieldAlert className="w-5 h-5" />
              <span>BAN PLAYER ACCOUNT</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Player: <b className="text-white">{banModalUser.username}</b> (UID: {banModalUser.ffUid || 'Not set'})
            </p>

            <form onSubmit={handleBanUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reason for Ban
                </label>
                <textarea
                  rows={3}
                  required
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="e.g. Using aimbot/wallhack script in Room #839210 or teaming"
                  className="w-full bg-[#0a0216] border border-red-500/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Quick Reason Presets */}
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {[
                  'Aimbot / Wallhack Script',
                  'Teaming in Solo Match',
                  'Fake UTR / Deposit Fraud',
                  'Using PC Emulator'
                ].map(pre => (
                  <button
                    key={pre}
                    type="button"
                    onClick={() => setBanReason(pre)}
                    className="px-2 py-1 bg-red-950/60 border border-red-500/30 text-red-300 rounded hover:bg-red-900"
                  >
                    {pre}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBanModalUser(null)}
                  className="w-1/2 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-1/2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-extrabold text-xs shadow-lg shadow-red-600/40"
                >
                  {saving ? 'Banning...' : 'Confirm Ban'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
