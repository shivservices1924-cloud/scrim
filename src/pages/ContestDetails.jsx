import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Clock,
  ShieldAlert,
  Users,
  Award,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  X,
  UserCheck,
  Trophy,
  Crown,
  Crosshair
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPlayerAvatar } from '../utils/avatar';
import JoinModal from '../components/JoinModal';

export default function ContestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showJoiningsModal, setShowJoiningsModal] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('0d 0h 0m 0s');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/tournaments/${id}`, { headers });
      if (!res.ok) {
        throw new Error('Contest not found');
      }
      const data = await res.json();
      setTournament(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournament();
  }, [id, token]);

  // Live countdown timer calculation
  useEffect(() => {
    if (!tournament) return;

    const calculateTimeLeft = () => {
      let targetTime;
      if (tournament.scheduledAt) {
        targetTime = new Date(tournament.scheduledAt).getTime();
      } else {
        targetTime = Date.now() + 1800000; // default 30 mins
      }

      const diff = Math.max(0, targetTime - Date.now());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeftStr(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [tournament]);

  const copyToClipboard = (text, fieldName) => {
    if (!text || text === 'Coming Soon') {
      showToast('Room credentials will be updated 10-15 mins before match time!');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    showToast(`Copied ${fieldName}: ${text}`);
    setTimeout(() => setCopiedField(''), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#070212] flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#070212] p-4 text-white text-center pt-20 space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold">Contest not found</h2>
        <button
          onClick={() => navigate('/tournaments')}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  const isFull = (tournament.joinedSpots || 0) >= (tournament.totalSpots || 48);
  const isJoined = tournament.hasJoined;
  const isOngoing = tournament.status === 'ONGOING';
  const isCompleted = tournament.status === 'COMPLETED';

  // Room details display logic matching screenshot 2:
  // If joined and admin generated credentials -> reveal actual ID & Pass!
  // If joined and credentials not set -> "Coming Soon" with copy button
  // If NOT joined -> "Locked (Join Match to Unlock)"
  const displayRoomId = isJoined
    ? (tournament.roomId ? tournament.roomId : 'Coming Soon')
    : 'Locked (Join to Unlock)';

  const displayRoomPassword = isJoined
    ? (tournament.roomPassword ? tournament.roomPassword : 'Coming Soon')
    : 'Locked (Join to Unlock)';

  return (
    <div className="pb-28 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#180930]/95 text-purple-200 border border-purple-500 px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top App Header */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/60 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-base tracking-wide">
            Contest Details {tournament.matchId}
          </h1>
        </div>
      </div>

      {/* Hero Banner with Free Fire Max & RULES! Overlay */}
      <div className="relative w-full h-52 bg-[#090214] overflow-hidden">
        <img
          src={tournament.banner || (
            tournament.category === 'CS_HEADSHOT' ? '/poster-cs.jpg' :
            tournament.matchType === 'DUO' ? '/poster-br-duo.jpg' :
            tournament.category === 'LW_HEADSHOT' ? '/poster-lone-wolf.jpg' :
            '/poster-br-solo.jpg'
          )}
          alt={tournament.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = tournament.category === 'CS_HEADSHOT' ? '/poster-cs.jpg' :
                                  tournament.matchType === 'DUO' ? '/poster-br-duo.jpg' :
                                  tournament.category === 'LW_HEADSHOT' ? '/poster-lone-wolf.jpg' :
                                  '/poster-br-solo.jpg';
          }}
          className="w-full h-full object-cover object-center filter brightness-90"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070212] via-transparent to-black/30 pointer-events-none"></div>

        {/* Free Fire Max badge at top left */}
        <div className="absolute top-2.5 left-3 bg-black/75 backdrop-blur-sm px-2.5 py-0.5 rounded border border-purple-500/30 text-[9px] font-black tracking-widest text-white uppercase">
          FREE FIRE MAX
        </div>

        {/* RULES! button at top right */}
        <a
          href="#rules-section"
          className="absolute top-2.5 right-3 bg-black/80 hover:bg-black/95 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/60 text-[11px] font-heading font-black tracking-wider text-amber-400 uppercase shadow-lg flex items-center gap-1 transition-all"
        >
          <span>RULES!</span>
        </a>
      </div>

      <div className="p-4 space-y-4 -mt-4 relative z-10">
        {/* ROOM DETAILS SECTION: ONLY VISIBLE AFTER JOINING / REGISTERING!
            "bina join kiye id aur pass ka kuch bhi show na ye bhi na dikhe ki id pass yaha milega" */}
        {isJoined && (
          <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-black text-purple-300 text-lg tracking-wide flex items-center gap-1.5">
                <span>Room Details</span>
              </h2>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                Registered Player
              </span>
            </div>

            {/* ID Box */}
            <div className="bg-[#060a15] border border-slate-700/70 rounded-xl px-4 py-3 flex items-center justify-between shadow-inner">
              <span className="font-heading font-black text-white text-sm tracking-wider w-20">
                ID:
              </span>
              <span className="font-mono font-bold text-sm text-cyan-300 flex-1 text-center truncate px-2">
                {tournament.roomId ? tournament.roomId : 'Coming Soon'}
              </span>
              <button
                onClick={() => copyToClipboard(tournament.roomId || 'Coming Soon', 'Room ID')}
                className="p-1.5 rounded-lg bg-[#180930] hover:bg-[#230d45] text-slate-300 hover:text-white transition-colors"
                title="Copy ID"
              >
                {copiedField === 'Room ID' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* PASSWORD Box */}
            <div className="bg-[#060a15] border border-slate-700/70 rounded-xl px-4 py-3 flex items-center justify-between shadow-inner">
              <span className="font-heading font-black text-white text-sm tracking-wider w-20">
                PASSWORD:
              </span>
              <span className="font-mono font-bold text-sm text-cyan-300 flex-1 text-center truncate px-2">
                {tournament.roomPassword ? tournament.roomPassword : 'Coming Soon'}
              </span>
              <button
                onClick={() => copyToClipboard(tournament.roomPassword || 'Coming Soon', 'Room Password')}
                className="p-1.5 rounded-lg bg-[#180930] hover:bg-[#230d45] text-slate-300 hover:text-white transition-colors"
                title="Copy Password"
              >
                {copiedField === 'Room Password' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Time Left Box (Screenshot 1 & 2: "Time Left: 0d 0h 14m 1s") */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-xl py-2 px-4 text-center shadow-md">
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-purple-300" />
            <span className="font-mono font-bold text-sm text-white tracking-wider">
              Time Left: {timeLeftStr}
            </span>
          </div>
        </div>

        {/* Title (Screenshot 1 & 2) */}
        <div>
          <h2 className="font-heading font-black text-purple-300 text-sm uppercase leading-relaxed tracking-wide">
            {tournament.title} - ID{tournament.matchId}
          </h2>
        </div>

        {/* 3-Box Stats Grid (Team: Solo | Mode: BATTLE ROYAL | Map: BERMUDA) */}
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1: Team */}
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 text-center shadow">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Team:</span>
            <span className="font-heading font-bold text-white text-xs mt-0.5 block truncate">
              {tournament.matchType || 'Solo'}
            </span>
          </div>

          {/* Card 2: Mode */}
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 text-center shadow">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Mode:</span>
            <span className="font-heading font-bold text-white text-xs mt-0.5 block truncate">
              {tournament.gameType === 'CS' ? 'CLASH SQUAD' : 'BATTLE ROYAL'}
            </span>
          </div>

          {/* Card 3: Map (BERMUDA ONLY) */}
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 text-center shadow">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Map:</span>
            <span className="font-heading font-black text-emerald-400 text-xs mt-0.5 block truncate uppercase">
              BERMUDA
            </span>
          </div>
        </div>

        {/* Match Type & Entry Fee Row (Screenshot 1 & 2) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 flex items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Match Type:</span>
            <span className="font-bold text-white">Paid</span>
          </div>
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 flex items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Entry Fee:</span>
            <span className="font-heading font-black text-amber-400 text-sm">
              🪙 ₹{tournament.entryFee}
            </span>
          </div>
        </div>

        {/* Match Schedule (Screenshot 1 & 2) */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-2.5 text-center text-xs font-semibold text-slate-300">
          <span>Match Schedule: </span>
          <span className="text-cyan-300 font-bold">{tournament.matchTime}</span>
        </div>

        {/* Prize Details Card (Screenshot 1) */}
        <div className="space-y-1.5">
          <h3 className="font-heading font-bold text-purple-300 text-xs tracking-wider uppercase">
            Prize Details
          </h3>
          <div className="bg-[#10051e] border border-purple-900/50 rounded-xl p-3 space-y-1 shadow">
            <div className="flex items-center justify-between text-xs">
              <span className="font-heading font-black text-amber-400 text-sm">
                {tournament.perKill > 0
                  ? `PER KILL ₹${tournament.perKill}`
                  : `BOOYAH / WINNER ₹${tournament.winPrize || tournament.prizePool}`}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                PRIZE POOL ₹{tournament.prizePool}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              ONLY ON FULL SLOT • WINNINGS ARE CREDITED TO WIN BALANCE DIRECTLY
            </p>
          </div>
        </div>

        {/* MATCH RESULTS / LEADERBOARD SECTION (Shown when match is COMPLETED) */}
        {isCompleted && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading font-black text-white text-base tracking-wide">
                  Match Results & Leaderboard
                </h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-heading font-bold px-2.5 py-0.5 rounded-full">
                COMPLETED
              </span>
            </div>

            <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-[#070212] p-2.5 rounded-xl border border-purple-900/40 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Players</span>
                  <span className="font-heading font-black text-white text-sm">{tournament.joinedPlayers?.length || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Per Kill</span>
                  <span className="font-heading font-black text-amber-400 text-sm">₹{tournament.perKill || 0}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Prize Pool</span>
                  <span className="font-heading font-black text-emerald-400 text-sm">₹{tournament.prizePool || 0}</span>
                </div>
              </div>

              {/* Player list with kills & winnings */}
              <div className="space-y-2 pt-1 divide-y divide-purple-900/30">
                {(!tournament.joinedPlayers || tournament.joinedPlayers.length === 0) ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No results recorded for this match yet.
                  </div>
                ) : (
                  [...tournament.joinedPlayers]
                    .sort((a, b) => ((Number(b.winAmount) || 0) - (Number(a.winAmount) || 0)) || ((Number(b.kills) || 0) - (Number(a.kills) || 0)))
                    .map((player, idx) => {
                      const isWinner = Boolean(player.isWinner || (idx === 0 && Number(player.winAmount) > 0));
                      return (
                        <div key={player.id || idx} className="pt-2.5 pb-2 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full font-heading font-black flex items-center justify-center text-[10px] ${
                              idx === 0 ? 'bg-amber-400 text-black shadow-md shadow-amber-400/30' :
                              idx === 1 ? 'bg-slate-300 text-black' :
                              idx === 2 ? 'bg-amber-700 text-white' :
                              'bg-[#240b45] text-purple-300'
                            }`}>
                              #{idx + 1}
                            </span>
                            <img src={getPlayerAvatar(player)} alt="Avatar" className="w-8 h-8 rounded-full border border-purple-500/50 object-cover" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-heading font-bold text-white text-xs">
                                  {player.ffIgn || player.username}
                                </p>
                                {isWinner && (
                                  <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5" /> Booyah
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 font-mono">
                                User: {player.username} {player.ffUid ? `• UID: ${player.ffUid}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center justify-end gap-1 text-slate-300 font-heading font-bold text-xs">
                              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                              <span>{player.kills || 0} Kills</span>
                            </div>
                            <span className="font-heading font-black text-sm text-emerald-400 block">
                              ₹{player.winAmount || 0} Won
                            </span>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT THIS MATCH - RULES AND REGULATIONS (RushX Royal Cyber-Purple Theme) */}
        <div id="rules-section" className="space-y-2 pt-2">
          <h3 className="font-heading font-bold text-purple-300 text-xs tracking-wider uppercase">
            About this Match
          </h3>

          <div className="bg-[#10051e] text-slate-200 rounded-2xl p-4 shadow-xl space-y-3 border border-purple-900/60">
            <h4 className="font-heading font-black text-base text-white text-center tracking-wide border-b border-purple-900/60 pb-2 flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Rules and Regulations</span>
            </h4>

            <ul className="text-xs space-y-2.5 list-disc pl-4 leading-relaxed font-medium">
              <li>
                <strong className="text-white">Level Requirement:</strong> Only players with Level 40+ IDs are eligible to participate.
              </li>
              <li>
                <strong className="text-white">Headshot Rate:</strong> CS career headshot rate must not exceed 70%.
              </li>
              <li>
                <strong className="text-white">Device Requirements:</strong> The match must be played exclusively on a smartphone or tablet. Emulators are strictly prohibited.
              </li>
              <li>
                <strong className="text-white">Simple Text IGN:</strong> Use simple text when registering (example - RONITH / RoNith, don't use any kind of symbol).
              </li>
              <li>
                <strong className="text-rose-400">Prohibited Behavior:</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-300">
                  <li><strong className="text-white">Using Unauthorized Tools:</strong> Employing tools such as aimbots, no-recoil applications, or any game-modifying software.</li>
                  <li><strong className="text-white">Teaming Up with Opponents:</strong> Collaborating with opponents to gain an unfair advantage during gameplay.</li>
                  <li><strong className="text-white">Adding Unregistered Players:</strong> Adding unregistered players to the Custom Room will lead to instant disqualification & ban.</li>
                  <li><strong className="text-white">Using Prohibited Guns:</strong> Employing Double Vector guns, M79 during gameplay is banned.</li>
                  <li><strong className="text-white">Using Prohibited Character:</strong> Employing Ryden Character during gameplay is banned.</li>
                </ul>
              </li>
              <li>
                <strong className="text-white">Mandatory Gameplay Recording:</strong> The gameplay must be recorded using the in-game recording tools available in Free Fire MAX or a screen recorder. Failure to comply will lead to penalties.
              </li>
              <li>
                <strong className="text-white">Mandatory Screen Recording for Custom Room:</strong> Players must record their screens while joining the custom room.
              </li>
              <li>
                <strong className="text-white">Multiple Accounts:</strong> The use of multiple accounts by a single user is strictly prohibited. Any player found using multiple IDs will be permanently banned from our platform.
              </li>
              <li>
                <strong className="text-white">Match Result:</strong> The result will be generated within 1 to 1.5 hours after the scheduled match time.
              </li>
              <li>
                <strong className="text-white">Refund Policy:</strong> Refunds will not be provided for missed matches. However, if RushX-related issues (e.g. server errors) occur, refunds may be considered on a case-by-case basis.
              </li>
              <li>
                <strong className="text-white">Match Registration Restriction:</strong> Once you join a match, your registration cannot be cancelled.
              </li>
              <li>
                <strong className="text-white">Rights:</strong> RushX reserves the right to modify match prizes, rules & regulations at its discretion.
              </li>
              <li>
                <strong className="text-rose-400">Horse Ban:</strong> Horse is completely banned. If anyone uses horse, prize will not be given to him.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS (Screenshot 1: Yellow "VIEW ALL JOININGS" + Green "Join Match") */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-t border-purple-900/60 p-3 max-w-md mx-auto space-y-2">
        {/* VIEW ALL JOININGS (Gold/Yellow Button) */}
        <button
          onClick={() => setShowJoiningsModal(true)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-heading font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
        >
          <Users className="w-4 h-4 text-black" />
          <span>VIEW ALL JOININGS ({tournament.joinedSpots || 0}/{tournament.totalSpots || 48})</span>
        </button>

        {/* Join / Status Action Button */}
        {isJoined ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full py-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-heading font-black text-sm tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>YOU ARE REGISTERED • ROOM DETAILS ABOVE</span>
          </button>
        ) : isCompleted ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-heading font-bold text-sm cursor-not-allowed"
          >
            MATCH COMPLETED
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-emerald-700/60 text-white font-heading font-black text-sm cursor-not-allowed tracking-wider"
          >
            Team Full
          </button>
        ) : (
          <button
            onClick={() => {
              if (!token) {
                navigate('/login');
                return;
              }
              setShowJoinModal(true);
            }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-heading font-black text-base tracking-wider shadow-lg shadow-green-500/30 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Join Match (₹{tournament.entryFee})</span>
          </button>
        )}
      </div>

      {/* JOIN MODAL */}
      {showJoinModal && (
        <JoinModal
          tournament={tournament}
          onClose={() => setShowJoinModal(false)}
          onSuccess={() => {
            setShowJoinModal(false);
            fetchTournament();
            showToast('Registration successful! Room credentials unlocked.');
          }}
        />
      )}

      {/* VIEW ALL JOININGS MODAL */}
      {showJoiningsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-[#10051e] border border-purple-900/60 w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-purple-900/50 flex items-center justify-between bg-[#0a0216]">
              <div>
                <h3 className="font-heading font-black text-white text-base">
                  Registered Players ({tournament.joinedPlayers?.length || 0})
                </h3>
                <p className="text-[11px] text-slate-400">
                  {tournament.title} {tournament.matchId}
                </p>
              </div>
              <button
                onClick={() => setShowJoiningsModal(false)}
                className="w-8 h-8 rounded-full bg-[#180930] hover:bg-[#230d45] text-slate-300 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-purple-900/30">
              {(!tournament.joinedPlayers || tournament.joinedPlayers.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No players have registered yet. Be the first to join!
                </div>
              ) : (
                tournament.joinedPlayers.map((player, idx) => (
                  <div key={player.id || idx} className="pt-2 pb-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#240b45] text-purple-300 font-heading font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <img src={getPlayerAvatar(player)} alt="Avatar" className="w-7 h-7 rounded-full border border-purple-500/50 object-cover" />
                      <div>
                        <p className="font-heading font-bold text-white text-xs">
                          {player.ffIgn || player.username}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          User: {player.username}
                        </p>
                      </div>
                    </div>

                    {isCompleted ? (
                      <div className="text-right">
                        <span className="text-[11px] font-bold text-amber-400 block font-heading">
                          {player.kills || 0} Kills
                        </span>
                        <span className="text-[11px] font-black text-emerald-400 block font-heading">
                          ₹{player.winAmount || 0} Won
                        </span>
                      </div>
                    ) : (
                      <span className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-purple-900/50 bg-[#0a0216]">
              <button
                onClick={() => setShowJoiningsModal(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-bold text-xs shadow-md transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
