"use client";

import React, { useState } from "react";
import SectionCard from "@/components/cards/section";
import { 
  TrendingUp, 
  Target, 
  PiggyBank, 
  CheckCircle2
} from "lucide-react";
import { USDCIcon, USDTIcon, EURCIcon } from "@/components/ui/token-icons";

export default function YieldVaults() {
  const [depositAmount, setDepositAmount] = useState<number>(10000);
  const [selectedDuration, setSelectedDuration] = useState<number>(365); // days
  const [savingsMode, setSavingsMode] = useState<"flex" | "safelock">("safelock");

  // APY Rates
  const flexApy = 5.2;
  const safelockApy = selectedDuration === 30 ? 8.5 : selectedDuration === 90 ? 9.8 : selectedDuration === 180 ? 10.8 : 12.0;
  const activeApy = savingsMode === "flex" ? flexApy : safelockApy;

  const earnedInterest = (depositAmount * (activeApy / 100) * (selectedDuration / 365)).toFixed(2);
  const traditionalInterest = (depositAmount * (0.01 / 100) * (selectedDuration / 365)).toFixed(2);

  return (
    <section id="yield-vaults" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden bg-gradient-to-b from-white via-zinc-50/50 to-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[500px] bg-gradient-to-tr from-brand-purple/10 via-[#EEF8A8]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
          <div className="mb-6">
            <SectionCard title="SMART SAVINGS" category="HIGH-YIELD INTEREST" variant="yellow" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 tracking-tight leading-[1.08] mb-4">
            Put Your Idle Cash to Work, <br className="hidden sm:block" />
            <span className="text-brand-purple">Earn Up to 12.0% Fixed APY</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-sans">
            Beat traditional 0.01% bank interest. Earn high daily compounding returns and guaranteed term yields on your digital dollars and euros.
          </p>
        </div>

        {/* 3 Bento Savings Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          {/* Tile 1: Flexible Savings */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple">
                  <PiggyBank size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-[#556000] bg-[#EEF8A8] border border-[#D0E244] px-2.5 py-1 rounded-full">
                  5.2% Daily APY
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-zinc-950 mb-2">
                Flexible Savings
              </h3>
              <p className="text-sm text-zinc-600 font-sans leading-relaxed mb-6">
                Earn daily compounding returns on your liquid wallet balance. Deposit and withdraw anytime with 0 lockup periods and zero penalty fees.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs font-sans text-zinc-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Daily interest payouts into spendable balance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Instant liquidity for virtual card spending</span>
              </li>
            </ul>
          </div>

          {/* Tile 2: Safelock Term Staking (Hero Tile) */}
          <div className="rounded-3xl border-2 border-brand-purple bg-gradient-to-b from-purple-50/40 via-white to-white p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-brand-purple text-white px-4 py-1 rounded-bl-2xl text-[10px] font-mono font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-brand-purple text-white flex items-center justify-center shadow-sm">
                  <TrendingUp size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-[#556000] bg-[#EEF8A8] border border-[#D0E244] px-2.5 py-1 rounded-full">
                  Up to 12.0% APY
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-zinc-950 mb-2">
                Safelock Term Deposits
              </h3>
              <p className="text-sm text-zinc-600 font-sans leading-relaxed mb-6">
                Lock your funds for 30 to 365 days to guarantee maximum fixed yield. Choose between upfront interest payout or maturity compounding.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-purple-100 text-xs font-sans text-zinc-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-purple shrink-0" />
                <span>Upfront interest payout available immediately</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-brand-purple shrink-0" />
                <span>Fixed, guaranteed high-yield returns</span>
              </li>
            </ul>
          </div>

          {/* Tile 3: Target Goal Savings */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
                  <Target size={24} />
                </div>
                <span className="text-xs font-mono font-bold text-[#556000] bg-[#EEF8A8] border border-[#D0E244] px-2.5 py-1 rounded-full">
                  8.5% Goal APY
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-zinc-950 mb-2">
                Target Savings Goals
              </h3>
              <p className="text-sm text-zinc-600 font-sans leading-relaxed mb-6">
                Set automated daily, weekly, or monthly autosave rules toward life milestones like real estate, emergency funds, or travel.
              </p>
            </div>

            <ul className="space-y-2.5 pt-4 border-t border-zinc-100 text-xs font-sans text-zinc-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Custom milestone targets with automated rules</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>Bonus interest unlocked on goal completion</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Interactive Yield Calculator */}
        <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-lg backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Calculator Inputs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-purple">Interactive Yield Calculator</span>
                <h4 className="text-2xl font-display font-bold text-zinc-950 mt-1">Estimate Your Stablecoin Earnings</h4>
              </div>

              {/* Mode Switcher */}
              <div className="flex gap-2 p-1 rounded-xl bg-zinc-100 border border-zinc-200 w-fit">
                <button
                  type="button"
                  onClick={() => setSavingsMode("safelock")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    savingsMode === "safelock" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Safelock (Fixed Up to 12%)
                </button>
                <button
                  type="button"
                  onClick={() => setSavingsMode("flex")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    savingsMode === "flex" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Flexible (5.2% Daily)
                </button>
              </div>

              {/* Deposit Slider & Amount Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Deposit Principal (USD)</label>
                  <span className="text-lg font-mono font-bold text-zinc-950">${depositAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              {/* Duration Selector */}
              {savingsMode === "safelock" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Lockup Duration</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { days: 30, apy: "8.5%" },
                      { days: 90, apy: "9.8%" },
                      { days: 180, apy: "10.8%" },
                      { days: 365, apy: "12.0%" },
                    ].map((term) => (
                      <button
                        key={term.days}
                        type="button"
                        onClick={() => setSelectedDuration(term.days)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selectedDuration === term.days
                            ? "bg-purple-50 border-brand-purple text-brand-purple font-bold shadow-xs"
                            : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-white"
                        }`}
                      >
                        <div className="text-xs font-mono font-bold">{term.days} Days</div>
                        <div className="text-[10px] font-mono text-emerald-600 font-semibold">{term.apy} APY</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Calculator Output Card */}
            <div className="lg:col-span-5 flex flex-col gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1B2E] via-[#0F0E17] to-[#161520] text-white shadow-xl">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 block">Projected Yield</span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-[#EEF8A8] mt-1">
                  +${earnedInterest} <span className="text-xs font-sans text-white/60 font-normal">USD</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 mt-1 block">
                  Effective Rate: {activeApy}% APY
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-white/70">
                  <span>Traditional Bank (0.01%):</span>
                  <span className="font-mono line-through text-white/40">${traditionalInterest}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>StableBank Extra Earnings:</span>
                  <span className="font-mono font-bold text-[#D9E956]">+${(Number(earnedInterest) - Number(traditionalInterest)).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-2 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
                <span>Supported Assets:</span>
                <div className="flex items-center gap-1.5">
                  <USDCIcon size={18} />
                  <USDTIcon size={18} />
                  <EURCIcon size={18} />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
