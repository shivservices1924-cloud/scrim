import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bell, Wallet, Sparkles } from 'lucide-react';
import { getUserAvatar } from '../utils/avatar';
import Logo from './Logo';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalBalance = user ? (Number(user.depositBalance) || 0) + (Number(user.winBalance) || 0) : 0;

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 max-w-md mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Official RushX Gold Crown Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <Logo variant="full" />
        </Link>

        {/* Right: Balance Pill, Avatar & Notifications */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              {/* Gold Balance Pill */}
              <Link
                to="/wallet"
                className="flex items-center gap-1.5 bg-[#121620] hover:bg-[#1a202c] border border-amber-400/40 px-2.5 py-1 rounded-full shadow-md shadow-black transition-all hover:scale-105 active:scale-95"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black text-[10px] flex items-center justify-center shadow-sm">
                  ₹
                </div>
                <span className="font-heading font-extrabold text-amber-400 text-xs sm:text-sm">
                  {totalBalance}
                </span>
              </Link>

              {/* User Avatar */}
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full border-2 border-amber-400/80 overflow-hidden hover:scale-105 active:scale-95 transition-transform shrink-0 shadow-sm shadow-amber-500/20"
                title="Profile & Menu"
              >
                <img
                  src={getUserAvatar(user)}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-[#F5C400] hover:bg-[#ffd214] text-black text-xs font-black px-3.5 py-1.5 rounded-full shadow-md transition-all active:scale-95"
            >
              LOGIN
            </Link>
          )}

          {/* Notification / Rules Bell */}
          <Link
            to="/rules"
            className="w-8 h-8 rounded-full bg-[#121620] hover:bg-[#1a202c] border border-[#222c40] flex items-center justify-center text-slate-300 hover:text-amber-400 relative transition-all active:scale-95"
            title="Notifications & Rules"
            aria-label="Notifications & Rules"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400"></span>
          </Link>
        </div>
      </div>
    </header>
  );
}
