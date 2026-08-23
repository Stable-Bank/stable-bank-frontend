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
    },
    {
        icon: Lock,
        title: "Custody & Token Management",
        description:
            "Segregated multi-signature cold storage under a secure, regulated framework. Complete token management solutions from generation to vesting.",
    },
    {
        icon: Percent,
        title: "Staking & Yield",
        description:
            "Earn optimized yield and participate in protocol validation directly from your custody account. Insured, secure, and fully compliant staking.",
    },
    {
        icon: Zap,
        title: "Atlas Settlement Network",
        description:
            "Execute atomic, instant settlements across digital and fiat pairs. Bypass correspondent bank chains and eliminate counterparty risk.",
    },
    {
        icon: Briefcase,
        title: "Wealth Management Solutions",
        description:
            "Empower your Registered Investment Advisors (RIAs) and wealth managers with robust client reporting, trading interfaces, and sub-custody.",
    },
    {
        icon: Cpu,
        title: "Agentic Banking",
        description:
            "Next-generation banking services designed for autonomous AI agents. Execute programmatic sweeps, payouts, and automated treasury routing.",
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
            <section className="relative min-h-[80vh] flex items-center pt-16 pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <SectionCard title="StableBank Institutions" category="PRIME" />
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
                            <div className="text-zinc-500 text-sm font-mono font-medium">
                                Dedicated coverage teams ready.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Capabilities Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-10 border-y border-zinc-200 bg-zinc-50/50 relative overflow-hidden">
                <div className="max-w-largest mx-auto">
                    <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Capabilities" category="INFRASTRUCTURE" />
                        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-4">
                            Institutional <span className="text-brand-purple">Platform</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-3xl mx-auto font-sans leading-relaxed">
                            A comprehensive suite of digital asset infrastructure, powered by advanced security, real-time liquidity, and next-generation connectivity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {capabilities.map((cap) => (
                            <div
                                key={cap.title}
                                className="group relative p-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-purple/40 shadow-sm"
                            >
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-6 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                                        <cap.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-zinc-950 mb-3">{cap.title}</h3>
                                    <p className="text-zinc-600 leading-relaxed text-sm sm:text-base font-sans">
                                        {cap.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Serve Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-10 bg-white relative overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10">
                    <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Who We Serve" category="CLIENTELE" />
                        <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-4">
                            Powering Digital Asset <span className="text-brand-purple">Pioneers</span>
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-3xl mx-auto font-sans leading-relaxed">
                            From native crypto protocols and digital hedge funds to global corporations and sovereign wealth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whoWeServe.map((serve) => (
                            <div key={serve.title} className="group p-6 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center mb-4 text-brand-purple group-hover:scale-105 transition-transform">
                                    <serve.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-display font-bold text-zinc-950 mb-2">{serve.title}</h3>
                                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans">
                                    {serve.description}
                                </p>
                            </div>
                        ))}
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
