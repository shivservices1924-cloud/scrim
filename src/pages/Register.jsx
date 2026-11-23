import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Mail, Phone, Gift, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
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

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
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

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to Fair Play & Tournament rules.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register({
        username: formData.username.trim(),
        fullName: formData.fullName.trim() || formData.username.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || '9999999999',
        password: formData.password,
        referredBy: formData.referredBy.trim()
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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

      {/* Screen 3: Logo & Title */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <Logo variant="full" size="lg" />
        </div>
        <h1 className="font-heading font-black text-2xl tracking-wide text-white">
          Create Account
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-1">
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
          {/* Full Name */}
          <div>
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4 text-[#F5C400]" />
              </div>
              <input
                id="reg-fullname"
                type="text"
                name="fullName"
                autoComplete="name"
                maxLength={50}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Username / Gamer Tag */}
          <div>
            <label htmlFor="reg-username" className="block text-xs font-semibold text-slate-300 mb-1">
              Username / Gamer Tag <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4 text-[#F5C400]" />
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
                placeholder="Choose username (e.g. rushx_pro)"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Email or Mobile Number */}
          <div>
            <label htmlFor="reg-email" className="block text-xs font-semibold text-slate-300 mb-1">
              Email or Mobile Number <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Mail className="w-4 h-4 text-[#F5C400]" />
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
                placeholder="Enter email or phone"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="reg-password" className="block text-xs font-semibold text-slate-300 mb-1">
              Password <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4 text-[#F5C400]" />
              </div>
              <input
                id="reg-password"
                type="password"
                name="password"
                autoComplete="new-password"
                maxLength={64}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="reg-confirmpassword" className="block text-xs font-semibold text-slate-300 mb-1">
              Confirm Password <span className="text-[#F5C400]">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4 text-[#F5C400]" />
              </div>
              <input
                id="reg-confirmpassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                maxLength={64}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div>
            <label htmlFor="reg-referredby" className="block text-xs font-semibold text-slate-300 mb-1">
              Referral Code <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Gift className="w-4 h-4 text-[#F5C400]" />
              </div>
              <input
                id="reg-referredby"
                type="text"
                name="referredBy"
                autoComplete="off"
                maxLength={20}
                value={formData.referredBy}
                onChange={handleChange}
                placeholder="Have a referral code?"
                className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Screen 3: Gold Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm tracking-widest uppercase shadow-lg shadow-[#F5C400]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* Screen 3: Social Login Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-[#1f2738]"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-slate-500 font-bold">OR</span>
          <div className="flex-grow border-t border-[#1f2738]"></div>
        </div>

        {/* Google & Apple Options (Screen 3) */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => setError('Google Sign-In is connected via direct account registration.')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0b0e14] border border-[#1f2738] hover:border-slate-500 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => setError('Apple Sign-In is connected via direct account registration.')}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0b0e14] border border-[#1f2738] hover:border-slate-500 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.66-2.88 1.48-.61.71-1.15 1.87-1 2.99 1.08.08 2.23-.55 2.89-1.37z" />
            </svg>
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Screen 3: Already have an account link */}
        <div className="pt-2 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#F5C400] font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
