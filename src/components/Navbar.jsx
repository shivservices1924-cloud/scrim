import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Coins, ShieldCheck, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalBalance = user ? (Number(user.depositBalance) || 0) + (Number(user.winBalance) || 0) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/40 px-4 py-2.5 max-w-md mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Official RushX Emblem Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-black border-2 border-amber-400 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden shrink-0">
            <img src="/app-logo.png" alt="RushX Esports Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-white text-lg tracking-wider leading-none">
                RUSH<span className="text-purple-400">X</span>
              </span>
              <span className="bg-purple-600/30 text-purple-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30 uppercase">
                ESPORTS
              </span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold -mt-0.5">
              {user ? `@${user.username}` : 'Free Fire Tournaments'}
            </span>
          </div>
        </Link>

        {/* Right: Balance Pill & Notification */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <Link
              to="/wallet"
              className="flex items-center gap-1.5 bg-[#180930] hover:bg-[#230d45] border border-purple-500/40 px-3 py-1.5 rounded-full shadow-inner transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-sm">
                ₹
              </div>
              <span className="font-heading font-extrabold text-amber-400 text-base">
                {totalBalance}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow hover:brightness-110"
            >
              Login
            </Link>
          )}

          <Link
            to="/rules"
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 relative transition-transform active:scale-95"
            title="Notifications & Rules"
            aria-label="Notifications & Rules"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          </Link>
        </div>
      </div>
    </header>
  );
}
