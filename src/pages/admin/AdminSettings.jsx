import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  QrCode,
  Smartphone,
  Key,
  ShieldCheck,
  Upload,
  MessageCircle,
  Send,
  Mail,
  Instagram,
  Youtube,
  Disc,
  Trophy,
  ExternalLink
} from 'lucide-react';

export default function AdminSettings() {
  const { adminToken } = useAuth();
  const fileInputRef = useRef(null);

  const [settings, setSettings] = useState({
    upiId: 'rushx.esports@upi',
    upiName: 'RushX Esports Official',
    upiQrImage: '/phonepe-qr.jpg',
    minDeposit: 50,
    maxDeposit: 500,
    minWithdrawal: 100,
    maxWithdrawal: 1000,
    maxWithdrawalsPerDay: 2,
    supportWhatsapp: '+91 7079789108',
    supportTelegram: '@RushXSupport',
    telegramUrl: 'https://t.me/RushXSupport',
    discordUrl: 'https://discord.gg/rushx',
    supportEmail: 'rushxsupportteam@gmail.com',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029Vb3RushXEsports',
    instagramUrl: 'https://www.instagram.com/rushx_scrim/',
    youtubeUrl: 'https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ',
    leaderboardVisible: true,
    tickerAnnouncement: '⚡ Welcome to RushX Esports! Verified Free Fire BR & CS Tournaments. Fair play guaranteed. Read rules before registering.',
    rulesNotice: '1. Map is strictly Bermuda. 2. Custom Room ID & Password unlocked for registered players 10-15m before match. 3. Deposit ₹50 - ₹500. Withdrawal ₹100 - ₹1000 from Win Balance (Max 2/day).',
    appVersion: '1.0.0',
    minRequiredVersion: '1.0.0',
    forceUpdateEnabled: false,
    updateDownloadUrl: '/download',
    updateMessage: 'A new mandatory update is available with new tournaments and anti-cheat updates. Please update the app to continue playing!',
    adminRecoveryKey: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      setMsg('Platform settings updated and synced successfully!');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleQrFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('qrImage', file);

    try {
      setUploadingQr(true);
      setErrorMsg('');
      const res = await fetch('/api/admin/upload-qr', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload QR Code');
      
      setSettings(prev => ({ ...prev, upiQrImage: data.upiQrImage }));
      setMsg('Payment QR Code updated successfully!');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploadingQr(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="font-heading font-black text-2xl md:text-3xl text-white tracking-wide">
          PLATFORM & APP SETTINGS
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure official payment QR, UPI IDs, Discord, Telegram, Instagram, YouTube, support contacts, and game limits
        </p>
      </div>

      {msg && (
        <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-950/80 border border-red-500 p-3 rounded-xl text-red-200 text-xs font-bold flex items-center gap-2 shadow-lg">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#0b0314] border border-purple-900/60 rounded-2xl p-6 shadow-2xl space-y-7">
        
        {/* 1. UPI Payment & Official QR Code */}
        <div className="space-y-4">
          <div className="border-b border-purple-900/40 pb-3">
            <h2 className="font-heading font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              Official Receiving Payment QR & UPI ID
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Players scan this QR or copy this UPI ID on the Deposit page to add funds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Live QR Preview & File Upload */}
            <div className="bg-[#120722] border border-purple-800/50 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
              <span className="text-xs font-semibold text-slate-300">Live Deposit QR Code</span>
              <div className="w-40 h-40 bg-white p-2 rounded-xl shadow-lg border-2 border-emerald-400 flex items-center justify-center overflow-hidden">
                <img
                  src={settings.upiQrImage || '/phonepe-qr.jpg'}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/phonepe-qr.jpg';
                  }}
                />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleQrFileUpload}
                className="hidden"
              />

              <button
                type="button"
                disabled={uploadingQr}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-purple-700/40 hover:bg-purple-600/60 border border-purple-500/50 text-purple-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingQr ? 'Uploading QR...' : 'Upload New QR Image'}</span>
              </button>
            </div>

            {/* UPI ID & Details Form */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Receiving UPI ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiId || ''}
                  onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="e.g. rushx.esports@upi"
                  className="w-full bg-[#160a2b] border border-purple-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-emerald-300 font-mono font-bold focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Shown to players during wallet deposit.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={settings.upiName || ''}
                  onChange={(e) => setSettings({ ...settings, upiName: e.target.value })}
                  placeholder="e.g. RushX Esports Official"
                  className="w-full bg-[#160a2b] border border-purple-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Direct QR Image URL / Path (Alternative)
                </label>
                <input
                  type="text"
                  value={settings.upiQrImage || ''}
                  onChange={(e) => setSettings({ ...settings, upiQrImage: e.target.value })}
                  placeholder="e.g. /phonepe-qr.jpg or https://..."
                  className="w-full bg-[#160a2b] border border-purple-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Social Media & Community Channels (Instagram, YouTube, Discord, Telegram) */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <div className="border-b border-purple-900/40 pb-2">
            <h2 className="font-heading font-bold text-sm text-pink-400 uppercase tracking-wider flex items-center gap-2">
              <Instagram className="w-4 h-4 text-pink-400" />
              Social Media & Gaming Community Links
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Configure your Instagram, YouTube channel, Discord server, and Telegram channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Instagram Profile */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                Official Instagram Profile Link
              </label>
              <input
                type="url"
                value={settings.instagramUrl || ''}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                placeholder="https://www.instagram.com/rushx_scrim/"
                className="w-full bg-[#160a2b] border border-purple-800 focus:border-pink-500 rounded-xl px-3 py-2 text-xs text-pink-300 font-mono focus:outline-none"
              />
            </div>

            {/* YouTube Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                Official YouTube Channel Link
              </label>
              <input
                type="url"
                value={settings.youtubeUrl || ''}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                placeholder="https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ"
                className="w-full bg-[#160a2b] border border-purple-800 focus:border-red-500 rounded-xl px-3 py-2 text-xs text-red-300 font-mono focus:outline-none"
              />
            </div>

            {/* Discord Server Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Disc className="w-3.5 h-3.5 text-indigo-400" />
                Discord Server / Community Invite Link
              </label>
              <input
                type="url"
                value={settings.discordUrl || ''}
                onChange={(e) => setSettings({ ...settings, discordUrl: e.target.value })}
                placeholder="https://discord.gg/rushx"
                className="w-full bg-[#160a2b] border border-purple-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-indigo-300 font-mono focus:outline-none"
              />
            </div>

            {/* Telegram Channel / Support Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                Telegram Channel / Support Link
              </label>
              <input
                type="text"
                value={settings.telegramUrl || ''}
                onChange={(e) => setSettings({ ...settings, telegramUrl: e.target.value })}
                placeholder="https://t.me/RushXSupport or @RushXSupport"
                className="w-full bg-[#160a2b] border border-purple-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Support Contacts (WhatsApp Helpdesk & Email) */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <div className="border-b border-purple-900/40 pb-2">
            <h2 className="font-heading font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-cyan-400" />
              Customer Support & Helpdesk Contacts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Helpdesk WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.supportWhatsapp || ''}
                onChange={(e) => setSettings({ ...settings, supportWhatsapp: e.target.value })}
                placeholder="+91 7079789108"
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Configured: 7079789108</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Support Email Desk
              </label>
              <input
                type="email"
                value={settings.supportEmail || ''}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="rushxsupportteam@gmail.com"
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">rushxsupportteam@gmail.com</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp Channel Link
              </label>
              <input
                type="url"
                value={settings.whatsappChannelUrl || ''}
                onChange={(e) => setSettings({ ...settings, whatsappChannelUrl: e.target.value })}
                placeholder="https://whatsapp.com/channel/..."
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* 4. Deposit & Withdrawal Single-Transaction Limits */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <h2 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider">
            Deposit & Withdrawal Rules & Single-Transaction Limits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Deposit (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={settings.minDeposit}
                onChange={(e) => setSettings({ ...settings, minDeposit: Number(e.target.value) })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-sm text-white"
              />
              <span className="text-[10px] text-emerald-400 font-semibold">Min: ₹50</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max One-Time Deposit (₹) <span className="text-amber-400 font-bold">*</span>
              </label>
              <input
                type="number"
                min="50"
                max="500"
                required
                value={settings.maxDeposit || 500}
                onChange={(e) => setSettings({ ...settings, maxDeposit: Number(e.target.value) })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold"
              />
              <span className="text-[10px] text-amber-400 font-semibold">Strict Max: ₹500</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Withdrawal (₹)
              </label>
              <input
                type="number"
                min="1"
                required
                value={settings.minWithdrawal}
                onChange={(e) => setSettings({ ...settings, minWithdrawal: Number(e.target.value) })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-sm text-white"
              />
              <span className="text-[10px] text-red-400 font-semibold">Min: ₹100</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max One-Time Withdrawal (₹) <span className="text-amber-400 font-bold">*</span>
              </label>
              <input
                type="number"
                min="100"
                max="1000"
                required
                value={settings.maxWithdrawal || 1000}
                onChange={(e) => setSettings({ ...settings, maxWithdrawal: Number(e.target.value) })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-sm text-amber-300 font-bold"
              />
              <span className="text-[10px] text-amber-400 font-semibold">Strict Max: ₹1,000</span>
            </div>
          </div>
        </div>

        {/* 5. Leaderboard Visibility */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Leaderboard Visibility & Player Access
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Toggle live kill scores and earnings visibility on the public leaderboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, leaderboardVisible: !settings.leaderboardVisible })}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-extrabold transition-all border ${
                settings.leaderboardVisible !== false
                  ? 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-amber-600/30 border-amber-500/50 text-amber-300'
              }`}
            >
              {settings.leaderboardVisible !== false ? '✅ Leaderboard Visible' : '🔒 Leaderboard Hidden'}
            </button>
          </div>
        </div>

        {/* 6. Marquee Ticker & Notice Rules */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <h2 className="font-heading font-bold text-sm text-purple-400 uppercase tracking-wider">
            Live Marquee Announcement Ticker
          </h2>
          <div>
            <textarea
              rows="3"
              value={settings.tickerAnnouncement || ''}
              onChange={(e) => setSettings({ ...settings, tickerAnnouncement: e.target.value })}
              className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* 7. App Version & Force Update Gate */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              App Version & Mandatory Force Update Gate
            </h2>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(settings.forceUpdateEnabled)}
                onChange={(e) => setSettings({ ...settings, forceUpdateEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Latest App Version
              </label>
              <input
                type="text"
                value={settings.appVersion || '1.0.0'}
                onChange={(e) => setSettings({ ...settings, appVersion: e.target.value })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Allowed Version
              </label>
              <input
                type="text"
                value={settings.minRequiredVersion || '1.0.0'}
                onChange={(e) => setSettings({ ...settings, minRequiredVersion: e.target.value })}
                className="w-full bg-[#160a2b] border border-purple-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* 8. Master Security Recovery Key */}
        <div className="pt-4 border-t border-purple-900/40 space-y-4">
          <h2 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Master Security Recovery Key
          </h2>
          <div>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Enter new Master Recovery Key (or leave blank to keep current)"
              value={settings.adminRecoveryKey || ''}
              onChange={(e) => setSettings({ ...settings, adminRecoveryKey: e.target.value })}
              className="w-full bg-[#160a2b] border border-purple-800 focus:border-amber-500 rounded-xl px-3 py-2 text-sm text-amber-300 focus:outline-none font-mono"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-heading font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-600/30 transition-all active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Platform Settings...' : 'Save All Settings & Sync Now'}</span>
        </button>
      </form>
    </div>
  );
}
