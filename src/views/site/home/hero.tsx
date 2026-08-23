import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TextMarquee from "@/components/marquee";
import { appRoutes } from "@/lib/navigation";

export default function HeroHome() {
  return (
    <div className="py-12 px-4 sm:py-16 md:py-24 overflow-hidden relative">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] bg-brand-purple/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-4 py-1.5 font-mono text-xs font-semibold text-brand-purple uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-brand-purple" />
          <span>Spend USDT Like Cash</span>
        </div>

        <h1 className="text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-zinc-950 tracking-tight leading-[1.05] max-w-5xl px-4">
          All Stables, One Wallet
        </h1>

        <p className="mx-auto mt-6 max-w-[580px] text-center text-base sm:text-lg md:text-xl text-zinc-600 font-sans leading-relaxed px-4">
          Create virtual cards in seconds to spend your USDT, USDC, and EURC like cash anywhere Visa is accepted. Secure, self-custodial, and zero hidden fees.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 w-full sm:w-auto">
          <Link href={appRoutes.auth.signUp} className="w-full sm:w-auto">
            <Button className="text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-bold rounded-full bg-brand-purple hover:bg-brand-purple/90 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto flex items-center justify-center gap-2">
              <span>Start Banking</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="relative mx-auto flex h-fit justify-center overflow-hidden px-4 mt-8 sm:mt-12">
          <Image
            src={"/images/svg/hero-home-phone.svg"}
            alt="phone"
            width={555}
            height={476}
            priority={true}
            draggable={false}
            className="relative z-[5] w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[555px] h-auto drop-shadow-xl"
          />
          <p className="via-brand-purple/10 absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-10% to-transparent bg-clip-text text-[80px] sm:text-[150px] md:text-[250px] lg:text-[350px] font-display font-black text-transparent whitespace-nowrap select-none pointer-events-none">
            StableBank
          </p>
        </div>
      </div>

      <TextMarquee />
    </div>
  );
}
