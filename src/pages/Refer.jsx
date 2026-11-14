import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

export default function Refer() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const referralCode = user?.referralCode || user?.username || 'RUSHX100';
  const shareText = `🔥 Join RushX Free Fire Tournaments with my code ${referralCode} and win real cash in BR & CS matches! Register now: ${window.location.origin}/register?ref=${referralCode}`;

  const copyCode = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralCode);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = referralCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setToastMsg('Referral code copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setToastMsg('');
      }, 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
      setToastMsg(`Code: ${referralCode}`);
      setTimeout(() => setToastMsg(''), 2500);
    }
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareWhatsapp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank');
  };

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      <SEO
        title="Refer & Earn Real Cash"
        description="Invite friends to RushX Esports tournaments. Earn instant wallet bonus when your friends join their first match."
        path="/refer"
      />
      {/* Top Header matching Screenshot 4 */}
      <div className="sticky top-0 z-40 bg-[#0d041c]/95 backdrop-blur-md border-b border-purple-900/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-9 h-9 rounded-full bg-[#180930] hover:bg-[#230d45] border border-purple-500/30 flex items-center justify-center text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading font-extrabold text-white text-lg tracking-wide">
            Refer & Earn
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Main Purple Gradient Container matching Screenshot 4 */}
        <div className="bg-gradient-to-b from-[#491a9b] via-[#351079] to-[#200950] rounded-3xl p-6 text-center shadow-2xl border border-purple-500/40 space-y-5">
          {/* Headline */}
          <h2 className="font-heading font-black text-2xl text-white tracking-wide">
            Refer your friend <br /> and Earn
          </h2>

          {/* Gift Box Icon Graphic */}
          <div className="w-24 h-24 mx-auto bg-amber-400 rounded-3xl p-3 shadow-lg flex items-center justify-center relative overflow-hidden border-2 border-yellow-200">
            <div className="absolute top-0 bottom-0 w-4 bg-red-600 left-1/2 -translate-x-1/2"></div>
            <div className="absolute left-0 right-0 h-4 bg-red-600 top-1/2 -translate-y-1/2"></div>
            <div className="absolute top-2 w-8 h-4 rounded-full border-2 border-red-600"></div>
            <Gift className="w-12 h-12 text-white relative z-10" />
          </div>

          {/* Explanatory Text matching Screenshot 4 */}
          <p className="text-xs text-purple-200 leading-relaxed font-medium px-2">
            Invite your friends on App using your Referral Code to Earn coins in depositWallet when they join their First Paid match! Your friends also get instant Registration Bonus!
          </p>

          {/* Dashed Purple Referral Code Box (Screenshot 4) */}
          <div className="border-2 border-dashed border-purple-300/60 rounded-2xl p-4 bg-[#3d1385]/50">
            <span className="text-[11px] font-semibold text-purple-200 uppercase tracking-widest block mb-2">
              Your referral code
            </span>
            <div className="flex items-center justify-between bg-[#240a58] px-4 py-3 rounded-xl border border-purple-400/40 shadow-inner">
              <span className="font-mono font-black text-lg text-white tracking-widest select-all">
                {referralCode}
              </span>
              <button
                type="button"
                onClick={copyCode}
                aria-label="Copy referral code"
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow ${
                  copied
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-emerald-500/50'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            {toastMsg && (
              <p className="mt-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/50 py-1.5 px-3 rounded-xl animate-in fade-in flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{toastMsg}</span>
              </p>
            )}
          </div>

          {/* Share Via Title */}
          <div className="pt-2">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider block mb-3">
              Share your referral code via
            </span>

            {/* 3 Social Buttons matching Screenshot 4 */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Telegram */}
              <button
                onClick={shareTelegram}
                className="py-2.5 px-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4 fill-current" />
                <span>Telegram</span>
              </button>

              {/* Facebook */}
              <button
                onClick={shareFacebook}
                className="py-2.5 px-2 rounded-xl bg-[#1877f2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <Share2 className="w-4 h-4" />
                <span>Facebook</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={shareWhatsapp}
                className="py-2.5 px-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bonus Terms Card */}
        <div className="bg-[#10051e] border border-purple-900/60 rounded-2xl p-4 text-xs text-slate-300 space-y-1.5">
          <span className="font-bold text-amber-400 uppercase">Referral Terms:</span>
          <p>• Both you and your friend must have valid Free Fire player UIDs.</p>
          <p>• Bonus is credited automatically upon your referred friend joining their first paid tournament match.</p>
        </div>
      </div>
    </div>
  );
}
