import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementTicker from '../components/AnnouncementTicker';
import SEO from '../components/SEO';
import HeroBannerSlider from '../components/HeroBannerSlider';
import RoomModal from '../components/RoomModal';
import {
  RefreshCw,
  Trophy,
  Award,
  KeyRound,
  Clock,
  Swords,
  ChevronRight,
  Flame,
  CheckCircle2,
  AlertCircle,
  Zap,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [joinedMatches, setJoinedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForRoom, setSelectedForRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [nowTs, setNowTs] = useState(Date.now());

  const fetchMyJoinedMatches = async (isBackground = false) => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      if (!isBackground) setLoading(true);
      const res = await fetch('/api/my-matches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJoinedMatches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJoinedMatches();
    const interval = setInterval(() => {
      setNowTs(Date.now());
      fetchMyJoinedMatches(true);
    }, 4000);

    const onFocus = () => {
      setNowTs(Date.now());
      fetchMyJoinedMatches(true);
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [token]);

  // Active / Upcoming joined tournaments
  const activeJoined = joinedMatches.filter(
    (m) => m.status === 'UPCOMING' || m.status === 'ONGOING'
  );

  // Completed tournament history for this player
  const historyJoined = joinedMatches.filter((m) => m.status === 'COMPLETED');

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="RushX Esports • Play Free Fire & Win Cash"
        description="Join verified Free Fire Solo, Duo & CS Tournaments. Win cash prizes daily with instant payouts."
        path="/"
      />

      {/* Announcement Marquee Ticker */}
      <AnnouncementTicker />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="mx-4 mt-3 bg-emerald-950/90 border border-emerald-500/80 p-3 rounded-xl text-emerald-200 text-xs font-bold animate-bounce flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Dynamic Hero Banner Slider (Tournaments, Instagram, Telegram, YouTube, Contact) */}
        <HeroBannerSlider onJoinClick={() => navigate('/tournaments')} />

        {/* SECTION 1: ACTIVE JOINED TOURNAMENTS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#F5C400] text-black flex items-center justify-center font-bold">
                <Award className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-heading font-black text-sm tracking-wide text-white uppercase">
                My Joined Tournaments ({activeJoined.length})
              </h2>
            </div>

            <button
              onClick={() => fetchMyJoinedMatches()}
              className="text-slate-400 hover:text-white p-1"
              title="Refresh Joined Matches"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#F5C400]' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-10 text-center space-y-2 bg-[#121620] border border-[#1f2738] rounded-2xl p-4">
              <RefreshCw className="w-6 h-6 text-[#F5C400] animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading your joined tournaments...</p>
            </div>
          ) : activeJoined.length > 0 ? (
            <div className="space-y-2.5">
              {activeJoined.map((match) => (
                <div
                  key={match.id}
                  className="bg-[#121620] border-2 border-[#F5C400]/50 rounded-2xl p-3.5 shadow-xl space-y-2.5 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                          {match.status === 'ONGOING' ? 'LIVE MATCH' : 'REGISTERED'}
                        </span>
                        <span className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#F5C400]" />
                          {match.matchTime}
                        </span>
                        <span className="text-[9px] text-[#F5C400] font-bold bg-[#0b0e14] px-1.5 py-0.5 rounded border border-[#1f2738]">
                          {match.gameType} {match.matchType} • {match.map || 'BERMUDA'}
                        </span>
                      </div>

                      <h3
                        onClick={() => navigate(`/contest/${match.id}`)}
                        className="font-heading font-black text-xs sm:text-sm text-white truncate hover:text-[#F5C400] cursor-pointer"
                      >
                        {match.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => setSelectedForRoom(match)}
                      className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/20 uppercase tracking-wider shrink-0 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Room ID</span>
                    </button>
                  </div>

                  {/* Room Quick Peek */}
                  <div className="bg-[#0b0e14] rounded-xl px-3 py-2 border border-[#1f2738] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span>Room ID:</span>
                      <span className="text-[#F5C400] font-bold">
                        {match.roomId ? match.roomId : 'Generating 10-15m before match'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/contest/${match.id}`)}
                      className="text-[10px] text-[#F5C400] hover:underline font-bold"
                    >
                      View Lobby →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State if No Active Joined Matches */
            <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-5 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-[#0b0e14] border border-[#F5C400]/40 flex items-center justify-center mx-auto text-[#F5C400]">
                <Swords className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-black text-sm text-white">
                  No Active Registered Matches
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  You haven't joined any upcoming tournaments. Join Solo, Duo, or CS Headshot tournaments to compete and win real cash prizes!
                </p>
              </div>

              <button
                onClick={() => navigate('/tournaments')}
                className="py-2.5 px-6 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Browse Tournaments</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: JOINED TOURNAMENT HISTORY */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#1a202e] text-[#F5C400] border border-[#1f2738] flex items-center justify-center font-bold">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <h2 className="font-heading font-black text-sm tracking-wide text-white uppercase">
                Joined Tournament History ({historyJoined.length})
              </h2>
            </div>

            {historyJoined.length > 0 && (
              <button
                onClick={() => navigate('/my-matches?tab=completed')}
                className="text-[11px] text-[#F5C400] hover:text-[#FFD000] font-bold flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {historyJoined.length > 0 ? (
            <div className="space-y-2">
              {historyJoined.slice(0, 4).map((match) => {
                const kills = Number(match.joinedRecord?.kills) || 0;
                const winAmt = Number(match.joinedRecord?.winAmount) || 0;

                return (
                  <div
                    key={match.id}
                    onClick={() => navigate(`/contest/${match.id}`)}
                    className="bg-[#121620] border border-[#1f2738] hover:border-[#F5C400]/40 rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all shadow"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          COMPLETED
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {match.matchTime}
                        </span>
                      </div>
                      <h4 className="font-heading font-black text-xs text-white truncate">
                        {match.title}
                      </h4>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-xs font-heading font-black text-[#F5C400] block">
                        ₹{winAmt} Won
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        {kills} Kills
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#121620] border border-[#1f2738] rounded-xl p-4 text-center text-xs text-slate-400">
              No completed matches yet. Complete matches to see your rank, kills, and cash prizes won.
            </div>
          )}
        </div>

        {/* Big CTA Banner to go to Tournaments Section */}
        <div
          onClick={() => navigate('/tournaments')}
          className="bg-gradient-to-r from-[#172033] via-[#121620] to-[#0f1420] border border-[#F5C400]/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-xl hover:border-[#F5C400] transition-all group"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#F5C400] uppercase font-bold">
              OPEN CONTESTS
            </span>
            <h4 className="font-heading font-black text-sm text-white group-hover:text-[#F5C400] transition-colors">
              Explore All Tournaments →
            </h4>
            <p className="text-[10.5px] text-slate-400">
              Solo, Duo & CS Headshot Matches Open for Registration
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F5C400] text-black flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
            <Swords className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {selectedForRoom && (
        <RoomModal
          tournament={selectedForRoom}
          onClose={() => setSelectedForRoom(null)}
        />
      )}
    </div>
  );
}
