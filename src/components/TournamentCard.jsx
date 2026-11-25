import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, Zap, KeyRound, ExternalLink, ShieldCheck } from 'lucide-react';
import { getTournamentPoster, getTournamentPosterSvgFallback } from '../utils/poster';

export default function TournamentCard({ tournament, onJoin, onViewRoom, hasJoined }) {
  const navigate = useNavigate();
  const totalSpots = tournament.totalSpots || 48;
  const joinedSpots = tournament.joinedSpots || 0;
  const spotsLeft = Math.max(0, totalSpots - joinedSpots);
  const percentFilled = Math.min(100, Math.round((joinedSpots / totalSpots) * 100));

  const isOngoing = tournament.status === 'ONGOING';
  const isCompleted = tournament.status === 'COMPLETED';
  const isUpcoming = tournament.status === 'UPCOMING';

  const mapName = tournament.map && tournament.map.toUpperCase().includes('BERMUDA')
    ? tournament.map
    : 'BERMUDA';

  const goToDetails = () => {
    navigate(`/contest/${tournament.id}`);
  };

  const getStartText = () => {
    if (!tournament.scheduledAt) return tournament.matchTime || 'Soon';
    const diff = new Date(tournament.scheduledAt).getTime() - Date.now();
    if (diff <= 0) return 'Starting Now';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    if (h > 0) return `Starts in ${h}h ${m}m`;
    return `Starts in ${m}m`;
  };

  return (
    <div className="bg-[#121620] border border-[#1f2738] hover:border-[#F5C400]/60 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 group">
      {/* Sleek Compact Banner */}
      <div
        onClick={goToDetails}
        className="relative h-28 sm:h-32 w-full bg-[#0b0e14] overflow-hidden cursor-pointer"
      >
        <img
          src={getTournamentPoster(tournament)}
          alt={tournament.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getTournamentPosterSvgFallback(tournament);
          }}
          className="w-full h-full object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-black/30 to-black/50 pointer-events-none"></div>

        {/* Header Tournament Type Badge */}
        <div className="absolute top-2.5 left-2.5 bg-[#F5C400] text-black font-heading font-black text-[10px] px-2.5 py-0.5 rounded-md tracking-wider uppercase shadow-md">
          {tournament.gameType} {tournament.matchType} • {mapName}
        </div>

        {/* Status Tag */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
          {isUpcoming && (
            <span className="bg-emerald-500 text-black font-heading font-black text-[10px] px-2 py-0.5 rounded-full shadow flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
              {getStartText()}
            </span>
          )}
          {isOngoing && (
            <span className="bg-[#F5C400] text-black font-heading font-black text-[10px] px-2 py-0.5 rounded-full shadow animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              LIVE
            </span>
          )}
          {isCompleted && (
            <span className="bg-slate-700 text-slate-300 font-heading font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
              COMPLETED
            </span>
          )}
        </div>

        {/* Free Fire Max Watermark */}
        <div className="absolute bottom-1.5 left-2.5 text-[9px] font-mono font-bold tracking-widest text-[#F5C400]/80 uppercase">
          FREE FIRE MAX • {tournament.matchId || '#MATCH'}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 space-y-2.5">
        {/* Title & Time */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3
              onClick={goToDetails}
              className="font-heading font-black text-white text-xs sm:text-sm leading-tight truncate hover:text-[#F5C400] transition-colors cursor-pointer"
            >
              {tournament.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
              <Clock className="w-3 h-3 text-[#F5C400] shrink-0" />
              <span className="truncate">{tournament.matchTime}</span>
            </div>
          </div>

          <button
            onClick={goToDetails}
            className="text-[10px] text-[#F5C400] hover:underline font-bold shrink-0 flex items-center gap-0.5 pt-0.5"
          >
            <span>Rules</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* 3-Column Compact Stats Strip */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#0b0e14] py-1.5 px-2 rounded-xl border border-[#1f2738] text-center">
          {/* Prize Pool */}
          <div>
            <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">PRIZE POOL</span>
            <span className="font-heading font-black text-xs sm:text-sm text-[#F5C400]">
              ₹{tournament.prizePool}
            </span>
          </div>

          {/* Per Kill / Win Prize */}
          <div className="border-x border-[#1f2738]">
            <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">
              {tournament.perKill > 0 ? 'PER KILL' : 'WIN PRIZE'}
            </span>
            <span className="font-heading font-black text-xs sm:text-sm text-white">
              ₹{tournament.perKill > 0 ? tournament.perKill : (tournament.winPrize || tournament.prizePool)}
            </span>
          </div>

          {/* Entry Fee */}
          <div>
            <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold block">ENTRY</span>
            <span className="font-heading font-black text-xs sm:text-sm text-[#F5C400]">
              ₹{tournament.entryFee}
            </span>
          </div>
        </div>

        {/* Progress Bar & Spots Left */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-semibold">
            <span className={spotsLeft > 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {spotsLeft > 0 ? `${spotsLeft} Spots Left` : 'Match Full'}
            </span>
            <span className="text-slate-400">
              {joinedSpots}/{totalSpots}
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0b0e14] rounded-full overflow-hidden border border-[#1f2738]">
            <div
              className="h-full bg-gradient-to-r from-[#F5C400] to-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {hasJoined ? (
          <button
            onClick={() => onViewRoom(tournament)}
            className="w-full py-2 rounded-xl bg-[#1a202e] hover:bg-[#222a3d] border border-[#F5C400]/50 text-[#F5C400] font-heading font-black text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all shadow"
          >
            <Award className="w-3.5 h-3.5 text-[#F5C400]" />
            <span>VIEW ROOM ID & PASSWORD</span>
          </button>
        ) : isCompleted ? (
          <button
            disabled
            className="w-full py-2 rounded-xl bg-slate-800 text-slate-500 font-heading font-bold text-xs cursor-not-allowed"
          >
            MATCH COMPLETED
          </button>
        ) : spotsLeft === 0 ? (
          <button
            disabled
            className="w-full py-2 rounded-xl bg-slate-800 text-slate-500 font-heading font-bold text-xs cursor-not-allowed"
          >
            ROOM FULL
          </button>
        ) : (
          <button
            onClick={() => onJoin(tournament)}
            className="w-full py-2 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Join Match (₹{tournament.entryFee})</span>
          </button>
        )}
      </div>
    </div>
  );
}
