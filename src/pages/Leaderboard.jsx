import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Crown, Crosshair, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { getPlayerAvatar } from '../utils/avatar';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [noticeMessage, setNoticeMessage] = useState('');

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data && data.visible === false) {
          setIsVisible(false);
          setNoticeMessage(data.message || 'Leaderboard is currently paused by Admin.');
          setLeaders([]);
        } else {
          setIsVisible(true);
          const list = Array.isArray(data) ? data : (data.leaderboard || []);
          setLeaders(list);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Leaderboard & Overall Rankings • RushX"
        description="See overall top Free Fire players, kill leaders, and tournament earnings on RushX Esports."
        path="/leaderboard"
      />

      {/* Screen 8 Header */}
      <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#F5C400]" />
            <h1 className="font-heading font-black text-white text-lg tracking-wide">
              Leaderboard
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!isVisible ? (
          <div className="py-20 text-center bg-[#121620] border border-[#1f2738] rounded-3xl p-6 space-y-3 shadow-xl">
            <Trophy className="w-12 h-12 text-[#F5C400]/50 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-white">
              Leaderboard Paused
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              {noticeMessage || 'Leaderboard visibility is currently paused by Admin.'}
            </p>
          </div>
        ) : loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-[#F5C400] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Loading overall rankings...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-[#121620] rounded-2xl border border-[#1f2738] p-6 space-y-2 shadow-lg">
            <Trophy className="w-8 h-8 text-[#F5C400]/50 mx-auto mb-2" />
            <p className="font-semibold text-white">No matches played yet!</p>
            <p className="text-slate-400">Compete in tournaments to claim your rank on the overall leaderboard.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header (Rank, Player, Kills, Points/Earned) */}
            <div className="grid grid-cols-12 px-3 py-2 text-[11px] font-heading font-black text-slate-400 uppercase tracking-wider border-b border-[#1f2738]">
              <span className="col-span-2 text-center">Rank</span>
              <span className="col-span-5">Player</span>
              <span className="col-span-2 text-center">Kills</span>
              <span className="col-span-3 text-right">Points</span>
            </div>

            {/* Overall Rankings Rows */}
            <div className="space-y-2">
              {leaders.map((player, idx) => {
                const isFirst = idx === 0;
                const isSecond = idx === 1;
                const isThird = idx === 2;

                return (
                  <div
                    key={player.id || player.username || idx}
                    className={`grid grid-cols-12 items-center p-3 rounded-2xl border transition-all ${
                      isFirst
                        ? 'bg-[#171b26] border-[#F5C400] shadow-lg shadow-amber-500/10'
                        : isSecond
                        ? 'bg-[#121620] border-slate-500/50'
                        : isThird
                        ? 'bg-[#121620] border-amber-700/50'
                        : 'bg-[#121620] border-[#1f2738]'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className="col-span-2 flex items-center justify-center">
                      {isFirst ? (
                        <div className="w-7 h-7 rounded-full bg-[#F5C400] text-black font-heading font-black text-xs flex items-center justify-center shadow-md shadow-amber-500/30">
                          <Crown className="w-4 h-4 fill-current text-black" />
                        </div>
                      ) : isSecond ? (
                        <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-heading font-black text-xs flex items-center justify-center shadow">
                          2
                        </div>
                      ) : isThird ? (
                        <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-heading font-black text-xs flex items-center justify-center shadow">
                          3
                        </div>
                      ) : (
                        <span className="font-heading font-extrabold text-sm text-slate-400">
                          {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="col-span-5 flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={getPlayerAvatar(player)}
                        alt={player.username}
                        className={`w-9 h-9 rounded-full object-cover shrink-0 border ${
                          isFirst ? 'border-[#F5C400]' : 'border-slate-700'
                        }`}
                      />
                      <div className="truncate">
                        <h4 className="font-heading font-extrabold text-xs text-white truncate">
                          {player.username}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">
                          {player.ffIgn ? `IGN: ${player.ffIgn}` : `${player.matchesPlayed || 0} Matches`}
                        </p>
                      </div>
                    </div>

                    {/* Kills */}
                    <div className="col-span-2 text-center">
                      <span className="font-heading font-bold text-xs text-white">
                        {player.totalKills || 0}
                      </span>
                    </div>

                    {/* Points / Won */}
                    <div className="col-span-3 text-right">
                      <span className={`font-heading font-black text-sm ${
                        isFirst ? 'text-[#F5C400]' : 'text-slate-200'
                      }`}>
                        ₹{player.totalEarned || (Number(player.totalKills || 0) * 18)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
