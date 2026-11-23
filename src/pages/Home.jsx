import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementTicker from '../components/AnnouncementTicker';
import SEO from '../components/SEO';
import TournamentCard from '../components/TournamentCard';
import JoinModal from '../components/JoinModal';
import RoomModal from '../components/RoomModal';
import {
  RefreshCw,
  Crown,
  Users,
  Shield,
  Target,
  Flame,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [userJoinedIds, setUserJoinedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 'ALL', 'SOLO', 'DUO', 'SQUAD', 'CS_1V1', 'LW_1V1'
  const [selectedForJoin, setSelectedForJoin] = useState(null);
  const [selectedForRoom, setSelectedForRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [nowTs, setNowTs] = useState(Date.now());

  const categories = [
    { id: 'SOLO', label: 'Solo', icon: Crown, category: 'BR_FULL_MAP', matchType: 'SOLO' },
    { id: 'DUO', label: 'Duo', icon: Users, category: 'BR_FULL_MAP', matchType: 'DUO' },
    { id: 'SQUAD', label: 'Squad', icon: Shield, category: 'BR_FULL_MAP', matchType: 'SQUAD' },
    { id: 'CS_1V1', label: 'CS 1v1', icon: Target, category: 'CS_HEADSHOT', matchType: '' },
    { id: 'LW_1V1', label: 'Lone Wolf 1v1', icon: Flame, category: 'LW_HEADSHOT', matchType: '' }
  ];

  const loadTournaments = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/tournaments?status=UPCOMING', { headers });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);
      const joined = list.filter(t => t.isJoined).map(t => t.id);
      setUserJoinedIds(joined);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
    const interval = setInterval(() => {
      setNowTs(Date.now());
      loadTournaments(true);
    }, 4000);

    const onFocus = () => {
      setNowTs(Date.now());
      loadTournaments(true);
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [token]);

  const handleJoinedSuccess = (data) => {
    setToastMessage(data.message || 'Joined successfully!');
    setTimeout(() => setToastMessage(''), 4000);
    loadTournaments();
  };

  const handleCategoryClick = (catId) => {
    if (selectedCategory === catId) {
      setSelectedCategory('ALL'); // Toggle off if clicked again
    } else {
      setSelectedCategory(catId);
    }
  };

  // Strictly filter out expired tournaments (real-time expiry)
  const activeUpcoming = tournaments.filter(t => {
    if (t.status !== 'UPCOMING') return false;
    const sched = t.scheduledAt ? new Date(t.scheduledAt).getTime() : 0;
    if (sched > 0 && sched <= nowTs) return false;

    if (selectedCategory === 'ALL') return true;

    if (selectedCategory === 'SOLO') {
      return (t.category === 'BR_FULL_MAP' || !t.category) && (t.matchType === 'SOLO' || !t.matchType);
    }
    if (selectedCategory === 'DUO') {
      return (t.category === 'BR_FULL_MAP' || !t.category) && t.matchType === 'DUO';
    }
    if (selectedCategory === 'SQUAD') {
      return (t.category === 'BR_FULL_MAP' || !t.category) && t.matchType === 'SQUAD';
    }
    if (selectedCategory === 'CS_1V1') {
      return t.category === 'CS_HEADSHOT' || t.category === 'CS_1V1' || (t.gameType && t.gameType.includes('CS'));
    }
    if (selectedCategory === 'LW_1V1') {
      return t.category === 'LW_HEADSHOT' || (t.gameType && t.gameType.includes('LONE'));
    }
    return true;
  });

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Play Free Fire Tournaments & Win Cash"
        description="Join India's most trusted Free Fire esports tournaments. Compete in Solo, Duo, Squad, Clash Squad, and Lone Wolf with instant UPI payouts."
        path="/"
      />

      {/* Announcement Marquee Ticker */}
      <AnnouncementTicker />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="mx-4 mt-3 bg-emerald-950/90 border border-emerald-500/80 p-3 rounded-xl text-emerald-200 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Screen 4 Hero Banner: DAILY TOURNAMENTS */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#171b26] via-[#121620] to-[#0f131a] border border-[#1f2738] p-5 shadow-2xl flex items-center justify-between min-h-[170px]">
          {/* Subtle gold glow */}
          <div className="absolute top-0 right-1/4 w-36 h-36 bg-[#F5C400]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-1.5 max-w-[62%]">
            <span className="text-[10px] font-mono tracking-widest text-[#F5C400] font-black uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F5C400]" />
              RUSHX ESPORTS
            </span>
            <h2 className="font-heading font-black text-2xl text-white tracking-wide leading-tight drop-shadow">
              DAILY <br />TOURNAMENTS
            </h2>
            <p className="text-[11px] font-bold text-slate-300 tracking-wider">
              PLAY • WIN • EARN
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate('/tournaments')}
                className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
              >
                JOIN NOW
              </button>
            </div>
          </div>

          {/* Hero Character Art */}
          <div className="relative z-10 w-28 h-32 flex items-center justify-center shrink-0">
            <img
              src="/poster-br-solo.jpg"
              alt="Esports Champion"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/logo.svg';
              }}
              className="w-full h-full object-cover rounded-xl border border-[#F5C400]/40 shadow-xl filter brightness-105"
            />
          </div>
        </div>

        {/* Screen 4 Category Selectors (Solo, Duo, Squad, CS 1v1, Lone Wolf 1v1) */}
        <div>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <h3 className="font-heading font-extrabold text-sm text-white tracking-wide">
              Tournament Categories
            </h3>
            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="text-[11px] text-[#F5C400] hover:underline font-bold"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#F5C400] text-black shadow-lg shadow-amber-500/25 scale-[1.03] border-2 border-[#FFD000]'
                      : 'bg-[#121620] hover:bg-[#1a202e] text-slate-300 border border-[#1f2738]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center mb-1 transition-colors ${
                      isSelected
                        ? 'bg-black text-[#F5C400]'
                        : 'bg-[#1a202e] text-[#F5C400]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-heading font-black tracking-wide text-center leading-tight truncate max-w-full ${
                    isSelected ? 'text-black' : 'text-slate-300'
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Screen 4: Upcoming Tournaments Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-base tracking-wide text-white">
                Upcoming Tournaments
              </h3>
              {selectedCategory !== 'ALL' && (
                <span className="text-[10px] font-extrabold bg-[#F5C400]/20 text-[#F5C400] border border-[#F5C400]/40 px-2 py-0.5 rounded-full">
                  {categories.find(c => c.id === selectedCategory)?.label}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                if (selectedCategory === 'ALL') {
                  navigate('/tournaments');
                } else {
                  const c = categories.find(cat => cat.id === selectedCategory);
                  navigate(`/tournaments?category=${encodeURIComponent(c?.category || '')}&matchType=${encodeURIComponent(c?.matchType || '')}`);
                }
              }}
              className="text-xs text-[#F5C400] hover:text-[#FFD000] font-bold flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tournament Cards List */}
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#F5C400] animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading live tournaments...</p>
            </div>
          ) : activeUpcoming.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-[#121620] border border-[#1f2738] rounded-2xl p-6">
              <AlertCircle className="w-9 h-9 text-slate-500 mx-auto" />
              <h4 className="font-heading font-bold text-sm text-white">
                No Upcoming {selectedCategory !== 'ALL' ? categories.find(c => c.id === selectedCategory)?.label : ''} Matches
              </h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No matches currently scheduled in this category. Reset the filter to view all upcoming tournaments.
              </p>
              {selectedCategory !== 'ALL' && (
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  className="mt-2 text-xs text-[#F5C400] font-bold hover:underline"
                >
                  Show All Tournaments
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {activeUpcoming.map((tournament) => {
                const hasJoined = Boolean(tournament.isJoined) || userJoinedIds.includes(tournament.id);
                return (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    hasJoined={hasJoined}
                    onJoin={(t) => setSelectedForJoin(t)}
                    onViewRoom={(t) => setSelectedForRoom(t)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Join Tournament Modal */}
      <JoinModal
        isOpen={Boolean(selectedForJoin)}
        onClose={() => setSelectedForJoin(null)}
        tournament={selectedForJoin}
        onSuccess={handleJoinedSuccess}
      />

      {/* View Room ID & Password Modal */}
      <RoomModal
        isOpen={Boolean(selectedForRoom)}
        onClose={() => setSelectedForRoom(null)}
        tournament={selectedForRoom}
      />
    </div>
  );
}
