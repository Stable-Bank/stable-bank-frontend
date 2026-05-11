import { ArrowRight, User, Building2, Landmark } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/lib/navigation";
import { SectionCard } from "@/components/cards";

export default function Audiences() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-brand-black" />
      <div className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-5 mask-gradient-b" />
      
      <div className="max-w-largest mx-auto relative z-10">
        <div className="mb-16 text-center flex flex-col items-center">
          <SectionCard title="For Everyone" />
          <h2 className="mt-8 text-4xl sm:text-5xl font-bold text-white mb-6">
            Banking built for <span className="text-brand-purple">your scale</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl">
            Whether you&apos;re managing personal crypto, scaling a global startup, or running an institutional treasury.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Individuals */}
          <div className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-purple/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl group-hover:bg-brand-purple/20 transition-all" />
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-purple transition-all duration-500">
              <User className="w-7 h-7 text-brand-purple group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Individuals</h3>
            <p className="text-white/50 leading-relaxed mb-8 flex-1">
              Your personal super-wallet. Spend stablecoins globally with virtual cards, send funds instantly, and earn yield seamlessly.
            </p>
            <Link href={appRoutes.auth.signUp} className="flex items-center text-white/40 font-semibold group-hover:text-brand-purple transition-colors">
              Open Personal Account <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Businesses */}
          <div className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-3xl group-hover:bg-brand-yellow/20 transition-all" />
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-yellow transition-all duration-500">
              <Building2 className="w-7 h-7 text-brand-yellow group-hover:text-black transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Businesses</h3>
            <p className="text-white/50 leading-relaxed mb-8 flex-1">
              The financial infrastructure for global teams. Run cross-border payroll, issue team cards, and manage treasury in one view.
            </p>
            <Link href={appRoutes.auth.signUp} className="flex items-center text-white/40 font-semibold group-hover:text-brand-yellow transition-colors">
              Open Business Account <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Institutions */}
          <div className="group relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-brand-green/30 transition-all duration-500 overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/10 rounded-full blur-3xl group-hover:bg-brand-green/20 transition-all" />
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-green transition-all duration-500">
              <Landmark className="w-7 h-7 text-brand-green group-hover:text-black transition-colors" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Institutions</h3>
            <p className="text-white/50 leading-relaxed mb-8 flex-1">
              Prime brokerage and qualified custody. Engineered for scale, compliance, and maximum operational security.
            </p>
            <Link href="/institutions" className="flex items-center text-white/40 font-semibold group-hover:text-brand-green transition-colors">
              Explore Institutional Tier <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
