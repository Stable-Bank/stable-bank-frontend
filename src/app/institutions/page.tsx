import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import InstitutionsWaitlistForm from "@/components/forms/institutions-waitlist";
import {
    ArrowRight,
    Globe2,
    Users2,
    Building,
    Zap,
    LayoutDashboard,
    CreditCard,
    BadgePercent
} from "lucide-react";
import Image from "next/image";

export const metadata = {
    title: "Institutions | StableBank",
    description:
        "The financial infrastructure global businesses need. No bank hours. No borders. No excuses.",
};

const features = [
    {
        icon: Zap,
        title: "Global Atomic Settlements",
        description:
            "Settle transactions instantly across 170+ countries without the friction of legacy banking hours or correspondent banks.",
        className: "bg-[#0A0A0A]",
    },
    {
        icon: LayoutDashboard,
        title: "Unified Asset Treasury",
        description:
            "Manage stablecoins, crypto, and fiat balances side by side. Gain deep insights with real-time portfolio analytics.",
        className: "bg-[#111111]",
    },
    {
        icon: CreditCard,
        title: "Dynamic Corporate Cards",
        description:
            "Issue unlimited virtual cards instantly. Deploy programmable spending limits for specific teams, vendors, or geographies.",
        className: "bg-[#141414]",
    },
    {
        icon: BadgePercent,
        title: "Maximized Yield & Rewards",
        description:
            "Earn up to 3% back on operational spend and access exclusive institutional rates on critical digital infrastructure.",
        className: "bg-[#1A1A1A]",
    },
];

export default function InstitutionsPage() {
    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden bg-brand-black">
                {/* Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-[120px] translate-x-1/3 animate-pulse duration-[8000ms]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[100px] -translate-x-1/4" />
                </div>

                <div className="max-w-largest mx-auto relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <SectionCard title="StableBank Institutions" />
                        <h1 className="mt-8 text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.1] tracking-tight">
                            Engineered for scale. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-white to-brand-purple animate-gradient-x">
                                Built for speed.
                            </span>
                        </h1>
                        <p className="mt-8 text-xl sm:text-2xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
                            The digital asset platform for modern institutions. <br className="hidden sm:block" />
                            Borderless transactions with institutional-grade security.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#waitlist" className="px-8 py-4 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                                Request Access <ArrowRight size={20} />
                            </a>
                            <div className="text-white/40 text-sm">
                                Reviewing applications now.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built for Operators Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-10 bg-[#050505] border-y border-white/5 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-5" />

                <div className="max-w-largest mx-auto relative z-10">
                    <div className="mb-20 text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Designed for institutional scale, <span className="text-brand-yellow">built without compromise.</span></h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Target 1 */}
                        <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building className="w-7 h-7 text-brand-purple" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Digital Agencies</h3>
                            <p className="text-white/50 leading-relaxed">
                                Streamline global payouts to creators, media buyers, and vendors. Eliminate border restrictions and settle invoices instantly.
                            </p>
                        </div>

                        {/* Target 2 */}
                        <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-brand-yellow/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users2 className="w-7 h-7 text-brand-yellow" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Tech Innovators</h3>
                            <p className="text-white/50 leading-relaxed">
                                Manage global contractors effortlessly. Secure your runway with transparent, stablecoin-native infrastructure that scales with you.
                            </p>
                        </div>

                        {/* Target 3 */}
                        <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-brand-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Globe2 className="w-7 h-7 text-brand-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Borderless Enterprises</h3>
                            <p className="text-white/50 leading-relaxed">
                                Operate across 170+ countries with absolute confidence. Unify your cross-border payroll, settlement, and treasury management in one place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-10 bg-brand-black">
                <div className="max-w-largest mx-auto">
                    <div className="mb-24 text-center">
                        <SectionCard title="Crypto-First" />
                        <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                            Institutional-Grade <span className="text-brand-purple">Digital Banking</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-3xl mx-auto">
                            A unified platform for treasury management, cross-border settlements, and unlimited spending. Engineered for reliability without unexpected closures.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={feature.title}
                                className={`group relative p-10 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 ${feature.className}`}
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                    <feature.icon className="w-40 h-40 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-purple group-hover:text-white transition-all duration-500">
                                        <feature.icon className="h-8 w-8 text-white/80 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-lg max-w-md">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section id="waitlist" className="relative py-32 px-4 sm:px-6 lg:px-10 overflow-hidden border-t border-white/5">
                <div className="absolute inset-0 bg-brand-black" />
                <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-10 mask-gradient-b" />

                <div className="max-w-largest mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                            Secure Your Institutional <br className="sm:hidden" />
                            <span className="text-brand-purple">Access</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto">
                            Leading institutions already trust StableBank for their treasury needs. Apply for early access to our institutional tier and exclusive perks.
                        </p>
                    </div>

                    <InstitutionsWaitlistForm />
                </div>
            </section>
        </SiteLayout>
    );
}
