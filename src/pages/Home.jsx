import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AnnouncementTicker from '../components/AnnouncementTicker';
import SEO from '../components/SEO';
import {
  RefreshCw,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  Shield,
  Swords,
  Target,
  Crosshair,
  Crown,
  MessageCircle,
  Instagram,
  Youtube,
  HelpCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: 'cups',
      tag: 'MAP: BERMUDA ONLY • RUSHX ESPORTS',
      icon: Flame,
      tagColor: 'text-red-400',
      title: 'BR & HEADSHOT CUPS',
      desc: '₹18 & ₹36 Per Kill in BR! CS & Lone Wolf Headshot cups. Room ID strictly for registered players!',
      btnText: 'Explore Matches',
      btnAction: () => navigate('/tournaments'),
      badge: 'Min Deposit ₹50',
      bgGradient: 'from-red-950 via-slate-900 to-amber-950',
      borderColor: 'border-red-500/40',
      bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'app_download',
      tag: 'OFFICIAL APP • ZERO LAG ESPORTS',
      icon: Sparkles,
      tagColor: 'text-blue-400',
      title: 'DOWNLOAD RUSHX APP',
      desc: 'Get instant match notifications, faster room ID access, and seamless gaming on Android & iOS.',
      btnText: 'Download Now',
      btnAction: () => navigate('/download'),
      badge: 'Android & iOS',
      bgGradient: 'from-blue-950 via-[#0a1435] to-indigo-950',
      borderColor: 'border-blue-500/50',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'whatsapp',
      tag: 'FASTEST NOTIFICATIONS • ROOM ID UPDATES',
      icon: MessageCircle,
      tagColor: 'text-emerald-400',
      title: 'JOIN WHATSAPP CHANNEL',
      desc: 'Never miss a match! Get real-time Room ID alerts, custom schedule timings & direct admin updates.',
      btnText: 'Join WhatsApp Channel',
      btnAction: () => window.open('https://whatsapp.com/channel/0029Vb3RushXEsports', '_blank'),
      badge: 'Live Alerts ⚡',
      bgGradient: 'from-emerald-950 via-slate-900 to-teal-950',
      borderColor: 'border-emerald-500/40',
      bgImage: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'instagram',
      tag: 'COMMUNITY & HIGHLIGHTS',
      icon: Instagram,
      tagColor: 'text-pink-400',
      title: 'FOLLOW ON INSTAGRAM',
      desc: 'Daily winner showcases, crazy clutch clips, top kill leaders, and upcoming tournament announcements!',
      btnText: 'Follow @rushx_scrim',
      btnAction: () => window.open('https://www.instagram.com/rushx_scrim/', '_blank'),
      badge: '@rushx_scrim',
      bgGradient: 'from-purple-950 via-slate-900 to-pink-950',
      borderColor: 'border-pink-500/40',
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'youtube',
      tag: 'OFFICIAL LIVESTREAM & HIGHLIGHTS',
      icon: Youtube,
      tagColor: 'text-red-400',
      title: 'SUBSCRIBE ON YOUTUBE',
      desc: 'Watch daily Free Fire custom room scrim livestreams, tournament finals, and pro player montages!',
      btnText: 'Subscribe Channel',
      btnAction: () => window.open('https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ', '_blank'),
      badge: 'Live Scrims 🔴',
      bgGradient: 'from-red-950 via-slate-900 to-purple-950',
      borderColor: 'border-red-500/40',
      bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'feedback',
      tag: '24/7 SUPPORT & ANTI-CHEAT DESK',
      icon: HelpCircle,
      tagColor: 'text-cyan-400',
      title: 'PLAYER FEEDBACK & SUPPORT',
      desc: 'Got feedback or want to report a hacker? Submit match screen recording proof or chat directly with admin.',
      btnText: 'Support & Feedback',
      btnAction: () => navigate('/contact'),
      badge: '24/7 Support',
      bgGradient: 'from-blue-950 via-slate-900 to-cyan-950',
      borderColor: 'border-cyan-500/40',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next
        setActiveSlide(prev => (prev + 1) % slides.length);
      } else {
        // Swipe right -> prev
        setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  useEffect(() => {
    fetch('/api/tournaments?status=UPCOMING')
      .then(res => res.json())
      .then(data => {
        setTournaments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const now = Date.now();
  const activeUpcoming = tournaments.filter(t => {
    if (t.status !== 'UPCOMING') return false;
    const sched = t.scheduledAt ? new Date(t.scheduledAt).getTime() : 0;
    return sched === 0 || sched > now;
  });

  const brCount = activeUpcoming.filter(t => t.category === 'BR_FULL_MAP').length;
  const csCount = activeUpcoming.filter(t => t.category === 'CS_1V1').length;
  const csHsCount = activeUpcoming.filter(t => t.category === 'CS_HEADSHOT').length;
  const lwHsCount = activeUpcoming.filter(t => t.category === 'LW_HEADSHOT').length;

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#080d1a] text-white">
      <SEO
        title="Play Free Fire Tournaments & Win Cash"
        description="Join India's most trusted Free Fire esports tournaments. Compete in BR, Clash Squad, and Headshot matches with instant UPI payouts."
        path="/"
      />
      {/* Announcement Marquee Ticker */}
      <AnnouncementTicker />

      {/* Main Content Area */}
      <div className="p-4 space-y-5">
        {/* Featured Hero Banner Slideable Carousel */}
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {slides.map((s, idx) => {
            if (idx !== activeSlide) return null;
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-r ${s.bgGradient} border ${s.borderColor} shadow-2xl p-5 min-h-[190px] flex flex-col justify-between transition-all duration-300 animate-fadeIn`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay"
                  style={{ backgroundImage: `url(${s.bgImage})` }}
                ></div>

                <div className="relative z-10 space-y-1">
                  <div className={`flex items-center gap-1.5 ${s.tagColor} font-heading font-extrabold text-[11px] tracking-wider`}>
                    <Icon className="w-3.5 h-3.5 fill-current animate-pulse shrink-0" />
                    <span>{s.tag}</span>
                  </div>
                  <h2 className="font-heading font-black text-2xl text-white tracking-wide drop-shadow-md leading-tight">
                    {s.title}
                  </h2>
                  <p className="text-xs text-slate-200/90 font-medium max-w-[280px] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof s.btnAction === 'function') {
                        s.btnAction();
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label={s.btnText}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer z-20"
                  >
                    <span>{s.btnText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/40">
                    {s.badge}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Carousel Navigation Arrows */}
          <button
            onClick={() => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs backdrop-blur-sm z-20 border border-white/20 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveSlide(prev => (prev + 1) % slides.length)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center text-xs backdrop-blur-sm z-20 border border-white/20 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Carousel Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeSlide === i ? 'w-6 bg-cyan-400 shadow-sm shadow-cyan-400' : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Section: My Matches */}
        <div>
          <h3 className="font-heading font-extrabold text-base tracking-wide text-white mb-3 flex items-center justify-between">
            <span>My Matches (Your Registered Matches Only)</span>
            <button
              onClick={() => {
                if (!user) return navigate('/login');
                navigate('/my-matches');
              }}
              className="text-xs text-blue-400 font-semibold hover:underline"
            >
              View All
            </button>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Ongoing Card */}
            <button
              onClick={() => {
                if (!user) return navigate('/login');
                navigate('/my-matches?tab=ongoing');
              }}
              className="bg-[#0c142b] hover:bg-[#111c3d] border border-blue-900/50 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 group transition-all shadow-md active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <RefreshCw className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Ongoing</span>
            </button>

            {/* Upcoming Card */}
            <button
              onClick={() => {
                if (!user) return navigate('/login');
                navigate('/my-matches?tab=upcoming');
              }}
              className="bg-[#0c142b] hover:bg-[#111c3d] border border-blue-900/50 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 group transition-all shadow-md active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Upcoming</span>
            </button>

            {/* Completed Card */}
            <button
              onClick={() => {
                if (!user) return navigate('/login');
                navigate('/my-matches?tab=completed');
              }}
              className="bg-[#0c142b] hover:bg-[#111c3d] border border-blue-900/50 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 group transition-all shadow-md active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-slate-200">Completed</span>
            </button>
          </div>
        </div>

        {/* Section: Esports Games (Updated as requested) */}
        <div>
          <h3 className="font-heading font-extrabold text-base tracking-wide text-white mb-3">
            Esports Games (Map: Bermuda)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: BR SOLO TOURNAMENT */}
            <div
              onClick={() => navigate('/tournaments?category=BR_FULL_MAP')}
              className="group relative h-52 rounded-2xl overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer shadow-xl shadow-purple-950/50 active:scale-95 transition-all bg-[#0d041c]"
            >
              <img
                src="/poster-br-solo.svg"
                alt="BR Solo Tournament"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                BR SOLO • BERMUDA
              </div>

              {/* Title & Live Category Action */}
              <div className="absolute bottom-8 left-2.5 right-2.5">
                <h4 className="font-heading font-black text-white text-sm leading-tight drop-shadow">
                  BR SOLO TOURNAMENT
                </h4>
              </div>

              {/* Social Channels Overlay - Replaces old link with user verified links */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between z-20">
                <div className="flex items-center gap-1">
                  <a
                    href="https://www.instagram.com/rushx_scrim/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-pink-950 border border-pink-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-pink-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram className="w-2.5 h-2.5 text-pink-400" />
                    /rushx_scrim
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-red-950 border border-red-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-red-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Youtube className="w-2.5 h-2.5 text-red-400" />
                    Live
                  </a>
                </div>
                <span className="text-[10px] text-amber-400 font-extrabold bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ₹80-₹360
                </span>
              </div>
            </div>

            {/* Card 2: BR DUO TOURNAMENT */}
            <div
              onClick={() => navigate('/tournaments?category=BR_FULL_MAP')}
              className="group relative h-52 rounded-2xl overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer shadow-xl shadow-purple-950/50 active:scale-95 transition-all bg-[#0d041c]"
            >
              <img
                src="/poster-br-duo.svg"
                alt="BR Duo Tournament"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-300" />
                BR DUO • BERMUDA
              </div>

              <div className="absolute bottom-8 left-2.5 right-2.5">
                <h4 className="font-heading font-black text-white text-sm leading-tight drop-shadow">
                  BR DUO TOURNAMENT
                </h4>
              </div>

              {/* Social Channels Overlay */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between z-20">
                <div className="flex items-center gap-1">
                  <a
                    href="https://www.instagram.com/rushx_scrim/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-pink-950 border border-pink-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-pink-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram className="w-2.5 h-2.5 text-pink-400" />
                    /rushx_scrim
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-red-950 border border-red-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-red-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Youtube className="w-2.5 h-2.5 text-red-400" />
                    Live
                  </a>
                </div>
                <span className="text-[10px] text-amber-400 font-extrabold bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ₹160-₹720
                </span>
              </div>
            </div>

            {/* Card 3: CS HEADSHOT TOURNAMENT */}
            <div
              onClick={() => navigate('/tournaments?category=CS_HEADSHOT')}
              className="group relative h-52 rounded-2xl overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer shadow-xl shadow-purple-950/50 active:scale-95 transition-all bg-[#0d041c]"
            >
              <img
                src="/poster-cs.svg"
                alt="CS Headshot Tournament"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                HEADSHOT ONLY
              </div>

              <div className="absolute bottom-8 left-2.5 right-2.5">
                <h4 className="font-heading font-black text-white text-sm leading-tight drop-shadow">
                  CS HEADSHOT TOURNAMENT
                </h4>
              </div>

              {/* Social Channels Overlay */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between z-20">
                <div className="flex items-center gap-1">
                  <a
                    href="https://www.instagram.com/rushx_scrim/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-pink-950 border border-pink-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-pink-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram className="w-2.5 h-2.5 text-pink-400" />
                    /rushx_scrim
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-red-950 border border-red-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-red-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Youtube className="w-2.5 h-2.5 text-red-400" />
                    Live
                  </a>
                </div>
                <span className="text-[10px] text-amber-400 font-extrabold bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ₹80-₹360
                </span>
              </div>
            </div>

            {/* Card 4: LONE WOLF 1V1 */}
            <div
              onClick={() => navigate('/tournaments?category=LW_HEADSHOT')}
              className="group relative h-52 rounded-2xl overflow-hidden border-2 border-purple-500/50 hover:border-purple-400 cursor-pointer shadow-xl shadow-purple-950/50 active:scale-95 transition-all bg-[#0d041c]"
            >
              <img
                src="/poster-lone-wolf.svg"
                alt="Lone Wolf 1v1 Tournament"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

              <div className="absolute top-2.5 left-2.5 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                LONE WOLF 1V1
              </div>

              <div className="absolute bottom-8 left-2.5 right-2.5">
                <h4 className="font-heading font-black text-white text-sm leading-tight drop-shadow">
                  LONE WOLF 1V1
                </h4>
              </div>

              {/* Social Channels Overlay */}
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between z-20">
                <div className="flex items-center gap-1">
                  <a
                    href="https://www.instagram.com/rushx_scrim/"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-pink-950 border border-pink-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-pink-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Instagram className="w-2.5 h-2.5 text-pink-400" />
                    /rushx_scrim
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ"
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#120722]/90 hover:bg-red-950 border border-red-500/70 rounded-md px-1.5 py-0.5 text-[8.5px] font-black text-red-300 flex items-center gap-1 shadow-md hover:scale-105 transition-all"
                  >
                    <Youtube className="w-2.5 h-2.5 text-red-400" />
                    Live
                  </a>
                </div>
                <span className="text-[10px] text-amber-400 font-extrabold bg-black/75 px-1.5 py-0.5 rounded border border-amber-500/30">
                  ₹80-₹360
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Registered Player Notice */}
        <div className="bg-[#0b1329] border border-blue-900/60 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <h4 className="font-heading font-bold text-white text-sm">🔒 Room Credentials Protection</h4>
            <p className="text-xs text-slate-400 mt-0.5">Custom Room ID & Password are only accessible to registered match players.</p>
          </div>
          <button
            onClick={() => navigate('/rules')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
          >
            Rules
          </button>
        </div>
      </div>
    </div>
  );
}
