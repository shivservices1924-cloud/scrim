import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  KeyRound,
  Crosshair,
  Award,
  CheckCircle,
  Save,
  Users,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function AdminTournamentManage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adminToken } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [joinedPlayers, setJoinedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Room Credentials State
  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [status, setStatus] = useState('UPCOMING');
  const [credSaving, setCredSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Kills & Winner State
  const [playerKills, setPlayerKills] = useState({});
  const [csWinnerId, setCsWinnerId] = useState('');
  const [settling, setSettling] = useState(false);

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournaments/${id}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTournament(data);
        setRoomId(data.roomId || '');
        setRoomPassword(data.roomPassword || '');
        setStatus(data.status || 'UPCOMING');

        const players = data.joinedPlayers || [];
        setJoinedPlayers(players);

        const initialKills = {};
        players.forEach(p => {
          initialKills[p.id] = p.kills || 0;
        });
        setPlayerKills(initialKills);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id, adminToken]);

  // 1-Click Generate Random Room ID and Password!
  const handleAutoGenerateRoom = async () => {
    try {
      setGenerating(true);
      setError('');
      setMsg('');

      const res = await fetch(`/api/admin/tournaments/${id}/generate-room`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate room credentials');

      setRoomId(data.roomId);
      setRoomPassword(data.roomPassword);
      setStatus('ONGOING');
      setMsg(`Room credentials generated and published! ID: ${data.roomId} | Pass: ${data.roomPassword}. Registered players can now view it.`);
      setTimeout(() => setMsg(''), 5000);
      fetchDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Save Room ID & Password manually
  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    try {
      setCredSaving(true);
      setError('');
      setMsg('');

      const res = await fetch(`/api/admin/tournaments/${id}/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ roomId, roomPassword, status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update credentials');
      setMsg('Room credentials updated! Only registered players can see these details.');
      setTimeout(() => setMsg(''), 4000);
      fetchDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setCredSaving(false);
    }
  };

  // Settle Match (Update Kills / CS Winner & Credit Winnings into Player Wallets & Profile Stats!)
  const handleSettleMatch = async (e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to distribute winnings and update player stats? Money will be deposited straight into player Win Balances.')) {
      return;
    }

    try {
      setSettling(true);
      setError('');
      setMsg('');

      const killsArray = Object.entries(playerKills).map(([joinedPlayerId, kills]) => ({
        joinedPlayerId,
        kills: Number(kills) || 0
      }));

      const res = await fetch(`/api/admin/tournaments/${id}/settle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          playerKills: killsArray,
          csWinnerId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to settle match');
      setMsg('Match results settled! Player account money, kill rewards, and stats updated successfully in backend.');
      setTimeout(() => setMsg(''), 5000);
      fetchDetails();
    } catch (err) {
      setError(err.message);
    } finally {
      setSettling(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading match details...</div>;
  }

  if (!tournament) {
    return <div className="p-8 text-center text-xs text-slate-400">Tournament not found.</div>;
  }

  const isHeadshot = tournament.category && tournament.category.includes('HEADSHOT');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/control-room-777/tournaments')}
          className="w-9 h-9 rounded-full bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 flex items-center justify-center text-blue-300"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
            {tournament.gameType} {tournament.matchType} • {tournament.matchId} • MAP: {tournament.map || 'BERMUDA'}
          </span>
          <h1 className="font-heading font-black text-xl text-white">
            {tournament.title}
          </h1>
        </div>
      </div>

      {msg && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-950/80 border border-red-500 p-3 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Part 1: Room ID & Password Controller with 1-Click Generator */}
      <div className="bg-[#0b1326] border border-blue-900/60 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span>Custom Room ID & Password Controller</span>
          </div>

          {/* 1-Click Generate Button */}
          <button
            type="button"
            onClick={handleAutoGenerateRoom}
            disabled={generating}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-heading font-bold text-xs px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1.5 self-start sm:self-auto active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{generating ? 'Generating...' : '🎲 1-Click Generate Random Room'}</span>
          </button>
        </div>

        <div className="bg-[#080d1e] p-3 rounded-xl border border-blue-900/40 text-xs text-blue-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <b>Privacy Guarantee:</b> These credentials will <u>ONLY</u> be visible to players who have successfully registered and paid the entry fee for this tournament.
          </span>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Room ID (Numbers)
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. 8492019"
                className="w-full bg-[#080d1e] border border-blue-900 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Room Password
              </label>
              <input
                type="text"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                placeholder="e.g. 1234 or rushx"
                className="w-full bg-[#080d1e] border border-blue-900 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Match Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-[#080d1e] border border-blue-900 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="UPCOMING">UPCOMING (Registration Open)</option>
                <option value="ONGOING">ONGOING (Match Live / Room Active)</option>
                <option value="COMPLETED">COMPLETED (Result Settled)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={credSaving}
            className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 text-white font-heading font-bold text-xs tracking-wider shadow flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{credSaving ? 'Updating...' : 'Save & Publish to Registered Players'}</span>
          </button>
        </form>
      </div>

      {/* Part 2: Player Kills & Winner Settlement */}
      <div className="bg-[#0b1326] border border-blue-900/60 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-heading font-bold text-base">
            <Crosshair className="w-5 h-5 text-amber-400" />
            <span>Player Kills & Winner Money Settlement</span>
          </div>

          <span className="text-xs bg-blue-950/60 border border-blue-800/40 px-3 py-1 rounded-full text-blue-300 font-bold">
            {joinedPlayers.length} Registered Players
          </span>
        </div>

        <div className="bg-[#080d1e] p-3 rounded-xl border border-blue-900/40 text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span>Format: <b>{tournament.gameType} {tournament.matchType}</b></span>
            &nbsp;•&nbsp;
            <span>Map: <b className="text-emerald-400">{tournament.map || 'BERMUDA'}</b></span>
            &nbsp;•&nbsp;
            <span>Entry: <b>₹{tournament.entryFee}</b></span>
          </div>
          <div>
            {tournament.gameType === 'BR' ? (
              <span className="text-amber-400 font-bold">₹{tournament.perKill} per kill payout</span>
            ) : (
              <span className="text-emerald-400 font-bold">₹{tournament.winPrize || tournament.prizePool} Winner Payout</span>
            )}
          </div>
        </div>

        {joinedPlayers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 bg-[#080d1e] rounded-xl">
            No players have registered for this tournament yet.
          </div>
        ) : (
          <form onSubmit={handleSettleMatch} className="space-y-4">
            <div className="space-y-2">
              {joinedPlayers.map((player) => {
                const kills = playerKills[player.id] ?? 0;
                const estimatedEarnings = tournament.gameType === 'BR'
                  ? kills * (Number(tournament.perKill) || 0)
                  : (csWinnerId === player.id ? (Number(tournament.winPrize) || Number(tournament.prizePool)) : 0);

                return (
                  <div
                    key={player.id}
                    className="bg-[#080d1e] border border-blue-900/50 p-3 rounded-xl flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-white text-sm">
                          {player.username}
                        </span>
                        <span className="text-xs text-blue-400 font-mono">
                          (IGN: {player.ffIgn})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Player UID: {player.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {tournament.gameType === 'BR' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-semibold">Kills:</span>
                          <input
                            type="number"
                            min="0"
                            max="48"
                            value={kills}
                            onChange={(e) =>
                              setPlayerKills({ ...playerKills, [player.id]: Number(e.target.value) })
                            }
                            className="w-16 bg-[#0c142b] border border-blue-800 rounded-lg px-2 py-1 text-center font-heading font-black text-white text-sm focus:border-amber-400"
                          />
                          <span className="text-xs font-bold text-emerald-400 w-20 text-right">
                            = ₹{estimatedEarnings}
                          </span>
                        </div>
                      ) : (
                        <label className="flex items-center gap-2 cursor-pointer bg-[#0c142b] px-3 py-1.5 rounded-xl border border-blue-900 hover:border-cyan-400">
                          <input
                            type="radio"
                            name="csWinner"
                            checked={csWinnerId === player.id}
                            onChange={() => setCsWinnerId(player.id)}
                            className="text-cyan-500 focus:ring-0"
                          />
                          <span className="text-xs font-bold text-slate-200">
                            Mark Winner (₹{tournament.winPrize || tournament.prizePool})
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
              ⚡ Clicking <b>"Distribute Rewards & Settle Match"</b> will automatically calculate kill prizes and win pools, deposit them straight into players' <b>Win Balances</b> (which they can withdraw), increment their total kills & earnings stats, and mark this tournament as <b>COMPLETED</b>.
            </div>

            <button
              type="submit"
              disabled={settling}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              <span>{settling ? 'Distributing Payouts & Updating Accounts...' : 'Distribute Rewards & Update Player Wallets'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
