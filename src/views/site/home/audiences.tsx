import { ArrowRight, User, Building2, Landmark, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/lib/navigation";
import { SectionCard } from "@/components/cards";

export default function Audiences() {
  return (
    <section className="py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-largest mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-14 sm:mb-18 text-center flex flex-col items-center">
          <SectionCard title="For Everyone" category="GLOBAL ACCESS" variant="yellow" />
          <h2 className="mt-8 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 mb-6">
            Banking built for <span className="text-brand-purple">your scale</span>
          </h2>
          <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl font-sans">
            Whether you&apos;re managing personal crypto, scaling a global startup, or running an institutional treasury.
          </p>
        </div>

        {/* Persona Architecture Tier Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Individuals */}
          <div className="group relative p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 hover:border-brand-purple/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center text-brand-purple group-hover:scale-105 transition-transform">
                  <User className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
                  Consumer DeFi
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 mb-4">
                Individuals
              </h3>
              
              <p className="text-zinc-600 leading-relaxed font-sans mb-8 text-sm sm:text-base">
                Your personal super-wallet. Spend stablecoins globally with virtual cards, send funds instantly, and earn yield seamlessly.
              </p>

              {/* Persona Checklist */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-brand-purple">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Instant Multi-Currency Balances</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-brand-purple">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Single-Use & Virtual Visa Cards</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-purple-50 flex items-center justify-center shrink-0 text-brand-purple">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Zero-Fee P2P Transfer Rails</span>
                </div>
              </div>
            </div>

            <Link
              href={appRoutes.auth.signUp}
              className="flex items-center justify-between w-full py-3.5 px-6 rounded-full bg-zinc-100 hover:bg-brand-purple hover:text-white text-zinc-900 font-bold transition-all duration-300 font-sans text-sm shadow-xs group-hover:bg-brand-purple group-hover:text-white"
            >
              <span>Open Personal Account</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tier 2: Businesses - HIGH CONTRAST FEATURED VOLT LIME CARD */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white border-2 border-[#B0BE19] shadow-2xl flex flex-col justify-between transform lg:-translate-y-2 group">
            {/* Featured Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#EEF8A8] text-zinc-950 px-4 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 border border-[#B0BE19]">
              <Sparkles size={13} className="text-[#556000]" />
              <span>Recommended for Teams</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8 mt-2">
                <div className="w-14 h-14 bg-[#B0BE19] rounded-2xl flex items-center justify-center text-zinc-950 shadow-md group-hover:scale-105 transition-transform">
                  <Building2 className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#E8F2A2] bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  Corporate OS
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
                Businesses
              </h3>
              
              <p className="text-zinc-300 leading-relaxed font-sans mb-8 text-sm sm:text-base">
                The financial infrastructure for global teams. Run cross-border payroll, issue team cards, and manage treasury in one view.
              </p>

              {/* Persona Checklist */}
              <div className="space-y-3 pt-4 border-t border-zinc-800 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-200">
                  <div className="h-5 w-5 rounded-full bg-[#B0BE19]/20 flex items-center justify-center shrink-0 text-[#B0BE19]">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Multi-Seat Team Expense Cards</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-200">
                  <div className="h-5 w-5 rounded-full bg-[#B0BE19]/20 flex items-center justify-center shrink-0 text-[#B0BE19]">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Automated Global Vendor & Payroll Rails</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-200">
                  <div className="h-5 w-5 rounded-full bg-[#B0BE19]/20 flex items-center justify-center shrink-0 text-[#B0BE19]">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>5.25% High-Volume Corporate Yield</span>
                </div>
              </div>
            </div>

            <Link
              href={appRoutes.auth.signUp}
              className="flex items-center justify-between w-full py-4 px-6 rounded-full bg-[#B0BE19] hover:bg-[#B0BE19]/90 text-zinc-950 font-bold transition-all duration-300 font-sans text-sm shadow-lg shadow-[#B0BE19]/20"
            >
              <span>Open Business Account</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tier 3: Institutions */}
          <div className="group relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-zinc-50 via-white to-emerald-50/30 border border-zinc-200 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <Landmark className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Prime Platform
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-zinc-950 mb-4">
                Institutions
              </h3>
              
              <p className="text-zinc-600 leading-relaxed font-sans mb-8 text-sm sm:text-base">
                Prime brokerage and qualified custody. Engineered for scale, compliance, and maximum operational security.
              </p>

              {/* Persona Checklist */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 mb-8">
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>MPC Segregated Cold Storage Custody</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>Deep Liquidity OTC & High-Speed RFQ</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm font-sans font-medium text-zinc-700">
                  <div className="h-5 w-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600">
                    <Check size={13} strokeWidth={3} />
                  </div>
                  <span>24/7 Dedicated Institutional Prime Desk</span>
                </div>
              </div>
            </div>

            <Link
              href="/institutions"
              className="flex items-center justify-between w-full py-3.5 px-6 rounded-full bg-zinc-100 hover:bg-emerald-600 hover:text-white text-zinc-900 font-bold transition-all duration-300 font-sans text-sm shadow-xs group-hover:bg-emerald-600 group-hover:text-white"
            >
              <span>Explore Institutional Tier</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

