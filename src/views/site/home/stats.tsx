"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useState, useRef } from "react";

const stats = [
    {
        value: 50000,
        suffix: "+",
        label: "Active Users",
        description: "Trust StableBank",
    },
    {
        value: 2.5,
        suffix: "M+",
        label: "Transactions",
        description: "Processed Monthly",
    },
    {
        value: 120,
        suffix: "+",
        label: "Countries",
        description: "Worldwide Reach",
    },
    {
        value: 100,
        suffix: "M+",
        prefix: "$",
        label: "Total Value Locked",
        description: "Secured Assets",
    },
];

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0);
    const countRef = useRef(0);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!start) return;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = easeOut * end;

            countRef.current = currentCount;
            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);

        return () => {
            startTimeRef.current = null;
        };
    }, [end, duration, start]);

    return count;
}

function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    const count = useCountUp(stat.value, 2000, isVisible);

    const formatNumber = (num: number) => {
        if (stat.value >= 1000000) {
            return num.toFixed(1);
        } else if (stat.value >= 1000) {
            return Math.round(num).toLocaleString();
        }
        return num.toFixed(stat.value % 1 !== 0 ? 1 : 0);
    };

    return (
        <div
            ref={cardRef}
            className={cn(
                "group relative text-center px-4 sm:px-6 py-8 sm:py-10 transition-all duration-700 transform rounded-2xl bg-white border border-zinc-200 shadow-sm hover:shadow-md",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
        >
            {/* Value */}
            <div className="relative mb-2">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-mono font-black text-brand-purple tracking-tight">
                    {stat.prefix}
                    {formatNumber(count)}
                    {stat.suffix}
                </span>
            </div>

            {/* Label */}
            <h3 className="relative text-base sm:text-lg font-bold text-zinc-900 mb-1 font-sans">
                {stat.label}
            </h3>
            <p className="relative text-xs sm:text-sm text-zinc-500 font-sans">
                {stat.description}
            </p>
        </div>
    );
}

export default function Stats() {
    return (
        <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
            <div className="max-w-largest mx-auto relative">
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} stat={stat} delay={index * 150} />
                    ))}
                </div>
            </div>
        </section>
    );
}
