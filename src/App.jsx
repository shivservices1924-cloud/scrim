import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import VersionGate from './components/VersionGate';
import InstallAppBanner from './components/InstallAppBanner';

// User Pages
import Home from './pages/Home';
import Tournaments from './pages/Tournaments';
import ContestDetails from './pages/ContestDetails';
import Wallet from './pages/Wallet';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import DepositHistory from './pages/DepositHistory';
import WithdrawHistory from './pages/WithdrawHistory';
import Refer from './pages/Refer';
import Leaderboard from './pages/Leaderboard';
import MyMatches from './pages/MyMatches';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactUs from './pages/ContactUs';
import RulesNotice from './pages/RulesNotice';
import Download from './pages/Download';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTournaments from './pages/admin/AdminTournaments';
import AdminTournamentManage from './pages/admin/AdminTournamentManage';
import AdminDeposits from './pages/admin/AdminDeposits';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Strict Auth Wall: Users must create an account / login before accessing the website
function UserProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070212] flex flex-col items-center justify-center text-purple-400">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold tracking-wider text-slate-300">Checking RushX Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function App() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/control-room-777');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isProfilePage = location.pathname === '/profile';
  const isDetailPage = location.pathname.startsWith('/contest/') || (location.pathname.startsWith('/tournaments/') && location.pathname !== '/tournaments');
  const isSubWalletPage = location.pathname.startsWith('/wallet/');
  const isDownloadPage = location.pathname === '/download';

  return (
    <VersionGate>
      <div className="min-h-screen bg-[#070212] flex flex-col justify-start text-white">
        {/* PWA Add to Home Screen Banner */}
        {!isAdminRoute && <InstallAppBanner />}

        {/* Top Navbar for User App (Shown to logged in users on main views) */}
        {!isAdminRoute && !isAuthRoute && !isProfilePage && !isDetailPage && !isSubWalletPage && !isDownloadPage && <Navbar />}

        {/* Main Routes */}
        <div className="flex-1 w-full">
          <Routes>
            {/* User Protected Routes (Must be logged in to enter website) */}
            <Route path="/" element={<UserProtectedRoute><Home /></UserProtectedRoute>} />
            <Route path="/tournaments" element={<UserProtectedRoute><Tournaments /></UserProtectedRoute>} />
            <Route path="/tournaments/:id" element={<UserProtectedRoute><ContestDetails /></UserProtectedRoute>} />
            <Route path="/contest/:id" element={<UserProtectedRoute><ContestDetails /></UserProtectedRoute>} />
            <Route path="/wallet" element={<UserProtectedRoute><Wallet /></UserProtectedRoute>} />
            <Route path="/wallet/deposit" element={<UserProtectedRoute><Deposit /></UserProtectedRoute>} />
            <Route path="/wallet/withdraw" element={<UserProtectedRoute><Withdraw /></UserProtectedRoute>} />
            <Route path="/wallet/deposit-history" element={<UserProtectedRoute><DepositHistory /></UserProtectedRoute>} />
            <Route path="/wallet/withdraw-history" element={<UserProtectedRoute><WithdrawHistory /></UserProtectedRoute>} />
            <Route path="/refer" element={<UserProtectedRoute><Refer /></UserProtectedRoute>} />
            <Route path="/leaderboard" element={<UserProtectedRoute><Leaderboard /></UserProtectedRoute>} />
            <Route path="/my-matches" element={<UserProtectedRoute><MyMatches /></UserProtectedRoute>} />
            <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
            
            {/* Public Info & Download Pages */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/rules" element={<RulesNotice />} />
            <Route path="/download" element={<Download />} />

            {/* Block public /admin paths completely (Redirect to Home) */}
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
            <Route path="/admin-portal" element={<Navigate to="/" replace />} />
            <Route path="/admin-portal/*" element={<Navigate to="/" replace />} />

            {/* Secret Master Admin Entrance (Only accessible via secret URL) */}
            <Route path="/control-room-777/login" element={<AdminLogin />} />
            
            <Route path="/control-room-777" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tournaments" element={<AdminTournaments />} />
              <Route path="tournaments/:id" element={<AdminTournamentManage />} />
              <Route path="deposits" element={<AdminDeposits />} />
              <Route path="withdrawals" element={<AdminWithdrawals />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* 404 Catch-All Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* Bottom Nav for Mobile App (Only shown when logged in and on app views) */}
        {!isAdminRoute && !isAuthRoute && !isDownloadPage && user && <BottomNav />}
      </div>
    </VersionGate>
  );
}
