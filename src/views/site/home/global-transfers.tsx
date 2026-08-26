"use client";

import React, { useState } from "react";
import SectionCard from "@/components/cards/section";
import { 
  Send, 
  Zap, 
  Building2, 
  ShieldCheck 
} from "lucide-react";
import { USDCIcon } from "@/components/ui/token-icons";
import { USFlagIcon, EUFlagIcon, UKFlagIcon, NGFlagIcon, BRFlagIcon } from "@/components/ui/flag-icons";

interface PayoutCorridor {
  id: string;
  name: string;
  currency: string;
  flag: React.ComponentType<{ className?: string }>;
  rail: string;
  deliveryTime: string;
  exampleFee: string;
  traditionalFee: string;
  rate: number;
}

const corridors: PayoutCorridor[] = [
  {
    id: "eur",
    name: "European Union",
    currency: "EUR",
    flag: EUFlagIcon,
    rail: "SEPA & SEPA Instant",
    deliveryTime: "Instant (Seconds)",
    exampleFee: "€0.00 Fixed",
    traditionalFee: "€25 + 3.2% FX markup",
    rate: 0.92,
  },
  {
    id: "gbp",
    name: "United Kingdom",
    currency: "GBP",
    flag: UKFlagIcon,
    rail: "Faster Payments (FPS)",
    deliveryTime: "Instant (Real-time)",
    exampleFee: "£0.00 Fixed",
    traditionalFee: "£20 + 2.8% FX markup",
    rate: 0.79,
  },
  {
    id: "usd",
    name: "United States",
    currency: "USD",
    flag: USFlagIcon,
    rail: "ACH & Fedwire",
    deliveryTime: "Same-Day / Instant",
    exampleFee: "$0.00 Fixed",
    traditionalFee: "$35 International Wire",
    rate: 1.00,
  },
  {
    id: "brl",
    name: "Brazil",
    currency: "BRL",
    flag: BRFlagIcon,
    rail: "Pix Instant Rails",
    deliveryTime: "Instant 24/7",
    exampleFee: "R$ 0.00 Fixed",
    traditionalFee: "4.5% Bank Spread",
    rate: 5.65,
  },
  {
    id: "ngn",
    name: "Nigeria",
    currency: "NGN",
    flag: NGFlagIcon,
    rail: "NIBSS Instant Transfer",
    deliveryTime: "Instant (1–2 mins)",
    exampleFee: "₦0.00 Fixed",
    traditionalFee: "Parallel Market Spread",
    rate: 1620.00,
  },
];

export default function GlobalTransfers() {
  const [activeCorridor, setActiveCorridor] = useState<PayoutCorridor>(corridors[0]);
  const [sendAmount, setSendAmount] = useState<number>(1000);

  const estimatedReceived = (sendAmount * activeCorridor.rate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <section id="global-transfers" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-gradient-to-br from-brand-purple/15 via-[#EEF8A8]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
          <div className="mb-6">
            <SectionCard title="GLOBAL FIAT RAILS" category="CROSS-BORDER PAYOUTS" variant="yellow" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 tracking-tight leading-[1.08] mb-4">
            Send Money Globally, <br className="hidden sm:block" />
            <span className="text-brand-purple">Directly to Real Bank Accounts</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-sans">
            Convert stablecoins into local fiat currencies and pay out directly to recipient bank accounts worldwide with instant local rails, zero wire delays, and zero hidden spreads.
          </p>
        </div>

        {/* Two-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Interactive Payout Estimator Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[480px] rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-xl shadow-zinc-200/50 backdrop-blur-xl flex flex-col gap-6">
              
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple">
                    <Send size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-zinc-950">Global Fiat Off-Ramp</h3>
                    <span className="text-[10px] font-mono text-zinc-400">Bridge.xyz Liquidation Engine</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#EEF8A8] text-[#556000] border border-[#D0E244]">
                  Zero FX Spread
                </span>
              </div>

              {/* Source Input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">You Send (Stablecoins)</label>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10 transition-all">
                  <input
                    type="number"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(Math.max(1, Number(e.target.value)))}
                    className="w-1/2 bg-transparent text-xl sm:text-2xl font-mono font-black text-zinc-950 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                    <USDCIcon size={20} />
                    <span className="text-xs font-mono font-bold text-zinc-900">USDC</span>
                  </div>
                </div>
              </div>

              {/* Destination Corridor Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Recipient Receives In Local Currency</label>
                
                {/* Corridor Tabs */}
                <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 mb-1">
                  {corridors.map((c) => {
                    const isActive = activeCorridor.id === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setActiveCorridor(c)}
                        className={`py-2 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isActive
                            ? "bg-white text-brand-purple font-bold shadow-xs border border-zinc-200/80"
                            : "text-zinc-500 hover:text-zinc-900"
                        }`}
                      >
                        <c.flag className="w-4 h-4" />
                        <span className="text-[10px] font-mono">{c.currency}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Recipient Output Box */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/50 via-zinc-50 to-white border border-purple-100">
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-mono font-black text-brand-purple">
                      {estimatedReceived}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      via {activeCorridor.rail}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 shadow-xs">
                    <activeCorridor.flag className="w-5 h-5" />
                    <span className="text-xs font-mono font-bold text-zinc-900">{activeCorridor.currency}</span>
                  </div>
                </div>
              </div>

              {/* Comparison Summary Banner */}
              <div className="rounded-2xl bg-[#F5FACD] border border-[#D9E956]/80 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-[#556000] flex items-center gap-1.5">
                    <Zap size={14} className="text-[#839105]" />
                    Delivery Speed:
                  </span>
                  <span className="font-mono font-extrabold text-[#556000]">{activeCorridor.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans border-t border-[#D9E956]/50 pt-2">
                  <span className="text-zinc-600">Traditional Bank Wire Cost:</span>
                  <span className="font-mono font-medium text-rose-600 line-through">{activeCorridor.traditionalFee}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="font-bold text-zinc-900">StableBank Fixed Cost:</span>
                  <span className="font-mono font-bold text-emerald-700">{activeCorridor.exampleFee}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Institutional Features Matrix */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            
            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs hover:border-brand-purple/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-zinc-950 mb-1">
                  Named Virtual Bank Accounts
                </h4>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                  Receive USD, EUR, and GBP wire or ACH payments issued under your own personal or business legal name. Incoming fiat is automatically converted to USDC at 1:1 parity with zero slippage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs hover:border-brand-purple/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000] shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-zinc-950 mb-1">
                  Real-Time Local Clearing Rails
                </h4>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                  Bypass slow intermediary correspondent banking networks. StableBank settles through domestic rails including FedNow, ACH Push, SEPA Instant, UK Faster Payments, Mexico SPEI, and Brazil Pix.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white border border-zinc-200 shadow-xs hover:border-brand-purple/40 transition-all">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-zinc-950 mb-1">
                  Enterprise-Grade Compliance & AML
                </h4>
                <p className="text-sm text-zinc-600 font-sans leading-relaxed">
                  Orchestrated directly through licensed banking partners with automated KYC/KYB verification, real-time Travel Rule compliance, and bank-grade data encryption.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
