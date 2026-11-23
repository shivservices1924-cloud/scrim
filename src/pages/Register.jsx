import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Mail, Phone, Gift, ArrowRight, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Logo from '../components/Logo';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referredBy: searchParams.get('ref') || ''
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError('Please fill in all required fields (*).');
      return;
    }

    if (formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    const specialSymbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialSymbolRegex.test(formData.password)) {
      setError('Password must contain at least one special symbol (e.g. @, #, $, %, etc.).');
      return;
    }

    if (!agreeTerms) {
      setError('You must check and agree to the Terms of Service & Anti-Cheat Fair Play Rules to register.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        referredBy: formData.referredBy.trim()
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-16 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white flex flex-col justify-center p-6">
      <SEO
        title="Create Account • RushX Esports"
        description="Create your free RushX Esports account. Compete in Free Fire BR & CS matches and earn real cash rewards."
        path="/register"
      />
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Logo variant="full" size="lg" />
        </div>
        <h1 className="font-heading font-black text-2xl tracking-wide text-white">
          Create Account
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Join the gaming community
        </p>
      </div>

      <div className="bg-[#121620] border border-[#1f2738] rounded-3xl p-6 shadow-2xl space-y-4">
        {error && (
          <div className="bg-red-950/60 border border-red-500/60 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          {/* Username */}
          <div>
            <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300 mb-1">
              Username <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#F5C400]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="reg-username"
                type="text"
                name="username"
                autoComplete="username"
                maxLength={50}
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="reg-fullname"
              type="text"
              name="fullName"
              autoComplete="name"
              maxLength={100}
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 mb-1">
              WhatsApp Mobile Number <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#F5C400]">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                maxLength={15}
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#F5C400]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={100}
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1">
                  Password <span className="text-[#F5C400]">*</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  maxLength={64}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars + @"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
              <div>
                <label htmlFor="reg-confirmpassword" className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Pass <span className="text-[#F5C400]">*</span>
                </label>
                <input
                  id="reg-confirmpassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  maxLength={64}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat pass"
                  className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded accent-[#F5C400]"
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-slate-400">
              I agree to the <Link to="/terms" className="text-[#F5C400] underline">Terms of Service</Link> & <Link to="/rules" className="text-[#F5C400] underline">Fair Play Rules</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <span>Creating Account...</span> : <span>Register</span>}
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-extrabold text-[#F5C400] hover:underline ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

      <div className="bg-[#10051e] border border-purple-900/60 rounded-3xl p-6 shadow-2xl space-y-4">
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Username */}
          <div>
            <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300 mb-1">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                id="reg-username"
                type="text"
                name="username"
                autoComplete="username"
                maxLength={20}
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose username (e.g. ujjwal1924)"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                id="reg-fullname"
                type="text"
                name="fullName"
                autoComplete="name"
                maxLength={50}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                Phone / WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                id="reg-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                maxLength={15}
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit Phone"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="reg-email"
                type="email"
                name="email"
                autoComplete="email"
                maxLength={100}
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
            <p className="text-[11px] text-cyan-400/90 mt-1 flex items-center gap-1">
              <span>🎮</span>
              <span>Free Fire IGN & UID can be linked directly from your Profile later.</span>
            </p>
          </div>

          {/* Password & Confirm */}
          <div className="space-y-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  maxLength={64}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 chars + @"
                  className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
              <div>
                <label htmlFor="reg-confirmpassword" className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Pass <span className="text-red-400">*</span>
                </label>
                <input
                  id="reg-confirmpassword"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  maxLength={64}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat pass"
                  className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 px-1">
              Must be at least 8 characters and include a special symbol (e.g. @, #, $, %).
            </p>
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label htmlFor="reg-referredby" className="block text-xs font-semibold text-slate-300 mb-1">
              Referral Code (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Gift className="w-4 h-4" />
              </div>
              <input
                id="reg-referredby"
                type="text"
                name="referredBy"
                autoComplete="off"
                maxLength={20}
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Referral Code"
                className="w-full bg-[#160a2b] border border-purple-900 focus:border-purple-500 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>

          {/* Terms & Conditions Agreement (Active opt-in & Unwrapped Links) */}
          <div className="pt-1">
            <div className="flex items-start gap-2.5 text-xs text-slate-300">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-purple-900 bg-[#160a2b] text-blue-600 focus:ring-blue-500 focus:ring-offset-0 shrink-0 cursor-pointer"
              />
              <span className="leading-snug text-slate-300">
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  I agree to the{' '}
                </label>
                <Link
                  to="/rules"
                  onClick={(e) => e.stopPropagation()}
                  className="text-amber-400 font-semibold hover:underline relative z-10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </Link>
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  {' '}and{' '}
                </label>
                <Link
                  to="/rules"
                  onClick={(e) => e.stopPropagation()}
                  className="text-purple-400 font-semibold hover:underline relative z-10"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Fair Play Anti-Cheat Rules
                </Link>
                <label htmlFor="agreeTerms" className="cursor-pointer">
                  . I confirm that I will not use hacks, aimbots, or third-party scripts.
                </label>
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:from-blue-500 hover:to-indigo-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-purple-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-purple-400 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
