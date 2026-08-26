import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowRight, CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { appRoutes } from "@/lib/navigation";
import SectionCard from "@/components/cards/section";

export default function HeroHome() {
  return (
    <div className="py-12 px-4 sm:py-16 md:py-24 overflow-hidden relative">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-brand-purple/15 via-[#EEF8A8]/30 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[350px] h-[250px] bg-[#D4E972]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6">
          <SectionCard title="Spend USDT Like Cash" category="DEFI BANKING" variant="yellow" />
        </div>

        <h1 className="text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-zinc-950 tracking-tight leading-[1.05] max-w-5xl px-4">
          All Stables, One Wallet
        </h1>

        <p className="mx-auto mt-6 max-w-[580px] text-center text-base sm:text-lg md:text-xl text-zinc-600 font-sans leading-relaxed px-4">
          Create virtual cards in seconds to spend your USDT, USDC, and EURC like cash anywhere Visa is accepted. Secure, self-custodial, and zero hidden fees.
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 px-4 w-full sm:w-auto">
          <Link href={appRoutes.auth.signUp} className="w-full sm:w-auto">
            <Button className="text-white h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-sans font-bold rounded-full bg-brand-purple hover:bg-brand-purple/90 shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer">
              <span>Start Banking</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Live-Fidelity Mobile Dashboard Device Frame */}
        <div className="relative mx-auto flex h-fit justify-center px-4 mt-12 sm:mt-16 w-full max-w-4xl">
          {/* Watermark Logo behind phone */}
          <p className="via-brand-purple/10 absolute left-1/2 -translate-x-1/2 top-10 bg-gradient-to-r from-transparent via-15% to-transparent bg-clip-text text-[80px] sm:text-[150px] md:text-[230px] lg:text-[300px] font-display font-black text-transparent whitespace-nowrap select-none pointer-events-none z-0">
            StableBank
          </p>

          {/* Left Floating Context Pill */}
          <div className="hidden lg:flex absolute left-4 xl:left-8 top-28 z-20 items-center gap-3 rounded-2xl bg-white/95 border border-zinc-200 p-3.5 shadow-xl backdrop-blur-xl animate-float">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">Visa Network</span>
              <span className="text-xs font-sans font-bold text-zinc-900">Instant POS Settlement</span>
            </div>
          </div>

          {/* Right Floating Context Pill */}
          <div className="hidden lg:flex absolute right-4 xl:right-8 bottom-32 z-20 items-center gap-3 rounded-2xl bg-white/95 border border-zinc-200 p-3.5 shadow-xl backdrop-blur-xl animate-float" style={{ animationDelay: "2s" }}>
            <div className="h-10 w-10 rounded-xl bg-[#F5FACD] text-[#556000] border border-[#D9E956]/70 flex items-center justify-center">
              <CreditCard size={20} />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">StableTag Instant</span>
              <span className="text-xs font-mono font-bold text-[#556000]">$timmyisanerd ↔ $global</span>
            </div>
          </div>

          {/* Mobile Phone Chassis with Real App UI */}
          <div className="relative z-10 w-[290px] sm:w-[340px] md:w-[380px] rounded-[48px] border-[8px] border-zinc-900 bg-zinc-950 p-1.5 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.12)] group">
            {/* Inner Mobile Screen Image */}
            <div className="relative rounded-[38px] overflow-hidden bg-white aspect-[384/832] w-full border border-zinc-200/60 shadow-inner">
              <Image
                src="/images/png/mobile-app-ui.png"
                alt="StableBank Mobile Application Interface"
                width={384}
                height={832}
                className="w-full h-auto object-cover object-top select-none transition-transform duration-500 group-hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
