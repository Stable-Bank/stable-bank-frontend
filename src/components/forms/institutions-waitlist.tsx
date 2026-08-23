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
            <div className="w-full max-w-2xl mx-auto p-8 sm:p-12 rounded-2xl bg-white border border-zinc-200 text-center shadow-lg animate-in fade-in zoom-in duration-300">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-zinc-950 mb-2">Application Received!</h3>
                <p className="text-zinc-600 mb-6 max-w-md mx-auto font-sans text-sm sm:text-base">
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
                    className="rounded-full border-zinc-300 text-zinc-800 hover:bg-zinc-100 px-8 py-3"
                >
                    Submit another application
                </Button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto relative group">
            <div className="relative p-8 sm:p-12 rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-hidden">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 mb-1">Get in touch</h3>
                <p className="text-zinc-600 mb-8 text-sm font-sans">
                    Connect with our institutional coverage team to learn how StableBank can support your digital asset operations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                First Name*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="Jane"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Last Name*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    {/* Email & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Work E-mail Address*
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="jane@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Company*
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="Acme Corporation"
                            />
                        </div>
                    </div>

                    {/* Institution Type & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Institution Type*
                            </label>
                            <select
                                required
                                value={formData.institutionType}
                                onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            >
                                <option value="" disabled className="bg-white text-zinc-500">Select institution type</option>
                                <option value="Hedge Fund" className="bg-white text-zinc-900">Hedge Fund</option>
                                <option value="Venture Capital" className="bg-white text-zinc-900">Venture Capital</option>
                                <option value="Asset Manager" className="bg-white text-zinc-900">Asset Manager</option>
                                <option value="Wealth Manager" className="bg-white text-zinc-900">Wealth Manager / RIA</option>
                                <option value="Crypto Protocol" className="bg-white text-zinc-900">Crypto Protocol / Foundation</option>
                                <option value="Corporation" className="bg-white text-zinc-900">Corporation</option>
                                <option value="Sovereign / Government" className="bg-white text-zinc-900">Sovereign / Government</option>
                                <option value="Other" className="bg-white text-zinc-900">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Primary Place of Business & How did you hear about us */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Primary Place of Business*
                            </label>
                            <select
                                required
                                value={formData.primaryPlaceOfBusiness}
                                onChange={(e) => setFormData({ ...formData, primaryPlaceOfBusiness: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            >
                                <option value="" disabled className="bg-white text-zinc-500">Select region</option>
                                <option value="United States" className="bg-white text-zinc-900">United States</option>
                                <option value="United Kingdom" className="bg-white text-zinc-900">United Kingdom</option>
                                <option value="European Union" className="bg-white text-zinc-900">European Union</option>
                                <option value="Singapore" className="bg-white text-zinc-900">Singapore</option>
                                <option value="Hong Kong" className="bg-white text-zinc-900">Hong Kong</option>
                                <option value="Switzerland" className="bg-white text-zinc-900">Switzerland</option>
                                <option value="United Arab Emirates" className="bg-white text-zinc-900">United Arab Emirates</option>
                                <option value="Other" className="bg-white text-zinc-900">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                How did you hear about us?
                            </label>
                            <select
                                value={formData.howDidYouHear}
                                onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            >
                                <option value="" disabled className="bg-white text-zinc-500">Select option</option>
                                <option value="Search Engine" className="bg-white text-zinc-900">Search Engine</option>
                                <option value="Social Media" className="bg-white text-zinc-900">Social Media</option>
                                <option value="Referral" className="bg-white text-zinc-900">Referral / Word of Mouth</option>
                                <option value="Event" className="bg-white text-zinc-900">Event / Conference</option>
                                <option value="Press" className="bg-white text-zinc-900">Press / News</option>
                                <option value="Other" className="bg-white text-zinc-900">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Assets Amount & Assets of Interest */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                Assets Amount
                            </label>
                            <select
                                value={formData.assetsAmount}
                                onChange={(e) => setFormData({ ...formData, assetsAmount: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                            >
                                <option value="" disabled className="bg-white text-zinc-500">Select assets amount</option>
                                <option value="Under $10M" className="bg-white text-zinc-900">Under $10M</option>
                                <option value="$10M - $50M" className="bg-white text-zinc-900">$10M - $50M</option>
                                <option value="$50M - $250M" className="bg-white text-zinc-900">$50M - $250M</option>
                                <option value="$250M - $1B" className="bg-white text-zinc-900">$250M - $1B</option>
                                <option value="Over $1B" className="bg-white text-zinc-900">Over $1B</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2 ml-1">
                                What are your assets of interest?
                            </label>
                            <input
                                type="text"
                                value={formData.assetsOfInterest}
                                onChange={(e) => setFormData({ ...formData, assetsOfInterest: e.target.value })}
                                className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-all font-sans text-sm"
                                placeholder="USDC, USDT, EURC, BTC, ETH..."
                            />
                        </div>
                    </div>

                    {/* Areas of Interest Checklist */}
                    <div>
                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-3 ml-1">
                            Areas of Interest*
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                                <label key={option} className="flex items-start gap-2.5 cursor-pointer group/cb">
                                    <div className="relative flex items-center justify-center mt-0.5">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={formData.areasOfInterest.includes(option)}
                                            onChange={() => handleAreaChange(option)}
                                        />
                                        <div className="w-4 h-4 rounded border border-zinc-300 bg-zinc-50 peer-checked:bg-brand-purple peer-checked:border-brand-purple transition-all flex items-center justify-center">
                                            <svg className={`w-3 h-3 text-white ${formData.areasOfInterest.includes(option) ? 'opacity-100' : 'opacity-0'} transition-opacity`} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-xs sm:text-sm text-zinc-700 group-hover/cb:text-zinc-950 font-sans transition-colors">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-base mt-4 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
