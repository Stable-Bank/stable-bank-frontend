"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sparkles, X, CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface OnboardingBannerProps {
  onStartOnboarding: () => void;
}

export default function OnboardingBanner({ onStartOnboarding }: OnboardingBannerProps) {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // If user is already fully verified and has a bank tag and name, or dismissed banner
  const isFullySetup = user?.firstName && user?.bankTag && user?.kycStatus === "approved";
  if (isFullySetup || dismissed) {
    return null;
  }

  const hasName = Boolean(user?.firstName);
  const hasTag = Boolean(user?.bankTag);
  const isKycApproved = user?.kycStatus === "approved";

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-zinc-50 border border-indigo-100 p-5 sm:p-6 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5 z-10">
        
        {/* Left Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-2.5 py-0.5 rounded-full border border-brand-purple/20 flex items-center gap-1">
              <Sparkles size={11} className="text-brand-purple" /> Account Verification
            </span>
            <span className="text-xs text-zinc-500 font-sans hidden sm:inline">
              Unlock Visa cards & wire accounts
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-display font-bold text-zinc-950 tracking-tight">
            Complete your setup to unlock full banking features
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
            Submit your legal name, create your custom StableTag, and complete quick ID verification to activate virtual cards.
          </p>

          {/* 3 Step Progress Chips */}
          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-sans font-medium">
              {hasName ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <Circle size={14} className="text-zinc-400" />
              )}
              <span className={hasName ? "text-zinc-900 font-semibold" : "text-zinc-500"}>Legal Name</span>
            </div>

            <span className="text-zinc-300">•</span>

            <div className="flex items-center gap-1.5 text-xs font-sans font-medium">
              {hasTag ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <Circle size={14} className="text-zinc-400" />
              )}
              <span className={hasTag ? "text-zinc-900 font-semibold" : "text-zinc-500"}>StableTag</span>
            </div>

            <span className="text-zinc-300">•</span>

            <div className="flex items-center gap-1.5 text-xs font-sans font-medium">
              {isKycApproved ? (
                <CheckCircle2 size={14} className="text-emerald-600" />
              ) : (
                <Circle size={14} className="text-zinc-400" />
              )}
              <span className={isKycApproved ? "text-zinc-900 font-semibold" : "text-zinc-500"}>ID Document</span>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
          <Button
            onClick={onStartOnboarding}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full h-11 px-5 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md shadow-brand-purple/20 active:scale-95 transition-all"
          >
            Complete Verification <ArrowRight size={14} />
          </Button>

          <button
            onClick={() => setDismissed(true)}
            className="h-10 w-10 rounded-xl bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
