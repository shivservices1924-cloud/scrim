import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, ArrowUpRight, ArrowDownLeft, Wallet as WalletIcon, PlusCircle } from 'lucide-react';
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
        refreshUser();
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
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-black text-white text-lg tracking-wide">
            Wallet
          </h1>
        </div>

        <button
          onClick={fetchWallet}
          aria-label="Refresh Balance"
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh Balance"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F5C400]' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Screen 9: Total Balance Card */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Balance
              </p>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-1">
                ₹ {walletData.totalBalance || (walletData.depositBalance + walletData.winBalance)}
              </h2>
            </div>

            <button
              onClick={() => navigate('/withdraw')}
              className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs px-4 py-2 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all uppercase tracking-wider"
            >
              Withdraw
            </button>
          </div>

          {/* Sub-row: Deposit Balance vs Winnings */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#1f2738] text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Deposit Balance</span>
              <span className="font-heading font-black text-sm text-white">₹ {walletData.depositBalance || 0}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Winning Balance</span>
              <span className="font-heading font-black text-sm text-[#F5C400]">₹ {walletData.winBalance || 0}</span>
            </div>
          </div>
        </div>

        {/* Deposit Quick Action */}
        <button
          onClick={() => navigate('/deposit')}
          className="w-full py-3 rounded-xl bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] text-[#F5C400] font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Money / Deposit (Instant UPI)</span>
        </button>

        {/* Screen 9: Transaction History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm text-white tracking-wide">
              Transaction History
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Recent
            </span>
          </div>

          {(!walletData.transactions || walletData.transactions.length === 0) ? (
            <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-8 text-center text-xs text-slate-400">
              No transactions yet. Join tournaments or add money to start competing!
            </div>
          ) : (
            <div className="space-y-2">
              {walletData.transactions.map((tx, idx) => {
                const isCredit = tx.type === 'WIN' || tx.type === 'DEPOSIT' || (tx.amount > 0 && !tx.isDebit);
                const title = tx.type === 'WIN'
                  ? 'Tournament Win'
                  : tx.type === 'JOIN'
                  ? 'Entry Fee Deducted'
                  : tx.type === 'WITHDRAW'
                  ? 'Payout Received'
                  : tx.description || 'Transaction';

                return (
                  <div
                    key={tx.id || idx}
                    className="bg-[#121620] border border-[#1f2738] rounded-xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCredit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs text-white">
                          {title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          }) : 'Recent'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`font-heading font-black text-sm ${
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
