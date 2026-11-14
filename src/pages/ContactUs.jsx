import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  Send,
  Mail,
  Instagram,
  Youtube,
  Disc,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import SEO from '../components/SEO';

export default function ContactUs() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    supportWhatsapp: '+91 7079789108',
    supportTelegram: '@RushXSupport',
    telegramUrl: 'https://t.me/RushXSupport',
    discordUrl: 'https://discord.gg/rushx',
    supportEmail: 'rushxsupportteam@gmail.com',
    instagramUrl: 'https://www.instagram.com/rushx_scrim/',
    youtubeUrl: 'https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ'
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(prev => ({ ...prev, ...data })))
      .catch(() => {});
  }, []);

  const cleanPhone = (settings.supportWhatsapp || '7079789108').replace(/\D/g, '');
  const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone || '917079789108';
  const tgLink = settings.telegramUrl || (settings.supportTelegram?.startsWith('http') ? settings.supportTelegram : `https://t.me/${(settings.supportTelegram || 'RushXSupport').replace(/^@/, '')}`);

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      <SEO
        title="Contact Official Support & Helpdesk"
        description="Need help with Free Fire tournament rooms, deposits, or fast payouts? Contact RushX Esports 24/7 support via WhatsApp, Telegram, Instagram, YouTube, or Email."
        path="/contact"
      />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            Official Helpdesk & Socials
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Support Header Card */}
        <div className="bg-gradient-to-r from-purple-950 via-[#180933] to-[#240a4b] border border-purple-500/40 rounded-3xl p-5 text-center shadow-xl space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-purple-600/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-heading font-extrabold text-xl text-white">
            24/7 Player Helpdesk
          </h2>
          <p className="text-xs text-purple-200">
            Have questions regarding tournament custom rooms, deposits, or payouts? Contact our official support channels:
          </p>
        </div>

        {/* WhatsApp Channel */}
        <a
          href={`https://api.whatsapp.com/send?phone=${waPhone}&text=Hello%20RushX%20Support`}
          target="_blank"
          rel="noreferrer"
          className="bg-[#10051e] border border-green-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-green-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">WhatsApp Support</h3>
              <p className="text-xs text-slate-300">+91 7079789108</p>
            </div>
          </div>
          <span className="text-xs font-bold text-green-400 bg-green-950/60 px-3 py-1 rounded-full border border-green-500/40">
            Chat Live
          </span>
        </a>

        {/* Telegram Channel */}
        <a
          href={tgLink}
          target="_blank"
          rel="noreferrer"
          className="bg-[#10051e] border border-cyan-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Send className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Telegram Channel</h3>
              <p className="text-xs text-slate-300">@RushXSupport</p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/40">
            Join Group
          </span>
        </a>

        {/* Instagram Profile */}
        <a
          href={settings.instagramUrl || 'https://www.instagram.com/rushx_scrim/'}
          target="_blank"
          rel="noreferrer"
          className="bg-[#10051e] border border-pink-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-pink-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Official Instagram</h3>
              <p className="text-xs text-slate-300">@rushx_scrim</p>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-400 bg-pink-950/60 px-3 py-1 rounded-full border border-pink-500/40">
            Follow
          </span>
        </a>

        {/* YouTube Channel */}
        <a
          href={settings.youtubeUrl || 'https://www.youtube.com/channel/UClkDEDgopkyb1pfZKCPSXAQ'}
          target="_blank"
          rel="noreferrer"
          className="bg-[#10051e] border border-red-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-red-400 transition-all shadow-md group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Official YouTube</h3>
              <p className="text-xs text-slate-300">RushX Esports Live</p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/40">
            Subscribe
          </span>
        </a>

        {/* Discord Server */}
        {settings.discordUrl && (
          <a
            href={settings.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#10051e] border border-indigo-500/40 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-400 transition-all shadow-md group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Disc className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-white">Discord Server</h3>
                <p className="text-xs text-slate-300">Join Community & Voice</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/40">
              Join
            </span>
          </a>
        )}

        {/* Email */}
        <a
          href={`mailto:${settings.supportEmail || 'rushxsupportteam@gmail.com'}`}
          className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 flex items-center justify-between shadow-md hover:border-purple-600/80 transition-all group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">Email Desk</h3>
              <p className="text-xs text-slate-300">{settings.supportEmail || 'rushxsupportteam@gmail.com'}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-400 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/40">
            Send Mail
          </span>
        </a>

        {/* FAQ Card */}
        <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 space-y-3">
          <span className="font-heading font-bold text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </span>
          <div className="space-y-2 text-xs text-slate-300">
            <div>
              <p className="font-semibold text-white">Q: When will I get Room ID &amp; Password?</p>
              <p className="text-slate-400 text-[11px]">Room details are unlocked on the tournament page 10-15 minutes prior to match time.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Q: What is the maximum deposit &amp; withdrawal?</p>
              <p className="text-slate-400 text-[11px]">Maximum one-time deposit is ₹500. Maximum one-time withdrawal is ₹1,000 from your Win Balance (Max 2 withdrawals per day).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
