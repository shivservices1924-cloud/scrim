import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, KeyRound, Award, AlertCircle, Crosshair } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoomModal from '../components/RoomModal';

export default function MyMatches() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const currentTab = searchParams.get('tab')?.toUpperCase() || 'UPCOMING';

  const fetchMatches = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/my-matches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMatches(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMatches();
  }, [token]);

  const filteredMatches = matches.filter(m => m.status === currentTab);

  const handleTabChange = (tabName) => {
    searchParams.set('tab', tabName.toLowerCase());
    setSearchParams(searchParams);
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#080d1a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a1124]/95 backdrop-blur-md border-b border-blue-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 flex items-center justify-center text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            My Registered Matches
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#0b142b] border-b border-blue-900/50 px-4 pt-2">
        <div className="flex items-center justify-around border-b border-slate-800">
          {[
            { id: 'ONGOING', label: 'Ongoing' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'COMPLETED', label: 'Completed' }
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2.5 font-heading text-sm font-bold tracking-wider relative transition-all ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-sm shadow-cyan-400"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading your matches...
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#0b1329] border border-blue-900/40 rounded-2xl p-6">
            <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="font-heading font-bold text-base text-white">
              No {currentTab.toLowerCase()} matches found
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You have not joined any {currentTab.toLowerCase()} tournaments.
            </p>
            <button
              onClick={() => navigate('/tournaments')}
              className="mt-2 py-2 px-5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          filteredMatches.map((m) => (
            <div
              key={m.id}
              className="bg-[#0b1329] border border-blue-900/60 rounded-2xl p-4 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-heading font-extrabold px-2 py-0.5 rounded uppercase">
                  {m.gameType} {m.matchType} • {m.map}
                </span>
                <span className="text-xs text-slate-400 font-mono">{m.matchId}</span>
              </div>

              <h3 className="font-heading font-bold text-white text-base leading-snug">
                {m.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-blue-300">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>{m.matchTime}</span>
              </div>

              {/* Joined Credentials Box */}
              <div className="bg-[#070d1e] p-2.5 rounded-xl border border-blue-900/40 text-xs space-y-1 text-slate-300">
                <div>
                  <span className="text-slate-400">Registered FF IGN: </span>
                  <span className="font-bold text-white">{m.joinedRecord?.ffIgn}</span> (UID: {m.joinedRecord?.ffUid})
                </div>
                {m.joinedRecord?.teammateIgn && (
                  <div>
                    <span className="text-slate-400">Teammate: </span>
                    <span className="font-bold text-white">{m.joinedRecord?.teammateIgn}</span> (UID: {m.joinedRecord?.teammateUid})
                  </div>
                )}
              </div>

              {/* Status Specific Actions */}
              {m.status === 'COMPLETED' ? (
                <div className="space-y-2">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <Crosshair className="w-4 h-4" />
                      <span>Your Kills: {m.joinedRecord?.kills || 0}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase">Won:</span>
                      <p className="font-heading font-black text-amber-400 text-base leading-none">
                        ₹{m.joinedRecord?.winAmount || 0}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/contest/${m.id}`)}
                    className="w-full py-2 rounded-xl bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 text-cyan-300 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>View Match Result Details</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/contest/${m.id}`)}
                    className="py-2.5 rounded-xl bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 text-cyan-300 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Contest Page</span>
                  </button>
                  <button
                    onClick={() => setSelectedRoom(m)}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-heading font-extrabold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Room ID & Pass</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <RoomModal
        tournament={selectedRoom}
        isOpen={Boolean(selectedRoom)}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}
