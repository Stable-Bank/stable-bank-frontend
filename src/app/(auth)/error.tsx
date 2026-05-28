"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="bg-brand-black relative grid min-h-screen grid-cols-1 lg:grid-cols-2 text-white">
      {/* Mobile Background with Overlay */}
      <div className="lg:hidden absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-brand-black/90 to-brand-black" />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12 md:px-8 lg:px-[5%] lg:py-0">
        <div className="flex w-full max-w-[480px] flex-col items-center justify-center gap-10 sm:gap-12">
          <div className="w-full">
            <Link href="/">
              <Image
                src={"/images/brand/logo-full.svg"}
                alt="stable bank logo"
                width={300}
                height={35}
                className="h-7 sm:h-8 md:h-9 w-auto"
              />
            </Link>
          </div>
          <div className="flex w-full flex-col gap-6 sm:gap-8">
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex w-fit items-center gap-2 rounded-3xl border border-solid border-destructive px-3 py-2.5 font-sans">
                <span className="aspect-square h-[9px] w-[9px] rounded-full bg-destructive" />
                <span className="text-sm sm:text-sm font-normal">
                  Authentication Error
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                Unable to <br />
                <span className="text-brand-purple">Authenticate</span>
              </h1>
              <p className="text-base sm:text-lg font-normal text-muted-foreground">
                We encountered an issue during authentication. Please try again
                or contact support if the problem continues.
              </p>
              {error.digest && (
                <p className="text-sm text-muted-foreground font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                size="lg"
                onClick={reset}
                className="flex-1 bg-brand-purple hover:bg-brand-purple/90 rounded-[40px] px-6 py-6 text-base sm:text-lg font-semibold"
              >
                Try Again
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-brand-purple rounded-[40px] border-[1.5px] px-6 py-6 text-base sm:text-lg font-semibold"
                >
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Illustration Section */}
      <div className="hidden lg:flex relative items-center justify-center bg-gradient-to-br from-destructive/10 to-brand-black">
        <div className="relative w-full h-full flex items-center justify-center p-12">
          <div className="text-center space-y-6">
            <div className="text-[120px] font-extrabold text-destructive/20 leading-none">
              AUTH
            </div>
            <div className="text-2xl font-semibold text-muted-foreground">
              Authentication failed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
