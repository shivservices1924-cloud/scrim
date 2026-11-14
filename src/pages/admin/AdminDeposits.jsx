import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Clock,
  Filter,
  RefreshCw,
  X
} from 'lucide-react';

export default function AdminDeposits() {
  const { adminToken } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED, REJECTED
  const [selectedProof, setSelectedProof] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/deposits', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDeposits(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [adminToken]);

  const handleVerify = async (id, action) => {
    let note = '';
    if (action === 'REJECT') {
      note = prompt('Enter rejection reason (e.g. Invalid UTR / duplicate transaction):');
      if (note === null) return;
    }

    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/deposits/${id}/verify`, {
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
      fetchDeposits();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = deposits.filter(d => {
    if (filter === 'ALL') return true;
    return d.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
            DEPOSIT REQUESTS VERIFICATION
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify 12-digit UTR numbers & approve player deposit balances (Minimum ₹50)
          </p>
        </div>

        <button
          onClick={fetchDeposits}
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
                ? 'bg-blue-600 text-white shadow'
                : 'bg-[#0b1326] border border-blue-900/50 text-slate-400 hover:text-white'
            }`}
          >
            {st} ({deposits.filter(d => st === 'ALL' || d.status === st).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0b1326] border border-blue-900/50 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No deposit records found.</div>
        ) : (
          <>
            {/* Mobile Cards View (< md) */}
            <div className="md:hidden divide-y divide-blue-900/30">
              {filtered.map((d) => (
                <div key={d.id} className="p-4 space-y-3 bg-[#0b1326]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-heading font-black text-white text-base">{d.username}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        UTR: <span className="text-cyan-300 font-bold">{d.utrNumber}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-heading font-black text-emerald-400 text-lg">
                        ₹{d.amount}
                      </span>
                      <span
                        className={`block font-heading font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase mt-1 ${
                          d.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                            : d.status === 'APPROVED'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-red-950 text-red-400 border border-red-500/40'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-blue-900/30">
                    <span className="text-[11px]">
                      {new Date(d.createdAt).toLocaleString()}
                    </span>
                    {d.screenshotUrl ? (
                      <button
                        onClick={() => setSelectedProof(d.screenshotUrl)}
                        className="flex items-center gap-1 text-xs text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2.5 py-1 rounded-lg font-semibold active:scale-95"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Screenshot</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">No Screenshot</span>
                    )}
                  </div>

                  {d.status === 'PENDING' ? (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <button
                        onClick={() => handleVerify(d.id, 'APPROVE')}
                        disabled={actionLoading === d.id}
                        className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-xs shadow active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve Deposit</span>
                      </button>
                      <button
                        onClick={() => handleVerify(d.id, 'REJECT')}
                        disabled={actionLoading === d.id}
                        className="py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-heading font-black text-xs active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 bg-[#070c18] p-2 rounded-lg border border-blue-900/30">
                      Note: {d.adminNote || 'Processed'}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#070c18] border-b border-blue-900/40 text-slate-400 uppercase font-semibold">
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">12-Digit UTR Number</th>
                    <th className="p-3.5">Proof</th>
                    <th className="p-3.5">Submitted At</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/30">
                  {filtered.map((d) => (
                    <tr key={d.id} className="hover:bg-[#0e1933] transition-colors">
                      <td className="p-3.5 font-bold text-white">
                        {d.username}
                      </td>
                      <td className="p-3.5">
                        <span className="font-heading font-black text-emerald-400 text-sm">
                          ₹{d.amount}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-cyan-300 font-bold">
                        {d.utrNumber}
                      </td>
                      <td className="p-3.5">
                        {d.screenshotUrl ? (
                          <button
                            onClick={() => setSelectedProof(d.screenshotUrl)}
                            className="flex items-center gap-1 text-[11px] text-blue-400 hover:underline font-semibold"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500">None</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(d.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-heading font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase ${
                            d.status === 'PENDING'
                              ? 'bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse'
                              : d.status === 'APPROVED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-red-950 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {d.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleVerify(d.id, 'APPROVE')}
                              disabled={actionLoading === d.id}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg transition-transform active:scale-95 shadow flex items-center gap-1"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleVerify(d.id, 'REJECT')}
                              disabled={actionLoading === d.id}
                              className="bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 font-heading font-bold text-xs px-2.5 py-1.5 rounded-lg transition-transform active:scale-95 flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            {d.adminNote || 'Processed'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Screenshot Preview Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-lg w-full bg-[#0b1326] p-4 rounded-2xl border border-blue-800">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xs font-bold text-white mb-3">Deposit Payment Screenshot</h3>
            <img
              src={selectedProof}
              alt="Payment Proof"
              className="w-full max-h-[75vh] object-contain rounded-xl bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}
