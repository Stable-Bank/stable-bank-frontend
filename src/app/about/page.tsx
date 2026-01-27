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
            <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-brand-purple/5 to-transparent">
                <div className="max-w-largest mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <SectionCard title="Our Values" />
                        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
                            What We Stand For
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {values.map((value) => (
                            <div
                                key={value.title}
                                className="group p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                            >
                                <div
                                    className={`h-14 w-14 rounded-2xl ${value.bgColor} flex items-center justify-center mb-6`}
                                >
                                    <value.icon className={`h-7 w-7 ${value.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-brand-white mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-white/60 text-sm sm:text-base">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="text-center mb-12 sm:mb-16">
                        <SectionCard title="Our Team" />
                        <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-brand-white">
                            Meet the Builders
                        </h2>
                        <p className="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
                            A world-class team of engineers, designers, and finance experts.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {team.map((member) => (
                            <div
                                key={member.name}
                                className="group text-center p-6 rounded-3xl border border-white/10 hover:border-brand-purple/30 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-brand-purple to-brand-yellow p-[2px]">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-brand-black">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-brand-white">
                                    {member.name}
                                </h3>
                                <p className="text-brand-purple text-sm font-medium mt-1">
                                    {member.role}
                                </p>
                                <p className="text-white/50 text-sm mt-3">{member.bio}</p>
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
