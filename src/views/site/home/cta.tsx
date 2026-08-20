"use client";

import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CTA() {
    return (
        <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
            {/* Background gradient orbs */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-purple/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-largest mx-auto relative">
                <div className="relative rounded-[32px] sm:rounded-[48px] overflow-hidden">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple via-brand-yellow/50 to-brand-purple p-[1px] rounded-[32px] sm:rounded-[48px]">
                        <div className="absolute inset-[1px] bg-brand-black rounded-[31px] sm:rounded-[47px]" />
                    </div>

                    {/* Content */}
                    <div className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Left side - Text content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/20 px-4 py-2 mb-6 sm:mb-8">
                                    <Sparkles className="h-4 w-4 text-brand-yellow" />
                                    <span className="text-sm font-medium text-brand-yellow">
                                        Start Your Journey
                                    </span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-white mb-4 sm:mb-6 leading-tight">
                                    Ready to Bank{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow to-brand-purple">
                                        Without Limits?
                                    </span>
                                </h2>

                                <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0">
                                    Join thousands of global citizens who are already experiencing
                                    the future of finance. No banks, no borders, just freedom.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link href={appRoutes.auth.signUp}>
                                        <Button className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white group">
                                            Get Started Free
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href="/about">
                                        <Button
                                            variant="outline"
                                            className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-white/50">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-400" />
                                        <span>No Credit Check</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-400" />
                                        <span>Instant Setup</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-400" />
                                        <span>100% Secure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Visual */}
                            <div className="relative flex justify-center lg:justify-end">
                                <div className="relative">
                                    {/* Glow behind card */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/40 to-brand-yellow/20 blur-3xl scale-150" />

                                    {/* Card mockup */}
                                    <div className="relative">
                                        <Image
                                            src="/images/brand/stablebank-card-back.svg"
                                            alt="StableBank Card"
                                            width={400}
                                            height={250}
                                            className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-auto transform rotate-[-8deg] hover:rotate-0 transition-transform duration-500"
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Floating elements */}
                                    <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-brand-yellow/20 backdrop-blur-sm flex items-center justify-center animate-bounce">
                                        <span className="text-xl sm:text-2xl">💳</span>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-brand-purple/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                        <span className="text-xl sm:text-2xl">🌍</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
