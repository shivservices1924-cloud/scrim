import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowDownToLine,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function WithdrawHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState('');

  const fetchWithdrawals = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/wallet/withdrawals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(Array.isArray(data) ? data : []);
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
    fetchWithdrawals();
    const interval = setInterval(fetchWithdrawals, 4000);
    return () => clearInterval(interval);
  }, [token]);

  const copyToClipboard = (upi) => {
    navigator.clipboard.writeText(upi);
    setCopiedUpi(upi);
    setTimeout(() => setCopiedUpi(''), 2000);
  };

  return (
      <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
        <SEO
          title="Withdrawal History • RushX Esports"
          description="Track your cashout withdrawal status and UPI payout history."
          path="/wallet/withdraw-history"
        />
        {/* Header */}
          <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/wallet')}
                className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-slate-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
                Withdrawal History
              </h1>
            </div>

            <button
              onClick={fetchWithdrawals}
              className="p-2 text-slate-400 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#F5C400]' : ''}`} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Quick Nav / Action */}
              <div className="flex items-center justify-between bg-[#121620] p-3.5 rounded-2xl border border-[#1f2738]">
                <div>
                  <p className="text-xs text-slate-400">Total Requests</p>
                  <p className="font-heading font-extrabold text-white text-lg">
                    {withdrawals.length} Records
                  </p>
                </div>
                <button
                  onClick={() => navigate('/wallet/withdraw')}
                  className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Withdraw More</span>
                </button>
              </div>

              {/* List */}
              {loading ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Loading withdrawal history...
                </div>
              ) : withdrawals.length === 0 ? (
                  <div className="py-12 text-center bg-[#121620] rounded-2xl border border-[#1f2738] p-6 space-y-3">
                    <Clock className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No withdrawal requests yet</p>
                    <p className="text-xs text-slate-400">
                      When you withdraw your winning balance, your request status (Pending or Done) will be tracked here.
                    </p>
                    <button
                      onClick={() => navigate('/wallet/withdraw')}
                      className="mt-2 bg-[#F5C400] hover:bg-[#FFD000] text-black text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Withdraw Win Balance
                    </button>
                  </div>
                  ) : (
                  <div className="space-y-3">
                    {withdrawals.map((w) => {
                      const isApproved = w.status === 'APPROVED';
                      const isPending = w.status === 'PENDING';
                      const isRejected = w.status === 'REJECTED';

                      return (
                        <div
                          key={w.id}
                          className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 space-y-3 shadow-md hover:border-[#F5C400]/40 transition-colors"
                        >
                          {/* Top: Amount & Status Badge */}
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-[11px] text-slate-400 block font-semibold uppercase">Amount</span>
                                <span className="font-heading font-black text-2xl text-emerald-400">
                                  ₹{w.amount}
                                </span>
                            </div>

                            <div>
                              {isPending && (
                                <span className="bg-amber-950/90 border border-amber-400 text-amber-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-950/50">
                                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                  <span>PENDING (Under Review)</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-950/50">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>APPROVED (Payment Sent)</span>
                                </span>
                              )}
                              {isRejected && (
                                <span className="bg-red-950/90 border border-red-400 text-red-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-950/50">
                                  <XCircle className="w-4 h-4 text-red-400" />
                                  <span>REJECTED (Refunded)</span>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Transfer Details (UPI / Bank) */}
                            <div className="bg-[#0b0e14] p-2.5 rounded-xl border border-[#1f2738] flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                  Transfer Target ({w.method || 'UPI'})
                                </span>
                                  <span className="font-mono text-[#F5C400] font-bold text-xs tracking-wider">
                                    {w.upiId || w.accountDetails}
                                  </span>
                              </div>
                              {w.upiId && (
                                <button
                                  onClick={() => copyToClipboard(w.upiId)}
                                  className="p-1.5 text-slate-400 hover:text-white"
                                  title="Copy UPI"
                                >
                                  {copiedUpi === w.upiId ? (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Timestamps & Notes */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1f2738] gap-1">
                                <span>Requested: {new Date(w.createdAt).toLocaleString()}</span>
                                {w.processedAt && (
                                  <span className="text-emerald-400 font-semibold">
                                    Processed: {new Date(w.processedAt).toLocaleString()}
                                  </span>
                                )}
                                {w.adminNote && (
                                  <span className="text-amber-300 font-medium">
                                    Admin Note: {w.adminNote}
                                  </span>
                                )}
                              </div>
                            </div>
                            );
            })}
                          </div>
        )}
                        </div>
    </div>
                  );
}
