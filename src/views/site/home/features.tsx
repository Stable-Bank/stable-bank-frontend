"use client";

import { cn } from "@/utils/cn";
import {
    Wallet,
    Send,
    CreditCard,
    Gift,
    Shield,
    Globe,
    Zap,
    TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

const features = [
    {
        icon: Wallet,
        title: "Multi-Currency Wallet",
        description:
            "Store USDC, USDT, DAI, and more stablecoins all in one secure, decentralized wallet.",
        gradient: "from-brand-purple/20 to-brand-purple/5",
        iconColor: "text-brand-purple",
        borderColor: "group-hover:border-brand-purple/50",
    },
    {
        icon: Send,
        title: "Instant Transfers",
        description:
            "Send stablecoins globally in seconds with near-zero fees. No borders, no delays.",
        gradient: "from-brand-yellow/20 to-brand-yellow/5",
        iconColor: "text-brand-yellow",
        borderColor: "group-hover:border-brand-yellow/50",
    },
    {
        icon: CreditCard,
        title: "Virtual Cards",
        description:
            "Spend your crypto anywhere with our virtual cards. Seamless online shopping experience.",
        gradient: "from-brand-purple/20 to-brand-yellow/10",
        iconColor: "text-brand-white",
        borderColor: "group-hover:border-white/50",
    },
    {
        icon: Gift,
        title: "Earn Rewards",
        description:
            "Get rewarded for holding stables. Earn competitive yields on your digital assets.",
        gradient: "from-brand-yellow/10 to-brand-purple/20",
        iconColor: "text-brand-yellow",
        borderColor: "group-hover:border-brand-yellow/50",
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description:
            "Enterprise-level encryption and multi-sig protection keep your assets safe 24/7.",
        gradient: "from-white/10 to-white/5",
        iconColor: "text-white",
        borderColor: "group-hover:border-white/50",
    },
    {
        icon: Globe,
        title: "Global Access",
        description:
            "Bank without borders. Access your funds from anywhere in the world, anytime.",
        gradient: "from-brand-purple/20 to-brand-purple/5",
        iconColor: "text-brand-purple",
        borderColor: "group-hover:border-brand-purple/50",
    },
];

function FeatureCard({
    feature,
    index,
}: {
    feature: (typeof features)[0];
    index: number;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = feature.icon;

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br p-6 sm:p-8 transition-all duration-500",
                feature.gradient,
                feature.borderColor,
                isHovered && "scale-[1.02]"
            )}
            style={{
                animationDelay: `${index * 100}ms`,
            }}
        >
            {/* Glow effect */}
            <div
                className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-500 bg-gradient-to-br",
                    feature.gradient,
                    isHovered && "opacity-40"
                )}
            />

            {/* Icon */}
            <div
                className={cn(
                    "relative mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-white/5 transition-all duration-300",
                    isHovered && "bg-white/10 scale-110"
                )}
            >
                <Icon
                    className={cn(
                        "h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-300",
                        feature.iconColor
                    )}
                />
            </div>

            {/* Content */}
            <h3 className="relative text-lg sm:text-xl font-bold text-brand-white mb-2 sm:mb-3">
                {feature.title}
            </h3>
            <p className="relative text-sm sm:text-base text-white/70 leading-relaxed">
                {feature.description}
            </p>

            {/* Arrow indicator */}
            <div
                className={cn(
                    "absolute bottom-6 right-6 sm:bottom-8 sm:right-8 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/5 flex items-center justify-center transition-all duration-300",
                    isHovered && "bg-white/10 translate-x-1"
                )}
            >
                <Zap
                    className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 text-white/40 transition-colors duration-300",
                        isHovered && "text-brand-yellow"
                    )}
                />
            </div>
        </div>
    );
}

export default function Features() {
    return (
        <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-purple/5 to-transparent" />

            <div className="max-w-largest mx-auto relative">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-3xl border border-solid border-white/30 px-4 py-2.5 font-sans text-sm sm:text-sm font-normal mb-6">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-brand-yellow" />
                        <span>Powerful Features</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-4 sm:mb-6">
                        Everything You Need to{" "}
                        <span className="text-brand-yellow">Bank Smarter</span>
                    </h2>

                    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-white/70">
                        From secure storage to instant transfers, we&apos;ve built the
                        complete toolkit for the modern digital citizen.
                    </p>
                </div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
