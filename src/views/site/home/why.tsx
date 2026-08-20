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
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-brand-yellow/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-largest mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center flex flex-col items-center">
          <SectionCard title="WHY STABLEBANK" />
          
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-white">
            Old Banking is <span className="text-brand-purple">Stuck in the Past</span>
          </h2>
          
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-2xl">
            You&lsquo;re part of a new generation that earns in dollars, spends in euros, and saves in stablecoins. Traditional banks weren&lsquo;t built for the future. StableBank was.
          </p>
        </div>

        {/* Comparison and Philosophy Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Comparison Table Card */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl" />
            
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-white/15 pb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-white/50">Feature comparison</span>
                <span className="text-xs font-bold text-brand-yellow flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Direct Settle
                </span>
              </div>

              <div className="space-y-4">
                {comparisonRows.map((row, index) => (
                  <div
                    key={row.feature}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-4 rounded-2xl border transition-all duration-300",
                      hoveredRow === index
                        ? "bg-white/[0.03] border-white/10"
                        : "bg-transparent border-transparent"
                    )}
                  >
                    {/* Feature Label */}
                    <div className="md:col-span-3 flex items-center">
                      <span className="text-sm font-bold text-brand-white">{row.feature}</span>
                    </div>

                    {/* Traditional Bank */}
                    <div className="md:col-span-4 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="text-xs sm:text-sm text-white/40">{row.traditional}</span>
                    </div>

                    {/* StableBank */}
                    <div className="md:col-span-5 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-brand-yellow shrink-0" />
                      <span className="text-xs sm:text-sm text-brand-white font-semibold">{row.stablebank}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Philosophy Cards Side */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Card 1: Zero Bureaucracy */}
            <div className="group relative p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-brand-purple/35 transition-all duration-500 overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-all" />
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-purple transition-all duration-500">
                  <Shield className="w-6 h-6 text-brand-purple group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3">Zero Bureaucracy</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  No bank managers, no tedious paperwork, no physical branch visits. Just code, cryptography, and self-sovereign control over your capital.
                </p>
              </div>
            </div>

            {/* Card 2: Global by Default */}
            <div className="group relative p-6 sm:p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-brand-yellow/35 transition-all duration-500 overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl group-hover:bg-brand-yellow/20 transition-all" />
              <div>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow transition-all duration-500">
                  <Globe className="w-6 h-6 text-brand-yellow group-hover:text-black transition-colors" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3">Global by Default</h3>
                <p className="text-sm text-white/50 leading-relaxed">
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
