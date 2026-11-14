import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, AlertCircle, Shield, CheckCircle, Wallet, ArrowRight } from 'lucide-react';

export default function JoinModal({ tournament, isOpen, onClose, onJoinedSuccess }) {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [ffIgn, setFfIgn] = useState(user?.ffIgn || '');
  const [ffUid, setFfUid] = useState(user?.ffUid || '');
  const [teammateIgn, setTeammateIgn] = useState('');
  const [teammateUid, setTeammateUid] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !tournament) return null;

  const totalBalance = user ? (Number(user.depositBalance) || 0) + (Number(user.winBalance) || 0) : 0;
  const entryFee = Number(tournament.entryFee);
  const hasEnoughBalance = totalBalance >= entryFee;

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }

    if (!ffIgn.trim() || !ffUid.trim()) {
      setError('Please enter your Free Fire In-Game Name (IGN) and Player UID.');
      return;
    }

    if (tournament.matchType === 'DUO' && (!teammateIgn.trim() || !teammateUid.trim())) {
      setError('Please enter your Teammate Free Fire IGN and UID for Duo match.');
      return;
    }

    if (!hasEnoughBalance) {
      setError(`Insufficient wallet balance. You need ₹${entryFee}, but only have ₹${totalBalance}.`);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/tournaments/${tournament.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ffIgn: ffIgn.trim(),
          ffUid: ffUid.trim(),
          teammateIgn: teammateIgn.trim(),
          teammateUid: teammateUid.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to join tournament.');
      }

      await refreshUser();
      onJoinedSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0c152e] border border-blue-800/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="bg-blue-600/30 text-blue-400 text-[10px] font-heading font-bold px-2 py-0.5 rounded uppercase border border-blue-500/30">
            {tournament.gameType} {tournament.matchType} Contest
          </span>
          <h2 className="font-heading font-extrabold text-white text-lg mt-1 leading-snug">
            {tournament.title}
          </h2>
          <p className="text-xs text-blue-300 mt-0.5">Match ID: {tournament.matchId}</p>
        </div>

        {/* Fee & Wallet Summary */}
        <div className="bg-[#080d1e] p-3 rounded-xl border border-blue-900/40 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Entry Fee:</span>
            <p className="font-heading font-extrabold text-amber-400 text-lg">₹{entryFee}</p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Your Wallet Balance:</span>
            <div className="flex items-center gap-1 justify-end">
              <Wallet className="w-3.5 h-3.5 text-blue-400" />
              <p
                className={`font-heading font-extrabold text-base ${
                  hasEnoughBalance ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                ₹{totalBalance}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-3 mb-4 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!user ? (
          <div className="text-center py-4 space-y-3">
            <p className="text-sm text-slate-300">You must be logged in to join tournaments.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm"
            >
              Log In to Continue
            </button>
          </div>
        ) : !hasEnoughBalance ? (
          <div className="space-y-3 py-2">
            <div className="bg-amber-950/40 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-200">
              Low Balance! You need ₹{entryFee - totalBalance} more to join this match.
              <br />
              <span className="font-bold text-amber-300">Minimum deposit is ₹50.</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate('/wallet/deposit');
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
            >
              Add Money to Wallet (Min ₹50)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-3">
            {/* Player In-Game Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Free Fire Name (IGN) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                placeholder="Exact In-Game Name (e.g. God_Devil)"
                className="w-full bg-[#080d1e] border border-blue-900 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Free Fire Player UID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                placeholder="e.g. 35444498"
                className="w-full bg-[#080d1e] border border-blue-900 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>

            {/* If DUO match, require Teammate info */}
            {tournament.matchType === 'DUO' && (
              <div className="pt-2 border-t border-blue-900/40 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  Teammate (Player 2) Details:
                </span>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teammate FF Name (IGN) <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teammateIgn}
                    onChange={(e) => setTeammateIgn(e.target.value)}
                    placeholder="Teammate IGN"
                    className="w-full bg-[#080d1e] border border-blue-900 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teammate FF Player UID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={teammateUid}
                    onChange={(e) => setTeammateUid(e.target.value)}
                    placeholder="Teammate UID"
                    className="w-full bg-[#080d1e] border border-blue-900 focus:border-blue-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-2.5 text-[11px] text-blue-200">
              ⚡ ₹{entryFee} will be deducted from your wallet balance. Room ID & Password will be available on this page 10 minutes before match time.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Processing Join...' : `Confirm & Pay ₹${entryFee}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
