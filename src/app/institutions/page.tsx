import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import InstitutionsWaitlistForm from "@/components/forms/institutions-waitlist";
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
    Globe
} from "lucide-react";

export const metadata = {
    title: "Institutions | StableBank",
    description:
        "The digital asset platform for modern institutions. Secure custody, atomic settlement, and agentic banking services.",
};

const capabilities = [
    {
        icon: LineChart,
        title: "Trading & Financing",
        description:
            "Access deep institutional liquidity and prime execution services. Secure flexible financing and credit lines optimized for digital assets.",
        className: "bg-[#0A0A0A]",
    },
    {
        icon: Lock,
        title: "Custody & Token Management",
        description:
            "Segregated multi-signature cold storage under a secure, regulated framework. Complete token management solutions from generation to vesting.",
        className: "bg-[#111111]",
    },
    {
        icon: Percent,
        title: "Staking & Yield",
        description:
            "Earn optimized yield and participate in protocol validation directly from your custody account. Insured, secure, and fully compliant staking.",
        className: "bg-[#141414]",
    },
    {
        icon: Zap,
        title: "Atlas Settlement Network",
        description:
            "Execute atomic, instant settlements across digital and fiat pairs. Bypass correspondent bank chains and eliminate counterparty risk.",
        className: "bg-[#1A1A1A]",
    },
    {
        icon: Briefcase,
        title: "Wealth Management Solutions",
        description:
            "Empower your Registered Investment Advisors (RIAs) and wealth managers with robust client reporting, trading interfaces, and sub-custody.",
        className: "bg-[#0E0E0E]",
    },
    {
        icon: Cpu,
        title: "Agentic Banking",
        description:
            "Next-generation banking services designed for autonomous AI agents. Execute programmatic sweeps, payouts, and automated treasury routing.",
        className: "bg-[#161616]",
    },
];

const whoWeServe = [
    {
        icon: Wallet,
        title: "Asset Managers",
        description: "Scale your digital asset offerings with robust trading, institutional custody, and unified reporting tools.",
    },
    {
        icon: Layers,
        title: "ETF Issuers",
        description: "Power exchange-traded funds with institutional-grade custody, high-throughput redemption hooks, and secure staking.",
    },
    {
        icon: Briefcase,
        title: "Wealth Managers & RIAs",
        description: "Deliver secure crypto portfolios, yield products, and clear tax reporting directly to your clients.",
    },
    {
        icon: Network,
        title: "Crypto Protocols & Foundations",
        description: "Manage treasury reserves, coordinate token generation events (TGEs), and deploy secure validation nodes.",
    },
    {
        icon: Building2,
        title: "Corporations",
        description: "Unify supplier payments, deploy programmatic stablecoin payroll rails, and maximize corporate cash returns.",
    },
    {
        icon: TrendingUp,
        title: "Hedge Funds",
        description: "Leverage prime brokerage execution, deep orderbooks, high-speed API connections, and capital financing.",
    },
    {
        icon: Rocket,
        title: "VC Firms",
        description: "Secure early-stage token allocations, manage complex vesting schedules, and coordinate LP distributions.",
    },
    {
        icon: Globe,
        title: "Governments & Sovereigns",
        description: "Leverage compliant custody, asset recovery flows, and high-security storage for sovereign operations.",
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
                            The premier digital asset and settlement platform for modern institutions. <br className="hidden sm:block" />
                            Secure custody, atomic settlement, and agentic banking.
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a href="#waitlist" className="px-8 py-4 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center">
                                Request Access <ArrowRight size={20} />
                            </a>
                            <div className="text-white/40 text-sm">
                                Dedicated coverage teams ready.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Capabilities Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-10 bg-brand-black border-y border-white/5 relative overflow-hidden">
                <div className="max-w-largest mx-auto">
                    <div className="mb-24 text-center">
                        <SectionCard title="Capabilities" />
                        <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                            Institutional <span className="text-brand-purple">Platform</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-3xl mx-auto">
                            A comprehensive suite of digital asset infrastructure, powered by advanced security, real-time liquidity, and next-generation connectivity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap, i) => (
                            <div
                                key={cap.title}
                                className={`group relative p-8 rounded-[2.5rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-brand-purple/30 hover:shadow-2xl hover:shadow-brand-purple/10 ${cap.className}`}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                    <cap.icon className="w-32 h-32 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-purple group-hover:text-white transition-all duration-500">
                                        <cap.icon className="h-7 w-7 text-white/80 group-hover:text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{cap.title}</h3>
                                    <p className="text-white/50 leading-relaxed text-base">
                                        {cap.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve Section */}
            <section className="py-32 px-4 sm:px-6 lg:px-10 bg-[#050505] relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-5" />

                <div className="max-w-largest mx-auto relative z-10">
                    <div className="mb-24 text-center">
                        <SectionCard title="Who We Serve" />
                        <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                            Powering Digital Asset <span className="text-brand-yellow">Pioneers</span>
                        </h2>
                        <p className="text-xl text-white/60 max-w-3xl mx-auto">
                            From native crypto protocols and digital hedge funds to global corporations and sovereign wealth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whoWeServe.map((serve, i) => (
                            <div key={serve.title} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                                <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <serve.icon className="w-6 h-6 text-brand-yellow" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{serve.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    {serve.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waitlist/Contact Section */}
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
                            Apply for access to the StableBank institutional platform. Our coverage team will coordinate an onboarding strategy tailored to your requirements.
                        </p>
                    </div>

                    <InstitutionsWaitlistForm />
                </div>
            </section>
        </SiteLayout>
    );
}
