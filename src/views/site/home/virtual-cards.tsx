"use client";

import React, { useState } from "react";
import { ShieldCheck, Zap, Lock, Eye, EyeOff, Snowflake, Sparkles } from "lucide-react";
import SectionCard from "@/components/cards/section";
import BrandLogo from "@/components/brand/brand-logo";

export default function VirtualCards() {
  const [showDetails, setShowDetails] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);

  // 3D Tilt Effect States
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotation = 12;
    const rotateXValue = ((centerY - y) / centerY) * maxRotation;
    const rotateYValue = ((x - centerX) / centerX) * maxRotation;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Copy Side */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <SectionCard title="VIRTUAL CARDS" category="INSTANT VISA" variant="yellow" />
            
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 leading-tight">
              Spend USDT Like Cash,<br />
              <span className="text-brand-purple">Instantly.</span>
            </h2>
            
            <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-xl font-sans">
              Create virtual debit cards in seconds to spend your USDC, USDT, and EURC anywhere Visa is accepted. Enjoy full autonomy and premium security.
            </p>

            <ul className="mt-8 space-y-4 text-sm sm:text-base text-zinc-700 font-sans">
              <li className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000] shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <span><strong>Instant Issuance</strong> — Generate new cards for shopping or recurring payments immediately.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <span><strong>Stable Settlement</strong> — No pre-funding needed; funds settle directly from your stablecoin wallet.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <span><strong>Single-Use Burners</strong> — Cards automatically self-destruct after one transaction for maximum safety.</span>
              </li>
            </ul>
          </div>

          {/* Interactive Card & Mobile Manager Side */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[440px] px-2 sm:px-0 flex flex-col gap-4">
              
              {/* Premium 3D Card */}
              <div 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative aspect-[1.586/1] w-full rounded-3xl p-6 sm:p-8 overflow-hidden border border-zinc-800 bg-gradient-to-br from-[#1E1B2E] via-[#0F0E17] to-[#161520] shadow-2xl flex flex-col justify-between cursor-pointer select-none transition-all ${
                  isFrozen ? "opacity-75 grayscale" : ""
                }`}
                style={{
                  transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${rotateX !== 0 || rotateY !== 0 ? 1.04 : 1}, ${rotateX !== 0 || rotateY !== 0 ? 1.04 : 1}, 1)`,
                  transition: rotateX === 0 && rotateY === 0 ? "all 0.5s ease" : "transform 0.1s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Background decorative gradient mesh inside the card */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#4649d6_0%,transparent_60%)] opacity-40 pointer-events-none" />
                
                {/* Card Top Row with White StableBank Logo */}
                <div className="relative flex justify-between items-start z-10" style={{ transform: "translateZ(30px)" }}>
                  <div className="flex flex-col items-start gap-1">
                    <BrandLogo variant="white" className="h-5 sm:h-6" textClassName="text-base sm:text-lg text-white" iconClassName="h-4 sm:h-5 text-white" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-white/50 uppercase ml-0.5">Black Metal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 tracking-wider ${
                      isFrozen 
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {isFrozen ? "Frozen" : "Active"}
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-white tracking-widest px-1">VISA</span>
                  </div>
                </div>

                {/* Chip Representation */}
                <div 
                  className="relative z-10 mt-3 sm:mt-4 h-8 w-11 rounded bg-gradient-to-br from-amber-400/50 via-amber-200/20 to-amber-400/40 border border-amber-400/40 opacity-90" 
                  style={{ transform: "translateZ(25px)" }}
                />

                {/* Card Number */}
                <div 
                  className="relative z-10 text-lg sm:text-2xl font-mono tracking-widest text-white my-4 sm:my-6 select-all font-semibold"
                  style={{ transform: "translateZ(40px)" }}
                >
                  {showDetails ? "4102 9845 2371 8492" : "•••• •••• •••• 8492"}
                </div>

                {/* Card Bottom Row */}
                <div className="relative flex justify-between items-end z-10" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/40 tracking-wider block uppercase">Card Holder</span>
                    <span className="text-xs sm:text-sm font-semibold text-white">StableBank User</span>
                  </div>
                  <div className="flex gap-4 sm:gap-6">
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/40 tracking-wider block uppercase">Expires</span>
                      <span className="text-xs sm:text-sm font-mono font-semibold text-white">12 / 30</span>
                    </div>
                    <div>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white/40 tracking-wider block uppercase">CVV</span>
                      <span className="text-xs sm:text-sm font-mono font-semibold text-white">
                        {showDetails ? "382" : "•••"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Card Interactive Controls */}
              <div className="flex items-center justify-between gap-2 pt-1 px-1">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-xs font-mono font-bold text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-xs cursor-pointer"
                >
                  {showDetails ? <EyeOff size={13} className="text-zinc-500" /> : <Eye size={13} className="text-zinc-500" />}
                  <span>{showDetails ? "Hide Numbers" : "Show Numbers"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFrozen(!isFrozen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all shadow-xs cursor-pointer ${
                    isFrozen
                      ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <Snowflake size={13} className={isFrozen ? "text-amber-600" : "text-zinc-500"} />
                  <span>{isFrozen ? "Unfreeze Card" : "Freeze Card"}</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 bg-[#EEF8A8]/90 border border-[#D0E244]/80 px-2.5 py-1.5 rounded-xl text-[11px] font-mono font-bold text-[#556000]">
                  <Sparkles size={12} className="text-[#839105]" />
                  <span>3% Cashback</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
