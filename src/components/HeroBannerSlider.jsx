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
  Zap,
  Flame,
  ShieldAlert
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
      titleMain: 'DAILY',
      titleHighlight: 'TOURNAMENTS',
      titleColor: '#F5C400',
      subtitle: 'Play Free Fire • Win Real Cash Daily',
      btnText: 'JOIN NOW',
      btnAction: () => {
        if (onJoinClick) onJoinClick();
        else navigate('/tournaments');
      },
      btnIcon: Zap,
      accentColor: '#F5C400',
      btnTextColor: '#000000',
      bgGradient: 'linear-gradient(135deg, #1f2738 0%, #121620 50%, #0b0e14 100%)',
      borderColor: 'rgba(245, 196, 0, 0.45)',
      boxGlow: '0 8px 30px rgba(245, 196, 0, 0.12)',
      badgeIcon: Trophy,
      heroImage: '/poster-br-solo.svg'
    },
    {
      id: 'instagram',
      tag: 'OFFICIAL INSTAGRAM',
      tagIcon: Instagram,
      titleMain: 'FOLLOW ON',
      titleHighlight: 'INSTAGRAM',
      titleColor: '#FF6492',
      subtitle: '@rushx_scrim • Daily Scrim Updates & Giveaways',
      btnText: 'FOLLOW NOW',
      btnAction: () => {
        window.open('https://www.instagram.com/rushx_scrim/', '_blank', 'noopener,noreferrer');
      },
      btnIcon: ExternalLink,
      accentColor: '#E1306C',
      btnTextColor: '#FFFFFF',
      bgGradient: 'linear-gradient(135deg, #2b1224 0%, #190e1c 50%, #0d0811 100%)',
      borderColor: 'rgba(225, 48, 108, 0.45)',
      boxGlow: '0 8px 30px rgba(225, 48, 108, 0.15)',
      badgeIcon: Instagram
    },
    {
      id: 'telegram',
      tag: 'OFFICIAL TELEGRAM',
      tagIcon: Send,
      titleMain: 'JOIN OUR',
      titleHighlight: 'TELEGRAM',
      titleColor: '#38BDF8',
      subtitle: 'Custom Room ID & Match Password Alerts',
      btnText: 'JOIN CHANNEL',
      btnAction: () => {
        window.open('https://t.me/RushXSupport', '_blank', 'noopener,noreferrer');
      },
      btnIcon: Send,
      accentColor: '#229ED9',
      btnTextColor: '#FFFFFF',
      bgGradient: 'linear-gradient(135deg, #0e2438 0%, #0d1824 50%, #090e14 100%)',
      borderColor: 'rgba(34, 158, 217, 0.45)',
      boxGlow: '0 8px 30px rgba(34, 158, 217, 0.15)',
      badgeIcon: Send
    },
    {
      id: 'youtube',
      tag: 'YOUTUBE CHANNEL',
      tagIcon: Play,
      titleMain: 'SUBSCRIBE',
      titleHighlight: 'YOUTUBE',
      titleColor: '#FF4D4D',
      subtitle: 'Live Match Streams & Top Highlights',
      btnText: 'SUBSCRIBE',
      btnAction: () => {
        window.open('https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ', '_blank', 'noopener,noreferrer');
      },
      btnIcon: Play,
      accentColor: '#FF2A2A',
      btnTextColor: '#FFFFFF',
      bgGradient: 'linear-gradient(135deg, #2e1010 0%, #1c0e0e 50%, #0f0808 100%)',
      borderColor: 'rgba(255, 42, 42, 0.45)',
      boxGlow: '0 8px 30px rgba(255, 42, 42, 0.15)',
      badgeIcon: Play
    },
    {
      id: 'contact',
      tag: '24/7 PLAYER HELPDESK',
      tagIcon: Headphones,
      titleMain: 'NEED HELP?',
      titleHighlight: 'CONTACT US',
      titleColor: '#34D399',
      subtitle: 'Instant Support for Deposits, Withdrawals & Room ID',
      btnText: 'CONTACT SUPPORT',
      btnAction: () => {
        navigate('/contact-us');
      },
      btnIcon: MessageCircle,
      accentColor: '#10B981',
      btnTextColor: '#000000',
      bgGradient: 'linear-gradient(135deg, #0f2c1f 0%, #0e1e17 50%, #08120e 100%)',
      borderColor: 'rgba(16, 185, 129, 0.45)',
      boxGlow: '0 8px 30px rgba(16, 185, 129, 0.15)',
      badgeIcon: Headphones
    }
  ];

  // Auto slide interval (4 seconds)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
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
    if (Math.abs(diff) > 35) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl select-none group"
      style={{
        boxShadow: slides[currentIndex].boxGlow,
        border: `1.5px solid ${slides[currentIndex].borderColor}`,
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slider Viewport Container */}
      <div className="w-full overflow-hidden">
        {/* Track with exact CSS carousel math: width = slides.length * 100%, translation = currentIndex * 100 / length */}
        <div
          className="flex will-change-transform"
          style={{
            width: `${slides.length * 100}%`,
            transform: `translateX(-${(currentIndex * 100) / slides.length}%)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {slides.map((slide) => {
            const TagIcon = slide.tagIcon;
            const BtnIcon = slide.btnIcon;
            const BadgeIcon = slide.badgeIcon;

            return (
              <div
                key={slide.id}
                className="shrink-0 p-4 sm:p-5 flex items-center justify-between relative min-h-[175px]"
                style={{
                  width: `${100 / slides.length}%`,
                  background: slide.bgGradient
                }}
              >
                {/* Radial Glow on Right */}
                <div
                  className="absolute top-0 right-1/4 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25"
                  style={{ backgroundColor: slide.accentColor }}
                />

                {/* Left Content Area */}
                <div className="relative z-10 space-y-1.5 max-w-[64%] sm:max-w-[68%]">
                  {/* Tag Chip */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-mono tracking-widest font-black uppercase flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{
                        color: slide.accentColor,
                        backgroundColor: `${slide.accentColor}18`,
                        border: `1px solid ${slide.accentColor}35`
                      }}
                    >
                      <TagIcon className="w-3 h-3 shrink-0" />
                      <span>{slide.tag}</span>
                    </span>
                  </div>

                  {/* Main Title */}
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide leading-tight drop-shadow-md">
                    {slide.titleMain} <br />
                    <span style={{ color: slide.titleColor }}>{slide.titleHighlight}</span>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-[11px] font-semibold text-slate-300 tracking-wide line-clamp-1">
                    {slide.subtitle}
                  </p>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={slide.btnAction}
                      className="inline-flex items-center gap-1.5 font-heading font-black text-xs px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
                      style={{
                        backgroundColor: slide.accentColor,
                        color: slide.btnTextColor,
                        boxShadow: `0 4px 14px ${slide.accentColor}50`
                      }}
                    >
                      <span>{slide.btnText}</span>
                      <BtnIcon className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </div>
                </div>

                {/* Right Visual Element */}
                <div className="relative z-10 w-24 h-28 sm:w-28 sm:h-32 flex items-center justify-center shrink-0">
                  {slide.heroImage ? (
                    <img
                      src={slide.heroImage}
                      alt="Tournament Hero"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/logo.svg';
                      }}
                      className="w-full h-full object-cover rounded-xl border-2 shadow-2xl filter brightness-105"
                      style={{ borderColor: slide.accentColor }}
                    />
                  ) : BadgeIcon ? (
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 transition-transform duration-300 group-hover:scale-105"
                      style={{
                        borderColor: slide.accentColor,
                        backgroundColor: '#0a0d14',
                        boxShadow: `0 0 25px ${slide.accentColor}35`
                      }}
                    >
                      <BadgeIcon
                        className="w-10 h-10 sm:w-11 sm:h-11"
                        style={{ color: slide.accentColor }}
                      />
                      <span className="text-[8.5px] sm:text-[9px] font-heading font-black text-white uppercase tracking-widest mt-1">
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

      {/* Manual Prev Arrow */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg active:scale-90"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Manual Next Arrow */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/95 text-white/90 hover:text-white border border-white/20 flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg active:scale-90"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="transition-all rounded-full cursor-pointer"
            style={{
              width: currentIndex === idx ? '22px' : '6px',
              height: '6px',
              backgroundColor: currentIndex === idx ? slides[currentIndex].accentColor : 'rgba(255, 255, 255, 0.35)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
