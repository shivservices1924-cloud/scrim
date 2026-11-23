import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return Boolean(
        localStorage.getItem('rushx_install_dismissed') ||
        sessionStorage.getItem('rushx_install_dismissed')
      );
    } catch (e) {
      return false;
    }
  });
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (Added to Home Screen)
    const isApp =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isApp) {
      setIsStandalone(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setIsDismissed(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setInstalledSuccess(true);
          handleDismiss();
        }
        setDeferredPrompt(null);
      } catch (err) {
        setShowInstructions(true);
      }
    } else {
      // Show visual modal instructions for iOS / browsers without beforeinstallprompt
      setShowInstructions(true);
    }
  };

  const handleDismiss = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      localStorage.setItem('rushx_install_dismissed', 'true');
      sessionStorage.setItem('rushx_install_dismissed', 'true');
    } catch (err) {}
    setIsDismissed(true);
  };

  // If already installed to home screen or dismissed, don't show banner
  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Top Banner on Mobile */}
      <div className="bg-[#121620] border-b border-[#1f2738] px-3.5 py-2.5 shadow-lg relative z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#0b0e14] border border-[#F5C400] p-0.5 shadow shrink-0 overflow-hidden flex items-center justify-center">
              <img src="/logo.svg" alt="RushX App" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-white text-xs tracking-wider truncate">
                  INSTALL RUSHX APP
                </span>
                <span className="bg-[#F5C400]/20 text-[#F5C400] border border-[#F5C400]/40 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase shrink-0">
                  PWA Web
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate">
                Add to Home Screen for 1-click Free Fire access!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href="/download"
              className="py-1 px-2.5 rounded-xl bg-[#0b0e14] hover:bg-[#1a202e] text-slate-200 border border-[#1f2738] text-[10px] font-heading font-bold flex items-center gap-1"
            >
              <Download className="w-2.5 h-2.5 text-[#F5C400]" />
              <span>APK</span>
            </a>
            <button
              onClick={handleInstallClick}
              className="py-1 px-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] active:scale-95 text-black font-heading font-black text-[11px] tracking-wider shadow-md shadow-[#F5C400]/20 transition-all flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3 text-black" />
              <span>ADD</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Instructions Modal for iOS / Browser Users */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#121620] border border-[#1f2738] rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2738]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F5C400]/20 border border-[#F5C400]/40 flex items-center justify-center text-[#F5C400]">
                  <Smartphone className="w-4 h-4 text-[#F5C400]" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-white text-sm tracking-wider">
                    ADD TO HOME SCREEN
                  </h3>
                  <span className="text-[10px] text-[#F5C400] font-semibold">
                    Zero download • Opens like a real App
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0b0e14] border border-[#1f2738] rounded-2xl p-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C400]/20 text-[#F5C400] font-heading font-black flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    Tap Browser Menu or Share Button
                    <Share className="w-3.5 h-3.5 text-[#F5C400] inline" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Safari me neeche <b>Share [⎋]</b> icon par tap karein, ya Chrome me <b>3-dots (⋮)</b> menu par tap karein.
                  </p>
                </div>
              </div>

              <div className="bg-[#0b0e14] border border-[#1f2738] rounded-2xl p-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C400]/20 text-[#F5C400] font-heading font-black flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    Select "Add to Home Screen"
                    <PlusSquare className="w-3.5 h-3.5 text-[#F5C400] inline" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Menu list me <b>"Add to Home Screen" (होम स्क्रीन पर जोड़ें)</b> select karein.
                  </p>
                </div>
              </div>

              <div className="bg-[#0b0e14] border border-[#1f2738] rounded-2xl p-3 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#F5C400]/20 text-[#F5C400] font-heading font-black flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="text-white font-semibold">
                    Tap "Add" or "Install"
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    RushX ka app icon aapke phone ke home screen par ban jayega!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 rounded-2xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs tracking-wider shadow-lg active:scale-95 transition-all"
            >
              GOT IT, THANKS!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
