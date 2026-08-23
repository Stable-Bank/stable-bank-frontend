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
            <div className="max-w-largest mx-auto relative">
                <div className="relative rounded-3xl sm:rounded-[36px] overflow-hidden border border-zinc-200 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/60 shadow-lg">
                    {/* Content */}
                    <div className="relative px-6 sm:px-10 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-24">
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            {/* Left side - Text content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-1.5 mb-6 sm:mb-8 font-mono text-xs font-semibold text-brand-purple uppercase tracking-wider shadow-sm">
                                    <Sparkles className="h-3.5 w-3.5 text-brand-purple" />
                                    <span>Start Your Journey</span>
                                </div>

                                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 mb-4 sm:mb-6 leading-tight">
                                    Ready to Bank{" "}
                                    <span className="text-brand-purple">
                                        Without Limits?
                                    </span>
                                </h2>

                                <p className="text-base sm:text-lg md:text-xl text-zinc-600 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 font-sans">
                                    Join thousands of global citizens who are already experiencing
                                    the future of finance. No banks, no borders, just freedom.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link href={appRoutes.auth.signUp}>
                                        <Button className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                                            Get Started Free
                                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                    <Link href="/about">
                                        <Button
                                            variant="outline"
                                            className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold rounded-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 shadow-sm"
                                        >
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-zinc-500 font-mono font-medium">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>No Credit Check</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>Instant Setup</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span>100% Secure</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Visual */}
                            <div className="relative flex justify-center lg:justify-end">
                                <div className="relative">
                                    {/* Card mockup */}
                                    <div className="relative">
                                        <Image
                                            src="/images/brand/stablebank-card-back.svg"
                                            alt="StableBank Card"
                                            width={400}
                                            height={250}
                                            className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-auto transform rotate-[-8deg] hover:rotate-0 transition-transform duration-500 drop-shadow-2xl"
                                            draggable={false}
                                        />
                                    </div>

                                    {/* Floating elements */}
                                    <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white border border-zinc-200 shadow-lg flex items-center justify-center animate-bounce">
                                        <span className="text-xl sm:text-2xl">💳</span>
                                    </div>
                                    <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-white border border-zinc-200 shadow-lg flex items-center justify-center animate-pulse">
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
