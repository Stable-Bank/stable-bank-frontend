"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck, X, ChevronRight, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";

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
    <div className="relative w-full rounded-[28px] bg-gradient-to-r from-brand-purple/20 via-[#0E111C] to-brand-yellow/10 border border-brand-purple/30 p-5 sm:p-6 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-[200px] h-[200px] bg-brand-purple/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-5 z-10">
        
        {/* Left Info */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-brand-purple/30 text-white px-2.5 py-0.5 rounded-full border border-brand-purple/40 flex items-center gap-1">
              <Sparkles size={11} className="text-[#E9F2A3]" /> Account Verification
            </span>
            <span className="text-xs text-white/40 font-medium hidden sm:inline">
              Unlock Visa cards & wire accounts
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Complete your setup to unlock full banking features
          </h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Submit your legal name, create your custom StableTag, and complete quick ID verification to activate virtual cards.
          </p>

          {/* 3 Step Progress Chips */}
          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {hasName ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <Circle size={14} className="text-white/30" />
              )}
              <span className={hasName ? "text-white" : "text-white/40"}>Legal Name</span>
            </div>

            <span className="text-white/20">•</span>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {hasTag ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <Circle size={14} className="text-white/30" />
              )}
              <span className={hasTag ? "text-white" : "text-white/40"}>StableTag</span>
            </div>

            <span className="text-white/20">•</span>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {isKycApproved ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <Circle size={14} className="text-white/30" />
              )}
              <span className={isKycApproved ? "text-white" : "text-white/40"}>ID Document</span>
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end shrink-0">
          <Button
            onClick={onStartOnboarding}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-2xl h-11 px-5 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-purple/20 active:scale-95 transition-all"
          >
            Complete Verification <ArrowRight size={14} />
          </Button>

          <button
            onClick={() => setDismissed(true)}
            className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
