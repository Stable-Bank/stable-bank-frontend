"use client";

import { appRoutes, navLinks } from "@/lib/navigation";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

import BrandLogo from "@/components/brand/brand-logo";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 transition-all">
      <nav
        className={cn(
          "max-w-largest mx-auto flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-10",
          className
        )}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-zinc-900 p-2 hover:bg-zinc-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BrandLogo height={22} />
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "text-brand-purple bg-brand-purple/10 font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href={appRoutes.auth.signIn}
            className="text-zinc-700 hover:text-zinc-900 px-4 py-2 text-sm font-semibold rounded-full hover:bg-zinc-100 transition-colors"
          >
            Sign-In
          </Link>
          <Link
            href={appRoutes.auth.signUp}
            className="text-white bg-brand-purple hover:bg-brand-purple/90 flex h-10 items-center justify-center rounded-full px-6 text-sm font-semibold shadow-sm hover:shadow transition-all"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Auth Button */}
        <Link
          href={appRoutes.auth.signUp}
          className="sm:hidden text-white bg-brand-purple flex h-9 items-center justify-center rounded-full px-4 text-sm font-semibold shadow-sm"
        >
          Start
        </Link>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-2xl z-50 px-6 py-8 border-b border-zinc-200">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-lg block py-2 px-3 rounded-xl transition-all ${
                        isActive
                          ? "text-brand-purple bg-brand-purple/10 font-bold"
                          : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href={appRoutes.auth.signIn}
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-800 text-center py-3 text-base font-semibold border border-zinc-300 rounded-full hover:bg-zinc-100 transition-colors"
              >
                Sign-In
              </Link>
              <Link
                href={appRoutes.auth.signUp}
                onClick={() => setMobileMenuOpen(false)}
                className="text-white bg-brand-purple text-center py-3 text-base font-semibold rounded-full shadow-md"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
