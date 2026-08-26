"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Building2,
} from "lucide-react";
import { USFlagIcon, UKFlagIcon, EUFlagIcon, BRFlagIcon, NGFlagIcon } from "@/components/ui/flag-icons";

export interface ProvisionAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: "USD" | "GBP" | "EUR" | "BRL" | "NGN" | string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  userName?: string;
}

const currencyDetails: Record<string, {
  name: string;
  rails: string;
  clearingTime: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}> = {
  USD: {
    name: "United States Dollar (USD)",
    rails: "US Fedwire & ACH Push Rails",
    clearingTime: "Instant to Same-Day",
    icon: USFlagIcon,
    features: [
      "Dedicated personal Account & Routing (ABA) numbers",
      "Direct domestic ACH and Fedwire deposits from any US bank",
      "Instant 1:1 auto-conversion to USDb / USDC with 0 spread",
      "Zero monthly maintenance fees or minimum deposit balance",
    ],
  },
  EUR: {
    name: "Euro (EUR)",
    rails: "SEPA & SEPA Instant Network",
    clearingTime: "Instant (10 Seconds)",
    icon: EUFlagIcon,
    features: [
      "Dedicated Luxembourg/EU IBAN and BIC/SWIFT code",
      "24/7/365 SEPA Instant transfers across 36 European nations",
      "Automatic EUR-to-stablecoin conversion with institutional rates",
      "Direct B2B invoicing and payroll deposit capabilities",
    ],
  },
  GBP: {
    name: "British Pound Sterling (GBP)",
    rails: "UK Faster Payments & BACS",
    clearingTime: "Instant (Under 1 Minute)",
    icon: UKFlagIcon,
    features: [
      "Dedicated UK Sort Code and 8-digit Account Number",
      "Instant Faster Payments settlement from all major UK banks",
      "Zero incoming deposit fees and zero cross-border friction",
      "Seamless integration with your digital multi-currency ledger",
    ],
  },
  BRL: {
    name: "Brazilian Real (BRL)",
    rails: "Pix Central Bank Network",
    clearingTime: "Instant (Under 5 Seconds)",
    icon: BRFlagIcon,
    features: [
      "Dedicated Pix Key with QR code instant on-demand settlement",
      "24/7 instant clearing directly into digital dollars",
      "Zero exchange markups with direct Bridge liquidity",
      "Direct Brazilian bank compatibility",
    ],
  },
  NGN: {
    name: "Nigerian Naira (NGN)",
    rails: "NIBSS Instant Payment (NIP)",
    clearingTime: "Instant",
    icon: NGFlagIcon,
    features: [
      "Dedicated NUBAN account number from tier-1 partner bank",
      "Instant NIP transfers from any Nigerian banking app",
      "Real-time settlement straight to your dollar ledger",
      "Zero gas fees and zero conversion spread",
    ],
  },
};

export default function ProvisionAccountModal({
  open,
  onOpenChange,
  currency,
  onConfirm,
  isLoading,
  userName = "your name",
}: ProvisionAccountModalProps) {
  const curr = (currency || "USD").toUpperCase();
  const config = currencyDetails[curr] || currencyDetails.USD;
  const FlagIcon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-[500px] rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl text-zinc-950 animate-in zoom-in-95 duration-200 gap-5">
        
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0 shadow-xs">
                <Building2 size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <FlagIcon className="w-5 h-5 rounded-full shadow-xs border-2 border-white" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-display font-extrabold text-zinc-950 tracking-tight">
                Provision {curr} Bank Account
              </DialogTitle>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                {config.rails}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Value Proposition Box */}
        <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5">
            <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Account Beneficiary
            </span>
            <span className="text-xs font-sans font-bold text-zinc-900 truncate max-w-[200px]">
              {userName}
            </span>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
              What You Receive Upon Provisioning:
            </span>
            {config.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-zinc-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/50 border border-brand-purple/20 text-brand-purple text-xs font-sans">
          <ShieldCheck size={18} className="shrink-0" />
          <span className="text-[11px] leading-tight">
            Provisioned instantly via Bridge.xyz institutional banking partner network.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="w-1/3 h-12 rounded-full border-zinc-200 text-zinc-800 hover:bg-zinc-100 font-sans font-bold text-xs sm:text-sm cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="w-2/3 h-12 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Provisioning Account...</span>
              </>
            ) : (
              <>
                <span>Confirm & Provision</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
