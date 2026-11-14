import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, AlertCircle, RefreshCw, Crosshair } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import JoinModal from '../components/JoinModal';
import RoomModal from '../components/RoomModal';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [userJoinedIds, setUserJoinedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tabs: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
  const currentTab = searchParams.get('tab')?.toUpperCase() || 'UPCOMING';
  const currentCategory = searchParams.get('category') || '';
  const currentGameType = searchParams.get('gameType') || '';

  // Selected modals
  const [selectedForJoin, setSelectedForJoin] = useState(null);
  const [selectedForRoom, setSelectedForRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [nowTs, setNowTs] = useState(Date.now());

  // Real-time ticker to auto-expire tournaments the minute match time passes
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      let url = `/api/tournaments?status=${currentTab}`;
      if (currentCategory) url += `&category=${currentCategory}`;
      if (currentGameType) url += `&gameType=${currentGameType}`;

      const token = localStorage.getItem('rushx_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(url, { headers });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);

      const joinedFromData = list.filter(t => t.isJoined).map(t => t.id);

      if (token) {
        const myRes = await fetch('/api/my-matches', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (myRes.ok) {
          const myMatches = await myRes.json();
          const allJoined = Array.from(new Set([...joinedFromData, ...myMatches.map(m => m.id)]));
          setUserJoinedIds(allJoined);
        } else {
          setUserJoinedIds(joinedFromData);
        }
      } else {
        setUserJoinedIds(joinedFromData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [currentTab, currentCategory, currentGameType]);

  const handleTabChange = (tabName) => {
    searchParams.set('tab', tabName.toLowerCase());
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (cat) => {
    if (cat) {
      searchParams.set('category', cat);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleJoinedSuccess = (data) => {
    setToastMessage(data.message || 'Joined successfully!');
    setTimeout(() => setToastMessage(''), 4000);
    fetchTournaments();
  };

  const pageTitle = currentCategory === 'CS_HEADSHOT'
    ? 'CS Headshot Contests'
    : currentCategory === 'LW_HEADSHOT'
    ? 'Lone Wolf Headshot'
    : currentCategory === 'CS_1V1'
    ? 'Clash Squad Contests'
    : 'BR Full Map Contests (Bermuda)';

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#080d1a] text-white">
      <SEO
        title="Tournaments & Matches"
        description="Browse upcoming and live Free Fire tournaments. Join Solo, Duo, Clash Squad, and Headshot matches on Bermuda map."
        path="/tournaments"
      />
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#0a1124]/95 backdrop-blur-md border-b border-blue-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="w-9 h-9 rounded-full bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 flex items-center justify-center text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-extrabold text-white text-base sm:text-lg tracking-wide leading-tight">
              {pageTitle}
            </h1>
            <p className="text-[11px] text-emerald-400 font-bold">Map: BERMUDA ONLY</p>
          </div>
        </div>

        <button
          onClick={fetchTournaments}
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh Tournaments"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="bg-[#080d1e] border-b border-blue-900/40 px-3 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {[
          { id: '', label: 'All Bermuda' },
          { id: 'BR_FULL_MAP', label: 'BR Full Map' },
          { id: 'CS_HEADSHOT', label: '🎯 CS Headshot' },
          { id: 'LW_HEADSHOT', label: '🐺 LW Headshot' },
          { id: 'CS_1V1', label: 'CS Normal' }
        ].map(cat => {
          const isSelected = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#0f172a] text-slate-400 border border-blue-900/50 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Tabs: Ongoing | Upcoming | Resulted */}
      <div className="bg-[#0b142b] border-b border-blue-900/50 px-4 pt-2">
        <div className="flex items-center justify-around border-b border-slate-800">
          {[
            { id: 'ONGOING', label: 'Ongoing' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'COMPLETED', label: 'Resulted' }
          ].map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2.5 font-heading text-sm font-bold tracking-wider relative transition-all ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
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

      {/* Toast Alert */}
      {toastMessage && (
        <div className="m-4 bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold animate-bounce flex items-center gap-2">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Matches List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading contests...</p>
          </div>
        ) : (() => {
          // Rule: In UPCOMING tab, auto-hide matches whose time has passed
          // In ONGOING/COMPLETED tabs, only show for registered players
          const displayed = tournaments.filter(t => {
            if (currentTab === 'UPCOMING') {
              const schedTime = t.scheduledAt ? new Date(t.scheduledAt).getTime() : 0;
              if (schedTime > 0 && schedTime <= nowTs) {
                return false;
              }
              return true;
            }
            if (currentTab === 'ONGOING' || currentTab === 'COMPLETED') {
              return Boolean(t.isJoined) || userJoinedIds.includes(t.id);
            }
            return true;
          });

          if (displayed.length === 0) {
            return (
              <div className="py-16 text-center space-y-3 bg-[#0b1329] border border-blue-900/40 rounded-2xl p-6">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-heading font-bold text-base text-white">
                  {currentTab === 'UPCOMING'
                    ? 'No Upcoming Matches Found'
                    : `No Registered ${currentTab === 'ONGOING' ? 'Ongoing' : 'Completed'} Matches`}
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {currentTab === 'UPCOMING'
                    ? 'There are currently no upcoming matches scheduled in this category.'
                    : `Ongoing and Completed matches appear here for all tournaments you have joined.`}
                </p>
                {currentTab !== 'UPCOMING' && (
                  <button
                    onClick={() => handleTabChange('UPCOMING')}
                    className="mt-2 py-2 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs shadow-md transition-all"
                  >
                    Browse Upcoming Matches
                  </button>
                )}
              </div>
            );
          }

          return displayed.map((tournament) => {
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
          });
        })()}
      </div>

      {/* Join Modal */}
      <JoinModal
        tournament={selectedForJoin}
        isOpen={Boolean(selectedForJoin)}
        onClose={() => setSelectedForJoin(null)}
        onJoinedSuccess={handleJoinedSuccess}
      />

      {/* Room Details Modal */}
      <RoomModal
        tournament={selectedForRoom}
        isOpen={Boolean(selectedForRoom)}
        onClose={() => setSelectedForRoom(null)}
      />
    </div>
  );
}
