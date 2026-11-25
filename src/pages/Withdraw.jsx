import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  Clock,
  Wallet,
  ArrowDownToLine,
  HelpCircle,
  History
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Withdraw() {
  const navigate = useNavigate();
  const { user, token, refreshUser, updateUserDirectly } = useAuth();

  const [amount, setAmount] = useState('100');
  const [method, setMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [accountDetails, setAccountDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [recentWithdrawals, setRecentWithdrawals] = useState([]);

  const winBalance = Number(user?.winBalance) || 0;
  const depositBalance = Number(user?.depositBalance) || 0;

  const fetchWithdrawals = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/wallet', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const txs = Array.isArray(data?.transactions) ? data.transactions : [];
        const withdrawals = txs.filter(tx => {
          const desc = String(tx?.description || '').toLowerCase();
          const type = String(tx?.type || '').toUpperCase();
          return desc.includes('withdraw') || type === 'WITHDRAW';
        });
        setRecentWithdrawals(withdrawals.slice(0, 3));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchWithdrawals();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < 100) {
      setError('Minimum withdrawal amount is ₹100.');
      return;
    }

    if (numAmount > 1000) {
      setError('Maximum withdrawal allowed in one transaction is ₹1,000.');
      return;
    }

    if (numAmount > winBalance) {
      setError(`Insufficient Win Balance! You have ₹${winBalance} in Win Balance. Deposit balance cannot be withdrawn.`);
      return;
    }

    if (method === 'UPI' && (!upiId.trim() || !upiId.includes('@'))) {
      setError('Please enter a valid UPI ID (e.g. name@okhdfcbank, 9876543210@paytm).');
      return;
    }

    if (method === 'BANK' && !accountDetails.trim()) {
      setError('Please enter Account Number, IFSC Code, and Account Holder Name.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: numAmount,
          method,
          upiId: upiId.trim(),
          accountDetails: accountDetails.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit withdrawal.');
      }

      setSuccess('Withdrawal request submitted! Payout will be processed to your account via instant IMPS/UPI within 10-30 minutes.');
      if (data.user && updateUserDirectly) {
        updateUserDirectly(data.user);
      }
      await refreshUser();
      fetchWithdrawals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Withdraw Winnings • RushX Esports"
        description="Instant UPI and Bank withdrawal for Free Fire tournament winnings."
        path="/withdraw"
      />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/wallet')}
            aria-label="Back to Wallet"
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-[#F5C400] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-black text-white text-lg tracking-wide">
            Withdraw Winnings
          </h1>
        </div>

        <button
          onClick={() => navigate('/withdraw-history')}
          className="text-xs font-heading font-black text-[#F5C400] bg-[#121620] hover:bg-[#1a202e] border border-[#F5C400]/40 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Available Win Balance Box */}
        <div className="bg-[#121620] border border-[#F5C400]/40 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
              Withdrawable Win Balance
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-heading font-black text-3xl sm:text-4xl text-[#F5C400]">
                ₹{winBalance}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Deposit Balance (₹{depositBalance}) cannot be withdrawn.
            </span>
          </div>

          <div className="text-right bg-[#0b0e14] p-3 rounded-xl border border-[#1f2738]">
            <span className="text-[9.5px] text-slate-400 uppercase font-mono font-bold">Minimum</span>
            <p className="text-xs font-black text-[#F5C400] mt-0.5">₹100</p>
          </div>
        </div>

        {/* Withdrawal Rules Box */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-3.5 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 text-[#F5C400] font-heading font-black text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#F5C400]" />
            <span>Withdrawal Policy</span>
          </div>
          <ul className="text-[11px] space-y-1 text-slate-300 list-disc list-inside">
            <li><b>Instant UPI Payouts:</b> Money transferred directly to your PhonePe/GPay UPI.</li>
            <li><b>Min / Max Limit:</b> ₹100 min to ₹1,000 max per transaction.</li>
            <li><b>Fair Play Anti-Cheat:</b> Accounts flagged for match teaming/hacks will be reviewed.</li>
          </ul>
        </div>

        {/* Error / Success Toast */}
        {error && (
          <div className="bg-red-950/70 border border-red-500/70 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/70 border border-emerald-500/70 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Withdrawal Form or Insufficient Balance */}
        {winBalance < 100 ? (
          <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-6 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#0b0e14] border border-[#F5C400]/40 flex items-center justify-center mx-auto text-[#F5C400]">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-base text-white">
              Minimum ₹100 Required to Withdraw
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your Win Balance is currently ₹{winBalance}. Play Free Fire Solo, Duo or CS tournaments to win real cash and withdraw!
            </p>
            <button
              onClick={() => navigate('/tournaments')}
              className="py-2.5 px-6 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Browse Tournaments
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 space-y-4 shadow-xl">
            <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
              Payout Details
            </h3>

            {/* Quick Amount Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Withdrawal Amount (₹100 - ₹1,000)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {['100', '200', '500', '1000'].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-1.5 rounded-xl text-xs font-heading font-black border transition-all ${
                      amount === amt
                        ? 'bg-[#F5C400] border-[#F5C400] text-black shadow-md'
                        : 'bg-[#0b0e14] border-[#1f2738] text-slate-300 hover:border-[#F5C400]/60'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="100"
                max="1000"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono"
                placeholder="Enter amount (100 - 1000)"
              />
            </div>

            {/* Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payout Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`py-2 rounded-xl text-xs font-heading font-black border transition-all ${
                    method === 'UPI'
                      ? 'bg-[#F5C400] border-[#F5C400] text-black shadow-md'
                      : 'bg-[#0b0e14] border-[#1f2738] text-slate-400 hover:text-white'
                  }`}
                >
                  UPI (PhonePe, GPay, Paytm)
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('BANK')}
                  className={`py-2 rounded-xl text-xs font-heading font-black border transition-all ${
                    method === 'BANK'
                      ? 'bg-[#F5C400] border-[#F5C400] text-black shadow-md'
                      : 'bg-[#0b0e14] border-[#1f2738] text-slate-400 hover:text-white'
                  }`}
                >
                  Bank Transfer (IMPS)
                </button>
              </div>
            </div>

            {/* Dynamic Inputs based on Method */}
            {method === 'UPI' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  UPI ID (VPA) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm or name@okaxis"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Make sure your UPI ID is active to receive instant cash.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank Account Number, IFSC & Name <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="A/C No: 123456789&#10;IFSC: SBIN0001234&#10;Name: Rahul Sharma"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl p-3 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>{loading ? 'Processing Withdrawal...' : `Withdraw ₹${amount} Now`}</span>
            </button>
          </form>
        )}

        {/* Recent Withdrawals Quick Strip */}
        {recentWithdrawals.length > 0 && (
          <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                Recent Withdrawal Requests
              </span>
              <button
                onClick={() => navigate('/withdraw-history')}
                className="text-[11px] text-[#F5C400] hover:underline font-bold"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {recentWithdrawals.map((w, idx) => (
                <div
                  key={w.id || idx}
                  className="bg-[#0b0e14] border border-[#1f2738] rounded-xl p-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">₹{Math.abs(w.amount)}</span>
                    <span className="text-[10px] text-slate-400">{w.description || 'Withdrawal'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {w.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
