import React from 'react';
import { Crown } from 'lucide-react';

export default function Logo({ size = 'md', variant = 'full', className = '' }) {
  if (variant === 'icon') {
    const iconSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20'
    };

    return (
      <div className={`relative rounded-2xl bg-gradient-to-b from-[#182032] via-[#0d121c] to-[#07090e] border-2 border-amber-400/80 p-1 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 ${iconSizes[size] || iconSizes.md} ${className}`}>
        <img src="/logo.svg" alt="RushX Esports Logo" className="w-full h-full object-contain" />
      </div>
    );
  }

  // Variant: full (emblem + text)
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Crown Badge */}
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#182032] via-[#0d121c] to-[#07090e] border-2 border-amber-400/90 p-1 flex items-center justify-center shadow-md shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-transform">
        <img src="/logo.svg" alt="RushX Esports Emblem" className="w-full h-full object-contain" />
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-black text-white text-lg tracking-wider leading-none">
            RUSH<span className="text-amber-400">X</span>
          </span>
          <span className="bg-amber-400/15 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded border border-amber-400/40 uppercase tracking-wider">
            ESPORTS
          </span>
        </div>
        <span className="text-[10px] text-amber-400 font-extrabold tracking-widest uppercase mt-0.5">
          PLAY • COMPETE • WIN
        </span>
      </div>
    </div>
  );
}
