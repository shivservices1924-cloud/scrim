import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Clock, MapPin, Users, Award, Zap, KeyRound, Lock, Unlock, ExternalLink } from 'lucide-react';
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

  // Format scheduled start countdown if available
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
    <div className="bg-[#121620] border border-[#1f2738] hover:border-[#F5C400]/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 group">
      {/* Banner & Title Header (Clickable to Contest Details) */}
      <div
        onClick={goToDetails}
        className="relative h-44 w-full bg-gradient-to-t from-[#121620] via-slate-900/60 to-transparent overflow-hidden cursor-pointer"
      >
        <img
          src={getTournamentPoster(tournament)}
          alt={tournament.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getTournamentPosterSvgFallback(tournament);
          }}
          className="w-full h-full object-cover object-center filter brightness-90 scale-100 group-hover:scale-105 transition-transform duration-300"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121620] via-[#121620]/40 to-transparent"></div>

        {/* Status Tag */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {isUpcoming && (
            <span className="bg-emerald-500/90 text-black font-heading font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
              {getStartText()}
            </span>
          )}
          {isOngoing && (
            <span className="bg-[#F5C400] text-black font-heading font-black text-xs px-2.5 py-0.5 rounded-full shadow-md animate-pulse flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              LIVE MATCH
            </span>
          )}
          {isCompleted && (
            <span className="bg-slate-700 text-slate-300 font-heading font-bold text-xs px-2.5 py-0.5 rounded-full shadow-md">
              COMPLETED
            </span>
          )}
        </div>

        {/* Header Tournament Type Badge */}
        <div className="absolute top-3 left-3 bg-[#F5C400] text-black font-heading font-black text-xs px-3 py-1 rounded-md tracking-wider uppercase shadow-lg shadow-amber-500/20">
          {tournament.gameType} {tournament.matchType} • {mapName}
        </div>

        {/* Rules Summary Box Overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/90 backdrop-blur-md rounded-lg p-2 border border-[#F5C400]/30 text-[10px] text-slate-200 leading-tight">
          <div className="flex items-center gap-1 text-[#F5C400] font-bold mb-0.5">
            <ShieldAlert className="w-3 h-3" />
            <span className="uppercase tracking-wider">MAP: BERMUDA • TOURNAMENT RULES:</span>
          </div>
          <p className="line-clamp-2 text-slate-300 font-medium">
            {tournament.rules || 'MAP: BERMUDA ONLY! BAN GUN: DOUBLE VECTOR, M79! MIN LEVEL 40! IDP TIME: 5 MIN BEFORE MATCH!'}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        {/* Match Title & Match ID */}
        <div>
          <h3
            onClick={goToDetails}
            className="font-heading font-extrabold text-white text-base leading-snug line-clamp-2 hover:text-[#F5C400] transition-colors cursor-pointer"
          >
            {tournament.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F5C400]" />
              <span className="font-medium text-slate-300">Time : {tournament.matchTime}</span>
            </div>
            <button
              onClick={goToDetails}
              className="text-[#F5C400] hover:text-[#FFD000] font-bold text-[11px] flex items-center gap-0.5"
            >
              <span>Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Admin Announcement Notice Message */}
        {tournament.noticeMsg && (
          <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2 shadow-sm">
            <span className="text-amber-400 text-sm">📢</span>
            <div className="leading-tight">
              <span className="font-bold text-amber-300">Admin Notice: </span>
              <span className="text-amber-100">{tournament.noticeMsg}</span>
            </div>
          </div>
        )}

        {/* 3x2 Details Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#0b0e14] p-3 rounded-xl border border-[#1f2738] text-center">
          {/* Row 1, Col 1: Prize Pool */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">PRIZE POOL</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[#F5C400] font-heading font-black text-sm">₹{tournament.prizePool}</span>
            </div>
          </div>

          {/* Row 1, Col 2: Per Kill / Win Prize */}
          <div className="flex flex-col items-center border-x border-[#1f2738]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">
              {tournament.perKill > 0 ? 'PER KILL' : 'WIN PRIZE'}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[#F5C400] font-heading font-black text-sm">
                ₹{tournament.perKill > 0 ? tournament.perKill : (tournament.winPrize || tournament.prizePool)}
              </span>
            </div>
          </div>

          {/* Row 1, Col 3: Entry Fee */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">ENTRY FEE</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[#F5C400] font-heading font-black text-sm">₹{tournament.entryFee}</span>
            </div>
          </div>

          {/* Row 2, Col 1: Type */}
          <div className="flex flex-col items-center pt-2 border-t border-[#1f2738]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">TYPE</span>
            <span className="font-heading font-bold text-xs text-white uppercase mt-0.5 truncate max-w-[85px]">
              {tournament.category ? tournament.category.replace('_', ' ') : tournament.gameType}
            </span>
          </div>

          {/* Row 2, Col 2: Entry Per Player */}
          <div className="flex flex-col items-center pt-2 border-t border-x border-[#1f2738]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">ENTRY/PLAYER</span>
            <span className="font-heading font-bold text-xs text-white mt-0.5">
              ₹{tournament.entryFee}
            </span>
          </div>

          {/* Row 2, Col 3: Map (BERMUDA ONLY) */}
          <div className="flex flex-col items-center pt-2 border-t border-[#1f2738]">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">MAP</span>
            <span className="font-heading font-bold text-xs text-emerald-400 uppercase truncate max-w-[80px] mt-0.5">
              {mapName}
            </span>
          </div>
        </div>

        {/* Progress Bar & Join Button Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-bold">
              {spotsLeft > 0 ? `Only ${spotsLeft} Spot Left` : 'All Spots Booked!'}
            </span>
            <span className="text-slate-400 font-medium">
              {joinedSpots}/{totalSpots}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F5C400] to-yellow-300 rounded-full transition-all duration-300"
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>

          {/* Action Button */}
          {hasJoined ? (
            <button
              onClick={() => onViewRoom(tournament)}
              className="w-full py-2.5 rounded-xl bg-[#1a202e] hover:bg-[#222a3d] border border-[#F5C400]/50 text-[#F5C400] font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <Award className="w-4 h-4 text-[#F5C400]" />
              YOU HAVE REGISTERED • VIEW ROOM ID
            </button>
          ) : isCompleted ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-heading font-bold text-sm cursor-not-allowed"
            >
              MATCH COMPLETED
            </button>
          ) : spotsLeft === 0 ? (
            <button
              disabled
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-heading font-bold text-sm cursor-not-allowed"
            >
              ROOM FULL
            </button>
          ) : (
            <button
              onClick={() => onJoin(tournament)}
              className="w-full py-2.5 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Join (₹{tournament.entryFee})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
