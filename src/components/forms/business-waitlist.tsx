"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function BusinessWaitlistForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: "",
        workEmail: "",
        volume: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
        setFormData({ businessName: "", workEmail: "", volume: "" });
    };

    if (submitted) {
        return (
            <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-brand-black/50 border border-white/10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
                <p className="text-white/60 mb-6">
                    Thanks for your interest in StableBank for Business. We&apos;ll be in touch soon.
                </p>
                <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/5 hover:text-white"
                >
                    Register another business
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-yellow rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-1000" />

            <div className="relative p-8 rounded-[2rem] bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-yellow to-brand-green opacity-50" />

                <h3 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h3>
                <p className="text-white/60 mb-8 text-sm">
                    Get early access to institutional-grade stablecoin banking.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Business Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                            placeholder="Acme Corp"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Work Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.workEmail}
                            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Est. Monthly Volume
                        </label>
                        <select
                            required
                            value={formData.volume}
                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                        >
                            <option value="" disabled className="bg-brand-black text-white/50">Select volume range</option>
                            <option value="<100k" className="bg-brand-black text-white">$0 - $100k</option>
                            <option value="100k-1m" className="bg-brand-black text-white">$100k - $1M</option>
                            <option value="1m-10m" className="bg-brand-black text-white">$1M - $10M</option>
                            <option value="10m+" className="bg-brand-black text-white">$10M+</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple hover:to-brand-purple/80 text-white font-bold text-lg mt-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                Request Access <ArrowRight className="h-5 w-5" />
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
