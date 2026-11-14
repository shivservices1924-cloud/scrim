import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Swords,
  CreditCard,
  ArrowDownToLine,
  Trophy,
  Plus,
  CheckCircle,
  Clock,
  ArrowRight,
  PieChart,
  TrendingUp,
  Coins,
  DollarSign,
  Wallet,
  Calendar,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminToken } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTournamentsCount: 0,
    pendingDepositsCount: 0,
    pendingWithdrawalsCount: 0,
    totalPrizePool: 0,
    recentTournaments: [],
    pendingDeposits: [],
    pendingWithdrawals: []
  });
  const [loading, setLoading] = useState(true);

  // Financial Donut Tracker State & Filter
  const [period, setPeriod] = useState('today'); // 'today' | '2days' | '7days' | '30days' | 'all'
  const [financial, setFinancial] = useState({
    period: 'today',
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    netProfit: 0,
    profitMargin: 0,
    entryFeesCollected: 0,
    prizesDistributed: 0,
    tournamentProfit: 0,
    tournamentMargin: 0,
    depositsApproved: 0,
    withdrawalsApproved: 0,
    joinedCount: 0,
    depositsCount: 0,
    withdrawalsCount: 0
  });
  const [loadingFin, setLoadingFin] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinancial = async (selectedPeriod = period) => {
    try {
      setLoadingFin(true);
      const res = await fetch(`/api/admin/financial-stats?period=${selectedPeriod}`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFinancial(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFin(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchFinancial(period);
  }, [adminToken]);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    fetchFinancial(newPeriod);
  };

  // Donut SVG Calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const totalFlow = (Number(financial.totalMoneyIn) || 0) + (Number(financial.totalMoneyOut) || 0);

  const inPercent = totalFlow > 0 ? (financial.totalMoneyIn / totalFlow) : 0;
  const outPercent = totalFlow > 0 ? (financial.totalMoneyOut / totalFlow) : 0;

  const inStrokeDash = totalFlow > 0 ? inPercent * circumference : circumference;
  const outStrokeDash = totalFlow > 0 ? outPercent * circumference : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
            OPERATIONS DASHBOARD
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time management for RushX tournaments, deposits, withdrawals & kills
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { fetchDashboard(); fetchFinancial(period); }}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition-all"
            title="Refresh Dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${loading || loadingFin ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => navigate('/control-room-777/tournaments')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/30 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Match</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Total Players</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="font-heading font-black text-3xl text-white mt-2">
            {stats.totalUsers}
          </p>
          <span className="text-[10px] text-purple-400 font-medium">Registered Accounts</span>
        </div>

        {/* Active Tournaments */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Live/Upcoming Matches</span>
            <Swords className="w-5 h-5 text-amber-400" />
          </div>
          <p className="font-heading font-black text-3xl text-amber-400 mt-2">
            {stats.activeTournamentsCount}
          </p>
          <span className="text-[10px] text-slate-400 font-medium">BR & CS Matches</span>
        </div>

        {/* Pending Deposits */}
        <div
          onClick={() => navigate('/control-room-777/deposits')}
          className="bg-[#10051e] border border-emerald-500/40 rounded-2xl p-4 shadow-lg cursor-pointer hover:border-emerald-400 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Pending Deposits</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="font-heading font-black text-3xl text-emerald-400 mt-2">
            {stats.pendingDepositsCount}
          </p>
          <span className="text-[10px] text-emerald-300 font-bold">
            {stats.pendingDepositsCount > 0 ? 'Requires Verification →' : 'All Clear'}
          </span>
        </div>

        {/* Pending Withdrawals */}
        <div
          onClick={() => navigate('/control-room-777/withdrawals')}
          className="bg-[#10051e] border border-red-500/40 rounded-2xl p-4 shadow-lg cursor-pointer hover:border-red-400 transition-all"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase">Pending Payouts</span>
            <ArrowDownToLine className="w-5 h-5 text-red-400" />
          </div>
          <p className="font-heading font-black text-3xl text-red-400 mt-2">
            {stats.pendingWithdrawalsCount}
          </p>
          <span className="text-[10px] text-red-300 font-bold">
            {stats.pendingWithdrawalsCount > 0 ? 'Needs UPI Payout →' : 'All Paid'}
          </span>
        </div>
      </div>

      {/* NEW: Financial Donut Accounting & Cash Flow Tracker */}
      <div className="bg-[#10051e] border border-purple-900/60 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
                <span>CASH FLOW & PROFIT ACCOUNTING</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Paisa laga (Inflow), distribute hua (Outflow), aur bacha hua hisaab (Net Profit)
              </p>
            </div>
          </div>

          {/* Time Range Filter Tabs (1 Din, 2 Din, 7 Din, 1 Mahina, All Time) */}
          <div className="flex items-center gap-1.5 bg-[#0a0216] p-1 rounded-2xl border border-purple-900/60 overflow-x-auto self-start sm:self-auto">
            {[
              { id: 'today', label: '1 Din (Aaj)' },
              { id: '2days', label: '2 Din' },
              { id: '7days', label: '7 Din (1 Hafta)' },
              { id: '30days', label: '1 Mahina' },
              { id: 'all', label: 'All Time' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handlePeriodChange(f.id)}
                className={`px-3 py-1.5 rounded-xl font-heading text-xs font-bold transition-all whitespace-nowrap ${
                  period === f.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-orange-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Circular Donut Visual & Metric Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Circular Donut SVG Chart (4 Columns on Desktop) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#070212] rounded-2xl border border-purple-900/50 shadow-inner">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-slate-800/80"
                  strokeWidth="14"
                  fill="none"
                />

                {/* Money In Ring (Emerald) */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth="14"
                  strokeDasharray={`${(inStrokeDash * 140) / 100} ${circumference}`}
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Money Out Ring (Rose Red) */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-rose-500 transition-all duration-700 ease-out"
                  strokeWidth="14"
                  strokeDasharray={`${(outStrokeDash * 140) / 100} ${circumference}`}
                  strokeDashoffset={-((inStrokeDash * 140) / 100)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* Donut Center: Net Profit */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] font-heading font-bold text-slate-400 uppercase tracking-widest">
                  Net Profit (बचत)
                </span>
                <span className={`font-heading font-black text-2xl sm:text-3xl tracking-tight mt-0.5 ${
                  financial.netProfit >= 0 ? 'text-amber-400 drop-shadow-[0_2px_10px_rgba(251,191,36,0.4)]' : 'text-rose-400'
                }`}>
                  ₹{financial.netProfit}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                  financial.netProfit >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {financial.profitMargin >= 0 ? `+${financial.profitMargin}% Margin` : `${financial.profitMargin}%`}
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex items-center justify-center gap-4 text-xs font-semibold pt-3 border-t border-purple-900/30 w-full mt-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50"></span>
                <span>Paisa Aaya (In)</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50"></span>
                <span>Paisa Banta (Out)</span>
              </div>
            </div>
          </div>

          {/* 3 Detailed Breakdown Cards (7 Columns on Desktop) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Card 1: Money In */}
            <div className="bg-[#070212] border border-emerald-500/40 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider">Paisa Laga (In)</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="font-heading font-black text-2xl text-emerald-400">
                ₹{financial.totalMoneyIn}
              </p>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-purple-900/40">
                <div className="flex justify-between">
                  <span className="text-slate-400">Match Entry Fees:</span>
                  <span className="font-bold text-white">₹{financial.entryFeesCollected}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Joined Slots:</span>
                  <span className="font-bold text-cyan-300">{financial.joinedCount} players</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Verified Deposits:</span>
                  <span className="font-bold text-emerald-300">₹{financial.depositsApproved}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Money Out */}
            <div className="bg-[#070212] border border-rose-500/40 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider">Distribute Hua (Out)</span>
                <ArrowDownToLine className="w-4 h-4" />
              </div>
              <p className="font-heading font-black text-2xl text-rose-400">
                ₹{financial.totalMoneyOut}
              </p>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-purple-900/40">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kills & Win Prizes:</span>
                  <span className="font-bold text-white">₹{financial.prizesDistributed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid Withdrawals:</span>
                  <span className="font-bold text-rose-300">₹{financial.withdrawalsApproved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payout Requests:</span>
                  <span className="font-bold text-slate-300">{financial.withdrawalsCount} completed</span>
                </div>
              </div>
            </div>

            {/* Card 3: Net Profit / Retention */}
            <div className="bg-[#070212] border border-amber-500/50 rounded-2xl p-4 space-y-2 shadow-lg">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-heading font-extrabold uppercase tracking-wider">Bacha Hua (Net)</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <p className={`font-heading font-black text-2xl ${
                financial.netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                ₹{financial.netProfit}
              </p>
              <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-purple-900/40">
                <div className="flex justify-between">
                  <span className="text-slate-400">Match Retention:</span>
                  <span className="font-bold text-amber-300">₹{financial.tournamentProfit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Match Margin:</span>
                  <span className="font-bold text-emerald-400">+{financial.tournamentMargin}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overall Profit:</span>
                  <span className={`font-bold ${financial.netProfit >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {financial.profitMargin}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Deposits Preview */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Pending Deposits (Min ₹50)</span>
            </h2>
            <button
              onClick={() => navigate('/control-room-777/deposits')}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.pendingDeposits.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-[#070212] rounded-xl border border-purple-900/30">
              No pending deposits to verify right now.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.pendingDeposits.map((dep) => (
                <div
                  key={dep.id}
                  className="bg-[#070212] border border-purple-900/40 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{dep.username}</p>
                    <p className="text-[11px] text-slate-400 font-mono">UTR: {dep.utrNumber}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-emerald-400 text-sm">
                      ₹{dep.amount}
                    </span>
                    <button
                      onClick={() => navigate('/control-room-777/deposits')}
                      className="block text-[10px] text-purple-400 hover:underline mt-0.5"
                    >
                      Review →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Withdrawals Preview */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-red-400" />
              <span>Pending Withdrawals (Min ₹100 • Win Balance)</span>
            </h2>
            <button
              onClick={() => navigate('/control-room-777/withdrawals')}
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {stats.pendingWithdrawals.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-[#070212] rounded-xl border border-purple-900/30">
              No pending withdrawals right now.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.pendingWithdrawals.map((w) => (
                <div
                  key={w.id}
                  className="bg-[#070212] border border-purple-900/40 p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-white">{w.username}</p>
                    <p className="text-[11px] text-slate-400">
                      {w.method}: <span className="font-mono text-slate-300">{w.upiId || w.accountDetails}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-heading font-black text-red-400 text-sm">
                      ₹{w.amount}
                    </span>
                    <button
                      onClick={() => navigate('/control-room-777/withdrawals')}
                      className="block text-[10px] text-purple-400 hover:underline mt-0.5"
                    >
                      Process →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
