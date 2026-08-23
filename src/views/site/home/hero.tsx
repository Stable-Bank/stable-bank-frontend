import { Button } from "@/components/ui/button";
import React from "react";
import { ArrowRight, ArrowUpRight, ArrowDownLeft, Repeat, Bell, CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TextMarquee from "@/components/marquee";
import { appRoutes } from "@/lib/navigation";
import SectionCard from "@/components/cards/section";

export default function HeroHome() {
  return (
    <div className="py-12 px-4 sm:py-16 md:py-24 overflow-hidden relative">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[450px] bg-gradient-to-tr from-brand-purple/15 via-purple-100/40 to-transparent rounded-full blur-[140px] pointer-events-none" />

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
              <span className="text-xs font-mono font-bold text-[#556000]">$alex.vance ↔ $elena</span>
            </div>
          </div>

          {/* Mobile Phone Chassis */}
          <div className="relative z-10 w-[300px] sm:w-[350px] md:w-[375px] rounded-[48px] border-[7px] border-zinc-900 bg-zinc-950 p-2 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.08)]">
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-zinc-900 rounded-full z-30" />

            {/* Inner Mobile Screen */}
            <div className="rounded-[40px] bg-zinc-50 border border-zinc-200/80 overflow-hidden text-left p-4 pt-7 flex flex-col gap-3.5">
              
              {/* Screen Top Bar */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 flex items-center justify-center text-white font-mono text-xs font-bold shadow-xs">
                    AV
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-zinc-950 block leading-none">$alex.vance</span>
                    <span className="text-[9px] font-sans font-semibold text-emerald-600">● Tier 2 Verified</span>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-xs relative">
                  <Bell size={14} />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brand-purple" />
                </div>
              </div>

              {/* Mobile Unified Balance Card */}
              <div className="rounded-2xl bg-white border border-zinc-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">Unified Balance</span>
                  <span className="text-[10px] font-mono font-bold text-[#556000] bg-[#EEF8A8]/80 px-2 py-0.5 rounded-full border border-[#D0E244]/80 shadow-2xs">+4.2% APY</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-zinc-950 tracking-tight">$142,850.00</span>
                </div>
                
                {/* Mobile Quick Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-100">
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-brand-purple text-white text-[11px] font-sans font-bold shadow-xs">
                    <ArrowUpRight size={13} />
                    <span>Send</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-[#F5FACD] text-[#556000] border border-[#D9E956]/70 text-[11px] font-sans font-bold shadow-2xs">
                    <ArrowDownLeft size={13} />
                    <span>Receive</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 border border-zinc-200 text-[11px] font-sans font-bold">
                    <Repeat size={13} />
                    <span>Swap</span>
                  </div>
                </div>
              </div>

              {/* Live Virtual Card Widget Preview */}
              <div className="relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 p-4 text-white shadow-md overflow-hidden border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Image src="/images/brand/favicon.svg" alt="logo" width={16} height={16} className="brightness-200" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/90">StableCard</span>
                  </div>
                  <span className="text-xs font-mono font-extrabold text-white/80">VISA</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-xs text-white/70 tracking-widest">•••• •••• •••• 4892</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">Active</span>
                </div>
              </div>

              {/* Mobile Assets Feed Preview */}
              <div className="rounded-2xl bg-white border border-zinc-200 p-3 shadow-xs space-y-2">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 block px-1">Holdings</span>
                
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                      $
                    </div>
                    <span className="text-xs font-sans font-bold text-zinc-900">USDC</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-950">$94,200.00</span>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                      ₮
                    </div>
                    <span className="text-xs font-sans font-bold text-zinc-900">USDT</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-950">$38,650.00</span>
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#F5FACD] border border-[#D9E956]/70 flex items-center justify-center text-[10px] font-bold text-[#556000]">
                      €
                    </div>
                    <span className="text-xs font-sans font-bold text-zinc-900">EURC</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-zinc-950">€10,000.00</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <TextMarquee />
    </div>
  );
}
