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
    <div className="flex animate-in fade-in flex-col gap-10 pb-20 items-center justify-center min-h-[calc(100vh-100px)] text-center">
      {/* Background Decorative Glow */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-brand-purple/10 blur-[120px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[300px] w-[300px] rounded-full bg-brand-yellow/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl px-4 mt-12">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-purple/20 border border-brand-purple/30 shadow-2xl shadow-brand-purple/20 mb-2">
          <Smartphone size={48} className="text-brand-purple" />
        </div>

        <h1 className="text-5xl font-black text-white tracking-tighter sm:text-7xl">
          Invest By <span className="text-brand-purple">StableBank</span>
        </h1>
        
        <p className="text-brand-white/60 text-lg sm:text-xl max-w-[600px] font-medium leading-relaxed">
          We are moving our institutional-grade investment tools to a dedicated mobile experience. Access staking, automated plans, and synthetic stocks anytime, anywhere.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-6">
          <Card className="bg-[#0E121C]/50 border-white/5 backdrop-blur-md transition-transform hover:-translate-y-2">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-[#319F43]/20 flex items-center justify-center text-[#319F43] mb-2">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Secure Staking</h3>
              <p className="text-sm text-white/40">Lock tokens and earn competitive APY directly from your phone.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0E121C]/50 border-white/5 backdrop-blur-md transition-transform hover:-translate-y-2">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow mb-2">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">AIM Plans</h3>
              <p className="text-sm text-white/40">Automated investment management tailored to your specific goals.</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0E121C]/50 border-white/5 backdrop-blur-md transition-transform hover:-translate-y-2">
            <CardContent className="p-8 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-2">
                <ChartLine size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Synthetic Stocks</h3>
              <p className="text-sm text-white/40">Tokenized exposure to top US equity markets instantly.</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 w-full sm:w-auto">
          <Button 
            className="w-full sm:w-auto px-8 h-14 bg-white text-black font-bold text-base rounded-xl hover:bg-white/90 shadow-xl transition-transform active:scale-95"
            onClick={() => window.alert('iOS App coming soon!')}
          >
            <AppleIcon />
            App Store
          </Button>
          <Button 
            className="w-full sm:w-auto px-8 h-14 bg-[#0E121C] border border-white/10 text-white font-bold text-base rounded-xl hover:bg-white/5 transition-transform active:scale-95"
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
