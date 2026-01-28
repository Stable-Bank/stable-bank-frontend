import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import BusinessWaitlistForm from "@/components/forms/business-waitlist";
import {
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    Building2,
    Landmark,
    Banknote,
    Coins,
    BarChart3,
    Lock,
    RefreshCw,
    Scale,
    FileCheck,
    Fingerprint,
    Globe2
} from "lucide-react";

export const metadata = {
    title: "Business | StableBank",
    description:
        "The financial operating system for the new economy. Prime trading, settlement, custody, and staking.",
};

const solutions = [
    {
        icon: Landmark,
        title: "ApexPrime",
        description:
            "A full-stack crypto prime brokerage. Get best-in-class execution, liquidity, and white-glove service for high-volume trading.",
        className: "bg-brand-black",
    },
    {
        icon: BarChart3,
        title: "DeepMarkets",
        description:
            "Stay ahead of evolving markets with advanced algorithmic trading, deep liquidity pools, and minimal slippage.",
        className: "bg-[#0F0F0F]",
    },
    {
        icon: RefreshCw,
        title: "Velocity Net",
        description:
            "Settle on-chain instantly. Avoid counterparty risk, delivery failures, and bankruptcy exposure with atomic settlements.",
        className: "bg-[#141414]",
    },
    {
        icon: Lock,
        title: "IronVault",
        description:
            "Qualified custody you can trust. Safeguard your assets with MPC technology and segregation of funds.",
        className: "bg-[#1A1A1A]",
    },
    {
        icon: Coins,
        title: "MintOS",
        description:
            "Launch your own branded stablecoin or tokenized asset on our compliant infrastructure.",
        className: "bg-[#1F1F1F]",
    },
    {
        icon: TrendingUp,
        title: "YieldCore",
        description:
            "Safely collect rewards by staking assets like ETH, SOL, and DOT with institutional-grade validators.",
        className: "bg-[#242424]",
    },
    {
        icon: Banknote,
        title: "DeFi Direct",
        description:
            "Direct, secure access to DeFi protocols for lending, borrowing, and yield generation.",
        className: "bg-[#292929]",
    },
];

export default function BusinessPage() {
    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="absolute inset-0 bg-brand-black" />

                {/* Parallax Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 animate-pulse duration-[10000ms]" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-yellow/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="max-w-largest mx-auto relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-3xl">
                            <SectionCard title="For Institutions" />
                            <h1 className="mt-8 text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-[1] tracking-tight">
                                The Digital <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-white to-brand-yellow animate-gradient-x">
                                    Asset Platform
                                </span>
                            </h1>
                            <p className="mt-8 text-xl sm:text-2xl text-white/50 max-w-xl font-light leading-relaxed">
                                The first federally chartered crypto bank designed for the world&apos;s most sophisticated institutions.
                            </p>
                        </div>

                        {/* Hero Visualization - "The Core" */}
                        <div className="relative hidden lg:block h-[600px] w-full perspective-[1000px] group">
                            {/* Central Axis Container */}
                            <div className="absolute inset-0 flex items-center justify-center transform-style-3d transition-transform duration-1000 group-hover:rotate-x-12 group-hover:rotate-y-12">

                                {/* Outer Orbital Ring */}
                                <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 animate-spin-slow-reverse">
                                    <div className="absolute top-0 left-1/2 w-4 h-4 bg-brand-purple rounded-full blur-[2px] -translate-x-1/2 -translate-y-1/2" />
                                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-brand-yellow rounded-full blur-[1px] -translate-x-1/2 translate-y-1/2" />
                                </div>

                                {/* Middle Ring - Dashed */}
                                <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-white/10 animate-spin-slow" />

                                {/* The Core Cube */}
                                <div className="relative w-48 h-48 transform-style-3d animate-float">
                                    {/* Core Glow */}
                                    <div className="absolute inset-0 bg-brand-purple/20 blur-[50px] rounded-full" />

                                    {/* Glass Faces */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-2xl border border-white/20 transform rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                                        <Building2 className="w-20 h-20 text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                                    </div>

                                    {/* Floating Data Nodes */}
                                    <div className="absolute -top-12 -right-4 bg-black/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-brand-green animate-bounce-custom">
                                        +2.45% APY
                                    </div>
                                    <div className="absolute -bottom-8 -left-8 bg-black/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-brand-yellow animate-bounce-custom delay-700">
                                        SECURED
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section with Parallax Scroll */}
            <section className="relative py-32 bg-[#050505] border-y border-white/5">
                <div className="max-w-largest mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
                                Regulatory <br />
                                <span className="text-brand-purple">Fortress</span>
                            </h2>
                            <p className="text-xl text-white/60 mb-10 leading-relaxed">
                                We&apos;ve bridged the gap between traditional finance compliance and decentralized innovation. Your assets are held by a qualified custodian, fully segregated, and auditable on-chain.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { icon: FileCheck, label: "SOC 2 Type II", sub: "Certified" },
                                    { icon: Lock, label: "Qualified Custody", sub: "Partner Network" },
                                    { icon: Scale, label: "Segregated", sub: "Client Accounts" },
                                    { icon: Fingerprint, label: "Biometric", sub: "Authentication" }
                                ].map((item) => (
                                    <div key={item.label} className="group relative p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="relative flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-brand-purple/20 transition-colors">
                                                <item.icon className="w-6 h-6 text-white/80 group-hover:text-brand-purple transition-colors" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">{item.label}</div>
                                                <div className="text-xs text-white/40 uppercase tracking-wider font-medium">{item.sub}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative h-[500px] w-full perspective-[2000px] group">
                            {/* Compliance Mesh Visual */}
                            <div className="absolute inset-x-0 inset-y-10 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] border border-white/5 backdrop-blur-md overflow-hidden transform transition-transform duration-700 group-hover:rotate-y-[-5deg] group-hover:rotate-x-5 shadow-2xl">

                                {/* Background Grid */}
                                <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-10" />

                                {/* Scanning Laser */}
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-green to-transparent opacity-50 blur-sm animate-scan-slow z-20" />

                                {/* Central Data Stream */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
                                    {/* Floating Header */}
                                    <div className="bg-black/40 border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-xl mb-4 shadow-lg animate-float-slow">
                                        <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                                        <span className="text-xs font-mono text-brand-green tracking-widest uppercase">Live Audit Stream</span>
                                    </div>

                                    {/* Transaction Blocks */}
                                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className={`relative p-4 rounded-2xl border border-white/5 bg-white/[0.02] transform transition-all duration-500 hover:bg-white/[0.05] group/card ${i % 2 === 0 ? 'translate-y-8' : ''}`}>
                                                {/* Connection Line */}
                                                <div className={`absolute top-1/2 ${i % 2 === 0 ? '-left-4' : '-right-4'} w-4 h-[1px] bg-white/10`} />

                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="w-8 h-8 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                                                        <Lock className="w-4 h-4 text-brand-purple" />
                                                    </div>
                                                    <div className="px-2 py-1 rounded bg-brand-green/10 border border-brand-green/20 text-[10px] text-brand-green font-mono">
                                                        VERIFIED
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                                                    <div className="h-1.5 w-16 bg-white/5 rounded-full" />
                                                </div>

                                                {/* Hover Glow */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover/card:translate-x-[100%] transition-transform duration-1000" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Status */}
                                    <div className="mt-8 flex gap-8">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">100%</div>
                                            <div className="text-[10px] text-white/40 uppercase tracking-wider">Reserve Ratio</div>
                                        </div>
                                        <div className="w-px h-10 bg-white/10" />
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-white">24/7</div>
                                            <div className="text-[10px] text-white/40 uppercase tracking-wider">Monitoring</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Orbs */}
                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow" />
                                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-brand-yellow/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Integrated Solutions */}
            <section className="py-32 px-4 sm:px-6 lg:px-10 bg-brand-black">
                <div className="max-w-largest mx-auto">
                    <div className="mb-24 text-center">
                        <SectionCard title="Platform" />
                        <h2 className="mt-8 text-5xl sm:text-6xl font-bold text-white mb-6">Integrated Offerings</h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            One unified platform for all your institutional digital asset needs.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((solution, index) => (
                            <div
                                key={solution.title}
                                className={`group relative p-10 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 ${solution.className}`}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                                    <solution.icon className="w-32 h-32 text-white" />
                                </div>

                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-purple group-hover:text-white transition-all duration-500">
                                            <solution.icon className="h-7 w-7 text-white/80 group-hover:text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{solution.title}</h3>
                                        <p className="text-white/50 leading-relaxed text-lg">
                                            {solution.description}
                                        </p>
                                    </div>
                                    <div className="mt-10 flex items-center text-white/40 font-medium group-hover:text-brand-purple transition-all cursor-pointer">
                                        Explore <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section className="relative py-32 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="absolute inset-0 bg-brand-black" />
                <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-10 mask-gradient-b" />

                <div className="max-w-largest mx-auto relative z-10">
                    <div className="rounded-[3rem] bg-gradient-to-br from-[#111] to-black border border-white/10 p-8 sm:p-16 lg:p-20 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />

                        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                            <div>
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8">
                                    Ready to <br />
                                    <span className="text-brand-yellow">Institutionalize?</span>
                                </h2>
                                <p className="text-xl text-white/60 mb-12 max-w-xl">
                                    Scale your operations with the only digital asset platform built for the rigorous standards of modern finance.
                                </p>

                                <div className="flex flex-wrap gap-12 border-t border-white/10 pt-10">
                                    <div>
                                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">$50B+</div>
                                        <div className="text-sm text-white/40 uppercase tracking-widest font-semibold">Assets Secured</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">0%</div>
                                        <div className="text-sm text-white/40 uppercase tracking-widest font-semibold">Security Incidents</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:pl-10">
                                <BusinessWaitlistForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
