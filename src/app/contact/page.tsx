"use client";

import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import { Button } from "@/components/ui/button";
import {
    Mail,
    MessageCircle,
    Twitter,
    MapPin,
    Send,
    ChevronDown,
    CheckCircle,
} from "lucide-react";
import React, { useState } from "react";

const contactInfo = [
    {
        icon: Mail,
        title: "Email Us",
        description: "Our team will respond within 24 hours",
        value: "support@stablebank.io",
        href: "mailto:support@stablebank.io",
    },
    {
        icon: MessageCircle,
        title: "Discord Community",
        description: "Join 10,000+ community members",
        value: "discord.gg/stablebank",
        href: "https://discord.gg/stablebank",
    },
    {
        icon: Twitter,
        title: "Twitter/X",
        description: "Follow us for updates",
        value: "@stablebank",
        href: "https://twitter.com/stablebank",
    },
    {
        icon: MapPin,
        title: "Headquarters",
        description: "Visit our office",
        value: "San Francisco, CA",
        href: "#",
    },
];

const faqs = [
    {
        question: "How do I create an account?",
        answer:
            "Creating an account is simple! Click 'Get Started', enter your email and set a password. You'll receive a verification email to confirm your account. The whole process takes less than 2 minutes.",
    },
    {
        question: "What stablecoins do you support?",
        answer:
            "We currently support USDC, USDT, DAI, BUSD, and FRAX. We're constantly adding support for more stablecoins based on user demand and security assessments.",
    },
    {
        question: "Are there any fees for transfers?",
        answer:
            "StableBank charges minimal fees for transfers. Internal transfers between StableBank users are completely free. External blockchain transfers have a flat fee of $0.50, regardless of amount.",
    },
    {
        question: "How secure is my money?",
        answer:
            "Your assets are protected by military-grade encryption, multi-signature wallets, and 24/7 monitoring. We also maintain insurance coverage for user deposits and undergo regular security audits.",
    },
    {
        question: "Can I use StableBank in my country?",
        answer:
            "StableBank is available in 120+ countries. Check our supported regions page for the full list. Due to regulatory requirements, some features may vary by location.",
    },
];

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border-b border-zinc-200">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
            >
                <span className="text-base sm:text-lg font-medium text-zinc-900 group-hover:text-brand-purple transition-colors pr-4">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`h-5 w-5 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-purple" : ""
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"
                    }`}
            >
                <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-sans">
                    {faq.answer}
                </p>
            </div>
        </div>
    );
}

export default function ContactPage() {
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    return (
        <SiteLayout>
            {/* Hero */}
            <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
                        <SectionCard title="Contact Us" category="SUPPORT" />
                        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-black text-zinc-950">
                            Get in <span className="text-brand-purple">Touch</span>
                        </h1>
                        <p className="mt-4 text-lg sm:text-xl text-zinc-600 font-sans">
                            Have questions or need help? We&apos;re here for you. Reach out
                            through any channel below.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="pb-16 sm:pb-20 px-4 sm:px-6 lg:px-10">
                <div className="max-w-largest mx-auto">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {contactInfo.map((info) => (
                            <a
                                key={info.title}
                                href={info.href}
                                target={info.href.startsWith("http") ? "_blank" : undefined}
                                rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                className="group p-6 rounded-2xl border border-zinc-200 bg-white hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 shadow-sm"
                            >
                                <div className="h-12 w-12 rounded-xl bg-brand-purple/10 group-hover:bg-brand-purple flex items-center justify-center mb-4 transition-colors">
                                    <info.icon className="h-6 w-6 text-brand-purple group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-display font-bold text-zinc-950 mb-1">
                                    {info.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 mb-3 font-sans">{info.description}</p>
                                <span className="text-xs sm:text-sm text-brand-purple font-mono font-medium">
                                    {info.value}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & FAQ */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 border-t border-zinc-200 bg-zinc-50/50">
                <div className="max-w-largest mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Form */}
                        <div className="p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 mb-6">
                                Send us a message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                                            Your Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            placeholder="John Doe"
                                            required
                                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm font-sans"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            placeholder="john@example.com"
                                            required
                                            className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm font-sans"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                        placeholder="How can we help?"
                                        required
                                        className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors text-sm font-sans"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) =>
                                            setFormData({ ...formData, message: e.target.value })
                                        }
                                        placeholder="Tell us more about your inquiry..."
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:bg-white transition-colors resize-none text-sm font-sans"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={formSubmitted}
                                    className="w-full sm:w-auto h-12 px-8 rounded-full text-base font-bold bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {formSubmitted ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="border-t border-zinc-200">
                                {faqs.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        faq={faq}
                                        isOpen={openFAQ === index}
                                        onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
