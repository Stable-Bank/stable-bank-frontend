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
            <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white border border-zinc-200 text-center shadow-lg animate-in fade-in zoom-in duration-300">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-display font-bold text-zinc-950 mb-2">You&apos;re on the list!</h3>
                <p className="text-zinc-600 text-sm mb-6 font-sans">
                    Thanks for your interest in StableBank for Business. We&apos;ll be in touch soon.
                </p>
                <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full border-zinc-300 text-zinc-800 hover:bg-zinc-100"
                >
                    Register another business
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto relative group">
            <div className="relative p-8 rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-hidden">
                <h3 className="text-2xl font-display font-bold text-zinc-950 mb-1">Join the Waitlist</h3>
                <p className="text-zinc-600 mb-6 text-sm font-sans">
                    Get early access to institutional-grade stablecoin banking.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Business Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            placeholder="Acme Corp"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Work Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.workEmail}
                            onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            placeholder="name@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                            Est. Monthly Volume
                        </label>
                        <select
                            required
                            value={formData.volume}
                            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                        >
                            <option value="" disabled className="bg-white text-zinc-500">Select volume range</option>
                            <option value="<100k" className="bg-white text-zinc-900">$0 - $100k</option>
                            <option value="100k-1m" className="bg-white text-zinc-900">$100k - $1M</option>
                            <option value="1m-10m" className="bg-white text-zinc-900">$1M - $10M</option>
                            <option value="10m+" className="bg-white text-zinc-900">$10M+</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-base mt-2 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
