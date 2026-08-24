"use client";

import React, { useState } from "react";
import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import InstitutionsWaitlistForm from "@/components/forms/institutions-waitlist";
import { cn } from "@/utils/cn";
import {
    ArrowRight,
    LineChart,
    Lock,
    Percent,
    Zap,
    Briefcase,
    Cpu,
    Wallet,
    Layers,
    Network,
    Building2,
    TrendingUp,
    Rocket,
    Globe,
    CheckCircle2,
    ShieldCheck,
    Terminal,
    Activity,
} from "lucide-react";

const capabilities = [
    {
        id: "trading",
        icon: LineChart,
        title: "Trading & Financing",
        tag: "DEEP LIQUIDITY",
        status: "RFQ & Limit Orders",
        description:
            "Access deep institutional liquidity and prime execution services. Secure flexible financing and credit lines optimized for digital assets.",
        metrics: [
            { label: "Execution Latency", val: "< 1.2ms" },
            { label: "Slippage Anchor", val: "0.01%" },
            { label: "Order Routing", val: "Smart DEX/CEX" },
        ],
        previewType: "trading",
    },
    {
        id: "custody",
        icon: Lock,
        title: "Custody & Token Management",
        tag: "QUALIFIED CUSTODY",
        status: "MPC Segregated Vaults",
        description:
            "Segregated multi-signature cold storage under a secure, regulated framework. Complete token management solutions from generation to vesting.",
        metrics: [
            { label: "Security Architecture", val: "MPC + SGX Enclave" },
            { label: "Insurance Coverage", val: "$250M Aggregate" },
            { label: "Signer Threshold", val: "4-of-7 Quorum" },
        ],
        previewType: "custody",
    },
    {
        id: "staking",
        icon: Percent,
        title: "Staking & Yield",
        tag: "PROTOCOL VALIDATION",
        status: "Insured Staking Rails",
        description:
            "Earn optimized yield and participate in protocol validation directly from your custody account. Insured, secure, and fully compliant staking.",
        metrics: [
            { label: "Average Validator APY", val: "5.8% – 9.2%" },
            { label: "Slashing Protection", val: "100% Insured" },
            { label: "Reward Distribution", val: "Compounded Daily" },
        ],
        previewType: "staking",
    },
    {
        id: "atlas",
        icon: Zap,
        title: "Atlas Settlement Network",
        tag: "ATOMIC CLEARING",
        status: "T+0 Instant Finality",
        description:
            "Execute atomic, instant settlements across digital and fiat pairs. Bypass correspondent bank chains and eliminate counterparty risk.",
        metrics: [
            { label: "Settlement Time", val: "0.00s Instant" },
            { label: "Supported Rails", val: "USD · EUR · GBP · USDC" },
            { label: "Counterparty Risk", val: "0% (Atomic DVP)" },
        ],
        previewType: "atlas",
    },
    {
        id: "wealth",
        icon: Briefcase,
        title: "Wealth Management Solutions",
        tag: "ADVISOR SUITE",
        status: "Unified Sub-Custody",
        description:
            "Empower your Registered Investment Advisors (RIAs) and wealth managers with robust client reporting, trading interfaces, and sub-custody.",
        metrics: [
            { label: "Client Reporting", val: "Automated Tax / PnL" },
            { label: "Hierarchy Access", val: "Role-Based RBAC" },
            { label: "API Integrations", val: "REST, FIX & Webhooks" },
        ],
        previewType: "wealth",
    },
    {
        id: "agentic",
        icon: Cpu,
        title: "Agentic Banking",
        tag: "AUTONOMOUS TREASURY",
        status: "Programmatic AI Rails",
        description:
            "Next-generation banking services designed for autonomous AI agents. Execute programmatic sweeps, payouts, and automated treasury routing.",
        metrics: [
            { label: "Programmatic Sweeps", val: "Event-Triggered" },
            { label: "AI Agent Signers", val: "Delegated Sub-Keys" },
            { label: "Audit Telemetry", val: "Cryptographic Log" },
        ],
        previewType: "agentic",
    },
];

const whoWeServe = [
    {
        icon: Wallet,
        title: "Asset Managers",
        category: "CAPITAL MANAGEMENT",
        badge: "Fund Operations",
        description: "Scale your digital asset offerings with robust trading, institutional custody, and unified reporting tools.",
    },
    {
        icon: Layers,
        title: "ETF Issuers",
        category: "INDEX PRODUCTS",
        badge: "High Throughput",
        description: "Power exchange-traded funds with institutional-grade custody, high-throughput redemption hooks, and secure staking.",
    },
    {
        icon: Briefcase,
        title: "Wealth Managers & RIAs",
        category: "ADVISORY SUITE",
        badge: "Client Reporting",
        description: "Deliver secure crypto portfolios, yield products, and clear tax reporting directly to your clients.",
    },
    {
        icon: Network,
        title: "Crypto Protocols & Foundations",
        category: "ECOSYSTEM RESERVES",
        badge: "TGE & Vesting",
        description: "Manage treasury reserves, coordinate token generation events (TGEs), and deploy secure validation nodes.",
    },
    {
        icon: Building2,
        title: "Corporations",
        category: "CORPORATE TREASURY",
        badge: "Global Payroll",
        description: "Unify supplier payments, deploy programmatic stablecoin payroll rails, and maximize corporate cash returns.",
    },
    {
        icon: TrendingUp,
        title: "Hedge Funds",
        category: "QUANT & MACRO",
        badge: "Prime Execution",
        description: "Leverage prime brokerage execution, deep orderbooks, high-speed API connections, and capital financing.",
    },
    {
        icon: Rocket,
        title: "VC Firms",
        category: "VENTURE ALLOCATIONS",
        badge: "Cap Table Vaults",
        description: "Secure early-stage token allocations, manage complex vesting schedules, and coordinate LP distributions.",
    },
    {
        icon: Globe,
        title: "Governments & Sovereigns",
        category: "SOVEREIGN INFRASTRUCTURE",
        badge: "Regulated Storage",
        description: "Leverage compliant custody, asset recovery flows, and high-security storage for sovereign operations.",
    },
];

export default function InstitutionsPage() {
    const [selectedCapability, setSelectedCapability] = useState(capabilities[0]);

    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative min-h-[75vh] flex items-center pt-16 pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
                        <SectionCard title="StableBank Institutions" category="PRIME" variant="emerald" />
                        <h1 className="mt-8 text-5xl sm:text-6xl md:text-8xl font-display font-black text-zinc-950 leading-[1.05] tracking-tight">
                            Engineered for scale. <br />
                            <span className="text-brand-purple">
                                Built for speed.
                            </span>
                        </h1>
                        <p className="mt-6 text-xl sm:text-2xl text-zinc-600 font-sans leading-relaxed max-w-2xl mx-auto">
                            The premier digital asset and settlement platform for modern institutions. <br className="hidden sm:block" />
                            Secure custody, atomic settlement, and agentic banking.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#waitlist" className="px-8 py-4 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-bold text-lg shadow-md shadow-brand-purple/20 transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                                Request Access <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 1: Core Capabilities - INTERACTIVE PRIME DESK TERMINAL */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-zinc-50/70 relative border-t border-zinc-200">
                <div className="max-w-largest mx-auto">
                    {/* Header */}
                    <div className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Institutional Infrastructure" category="INFRASTRUCTURE" variant="emerald" />
                        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-4">
                            Core Capabilities
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed">
                            Engineered to meet the stringent security, governance, and operational standards of global financial entities.
                        </p>
                    </div>

                    {/* Interactive Capability Deck & Terminal Matrix */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Capability Selector Tabs (5 Cols) */}
                        <div className="lg:col-span-5 flex flex-col gap-3">
                            {capabilities.map((cap) => {
                                const Icon = cap.icon;
                                const isSelected = selectedCapability.id === cap.id;
                                return (
                                    <button
                                        key={cap.id}
                                        onClick={() => setSelectedCapability(cap)}
                                        className={cn(
                                            "w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex items-start gap-4 cursor-pointer",
                                            isSelected
                                                ? "bg-white border-brand-purple shadow-md ring-1 ring-brand-purple/20"
                                                : "bg-white/60 border-zinc-200/80 hover:bg-white hover:border-zinc-300 shadow-xs"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300",
                                                isSelected
                                                    ? "bg-brand-purple text-white shadow-xs"
                                                    : "bg-zinc-100 text-zinc-600"
                                            )}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                                                    {cap.tag}
                                                </span>
                                                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    {cap.status}
                                                </span>
                                            </div>
                                            <h3 className="text-base sm:text-lg font-display font-bold text-zinc-950 truncate">
                                                {cap.title}
                                            </h3>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Interactive Prime Terminal Preview Pane (7 Cols) */}
                        <div className="lg:col-span-7 rounded-3xl bg-zinc-950 text-white p-7 sm:p-10 border border-zinc-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80">
                                <div className="flex items-center gap-2">
                                    <Terminal size={18} className="text-[#EEF8A8]" />
                                    <span className="text-xs font-mono font-bold tracking-widest text-zinc-300 uppercase">
                                        PRIME NODE // {selectedCapability.tag}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
                                    <Activity size={12} className="animate-pulse" />
                                    <span>REALTIME OPERATIONAL</span>
                                </div>
                            </div>

                            {/* Center Content */}
                            <div className="my-8 space-y-6">
                                <div>
                                    <span className="text-xs font-mono font-bold text-[#E8F2A2] uppercase tracking-wider">
                                        Selected Module
                                    </span>
                                    <h3 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
                                        {selectedCapability.title}
                                    </h3>
                                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mt-3 font-sans max-w-xl">
                                        {selectedCapability.description}
                                    </p>
                                </div>

                                {/* Architecture Telemetry Metric Matrix */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                                    {selectedCapability.metrics.map((m) => (
                                        <div key={m.label} className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                                            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                                                {m.label}
                                            </span>
                                            <span className="text-sm sm:text-base font-mono font-black text-white mt-1 block">
                                                {m.val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Terminal Action Strip */}
                            <div className="pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                                    <ShieldCheck size={16} className="text-emerald-400" />
                                    <span>SOC 2 Type II · Qualified MPC Custody</span>
                                </div>

                                <a
                                    href="#waitlist"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B0BE19] hover:bg-[#B0BE19]/90 text-zinc-950 font-bold text-xs font-sans transition-all shadow-md"
                                >
                                    <span>Deploy Module</span>
                                    <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Section 2: Powering Digital Asset Pioneers - CLIENTELE ECOSYSTEM GRID */}
            <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 bg-white relative overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10">
                    {/* Header */}
                    <div className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Who We Serve" category="CLIENTELE" variant="yellow" />
                        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-4">
                            Powering Digital Asset <span className="text-brand-purple">Pioneers</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-3xl mx-auto font-sans leading-relaxed">
                            From native crypto protocols and digital hedge funds to global corporations and sovereign wealth.
                        </p>
                    </div>

                    {/* Clientele Sector Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whoWeServe.map((serve) => {
                            const Icon = serve.icon;
                            return (
                                <div
                                    key={serve.title}
                                    className="group p-6 sm:p-7 rounded-3xl bg-zinc-50/80 border border-zinc-200/90 hover:bg-white hover:border-brand-purple/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between shadow-xs"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-brand-purple shadow-2xs group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-[#556000] bg-[#EEF8A8]/80 border border-[#D0E244]/80 px-2.5 py-1 rounded-full">
                                                {serve.badge}
                                            </span>
                                        </div>

                                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                                            {serve.category}
                                        </span>

                                        <h3 className="text-xl font-display font-bold text-zinc-950 mb-3">
                                            {serve.title}
                                        </h3>

                                        <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans mb-4">
                                            {serve.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-200/60 flex items-center gap-1.5 text-xs font-mono font-semibold text-brand-purple group-hover:translate-x-1 transition-transform">
                                        <CheckCircle2 size={13} className="text-emerald-600" />
                                        <span>Institutional Ready</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Waitlist/Contact Section */}
            <section id="waitlist" className="relative py-24 px-4 sm:px-6 lg:px-10 overflow-hidden border-t border-zinc-200 bg-zinc-50/50">
                <div className="max-w-largest mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-4">
                            Secure Your Institutional <br className="sm:hidden" />
                            <span className="text-brand-purple">Access</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-sans">
                            Apply for access to the StableBank institutional platform. Our coverage team will coordinate an onboarding strategy tailored to your requirements.
                        </p>
                    </div>

                    <InstitutionsWaitlistForm />
                </div>
            </section>
        </SiteLayout>
    );
}

