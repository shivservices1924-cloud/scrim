import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet as WalletIcon,
  PlusCircle,
  History,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
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

  const fetchWallet = async (isBackground = false) => {
    if (!token) return;
    try {
      if (!isBackground) setLoading(true);
      const res = await fetch(`/api/wallet?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setWalletData(data);
        await refreshUser();
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWallet();
    const interval = setInterval(() => fetchWallet(true), 3500);
    return () => clearInterval(interval);
  }, [token]);

  const currentDep = Number(user?.depositBalance ?? walletData.depositBalance ?? 0);
  const currentWin = Number(user?.winBalance ?? walletData.winBalance ?? 0);
  const currentTotal = currentDep + currentWin;

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Esports Wallet • RushX Esports"
        description="View your balance, instant UPI withdrawals, and transaction history on RushX Esports."
        path="/wallet"
      />

      {/* Screen 9 Header */}
      <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-[#F5C400] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-black text-white text-lg tracking-wide">
            Wallet
          </h1>
        </div>

        <button
          onClick={() => fetchWallet(false)}
          aria-label="Refresh Balance"
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F5C400]' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Screen 9: Total Balance Card */}
        <div className="bg-[#121620] border-2 border-[#F5C400]/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Total Available Balance
              </p>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
                ₹ {currentTotal}
              </h2>
            </div>

            <button
              onClick={() => navigate('/withdraw')}
              className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-wider cursor-pointer"
            >
              Withdraw
            </button>
          </div>

          {/* Sub-row: Deposit Balance vs Winnings */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1f2738] text-xs">
            <div className="bg-[#0b0e14] p-2.5 rounded-xl border border-[#1f2738]">
              <span className="text-slate-400 block text-[9.5px] uppercase font-mono font-bold">Deposit Balance</span>
              <span className="font-heading font-black text-sm text-white">₹ {currentDep}</span>
            </div>
            <div className="bg-[#0b0e14] p-2.5 rounded-xl border border-[#1f2738]">
              <span className="text-slate-400 block text-[9.5px] uppercase font-mono font-bold">Winning Balance</span>
              <span className="font-heading font-black text-sm text-[#F5C400]">₹ {currentWin}</span>
            </div>
          </div>
        </div>

        {/* Deposit Quick Action */}
        <button
          onClick={() => navigate('/deposit')}
          className="w-full py-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Money / Deposit (Instant UPI)</span>
        </button>

        {/* History Quick Links */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate('/deposit-history')}
            className="py-2.5 px-3 rounded-xl bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] text-xs font-heading font-black text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#F5C400]" />
            <span>Deposit History</span>
          </button>
          <button
            onClick={() => navigate('/withdraw-history')}
            className="py-2.5 px-3 rounded-xl bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] text-xs font-heading font-black text-white flex items-center justify-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#F5C400]" />
            <span>Withdraw History</span>
          </button>
        </div>

        {/* Transaction History Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-white tracking-wide">
              Recent Transactions
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              Live Passbook
            </span>
          </div>

          {(!walletData.transactions || walletData.transactions.length === 0) ? (
            <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-8 text-center text-xs text-slate-400">
              No transactions yet. Join tournaments or add money to start competing!
            </div>
          ) : (
            <div className="space-y-2">
              {walletData.transactions.map((tx, idx) => {
                const isCredit = tx.type === 'credit' || tx.type === 'WIN' || tx.type === 'DEPOSIT' || (tx.amount > 0 && !tx.isDebit);
                const desc = String(tx.description || '');
                const isFailed = desc.toLowerCase().includes('fail') || desc.toLowerCase().includes('reject');
                const isApproved = desc.toLowerCase().includes('approved') || desc.toLowerCase().includes('verified') || isCredit;
                const isPending = desc.toLowerCase().includes('pending');

                const title = tx.type === 'WIN'
                  ? 'Tournament Win'
                  : tx.type === 'JOIN' || tx.walletType === 'entry_fee'
                  ? 'Entry Fee Deducted'
                  : tx.type === 'WITHDRAW'
                  ? 'Payout Received'
                  : desc || 'Transaction';

                return (
                  <div
                    key={tx.id || idx}
                    className="bg-[#121620] border border-[#1f2738] hover:border-[#F5C400]/40 rounded-xl p-3 flex items-center justify-between transition-colors shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isCredit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-heading font-bold text-xs text-white truncate">
                            {title}
                          </h4>
                          {isPending && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-1.5 rounded">
                              PENDING
                            </span>
                          )}
                          {isFailed && (
                            <span className="text-[9px] font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-1.5 rounded">
                              FAILED
                            </span>
                          )}
                          {!isPending && !isFailed && isApproved && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-1.5 rounded">
                              APPROVED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : tx.date || 'Recent'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className={`font-heading font-black text-sm block ${
                        isCredit ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isCredit ? `+ ₹ ${Math.abs(tx.amount)}` : `- ₹ ${Math.abs(tx.amount)}`}
                      </span>
                    </div>
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
