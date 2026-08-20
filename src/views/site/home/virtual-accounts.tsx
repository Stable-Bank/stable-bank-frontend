"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { Copy, Check, Landmark, Globe, RefreshCw, Info } from "lucide-react";
import SectionCard from "@/components/cards/section";

type Currency = "USD" | "GBP" | "EUR";

interface AccountDetailField {
  label: string;
  value: string;
}

const mockAccounts: Record<Currency, {
  bankName: string;
  flag: string;
  fields: AccountDetailField[];
  network: string;
}> = {
  USD: {
    bankName: "StableBank Federal Trust (US Branch)",
    flag: "🇺🇸",
    network: "ACH, FedWire",
    fields: [
      { label: "Routing Number", value: "021000021" },
      { label: "Account Number", value: "10984729184" },
      { label: "Account Type", value: "Checking" },
      { label: "Beneficiary Name", value: "StableBank Ltd / User Account" },
    ],
  },
  GBP: {
    bankName: "StableBank UK Ltd (London Branch)",
    flag: "🇬🇧",
    network: "Faster Payments, CHAPS",
    fields: [
      { label: "Sort Code", value: "60-83-71" },
      { label: "Account Number", value: "48291048" },
      { label: "IBAN", value: "GB82 STBK 6083 7148 2910 48" },
      { label: "Beneficiary Name", value: "StableBank Ltd / User Account" },
    ],
  },
  EUR: {
    bankName: "StableBank Europe AG (Frankfurt)",
    flag: "🇪🇺",
    network: "SEPA Inst, Target2",
    fields: [
      { label: "IBAN", value: "DE89 3704 0044 0532 0130 00" },
      { label: "BIC / SWIFT", value: "STBKDEFFXXX" },
      { label: "Bank Address", value: "Taunustor 1, 60311 Frankfurt am Main" },
      { label: "Beneficiary Name", value: "StableBank Ltd / User Account" },
    ],
  },
};

export default function VirtualAccounts() {
  const [activeTab, setActiveTab] = useState<Currency>("USD");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const account = mockAccounts[activeTab];

  return (
    <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10 bg-brand-black">
      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 bg-[url('/images/svg/grid-pattern.svg')] opacity-5 pointer-events-none" 
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
        }}
      />
      
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Mock Bank Slip Side */}
          <div className="lg:col-span-6 lg:order-2 flex flex-col items-center">
            <div className="w-full max-w-[480px]">
              
              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5 mb-6">
                {(["USD", "GBP", "EUR"] as Currency[]).map((currency) => (
                  <button
                    key={currency}
                    onClick={() => {
                      setActiveTab(currency);
                      setCopiedIndex(null);
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300 cursor-pointer",
                      activeTab === currency
                        ? "bg-brand-purple text-brand-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                    )}
                  >
                    <span className="mr-1.5">{mockAccounts[currency].flag}</span>
                    {currency}
                  </button>
                ))}
              </div>

              {/* Bank Details Slip */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8 shadow-2xl">
                
                {/* Visual Header */}
                <div className="flex justify-between items-start border-b border-white/10 pb-5 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-brand-white flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-brand-yellow" />
                      {activeTab} Receiving Details
                    </h3>
                    <p className="text-xs text-white/50 mt-1">{account.bankName}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Local Route
                  </span>
                </div>

                {/* Account Details list */}
                <div className="space-y-4">
                  {account.fields.map((field, idx) => (
                    <div key={field.label} className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs text-white/40 font-semibold block">{field.label}</span>
                        <span className="text-sm sm:text-base font-mono text-brand-white break-all">{field.value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(field.value, idx)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0 mt-2"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bottom Status / Network Info */}
                <div className="mt-8 border-t border-white/15 pt-5 flex items-center justify-between text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-brand-purple" />
                    <span>Supported: <strong>{account.network}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-brand-yellow animate-spin" style={{ animationDuration: "8s" }} />
                    <span>Auto-settles to Stablecoins</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Copy Side */}
          <div className="lg:col-span-6 lg:order-1 flex flex-col items-start text-left">
            <SectionCard title="VIRTUAL ACCOUNTS" />
            
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-brand-white leading-tight">
              Global Accounts.<br />
              <span className="text-brand-purple">Local Bank Details.</span>
            </h2>
            
            <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl">
              Get dedicated account numbers in USD, GBP, and EUR. Receive wire transfers, ACH deposits, and SEPA payments seamlessly with instant settlements.
            </p>

            <ul className="mt-8 space-y-4 text-sm sm:text-base text-white/80">
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <span><strong>Instant Crypto Conversion</strong> — Incoming fiat deposits automatically convert to USDC or USDT at market rates.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <span><strong>Zero Cross-Border Fees</strong> — Receive international employer payments or contractor invoices without standard high wire charges.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <Info className="h-4 w-4" />
                </div>
                <span><strong>ACH & SEPA Ready</strong> — Settle local payments seamlessly over direct country-specific payment pathways.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
