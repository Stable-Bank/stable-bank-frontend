"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function InstitutionsWaitlistForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        businessName: "",
        businessStructure: "",
        websiteUrl: "",
        country: "",
        kastTag: "",
        mustHaves: [] as string[],
        willingnessToPay: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
    };

    const handleMustHaveChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            mustHaves: prev.mustHaves.includes(value)
                ? prev.mustHaves.filter(item => item !== value)
                : [...prev.mustHaves, value]
        }));
    };

    if (submitted) {
        return (
            <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-brand-black/50 border border-white/10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Received!</h3>
                <p className="text-white/60 mb-6">
                    We review every application individually. We&apos;ll be in touch soon regarding your access to StableBank Institutions.
                </p>
                <Button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({
                            firstName: "", lastName: "", email: "", businessName: "", businessStructure: "", websiteUrl: "", country: "", kastTag: "", mustHaves: [], willingnessToPay: ""
                        });
                    }}
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/5 hover:text-white"
                >
                    Submit another application
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-yellow rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-1000" />

            <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-yellow to-brand-green opacity-50" />

                <h3 className="text-2xl font-bold text-white mb-2">Request Institutional Access</h3>
                <p className="text-white/60 mb-8 text-sm">
                    We are rolling out our institutional tier in phases. Our team reviews every application carefully to ensure we provide the best onboarding experience.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                First Name*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="Jane"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Last Name*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Email*
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                            placeholder="jane@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Business Name*
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Business structure*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.businessStructure}
                                onChange={(e) => setFormData({ ...formData, businessStructure: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="LLC, C-Corp, etc."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Website/URL*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.websiteUrl}
                                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="https://acme.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Country*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="United States"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                StableBank Tag
                            </label>
                            <input
                                type="text"
                                value={formData.kastTag}
                                onChange={(e) => setFormData({ ...formData, kastTag: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="$janedoe"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-3 ml-1">
                            Must-haves in a business product?*
                        </label>
                        <div className="space-y-3">
                            {[
                                "Instant On-chain Settlement",
                                "Global Bank Transfers (Fiat Integration)",
                                "Programmable Corporate Cards",
                                "Yield Generation / Cashback",
                                "Qualified Custody & Insured Funds",
                                "Advanced Expense Management & Approvals",
                                "Dedicated Institutional Account Director"
                            ].map((option) => (
                                <label key={option} className="flex items-start gap-3 cursor-pointer group/cb">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={formData.mustHaves.includes(option)}
                                            onChange={() => handleMustHaveChange(option)}
                                        />
                                        <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-brand-purple peer-checked:border-brand-purple transition-all flex items-center justify-center">
                                            <svg className={`w-3.5 h-3.5 text-white ${formData.mustHaves.includes(option) ? 'opacity-100' : 'opacity-0'} transition-opacity`} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-white/70 group-hover/cb:text-white transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                            Willing to pay for a global solution?*
                        </label>
                        <select
                            required
                            value={formData.willingnessToPay}
                            onChange={(e) => setFormData({ ...formData, willingnessToPay: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                        >
                            <option value="" disabled className="bg-brand-black text-white/50">Select an amount</option>
                            <option value="$0" className="bg-brand-black text-white">$0</option>
                            <option value="$100" className="bg-brand-black text-white">$100 / month</option>
                            <option value="$500" className="bg-brand-black text-white">$500 / month</option>
                            <option value="$1000" className="bg-brand-black text-white">$1000 / month</option>
                            <option value="$3000" className="bg-brand-black text-white">$3000 / month</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple hover:to-brand-purple/80 text-white font-bold text-lg mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
