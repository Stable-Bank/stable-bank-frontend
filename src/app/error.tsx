"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/brand/brand-logo";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-white relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-zinc-950">
      {/* Mobile Background with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div className="absolute inset-0 bg-zinc-50/50" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-start justify-center gap-10 sm:gap-12 md:gap-16 lg:gap-20">
          <div className="w-full">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BrandLogo />
            </Link>
          </div>
          <div className="flex w-full flex-col gap-6 sm:gap-8 md:gap-10">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
              <div className="flex w-fit items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-1.5 font-mono text-xs font-semibold text-red-700 uppercase tracking-wider shadow-sm">
                <span className="aspect-square h-2 w-2 rounded-full bg-red-600" />
                <span>
                  Something Went Wrong
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black leading-tight text-zinc-950">
                Oops! <br />
                <span className="text-brand-purple">Error Occurred</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-[22px] font-normal text-zinc-600 font-sans">
                We encountered an unexpected error. Don&apos;t worry, your funds are
                safe. Try again or contact support if the issue persists.
              </p>
              {error.digest && (
                <p className="text-xs text-zinc-500 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full">
              <Button
                size="lg"
                onClick={reset}
                className="flex-1 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full px-6 sm:px-8 py-6 text-base sm:text-lg font-bold shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Try Again
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 rounded-full border-[1.5px] px-6 sm:px-8 py-6 text-base sm:text-lg font-semibold shadow-sm transition-all"
                >
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Illustration Section */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-red-50/40 via-purple-50/20 to-zinc-50 border-l border-zinc-200">
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-center space-y-6">
            <div className="text-[120px] font-mono font-black text-red-500/10 leading-none select-none">
              ERROR
            </div>
            <div className="text-2xl font-display font-bold text-zinc-600">
              Transaction failed to process
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
