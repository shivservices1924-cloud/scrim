import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Check,
  Upload,
  AlertCircle,
  CheckCircle,
  QrCode,
  Smartphone,
  ShieldAlert,
  History,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Deposit() {
  const navigate = useNavigate();
  const { token, refreshUser, user } = useAuth();

  const [amount, setAmount] = useState('50');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [settings, setSettings] = useState({
    upiId: 'rushx.esports@upi',
    upiName: 'RushX Esports Official',
    upiQrImage: '/phonepe-qr.jpg',
    minDeposit: 50
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/wallet/deposit-info', {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, [token]);

  const copyUpi = () => {
    if (settings.upiId) {
      navigator.clipboard.writeText(settings.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (numAmount < 50) {
      setError('Minimum deposit amount is ₹50.');
      return;
    }

    if (numAmount > 500) {
      setError('Maximum deposit allowed in one transaction is ₹500.');
      return;
    }

    if (!utrNumber.trim() || utrNumber.trim().length < 6) {
      setError('Please enter a valid 12-digit UPI UTR / Transaction Reference ID.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('amount', numAmount);
      formData.append('utrNumber', utrNumber.trim());
      if (screenshot) {
        formData.append('screenshot', screenshot);
      }

      const res = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit deposit.');
      }

      setSuccess('Deposit request submitted! Once verified by admin (approx. 2-5 mins), your Deposit Balance will be credited automatically.');
      setUtrNumber('');
      setScreenshot(null);
      await refreshUser();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#0b0e14] text-white">
      <SEO
        title="Add Money / Deposit • RushX Esports"
        description="Add money to your RushX wallet using PhonePe, Google Pay, or Paytm UPI."
        path="/deposit"
      />

      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#0b0e14]/95 backdrop-blur-md border-b border-[#1f2738] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/wallet')}
            aria-label="Back to Wallet"
            className="w-9 h-9 rounded-full bg-[#121620] hover:bg-[#1a202e] border border-[#1f2738] flex items-center justify-center text-[#F5C400] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-black text-white text-lg tracking-wide">
            Add Money / Deposit
          </h1>
        </div>

        <button
          onClick={() => navigate('/deposit-history')}
          className="text-xs font-heading font-black text-[#F5C400] bg-[#121620] hover:bg-[#1a202e] border border-[#F5C400]/40 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Deposit Policy Banner */}
        <div className="bg-[#121620] border border-[#F5C400]/30 rounded-2xl p-3.5 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
              Deposit Range
            </span>
            <p className="text-sm font-heading font-black text-white mt-0.5">
              ₹50 to ₹500 / transaction
            </p>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
            0% Fee • Instant
          </span>
        </div>

        {/* Payment QR Code Container */}
        <div className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 text-center space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-[#F5C400] font-heading font-black text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4 text-[#F5C400]" />
            <span>Step 1: Scan QR & Pay via UPI</span>
          </div>

          {/* Official Payment QR Code */}
          <div className="max-w-[240px] mx-auto rounded-2xl overflow-hidden border-2 border-[#F5C400]/40 shadow-2xl bg-black p-2">
            <img
              src="/phonepe-qr.jpg"
              alt="PhonePe Payment QR"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/deposit-qr.jpg';
              }}
              className="w-full h-auto object-contain rounded-xl block"
            />
          </div>

          <div className="text-center pt-1">
            <p className="font-heading font-black text-white text-base tracking-wide">
              Ujjwal Kumar Mishra
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              Scan with PhonePe, Google Pay, Paytm, or BHIM UPI
            </p>
          </div>

          {/* UPI ID Bar */}
          <div className="bg-[#0b0e14] border border-[#1f2738] rounded-xl p-2.5 flex items-center justify-between">
            <div className="text-left overflow-hidden">
              <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Official UPI ID:</span>
              <p className="font-mono font-bold text-[#F5C400] text-xs sm:text-sm truncate">
                {settings.upiId || 'rushx.esports@upi'}
              </p>
            </div>
            <button
              onClick={copyUpi}
              className="flex items-center gap-1 text-xs bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black px-3 py-1.5 rounded-lg transition-transform active:scale-95 shrink-0 shadow"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/70 border border-red-500/70 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/70 border border-emerald-500/70 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Deposit Verification Form */}
        <form onSubmit={handleSubmit} className="bg-[#121620] border border-[#1f2738] rounded-2xl p-4 space-y-4 shadow-xl">
          <h3 className="font-heading font-black text-sm text-white uppercase tracking-wider">
            Step 2: Enter Payment Details
          </h3>

          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select or Enter Amount (₹50 - ₹500)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {['50', '100', '200', '500'].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-1.5 rounded-xl text-xs font-heading font-black border transition-all ${
                    amount === amt
                      ? 'bg-[#F5C400] border-[#F5C400] text-black shadow-md'
                      : 'bg-[#0b0e14] border-[#1f2738] text-slate-300 hover:border-[#F5C400]/60'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <input
              type="number"
              min="50"
              max="500"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-mono"
              placeholder="Enter amount (50 - 500)"
            />
          </div>

          {/* 12-Digit UTR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              12-Digit UPI UTR / Ref Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 431092881923"
              className="w-full bg-[#0b0e14] border border-[#1f2738] focus:border-[#F5C400] rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Check PhonePe / GPay payment screen for the 12-digit UTR number.
            </p>
          </div>

          {/* Payment Screenshot */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Payment Screenshot (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0] || null)}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#1a202e] file:text-[#F5C400] hover:file:bg-[#222a3d] cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F5C400] hover:bg-[#FFD000] text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Submitting...' : 'Submit Deposit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}
