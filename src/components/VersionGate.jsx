import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldAlert, Download, RefreshCw, Smartphone } from 'lucide-react';

export const CURRENT_CLIENT_VERSION = '1.0.0';

function semverCompare(v1, v2) {
  const p1 = (v1 || '1.0.0').split('.').map(n => parseInt(n, 10) || 0);
  const p2 = (v2 || '1.0.0').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const n1 = p1[i] || 0;
    const n2 = p2[i] || 0;
    if (n1 < n2) return -1;
    if (n1 > n2) return 1;
  }
  return 0;
}

export default function VersionGate({ children }) {
  const location = useLocation();
  const [versionInfo, setVersionInfo] = useState(null);
  const [blocked, setBlocked] = useState(false);

  // Exclude admin pages and download landing page from blocking
  const isAdminOrDownload =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/admin-portal') ||
    location.pathname === '/download';

  const checkVersion = async () => {
    try {
      const res = await fetch('/api/app-version');
      if (res.ok) {
        const data = await res.json();
        setVersionInfo(data);
        
        if (data.forceUpdateEnabled) {
          const isOutdated = semverCompare(CURRENT_CLIENT_VERSION, data.minRequiredVersion) < 0;
          setBlocked(isOutdated);
        } else {
          setBlocked(false);
        }
      }
    } catch (err) {
      console.warn('Version check skipped (offline or network issue)');
    }
  };

  useEffect(() => {
    checkVersion();
    // Re-check periodically every 60 seconds
    const interval = setInterval(checkVersion, 60000);
    return () => clearInterval(interval);
  }, []);

  if (blocked && !isAdminOrDownload) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#070212] text-white flex items-center justify-center p-6 select-none">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 p-1 mx-auto shadow-2xl shadow-red-600/30">
            <div className="w-full h-full bg-[#10051e] rounded-[22px] flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 text-amber-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              Mandatory App Update Required
            </div>
            <h1 className="font-heading font-black text-2xl text-white">
              UPDATE RUSHX TO CONTINUE
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed px-4">
              {versionInfo?.updateMessage || 'A new required version of RushX is now live! Old versions are temporarily blocked to ensure tournament anti-cheat security and fair gameplay.'}
            </p>
          </div>

          <div className="bg-[#0b1326] border border-blue-900/60 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
            <div className="flex justify-between items-center py-1 border-b border-blue-900/40">
              <span className="text-slate-400">Your App Version:</span>
              <span className="font-mono text-red-400 font-bold">v{CURRENT_CLIENT_VERSION} (Outdated)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Required Version:</span>
              <span className="font-mono text-emerald-400 font-bold">v{versionInfo?.minRequiredVersion || '1.1.0'}</span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={versionInfo?.updateDownloadUrl || '/download'}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-heading font-extrabold text-sm tracking-wider shadow-lg shadow-cyan-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Download & Install RushX Update</span>
            </a>

            <button
              onClick={() => window.location.reload()}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 mx-auto py-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Already updated? Tap to check again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}