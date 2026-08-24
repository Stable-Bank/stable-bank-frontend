import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import { ShieldCheck, Scale, AlertTriangle, CreditCard, Ban, FileCheck, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | StableBank",
  description: "Read the StableBank Terms of Service governing your access to our decentralized multi-currency stablecoin accounts, virtual Visa debit card services, and protocol infrastructure.",
};

const termsSections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "eligibility", title: "2. Eligibility & Verification (KYC/AML)" },
  { id: "non-custodial", title: "3. Non-Custodial Protocol Operations" },
  { id: "virtual-cards", title: "4. Virtual Card Program & Settlement" },
  { id: "acceptable-use", title: "5. Acceptable Use & Prohibited Activities" },
  { id: "fees-limits", title: "6. Fees, Gas Limits & Yield Disclosures" },
  { id: "intellectual-prop", title: "7. Intellectual Property & Licenses" },
  { id: "disclaimers", title: "8. Limitation of Liability & Disclaimers" },
  { id: "dispute-resolution", title: "9. Arbitration & Governing Law" },
];

export default function TermsOfServicePage() {
  return (
    <SiteLayout>
      <div className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-largest mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16 sm:mb-20">
            <SectionCard title="Legal Agreement" category="USER AGREEMENT" variant="yellow" />
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 tracking-tight">
              Terms of <span className="text-brand-purple">Service</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sans leading-relaxed">
              Please review these terms carefully before accessing or using StableBank accounts, virtual cards, or decentralized settlement infrastructure.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#EEF8A8]/90 text-[#4D5600] border border-[#D0E244]/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#839105]" />
              <span>Last Revised: January 1, 2026 · Version 2.4</span>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Sticky Table of Contents */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Agreement Outline
              </h2>
              <nav className="space-y-2 text-sm font-sans">
                {termsSections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block py-1.5 text-zinc-600 hover:text-brand-purple transition-colors font-medium"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-700">
                  <Scale size={16} className="text-brand-purple" />
                  <span>Legally Enforceable Contract</span>
                </div>
                <p className="text-xs text-zinc-500 font-sans">
                  By connecting your wallet or creating an account, you agree to binding arbitration.
                </p>
              </div>
            </aside>

            {/* Terms Body */}
            <main className="lg:col-span-8 space-y-10 text-zinc-700 font-sans leading-relaxed">
              
              {/* 1. Acceptance */}
              <section id="acceptance" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <FileCheck className="h-6 w-6 text-brand-purple" />
                  <span>1. Acceptance of Terms</span>
                </h2>
                <p className="mb-4">
                  These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User&rdquo;, &ldquo;you&rdquo;) and StableBank Ltd. and its global operating subsidiaries (&ldquo;StableBank&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;).
                </p>
                <p>
                  Accessing or using any feature of the StableBank web portal, mobile client, virtual debit cards, or smart contract infrastructure signifies your full agreement to these Terms and our Privacy Policy. If you do not agree, you must immediately discontinue use of the platform.
                </p>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <span>2. Eligibility & Identity Verification (KYC/AML)</span>
                </h2>
                <p className="mb-4">To utilize StableBank services, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                  <li>You are at least 18 years of age (or the legal age of majority in your jurisdiction).</li>
                  <li>You are not a citizen, resident, or organized entity located in any jurisdiction subject to comprehensive sanctions (including Cuba, Iran, North Korea, Syria, or designated sanctioned regions).</li>
                  <li>You are not listed on any OFAC, United Nations, or European Union sanctions denial lists.</li>
                  <li>All identity documents and information submitted during onboarding are truthful, accurate, and up to date.</li>
                </ul>
              </section>

              {/* 3. Non-Custodial Operations */}
              <section id="non-custodial" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Scale className="h-6 w-6 text-[#556000]" />
                  <span>3. Non-Custodial Protocol Operations</span>
                </h2>
                <p className="mb-4">
                  StableBank provides decentralized threshold cryptography and non-custodial MPC wallet infrastructure. You acknowledge that:
                </p>
                <p className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-800 mb-4">
                  You retain ultimate control over your cryptographic key shards. StableBank cannot reverse on-chain transactions, recover lost recovery phrases, or initiate transfers without your explicit cryptographic authorization.
                </p>
                <p>
                  You are solely responsible for maintaining the physical and digital security of your authorized devices and backup authentication methods.
                </p>
              </section>

              {/* 4. Virtual Cards */}
              <section id="virtual-cards" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <CreditCard className="h-6 w-6 text-brand-purple" />
                  <span>4. Virtual Card Program & Settlement Terms</span>
                </h2>
                <p className="mb-4">
                  StableBank virtual debit cards are issued under license by partnering financial institutions through the Visa network:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                  <li><strong>Real-Time Conversion:</strong> Authorizations trigger automatic real-time liquidation of stablecoin balances at the prevailing index rate to settle merchant charges in local fiat currency.</li>
                  <li><strong>Card Limits:</strong> Daily, monthly, and per-transaction limits apply according to your tier verification level.</li>
                  <li><strong>Single-Use Burner Cards:</strong> Cards generated as single-use automatically expire upon completion of the initial authorized transaction.</li>
                </ul>
              </section>

              {/* 5. Acceptable Use */}
              <section id="acceptable-use" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Ban className="h-6 w-6 text-rose-600" />
                  <span>5. Acceptable Use & Prohibited Activities</span>
                </h2>
                <p className="mb-4">You agree not to use StableBank for:</p>
                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-rose-950">
                    <strong>Illegal Goods & Services</strong>
                    <p className="mt-1 text-rose-800">Purchasing, selling, or facilitating transactions for unlicensed or prohibited substances and materials.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-rose-950">
                    <strong>Market Manipulation & Fraud</strong>
                    <p className="mt-1 text-rose-800">Engaging in wash trading, card testing, synthetic identity schemes, or fraudulent chargeback claims.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-rose-950">
                    <strong>Sanctions Evasion</strong>
                    <p className="mt-1 text-rose-800">Using mixers, anonymizers, or darknet services linked to blacklisted addresses.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-rose-950">
                    <strong>Reverse Engineering</strong>
                    <p className="mt-1 text-rose-800">Decompiling, scraping, or attempting to compromise smart contract state or API security layers.</p>
                  </div>
                </div>
              </section>

              {/* 6. Fees */}
              <section id="fees-limits" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                  <span>6. Fees, Gas Limits & Yield Disclosures</span>
                </h2>
                <p className="mb-4">
                  StableBank transparently publishes all applicable fee structures:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                  <li><strong>Network Gas:</strong> On-chain transfers require network gas fees dictated by underlying decentralized blockchains.</li>
                  <li><strong>Card FX Fees:</strong> International purchases outside your card&apos;s base currency may incur a low 0.5% – 1.0% conversion spread.</li>
                  <li><strong>Variable Yields:</strong> Advertised APY yields in vaults and savings accounts are variable, protocol-governed rates subject to market fluctuations.</li>
                </ul>
              </section>

              {/* 7. Disclaimers */}
              <section id="disclaimers" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <ShieldCheck className="h-6 w-6 text-brand-purple" />
                  <span>7. Limitation of Liability & Disclaimers</span>
                </h2>
                <p className="mb-4">
                  THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. STABLEBANK SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM SMART CONTRACT REORGS, BLOCKCHAIN FORKS, UNANTICIPATED DOWNTIME, OR USER LOSS OF CRYPTOGRAPHIC KEYS.
                </p>
              </section>

              {/* 8. Arbitration */}
              <section id="dispute-resolution" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-50/50 via-white to-[#F5FACD]/30 border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <HelpCircle className="h-6 w-6 text-brand-purple" />
                  <span>8. Arbitration & Dispute Resolution</span>
                </h2>
                <p className="mb-6 text-zinc-600">
                  Any dispute or claim arising from these Terms shall be resolved by binding, individual arbitration rather than court litigation. Class action proceedings are strictly waived.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:legal@stablebank.io"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple text-white text-sm font-sans font-bold shadow-sm hover:bg-brand-purple/90 transition-colors"
                  >
                    <span>Contact Legal Department</span>
                    <ArrowRight size={16} />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-sans font-bold shadow-xs hover:bg-zinc-50 transition-colors"
                  >
                    <span>Help & Support Center</span>
                  </Link>
                </div>
              </section>

            </main>

          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
