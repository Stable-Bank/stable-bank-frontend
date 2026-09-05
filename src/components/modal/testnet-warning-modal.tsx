"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Ban,
  FlaskConical,
} from "lucide-react";

interface TestnetWarningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcknowledge?: (dontShowAgain: boolean) => void;
}

export default function TestnetWarningModal({
  open,
  onOpenChange,
  onAcknowledge,
}: TestnetWarningModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    if (onAcknowledge) {
      onAcknowledge(dontShowAgain);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-amber-200/90 rounded-3xl bg-white shadow-2xl">
        <div className="flex flex-col">
          {/* Visual Header Banner with Amber Accent */}
          <div className="relative p-6 pb-5 bg-gradient-to-b from-amber-50/80 to-white border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle size={24} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-800 text-[10px] font-mono font-extrabold uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                    Sandbox Preview
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-zinc-950 tracking-tight leading-tight">
                  Do Not Send Real Funds
                </h2>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4">
            <p className="text-zinc-600 text-xs sm:text-sm font-sans leading-relaxed">
              StableBank is currently operating in an <strong className="text-zinc-900 font-semibold">interactive test & simulation mode</strong>. All ledger balances, virtual IBANs, and cards are simulated.
            </p>

            {/* Warning Points */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80">
                <div className="h-7 w-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Ban size={15} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-red-950">No Live Mainnet Assets</h4>
                  <p className="text-[11px] sm:text-xs text-red-800/90 leading-normal">
                    Do not transfer real fiat (USD, EUR, GBP) or live mainnet crypto (USDC, USDT, SOL, ETH). Any real funds sent to test addresses will be permanently lost.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <FlaskConical size={15} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-amber-950">Testnet & Demo Coordinates</h4>
                  <p className="text-[11px] sm:text-xs text-amber-900/90 leading-normal">
                    Virtual bank accounts and Visa card numbers are mock sandbox entities powered by Bridge.xyz test environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Don't show again checkbox */}
            <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-brand-purple focus:ring-brand-purple/20 cursor-pointer"
              />
              <span className="text-xs text-zinc-600 group-hover:text-zinc-950 font-sans">
                Don&apos;t show this warning again during this session
              </span>
            </label>
          </div>

          {/* Footer CTA */}
          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-zinc-500 font-mono text-center sm:text-left">
              Bridge Sandbox v0.4 · Safe Testing
            </p>
            <Button
              onClick={handleClose}
              className="w-full sm:w-auto h-11 px-6 rounded-full text-xs sm:text-sm font-bold bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md shadow-brand-purple/20 cursor-pointer"
            >
              I Understand & Acknowledge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
