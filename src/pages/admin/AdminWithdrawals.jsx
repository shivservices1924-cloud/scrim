import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowDownToLine,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function AdminWithdrawals() {
  const { adminToken } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${adminToken}` }
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
    fetchWithdrawals();
  }, [adminToken]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerify = async (id, action) => {
    let note = '';
    if (action === 'APPROVE') {
      note = prompt('Enter Bank/UPI Payment Ref number (optional):', 'Paid via UPI');
      if (note === null) return;
    } else {
      note = prompt('Enter reason for rejection (amount will be refunded to player):', 'Incorrect UPI ID or details');
      if (note === null) return;
    }

    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/withdrawals/${id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ action, adminNote: note })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      setMsg(data.message);
      setTimeout(() => setMsg(''), 4000);
      fetchWithdrawals();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = withdrawals.filter(w => {
    if (filter === 'ALL') return true;
    return w.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
            WITHDRAWAL PAYOUT REQUESTS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process winnings payouts to players via UPI or Bank IMPS (Min ₹100 • Max 2/Day)
          </p>
        </div>

        <button
          onClick={fetchWithdrawals}
          className="p-2 text-slate-400 hover:text-white self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {msg && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold transition-all ${
              filter === st
                ? 'bg-purple-600 text-white shadow'
                : 'bg-[#10051e] border border-purple-900/50 text-slate-400 hover:text-white'
            }`}
          >
            {st} ({withdrawals.filter(w => st === 'ALL' || w.status === st).length})
          </button>
        ))}
      </div>

      {/* Table & Mobile Cards */}
      <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No withdrawal records found.</div>
        ) : (
          <>
            {/* Mobile Cards (< md) */}
            <div className="md:hidden divide-y divide-purple-900/30">
              {filtered.map((w) => {
                const payTarget = w.upiId || w.accountDetails;
                return (
                  <div key={w.id} className="p-4 space-y-3 bg-[#10051e]">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-heading font-black text-white text-base">{w.username}</p>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Req ID: {w.id.slice(-6)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-heading font-black text-red-400 text-lg">
                          ₹{w.amount}
                        </span>
                        <span
                          className={`block font-heading font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase mt-1 ${
                            w.status === 'PENDING'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                              : w.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-950 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {w.status === 'APPROVED' ? 'DONE' : w.status}
                        </span>
                      </div>
                    </div>

                    {/* Copyable UPI Target */}
                    <div className="bg-[#0a0216] p-2.5 rounded-xl border border-purple-900/60 flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Payout UPI / Bank:</span>
                        <span className="font-mono text-cyan-300 font-bold text-xs truncate block">
                          {payTarget}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(payTarget, w.id)}
                        className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95"
                      >
                        {copiedId === w.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{new Date(w.createdAt).toLocaleString()}</span>
                      <span className="text-slate-500">Win Balance</span>
                    </div>

                    {w.status === 'PENDING' ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleVerify(w.id, 'APPROVE')}
                          disabled={actionLoading === w.id}
                          className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xs shadow active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve (Paid)</span>
                        </button>
                        <button
                          onClick={() => handleVerify(w.id, 'REJECT')}
                          disabled={actionLoading === w.id}
                          className="py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-heading font-black text-xs active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject & Refund</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 bg-[#0a0216] p-2 rounded-lg border border-purple-900/30">
                        Note: {w.adminNote || 'Processed'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0a0216] border-b border-purple-900/40 text-slate-400 uppercase font-semibold">
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Withdraw Amount</th>
                    <th className="p-3.5">Payment Details (UPI / Bank)</th>
                    <th className="p-3.5">Requested At</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30">
                  {filtered.map((w) => {
                    const payTarget = w.upiId || w.accountDetails;
                    return (
                      <tr key={w.id} className="hover:bg-[#180930] transition-colors">
                        <td className="p-3.5 font-bold text-white">
                          {w.username}
                        </td>
                        <td className="p-3.5">
                          <span className="font-heading font-black text-red-400 text-base">
                            ₹{w.amount}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-cyan-300 font-semibold bg-[#0a0216] px-2 py-1 rounded border border-purple-900">
                              {payTarget}
                            </span>
                            <button
                              onClick={() => copyToClipboard(payTarget, w.id)}
                              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                              title="Copy UPI ID"
                            >
                              {copiedId === w.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(w.createdAt).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-heading font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase ${
                              w.status === 'PENDING'
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                                : w.status === 'APPROVED'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                                : 'bg-red-950 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {w.status === 'APPROVED' ? 'DONE' : w.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {w.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleVerify(w.id, 'APPROVE')}
                                disabled={actionLoading === w.id}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs px-3 py-1.5 rounded-lg transition-transform active:scale-95 shadow flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve (Done)</span>
                              </button>
                              <button
                                onClick={() => handleVerify(w.id, 'REJECT')}
                                disabled={actionLoading === w.id}
                                className="bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg transition-transform active:scale-95 flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject & Refund</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {w.adminNote || 'Processed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
