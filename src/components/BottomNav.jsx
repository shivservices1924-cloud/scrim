import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Gift, Trophy, Home, MoreHorizontal } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  // Don't show bottom nav inside admin panel routes or download landing page
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/admin-portal') ||
    location.pathname === '/download'
  ) {
    return null;
  }

  const navItems = [
    { name: 'Earn', path: '/refer', icon: Gift },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Home', path: '/', icon: Home },
    { name: 'Menu', path: '/profile', icon: MoreHorizontal }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d041c]/95 backdrop-blur-lg border-t border-purple-900/40 max-w-md mx-auto w-full transition-all">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive ? 'text-purple-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-b-full shadow-lg shadow-purple-500/50"></span>
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-purple-600/25 text-purple-300' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[11px] tracking-wide">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
