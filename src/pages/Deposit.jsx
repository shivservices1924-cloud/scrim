import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Upload, AlertCircle, CheckCircle, QrCode, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
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

      setSuccess('Deposit request submitted! Once verified by admin (approx. 2-5 mins), your Deposit Balance will be credited.');
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
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/wallet')}
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            Add Money / Deposit
          </h1>
        </div>

        <button
          onClick={() => navigate('/wallet/deposit-history')}
          className="text-xs font-heading font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl hover:bg-emerald-900/60 transition-colors"
        >
          History
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Deposit Rule Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wide">
              Deposit Rule:
            </span>
            <p className="text-sm font-extrabold text-white mt-0.5">
              Limit: ₹50 - ₹500 / transaction
            </p>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
            0% Fee
          </span>
        </div>

        {/* User's Uploaded PhonePe QR Code Container */}
        <div className="bg-[#10051e] border border-purple-500/50 rounded-2xl p-4 text-center space-y-3 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-purple-300 font-bold text-xs">
            <Smartphone className="w-4 h-4 text-purple-400" />
            <span className="uppercase tracking-wider">PhonePe Official Payment QR</span>
          </div>

          {/* Actual Uploaded PhonePe QR Code */}
          <div className="max-w-[260px] mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-2xl bg-black">
            <img
              src="/phonepe-qr.jpg"
              alt="PhonePe QR - Ujjwal Kumar Mishra"
              className="w-full h-auto object-contain block"
            />
          </div>

          <div className="text-center pt-1">
            <p className="font-heading font-black text-white text-base tracking-wide">
              Ujjwal Kumar Mishra
            </p>
            <p className="text-[11px] text-purple-300 font-medium">
              Scan with PhonePe, Google Pay, Paytm, or BHIM UPI
            </p>
          </div>

          {/* UPI ID Bar */}
          <div className="bg-[#0a0216] border border-purple-900/60 rounded-xl p-2.5 flex items-center justify-between">
            <div className="text-left overflow-hidden">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Official UPI ID:</span>
              <p className="font-heading font-bold text-amber-400 text-sm truncate">
                {settings.upiId}
              </p>
            </div>
            <button
              onClick={copyUpi}
              className="flex items-center gap-1 text-xs bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white px-3 py-1.5 rounded-lg transition-transform active:scale-95 shrink-0 shadow"
            >
              {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedUpi ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-950/50 border border-red-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-red-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-xl p-3 flex items-start gap-2 text-xs text-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Deposit Verification Form */}
        <form onSubmit={handleSubmit} className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-white uppercase tracking-wider">
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
                  className={`py-1.5 rounded-xl text-xs font-heading font-bold border transition-all ${
                    amount === amt
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 border-purple-400 text-white shadow-md'
                      : 'bg-[#0a0216] border-purple-900/60 text-slate-300 hover:border-purple-600'
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
              className="w-full bg-[#0a0216] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
              placeholder="Enter amount (50 - 500)"
            />
          </div>

          {/* 12-Digit UTR */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              12-Digit UPI UTR / Transaction ID <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="e.g. 431092881923"
              className="w-full bg-[#0a0216] border border-purple-900 focus:border-purple-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none placeholder:text-slate-600 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Check PhonePe payment screen for the 12-digit UTR / Ref Number.
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
              className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600/30 file:text-purple-300 hover:file:bg-purple-600/50 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-heading font-extrabold text-base tracking-wider shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all"
          >
            {loading ? 'Submitting...' : 'Submit Deposit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
}
