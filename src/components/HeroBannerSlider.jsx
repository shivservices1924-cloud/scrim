import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Play,
  Send,
  Instagram,
  Headphones,
  Trophy,
  Zap
} from 'lucide-react';

export default function HeroBannerSlider({ onJoinClick }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = [
    {
      id: 'tournaments',
      tag: 'RUSHX ESPORTS',
      tagIcon: Sparkles,
      title: (
        <>
          DAILY <br />
          <span className="text-[#F5C400]">TOURNAMENTS</span>
        </>
      ),
      subtitle: 'PLAY • WIN CASH • EARN DAILY',
      btnText: 'JOIN NOW',
      btnAction: () => {
        if (onJoinClick) onJoinClick();
        else navigate('/tournaments');
      },
      btnIcon: Zap,
      accentColor: '#F5C400',
      bgGradient: 'from-[#1a1f2c] via-[#121620] to-[#0d1017]',
      borderGlow: 'border-[#F5C400]/40',
      heroImage: '/poster-br-solo.svg',
      isExternal: false
    },
    {
      id: 'instagram',
      tag: 'INSTAGRAM OFFICIAL',
      tagIcon: Instagram,
      title: (
        <>
          FOLLOW ON <br />
          <span className="text-pink-400">INSTAGRAM</span>
        </>
      ),
      subtitle: '@rushx_scrim • Daily Scrim Updates & Giveaways',
      btnText: 'FOLLOW NOW',
      btnAction: () => {
        window.open('https://www.instagram.com/rushx_scrim/', '_blank', 'noopener,noreferrer');
      },
      btnIcon: ExternalLink,
      accentColor: '#E1306C',
      bgGradient: 'from-[#24101e] via-[#150d18] to-[#0c0810]',
      borderGlow: 'border-pink-500/40',
      badgeIcon: Instagram,
      isExternal: true
    },
    {
      id: 'telegram',
      tag: 'OFFICIAL TELEGRAM',
      tagIcon: Send,
      title: (
        <>
          JOIN OUR <br />
          <span className="text-sky-400">TELEGRAM</span>
        </>
      ),
      subtitle: 'Instant Custom Room ID & Match Password Alerts',
      btnText: 'JOIN CHANNEL',
      btnAction: () => {
        window.open('https://t.me/RushXSupport', '_blank', 'noopener,noreferrer');
      },
      btnIcon: Send,
      accentColor: '#229ED9',
      bgGradient: 'from-[#0b1c2b] via-[#0c1520] to-[#090e16]',
      borderGlow: 'border-sky-500/40',
      badgeIcon: Send,
      isExternal: true
    },
    {
      id: 'youtube',
      tag: 'YOUTUBE CHANNEL',
      tagIcon: Play,
      title: (
        <>
          SUBSCRIBE <br />
          <span className="text-red-500">YOUTUBE</span>
        </>
      ),
      subtitle: 'Watch Live Match Streams, Highlights & Top Kills',
      btnText: 'SUBSCRIBE',
      btnAction: () => {
        window.open('https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ', '_blank', 'noopener,noreferrer');
      },
      btnIcon: Play,
      accentColor: '#FF0000',
      bgGradient: 'from-[#260e0e] via-[#180d0d] to-[#0f0808]',
      borderGlow: 'border-red-500/40',
      badgeIcon: Play,
      isExternal: true
    },
    {
      id: 'contact',
      tag: '24/7 PLAYER HELPDESK',
      tagIcon: Headphones,
      title: (
        <>
          NEED HELP? <br />
          <span className="text-emerald-400">CONTACT US</span>
        </>
      ),
      subtitle: 'Instant Support for Deposits, Withdrawals & Room ID',
      btnText: 'CONTACT SUPPORT',
      btnAction: () => {
        navigate('/contact-us');
      },
      btnIcon: MessageCircle,
      accentColor: '#10B981',
      bgGradient: 'from-[#0d2218] via-[#0c1813] to-[#08100d]',
      borderGlow: 'border-emerald-500/40',
      badgeIcon: Headphones,
      isExternal: false
    }
  ];

  // Auto slide interval (3.8 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Viewport Container */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => {
            const TagIcon = slide.tagIcon;
            const BtnIcon = slide.btnIcon;
            const BadgeIcon = slide.badgeIcon;

            return (
              <div
                key={slide.id}
                className={`w-full shrink-0 min-h-[178px] bg-gradient-to-r ${slide.bgGradient} border ${slide.borderGlow} p-4 sm:p-5 flex items-center justify-between relative`}
              >
                {/* Subtle Radial Glow */}
                <div
                  className="absolute top-0 right-1/4 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: slide.accentColor }}
                ></div>

                {/* Left Content */}
                <div className="relative z-10 space-y-1.5 max-w-[62%] sm:max-w-[65%]">
                  <span
                    className="text-[10px] font-mono tracking-widest font-black uppercase flex items-center gap-1.5"
                    style={{ color: slide.accentColor }}
                  >
                    <TagIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{slide.tag}</span>
                  </span>

                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide leading-tight drop-shadow">
                    {slide.title}
                  </h2>

                  <p className="text-[10.5px] font-bold text-slate-300 tracking-wider line-clamp-1">
                    {slide.subtitle}
                  </p>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={slide.btnAction}
                      className="inline-flex items-center gap-1.5 font-heading font-black text-xs px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider cursor-pointer text-black"
                      style={{
                        backgroundColor: slide.accentColor,
                        boxShadow: `0 4px 14px ${slide.accentColor}40`
                      }}
                    >
                      <span>{slide.btnText}</span>
                      <BtnIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right Visual Element */}
                <div className="relative z-10 w-28 h-32 flex items-center justify-center shrink-0">
                  {slide.heroImage ? (
                    <img
                      src={slide.heroImage}
                      alt="Tournament Hero"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.svg';
                      }}
                      className="w-full h-full object-cover rounded-xl border border-[#F5C400]/40 shadow-xl filter brightness-105"
                    />
                  ) : BadgeIcon ? (
                    <div
                      className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        borderColor: slide.accentColor,
                        backgroundColor: '#0a0d14',
                        boxShadow: `0 0 25px ${slide.accentColor}30`
                      }}
                    >
                      <BadgeIcon
                        className="w-11 h-11"
                        style={{ color: slide.accentColor }}
                      />
                      <span className="text-[9px] font-heading font-black text-white uppercase tracking-widest mt-1.5">
                        RUSHX
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Left/Right Arrow Navigation */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all rounded-full ${
              currentIndex === idx
                ? 'w-6 h-1.5 bg-[#F5C400]'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

