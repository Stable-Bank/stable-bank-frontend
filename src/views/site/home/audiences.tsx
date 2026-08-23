import { ArrowRight, User, Building2, Landmark } from "lucide-react";
import Link from "next/link";
import { appRoutes } from "@/lib/navigation";
import { SectionCard } from "@/components/cards";

export default function Audiences() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-10 relative">
      <div className="max-w-largest mx-auto relative z-10">
        <div className="mb-16 text-center flex flex-col items-center">
          <SectionCard title="For Everyone" category="GLOBAL ACCESS" />
          <h2 className="mt-8 text-4xl sm:text-5xl font-display font-extrabold text-zinc-950 mb-6">
            Banking built for <span className="text-brand-purple">your scale</span>
          </h2>
          <p className="text-xl text-zinc-600 max-w-2xl font-sans">
            Whether you&apos;re managing personal crypto, scaling a global startup, or running an institutional treasury.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Individuals */}
          <div className="group relative p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full shadow-sm">
            <div className="w-14 h-14 bg-brand-purple/10 border border-brand-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-brand-purple transition-all duration-300">
              <User className="w-7 h-7 text-brand-purple group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-display font-bold text-zinc-950 mb-4">Individuals</h3>
            <p className="text-zinc-600 leading-relaxed mb-8 flex-1 font-sans">
              Your personal super-wallet. Spend stablecoins globally with virtual cards, send funds instantly, and earn yield seamlessly.
            </p>
            <Link href={appRoutes.auth.signUp} className="flex items-center text-zinc-500 font-semibold group-hover:text-brand-purple transition-colors font-mono text-sm">
              Open Personal Account <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Businesses */}
          <div className="group relative p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full shadow-sm">
            <div className="w-14 h-14 bg-purple-50 border border-brand-purple/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-brand-purple transition-all duration-300">
              <Building2 className="w-7 h-7 text-brand-purple group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-display font-bold text-zinc-950 mb-4">Businesses</h3>
            <p className="text-zinc-600 leading-relaxed mb-8 flex-1 font-sans">
              The financial infrastructure for global teams. Run cross-border payroll, issue team cards, and manage treasury in one view.
            </p>
            <Link href={appRoutes.auth.signUp} className="flex items-center text-zinc-500 font-semibold group-hover:text-brand-purple transition-colors font-mono text-sm">
              Open Business Account <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Institutions */}
          <div className="group relative p-8 rounded-2xl bg-white border border-zinc-200 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-emerald-600 transition-all duration-300">
              <Landmark className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-2xl font-display font-bold text-zinc-950 mb-4">Institutions</h3>
            <p className="text-zinc-600 leading-relaxed mb-8 flex-1 font-sans">
              Prime brokerage and qualified custody. Engineered for scale, compliance, and maximum operational security.
            </p>
            <Link href="/institutions" className="flex items-center text-zinc-500 font-semibold group-hover:text-emerald-600 transition-colors font-mono text-sm">
              Explore Institutional Tier <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
