"use client";

import { cn } from "@/utils/cn";
import {
    Wallet,
    Send,
    CreditCard,
    Gift,
    Shield,
    Globe,
    ArrowUpRight,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";
import React, { useState } from "react";
import SectionCard from "@/components/cards/section";

export default function Features() {
    const [activeCurrency, setActiveCurrency] = useState<"USDC" | "EURC" | "USDT">("USDC");

    const currencyBalances = {
        USDC: { balance: "$48,920.50", rate: "1.00 USD", apy: "+4.8% APY", fill: "w-[75%]" },
        EURC: { balance: "€32,450.00", rate: "1.08 USD", apy: "+3.9% APY", fill: "w-[55%]" },
        USDT: { balance: "$15,100.25", rate: "1.00 USD", apy: "+5.1% APY", fill: "w-[40%]" },
    };

    return (
        <section id="features" className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
            <div className="max-w-largest mx-auto relative">
                {/* Section Header */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
                    <div className="mb-6">
                        <SectionCard title="Powerful Features" category="CAPABILITIES" variant="yellow" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 mb-4 sm:mb-6">
                        Everything You Need to{" "}
                        <span className="text-brand-purple">Bank Smarter</span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl font-sans">
                        Experience the next generation of banking with powerful features
                        designed for the decentralized world.
                    </p>
                </div>

                {/* Bento Grid Matrix Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Bento Tile 1: Multi-Currency Super-Wallet (Span 2 on lg) */}
                    <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50/50 to-purple-50/30 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-brand-purple">
                                    <Wallet className="h-6 w-6" />
                                </div>
                                <div className="flex items-center gap-1.5 bg-[#EEF8A8]/80 border border-[#D0E244]/80 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#556000]">
                                    <span className="h-1.5 w-1.5 rounded-full bg-[#839105]" />
                                    <span>Multi-Ledger Verified</span>
                                </div>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-zinc-950 mb-3">
                                Multi-Currency Wallet
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans max-w-xl mb-6">
                                Store USDC, USDT, DAI, and more stablecoins all in one secure, decentralized wallet.
                            </p>
                        </div>

                        {/* Interactive Wallet Mini-Ledger Preview */}
                        <div className="rounded-2xl bg-white border border-zinc-200/90 p-5 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    {(["USDC", "EURC", "USDT"] as const).map((curr) => (
                                        <button
                                            key={curr}
                                            onClick={() => setActiveCurrency(curr)}
                                            className={cn(
                                                "px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer",
                                                activeCurrency === curr
                                                    ? "bg-brand-purple text-white shadow-xs"
                                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                            )}
                                        >
                                            {curr}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-2 bg-[#F5FACD] border border-[#D9E956]/70 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold text-[#556000]">
                                    <TrendingUp size={12} />
                                    <span>{currencyBalances[activeCurrency].apy}</span>
                                </div>
                            </div>

                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Live Indexed Balance</span>
                                    <h4 className="text-3xl font-mono font-black text-zinc-950 tracking-tight mt-0.5">
                                        {currencyBalances[activeCurrency].balance}
                                    </h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">Exchange Anchor</span>
                                    <p className="text-sm font-mono font-bold text-zinc-700 mt-0.5">
                                        1 {activeCurrency} ≈ {currencyBalances[activeCurrency].rate}
                                    </p>
                                </div>
                            </div>

                            {/* Weight bar */}
                            <div className="mt-4 h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div className={cn("h-full bg-gradient-to-r from-brand-purple via-[#B0BE19] to-emerald-500 rounded-full transition-all duration-500", currencyBalances[activeCurrency].fill)} />
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 2: Instant P2P Transfers */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-[#B0BE19]/60 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
                                    <Send className="h-6 w-6" />
                                </div>
                                <span className="text-[11px] font-mono font-bold text-[#556000] bg-[#EEF8A8]/80 px-2.5 py-1 rounded-full border border-[#D0E244]/80">
                                    0.00s Latency
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">
                                Instant Transfers
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Send stablecoins globally in seconds with near-zero fees. No borders, no delays.
                            </p>
                        </div>

                        {/* Interactive Transfer Flow Chip */}
                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-3">
                            <div className="flex items-center justify-between text-xs font-mono">
                                <span className="font-bold text-zinc-700">$alex.vance</span>
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Sent Instant
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-3 py-2">
                                <span className="text-sm font-mono font-black text-zinc-950">$5,000.00 USDT</span>
                                <span className="text-[10px] font-mono font-bold text-zinc-400">Fee: $0.00</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 3: Virtual Cards */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-zinc-900 text-white">
                                    Visa Gold
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">
                                Virtual Cards
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Spend your crypto anywhere with our virtual cards. Seamless online shopping experience.
                            </p>
                        </div>

                        {/* Mini Metal Card Mockup */}
                        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 text-white shadow-md border border-zinc-800">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-mono text-zinc-400">STABLEBANK DEBIT</span>
                                <span className="text-[9px] font-mono font-bold bg-[#EEF8A8] text-zinc-950 px-1.5 py-0.5 rounded">ONLINE</span>
                            </div>
                            <p className="font-mono text-xs font-bold tracking-widest text-zinc-200">•••• •••• •••• 9012</p>
                            <div className="flex justify-between items-center mt-3 text-[10px] font-mono text-zinc-400">
                                <span>EXP: 08/29</span>
                                <span className="font-bold text-[#E8F2A2]">3% CASHBACK</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 4: Earn Rewards (Span 2 on lg) */}
                    <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-gradient-to-br from-white via-zinc-50 to-[#F9FCED]/50 p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-[#B0BE19]/60 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000]">
                                    <Gift className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-mono font-bold text-[#556000] bg-[#EEF8A8]/80 px-3 py-1 rounded-full border border-[#D0E244]/80">
                                    Up to 22.0% APY
                                </span>
                            </div>

                            <h3 className="text-2xl font-display font-bold text-zinc-950 mb-3">
                                Earn Rewards
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans max-w-xl mb-6">
                                Get rewarded for holding stables. Earn competitive yields on your digital assets.
                            </p>
                        </div>

                        {/* Staking Tiers Micro Indicator */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 text-center">
                                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Flex Wallet</span>
                                <p className="text-lg font-mono font-black text-zinc-950 mt-1">12.0%</p>
                                <span className="text-[10px] text-zinc-500 font-sans">No lockup</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-[#D0E244]/80 bg-[#F5FACD]/30 text-center">
                                <span className="text-[10px] font-mono font-bold text-[#556000] uppercase">Target Savings</span>
                                <p className="text-lg font-mono font-black text-[#556000] mt-1">18.0%</p>
                                <span className="text-[10px] text-[#556000] font-sans font-medium">Monthly Goal</span>
                            </div>
                            <div className="p-3.5 rounded-xl bg-white border border-brand-purple/30 bg-purple-50/40 text-center">
                                <span className="text-[10px] font-mono font-bold text-brand-purple uppercase">SafeLock Vault</span>
                                <p className="text-lg font-mono font-black text-brand-purple mt-1">22.0%</p>
                                <span className="text-[10px] text-zinc-500 font-sans">Fixed Yield</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 5: Bank-Grade Security */}
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

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">
                                Bank-Grade Security
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Enterprise-level encryption and multi-sig protection keep your assets safe 24/7.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 space-y-2 text-xs font-mono">
                            <div className="flex items-center justify-between text-zinc-600">
                                <span>Segregated MPC Vaults</span>
                                <span className="text-emerald-600 font-bold">ACTIVE</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-600">
                                <span>Multi-Signature Ledger</span>
                                <span className="text-emerald-600 font-bold">4 of 5 SIGNERS</span>
                            </div>
                        </div>
                    </div>

                    {/* Bento Tile 6: Global Access */}
                    <div className="rounded-3xl border border-zinc-200 bg-white p-7 sm:p-9 shadow-sm hover:shadow-md hover:border-indigo-400/40 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-brand-purple">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-brand-purple bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                    120+ Countries
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">
                                Global Access
                            </h3>
                            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-sans mb-6">
                                Bank without borders. Access your funds from anywhere in the world, anytime.
                            </p>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 text-xs font-mono font-bold text-zinc-700">
                            <span>Direct Settlement Rails</span>
                            <span className="text-brand-purple flex items-center gap-1">
                                USD · EUR · GBP <ArrowUpRight size={14} />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
