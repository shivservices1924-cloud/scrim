import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle, ShieldCheck, Clock, Wallet, ArrowDownToLine } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Withdraw() {
  const navigate = useNavigate();
  const { user, token, refreshUser } = useAuth();

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
        const withdrawals = data.transactions.filter(
          tx => tx.description.toLowerCase().includes('withdrawal')
        );
        setRecentWithdrawals(withdrawals);
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
      setError('Please enter a valid UPI ID (e.g. yourname@oksbi, phone@paytm).');
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

      setSuccess('Withdrawal request submitted! Funds will be transferred to your account within 10-30 minutes.');
      await refreshUser();
      fetchWithdrawals();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/wallet')}
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            Withdraw Winnings
          </h1>
        </div>

        <button
          onClick={() => navigate('/wallet/withdraw-history')}
          className="text-xs font-heading font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-3 py-1.5 rounded-xl hover:bg-rose-900/60 transition-colors"
        >
          History
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Important Rules Alert Box */}
        <div className="bg-gradient-to-r from-red-950/60 to-[#0e1733] border border-red-500/40 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-400 font-heading font-extrabold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>RushX Withdrawal Rules:</span>
          </div>
          <ul className="text-xs space-y-1 text-slate-300 list-disc list-inside">
            <li><b>Winning Amount Only:</b> Only earnings won from matches can be withdrawn.</li>
            <li><b>Minimum Withdrawal:</b> ₹100 per transaction.</li>
            <li><b>Daily Limit:</b> Maximum 2 withdrawals allowed per 24 hours.</li>
          </ul>
        </div>

        {/* Available Win Balance Box */}
        <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">
              Withdrawable Win Balance:
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-heading font-black text-3xl text-emerald-400">
                ₹{winBalance}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              Deposit Balance (₹{depositBalance}) cannot be withdrawn.
            </span>
          </div>

          <div className="text-right bg-[#180930] p-2.5 rounded-xl border border-purple-900/50">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Daily Limit</span>
            <p className="text-xs font-bold text-purple-300 mt-0.5">Max 2 / Day</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Withdrawal Form */}
        {winBalance < 100 ? (
          <div className="bg-[#10051e] border border-amber-500/30 rounded-2xl p-5 text-center space-y-3">
            <Clock className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="font-heading font-bold text-base text-white">
              Minimum ₹100 Required to Withdraw
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your Win Balance is currently ₹{winBalance}. Play BR & CS tournaments to win more cash and unlock withdrawals!
            </p>
            <button
              onClick={() => navigate('/tournaments')}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-heading font-bold text-sm shadow-md shadow-purple-600/30"
            >
              Play Tournaments
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 space-y-4">
            <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
              Request Withdrawal
            </h3>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Withdrawal Amount (₹100 - ₹1,000 / transaction, Available: ₹{winBalance}) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                {['100', '200', '500', '1000'].filter(a => Number(a) <= winBalance).map(preset => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="py-1 px-3 rounded-lg bg-[#0a0216] border border-purple-900/60 text-xs font-heading font-bold hover:border-purple-500"
                  >
                    ₹{preset}
                  </button>
                ))}
                {winBalance > 0 && winBalance <= 1000 && (
                  <button
                    type="button"
                    onClick={() => setAmount(String(winBalance))}
                    className="py-1 px-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-heading font-bold ml-auto"
                  >
                    All (₹{winBalance})
                  </button>
                )}
              </div>
              <input
                type="number"
                min="100"
                max={Math.min(1000, winBalance)}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#0a0216] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                placeholder="Enter amount (100 - 1000)"
              />
            </div>

            {/* Method Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payout Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`py-2 rounded-xl text-xs font-heading font-bold border transition-all ${
                    method === 'UPI'
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 border-purple-400 text-white shadow-md'
                      : 'bg-[#0a0216] border-purple-900/60 text-slate-300'
                  }`}
                >
                  UPI ID (Fastest)
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('BANK')}
                  className={`py-2 rounded-xl text-xs font-heading font-bold border transition-all ${
                    method === 'BANK'
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 border-purple-400 text-white shadow-md'
                      : 'bg-[#0a0216] border-purple-900/60 text-slate-300'
                  }`}
                >
                  Bank Transfer (IMPS)
                </button>
              </div>
            </div>

            {/* UPI or Bank Input */}
            {method === 'UPI' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your UPI ID (Google Pay, PhonePe, Paytm) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm or name@oksbi"
                  className="w-full bg-[#0a0216] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Bank Account Details (A/C No, IFSC, Name) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  placeholder="Name: &#10;Account No: &#10;IFSC Code: "
                  className="w-full bg-[#0a0216] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 text-xs"
                ></textarea>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-red-600/30 active:scale-[0.98] transition-all"
            >
              {loading ? 'Processing...' : `Confirm Withdrawal of ₹${amount}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
