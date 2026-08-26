import { Metadata } from "next";
import Link from "next/link";
import { PropsWithChildren } from "react";
import BrandLogo from "@/components/brand/brand-logo";

export const metadata: Metadata = {
  title: "StableBank | Authentication",
  description:
    "Secure, scalable, and decentralized solutions for your digital assets. Experience the future of financial freedom.",
  icons: {
    icon: "/images/brand/favicon.svg",
  },
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4 py-8 sm:px-6 md:px-8">
      {/* Logo */}
      <Link
        href="/"
        className="absolute top-6 sm:top-10 md:top-14 left-1/2 -translate-x-1/2 transform hover:opacity-90 transition-opacity"
      >
        <BrandLogo />
      </Link>

      {/* Form Container */}
      <div className="flex w-full max-w-[460px] flex-col items-center justify-center pt-20 sm:pt-24 md:pt-32">
        {children}
      </div>
    </div>
  );
}
