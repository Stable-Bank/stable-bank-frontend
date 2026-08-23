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
    <section className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-largest mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Mock Bank Slip Side */}
          <div className="lg:col-span-6 lg:order-2 flex flex-col items-center">
            <div className="w-full max-w-[480px]">
              
              {/* Tab Selector */}
              <div className="flex gap-2 p-1.5 rounded-2xl bg-zinc-100 border border-zinc-200 mb-6">
                {(["USD", "GBP", "EUR"] as Currency[]).map((currency) => (
                  <button
                    key={currency}
                    onClick={() => {
                      setActiveTab(currency);
                      setCopiedIndex(null);
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-xl text-sm font-bold tracking-wider transition-all duration-300 cursor-pointer font-mono",
                      activeTab === currency
                        ? "bg-brand-purple text-white shadow-sm"
                        : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                    )}
                  >
                    <span className="mr-1.5">{mockAccounts[currency].flag}</span>
                    {currency}
                  </button>
                ))}
              </div>

              {/* Bank Details Slip */}
              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
                
                {/* Visual Header */}
                <div className="flex justify-between items-start border-b border-zinc-200 pb-5 mb-6">
                  <div>
                    <h3 className="text-xl font-display font-bold text-zinc-950 flex items-center gap-2">
                      <Landmark className="h-5 w-5 text-brand-purple" />
                      {activeTab} Receiving Details
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 font-sans">{account.bankName}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Local Route
                  </span>
                </div>

                {/* Account Details list */}
                <div className="space-y-4">
                  {account.fields.map((field, idx) => (
                    <div key={field.label} className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-xs text-zinc-500 font-semibold block font-mono">{field.label}</span>
                        <span className="text-sm sm:text-base font-mono text-zinc-900 font-medium break-all">{field.value}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(field.value, idx)}
                        className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer shrink-0 mt-2"
                        title="Copy to clipboard"
                      >
                        {copiedIndex === idx ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bottom Status / Network Info */}
                <div className="mt-8 border-t border-zinc-200 pt-5 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-brand-purple" />
                    <span>Supported: <strong>{account.network}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="h-3.5 w-3.5 text-brand-purple animate-spin" style={{ animationDuration: "8s" }} />
                    <span>Auto-settles to Stablecoins</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Copy Side */}
          <div className="lg:col-span-6 lg:order-1 flex flex-col items-start text-left">
            <SectionCard title="VIRTUAL ACCOUNTS" />
            
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-zinc-950 leading-tight">
              Global Accounts.<br />
              <span className="text-brand-purple">Local Bank Details.</span>
            </h2>
            
            <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-xl font-sans">
              Get dedicated account numbers in USD, GBP, and EUR. Receive wire transfers, ACH deposits, and SEPA payments seamlessly with instant settlements.
            </p>

            <ul className="mt-8 space-y-4 text-sm sm:text-base text-zinc-700 font-sans">
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <span><strong>Instant Crypto Conversion</strong> — Incoming fiat deposits automatically convert to USDC or USDT at market rates.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-50 flex items-center justify-center text-brand-purple shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <span><strong>Zero Cross-Border Fees</strong> — Receive international employer payments or contractor invoices without standard high wire charges.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
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
