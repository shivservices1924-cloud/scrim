import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function DepositHistory() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUtr, setCopiedUtr] = useState('');

  const fetchDeposits = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetch('/api/wallet/deposits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDeposits(Array.isArray(data) ? data : []);
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
    fetchDeposits();
    const interval = setInterval(fetchDeposits, 4000);
    return () => clearInterval(interval);
  }, [token]);

  const copyToClipboard = (utr) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(''), 2000);
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Deposit History • RushX Esports"
        description="Check your UPI cash deposit request history and approval status."
        path="/wallet/deposit-history"
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
            Deposit History
          </h1>
        </div>

        <button
          onClick={fetchDeposits}
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
            <p className="text-xs text-slate-400">Total Deposits</p>
            <p className="font-heading font-extrabold text-white text-lg">
              {deposits.length} Records
            </p>
          </div>
          <button
            onClick={() => navigate('/deposit')}
            className="bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Add More Cash</span>
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Loading deposit history...
          </div>
        ) : deposits.length === 0 ? (
          <div className="py-12 text-center bg-[#121620] rounded-2xl border border-[#1f2738] p-6 space-y-3">
            <Clock className="w-8 h-8 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No deposit records yet</p>
            <p className="text-xs text-slate-400">
              When you submit a UPI deposit and UTR number, your approval status will show here.
            </p>
            <button
              onClick={() => navigate('/deposit')}
              className="mt-2 bg-[#F5C400] hover:bg-[#FFD000] text-black text-xs font-bold px-4 py-2 rounded-xl"
            >
              Deposit Funds Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {deposits.map((d) => {
              const isApproved = d.status === 'APPROVED';
              const isPending = d.status === 'PENDING';
              const isRejected = d.status === 'REJECTED';

              return (
                <div
                  key={d.id}
                  className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 space-y-3 shadow-md hover:border-[#F5C400]/40 transition-colors"
                >
                  {/* Top: Amount & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold uppercase">Amount</span>
                      <span className="font-heading font-black text-2xl text-[#F5C400]">
                        ₹{d.amount}
                      </span>
                    </div>

                    <div>
                      {isPending && (
                        <span className="bg-amber-950/90 border border-amber-400 text-amber-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-amber-950/50">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                          <span>PENDING</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="bg-emerald-950/90 border border-emerald-400 text-emerald-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-950/50">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>APPROVED</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="bg-red-950/90 border border-red-400 text-red-300 font-heading font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-red-950/50">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span>FAILED</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* UTR Details */}
                  <div className="bg-[#0b0e14] p-2.5 rounded-xl border border-[#1f2738] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        UTR / Transaction ID
                      </span>
                      <span className="font-mono text-slate-200 font-bold text-xs tracking-wider">
                        {d.utrNumber || d.utr || 'N/A'}
                      </span>
                    </div>
                    {d.utrNumber && (
                      <button
                        onClick={() => copyToClipboard(d.utrNumber)}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="Copy UTR"
                      >
                        {copiedUtr === d.utrNumber ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Timestamps & Notes */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#1f2738] gap-1">
                    <span>Submitted: {new Date(d.createdAt).toLocaleString()}</span>
                    {d.approvedAt && (
                      <span className="text-emerald-400 font-semibold">
                        Approved: {new Date(d.approvedAt).toLocaleString()}
                      </span>
                    )}
                    {d.adminNote && (
                      <span className="text-amber-300 font-medium">
                        Admin Note: {d.adminNote}
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
