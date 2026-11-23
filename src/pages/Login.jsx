import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

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
    <div className="pb-16 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white flex flex-col justify-center p-6">
      <SEO
        title="Sign In • RushX Esports"
        description="Sign in to your RushX account to play Free Fire tournaments, view upcoming matches, and withdraw cash winnings."
        path="/login"
      />

      {/* Screen 2: Logo & Welcome */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Logo variant="full" size="lg" />
        </div>
        <h1 className="font-heading font-black text-2xl tracking-wide text-white">
          Welcome Back!
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
          Login to continue your journey
        </p>
      </div>

      <div className="bg-[#121620] border border-[#1f2738] rounded-3xl p-6 shadow-2xl space-y-5">
        {error && (
          <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200 shadow-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="login-username" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email or Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4 text-[#F5C400]" />
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
                placeholder="Enter username, email or mobile"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <Link to="/contact" className="text-[11px] text-[#F5C400] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4 text-[#F5C400]" />
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
                placeholder="••••••••"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-extrabold text-[#F5C400] hover:underline ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
