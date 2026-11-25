import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, AlertCircle, RefreshCw, Crosshair } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import JoinModal from '../components/JoinModal';
import RoomModal from '../components/RoomModal';
import { useAuth } from '../context/AuthContext';
import { isTournamentVisibleToUser } from '../utils/time';
import SEO from '../components/SEO';

export default function Tournaments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tournaments, setTournaments] = useState([]);
  const [userJoinedIds, setUserJoinedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category and game type filters
  const currentCategory = searchParams.get('category') || '';
  const currentMatchType = searchParams.get('matchType') || '';
  const currentGameType = searchParams.get('gameType') || '';

  // Selected modals
  const [selectedForJoin, setSelectedForJoin] = useState(null);
  const [selectedForRoom, setSelectedForRoom] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [nowTs, setNowTs] = useState(Date.now());

  // Real-time auto-refresh & ticker for instant smooth updates without waiting
  useEffect(() => {
    const interval = setInterval(() => {
      setNowTs(Date.now());
      fetchTournaments(true);
    }, 4000);

    const onFocus = () => {
      setNowTs(Date.now());
      fetchTournaments(true);
    };

    const onCustomUpdate = () => {
      fetchTournaments(true);
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('rushx_tournament_update', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('rushx_tournament_update', onCustomUpdate);
    };
  }, [currentCategory, currentMatchType, currentGameType]);

  const fetchTournaments = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      // Strictly upcoming tournaments for browsing & joining
      let url = `/api/tournaments?status=UPCOMING`;
      if (currentCategory) url += `&category=${encodeURIComponent(currentCategory)}`;
      if (currentMatchType) url += `&matchType=${encodeURIComponent(currentMatchType)}`;
      if (currentGameType) url += `&gameType=${encodeURIComponent(currentGameType)}`;

      const token = localStorage.getItem('rushx_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(url, { headers });
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setTournaments(list);

      const joinedFromData = list.filter(t => t.isJoined).map(t => t.id);
      setUserJoinedIds(joinedFromData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [currentCategory, currentMatchType, currentGameType]);

  const handleFilterChange = (cat, matchType = '') => {
    if (cat) {
      searchParams.set('category', cat);
    } else {
      searchParams.delete('category');
    }
    if (matchType) {
      searchParams.set('matchType', matchType);
    } else {
      searchParams.delete('matchType');
    }
    setSearchParams(searchParams);
  };

  const handleJoinedSuccess = (data) => {
    setToastMessage(data.message || 'Joined successfully!');
    setTimeout(() => setToastMessage(''), 4000);
    fetchTournaments();
  };

  const pageTitle = (currentCategory === 'BR_FULL_MAP' && currentMatchType === 'SOLO')
    ? 'BR Solo Contests (Bermuda)'
    : (currentCategory === 'BR_FULL_MAP' && currentMatchType === 'DUO')
      ? 'BR Duo Contests (Bermuda)'
      : currentCategory === 'CS_HEADSHOT'
        ? 'CS Headshot Contests'
        : currentCategory === 'LW_HEADSHOT'
          ? 'Lone Wolf Headshot'
          : currentCategory === 'CS_1V1'
            ? 'Clash Squad Contests'
            : currentMatchType === 'DUO'
              ? 'BR Duo Contests'
              : currentMatchType === 'SOLO'
                ? 'BR Solo Contests'
                : 'All Bermuda Contests';

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Tournaments & Matches"
        description="Browse upcoming and live Free Fire tournaments. Join Solo, Duo, Clash Squad, and Headshot matches on Bermuda map."
        path="/tournaments"
      />
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-heading font-black text-white text-base sm:text-lg tracking-wide leading-tight">
              Tournaments
            </h1>
            <p className="text-[11px] text-[#F5C400] font-bold">Free Fire Bermuda Contests</p>
          </div>
        </div>

        <button
          onClick={fetchTournaments}
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh Tournaments"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F5C400]' : ''}`} />
        </button>
      </div>

      {/* Category Filter Chips (Screen 5: All, Solo, Duo, Squad, CS 1v1, Lone Wolf) */}
      <div className="bg-[#0b0e14] border-b border-[#1f2738] px-3 py-2.5 overflow-x-auto flex items-center gap-2 no-scrollbar">
        {[
          { id: '', matchType: '', label: 'All' },
          { id: 'BR_FULL_MAP', matchType: 'SOLO', label: 'Solo' },
          { id: 'BR_FULL_MAP', matchType: 'DUO', label: 'Duo' },
          { id: 'BR_FULL_MAP', matchType: 'SQUAD', label: 'Squad' },
          { id: 'CS_HEADSHOT', matchType: '', label: 'CS 1v1' },
          { id: 'LW_HEADSHOT', matchType: '', label: 'Lone Wolf' }
        ].map(cat => {
          const isSelected = (currentCategory === cat.id) && (currentMatchType === cat.matchType);
          return (
            <button
              key={`${cat.id}_${cat.matchType}`}
              onClick={() => handleFilterChange(cat.id, cat.matchType)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-black whitespace-nowrap transition-all ${isSelected
                ? 'bg-[#F5C400] text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#121620] text-slate-400 border border-[#1f2738] hover:text-white'
                }`}
            >
              {cat.label}
            </button>
          );
        })}
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
            <RefreshCw className="w-8 h-8 text-[#F5C400] animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading contests...</p>
          </div>
        ) : (() => {
          // Strictly upcoming matches that haven't expired for non-joined players & match active filters
          const displayed = tournaments.filter(t => {
            if (t.status !== 'UPCOMING') return false;
            const hasJoined = Boolean(t.isJoined) || userJoinedIds.includes(t.id);
            if (!isTournamentVisibleToUser(t, hasJoined, nowTs)) {
              return false;
            }
            if (currentCategory && (t.category || '').toUpperCase() !== currentCategory.toUpperCase()) {
              return false;
            }
            if (currentMatchType && (t.matchType || '').toUpperCase() !== currentMatchType.toUpperCase()) {
              return false;
            }
            return true;
          });

          if (displayed.length === 0) {
            return (
              <div className="py-16 text-center space-y-3 bg-[#121620] border border-[#1f2738] rounded-2xl p-6">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="font-heading font-bold text-base text-white">
                  No Upcoming Matches Found
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  There are currently no upcoming matches scheduled in this category. New tournaments are added frequently, check back shortly!
                </p>
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
