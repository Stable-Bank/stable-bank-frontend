"use client";

import { navLinks } from "@/lib/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Twitter, MessageCircle, Mail, ArrowUpRight } from "lucide-react";

const footerSections = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "StableBank Business", href: "/businesses" },
            { label: "StableBank Institution", href: "/institutions" },
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
        <footer className="relative pt-16 sm:pt-20 md:pt-28 pb-8 px-4 sm:px-6 lg:px-10 border-t border-zinc-200 bg-zinc-50/80">
            <div className="max-w-largest mx-auto relative">
                {/* Main footer content */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 mb-12 sm:mb-16">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/images/brand/full-logo-purple.svg"
                                alt="StableBank"
                                width={165}
                                height={20}
                                className="h-5 sm:h-6 w-auto"
                            />
                        </Link>
                        <p className="text-zinc-600 text-sm sm:text-base max-w-[280px] mb-6">
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
                                    className="h-10 w-10 rounded-full bg-zinc-200/80 hover:bg-brand-purple/15 flex items-center justify-center transition-colors duration-300 group"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4 text-zinc-600 group-hover:text-brand-purple transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-zinc-900 font-mono font-semibold text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-zinc-600 hover:text-brand-purple text-sm transition-colors duration-200 inline-flex items-center gap-1 group font-medium"
                                        >
                                            {link.label}
                                            <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all text-brand-purple" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Newsletter signup */}
                <div className="border-t border-b border-zinc-200 py-8 sm:py-10 mb-8 sm:mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-zinc-900 font-bold text-lg sm:text-xl mb-1">
                                Stay in the loop
                            </h3>
                            <p className="text-zinc-600 text-sm sm:text-base">
                                Get updates on new features and exclusive offers.
                            </p>
                        </div>
                        <form onSubmit={(e) => e.preventDefault()} className="flex w-full md:w-auto gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 md:w-72 h-12 px-5 rounded-full bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all text-sm"
                            />
                            <button
                                type="submit"
                                className="h-12 px-6 sm:px-8 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-zinc-500 font-mono">
                    <p>© {new Date().getFullYear()} StableBank. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        {navLinks.slice(0, 4).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="hover:text-zinc-900 transition-colors"
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
