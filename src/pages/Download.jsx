import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  Share2,
  PlusSquare,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sun,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import SEO from '../components/SEO';

export default function DownloadPage() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [tournamentsCount, setTournamentsCount] = useState(0);
  const [showHarmfulGuide, setShowHarmfulGuide] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    fetch('/api/tournaments?status=UPCOMING')
      .then(res => res.json())
      .then(data => {
        setTournamentsCount(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setTournamentsCount(0));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownloadAndroid = () => {
    // Start direct APK download
    window.location.href = '/rushx.apk';
    // Show the Play Protect & harmful warning bypass guide automatically
    setShowHarmfulGuide(true);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Guide user
      setShowHarmfulGuide(true);
    }
  };

  const handlePlayIos = () => {
    setShowIosGuide(true);
  };

  return (
    <div className="min-h-screen bg-[#070212] text-white pb-24 selection:bg-purple-600 selection:text-white">
      <SEO
        title="Download Official App (Android & iOS)"
        description="Download RushX official APK for Android or install 1-click PWA for iOS. Instant match alerts, faster Room ID access, and zero lag."
        path="/download"
      />
      {/* Top Header matching reference screenshot */}
      <header className="px-4 py-3.5 sticky top-0 z-40 bg-[#070212]/90 backdrop-blur-md border-b border-purple-900/40 max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-full bg-white border border-amber-400 p-0.5 flex items-center justify-center overflow-hidden shadow-md">
            <img src="/app-logo.png" alt="RushX" className="w-full h-full object-cover rounded-full" />
          </div>
          <span className="font-heading font-black tracking-widest text-sm text-white">
            RUSHX <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">ESPORTS</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAndroid}
            className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-purple-900/40 transition-transform active:scale-95"
          >
            Download for Android
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-slate-300 hover:text-white"
            title="Open Web App"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
        
        {/* Esports Mascot Center Emblem (Matching Reference Screenshot) */}
        <div className="text-center pt-2">
          <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
            {/* Glowing neon shield aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-fuchsia-600/20 to-amber-500/30 rounded-full blur-2xl animate-pulse"></div>

            {/* Emblem container: Sleek Gold-Bordered Championship Medallion */}
            <div className="relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white border-4 border-amber-400 p-2 shadow-2xl shadow-purple-900/40 flex items-center justify-center overflow-hidden">
              <img
                src="/app-logo.png"
                alt="RushX Esports Emblem"
                className="w-full h-full object-cover rounded-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
              />
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-[#10051e] border border-purple-900/60 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-200 mt-4 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Free Fire tournaments</span>
          </div>

          {/* Huge Heading */}
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-wider mt-4">
            RUSHX <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent">TOURNAMENTS</span>
          </h1>

          {/* Tagline */}
          <p className="font-heading font-bold text-base sm:text-lg text-white mt-1">
            Every kill counts. <span className="text-amber-400 font-black">Every win pays.</span>
          </p>

          {/* Subtitle */}
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed font-normal">
            Join verified Free Fire tournaments, lock your slot in seconds, and track every match, kill and payout from one place.
          </p>
        </div>

        {/* Action Buttons Row (Download for Android & Play for iOS) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Button 1: Download for Android */}
          <button
            onClick={handleDownloadAndroid}
            className="w-full py-3.5 px-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download for Android</span>
          </button>

          {/* Button 2: Play for iOS */}
          <button
            onClick={handlePlayIos}
            className="w-full py-3.5 px-3 rounded-2xl bg-[#10051e] hover:bg-[#180930] border border-purple-900/80 text-white font-heading font-extrabold text-xs sm:text-sm tracking-wide shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-purple-300" />
            <span>Play for iOS</span>
          </button>
        </div>

        {/* 1-Click Chrome Install (Zero Warnings) Banner */}
        <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white leading-tight">Instant App (No Warning)</p>
              <p className="text-[10px] text-emerald-300">Add to Home Screen in 1-Click with Zero Warnings</p>
            </div>
          </div>
          <button
            onClick={handleInstallPwa}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-heading font-extrabold px-3 py-1.5 rounded-xl shadow active:scale-95 shrink-0"
          >
            Add to Phone
          </button>
        </div>

        {/* Metric Counter Cards (Truthful stats) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Fast UPI Payouts */}
          <div className="bg-[#10051e] border border-purple-900/40 rounded-2xl p-4 space-y-1 shadow-md">
            <h3 className="font-heading font-black text-2xl text-emerald-400">Instant</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>UPI Payouts</span>
            </div>
          </div>

          {/* Card 2: Real Open Tournaments */}
          <div className="bg-[#10051e] border border-purple-900/40 rounded-2xl p-4 space-y-1 shadow-md">
            <h3 className="font-heading font-black text-2xl text-white">{tournamentsCount}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className={`w-2 h-2 rounded-full ${tournamentsCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
              <span>Open tournaments</span>
            </div>
          </div>
        </div>

        {/* Harmful Warning Explainer & Installation Guide (Accordion / Section) */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3">
          <div
            onClick={() => setShowHarmfulGuide(!showHarmfulGuide)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                How to Install APK Without Harmful Warning
              </h3>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showHarmfulGuide ? 'rotate-90' : ''}`} />
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            Google Chrome shows a default warning <span className="text-amber-400 font-bold">"File might be harmful"</span> for <b>any</b> APK downloaded outside Google Play Store. RushX APK is 100% verified, virus-free, and safe.
          </p>

          {showHarmfulGuide && (
            <div className="pt-2 border-t border-purple-900/40 space-y-2 text-xs text-slate-300">
              <div className="space-y-2">
                <div className="flex items-start gap-2 bg-[#070212] p-2.5 rounded-xl border border-purple-900/40">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
                  <p>When downloading, tap <b>"Download anyway"</b> on the browser prompt.</p>
                </div>
                <div className="flex items-start gap-2 bg-[#070212] p-2.5 rounded-xl border border-purple-900/40">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
                  <p>Open the downloaded APK and tap <b>"Settings"</b> → Enable <b>"Allow from this source"</b>.</p>
                </div>
                <div className="flex items-start gap-2 bg-[#070212] p-2.5 rounded-xl border border-purple-900/40">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
                  <p>If Google Play Protect popup appears, tap <b>"More details"</b> → <b>"Install anyway"</b>.</p>
                </div>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 mt-3">
                <p className="font-bold text-emerald-300 text-xs">💡 Best Zero-Warning Method (Chrome PWA):</p>
                <p className="text-[11px] text-slate-300 mt-1">
                  In Google Chrome, tap the <b>3 dots menu</b> (top-right) → tap <b>"Add to Home screen"</b> or <b>"Install App"</b>. It installs instantly with zero warnings, zero setup, and works just like a native app!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* iOS User Guide Modal */}
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#10051e] border border-purple-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 mx-auto flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>

              <h3 className="font-heading font-black text-lg text-white">
                How to Play on Apple iOS (iPhone/iPad)
              </h3>

              <div className="text-left text-xs text-slate-300 space-y-2.5 bg-[#070212] p-3.5 rounded-2xl border border-purple-900/50">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-purple-400">1.</span>
                  <span>Open Safari browser and visit <b>rushx.in</b> (or this link).</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-purple-400">2.</span>
                  <span>Tap the <b>Share button</b> (the square with an arrow pointing up at the bottom).</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-purple-400">3.</span>
                  <span>Scroll down and tap <b>"Add to Home Screen"</b>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-purple-400">4.</span>
                  <span>Tap <b>"Add"</b>. RushX icon will appear on your iPhone screen like a regular app!</span>
                </p>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-heading font-bold text-xs"
                >
                  Open Web App
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2">
          <div className="bg-[#10051e] p-2.5 rounded-xl border border-purple-900/40">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="font-bold text-white block">Anti-Cheat</span>
            <span className="text-[10px] text-slate-400">Fair Play</span>
          </div>
          <div className="bg-[#10051e] p-2.5 rounded-xl border border-purple-900/40">
            <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="font-bold text-white block">Instant UPI</span>
            <span className="text-[10px] text-slate-400">Fast Payouts</span>
          </div>
          <div className="bg-[#10051e] p-2.5 rounded-xl border border-purple-900/40">
            <Award className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <span className="font-bold text-white block">₹18/₹36 Kill</span>
            <span className="text-[10px] text-slate-400">High Rewards</span>
          </div>
        </div>

      </div>
    </div>
  );
}
