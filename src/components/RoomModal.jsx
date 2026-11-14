import React, { useState } from 'react';
import { X, Copy, Check, KeyRound, ShieldAlert, Play, Lock, CheckCircle2 } from 'lucide-react';

export default function RoomModal({ tournament, isOpen, onClose }) {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  if (!isOpen || !tournament) return null;

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const hasCredentials = Boolean(tournament.roomId && tournament.roomPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c152e] border border-blue-700/60 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-extrabold text-white text-lg">Custom Room Details</h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/40">
                Verified
              </span>
            </div>
            <p className="text-xs text-blue-300">{tournament.matchId} • Map: {tournament.map || 'BERMUDA'}</p>
          </div>
        </div>

        {hasCredentials ? (
          <div className="space-y-4">
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-xl space-y-3">
              {/* Room ID */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Room ID:</span>
                <div className="flex items-center justify-between mt-1 bg-[#080d1e] p-2.5 rounded-lg border border-emerald-500/30">
                  <span className="font-heading font-extrabold text-xl text-emerald-400 tracking-wider">
                    {tournament.roomId}
                  </span>
                  <button
                    onClick={() => copyToClipboard(tournament.roomId, 'id')}
                    className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Room Password */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Room Password:</span>
                <div className="flex items-center justify-between mt-1 bg-[#080d1e] p-2.5 rounded-lg border border-emerald-500/30">
                  <span className="font-heading font-extrabold text-xl text-amber-300 tracking-wider">
                    {tournament.roomPassword}
                  </span>
                  <button
                    onClick={() => copyToClipboard(tournament.roomPassword, 'pass')}
                    className="flex items-center gap-1 text-xs bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded transition-colors"
                  >
                    {copiedPass ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPass ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* How to Join Instructions */}
            <div className="bg-[#080d1e] p-3 rounded-xl border border-blue-900/40 space-y-2 text-xs">
              <span className="font-bold text-amber-400 uppercase flex items-center gap-1">
                <Play className="w-3.5 h-3.5" /> How to Enter Custom Room:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Open <b>Free Fire</b> on your device.</li>
                <li>Go to Mode Selection & tap on <b>Custom</b>.</li>
                <li>Enter the <b>Room ID</b> in search box and tap Join.</li>
                <li>Enter the <b>Password</b> and enter your assigned slot.</li>
                <li>Map is strictly <b>BERMUDA</b>. Do NOT invite unregistered players.</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-white">Room Pending Release</h4>
              <p className="text-xs text-slate-400 mt-1">
                Admin is setting up the custom room. The Room ID and Password will appear here automatically <b>10 to 15 minutes</b> before match time ({tournament.matchTime}).
              </p>
            </div>
            <div className="bg-blue-950/30 border border-blue-900/40 p-2.5 rounded-xl text-[11px] text-blue-300">
              Only registered players have access to these credentials. Please check back shortly.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
