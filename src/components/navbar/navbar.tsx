"use client";

import { appRoutes, navLinks } from "@/lib/navigation";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const pathname = usePathname();
  const bordered = false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={cn(
        "max-w-largest bg-brand-black mx-auto flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-10",
        bordered &&
          "mt-[33px] rounded-[40px] border border-[#FEF8F10F] bg-[#000000CC]",
        className
      )}
    >
      {/* Desktop Navigation Links */}
      <ul className="hidden lg:flex items-center gap-6 xl:gap-10">
        {navLinks.map((link) => (
          <li key={link.name} className="">
            <Link
              href={link.href}
              className={`text-base xl:text-lg ${pathname.startsWith(link.href) ? "text-brand-yellow font-bold" : "text-brand-white font-medium"}`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden text-brand-white p-2"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo */}
      <Image
        src={"/images/brand/logo-full.svg"}
        alt="StableBank logo"
        width={165}
        height={20}
        className="h-[16px] sm:h-[20px] w-auto"
      />

      {/* Desktop Auth Buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <Link
          href={appRoutes.auth.signIn}
          className="text-brand-white px-3 lg:px-6 text-sm lg:text-base font-semibold"
        >
          Sign-In
        </Link>
        <Link
          href={appRoutes.auth.signUp}
          className="text-brand-white bg-brand-purple flex h-9 lg:h-10 items-center justify-center rounded-[40px] px-4 lg:px-8 text-sm lg:text-base font-semibold"
        >
          Get started
        </Link>
      </div>

      {/* Mobile Auth Button */}
      <Link
        href={appRoutes.auth.signUp}
        className="sm:hidden text-brand-white bg-brand-purple flex h-9 items-center justify-center rounded-[40px] px-4 text-sm font-semibold"
      >
        Start
      </Link>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-brand-black/95 z-50 px-4 py-6">
          <ul className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl ${pathname.startsWith(link.href) ? "text-brand-yellow font-bold" : "text-brand-white font-medium"}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              href={appRoutes.auth.signIn}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-white text-center py-3 text-lg font-semibold border border-white/20 rounded-[40px]"
            >
              Sign-In
            </Link>
            <Link
              href={appRoutes.auth.signUp}
              onClick={() => setMobileMenuOpen(false)}
              className="text-brand-white bg-brand-purple text-center py-3 text-lg font-semibold rounded-[40px]"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
