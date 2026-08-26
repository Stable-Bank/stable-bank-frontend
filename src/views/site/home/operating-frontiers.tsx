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
import {
  USDCIcon,
  USDTIcon,
  EURCIcon,
  PYUSDIcon,
  DAIIcon,
  USDBIcon,
  CNGNIcon,
  BRLAIcon,
  ZARPIcon,
  NTZSIcon,
  KESXIcon,
  EGPXIcon,
  GHSXIcon,
} from "@/components/ui/token-icons";
import { Clock, ShieldCheck, Zap } from "lucide-react";

interface CurrencyItem {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  status: "active" | "coming_soon";
  rail: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  flag: React.ComponentType<{ className?: string }>;
}

// Exact Bridge.xyz supported native stablecoins & fiat on-ramps
const activeCurrencies: CurrencyItem[] = [
  {
    code: "USDC",
    name: "USD Coin (Circle)",
    country: "United States",
    countryCode: "US",
    status: "active",
    rail: "EVM, Solana, Base, Stellar",
    Icon: USDCIcon,
    flag: USFlagIcon,
  },
  {
    code: "USDT",
    name: "Tether USD",
    country: "Global Stable",
    countryCode: "GLOBAL",
    status: "active",
    rail: "Tron, Ethereum, Polygon, BSC",
    Icon: USDTIcon,
    flag: USFlagIcon,
  },
  {
    code: "EURC",
    name: "Euro Coin (Circle)",
    country: "European Union",
    countryCode: "EU",
    status: "active",
    rail: "SEPA, Base, Ethereum",
    Icon: EURCIcon,
    flag: EUFlagIcon,
  },
  {
    code: "PYUSD",
    name: "PayPal USD",
    country: "United States",
    countryCode: "US",
    status: "active",
    rail: "Ethereum, Solana",
    Icon: PYUSDIcon,
    flag: USFlagIcon,
  },
  {
    code: "DAI",
    name: "Sky / MakerDAO",
    country: "Global DeFi",
    countryCode: "GLOBAL",
    status: "active",
    rail: "Ethereum, Arbitrum, Optimism",
    Icon: DAIIcon,
    flag: USFlagIcon,
  },
  {
    code: "USDb",
    name: "Bridge Sovereign Dollar",
    country: "Bridge Native",
    countryCode: "BRIDGE",
    status: "active",
    rail: "Bridge Liquidity Network",
    Icon: USDBIcon,
    flag: USFlagIcon,
  },
  {
    code: "cNGN",
    name: "Compliant Naira",
    country: "Nigeria",
    countryCode: "NG",
    status: "active",
    rail: "NIBSS, Base, Ethereum",
    Icon: CNGNIcon,
    flag: NGFlagIcon,
  },
  {
    code: "BRLA",
    name: "Brazilian Real Stable",
    country: "Brazil",
    countryCode: "BR",
    status: "active",
    rail: "Pix Instant Rails",
    Icon: BRLAIcon,
    flag: BRFlagIcon,
  },
  {
    code: "ZARP",
    name: "South African Rand",
    country: "South Africa",
    countryCode: "ZA",
    status: "active",
    rail: "SARB Interbank",
    Icon: ZARPIcon,
    flag: ZAFlagIcon,
  },
];

const upcomingCurrencies: CurrencyItem[] = [
  {
    code: "NTZS",
    name: "Tanzanian Shilling",
    country: "Tanzania",
    countryCode: "TZ",
    status: "coming_soon",
    rail: "East Africa Hub",
    Icon: NTZSIcon,
    flag: TZFlagIcon,
  },
  {
    code: "KESX",
    name: "Kenyan Shilling",
    country: "Kenya",
    countryCode: "KE",
    status: "coming_soon",
    rail: "M-Pesa Connected",
    Icon: KESXIcon,
    flag: KEFlagIcon,
  },
  {
    code: "EGPX",
    name: "Egyptian Pound",
    country: "Egypt",
    countryCode: "EG",
    status: "coming_soon",
    rail: "North Africa Corridor",
    Icon: EGPXIcon,
    flag: EGFlagIcon,
  },
  {
    code: "GHSX",
    name: "Ghanaian Cedi",
    country: "Ghana",
    countryCode: "GH",
    status: "coming_soon",
    rail: "West Africa Gateway",
    Icon: GHSXIcon,
    flag: GHFlagIcon,
  },
];

const countryFlags = [
  { name: "Tanzania", code: "TZ", Flag: TZFlagIcon, currency: "NTZS", region: "East Africa" },
  { name: "Canada", code: "CA", Flag: CAFlagIcon, currency: "USDC", region: "North America" },
  { name: "Nigeria", code: "NG", Flag: NGFlagIcon, currency: "cNGN", region: "West Africa" },
  { name: "United States", code: "US", Flag: USFlagIcon, currency: "USDC", region: "Americas" },
  { name: "United Kingdom", code: "GB", Flag: UKFlagIcon, currency: "USDC", region: "Europe" },
  { name: "Uruguay", code: "UY", Flag: UYFlagIcon, currency: "USDT", region: "Latin America" },
  { name: "Japan", code: "JP", Flag: JPFlagIcon, currency: "USDC", region: "Asia Pacific" },
  { name: "Kenya", code: "KE", Flag: KEFlagIcon, currency: "KESX", region: "East Africa" },
  { name: "South Africa", code: "ZA", Flag: ZAFlagIcon, currency: "ZARP", region: "Southern Africa" },
  { name: "Brazil", code: "BR", Flag: BRFlagIcon, currency: "BRLA", region: "South America" },
  { name: "Ghana", code: "GH", Flag: GHFlagIcon, currency: "GHSX", region: "West Africa" },
  { name: "Egypt", code: "EG", Flag: EGFlagIcon, currency: "EGPX", region: "North Africa" },
  { name: "Switzerland", code: "CH", Flag: CHFlagIcon, currency: "EURC", region: "Europe" },
  { name: "United Arab Emirates", code: "AE", Flag: AEFlagIcon, currency: "USDT", region: "Middle East" },
];

export default function OperatingFrontiers() {
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<typeof countryFlags[0] | null>(null);

  // Duplicate for smooth seamless loop
  const duplicatedFlags = [...countryFlags, ...countryFlags];

  return (
    <section id="operating-frontiers" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-brand-purple/10 via-[#EEF8A8]/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[400px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Mission Context & Animated Loop Flag Ribbon */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="mb-6">
              <SectionCard title="OPERATING FRONTIERS" category="GLOBAL LIQUIDITY" variant="yellow" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 tracking-tight leading-[1.08] mb-6">
              Our <span className="text-brand-purple">Operating</span> <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-brand-purple via-indigo-600 to-[#788406] bg-clip-text text-transparent">
                Frontiers
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-zinc-600 font-sans leading-relaxed max-w-xl mb-8">
              We&lsquo;re on a mission to support the world&lsquo;s hardest-to-reach currencies. Powered by Bridge.xyz orchestration, StableBank unlocks instant fiat off-ramps, named virtual IBANs, and deep stablecoin liquidity across emerging markets.
            </p>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 gap-3.5 mb-8 w-full max-w-lg">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-zinc-200/80 shadow-xs backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="text-xs font-sans font-bold text-zinc-900 block leading-tight">Instant Settlement</span>
                  <span className="text-[10px] font-mono text-zinc-400">Zero FX slippage</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-zinc-200/80 shadow-xs backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000] shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <span className="text-xs font-sans font-bold text-zinc-900 block leading-tight">Bridge.xyz Verified</span>
                  <span className="text-[10px] font-mono text-zinc-400">10+ Global Blockchains</span>
                </div>
              </div>
            </div>

            {/* Interactive Flag Animated Ribbon */}
            <div className="w-full relative">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                  Supported & Emerging Corridors
                </span>
                {hoveredCountry ? (
                  <span className="text-[11px] font-mono font-bold text-brand-purple bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full animate-in fade-in">
                    {hoveredCountry.name} ({hoveredCountry.currency}) • {hoveredCountry.region}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-medium text-[#556000] bg-[#EEF8A8]/80 px-2 py-0.5 rounded-md border border-[#D0E244]/80">
                    Auto-Scrolling Corridor
                  </span>
                )}
              </div>

              {/* Looping Flag Track */}
              <div className="relative w-full rounded-2xl bg-white/90 border border-zinc-200/90 p-4 shadow-sm backdrop-blur-md overflow-hidden group">
                <div className="flex items-center gap-4 animate-marquee group-hover:[animation-play-state:paused] w-max py-1">
                  {duplicatedFlags.map((country, idx) => {
                    const isSelected = selectedCurrency === country.currency;
                    return (
                      <button
                        key={`${country.code}-${idx}`}
                        onClick={() => setSelectedCurrency(isSelected ? null : country.currency)}
                        onMouseEnter={() => setHoveredCountry(country)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        className={`group/flag relative flex flex-col items-center gap-1.5 shrink-0 transition-all duration-300 cursor-pointer ${
                          isSelected ? "scale-120 z-20" : "hover:scale-115 hover:-translate-y-1"
                        }`}
                        title={`${country.name} (${country.currency})`}
                      >
                        <div className={`p-0.5 rounded-full transition-all duration-300 ${
                          isSelected
                            ? "ring-3 ring-brand-purple ring-offset-2 shadow-md bg-brand-purple/10"
                            : "group-hover/flag:ring-2 group-hover/flag:ring-[#B0BE19] group-hover/flag:ring-offset-1"
                        }`}>
                          <country.Flag className="w-9 h-9 sm:w-10 sm:h-10" />
                        </div>
                        <span className={`text-[10px] font-mono font-bold transition-colors ${
                          isSelected ? "text-brand-purple" : "text-zinc-500 group-hover/flag:text-zinc-950"
                        }`}>
                          {country.code}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Left/Right Subtle Fade Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none rounded-l-2xl z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none rounded-r-2xl z-10" />
              </div>

              <p className="mt-3 text-xs text-zinc-400 font-sans">
                Hover or click any country above to highlight its settlement stablecoin on the corridor matrix.
              </p>
            </div>
          </div>

          {/* Right Column: Soft Claymorphic Coordinate & Currency Matrix Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-[520px] rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-7 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(70,73,214,0.12)] flex flex-col gap-5">
              
              {/* 3D Coordinate Particle Dome Graphic */}
              <GlobeDome />

              {/* Active Bridge.xyz Stablecoins Section */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-[#EEF8A8]/90 text-[#556000] border border-[#D0E244]/80 shadow-2xs flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#839105] animate-pulse" />
                    ACTIVE CORRIDORS
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Bridge.xyz Supported
                  </span>
                </div>

                {/* Active Grid (Bridge Supported Tokens) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {activeCurrencies.map((curr) => {
                    const isHighlighted = selectedCurrency === curr.code;
                    return (
                      <div
                        key={curr.code}
                        onClick={() => setSelectedCurrency(isHighlighted ? null : curr.code)}
                        className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isHighlighted
                            ? "bg-brand-purple/10 border-brand-purple shadow-sm scale-[1.03]"
                            : "bg-zinc-50/80 border-zinc-200/80 hover:bg-white hover:border-zinc-300 hover:shadow-xs"
                        }`}
                      >
                        {/* Token Icon */}
                        <curr.Icon size={26} className="shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs sm:text-sm font-mono font-extrabold text-zinc-950 truncate leading-tight">
                            {curr.code}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 truncate leading-none mt-0.5">
                            {curr.name.split(" ")[0]}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coming Soon Currencies Section */}
              <div className="flex flex-col gap-3 pt-3 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase bg-purple-50 text-brand-purple border border-purple-200/80 shadow-2xs flex items-center gap-1.5">
                    <Clock size={11} className="text-brand-purple" />
                    COMING SOON
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Emerging Frontiers
                  </span>
                </div>

                {/* Coming Soon Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {upcomingCurrencies.map((curr) => {
                    const isHighlighted = selectedCurrency === curr.code;
                    return (
                      <div
                        key={curr.code}
                        onClick={() => setSelectedCurrency(isHighlighted ? null : curr.code)}
                        className={`flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isHighlighted
                            ? "bg-brand-purple/10 border-brand-purple shadow-sm scale-[1.03]"
                            : "bg-zinc-50/50 border-zinc-200/60 hover:bg-white hover:border-zinc-300"
                        }`}
                      >
                        <curr.Icon size={24} className="shrink-0" />

                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-mono font-extrabold text-zinc-800 truncate leading-tight">
                            {curr.code}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-400 truncate">
                            {curr.country}
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
