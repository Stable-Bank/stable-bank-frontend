"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/brand/brand-logo";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-zinc-50 relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-zinc-950">
      {/* Mobile Background with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-center justify-center gap-10 sm:gap-12">
          <div className="w-full">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo />
            </Link>
          </div>
          <div className="flex w-full flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 font-sans">
                <span className="aspect-square h-2 w-2 rounded-full bg-red-500" />
                <span className="text-xs sm:text-sm font-semibold text-red-600">
                  Authentication Error
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight text-zinc-950">
                Unable to <br />
                <span className="text-brand-purple">Authenticate</span>
              </h1>
              <p className="text-sm sm:text-base font-sans font-normal text-zinc-600">
                We encountered an issue during authentication. Please try again
                or contact support if the problem continues.
              </p>
              {error.digest && (
                <p className="text-xs text-zinc-400 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                size="lg"
                onClick={reset}
                className="flex-1 bg-brand-purple hover:bg-brand-purple/90 rounded-full px-6 py-6 text-sm sm:text-base font-sans font-bold shadow-md shadow-brand-purple/20 cursor-pointer"
              >
                Try Again
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full px-6 py-6 text-sm sm:text-base font-sans font-bold cursor-pointer"
                >
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Illustration Section */}
      <div className="hidden lg:flex relative items-center justify-center bg-zinc-100 border-l border-zinc-200">
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <div className="text-[100px] font-display font-black text-red-200 leading-none">
              AUTH
            </div>
            <div className="text-xl font-display font-bold text-zinc-500">
              Authentication failed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
