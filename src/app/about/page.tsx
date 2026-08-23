import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import {
    Shield,
    Eye,
    Zap,
    Heart,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/navigation";

export const metadata = {
    title: "About Us | StableBank",
    description:
        "Learn about StableBank's mission to revolutionize banking with decentralized stablecoin technology.",
};

const values = [
    {
        icon: Shield,
        title: "Security First",
        description:
            "Your assets are protected with military-grade encryption and multi-signature security.",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        icon: Eye,
        title: "Full Transparency",
        description:
            "Every transaction is verifiable on-chain. No hidden fees, no surprises.",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
    },
    {
        icon: Zap,
        title: "Constant Innovation",
        description:
            "We push the boundaries of what's possible in decentralized finance.",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
    },
    {
        icon: Heart,
        title: "User-Centric",
        description:
            "Every feature is designed with your experience and needs in mind.",
        color: "text-rose-600",
        bgColor: "bg-rose-50",
    },
];

export default function AboutPage() {
    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="max-w-largest mx-auto relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <SectionCard title="About Us" />

                        <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-zinc-950 leading-tight">
                            Banking for the{" "}
                            <span className="text-brand-purple">Digital Age</span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-zinc-600 max-w-3xl mx-auto font-sans">
                            We&apos;re building the financial infrastructure for a borderless
                            world. No banks, no borders, just freedom.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-zinc-950 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-base sm:text-lg text-zinc-600 font-sans leading-relaxed">
                                <p>
                                    StableBank was born from a simple observation: traditional
                                    banking wasn&apos;t built for the global citizen. High fees, slow
                                    transfers, and endless paperwork were holding people back.
                                </p>
                                <p>
                                    In 2023, our founders—former fintech executives and blockchain
                                    pioneers—came together with a mission: to create a banking
                                    experience that matches the speed of the digital world.
                                </p>
                                <p>
                                    Today, we serve over 50,000 users across 120+ countries,
                                    processing millions in transactions every month. But we&apos;re
                                    just getting started.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-white p-8 sm:p-12 shadow-md">
                                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                                    <div className="text-center p-6 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="text-3xl sm:text-4xl font-mono font-black text-brand-purple">
                                            2023
                                        </div>
                                        <div className="text-xs sm:text-sm text-zinc-500 font-mono mt-1 font-semibold uppercase">Founded</div>
                                    </div>
                                    <div className="text-center p-6 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="text-3xl sm:text-4xl font-mono font-black text-brand-purple">
                                            50K+
                                        </div>
                                        <div className="text-xs sm:text-sm text-zinc-500 font-mono mt-1 font-semibold uppercase">Users</div>
                                    </div>
                                    <div className="text-center p-6 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="text-3xl sm:text-4xl font-mono font-black text-brand-purple">
                                            120+
                                        </div>
                                        <div className="text-xs sm:text-sm text-zinc-500 font-mono mt-1 font-semibold uppercase">Countries</div>
                                    </div>
                                    <div className="text-center p-6 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <div className="text-3xl sm:text-4xl font-mono font-black text-brand-purple">
                                            $100M+
                                        </div>
                                        <div className="text-xs sm:text-sm text-zinc-500 font-mono mt-1 font-semibold uppercase">TVL</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <SectionCard title="Our Values" />
                        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-zinc-950">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="relative group p-8 sm:p-10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md border border-zinc-200 bg-white shadow-sm"
                            >
                                <div className="relative z-10">
                                    <div
                                        className={`h-14 w-14 rounded-xl ${value.bgColor} flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300`}
                                    >
                                        <value.icon className={`h-7 w-7 ${value.color}`} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-display font-bold text-zinc-950 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-zinc-600 text-base leading-relaxed max-w-md font-sans">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="rounded-3xl bg-gradient-to-r from-indigo-50 via-purple-50 to-amber-50/40 p-8 sm:p-12 md:p-16 text-center border border-zinc-200 shadow-md">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-zinc-950 mb-4">
                            Ready to Join the Revolution?
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto mb-8 font-sans">
                            Start your journey to financial freedom today.
                        </p>
                        <Link href={appRoutes.auth.signUp}>
                            <Button className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                Get Started Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
