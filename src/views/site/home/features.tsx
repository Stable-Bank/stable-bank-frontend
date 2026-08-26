"use client";

import { cn } from "@/utils/cn";
import {
    Wallet,
    Send,
    CreditCard,
    Shield,
    TrendingUp,
    CheckCircle2,
    Sparkles,
    Building2
} from "lucide-react";
import React, { useState } from "react";
import SectionCard from "@/components/cards/section";
import { 
    USDCIcon, 
    USDTIcon, 
    EURCIcon, 
    PYUSDIcon 
} from "@/components/ui/token-icons";
import { USFlagIcon, EUFlagIcon } from "@/components/ui/flag-icons";

export default function Features() {
    const [activeCurrency, setActiveCurrency] = useState<"USDC" | "EURC" | "USDT" | "PYUSD">("USDC");

    const currencyData = {
        USDC: { 
            name: "USD Coin (Circle)", 
            balance: "$48,920.50", 
            rate: "1.00 USD", 
            apy: "+5.2% APY", 
            fill: "w-[85%]",
            chains: "Base · Solana · Ethereum",
            Icon: USDCIcon
        },
        EURC: { 
            name: "Euro Coin (Circle)", 
            balance: "€32,450.00", 
            rate: "1.08 USD", 
            apy: "+4.1% APY", 
            fill: "w-[60%]",
            chains: "Base · Ethereum · Avalanche",
            Icon: EURCIcon
        },
        USDT: { 
            name: "Tether USD", 
            balance: "$18,100.25", 
            rate: "1.00 USD", 
            apy: "+5.2% APY", 
            fill: "w-[45%]",
            chains: "Tron · BSC · Polygon",
            Icon: USDTIcon
        },
        PYUSD: { 
            name: "PayPal USD", 
            balance: "$12,300.00", 
            rate: "1.00 USD", 
            apy: "+4.9% APY", 
            fill: "w-[35%]",
            chains: "Ethereum · Solana",
            Icon: PYUSDIcon
        },
    };

    const currentToken = currencyData[activeCurrency];

    return (
        <section id="features" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-500/10 via-[#EEF8A8]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-largest mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
                    <div className="mb-6">
                        <SectionCard title="Powerful Features" category="CAPABILITIES" variant="yellow" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 mb-4 sm:mb-6 leading-tight">
                        Everything You Need to{" "}
                        <span className="text-brand-purple">Bank Smarter</span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-sans">
                        Experience next-generation stablecoin banking powered by Bridge.xyz orchestration, deep liquidity, and institutional security.
                    </p>
                </div>

                {/* Bento Grid Matrix Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Bento Tile 1: Multi-Currency Super-Wallet (Span 2 on lg) */}
                    <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50/60 to-purple-50/20 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple shadow-2xs">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#EEF8A8]/90 border border-[#D0E244]/80 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#556000]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#839105] animate-pulse" />
                                    <span>Bridge Orchestrated</span>
                                </div>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 mb-2">
                                All-in-One Digital Dollar Account
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans max-w-xl mb-6">
                                Hold, convert, and manage USDC, USDT, EURC, and PYUSD in a single multi-chain balance. Auto-convert incoming deposits with zero slippage.
                            </p>
                        </div>

                        {/* Interactive Wallet Mini-Ledger Preview */}
                        <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 sm:p-6 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                                {/* Token Selector with Authentic Logos */}
                                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                    {(["USDC", "EURC", "USDT", "PYUSD"] as const).map((curr) => {
                                        const ItemIcon = currencyData[curr].Icon;
                                        const isActive = activeCurrency === curr;
                                        return (
                                            <button
                                                key={curr}
                                                type="button"
                                                onClick={() => setActiveCurrency(curr)}
                                                className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border",
                                                    isActive
                                                        ? "bg-brand-purple text-white border-brand-purple shadow-xs"
                                                        : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                                                )}
                                            >
                                                <ItemIcon size={16} />
                                                <span>{curr}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-1.5 bg-[#F5FACD] border border-[#D9E956]/70 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-[#556000]">
                                    <TrendingUp size={13} className="text-[#839105]" />
                                    <span>{currentToken.apy}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-baseline justify-between pt-2 border-t border-zinc-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <currentToken.Icon size={20} />
                                        <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Indexed Balance</span>
                                    </div>
                                    <h4 className="text-3xl font-mono font-black text-zinc-950 tracking-tight mt-1">
                                        {currentToken.balance}
                                    </h4>
                                </div>
                                <div className="sm:text-right">
                                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Connected Blockchains</span>
                                    <p className="text-xs sm:text-sm font-mono font-bold text-zinc-700 mt-1">
                                        {currentToken.chains}
                                    </p>
                                </div>
                            </div>

                            {/* Weight Distribution Bar */}
                            <div className="mt-4 h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className={cn("h-full bg-gradient-to-r from-brand-purple via-[#B0BE19] to-emerald-500 rounded-full transition-all duration-500", currentToken.fill)} />
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 2: Instant P2P & Cross-Border Transfers */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-[#B0BE19]/60 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
                                    <Send className="h-6 w-6" />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-[#556000] bg-[#EEF8A8]/80 px-2.5 py-1 rounded-full border border-[#D0E244]/80">
                                    Sub-Second Finality
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                                Instant Global Transfers
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Send stables globally via $banktag handles or wallet addresses with near-zero gas fees.
                            </p>
                        </div>

                        {/* Transfer Flow Simulation Tile */}
                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-bold text-zinc-800">$timmy.sol</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Settle Instant
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-2xs">
                                <div className="flex items-center gap-2">
                                    <USDCIcon size={18} />
                                    <span className="text-sm font-mono font-black text-zinc-950">5,000.00 USDC</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">Fee: $0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 3: Virtual & Physical Debit Cards */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                                    Instant Visa
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                                Spend Anywhere
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Create instant virtual cards or metal cards to spend USDT and USDC at 100M+ merchants worldwide.
                            </p>
                        </div>

                        {/* Mini Metal Card Mockup */}
                        <div className="rounded-2xl bg-gradient-to-br from-[#1E1B2E] via-[#0F0E17] to-[#161520] p-4 text-white shadow-md border border-zinc-800">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-mono font-bold tracking-wider text-white/60">STABLEBANK</span>
                                <span className="text-[9px] font-mono font-bold bg-[#EEF8A8] text-zinc-950 px-1.5 py-0.5 rounded">VISA ACTIVE</span>
                            </div>
                            <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">•••• •••• •••• 8492</p>
                            <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-zinc-400">
                                <span>EXP: 12/30</span>
                                <span className="font-bold text-[#E8F2A2]">3% CASHBACK</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 4: High-Yield Safelock & Vaults (Span 2 on lg) */}
                    <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-[#F9FCED]/50 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-[#B0BE19]/60 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
                                    <Sparkles className="h-6 w-6 text-[#839105]" />
                                </div>
                                <span className="text-xs font-mono font-bold text-[#556000] bg-[#EEF8A8]/90 px-3 py-1 rounded-full border border-[#D0E244]/80">
                                    Up to 12.0% Fixed APY
                                </span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 mb-2">
                                Automated High-Yield Savings
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans max-w-xl mb-6">
                                Grow your holdings automatically with daily compounding interest, fixed-term deposits, and smart savings goals.
                            </p>
                        </div>

                        {/* Staking Tiers Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center shadow-2xs">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Flex Savings</span>
                                <p className="text-lg sm:text-xl font-mono font-black text-zinc-950 mt-1">5.2%</p>
                                <span className="text-[10px] text-zinc-500 font-sans">Daily Compounding</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-[#D0E244]/80 bg-[#F5FACD]/30 text-center shadow-2xs">
                                <span className="text-[10px] font-mono font-bold text-[#556000] uppercase">Target Goal</span>
                                <p className="text-lg sm:text-xl font-mono font-black text-[#556000] mt-1">8.5%</p>
                                <span className="text-[10px] text-[#556000] font-sans font-medium">Autosave Milestones</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-brand-purple/30 bg-purple-50/40 text-center shadow-2xs">
                                <span className="text-[10px] font-mono font-bold text-brand-purple uppercase">Safelock</span>
                                <p className="text-lg sm:text-xl font-mono font-black text-brand-purple mt-1">12.0%</p>
                                <span className="text-[10px] text-zinc-500 font-sans">Fixed Guaranteed</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 5: Named Virtual Accounts & Banking Rails */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-brand-purple bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                    USD · EUR · GBP
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                                Named Virtual IBANs
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Dedicated account numbers issued under your legal name. Receive Wire, ACH, and SEPA deposits directly into stables.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-2 text-xs font-mono">
                            <div className="flex items-center justify-between text-zinc-700">
                                <span className="flex items-center gap-1.5"><USFlagIcon className="w-3.5 h-3.5" /> US ACH & Wire</span>
                                <span className="text-emerald-600 font-bold">1:1 PARITY</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-700">
                                <span className="flex items-center gap-1.5"><EUFlagIcon className="w-3.5 h-3.5" /> SEPA Instant</span>
                                <span className="text-emerald-600 font-bold">REAL-TIME</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 6: Enterprise Security & Compliance */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                    SOC 2 Type II
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-2">
                                Bank-Grade Protection
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Multi-Party Computation (MPC), automated Travel Rule compliance, and real-time fraud monitoring keep your funds safe 24/7.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-2 text-xs font-mono">
                            <div className="flex items-center justify-between text-zinc-600">
                                <span>Segregated Custody</span>
                                <span className="text-emerald-600 font-bold">ENFORCED</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-600">
                                <span>Fraud Prevention</span>
                                <span className="text-emerald-600 font-bold">ACTIVE 24/7</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
