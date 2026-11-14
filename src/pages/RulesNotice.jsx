import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Flame,
  Ban,
  Video,
  Wallet,
  Clock,
  Swords,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import SEO from '../components/SEO';

export default function RulesNotice() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState('all');

  return (
    <div className="pb-24 max-w-md mx-auto w-full min-h-screen bg-[#070212] text-white">
      <SEO
        title="Tournament Rules & Fair Play Policy"
        description="Official Free Fire esports rules, anti-cheat policy, room credential timings, and payout guidelines for RushX Esports."
        path="/rules"
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
          <div>
            <h1 className="font-heading font-extrabold text-white text-lg tracking-wide leading-tight">
              Rules & Fair Play
            </h1>
            <p className="text-[11px] text-amber-400 font-bold">Official Tournament Code of Conduct</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-red-950/40 border border-red-500/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-7 h-7 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h2 className="font-heading font-extrabold text-base text-red-300">
              STRICT ZERO-TOLERANCE ANTI-CHEAT
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              RushX operates with strict anti-cheat monitoring. Players caught using aimbots, wallhacks, scripts, PC emulators, or teaming will face an immediate <b>permanent account ban</b> and forfeiture of all balances.
            </p>
          </div>
        </div>

        {/* Section 1: Map & Banned Guns / Items */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-sm">
            <Ban className="w-4 h-4 text-red-400" />
            <span>Map & Banned Items (Strictly Enforced)</span>
          </div>

          <p className="text-xs text-slate-300">
            All Battle Royale matches are played exclusively on <b>BERMUDA MAP</b>. The following weapons and characters are strictly banned:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#180930] p-2.5 rounded-xl border border-red-500/30 text-red-300 font-bold flex items-center gap-1.5">
              <span>🚫</span> <span>Double Vector</span>
            </div>
            <div className="bg-[#180930] p-2.5 rounded-xl border border-red-500/30 text-red-300 font-bold flex items-center gap-1.5">
              <span>🚫</span> <span>M79 Launcher</span>
            </div>
            <div className="bg-[#180930] p-2.5 rounded-xl border border-red-500/30 text-red-300 font-bold flex items-center gap-1.5">
              <span>🚫</span> <span>Ryden Character</span>
            </div>
            <div className="bg-[#180930] p-2.5 rounded-xl border border-red-500/30 text-red-300 font-bold flex items-center gap-1.5">
              <span>🚫</span> <span>Grenade Spam (CS)</span>
            </div>
          </div>
          <p className="text-[11px] text-amber-300/80 italic">
            * Using a banned weapon in custom room results in instant match kill deduction and zero payout.
          </p>
        </div>

        {/* Section 2: Room ID & Joining Guidelines */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-purple-300 font-heading font-bold text-sm">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Custom Room Credentials & Timing</span>
          </div>

          <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
            <li><b>Room ID & Password:</b> Posted strictly in the app <b>10 to 15 minutes</b> prior to scheduled match time.</li>
            <li><b>Registered Players Only:</b> Room credentials unlock exclusively for players who paid the entry fee and joined the tournament.</li>
            <li><b>Do NOT Share or Invite:</b> Inviting unauthorized friends into the custom room leads to match kicking and disqualification without refund.</li>
            <li><b>Slot Timing:</b> All players must enter the room before the scheduled start time. Match will start on time without waiting for latecomers.</li>
          </ul>
        </div>

        {/* Section 3: Screen Recording Mandate */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-heading font-bold text-sm">
            <Video className="w-4 h-4 text-emerald-400" />
            <span>Mandatory Screen Recording</span>
          </div>

          <div className="bg-[#180930] p-3 rounded-xl border border-emerald-500/30 text-xs text-slate-200 space-y-1.5">
            <p className="font-bold text-emerald-300">
              🎥 All players are required to screen-record their full match from room joining to match finish.
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If another player disputes your kills, or suspects foul play, admin will request your screen recording. Failure to provide recording within 30 minutes may lead to winnings being withheld.
            </p>
          </div>
        </div>

        {/* Section 4: Eligibility & Account Security */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-purple-400 font-heading font-bold text-sm">
            <Swords className="w-4 h-4 text-purple-400" />
            <span>Player Eligibility & Fair Play</span>
          </div>

          <ol className="list-decimal list-inside space-y-2">
            <li><b>Level 40+ Requirement:</b> Your Free Fire account must be at least Level 40 to participate. Guest/smurf accounts under Level 40 are prohibited.</li>
            <li><b>Accurate IGN & UID:</b> Ensure your Free Fire In-Game Name (IGN) and Player UID match your RushX profile. Incorrect UIDs may lead to win verification issues.</li>
            <li><b>No Teaming in Solo:</b> Any players caught teaming in Solo Battle Royale will be eliminated from winnings and banned.</li>
            <li><b>Mobile Only:</b> Only mobile phones are allowed. Emulators (Bluestacks, LDPlayer, Gameloop, etc.) are strictly forbidden.</li>
          </ol>
        </div>

        {/* Section 5: Wallet, Deposits & Withdrawals */}
        <div className="bg-[#10051e] border border-purple-900/50 rounded-2xl p-4 space-y-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 text-amber-400 font-heading font-bold text-sm">
            <Wallet className="w-4 h-4 text-amber-400" />
            <span>Wallet, Deposits & Payouts</span>
          </div>

          <ul className="list-disc list-inside space-y-2">
            <li><b>Minimum Deposit:</b> ₹50 via PhonePe QR / UPI with mandatory payment screenshot upload.</li>
            <li><b>Minimum Withdrawal:</b> ₹100 (Max 2 withdrawals per day) transferred directly to your verified UPI ID.</li>
            <li><b>Winnings Only:</b> Withdrawals are strictly processed from your <b>Win Balance</b> (earned through kills and tournament wins). Deposit balance is used for contest entry fees.</li>
            <li><b>Payout Timeline:</b> Match kills and winnings are verified by admin and credited to your wallet within 15 to 30 minutes of match completion.</li>
          </ul>
        </div>

        {/* Support Action */}
        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/contact')}
            className="inline-flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 font-bold"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Have questions or need to report a rule violation? Contact Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}
