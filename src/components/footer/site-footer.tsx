import { navLinks, UFooterLinks } from "@/lib/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Twitter, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Virtual Cards", href: "/dashboard/vcard" },
            { label: "Rewards", href: "/dashboard/rewards" },
            { label: "Security", href: "/about#security" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Resources",
        links: [
            { label: "Help Center", href: "/help" },
            { label: "Documentation", href: "/docs" },
            { label: "API", href: "/api" },
            { label: "Status", href: "/status" },
        ],
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Service", href: "/terms" },
            { label: "Cookie Policy", href: "/cookies" },
            { label: "Licenses", href: "/licenses" },
        ],
    },
];

const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/stablebank", label: "Twitter" },
    { icon: MessageCircle, href: "https://discord.gg/stablebank", label: "Discord" },
    { icon: Mail, href: "mailto:support@stablebank.io", label: "Email" },
];

export default function SiteFooter() {
    return (
        <footer className="relative pt-16 sm:pt-20 md:pt-28 pb-8 px-4 sm:px-6 lg:px-10 border-t border-white/5">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-purple/5 to-transparent pointer-events-none" />

            <div className="max-w-largest mx-auto relative">
                {/* Main footer content */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12 sm:mb-16">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/images/brand/logo-full.svg"
                                alt="StableBank"
                                width={165}
                                height={20}
                                className="h-5 sm:h-6 w-auto"
                            />
                        </Link>
                        <p className="text-white/60 text-sm sm:text-base max-w-[280px] mb-6">
                            The future of banking is decentralized. Store, send, and spend
                            stablecoins anywhere in the world.
                        </p>

                        {/* Social links */}
                        <div className="flex items-center gap-4">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 w-10 rounded-full bg-white/5 hover:bg-brand-purple/20 flex items-center justify-center transition-colors duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4 text-white/60 group-hover:text-brand-purple transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-brand-white font-semibold text-sm sm:text-base mb-4 sm:mb-6">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-white/50 hover:text-brand-white text-sm transition-colors duration-200 inline-flex items-center gap-1 group"
                                        >
                                            {link.label}
                                            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter signup */}
                <div className="border-t border-b border-white/5 py-8 sm:py-10 mb-8 sm:mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-brand-white font-semibold text-lg sm:text-xl mb-2">
                                Stay in the loop
                            </h3>
                            <p className="text-white/50 text-sm sm:text-base">
                                Get updates on new features and exclusive offers.
                            </p>
                        </div>
                        <form className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-64 h-12 px-5 rounded-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-purple transition-colors"
                            />
                            <button
                                type="submit"
                                className="h-12 px-6 sm:px-8 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold transition-colors whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>© {new Date().getFullYear()} StableBank. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {navLinks.slice(0, 3).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="hover:text-white/70 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
