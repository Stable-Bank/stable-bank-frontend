"use client";

import React, { useState } from "react";
import SectionCard from "@/components/cards/section";
import GlobeDome from "@/components/graphics/globe-dome";
import {
  USFlagIcon,
  UKFlagIcon,
  EUFlagIcon,
  NGFlagIcon,
  TZFlagIcon,
  CAFlagIcon,
  UYFlagIcon,
  JPFlagIcon,
  KEFlagIcon,
  ZAFlagIcon,
  BRFlagIcon,
  GHFlagIcon,
  EGFlagIcon,
  CHFlagIcon,
  AEFlagIcon,
} from "@/components/ui/flag-icons";
import { Clock } from "lucide-react";

interface CurrencyItem {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  status: "active" | "coming_soon";
  flag: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconText: string;
  symbol: string;
}

const activeCurrencies: CurrencyItem[] = [
  {
    code: "USDC",
    name: "USD COIN",
    country: "United States",
    countryCode: "US",
    status: "active",
    flag: USFlagIcon,
    iconBg: "bg-blue-500",
    iconText: "text-white",
    symbol: "$",
  },
  {
    code: "USDT",
    name: "USD TETHER",
    country: "Global Stable",
    countryCode: "GLOBAL",
    status: "active",
    flag: USFlagIcon,
    iconBg: "bg-emerald-500",
    iconText: "text-white",
    symbol: "₮",
  },
  {
    code: "cNGN",
    name: "COMPLIANT NAIRA",
    country: "Nigeria",
    countryCode: "NG",
    status: "active",
    flag: NGFlagIcon,
    iconBg: "bg-indigo-600",
    iconText: "text-white",
    symbol: "₦",
  },
  {
    code: "ZARP",
    name: "ZARP STABLECOIN",
    country: "South Africa",
    countryCode: "ZA",
    status: "active",
    flag: ZAFlagIcon,
    iconBg: "bg-teal-600",
    iconText: "text-white",
    symbol: "z",
  },
  {
    code: "EURC",
    name: "EURO COIN",
    country: "European Union",
    countryCode: "EU",
    status: "active",
    flag: EUFlagIcon,
    iconBg: "bg-sky-600",
    iconText: "text-white",
    symbol: "€",
  },
  {
    code: "BRLA",
    name: "BRAZIL REAL",
    country: "Brazil",
    countryCode: "BR",
    status: "active",
    flag: BRFlagIcon,
    iconBg: "bg-lime-600",
    iconText: "text-white",
    symbol: "R$",
  },
];

const upcomingCurrencies: CurrencyItem[] = [
  {
    code: "NTZS",
    name: "TANZANIAN SHILLING",
    country: "Tanzania",
    countryCode: "TZ",
    status: "coming_soon",
    flag: TZFlagIcon,
    iconBg: "bg-sky-500/20",
    iconText: "text-sky-600",
    symbol: "TSh",
  },
  {
    code: "KESX",
    name: "KENYAN SHILLING",
    country: "Kenya",
    countryCode: "KE",
    status: "coming_soon",
    flag: KEFlagIcon,
    iconBg: "bg-rose-500/20",
    iconText: "text-rose-600",
    symbol: "KSh",
  },
  {
    code: "EGPX",
    name: "EGYPTIAN POUND",
    country: "Egypt",
    countryCode: "EG",
    status: "coming_soon",
    flag: EGFlagIcon,
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-600",
    symbol: "E£",
  },
  {
    code: "GHSX",
    name: "GHANAIAN CEDI",
    country: "Ghana",
    countryCode: "GH",
    status: "coming_soon",
    flag: GHFlagIcon,
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-600",
    symbol: "GH₵",
  },
];

const countryFlags = [
  { name: "Tanzania", code: "TZ", Flag: TZFlagIcon, currency: "NTZS" },
  { name: "Canada", code: "CA", Flag: CAFlagIcon, currency: "CADC" },
  { name: "Nigeria", code: "NG", Flag: NGFlagIcon, currency: "cNGN" },
  { name: "United States", code: "US", Flag: USFlagIcon, currency: "USDC" },
  { name: "United Kingdom", code: "GB", Flag: UKFlagIcon, currency: "GBPT" },
  { name: "Uruguay", code: "UY", Flag: UYFlagIcon, currency: "UYU" },
  { name: "Japan", code: "JP", Flag: JPFlagIcon, currency: "JPYC" },
  { name: "Kenya", code: "KE", Flag: KEFlagIcon, currency: "KESX" },
  { name: "South Africa", code: "ZA", Flag: ZAFlagIcon, currency: "ZARP" },
  { name: "Brazil", code: "BR", Flag: BRFlagIcon, currency: "BRLA" },
  { name: "Ghana", code: "GH", Flag: GHFlagIcon, currency: "GHSX" },
  { name: "Egypt", code: "EG", Flag: EGFlagIcon, currency: "EGPX" },
  { name: "Switzerland", code: "CH", Flag: CHFlagIcon, currency: "CHFC" },
  { name: "United Arab Emirates", code: "AE", Flag: AEFlagIcon, currency: "AEDT" },
];

export default function OperatingFrontiers() {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  return (
    <section id="operating-frontiers" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-brand-purple/10 via-[#EEF8A8]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[450px] h-[350px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Context, Narrative & Interactive Flag Ribbon */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="mb-6">
              <SectionCard title="OPERATING FRONTIERS" category="GLOBAL LIQUIDITY" variant="yellow" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 tracking-tight leading-[1.1] mb-6">
              Our <span className="text-brand-purple">Operating</span> <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-purple via-indigo-600 to-[#788406] bg-clip-text text-transparent">
                Frontiers
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-zinc-600 font-sans leading-relaxed max-w-xl mb-10">
              We&lsquo;re on a mission to support the world&lsquo;s hardest-to-reach currencies and emerging market economies with instant stablecoin liquidity, virtual bank accounts, and seamless multi-currency rails.
            </p>

            {/* Interactive Flag Strip Container */}
            <div className="w-full relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Supported & Upcoming Corridors
                </span>
                <span className="h-1 w-1 rounded-full bg-[#B0BE19]" />
                <span className="text-[11px] font-mono font-medium text-[#556000] bg-[#EEF8A8]/80 px-2 py-0.5 rounded-md border border-[#D0E244]/80">
                  Global Reach
                </span>
              </div>

              {/* Flag Row with smooth horizontal scroll & soft glow */}
              <div className="relative w-full rounded-2xl bg-white/80 border border-zinc-200/90 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1 px-1">
                  {countryFlags.map((country) => {
                    const isSelected = selectedCurrency === country.currency;
                    return (
                      <button
                        key={country.code}
                        onClick={() => setSelectedCurrency(isSelected ? null : country.currency)}
                        className={`group relative flex flex-col items-center gap-1.5 shrink-0 transition-all duration-300 cursor-pointer ${
                          isSelected ? "scale-115 z-20" : "hover:scale-110 hover:-translate-y-0.5"
                        }`}
                        title={`${country.name} (${country.currency})`}
                      >
                        <div className={`p-0.5 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "ring-3 ring-brand-purple ring-offset-2 shadow-md bg-brand-purple/10"
                            : "group-hover:ring-2 group-hover:ring-[#B0BE19] group-hover:ring-offset-1"
                        }`}>
                          <country.Flag className="w-9 h-9 sm:w-10 sm:h-10" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold transition-colors ${
                          isSelected ? "text-brand-purple" : "text-zinc-500 group-hover:text-zinc-900"
                        }`}>
                          {country.code}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Left/Right Subtle Fade Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none rounded-l-2xl" />
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-2xl" />
              </div>

              <p className="mt-3 text-xs text-zinc-400 font-sans">
                Select any jurisdiction above to filter corresponding settlement corridors.
              </p>
            </div>
          </div>

          {/* Right Column: Soft UI Coordinate Matrix Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[500px] rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(70,73,214,0.12)] flex flex-col gap-6">
              
              {/* 3D Coordinate Particle Dome Graphic */}
              <GlobeDome />

              {/* Active Currencies Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-[#EEF8A8]/90 text-[#556000] border border-[#D0E244]/80 shadow-2xs flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#839105] animate-pulse" />
                    ACTIVE
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Live Multi-Chain Settlement
                  </span>
                </div>

                {/* Active Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {activeCurrencies.map((curr) => {
                    const isHighlighted = selectedCurrency === curr.code;
                    return (
                      <div
                        key={curr.code}
                        onClick={() => setSelectedCurrency(isHighlighted ? null : curr.code)}
                        className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isHighlighted
                            ? "bg-brand-purple/5 border-brand-purple shadow-sm scale-[1.02]"
                            : "bg-zinc-50/70 border-zinc-200/80 hover:bg-white hover:border-zinc-300 hover:shadow-xs"
                        }`}
                      >
                        {/* Token / Currency Icon Badge */}
                        <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ${curr.iconBg} ${curr.iconText} flex items-center justify-center font-mono text-xs font-bold shadow-xs shrink-0`}>
                          {curr.symbol}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-mono font-extrabold text-zinc-950 truncate leading-tight">
                            {curr.code}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
                            {curr.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coming Soon Currencies Section */}
              <div className="flex flex-col gap-3 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-purple-50 text-brand-purple border border-purple-200/80 shadow-2xs flex items-center gap-1.5">
                    <Clock size={11} className="text-brand-purple" />
                    COMING SOON
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Emerging Corridors
                  </span>
                </div>

                {/* Coming Soon Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {upcomingCurrencies.map((curr) => {
                    const isHighlighted = selectedCurrency === curr.code;
                    return (
                      <div
                        key={curr.code}
                        onClick={() => setSelectedCurrency(isHighlighted ? null : curr.code)}
                        className={`flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isHighlighted
                            ? "bg-brand-purple/5 border-brand-purple shadow-sm scale-[1.02]"
                            : "bg-zinc-50/50 border-zinc-200/60 hover:bg-white hover:border-zinc-300"
                        }`}
                      >
                        {/* Token Badge */}
                        <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-700 flex items-center justify-center font-mono text-[11px] font-bold shrink-0`}>
                          {curr.symbol}
                        </div>

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-mono font-extrabold text-zinc-800 truncate leading-tight">
                            {curr.code}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400 truncate">
                            {curr.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
