import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Award, Flame, Crosshair, Crown } from 'lucide-react';
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
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      <SEO
        title="Leaderboard & Top Players"
        description="See top Free Fire players, highest kill scorers, and cash tournament earnings on RushX Esports."
        path="/leaderboard"
      />
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
              Top Players &amp; Rankings
            </h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {!isVisible ? (
          <div className="py-20 text-center bg-[#10051e] border border-purple-900/50 rounded-3xl p-6 space-y-3 shadow-xl">
            <Trophy className="w-12 h-12 text-amber-500/50 mx-auto" />
            <h3 className="font-heading font-bold text-lg text-white">
              Leaderboard Paused
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
              {noticeMessage || 'Leaderboard visibility is currently turned off by Admin. It will unlock once active tournament results are verified.'}
            </p>
            <button
              onClick={() => navigate('/tournaments')}
              className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              Play Tournaments
            </button>
          </div>
        ) : loading ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-400">Loading top rankings...</p>
          </div>
        ) : leaders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 bg-[#10051e] rounded-2xl border border-purple-900/40 p-6 space-y-2 shadow-lg">
            <Trophy className="w-8 h-8 text-amber-400/40 mx-auto mb-2" />
            <p className="font-semibold text-white">No matches played yet!</p>
            <p className="text-slate-400">Play a tournament match to claim the #1 Champion rank on the leaderboard.</p>
          </div>
        ) : (
          <>
            {/* Top Champion Podium */}
            <div className="pt-2 pb-2">
              {leaders.length >= 3 ? (
                <div className="grid grid-cols-3 gap-2 items-end">
                  {/* Rank 2 */}
                  <div className="bg-[#10051e] border border-slate-700/60 rounded-2xl p-2.5 text-center flex flex-col items-center shadow-md">
                    <div className="relative mb-1">
    <img src={getPlayerAvatar(leaders[1])} alt="Rank 2" className="w-12 h-12 rounded-full border-2 border-slate-400 object-cover p-0.5 bg-black" />
    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 text-slate-900 font-heading font-black text-xs flex items-center justify-center border border-black">2</span>
  </div>
                    <p className="font-heading font-bold text-xs text-white truncate max-w-full">
                      {leaders[1].username}
                    </p>
                    <span className="text-[10px] text-amber-400 font-bold mt-0.5">
                      ₹{leaders[1].totalEarned}
                    </span>
                    <span className="text-[9px] text-slate-400">{leaders[1].totalKills} Kills</span>
                  </div>

                  {/* Rank 1 (Champion) */}
                  <div className="bg-gradient-to-b from-[#240a4b] to-[#14062a] border-2 border-amber-400/80 rounded-2xl p-3 text-center flex flex-col items-center shadow-xl shadow-purple-950/60 -translate-y-2 relative">
                    <div className="relative mb-1.5">
    <img src={getPlayerAvatar(leaders[0])} alt="Champion" className="w-16 h-16 rounded-full border-2 border-amber-400 object-cover p-0.5 bg-black ring-4 ring-amber-400/40" />
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow">
      <Crown className="w-4 h-4 text-amber-950 fill-current" />
    </div>
    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-heading font-black text-xs flex items-center justify-center border border-black">1</span>
  </div>
                    <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      #1 RANK
                    </span>
                    <p className="font-heading font-black text-sm text-white truncate max-w-full mt-1">
                      {leaders[0].username}
                    </p>
                    <span className="text-xs text-amber-300 font-extrabold">
                      ₹{leaders[0].totalEarned}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">{leaders[0].totalKills} Kills</span>
                  </div>

                  {/* Rank 3 */}
                  <div className="bg-[#10051e] border border-amber-800/60 rounded-2xl p-2.5 text-center flex flex-col items-center shadow-md">
                    <div className="relative mb-1">
    <img src={getPlayerAvatar(leaders[2])} alt="Rank 3" className="w-12 h-12 rounded-full border-2 border-amber-700 object-cover p-0.5 bg-black" />
    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-700 text-white font-heading font-black text-xs flex items-center justify-center border border-black">3</span>
  </div>
                    <p className="font-heading font-bold text-xs text-white truncate max-w-full">
                      {leaders[2].username}
                    </p>
                    <span className="text-[10px] text-amber-400 font-bold mt-0.5">
                      ₹{leaders[2].totalEarned}
                    </span>
                    <span className="text-[9px] text-slate-400">{leaders[2].totalKills} Kills</span>
                  </div>
                </div>
              ) : (
                /* Single / Two Players Podium */
                <div className="bg-gradient-to-b from-[#240a4b] to-[#14062a] border-2 border-amber-400/80 rounded-3xl p-5 text-center flex flex-col items-center shadow-xl shadow-purple-950/60 relative">
                  <div className="relative mb-2">
    <img src={getPlayerAvatar(leaders[0])} alt="Champion" className="w-18 h-18 rounded-full border-2 border-amber-400 object-cover p-0.5 bg-black ring-4 ring-amber-400/40" />
    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow">
      <Crown className="w-4 h-4 text-amber-950 fill-current" />
    </div>
  </div>
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    CURRENT LEADERBOARD CHAMPION
                  </span>
                  <h3 className="font-heading font-black text-lg text-white mt-1.5">
                    {leaders[0].username}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    IGN: {leaders[0].ffIgn} • {leaders[0].matchesPlayed} Match Played
                  </p>
                  <div className="flex items-center gap-4 mt-3 bg-[#0d041c] px-4 py-2 rounded-xl border border-purple-800/60">
                    <span className="text-sm font-bold text-amber-400">Total Won: ₹{leaders[0].totalEarned}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-sm font-bold text-emerald-400">{leaders[0].totalKills} Kills</span>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Rankings List */}
            <div className="space-y-2">
              <h2 className="font-heading font-bold text-xs text-purple-300 uppercase tracking-wider px-1">
                Verified Players Ranking
              </h2>

              {leaders.map((player, idx) => (
                <div
                  key={player.id || player.username || idx}
                  className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-3 flex items-center justify-between shadow-sm hover:border-purple-600/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-heading font-extrabold text-xs shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : idx === 1
                          ? 'bg-slate-300 text-slate-900'
                          : idx === 2
                          ? 'bg-amber-700 text-white'
                          : 'bg-purple-950 text-purple-300 border border-purple-800/50'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <img src={getPlayerAvatar(player)} alt="Avatar" className="w-9 h-9 rounded-full border border-purple-500/50 object-cover shrink-0" />

                    <div>
                      <h3 className="font-heading font-bold text-sm text-white">
                        {player.username}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        IGN: {player.ffIgn} • {player.matchesPlayed} Matches
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 font-heading font-black text-sm justify-end">
                      <span>₹{player.totalEarned}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold justify-end">
                      <Crosshair className="w-3 h-3" />
                      <span>{player.totalKills} Kills</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
