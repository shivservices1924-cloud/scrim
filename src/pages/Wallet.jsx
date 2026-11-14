import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PlusCircle, ArrowDownToLine, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Wallet() {
  const navigate = useNavigate();
  const { user, token, refreshUser } = useAuth();

  const [walletData, setWalletData] = useState({
    totalBalance: 0,
    depositBalance: 0,
    winBalance: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);

  const fetchWallet = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWallet();
  }, [token]);

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#080d1a] text-white">
      <SEO
        title="Esports Wallet & Cash Payouts"
        description="Deposit funds, view your winnings balance, and withdraw instant cash to UPI on RushX Esports."
        path="/wallet"
      />
      {/* Top Header matching Screenshot 3 */}
      <div className="sticky top-0 z-40 bg-[#0a1124]/95 backdrop-blur-md border-b border-blue-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-[#122044] hover:bg-[#182b5c] border border-blue-500/30 flex items-center justify-center text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            Wallet
          </h1>
        </div>

        <button
          onClick={fetchWallet}
          aria-label="Refresh Balance"
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Balance Display Card (Screenshot 3) */}
        <div className="text-center py-6 px-4 bg-gradient-to-b from-[#0e1936] to-[#0a1126] border border-blue-900/60 rounded-3xl shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-blue-600/20 blur-3xl pointer-events-none"></div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Total Account Balance
          </p>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
              Total Balance = {walletData.totalBalance}
            </span>
          </div>

          {/* Purple separator pill like in screenshot 3 */}
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto my-3"></div>

          {/* Sub-row: Deposit Balance & Win Balance */}
          <div className="flex items-center justify-center gap-4 text-xs mt-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Deposit Balance: {walletData.depositBalance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-400 font-semibold bg-green-950/40 px-3 py-1 rounded-full border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>Win Balance: {walletData.winBalance}</span>
            </div>
          </div>

          <p className="text-[10px] text-amber-300 mt-3 font-medium">
            ⚠️ Only Win Balance can be withdrawn. Minimum withdrawal is ₹100.
          </p>
        </div>

        {/* Action Buttons: Buy More & Withdraw (Screenshot 3) */}
        <div className="space-y-3">
          {/* Green Button: Buy More (Deposit) */}
          <button
            onClick={() => navigate('/wallet/deposit')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Buy More (Min ₹50)</span>
          </button>

          {/* Red Button: Withdraw */}
          <button
            onClick={() => navigate('/wallet/withdraw')}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ArrowDownToLine className="w-5 h-5" />
            <span>Withdraw (Min ₹100 • Winnings Only)</span>
          </button>

          {/* Quick History Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigate('/wallet/deposit-history')}
              className="py-2.5 px-3 rounded-xl bg-[#0e1b3d] hover:bg-[#142654] border border-blue-500/30 text-emerald-400 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Deposit History</span>
            </button>
            <button
              onClick={() => navigate('/wallet/withdraw-history')}
              className="py-2.5 px-3 rounded-xl bg-[#0e1b3d] hover:bg-[#142654] border border-blue-500/30 text-rose-400 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Withdraw History</span>
            </button>
          </div>
        </div>

        {/* Section: Wallet history (Screenshot 3) */}
        <div className="space-y-3">
          <h2 className="font-heading font-extrabold text-base tracking-wide text-white">
            Wallet history
          </h2>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Loading transactions...
            </div>
          ) : walletData.transactions.length === 0 ? (
            <div className="py-8 text-center bg-[#0b1329] rounded-2xl border border-blue-900/40 p-4">
              <p className="text-xs text-slate-400">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {walletData.transactions.map((tx) => {
                const isCredit = tx.type === 'credit';
                return (
                  <div
                    key={tx.id}
                    className="bg-[#0b142b] border border-blue-900/50 rounded-2xl p-3.5 space-y-2 shadow-md hover:border-blue-700/60 transition-colors"
                  >
                    {/* Top Row: Type badge, Txn ID, Amount, Wallet Type, Date/Time, New Balance */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-heading font-black text-[11px] px-2 py-0.5 rounded uppercase tracking-wider ${
                            isCredit
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {tx.type}
                        </span>
                        <span className="text-slate-400 text-[11px] font-mono">
                          Transaction Id-{tx.txId}
                        </span>
                      </div>

                      <div className="text-right">
                        <span
                          className={`font-heading font-black text-sm ${
                            isCredit ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          Amt:{isCredit ? '+' : '-'} {tx.amount}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Target wallet and date */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>
                        {tx.walletType === 'win'
                          ? 'To winWallet'
                          : tx.walletType === 'deposit'
                          ? 'To depositWallet'
                          : 'From Wallet'}
                      </span>
                      <span>{tx.date}</span>
                    </div>

                    <div className="text-right text-[11px] text-blue-300 font-semibold">
                      New bal: {tx.newBalance}
                    </div>

                    {/* Bottom Row: Detailed Description */}
                    <p className="text-xs text-slate-300 bg-[#070d1e] p-2 rounded-xl border border-blue-900/40 leading-snug font-medium">
                      {tx.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
