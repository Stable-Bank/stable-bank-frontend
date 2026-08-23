"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, ShieldCheck, Zap, ChartLine } from "lucide-react";
// We use simple SVGs for App Store and Google Play to avoid complex imports
const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
    <path d="M10 2c1 .5 2 2 2 5" />
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default function UInvest() {
  return (
    <div className="flex animate-in fade-in flex-col gap-10 pb-20 items-center justify-center min-h-[calc(100vh-100px)] text-center max-w-[1440px] mx-auto w-full">
      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl px-4 mt-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-purple/10 border border-brand-purple/20 shadow-sm mb-2">
          <Smartphone size={40} className="text-brand-purple" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-zinc-950 tracking-tight">
          Invest By <span className="text-brand-purple">StableBank</span>
        </h1>
        
        <p className="text-zinc-600 text-base sm:text-lg max-w-[600px] font-sans leading-relaxed">
          We are moving our institutional-grade investment tools to a dedicated mobile experience. Access staking, automated plans, and synthetic stocks anytime, anywhere.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-4">
          <Card className="bg-white border-zinc-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-1">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-lg font-display font-bold text-zinc-950">Secure Staking</h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans">Lock tokens and earn competitive APY directly from your phone.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-zinc-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mb-1">
                <Zap size={28} />
              </div>
              <h3 className="text-lg font-display font-bold text-zinc-950">AIM Plans</h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans">Automated investment management tailored to your specific goals.</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-zinc-200 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-1">
                <ChartLine size={28} />
              </div>
              <h3 className="text-lg font-display font-bold text-zinc-950">Synthetic Stocks</h3>
              <p className="text-xs sm:text-sm text-zinc-500 font-sans">Tokenized exposure to top US equity markets instantly.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 w-full sm:w-auto">
          <Button 
            className="w-full sm:w-auto px-8 h-12 bg-zinc-950 text-white font-sans font-bold text-sm rounded-full hover:bg-zinc-800 shadow-md transition-all active:scale-95 cursor-pointer"
            onClick={() => window.alert('iOS App coming soon!')}
          >
            <AppleIcon />
            App Store
          </Button>
          <Button 
            className="w-full sm:w-auto px-8 h-12 bg-white border border-zinc-200 text-zinc-900 font-sans font-bold text-sm rounded-full hover:bg-zinc-50 shadow-sm transition-all active:scale-95 cursor-pointer"
            onClick={() => window.alert('Android App coming soon!')}
          >
            <PlayIcon />
            Google Play
          </Button>
        </div>
      </div>
    </div>
  );
}
