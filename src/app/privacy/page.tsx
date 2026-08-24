import SiteLayout from "@/layouts/site";
import { SectionCard } from "@/components/cards";
import { ShieldCheck, Lock, Eye, FileText, Database, Globe, CheckCircle2, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | StableBank",
  description: "Learn how StableBank collects, uses, protects, and governs your personal and transactional information across our non-custodial financial platform.",
};

const sections = [
  { id: "overview", title: "1. Platform Overview & Scope" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "on-chain", title: "3. On-Chain Ledger & Public Keys" },
  { id: "mpc-security", title: "4. MPC Security & Self-Custody" },
  { id: "usage", title: "5. How We Use Information" },
  { id: "third-parties", title: "6. Card Rails & Banking Partners" },
  { id: "data-rights", title: "7. Your Global Privacy Rights (GDPR / CCPA)" },
  { id: "retention", title: "8. Data Retention & Security Measures" },
  { id: "contact", title: "9. Contact Our Privacy Office" },
];

export default function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <div className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-largest mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16 sm:mb-20">
            <SectionCard title="Legal & Compliance" category="DATA GOVERNANCE" variant="yellow" />
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-zinc-950 tracking-tight">
              Privacy <span className="text-brand-purple">Policy</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-zinc-600 font-sans leading-relaxed">
              We are committed to institutional transparency, cryptographic security, and protecting your data privacy across every transaction.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#EEF8A8]/90 text-[#4D5600] border border-[#D0E244]/80 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#839105]" />
              <span>Effective Date: January 1, 2026 · Version 2.4</span>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Table of Contents Sticky Rail */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4">
                Table of Contents
              </h2>
              <nav className="space-y-2 text-sm font-sans">
                {sections.map((sec) => (
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
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>SOC 2 Type II Certified</span>
                </div>
                <p className="text-xs text-zinc-500 font-sans">
                  Questions regarding your data? Contact our Data Protection Officer at privacy@stablebank.io.
                </p>
              </div>
            </aside>

            {/* Legal Content Body */}
            <main className="lg:col-span-8 space-y-10 text-zinc-700 font-sans leading-relaxed">
              
              {/* 1. Overview */}
              <section id="overview" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <FileText className="h-6 w-6 text-brand-purple" />
                  <span>1. Platform Overview & Scope</span>
                </h2>
                <p className="mb-4">
                  StableBank Ltd. and its affiliated global operating entities (&ldquo;StableBank&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) provide decentralized multi-currency stablecoin accounts, virtual Visa debit card issuing rails, and direct settlement infrastructure.
                </p>
                <p>
                  This Privacy Policy details how we collect, store, share, and protect information when you access our mobile applications, web portals, APIs, and associated products. By utilizing StableBank, you consent to the data collection and processing methods described herein.
                </p>
              </section>

              {/* 2. Collection */}
              <section id="collection" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Database className="h-6 w-6 text-[#556000]" />
                  <span>2. Information We Collect</span>
                </h2>
                <p className="mb-4">
                  We gather only the minimum data required to facilitate regulatory compliance, prevent financial crimes, and deliver uninterrupted banking services:
                </p>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-start gap-2.5 text-sm sm:text-base">
                    <CheckCircle2 size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Account & Contact Data:</strong> Name, registered email address, country of residence, and optional StableTag identifier.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm sm:text-base">
                    <CheckCircle2 size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Verification Data (Tiered KYC):</strong> Government-issued identification, proof of address, and liveness biometric telemetry provided strictly through our certified identity verification partners.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-sm sm:text-base">
                    <CheckCircle2 size={18} className="text-brand-purple shrink-0 mt-0.5" />
                    <span><strong>Transactional & Device Telemetry:</strong> IP address, device fingerprints, card authorization logs, and settlement timestamps used for fraud monitoring.</span>
                  </li>
                </ul>
              </section>

              {/* 3. On-Chain Ledger */}
              <section id="on-chain" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Globe className="h-6 w-6 text-brand-purple" />
                  <span>3. On-Chain Ledger & Public Keys</span>
                </h2>
                <p className="mb-4">
                  Blockchain networks (including Ethereum, Arbitrum, Base, Polygon, and Avalanche) operate on publicly verifiable ledgers. When executing stablecoin transfers, deposits, or protocol interactions:
                </p>
                <p className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-sm font-mono text-zinc-800">
                  Public blockchain addresses, gas fees, transaction hashes, and timestamped smart contract calls are permanently recorded on decentralized ledgers. StableBank does not and cannot modify or erase public ledger state.
                </p>
              </section>

              {/* 4. MPC Security */}
              <section id="mpc-security" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Lock className="h-6 w-6 text-emerald-600" />
                  <span>4. MPC Security & Self-Custody Architecture</span>
                </h2>
                <p className="mb-4">
                  StableBank uses Multi-Party Computation (MPC) cryptography. Private keys are never constructed or stored as single whole secrets on any server:
                </p>
                <p>
                  Key shards are segregated across client-side cryptographic secure enclaves and audited threshold networks. We have zero programmatic ability to execute asset transfers without your authenticated cryptographic consent.
                </p>
              </section>

              {/* 5. Usage */}
              <section id="usage" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Eye className="h-6 w-6 text-[#556000]" />
                  <span>5. How We Use Information</span>
                </h2>
                <p className="mb-3">We strictly utilize gathered data to:</p>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                  <li>Process card authorization requests and settle digital asset conversions in real time.</li>
                  <li>Perform mandated Anti-Money Laundering (AML), Counter-Terrorist Financing (CTF), and OFAC sanctions screenings.</li>
                  <li>Detect and prevent unauthorized account access, card cloning, and fraudulent activities.</li>
                  <li>Transmit high-priority transaction confirmations, card freeze notifications, and security alerts.</li>
                </ul>
              </section>

              {/* 6. Third Parties */}
              <section id="third-parties" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <ShieldCheck className="h-6 w-6 text-brand-purple" />
                  <span>6. Card Rails & Banking Partners</span>
                </h2>
                <p className="mb-4">
                  Virtual and physical debit card services are provided through licensed bank issuers and the Visa payment network. When performing card purchases, necessary settlement data is securely transmitted to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                  <li>Payment network operators (Visa International) for clearing and chargeback adjudication.</li>
                  <li>Licensed banking partners for processing ACH, FedWire, CHAPS, and SEPA fiat transfers.</li>
                  <li>Regulated cloud infrastructure providers adhering to ISO 27001 and SOC 2 Type II audit standards.</li>
                </ul>
              </section>

              {/* 7. Data Rights */}
              <section id="data-rights" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Globe className="h-6 w-6 text-emerald-600" />
                  <span>7. Your Global Privacy Rights (GDPR & CCPA)</span>
                </h2>
                <p className="mb-4">
                  Regardless of geography, all verified StableBank users retain enforceable rights regarding personal data:
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-sans">
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <h3 className="font-bold text-zinc-950 mb-1">Right to Access & Export</h3>
                    <p className="text-zinc-600">Request a full machine-readable export of all off-chain personal data held by StableBank.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <h3 className="font-bold text-zinc-950 mb-1">Right to Rectification</h3>
                    <p className="text-zinc-600">Correct inaccurate or outdated personal profile details through in-app settings or support.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <h3 className="font-bold text-zinc-950 mb-1">Right to Erasure (&ldquo;To Be Forgotten&rdquo;)</h3>
                    <p className="text-zinc-600">Request deletion of off-chain records subject to statutory financial recordkeeping obligations.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <h3 className="font-bold text-zinc-950 mb-1">Right to Restrict Processing</h3>
                    <p className="text-zinc-600">Opt-out of non-essential product telemetry, research communications, and marketing campaigns.</p>
                  </div>
                </div>
              </section>

              {/* 8. Retention */}
              <section id="retention" className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Lock className="h-6 w-6 text-brand-purple" />
                  <span>8. Data Retention & Security Measures</span>
                </h2>
                <p className="mb-4">
                  We implement AES-256 encryption at rest and TLS 1.3 encryption in transit across all systems. Audit logs, KYC records, and transaction logs are preserved for 5 to 7 years in compliance with international financial AML directives, after which they are securely purged.
                </p>
              </section>

              {/* 9. Contact */}
              <section id="contact" className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-purple-50/50 via-white to-[#F5FACD]/30 border border-zinc-200 shadow-sm scroll-mt-28">
                <h2 className="text-2xl font-display font-bold text-zinc-950 mb-4 flex items-center gap-2.5">
                  <Mail className="h-6 w-6 text-brand-purple" />
                  <span>9. Contact Our Privacy Office</span>
                </h2>
                <p className="mb-6 text-zinc-600">
                  To exercise your data protection rights or escalate an inquiry to our Data Protection Officer (DPO), please reach out via:
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:privacy@stablebank.io"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-purple text-white text-sm font-sans font-bold shadow-sm hover:bg-brand-purple/90 transition-colors"
                  >
                    <span>Email Data Protection Officer</span>
                    <ArrowRight size={16} />
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-zinc-200 text-zinc-800 text-sm font-sans font-bold shadow-xs hover:bg-zinc-50 transition-colors"
                  >
                    <span>Help & Support Desk</span>
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
