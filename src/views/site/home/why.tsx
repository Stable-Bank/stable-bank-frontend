"use client";

import { SectionCard } from "@/components/cards";
import { cn } from "@/utils/cn";
import { 
  XCircle, 
  CheckCircle2, 
  Zap, 
  TrendingDown, 
  Sparkles
} from "lucide-react";
import React, { useState } from "react";
import { USDCIcon } from "@/components/ui/token-icons";

interface ComparisonRow {
  id: string;
  category: string;
  traditional: {
    title: string;
    detail: string;
    badMetric: string;
  };
  stablebank: {
    title: string;
    detail: string;
    goodMetric: string;
  };
}

const comparisonRows: ComparisonRow[] = [
  {
    id: "fees",
    category: "Cross-Border Payouts",
    traditional: {
      title: "Expensive Intermediaries",
      detail: "Hidden 3% to 5% FX spreads plus $35 swift fees",
      badMetric: "Up to $350 lost per $10k",
    },
    stablebank: {
      title: "Zero Hidden Fees",
      detail: "Institutional market rates with sub-second finality",
      goodMetric: "0% Hidden FX Spread",
    },
  },
  {
    id: "speed",
    category: "Settlement Speed",
    traditional: {
      title: "Slow Banking Rails",
      detail: "3 to 5 business days, offline on weekends and holidays",
      badMetric: "72+ Hours Delay",
    },
    stablebank: {
      title: "Instant 24/7 Rails",
      detail: "Continuous automated settlement across 10+ chains",
      goodMetric: "Real-Time (<2s)",
    },
  },
  {
    id: "access",
    category: "Account Onboarding",
    traditional: {
      title: "Branch Bureaucracy",
      detail: "In-person visits, piles of paperwork, weeks to open",
      badMetric: "2 to 3 Weeks Wait",
    },
    stablebank: {
      title: "Instant Digital Access",
      detail: "Open named USD, EUR, and GBP virtual accounts in minutes",
      goodMetric: "Instant Activation",
    },
  },
  {
    id: "yield",
    category: "Idle Balance Growth",
    traditional: {
      title: "Negative Real Returns",
      detail: "0.01% average APY while your capital inflates away",
      badMetric: "0.01% APY",
    },
    stablebank: {
      title: "Daily Compounding Yield",
      detail: "Earn up to 12.0% fixed yield paid directly to wallet",
      goodMetric: "Up to 12.0% APY",
    },
  },
  {
    id: "cards",
    category: "Global Spending",
    traditional: {
      title: "Foreign Transaction Surcharges",
      detail: "Punitive cross-border conversion fees at checkout",
      badMetric: "+3.5% Card Fee",
    },
    stablebank: {
      title: "Universal Visa Debit",
      detail: "Spend stables anywhere Visa is accepted with 3% cashback",
      goodMetric: "3% Cashback",
    },
  },
];

export default function Why() {
  const [activeRow, setActiveRow] = useState<string>("fees");

  return (
    <section id="why" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-brand-purple/10 via-[#EEF8A8]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center flex flex-col items-center">
          <div className="mb-6">
            <SectionCard title="WHY STABLEBANK" category="THE COMPARISON" variant="yellow" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 tracking-tight leading-[1.08] mb-4">
            Old Banking is <br className="hidden sm:block" />
            <span className="text-brand-purple">Stuck in the Past</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-sans">
            You earn in dollars, spend in euros, and save in stablecoins. Traditional banks were never designed for borderless digital money. StableBank was.
          </p>
        </div>

        {/* Comparison Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: High-Impact Comparison Matrix Card (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300">
            <div>
              {/* Table Column Headers */}
              <div className="grid grid-cols-12 gap-2 pb-4 mb-4 border-b border-zinc-100 items-center text-[11px] font-mono font-bold uppercase tracking-wider">
                <div className="col-span-4 text-zinc-400">
                  Feature
                </div>
                <div className="col-span-4 text-rose-500/90 flex items-center gap-1">
                  <XCircle size={13} className="text-rose-500 shrink-0" />
                  <span>Legacy Banks</span>
                </div>
                <div className="col-span-4 text-brand-purple flex items-center gap-1">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>StableBank</span>
                </div>
              </div>

              {/* Rows */}
              <div className="space-y-2.5">
                {comparisonRows.map((row) => {
                  const isSelected = activeRow === row.id;
                  return (
                    <div
                      key={row.id}
                      onClick={() => setActiveRow(row.id)}
                      onMouseEnter={() => setActiveRow(row.id)}
                      className={cn(
                        "grid grid-cols-12 gap-2 p-3 sm:p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer items-center",
                        isSelected
                          ? "bg-gradient-to-r from-purple-50/50 via-zinc-50/50 to-[#F5FACD]/30 border-brand-purple/40 shadow-xs scale-[1.01]"
                          : "bg-zinc-50/50 border-transparent hover:bg-zinc-50 hover:border-zinc-200/80"
                      )}
                    >
                      {/* Feature Name */}
                      <div className="col-span-4 flex flex-col pr-1">
                        <span className="text-xs sm:text-sm font-sans font-bold text-zinc-950 leading-tight">
                          {row.category}
                        </span>
                      </div>

                      {/* Traditional Bank */}
                      <div className="col-span-4 flex flex-col pr-1">
                        <span className="text-xs font-mono font-semibold text-rose-600 truncate">
                          {row.traditional.badMetric}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-sans truncate hidden sm:block">
                          {row.traditional.title}
                        </span>
                      </div>

                      {/* StableBank */}
                      <div className="col-span-4 flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-mono font-black text-brand-purple truncate">
                            {row.stablebank.goodMetric}
                          </span>
                        </div>
                        <span className="text-[10px] font-sans font-medium text-[#556000] truncate hidden sm:block">
                          {row.stablebank.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Matrix Bottom Live Status Bar */}
            <div className="mt-6 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-zinc-500 text-[11px]">Bridge Liquidation Engine: 100% Operational</span>
              </div>

              <div className="flex items-center gap-1.5 bg-[#EEF8A8] border border-[#D0E244] px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold text-[#556000]">
                <Sparkles size={13} className="text-[#839105]" />
                <span>Zero Hidden Fees</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Breakdown Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Card 1: The Cost of Legacy Banking Breakdown */}
            <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <TrendingDown size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Legacy Banking Friction
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                  The Hidden Cost of Wire Transfers
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans mb-4">
                  A standard \$10,000 international bank wire incurs up to \$35 in sending fees, \$25 in intermediary deductions, and \$350 in inflated foreign exchange spreads.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 font-semibold">Typical Legacy Wire Loss:</span>
                <span className="font-mono font-bold text-rose-600">-$410.00 / Transfer</span>
              </div>
            </div>

            {/* Card 2: The StableBank Advantage */}
            <div className="rounded-3xl border-2 border-brand-purple bg-gradient-to-br from-purple-50/50 via-white to-white p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#EEF8A8] text-[#556000] border-b border-l border-[#D0E244] px-3.5 py-1 rounded-bl-2xl text-[10px] font-mono font-bold uppercase tracking-wider">
                Instant Settlement
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-11 w-11 rounded-2xl bg-brand-purple text-white flex items-center justify-center shadow-xs">
                    <Zap size={22} />
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                  The StableBank Standard
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans mb-4">
                  Instant global payouts, named virtual IBANs, and direct stablecoin settlement settle on-chain in seconds with 0% hidden FX markups.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-purple-200 flex items-center justify-between text-xs font-mono shadow-2xs">
                <div className="flex items-center gap-1.5 text-zinc-800 font-semibold">
                  <USDCIcon size={18} />
                  <span>StableBank Payout Cost:</span>
                </div>
                <span className="font-mono font-black text-emerald-600">$0.00 (Zero Spread)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
