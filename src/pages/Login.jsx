import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, ArrowRight, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please fill in both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white flex flex-col justify-center p-6">
      <SEO
        title="Sign In • RushX Esports"
        description="Sign in to your RushX account to play Free Fire tournaments, view upcoming matches, and withdraw cash winnings."
        path="/login"
      />
      <div className="text-center mb-6">
        <div className="w-24 h-24 rounded-2xl bg-black border-2 border-amber-400 p-1 mx-auto mb-3 shadow-2xl shadow-purple-600/40 flex items-center justify-center overflow-hidden">
          <img src="/app-logo.png" alt="RushX Esports Logo" className="w-full h-full object-cover rounded-xl" />
        </div>
        <h1 className="font-heading font-black text-3xl tracking-wider text-white">
          RUSH<span className="text-purple-400">X</span> ESPORTS
        </h1>
        <p className="text-xs text-purple-300 font-semibold mt-1">
          Play Free Fire Tournaments &amp; Win Cash Payouts
        </p>
      </div>

      {/* Mandatory Account Gate Info Banner */}
      <div className="bg-[#14062a] border border-purple-600/50 rounded-2xl p-3.5 mb-5 flex items-center gap-3 shadow-lg shadow-purple-950/40">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
        </div>
        <p className="text-[11px] text-purple-200 leading-snug font-medium">
          <span className="font-bold text-amber-300">Account Required:</span> Please log in or create a free account to enter tournaments, view custom rooms, and access wallet features.
        </p>
      </div>

      <div className="bg-[#10051e] border border-purple-900/60 rounded-3xl p-6 shadow-2xl space-y-5">
        {error && (
          <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200 shadow-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Username, Email or Phone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username"
                name="username"
                type="text"
                autoComplete="username"
                maxLength={100}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter username or email"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                maxLength={100}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In Now'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          New player?{' '}
          <Link to="/register" className="text-purple-400 font-bold hover:underline">
            Create an Account &amp; Play
          </Link>
        </div>

        {/* Terms & Conditions Notice */}
        <div className="pt-3 border-t border-purple-900/40 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            By signing in, you agree to RushX{' '}
            <Link to="/rules" className="text-amber-400 font-semibold hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/rules" className="text-purple-400 font-semibold hover:underline">
              Fair Play Anti-Cheat Rules
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
