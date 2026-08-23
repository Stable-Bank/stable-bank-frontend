"use client";

import { SectionCard } from "@/components/cards";
import { cn } from "@/utils/cn";
import { XCircle, CheckCircle2, Shield, Globe, Sparkles } from "lucide-react";
import React, { useState } from "react";

const comparisonRows = [
  {
    feature: "Cross-Border Fees",
    traditional: "High wire fees & 3% FX markups",
    stablebank: "Zero hidden fees, instant stablecoin settlement",
  },
  {
    feature: "Transfer Speed",
    traditional: "3–5 business days, weekends off",
    stablebank: "Instant 24/7 global transfers",
  },
  {
    feature: "Setup & Access",
    traditional: "Bureaucratic checks, branch visits",
    stablebank: "Self-custodial, instant digital onboarding",
  },
  {
    feature: "Earn & Yield",
    traditional: "0.01% yield while inflating away",
    stablebank: "Competitive yields settled in wallet",
  },
];

export default function Why() {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-largest mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center flex flex-col items-center">
          <SectionCard title="WHY STABLEBANK" />
          
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950">
            Old Banking is <span className="text-brand-purple">Stuck in the Past</span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-600 max-w-2xl font-sans">
            You&lsquo;re part of a new generation that earns in dollars, spends in euros, and saves in stablecoins. Traditional banks weren&lsquo;t built for the future. StableBank was.
          </p>
        </div>

        {/* Comparison and Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Comparison Table Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-zinc-200 pb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-semibold">Feature comparison</span>
                <span className="text-xs font-mono font-bold text-brand-purple flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Direct Settle
                </span>
              </div>

              <div className="space-y-3">
                {comparisonRows.map((row, index) => (
                  <div
                    key={row.feature}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 rounded-xl border transition-all duration-300",
                      hoveredRow === index
                        ? "bg-zinc-50 border-zinc-300"
                        : "bg-transparent border-transparent"
                    )}
                  >
                    {/* Feature Label */}
                    <div className="md:col-span-4 flex items-center">
                      <span className="text-sm font-semibold text-zinc-900">{row.feature}</span>
                    </div>

                    {/* Traditional Bank */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-xs sm:text-sm text-zinc-500">{row.traditional}</span>
                    </div>

                    {/* StableBank */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm text-zinc-900 font-semibold">{row.stablebank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Philosophy Cards Side */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: Zero Bureaucracy */}
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-brand-purple transition-all duration-300">
                  <Shield className="w-6 h-6 text-brand-purple group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">Zero Bureaucracy</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                  No bank managers, no tedious paperwork, no physical branch visits. Just code, cryptography, and self-sovereign control over your capital.
                </p>
              </div>
            </div>

            {/* Card 2: Global by Default */}
            <div className="group relative p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-brand-purple transition-all duration-300">
                  <Globe className="w-6 h-6 text-brand-purple group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">Global by Default</h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                  Save, spend, and receive international payments in multiple currencies seamlessly. Designed from the ground up for borderless individuals and modern digital nomads.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
