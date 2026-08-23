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
        iconBg: "bg-brand-purple/10",
        iconColor: "text-brand-purple",
    },
    {
        icon: Send,
        title: "Instant Transfers",
        description:
            "Send stablecoins globally in seconds with near-zero fees. No borders, no delays.",
        iconBg: "bg-indigo-50",
        iconColor: "text-brand-purple",
    },
    {
        icon: CreditCard,
        title: "Virtual Cards",
        description:
            "Spend your crypto anywhere with our virtual cards. Seamless online shopping experience.",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },
    {
        icon: Gift,
        title: "Earn Rewards",
        description:
            "Get rewarded for holding stables. Earn competitive yields on your digital assets.",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
    },
    {
        icon: Shield,
        title: "Bank-Grade Security",
        description:
            "Enterprise-level encryption and multi-sig protection keep your assets safe 24/7.",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
    },
    {
        icon: Globe,
        title: "Global Access",
        description:
            "Bank without borders. Access your funds from anywhere in the world, anytime.",
        iconBg: "bg-purple-50",
        iconColor: "text-brand-purple",
    },
];

function FeatureCard({
    feature,
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
                "group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-md hover:border-brand-purple/40",
                isHovered && "scale-[1.02]"
            )}
        >
            {/* Icon */}
            <div
                className={cn(
                    "relative mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl transition-all duration-300",
                    feature.iconBg,
                    isHovered && "scale-105"
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
            <h3 className="relative text-lg sm:text-xl font-display font-bold text-zinc-950 mb-2 sm:mb-3">
                {feature.title}
            </h3>
            <p className="relative text-sm sm:text-base text-zinc-600 leading-relaxed font-sans">
                {feature.description}
            </p>

            {/* Arrow indicator */}
            <div
                className={cn(
                    "absolute bottom-6 right-6 sm:bottom-8 sm:right-8 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-zinc-100 flex items-center justify-center transition-all duration-300",
                    isHovered && "bg-brand-purple/10 translate-x-1"
                )}
            >
                <Zap
                    className={cn(
                        "h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 transition-colors duration-300",
                        isHovered && "text-brand-purple"
                    )}
                />
            </div>
        </div>
    );
}

export default function Features() {
    return (
        <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
            <div className="max-w-largest mx-auto relative">
                {/* Section header */}
                <div className="text-center mb-12 sm:mb-16 md:mb-20 flex flex-col items-center">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100/80 px-4 py-1.5 font-mono text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-6 shadow-sm">
                        <TrendingUp className="h-3.5 w-3.5 text-brand-purple" />
                        <span>Powerful Features</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 mb-4 sm:mb-6">
                        Everything You Need to{" "}
                        <span className="text-brand-purple">Bank Smarter</span>
                    </h2>

                    <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-zinc-600 font-sans">
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
