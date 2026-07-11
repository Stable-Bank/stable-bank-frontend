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
        company: "",
        institutionType: "",
        phoneNumber: "",
        primaryPlaceOfBusiness: "",
        howDidYouHear: "",
        assetsAmount: "",
        assetsOfInterest: "",
        areasOfInterest: [] as string[],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setSubmitted(true);
    };

    const handleAreaChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            areasOfInterest: prev.areasOfInterest.includes(value)
                ? prev.areasOfInterest.filter(item => item !== value)
                : [...prev.areasOfInterest, value]
        }));
    };

    if (submitted) {
        return (
            <div className="w-full max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-brand-black/50 border border-white/10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Application Received!</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                    Thank you for contacting StableBank. Our institutional onboarding team reviews every application carefully and will be in touch with you shortly.
                </p>
                <Button
                    onClick={() => {
                        setSubmitted(false);
                        setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            company: "",
                            institutionType: "",
                            phoneNumber: "",
                            primaryPlaceOfBusiness: "",
                            howDidYouHear: "",
                            assetsAmount: "",
                            assetsOfInterest: "",
                            areasOfInterest: [],
                        });
                    }}
                    variant="outline"
                    className="rounded-full border-white/20 text-white hover:bg-white/5 hover:text-white px-8 py-3"
                >
                    Submit another application
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-yellow rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition-opacity duration-1000" />

            <div className="relative p-8 sm:p-12 rounded-[2rem] bg-[#0A0A0A] border border-white/10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-purple via-brand-yellow to-brand-green opacity-50" />

                <h3 className="text-3xl font-bold text-white mb-2">Get in touch</h3>
                <p className="text-white/60 mb-8 text-sm">
                    Connect with our institutional coverage team to learn how StableBank can support your digital asset operations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
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
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
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

                    {/* Email & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Work E-mail Address*
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
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Company*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="Acme Corporation"
                            />
                        </div>
                    </div>

                    {/* Institution Type & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Institution Type*
                            </label>
                            <select
                                required
                                value={formData.institutionType}
                                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled className="bg-brand-black text-white/50">Select institution type</option>
                                <option value="Hedge Fund" className="bg-brand-black text-white">Hedge Fund</option>
                                <option value="Venture Capital" className="bg-brand-black text-white">Venture Capital</option>
                                <option value="Asset Manager" className="bg-brand-black text-white">Asset Manager</option>
                                <option value="Wealth Manager" className="bg-brand-black text-white">Wealth Manager / RIA</option>
                                <option value="Crypto Protocol" className="bg-brand-black text-white">Crypto Protocol / Foundation</option>
                                <option value="Corporation" className="bg-brand-black text-white">Corporation</option>
                                <option value="Sovereign / Government" className="bg-brand-black text-white">Sovereign / Government</option>
                                <option value="Other" className="bg-brand-black text-white">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Primary Place of Business & How did you hear about us */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Primary Place of Business*
                            </label>
                            <select
                                required
                                value={formData.primaryPlaceOfBusiness}
                                onChange={(e) => setFormData({ ...formData, primaryPlaceOfBusiness: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled className="bg-brand-black text-white/50">Select region</option>
                                <option value="United States" className="bg-brand-black text-white">United States</option>
                                <option value="United Kingdom" className="bg-brand-black text-white">United Kingdom</option>
                                <option value="European Union" className="bg-brand-black text-white">European Union</option>
                                <option value="Singapore" className="bg-brand-black text-white">Singapore</option>
                                <option value="Hong Kong" className="bg-brand-black text-white">Hong Kong</option>
                                <option value="Switzerland" className="bg-brand-black text-white">Switzerland</option>
                                <option value="United Arab Emirates" className="bg-brand-black text-white">United Arab Emirates</option>
                                <option value="Other" className="bg-brand-black text-white">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                How did you hear about us?
                            </label>
                            <select
                                value={formData.howDidYouHear}
                                onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled className="bg-brand-black text-white/50">Select option</option>
                                <option value="Search Engine" className="bg-brand-black text-white">Search Engine</option>
                                <option value="Social Media" className="bg-brand-black text-white">Social Media</option>
                                <option value="Referral" className="bg-brand-black text-white">Referral / Word of Mouth</option>
                                <option value="Event" className="bg-brand-black text-white">Event / Conference</option>
                                <option value="Press" className="bg-brand-black text-white">Press / News</option>
                                <option value="Other" className="bg-brand-black text-white">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Assets Amount & Assets of Interest */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                Assets Amount
                            </label>
                            <select
                                value={formData.assetsAmount}
                                onChange={(e) => setFormData({ ...formData, assetsAmount: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium appearance-none"
                            >
                                <option value="" disabled className="bg-brand-black text-white/50">Select assets amount</option>
                                <option value="Under $10M" className="bg-brand-black text-white">Under $10M</option>
                                <option value="$10M - $50M" className="bg-brand-black text-white">$10M - $50M</option>
                                <option value="$50M - $250M" className="bg-brand-black text-white">$50M - $250M</option>
                                <option value="$250M - $1B" className="bg-brand-black text-white">$250M - $1B</option>
                                <option value="Over $1B" className="bg-brand-black text-white">Over $1B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">
                                What are your assets of interest?
                            </label>
                            <input
                                type="text"
                                value={formData.assetsOfInterest}
                                onChange={(e) => setFormData({ ...formData, assetsOfInterest: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple focus:bg-white/10 transition-all font-medium"
                                placeholder="USDC, USDT, EURC, BTC, ETH..."
                            />
                        </div>
                    </div>

                    {/* Areas of Interest Checklist */}
                    <div>
                        <label className="block text-sm font-medium text-white/50 uppercase tracking-wider mb-4 ml-1">
                            Areas of Interest*
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                "Trading and financing",
                                "Wealth management",
                                "Stablecoin rewards",
                                "Stablecoin solutions for banks",
                                "Agentic banking",
                                "Atlas settlement network",
                                "Self-custody (Defi)",
                                "Staking",
                                "Custody",
                                "Token management"
                            ].map((option) => (
                                <label key={option} className="flex items-start gap-3 cursor-pointer group/cb">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={formData.areasOfInterest.includes(option)}
                                            onChange={() => handleAreaChange(option)}
                                        />
                                        <div className="w-5 h-5 rounded border border-white/20 bg-white/5 peer-checked:bg-brand-purple peer-checked:border-brand-purple transition-all flex items-center justify-center">
                                            <svg className={`w-3.5 h-3.5 text-white ${formData.areasOfInterest.includes(option) ? 'opacity-100' : 'opacity-0'} transition-opacity`} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-white/70 group-hover/cb:text-white transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-xl bg-gradient-to-r from-brand-purple to-brand-purple hover:to-brand-purple/80 text-white font-bold text-lg mt-6 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
