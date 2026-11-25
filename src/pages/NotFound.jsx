import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Swords, HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col justify-center items-center px-4 py-16 selection:bg-[#F5C400] selection:text-black">
      <SEO
        title="404 Page Not Found • RushX Esports"
        description="The page you requested was not found."
        path="/404"
      />
      <div className="max-w-md w-full text-center space-y-6">
        {/* Brand Emblem */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-[#182032] via-[#0d121c] to-[#07090e] border-2 border-[#F5C400] p-2 mx-auto shadow-xl shadow-amber-500/20 flex items-center justify-center overflow-hidden">
          <img src="/logo.svg" alt="RushX Esports Logo" className="w-full h-full object-contain" />
        </div>

        {/* 404 Glitch Badge */}
        <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-500/40 text-red-400 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Error 404 • Page Not Found</span>
        </div>

        {/* Main Headings */}
        <div className="space-y-2">
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-white tracking-wider">
            LOST IN <span className="text-[#F5C400]">BERMUDA?</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            The page you are looking for doesn't exist, has been removed, or the link is broken.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Link
            to="/"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm tracking-wider shadow-xl shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <div className="grid grid-cols-2 gap-2.5">
            <Link
              to="/tournaments"
              className="py-3 px-3 rounded-2xl bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] text-slate-200 font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <Swords className="w-3.5 h-3.5 text-[#F5C400]" />
              <span>Tournaments</span>
            </Link>

            <Link
              to="/contact"
              className="py-3 px-3 rounded-2xl bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] text-slate-200 font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Desk</span>
            </Link>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="text-xs text-slate-400 hover:text-white pt-2 flex items-center justify-center gap-1 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back to Previous Page</span>
          </button>
        </div>
      </div>
    </div>
  );
}
