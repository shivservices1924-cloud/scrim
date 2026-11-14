import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Copy, Check, ArrowDownToLine, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
        setWithdrawals(data);
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
  }, [token]);

  const copyToClipboard = (upi) => {
    navigator.clipboard.writeText(upi);
    setCopiedUpi(upi);
    setTimeout(() => setCopiedUpi(''), 2000);
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
            Withdrawal History
          </h1>
        </div>

        <button
          onClick={fetchWithdrawals}
          className="p-2 text-slate-400 hover:text-white"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Nav / Action */}
        <div className="flex items-center justify-between bg-[#10051e] p-3 rounded-2xl border border-purple-900/40">
          <div>
            <p className="text-xs text-slate-400">Total Requests</p>
            <p className="font-heading font-extrabold text-white text-lg">
              {withdrawals.length} Records
            </p>
          </div>
          <button
            onClick={() => navigate('/wallet/withdraw')}
            className="bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/30 active:scale-95 transition-all"
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
          <div className="py-12 text-center bg-[#10051e] rounded-2xl border border-purple-900/40 p-6 space-y-3">
            <Clock className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No withdrawal requests yet</p>
            <p className="text-xs text-slate-400">
              When you withdraw your winning balance, your request status (Pending or Done) will be tracked here.
            </p>
            <button
              onClick={() => navigate('/wallet/withdraw')}
              className="mt-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl"
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
                  className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3 shadow-md hover:border-purple-600/60 transition-colors"
                >
                  {/* Top: Amount & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase">Amount</span>
                      <span className="font-heading font-black text-2xl text-red-400">
                        ₹{w.amount}
                      </span>
                    </div>

                    <div>
                      {isPending && (
                        <span className="bg-amber-950/80 border border-amber-500/50 text-amber-300 font-heading font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          <span>Pending (Waiting Admin)</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-heading font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Done / Transferred</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="bg-red-950/80 border border-red-500/50 text-red-300 font-heading font-bold text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow">
                          <XCircle className="w-3.5 h-3.5 text-red-400" />
                          <span>Rejected & Refunded</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Transfer Details (UPI / Bank) */}
                  <div className="bg-[#0a0216] p-2.5 rounded-xl border border-purple-900/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Transfer Target ({w.method || 'UPI'})
                      </span>
                      <span className="font-mono text-cyan-300 font-bold text-xs tracking-wider">
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
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-purple-900/30">
                    <span>Requested: {new Date(w.createdAt).toLocaleString()}</span>
                    {w.adminNote && (
                      <span className="text-amber-300 font-medium truncate max-w-[150px]">
                        Note: {w.adminNote}
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
