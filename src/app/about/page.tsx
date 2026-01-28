import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import Image from "next/image";
import {
    Shield,
    Eye,
    Zap,
    Users,
    Target,
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
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
    },
    {
        icon: Eye,
        title: "Full Transparency",
        description:
            "Every transaction is verifiable on-chain. No hidden fees, no surprises.",
        color: "text-green-400",
        bgColor: "bg-green-400/10",
    },
    {
        icon: Zap,
        title: "Constant Innovation",
        description:
            "We push the boundaries of what's possible in decentralized finance.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
    },
    {
        icon: Heart,
        title: "User-Centric",
        description:
            "Every feature is designed with your experience and needs in mind.",
        color: "text-pink-400",
        bgColor: "bg-pink-400/10",
    },
];

const team = [
    {
        name: "Sarah Chen",
        role: "CEO & Co-founder",
        image: "/images/placeholder/dummy-profile-img.png",
        bio: "Former Goldman Sachs executive with 15 years in fintech.",
    },
    {
        name: "Marcus Johnson",
        role: "CTO & Co-founder",
        image: "/images/placeholder/dummy-profile-img.png",
        bio: "Ex-Coinbase engineer, blockchain pioneer since 2013.",
    },
    {
        name: "Elena Rodriguez",
        role: "Head of Design",
        image: "/images/placeholder/dummy-profile-img.png",
        bio: "Award-winning designer from Apple and Stripe.",
    },
    {
        name: "David Kim",
        role: "Head of Security",
        image: "/images/placeholder/dummy-profile-img.png",
        bio: "Former NSA cybersecurity specialist.",
    },
];

export default function AboutPage() {
    return (
        <SiteLayout>
            {/* Hero Section */}
            <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/10 to-transparent" />

                <div className="max-w-largest mx-auto relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <SectionCard title="About Us" />

                        <h1 className="mt-6 sm:mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-brand-white leading-tight">
                            Banking for the{" "}
                            <span className="text-brand-yellow">Digital Age</span>
                        </h1>

                        <p className="mt-6 text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
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
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-base sm:text-lg text-white/70">
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
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/30 to-brand-yellow/20 rounded-3xl blur-3xl" />
                            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-brand-black/50 p-8 sm:p-12">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center p-4 rounded-2xl bg-white/5">
                                        <div className="text-3xl sm:text-4xl font-bold text-brand-yellow">
                                            2023
                                        </div>
                                        <div className="text-sm text-white/50 mt-1">Founded</div>
                                    </div>
                                    <div className="text-center p-4 rounded-2xl bg-white/5">
                                        <div className="text-3xl sm:text-4xl font-bold text-brand-yellow">
                                            50K+
                                        </div>
                                        <div className="text-sm text-white/50 mt-1">Users</div>
                                    </div>
                                    <div className="text-center p-4 rounded-2xl bg-white/5">
                                        <div className="text-3xl sm:text-4xl font-bold text-brand-yellow">
                                            120+
                                        </div>
                                        <div className="text-sm text-white/50 mt-1">Countries</div>
                                    </div>
                                    <div className="text-center p-4 rounded-2xl bg-white/5">
                                        <div className="text-3xl sm:text-4xl font-bold text-brand-yellow">
                                            $100M+
                                        </div>
                                        <div className="text-sm text-white/50 mt-1">TVL</div>
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
                        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {values.map((value, index) => (
                            <div
                                key={value.title}
                                className={`relative group p-8 sm:p-10 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-white/5 ${index === 0 || index === 3 ? "bg-white/[0.03]" : "bg-white/[0.02]"
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgColor.replace("/10", "/5")} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="relative z-10">
                                    <div
                                        className={`h-16 w-16 rounded-2xl ${value.bgColor} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}
                                    >
                                        <value.icon className={`h-8 w-8 ${value.color}`} />
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-brand-white mb-4">
                                        {value.title}
                                    </h3>
                                    <p className="text-white/60 text-lg leading-relaxed max-w-md">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-brand-purple/5 to-transparent">
                <div className="max-w-largest mx-auto">
                    <div className="text-center mb-12 sm:mb-20">
                        <SectionCard title="Our Team" />
                        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
                            Meet the Builders
                        </h2>
                        <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
                            A world-class team of engineers, designers, and finance experts.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group relative"
                            >
                                <div className="relative mb-6 rounded-3xl overflow-hidden aspect-square">
                                    <div className="absolute inset-0 bg-brand-purple/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-300 z-10" />
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />

                                    {/* Glass Overlay on Hover */}
                                    <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 opacity-0 group-hover:opacity-100">
                                        <p className="text-white/80 text-xs sm:text-sm">{member.bio}</p>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-brand-white mb-1 group-hover:text-brand-yellow transition-colors">
                                        {member.name}
                                    </h3>
                                    <p className="text-brand-purple font-medium text-sm tracking-wide uppercase">
                                        {member.role}
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
                    <div className="rounded-3xl bg-gradient-to-r from-brand-purple/20 to-brand-yellow/10 p-8 sm:p-12 md:p-16 text-center border border-white/10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white mb-4">
                            Ready to Join the Revolution?
                        </h2>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                            Start your journey to financial freedom today.
                        </p>
                        <Link href={appRoutes.auth.signUp}>
                            <Button className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full">
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
