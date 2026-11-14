import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Swords,
  Plus,
  Trash2,
  KeyRound,
  CheckCircle,
  Clock,
  Sparkles,
  Zap,
  X,
  Crosshair,
  AlertCircle
} from 'lucide-react';

export default function AdminTournaments() {
  const navigate = useNavigate();
  const { adminToken } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  const [noticeModal, setNoticeModal] = useState(null);
  const [noticeText, setNoticeText] = useState('');
  const [savingNotice, setSavingNotice] = useState(false);

  // Form State (Map defaults to BERMUDA)
  const [form, setForm] = useState({
    title: '',
    gameType: 'BR', // BR or CS
    matchType: 'SOLO', // SOLO or DUO
    category: 'BR_FULL_MAP',
    map: 'BERMUDA',
    matchTime: 'Today at 05:00 PM',
    entryFee: 25,
    perKill: 18,
    prizePool: 864,
    winPrize: 0,
    totalSpots: 48,
    rules: 'MAP: BERMUDA ONLY! BAN GUN: DOUBLE VECTOR, M79! BAN CHARACTER: RYDEN! MIN LEVEL 40! IDP TIME: 5 MIN BEFORE MATCH! RECORDING MANDATORY.',
    banner: '/poster-br-solo.jpg'
  });

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tournaments', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTournaments(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [adminToken]);

  // Quick Preset Handlers (Bermuda only + CS Headshot + Lone Wolf Headshot)
  const applyPreset = (presetKey) => {
    switch (presetKey) {
      case 'BR_SOLO_25':
        setForm({
          title: 'BR SOLO BATTLE ROYALE ⚔️ [₹18 PER KILL]',
          gameType: 'BR',
          matchType: 'SOLO',
          category: 'BR_FULL_MAP',
          map: 'BERMUDA',
          matchTime: 'Today at 06:00 PM',
          entryFee: 25,
          perKill: 18,
          prizePool: 864,
          winPrize: 0,
          totalSpots: 48,
          rules: 'MAP: BERMUDA ONLY! BAN GUN: DOUBLE VECTOR, M79! BAN CHARACTER: RYDEN! MIN LEVEL 40! IDP TIME: 5 MIN BEFORE MATCH!',
          banner: '/poster-br-solo.jpg'
        });
        break;

      case 'BR_DUO_25':
        setForm({
          title: 'BR DUO BATTLE 😈⚔️ [₹18 PER KILL]',
          gameType: 'BR',
          matchType: 'DUO',
          category: 'BR_FULL_MAP',
          map: 'BERMUDA',
          matchTime: 'Today at 07:00 PM',
          entryFee: 25,
          perKill: 18,
          prizePool: 864,
          winPrize: 0,
          totalSpots: 48,
          rules: 'MAP: BERMUDA ONLY! DUO MATCH. ENTRY ₹25 PER PLAYER. ₹18 PER KILL. BAN DOUBLE VECTOR, M79, RYDEN.',
          banner: '/poster-br-duo.jpg'
        });
        break;

      case 'BR_SOLO_50':
        setForm({
          title: 'BR SOLO HIGH ROLLER 👑 [₹36 PER KILL]',
          gameType: 'BR',
          matchType: 'SOLO',
          category: 'BR_FULL_MAP',
          map: 'BERMUDA',
          matchTime: 'Today at 08:00 PM',
          entryFee: 50,
          perKill: 36,
          prizePool: 1728,
          winPrize: 0,
          totalSpots: 48,
          rules: 'MAP: BERMUDA ONLY! HIGH STAKES SOLO! ₹36 PER KILL! BAN DOUBLE VECTOR & M79. MIN LEVEL 40. SCREEN RECORDING MUST.',
          banner: '/poster-br-solo.jpg'
        });
        break;

      case 'BR_DUO_50':
        setForm({
          title: 'BR DUO HIGH ROLLER ⚡ [₹36 PER KILL]',
          gameType: 'BR',
          matchType: 'DUO',
          category: 'BR_FULL_MAP',
          map: 'BERMUDA',
          matchTime: 'Today at 09:00 PM',
          entryFee: 50,
          perKill: 36,
          prizePool: 1728,
          winPrize: 0,
          totalSpots: 48,
          rules: 'MAP: BERMUDA ONLY! HIGH STAKES DUO! ENTRY ₹50/PLAYER. ₹36 PER KILL. BAN DOUBLE VECTOR & M79.',
          banner: '/poster-br-duo.jpg'
        });
        break;

      case 'CS_HEADSHOT_SOLO_50':
        setForm({
          title: 'CS HEADSHOT 1V1 🎯 [ONLY HEADSHOT]',
          gameType: 'CS',
          matchType: 'SOLO',
          category: 'CS_HEADSHOT',
          map: 'BERMUDA CS',
          matchTime: 'Today at 05:30 PM',
          entryFee: 50,
          perKill: 0,
          prizePool: 80,
          winPrize: 80,
          totalSpots: 2,
          rules: 'ONLY HEADSHOT ALLOWED! MAP: BERMUDA CS. WOODPECKER / DESERT EAGLE ONLY HEADSHOTS. BODY KILL DISQUALIFICATION! WINNER WINS ₹80.',
          banner: '/poster-cs.jpg'
        });
        break;

      case 'CS_HEADSHOT_DUO_100':
        setForm({
          title: 'CS HEADSHOT 2V2 DUO 💀 [ONLY HEADSHOT]',
          gameType: 'CS',
          matchType: 'DUO',
          category: 'CS_HEADSHOT',
          map: 'BERMUDA CS',
          matchTime: 'Today at 06:30 PM',
          entryFee: 100,
          perKill: 0,
          prizePool: 360,
          winPrize: 360,
          totalSpots: 4,
          rules: 'HEADSHOT ONLY DUO! MAP: BERMUDA CS. ENTRY ₹100/PLAYER. WINNING TEAM TAKES ₹360 CASH.',
          banner: '/poster-cs.jpg'
        });
        break;

      case 'LW_HEADSHOT_SOLO_50':
        setForm({
          title: 'LONE WOLF HEADSHOT 1V1 🐺 [ONLY HEADSHOT]',
          gameType: 'CS',
          matchType: 'SOLO',
          category: 'LW_HEADSHOT',
          map: 'BERMUDA',
          matchTime: 'Today at 07:30 PM',
          entryFee: 50,
          perKill: 0,
          prizePool: 80,
          winPrize: 80,
          totalSpots: 2,
          rules: 'LONE WOLF HEADSHOT 1V1! MAP: BERMUDA. ONLY HEADSHOT DAMAGE ALLOWED. WINNER GETS ₹80.',
          banner: '/poster-lone-wolf.jpg'
        });
        break;

      case 'LW_HEADSHOT_DUO_100':
        setForm({
          title: 'LONE WOLF HEADSHOT 2V2 💥 [WIN ₹360]',
          gameType: 'CS',
          matchType: 'DUO',
          category: 'LW_HEADSHOT',
          map: 'BERMUDA',
          matchTime: 'Today at 08:30 PM',
          entryFee: 100,
          perKill: 0,
          prizePool: 360,
          winPrize: 360,
          totalSpots: 4,
          rules: 'LONE WOLF 2V2 HEADSHOT TOURNAMENT! ENTRY ₹100/PLAYER. WINNER TEAM GETS ₹360! SCREEN RECORDING MANDATORY.',
          banner: '/poster-lone-wolf.jpg'
        });
        break;

      default:
        break;
    }
  };

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...form,
          map: 'BERMUDA' // strictly enforce Bermuda
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create match');
      setMsg('Tournament created successfully!');
      setTimeout(() => setMsg(''), 3000);
      setModalOpen(false);
      window.dispatchEvent(new Event('rushx_tournament_update'));
      fetchTournaments();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const res = await fetch(`/api/admin/tournaments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        setMsg('Tournament deleted.');
        setTimeout(() => setMsg(''), 3000);
        window.dispatchEvent(new Event('rushx_tournament_update'));
        fetchTournaments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotice = async (e) => {
    e.preventDefault();
    if (!noticeModal) return;
    try {
      setSavingNotice(true);
      const res = await fetch(`/api/admin/tournaments/${noticeModal.id}/notice`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ noticeMsg: noticeText })
      });
      if (res.ok) {
        setMsg(`Announcement notice updated for ${noticeModal.title}!`);
        setTimeout(() => setMsg(''), 4000);
        setNoticeModal(null);
        setNoticeText('');
        fetchTournaments();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingNotice(false);
    }
  };

  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'UPCOMING') return t.status === 'UPCOMING';
    if (activeTab === 'ONGOING') return t.status === 'ONGOING';
    if (activeTab === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
            TOURNAMENTS & EVENTS MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create Bermuda BR & CS Headshot contests, post notices, manage room IDs, and settle player wallets
          </p>
        </div>

        <button
          onClick={() => {
            applyPreset('BR_DUO_25');
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Match</span>
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold">
          {msg}
        </div>
      )}

      {/* Filter Tabs: ALL | UPCOMING | ONGOING | COMPLETED */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: `All Events (${tournaments.length})` },
          { id: 'UPCOMING', label: `Upcoming / New (${tournaments.filter(t => t.status === 'UPCOMING').length})` },
          { id: 'ONGOING', label: `Ongoing / Live (${tournaments.filter(t => t.status === 'ONGOING').length})` },
          { id: 'COMPLETED', label: `Completed / Settled (${tournaments.filter(t => t.status === 'COMPLETED').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-[#10051e] text-slate-400 border border-purple-900/50 hover:text-white hover:border-purple-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tournaments Table / Grid */}
      <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-purple-900/40 flex items-center justify-between">
          <h2 className="font-heading font-bold text-sm text-white">
            {activeTab === 'ALL' ? 'All Matches' : activeTab} ({filteredTournaments.length}) • Map: BERMUDA
          </h2>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click 'Manage Room & Kills' to update credentials or distribute payouts
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading tournaments...</div>
        ) : filteredTournaments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No tournaments found in this section.</div>
        ) : (
          <div className="divide-y divide-purple-900/30">
            {filteredTournaments.map((t) => (
              <div
                key={t.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#180930] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-purple-900/50">
                    <img src={t.banner} alt={t.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-heading font-bold px-2 py-0.5 rounded uppercase">
                        {t.category ? t.category.replace('_', ' ') : t.gameType}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{t.matchId}</span>
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        BERMUDA
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'UPCOMING'
                            ? 'bg-blue-950 text-blue-400 border border-blue-500/30'
                            : t.status === 'ONGOING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-white text-base mt-1">
                      {t.title}
                    </h3>

                    {/* Notice if set */}
                    {t.noticeMsg && (
                      <p className="text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded px-2 py-1 mt-1 inline-block">
                        📢 Notice: {t.noticeMsg}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Time: <b className="text-slate-200">{t.matchTime}</b></span>
                      <span>Entry: <b className="text-amber-400">₹{t.entryFee}</b></span>
                      <span>
                        {t.perKill > 0 ? `Kill: ₹${t.perKill}` : `Win: ₹${t.winPrize || t.prizePool}`}
                      </span>
                      <span>
                        Registered: <b className="text-cyan-400">{t.joinedSpots || 0}/{t.totalSpots}</b>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setNoticeModal(t);
                      setNoticeText(t.noticeMsg || '');
                    }}
                    className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/40 font-heading font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 shadow"
                    title="Update Announcement Notice"
                  >
                    <span>📢 Notice</span>
                  </button>

                  <button
                    onClick={() => navigate(`/control-room-777/tournaments/${t.id}`)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Manage Room & Kills</span>
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-colors"
                    title="Delete Match"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notice Update Modal */}
      {noticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10051e] border border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setNoticeModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-heading font-black text-lg text-white mb-1">
              📢 Update Match Notice / Announcement
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {noticeModal.title} ({noticeModal.matchId})
            </p>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Announcement Message for Players
                </label>
                <textarea
                  rows={3}
                  value={noticeText}
                  onChange={(e) => setNoticeText(e.target.value)}
                  placeholder="e.g. Room ID will be shared in 5 minutes! Latecomers will not be waited for."
                  className="w-full bg-[#070212] border border-purple-900 focus:border-amber-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoticeModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNotice}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-heading font-extrabold text-xs shadow"
                >
                  {savingNotice ? 'Saving...' : 'Save & Broadcast'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Tournament Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#10051e] border border-purple-800/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-heading font-black text-xl text-white mb-1">
              Create New Contest (Map: Bermuda)
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select one of the quick presets below:
            </p>

            {/* Quick Presets Buttons */}
            <div className="bg-[#070212] p-3 rounded-xl border border-purple-900/50 mb-5 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> 1-Click Required Presets (Bermuda):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* BR Presets */}
                <button
                  type="button"
                  onClick={() => applyPreset('BR_SOLO_25')}
                  className="p-2 rounded-lg bg-[#180930] hover:bg-[#250d4b] border border-purple-900 text-left"
                >
                  <p className="font-bold text-purple-300">BR Solo ₹25</p>
                  <p className="text-[10px] text-slate-400">₹20 / Kill</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('BR_DUO_25')}
                  className="p-2 rounded-lg bg-[#180930] hover:bg-[#250d4b] border border-purple-900 text-left"
                >
                  <p className="font-bold text-purple-300">BR Duo ₹25</p>
                  <p className="text-[10px] text-slate-400">₹20 / Kill</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('BR_SOLO_50')}
                  className="p-2 rounded-lg bg-[#180930] hover:bg-[#250d4b] border border-purple-900 text-left"
                >
                  <p className="font-bold text-amber-300">BR Solo ₹50</p>
                  <p className="text-[10px] text-slate-400">₹40 / Kill</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('BR_DUO_50')}
                  className="p-2 rounded-lg bg-[#180930] hover:bg-[#250d4b] border border-purple-900 text-left"
                >
                  <p className="font-bold text-amber-300">BR Duo ₹50</p>
                  <p className="text-[10px] text-slate-400">₹40 / Kill</p>
                </button>

                {/* CS Headshot Presets */}
                <button
                  type="button"
                  onClick={() => applyPreset('CS_HEADSHOT_SOLO_50')}
                  className="p-2 rounded-lg bg-[#2b0e14] hover:bg-[#3d131c] border border-red-900 text-left"
                >
                  <p className="font-bold text-red-300">CS Headshot ₹50</p>
                  <p className="text-[10px] text-emerald-400">Win ₹80</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('CS_HEADSHOT_DUO_100')}
                  className="p-2 rounded-lg bg-[#2b0e14] hover:bg-[#3d131c] border border-red-900 text-left"
                >
                  <p className="font-bold text-red-300">CS Headshot ₹100</p>
                  <p className="text-[10px] text-emerald-400">Win ₹360</p>
                </button>

                {/* Lone Wolf Headshot Presets */}
                <button
                  type="button"
                  onClick={() => applyPreset('LW_HEADSHOT_SOLO_50')}
                  className="p-2 rounded-lg bg-[#200e36] hover:bg-[#2d134d] border border-purple-900 text-left"
                >
                  <p className="font-bold text-purple-300">LW Headshot ₹50</p>
                  <p className="text-[10px] text-emerald-400">Win ₹80</p>
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('LW_HEADSHOT_DUO_100')}
                  className="p-2 rounded-lg bg-[#200e36] hover:bg-[#2d134d] border border-purple-900 text-left"
                >
                  <p className="font-bold text-purple-300">LW Headshot ₹100</p>
                  <p className="text-[10px] text-emerald-400">Win ₹360</p>
                </button>
              </div>
            </div>

            {/* Custom Form */}
            <form onSubmit={handleCreateTournament} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Match Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#070212] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="BR_FULL_MAP">BR Full Map</option>
                    <option value="CS_HEADSHOT">CS Headshot</option>
                    <option value="LW_HEADSHOT">Lone Wolf Headshot</option>
                    <option value="CS_1V1">Clash Squad Normal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mode</label>
                  <select
                    value={form.matchType}
                    onChange={(e) => setForm({ ...form, matchType: e.target.value })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-2.5 py-2 text-xs text-white"
                  >
                    <option value="SOLO">Solo (1 Player)</option>
                    <option value="DUO">Duo (2 Players)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Map</label>
                  <input
                    type="text"
                    disabled
                    value="BERMUDA"
                    className="w-full bg-[#0a0216] border border-purple-900/60 rounded-xl px-2.5 py-2 text-xs text-emerald-400 font-bold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Spots</label>
                  <input
                    type="number"
                    required
                    value={form.totalSpots}
                    onChange={(e) => setForm({ ...form, totalSpots: Number(e.target.value) })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-2.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Entry Fee (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={form.entryFee}
                    onChange={(e) => setForm({ ...form, entryFee: Number(e.target.value) })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Per Kill Reward (₹)
                  </label>
                  <input
                    type="number"
                    value={form.perKill}
                    onChange={(e) => setForm({ ...form, perKill: Number(e.target.value) })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Winner Prize (₹)
                  </label>
                  <input
                    type="number"
                    value={form.winPrize}
                    onChange={(e) => setForm({ ...form, winPrize: Number(e.target.value) })}
                    className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Exact Match Date & Time <span className="text-amber-400">* (Auto-expires at this exact minute)</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const d = new Date(val);
                      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                      const isToday = d.toDateString() === new Date().toDateString();
                      const dayStr = isToday ? 'Today' : `${d.getDate()}/${d.getMonth() + 1}`;
                      setForm({
                        ...form,
                        scheduledAt: d.toISOString(),
                        matchTime: `${dayStr} at ${timeStr}`
                      });
                    }
                  }}
                  className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white mb-2"
                />

                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Display Label in App
                </label>
                <input
                  type="text"
                  required
                  value={form.matchTime}
                  onChange={(e) => setForm({ ...form, matchTime: e.target.value })}
                  placeholder="e.g. Today at 04:00 PM"
                  className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Note: Match time nikalte hi ye event players ke lobby se automatically hide ho jayega.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rules and Bans Description
                </label>
                <textarea
                  rows="2"
                  value={form.rules}
                  onChange={(e) => setForm({ ...form, rules: e.target.value })}
                  className="w-full bg-[#070212] border border-purple-900 rounded-xl px-3 py-2 text-xs text-white"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-heading font-extrabold text-base tracking-wider shadow-lg active:scale-[0.98] transition-all"
              >
                Publish Bermuda Tournament
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
