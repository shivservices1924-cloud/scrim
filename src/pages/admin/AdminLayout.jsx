import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Swords,
  CreditCard,
  ArrowDownToLine,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
  Menu,
  X,
  Smartphone,
  Sparkles,
  Share,
  PlusSquare,
  CheckCircle2
} from 'lucide-react';

export default function AdminLayout() {
  const { admin, adminLogout, adminToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = '/control-room-777';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [counts, setCounts] = useState({ deposits: 0, withdrawals: 0, tournaments: 0 });

  useEffect(() => {
    if (!adminToken) {
      navigate(`${basePath}/login`);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCounts({
            deposits: data.pendingDepositsCount || 0,
            withdrawals: data.pendingWithdrawalsCount || 0,
            tournaments: data.activeTournamentsCount || 0
          });
        }
      } catch (e) {}
    };

    fetchSummary();
    const interval = setInterval(fetchSummary, 10000); // 10s poll for admin updates
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [adminToken, basePath]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowInstallGuide(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstallGuide(true);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: basePath, icon: LayoutDashboard, exact: true },
    {
      name: 'Tournaments',
      path: `${basePath}/tournaments`,
      icon: Swords,
      badge: counts.tournaments ? `${counts.tournaments} Live` : null,
      badgeColor: 'bg-blue-500/20 text-blue-400'
    },
    {
      name: 'Verify Deposits',
      path: `${basePath}/deposits`,
      icon: CreditCard,
      badge: counts.deposits > 0 ? counts.deposits : null,
      badgeColor: 'bg-emerald-500 text-black font-extrabold animate-pulse'
    },
    {
      name: 'Withdrawals',
      path: `${basePath}/withdrawals`,
      icon: ArrowDownToLine,
      badge: counts.withdrawals > 0 ? counts.withdrawals : null,
      badgeColor: 'bg-red-500 text-white font-extrabold animate-pulse'
    },
    { name: 'Players & Users', path: `${basePath}/users`, icon: Users },
    { name: 'App Settings', path: `${basePath}/settings`, icon: Settings }
  ];

  const handleLogout = () => {
    adminLogout();
    navigate(`${basePath}/login`);
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-white flex flex-col md:flex-row selection:bg-blue-600 selection:text-white">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#091024]/95 backdrop-blur-md border-b border-blue-900/50 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-amber-400 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow">
            <img src="/app-logo.png" alt="RushX Admin" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <span className="font-heading font-black text-white text-sm tracking-wider block leading-none">
              RUSHX ADMIN
            </span>
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest">
              Control Center
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-heading font-bold text-[10px] px-2.5 py-1 rounded-lg active:scale-95 transition-all shadow"
          >
            <Smartphone className="w-3 h-3 text-amber-400" />
            <span>Install App</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sidebar Navigation for Desktop & Full Drawer on Mobile */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-64 bg-[#080e1c] border-r border-blue-900/40 p-4 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Logo & Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-400 p-0.5 flex items-center justify-center overflow-hidden shadow-lg shrink-0">
                <img src="/app-logo.png" alt="RushX Admin Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h2 className="font-heading font-black text-white text-base tracking-wider leading-none">
                  RUSHX MASTER
                </h2>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Install Admin App to Phone Button */}
          <button
            onClick={handleInstallClick}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 hover:from-amber-600/30 border border-amber-500/40 text-amber-300 flex items-center gap-2 text-xs font-heading font-bold transition-all shadow"
          >
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-left flex-1 min-w-0">
              <p className="truncate">Add Admin to Phone</p>
              <p className="text-[9px] text-slate-400 font-normal">Use like real app on mobile</p>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-heading text-xs font-bold tracking-wider transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20'
                        : 'text-slate-400 hover:text-white hover:bg-[#0f1a33]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-4 border-t border-blue-900/40 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-blue-300 hover:bg-[#0f1a33] transition-colors"
          >
            <span>View RushX User App</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 min-w-0 p-3 sm:p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb friendly quick switch for Admin) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070c18]/95 backdrop-blur-md border-t border-blue-900/60 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {/* Tab 1: Dashboard */}
        <NavLink
          to={basePath}
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-heading font-bold">Home</span>
        </NavLink>

        {/* Tab 2: Tournaments */}
        <NavLink
          to={`${basePath}/tournaments`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
              isActive ? 'text-blue-400 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <Swords className="w-4 h-4" />
          <span className="text-[10px] font-heading font-bold">Matches</span>
          {counts.tournaments > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          )}
        </NavLink>

        {/* Tab 3: Deposits (with badge) */}
        <NavLink
          to={`${basePath}/deposits`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
              isActive ? 'text-emerald-400 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-[10px] font-heading font-bold">Deposits</span>
          {counts.deposits > 0 && (
            <span className="absolute -top-1 right-0 bg-emerald-500 text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
              {counts.deposits}
            </span>
          )}
        </NavLink>

        {/* Tab 4: Withdrawals (with badge) */}
        <NavLink
          to={`${basePath}/withdrawals`}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
              isActive ? 'text-red-400 scale-105' : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span className="text-[10px] font-heading font-bold">Payouts</span>
          {counts.withdrawals > 0 && (
            <span className="absolute -top-1 right-0 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow animate-pulse">
              {counts.withdrawals}
            </span>
          )}
        </NavLink>

        {/* Tab 5: Menu / More */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl text-slate-400 hover:text-white"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-heading font-bold">More</span>
        </button>
      </nav>

      {/* Add Admin to Phone / Home Screen Modal Guide */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0b1326] border border-amber-500/50 rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-amber-400 p-0.5 mx-auto flex items-center justify-center overflow-hidden shadow-lg shadow-amber-500/20">
                <img src="/app-logo.png" alt="RushX Admin" className="w-full h-full object-cover rounded-full" />
              </div>
              <h3 className="font-heading font-black text-lg text-white">
                INSTALL RUSHX ADMIN ON PHONE
              </h3>
              <p className="text-xs text-amber-300 font-semibold">
                Open directly from home screen without typing the URL
              </p>
            </div>

            <div className="space-y-2.5 text-xs bg-[#070c18] p-3.5 rounded-2xl border border-blue-900/60 text-slate-300">
              <div className="space-y-1 pb-2 border-b border-blue-900/40">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">A</span>
                  Android (Google Chrome):
                </p>
                <p className="text-[11px] text-slate-400 pl-5">
                  Top right me <b>3-dots (⋮)</b> menu par tap karein → <b>"Add to Home screen"</b> (या Install App) select karein → Tap <b>Add</b>.
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">B</span>
                  Apple iPhone (Safari):
                </p>
                <p className="text-[11px] text-slate-400 pl-5">
                  Neeche <b>Share [⎋]</b> button par tap karein → Scroll karke <b>"Add to Home Screen"</b> tap karein → Tap <b>Add</b>.
                </p>
              </div>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="text-[11px]">
                Aapke phone me <b>"RushX Admin"</b> ka standalone app icon ban jayega!
              </span>
            </div>

            <button
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-heading font-extrabold text-xs shadow-lg active:scale-95 transition-all"
            >
              OK, GOT IT!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
