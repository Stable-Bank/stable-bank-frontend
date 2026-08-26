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
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";

export interface IssueCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  cardholderName?: string;
}

export default function IssueCardModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  cardholderName = "Member",
}: IssueCardModalProps) {
  const cardBenefits = [
    {
      icon: CreditCard,
      title: "Instant Digital Visa Card",
      desc: "Ready immediately for global online shopping and subscription billing.",
    },
    {
      icon: Smartphone,
      title: "Apple Pay & Google Wallet",
      desc: "One-tap tokenization for contactless in-store POS payments worldwide.",
    },
    {
      icon: Globe,
      title: "0% Foreign Transaction Markup",
      desc: "Spend in 150+ currencies backed by your dollar balance with zero FX fees.",
    },
    {
      icon: Lock,
      title: "Bank-Grade Security Controls",
      desc: "Instant freeze/unfreeze, custom spending limits, and 3D Secure fraud shielding.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full !max-w-[500px] rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl text-zinc-950 animate-in zoom-in-95 duration-200 gap-5">
        
        {/* Header */}
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-brand-purple/20 text-brand-purple flex items-center justify-center shrink-0 shadow-xs">
              <CreditCard size={24} />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-display font-extrabold text-zinc-950 tracking-tight">
                Issue Bridge Visa Virtual Card
              </DialogTitle>
              <p className="text-xs font-mono text-zinc-500 mt-0.5">
                Global Multi-Currency Debit Card
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Cardholder Preview Box */}
        <div className="bg-zinc-50 border border-zinc-200/90 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200/70 pb-2.5">
            <span className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              Cardholder Name
            </span>
            <span className="text-xs font-sans font-bold text-zinc-900 truncate max-w-[200px]">
              {cardholderName}
            </span>
          </div>

          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
              Included Card Features:
            </span>
            {cardBenefits.map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs font-sans text-zinc-700">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-900">{benefit.title}: </span>
                  <span className="text-zinc-600 leading-snug">{benefit.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Notice */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-50/50 border border-brand-purple/20 text-brand-purple text-xs font-sans">
          <ShieldCheck size={18} className="shrink-0" />
          <span className="text-[11px] leading-tight">
            Issued via Bridge.xyz regulated Visa card issuer network with 0 issuance fees.
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
                <span>Issuing Visa Card...</span>
              </>
            ) : (
              <>
                <span>Confirm & Issue Card</span>
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
