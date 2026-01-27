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
        <div className="border-b border-white/10">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-base sm:text-lg font-medium text-brand-white group-hover:text-brand-yellow transition-colors pr-4">
                    {faq.question}
                </span>
                <ChevronDown
                    className={`h-5 w-5 text-white/40 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-brand-purple" : ""
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-6" : "max-h-0"
                    }`}
            >
                <p className="text-white/60 text-sm sm:text-base leading-relaxed">
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
                    <div className="text-center max-w-3xl mx-auto">
                        <SectionCard title="Contact Us" />
                        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold text-brand-white">
                            Get in <span className="text-brand-yellow">Touch</span>
                        </h1>
                        <p className="mt-4 text-lg sm:text-xl text-white/60">
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
                                className="group p-6 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-brand-purple/10 hover:border-brand-purple/30 transition-all duration-300"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-brand-purple/20 group-hover:bg-brand-purple flex items-center justify-center mb-4 transition-colors">
                                    <info.icon className="h-6 w-6 text-brand-purple group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-semibold text-brand-white mb-1">
                                    {info.title}
                                </h3>
                                <p className="text-sm text-white/50 mb-3">{info.description}</p>
                                <span className="text-sm text-brand-purple font-medium">
                                    {info.value}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & FAQ */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-10 bg-gradient-to-b from-brand-purple/5 to-transparent">
                <div className="max-w-largest mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-brand-white mb-6">
                                Send us a message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
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
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-white/70 mb-2">
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
                                            className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
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
                                        className="w-full h-12 px-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
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
                                        className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors resize-none"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={formSubmitted}
                                    className="w-full sm:w-auto h-12 px-8 rounded-full text-base font-semibold"
                                >
                                    {formSubmitted ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                            Message Sent!
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-brand-white mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="border-t border-white/10">
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
