import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import BusinessWaitlistForm from "@/components/forms/business-waitlist";
import {
    ArrowRight,
    Building2,
    Landmark,
    Coins,
    BarChart3,
    Lock,
    RefreshCw,
    Scale,
    FileCheck,
    Fingerprint,
    CreditCard,
    Percent,
    Clock,
} from "lucide-react";

export const metadata = {
    title: "Business Accounts | StableBank",
    description:
        "Treasury management, team expense cards, auto-compounding yields, and global fiat rails for modern companies.",
};

const solutions = [
    {
        icon: Landmark,
        title: "Corporate Treasury",
        description:
            "Hold, transfer, and trade USD, EUR, GBP, and stablecoins in one dashboard. Protected by insurance-backed balance coverage.",
    },
    {
        icon: CreditCard,
        title: "Team Expense Cards",
        description:
            "Issue corporate virtual and physical debit cards to employees. Set spend limits, restrict merchants, and settle from stablecoins.",
    },
    {
        icon: RefreshCw,
        title: "Global FX Rails",
        description:
            "Convert stablecoins to local fiat currencies instantly. Send global wires and ACH transfers at industry-low exchange rates.",
    },
    {
        icon: Lock,
        title: "Secure Custody",
        description:
            "Safeguard corporate funds using qualified multi-party computation (MPC) cold vaults and fully segregated ledger accounts.",
    },
    {
        icon: Coins,
        title: "Yield Optimizers",
        description:
            "Put idle cash reserves to work in automated yield-generating vaults, earning competitive yields with daily compounding.",
    },
    {
        icon: BarChart3,
        title: "Deep Liquidity",
        description:
            "Trade large stablecoin allocations directly into fiat and vice-versa with minimal slippage and direct broker execution.",
    },
];

export default function BusinessPage() {
    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center pt-16 pb-20 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="max-w-3xl">
                            <SectionCard title="For Smart Companies" category="ENTERPRISE" variant="yellow" />
                            <h1 className="mt-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-zinc-950 leading-[1.05] tracking-tight">
                                The Financial <br />
                                <span className="text-brand-purple">
                                    Operating System
                                </span>
                            </h1>
                            <p className="mt-6 text-xl sm:text-2xl text-zinc-600 max-w-xl font-sans font-normal leading-relaxed">
                                Manage treasury, issue corporate cards, earn high yields, and move capital globally in one integrated business account.
                            </p>
                        </div>

                        {/* Hero Visualization - "The Core" */}
                        <div className="relative hidden lg:block h-[500px] w-full group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Outer Ring */}
                                <div className="absolute w-[360px] h-[360px] rounded-full border border-zinc-200" />
                                <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-brand-purple/30" />

                                {/* The Core Card */}
                                <div className="relative w-56 h-56 rounded-2xl bg-white border border-zinc-200 shadow-xl flex items-center justify-center">
                                    <Building2 className="w-20 h-20 text-brand-purple" />
                                    
                                    {/* Floating Data Nodes */}
                                    <div className="absolute -top-4 -right-4 bg-[#EEF8A8]/90 border border-[#D0E244]/80 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-[#556000] shadow-md">
                                        +5.25% APY
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-brand-purple shadow-md">
                                        SECURED
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* One Place for Balance Sheet Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-10 border-t border-zinc-200 bg-zinc-50/50">
                <div className="max-w-largest mx-auto">
                    <div className="mb-16 text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Unified Hub" category="OPERATING SYSTEM" />
                        <h2 className="mt-6 text-4xl sm:text-5xl font-display font-extrabold text-zinc-950 mb-4 leading-tight">
                            One place for your entire balance sheet
                        </h2>
                        <p className="text-lg sm:text-xl text-zinc-600 font-sans leading-relaxed">
                            Bring your corporate banking details, stablecoin allocations, yield-generating vaults, and employee cards into a single high-performance dashboard.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300">
                            <div>
                                <div className="h-12 w-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple mb-6">
                                    <Landmark size={24} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-zinc-950 mb-2">Manage treasury</h3>
                                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-sans">
                                    Hold and trade stablecoins (USDC, USDT, EURC) alongside USD, GBP, and EUR corporate banking details, protected by fully segregated account custody.
                                </p>
                            </div>
                            <div className="text-xs font-semibold text-brand-purple font-mono flex items-center gap-1.5 mt-6">
                                <Clock size={14} className="text-brand-purple" />
                                <span>Program live soon</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md hover:border-[#B0BE19]/60 transition-all duration-300">
                            <div>
                                <div className="h-12 w-12 rounded-xl bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[#556000] mb-6">
                                    <Percent size={24} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-zinc-950 mb-2">Auto-Stake and Earn</h3>
                                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-sans">
                                    Convert idle fiat or stablecoins into yield-generating vaults automatically, building compound returns with 24/7 on-chain transparency.
                                </p>
                            </div>
                            <div className="text-xs font-mono font-bold text-emerald-600 mt-6">
                                Up to 5.25% APY
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="p-8 rounded-2xl border border-zinc-200 bg-white flex flex-col justify-between min-h-[300px] shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300">
                            <div>
                                <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6">
                                    <CreditCard size={24} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-zinc-950 mb-2">Issue corporate cards</h3>
                                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-sans">
                                    Instantly provision virtual cards for operations, marketing ads, and SaaS subscriptions. Set custom spend limits and controls for your team.
                                </p>
                            </div>
                            <div className="text-xs font-semibold text-emerald-600 font-mono flex items-center gap-1 mt-6">
                                Visa network supported
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section with Compliance */}
            <section className="relative py-24 border-y border-zinc-200 bg-white">
                <div className="max-w-largest mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-zinc-950 mb-6 leading-tight">
                                Regulatory <br />
                                <span className="text-brand-purple">Fortress</span>
                            </h2>
                            <p className="text-lg text-zinc-600 mb-8 leading-relaxed font-sans">
                                We&apos;ve bridged the gap between traditional finance compliance and decentralized innovation. Your assets are held by a qualified custodian, fully segregated, and auditable on-chain.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { icon: FileCheck, label: "SOC 2 Type II", sub: "Certified" },
                                    { icon: Lock, label: "Qualified Custody", sub: "Partner Network" },
                                    { icon: Scale, label: "Segregated", sub: "Client Accounts" },
                                    { icon: Fingerprint, label: "Biometric", sub: "Authentication" }
                                ].map((item) => (
                                    <div key={item.label} className="group relative p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:shadow-sm transition-all duration-300">
                                        <div className="relative flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 text-sm">{item.label}</div>
                                                <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">{item.sub}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="relative p-8 rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
                            <div className="flex flex-col items-center justify-center gap-6">
                                <div className="bg-white border border-zinc-200 px-5 py-2 rounded-full flex items-center gap-3 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-mono font-bold text-zinc-800 tracking-wider uppercase">Live Audit Stream</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="w-7 h-7 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                                                    <Lock className="w-3.5 h-3.5 text-brand-purple" />
                                                </div>
                                                <div className="px-2 py-0.5 rounded bg-emerald-50 text-xs text-emerald-700 font-mono font-semibold">
                                                    VERIFIED
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 mt-3">
                                                <div className="h-2 w-20 bg-zinc-200 rounded-full" />
                                                <div className="h-1.5 w-12 bg-zinc-100 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex gap-8">
                                    <div className="text-center">
                                        <div className="text-2xl font-mono font-bold text-zinc-900">100%</div>
                                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Reserve Ratio</div>
                                    </div>
                                    <div className="w-px h-10 bg-zinc-200" />
                                    <div className="text-center">
                                        <div className="text-2xl font-mono font-bold text-zinc-900">24/7</div>
                                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Monitoring</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integrated Solutions */}
            <section className="py-24 px-4 sm:px-6 lg:px-10 bg-zinc-50/50">
                <div className="max-w-largest mx-auto">
                    <div className="mb-16 text-center flex flex-col items-center">
                        <SectionCard title="Product" category="SUITE" />
                        <h2 className="mt-6 text-4xl sm:text-5xl font-display font-extrabold text-zinc-950 mb-4">Integrated Offerings</h2>
                        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-sans">
                            One unified account built for the rigorous compliance standards of modern business.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {solutions.map((solution) => (
                            <div
                                key={solution.title}
                                className="group relative p-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-purple/40 shadow-sm"
                            >
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center mb-6 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-colors duration-300">
                                            <solution.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-zinc-950 mb-3">{solution.title}</h3>
                                        <p className="text-zinc-600 leading-relaxed text-sm sm:text-base font-sans">
                                            {solution.description}
                                        </p>
                                    </div>
                                    <div className="mt-8 flex items-center text-zinc-500 font-semibold group-hover:text-brand-purple transition-all cursor-pointer font-mono text-sm">
                                        Explore <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Waitlist Section */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="max-w-largest mx-auto relative z-10">
                    <div className="rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 border border-zinc-200 p-8 sm:p-14 lg:p-18 shadow-lg">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-zinc-950 mb-6 leading-tight">
                                    Ready to <br />
                                    <span className="text-brand-purple">Institutionalize?</span>
                                </h2>
                                <p className="text-lg sm:text-xl text-zinc-600 mb-10 max-w-xl font-sans">
                                    Scale your operations with the only digital asset platform built for the rigorous standards of modern finance.
                                </p>

                                <div className="flex flex-wrap gap-10 border-t border-zinc-200 pt-8">
                                    <div>
                                        <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-950 mb-1 tracking-tight">$50B+</div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-semibold">Assets Secured</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl sm:text-5xl font-mono font-bold text-zinc-950 mb-1 tracking-tight">0%</div>
                                        <div className="text-xs text-zinc-500 uppercase tracking-widest font-mono font-semibold">Security Incidents</div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:pl-6">
                                <BusinessWaitlistForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
