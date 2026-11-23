import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Swords, Trophy, Wallet, User } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  // Don't show bottom nav inside admin panel routes or download landing page
  if (
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/admin-portal') ||
    location.pathname.startsWith('/control-room-777') ||
    location.pathname === '/download'
  ) {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Tournaments', path: '/tournaments', icon: Swords },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0b0e14]/95 backdrop-blur-lg border-t border-[#1f2738] max-w-md mx-auto w-full transition-all">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${
                isActive ? 'text-[#F5C400] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#F5C400] rounded-b-full shadow-md shadow-amber-400/50"></span>
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-amber-400/15 text-[#F5C400]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-wide font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
