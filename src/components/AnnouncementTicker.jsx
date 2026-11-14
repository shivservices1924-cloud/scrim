import React, { useEffect, useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementTicker() {
  const [tickerText, setTickerText] = useState(
    '⚡ Welcome to RushX Esports! Verified Free Fire BR & CS Tournaments. Fair play guaranteed. Click to read tournament rules.'
  );

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.tickerAnnouncement) {
          let text = data.tickerAnnouncement.trim();
          // Fix duplicated announcement copy-paste bug (Issue 26)
          const parts = text.split('•').map(p => p.trim()).filter(Boolean);
          if (parts.length === 2 && parts[0] === parts[1]) {
            text = parts[0];
          }
          setTickerText(text);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <Link
      to="/rules"
      aria-label="Read tournament notices and rules"
      className="bg-[#14062a] hover:bg-[#1c083b] border-y border-purple-900/50 flex items-center px-3 py-2 text-xs text-purple-200 overflow-hidden cursor-pointer group transition-colors"
    >
      <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-purple-800/60 text-amber-400 font-bold z-10 bg-[#14062a]">
        <Megaphone className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline text-[11px] uppercase tracking-wider">Notice</span>
      </div>
      <div className="overflow-hidden whitespace-nowrap w-full pl-2">
        <div className="animate-marquee group-hover:[animation-play-state:paused] inline-block font-medium">
          {tickerText}
        </div>
      </div>
    </Link>
  );
}
