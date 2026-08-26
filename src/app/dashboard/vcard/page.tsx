"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  CreditCard,
  Plus,
  Snowflake,
  Unlock,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Globe,
  Smartphone,
  Loader2,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cardService } from "@/services/cardService";
import { web3Service } from "@/services/web3Service";
import type { VirtualCard, CardTransaction } from "@/types/card";
import type { UnifiedBalance } from "@/types/wallet";
import { ChainLogo } from "@/components/common/crypto-icons";
import IssueCardModal from "@/components/modal/issue-card-modal";
import OnboardingModal from "@/components/modal/onboarding-modal";
import RegenerateCardModal from "@/components/modal/regenerate-card";
import DeleteVirtualCardModal from "@/components/modal/delete-virtual-card";

/* -------------------------------------------------------------------------- */
/*                               VISA LOGO SVG                                */
/* -------------------------------------------------------------------------- */
function VisaLogo({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 780 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M292.8 234.3L327.9 14.7H384L348.9 234.3H292.8Z" fill="white" />
      <path d="M518.7 21.6C507.6 17.1 490.5 12.3 469.5 12.3C416.7 12.3 379.8 40.5 379.5 80.7C379.2 110.4 405.9 126.9 426.3 136.8C447.3 147 454.2 153.6 454.2 162.9C453.9 177 437.1 183.6 421.8 183.6C399.9 183.6 387.6 180.3 369.3 172.2L361.8 168.9L354 217.5C367.2 223.5 391.5 228.6 416.7 228.9C472.5 228.9 508.8 201.3 509.4 158.7C509.7 123.6 482.4 104.1 454.5 90.6C437.7 82.2 427.2 75.9 427.5 67.2C427.5 56.7 439.8 45.6 464.7 45.6C483.6 45.3 497.7 49.5 507.9 54L512.7 56.4L518.7 21.6Z" fill="white" />
      <path d="M592.5 152.4C597.3 139.5 615.6 90 615.6 90C615.3 90.6 619.5 79.5 621.9 72.9L625.5 89.7C625.5 89.7 635.7 139.2 638.1 152.4H592.5ZM669.9 14.7H626.4C612.9 14.7 602.7 18.6 596.7 32.7L509.7 234.3H568.5L580.2 201.9H652.2L658.8 234.3H710.4L669.9 14.7Z" fill="white" />
      <path d="M246.6 14.7L191.7 164.7L185.7 134.4C175.5 99.6 145.2 62.1 110.7 43.8L162 234L221.4 233.7L309.9 14.7H246.6Z" fill="white" />
      <path d="M127.2 14.7H31.5L30 21.9C104.4 40.8 153.6 86.4 174 133.2L149.1 19.8C144.9 3.6 137.4 15 127.2 14.7Z" fill="#F7B600" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                           STABLEBANK LOGO WHITE                            */
/* -------------------------------------------------------------------------- */
function StableBankLogoWhite({ className = "h-5 w-auto" }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 select-none", className)}>
      <Image
        src="/images/brand/gradient-logo-favicon.svg"
        alt="StableBank Icon"
        width={22}
        height={22}
        className="w-5 h-5 drop-shadow-sm"
      />
      <span className="font-display font-black text-white text-sm sm:text-base tracking-wider uppercase">
        Stable<span className="text-brand-purple-light text-purple-300">Bank</span>
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       EMV CONTACT CHIP & NFC WAVES                         */
/* -------------------------------------------------------------------------- */
function EMVChip() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-11 h-8 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-400 border border-amber-400/80 shadow-inner flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 border border-amber-600/30 rounded-md"></div>
        <div className="w-full h-[1px] bg-amber-700/30"></div>
        <div className="absolute h-full w-[1px] bg-amber-700/30"></div>
        <div className="absolute w-4 h-4 rounded-full border border-amber-700/30"></div>
      </div>
      <svg
        className="w-5 h-5 text-white/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8.5 16.5a5 5 0 0 1 0-9" />
        <path d="M12 19a8.5 8.5 0 0 0 0-14" />
        <path d="M15.5 21.5a12 12 0 0 0 0-19" />
      </svg>
    </div>
  );
}

export default function UVCard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"funding" | "transactions">("funding");
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [balance, setBalance] = useState<UnifiedBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const fetchCardsData = useCallback(async () => {
    try {
      const cardsData = await cardService.getUserCards();
      setCards(cardsData || []);
      if (cardsData && cardsData.length > 0) {
        setSelectedCard(cardsData[0]);
      } else {
        setSelectedCard(null);
      }
    } catch (err) {
      console.debug("Failed to fetch cards:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await fetchCardsData();

        const targetAddr = (user as any)?.primaryWalletAddress || user?.walletAddress;
        if (targetAddr) {
          const balanceData = await web3Service.getUnifiedBalance(targetAddr);
          setBalance(balanceData);
        }
      } catch (error: any) {
        console.error("Failed to fetch card data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.walletAddress, (user as any)?.primaryWalletAddress, fetchCardsData]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedCard) return;

      try {
        const txData = await cardService.getCardTransactions(selectedCard.cardId, {
          limit: 20,
        });
        setTransactions(txData || []);
      } catch (error: any) {
        console.debug("Failed to fetch transactions:", error);
      }
    };

    if (selectedCard) {
      fetchTransactions();
    }
  }, [selectedCard, activeTab]);

  const handleCreateCard = () => {
    if (user?.kycStatus !== "approved") {
      setIsOnboardingOpen(true);
      return;
    }
    setIsIssueModalOpen(true);
  };

  const handleConfirmIssueCard = async () => {
    try {
      setIsCreatingCard(true);
      const cardholderName = `${user?.firstName || "Stable"} ${user?.lastName || "Member"}`.trim();
      await cardService.createCard({
        cardholderName,
        limits: { daily: 5000, monthly: 50000, perTransaction: 2500 },
      });
      toast.success("Bridge Visa Virtual Card issued successfully! +75 Loyalty Points awarded");
      await fetchCardsData();
      setIsIssueModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to issue card");
    } finally {
      setIsCreatingCard(false);
    }
  };

  const handleKycComplete = () => {
    setIsIssueModalOpen(true);
  };

  const handleFreezeCard = async () => {
    if (!selectedCard) return;

    setIsProcessing(true);
    try {
      if (selectedCard.status === "active") {
        await cardService.freezeCard(selectedCard.cardId);
        toast.success("Card frozen successfully. Transactions will be declined until unfrozen.");
      } else {
        await cardService.unfreezeCard(selectedCard.cardId);
        toast.success("Card unfrozen and active for immediate spending!");
      }

      await fetchCardsData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update card status");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;

    setIsProcessing(true);
    try {
      await cardService.terminateCard(selectedCard.cardId);
      toast.success("Virtual card deleted successfully");
      await fetchCardsData();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete card");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCardNumber = () => {
    if (!selectedCard) return;
    const cleanNum = selectedCard.cardNumber.replace(/\s+/g, "");
    navigator.clipboard.writeText(cleanNum);
    setCopiedNumber(true);
    toast.success("Card number copied to clipboard!");
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
        <p className="text-zinc-500 font-sans text-sm font-medium">Loading virtual card suite...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 max-w-[1440px] mx-auto w-full pb-12 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 tracking-tight">
              Virtual Debit Card
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
              <Zap size={12} className="fill-brand-purple" />
              Bridge.xyz Rails
            </span>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-sans mt-1 max-w-[600px]">
            Zero-fee global Visa debit card backed directly by your unified multi-chain stablecoin balances.
          </p>
        </div>

        {cards.length > 0 && (
          <Button
            onClick={handleCreateCard}
            disabled={isCreatingCard}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-bold h-10 px-5 text-xs shadow-md shadow-brand-purple/20 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto transition-all"
          >
            <Plus size={16} />
            <span>Issue New Card</span>
          </Button>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 py-20 max-w-[540px] mx-auto text-center">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-purple/15 to-purple-100 text-brand-purple flex items-center justify-center border border-brand-purple/25 shadow-sm">
            <CreditCard size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-extrabold text-zinc-950">
              Activate Your Bridge Visa Card
            </h2>
            <p className="text-zinc-600 font-sans text-sm leading-relaxed max-w-[420px]">
              Spend USDC, USDT, and USDB anywhere Visa is accepted worldwide. Real-time auto-liquidation, Apple Pay integration, and 0% FX fees.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-[420px] text-left text-xs font-sans text-zinc-700 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Apple Pay & Google Pay</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>0% Foreign Exchange Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Multi-Chain Auto-Debit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600 shrink-0" />
              <span>Instant Card Freezing</span>
            </div>
          </div>

          <Button
            onClick={handleCreateCard}
            disabled={isCreatingCard}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-bold h-12 px-8 text-sm shadow-lg shadow-brand-purple/25 cursor-pointer flex items-center gap-2 transition-transform hover:scale-[1.02]"
          >
            {isCreatingCard ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Provisioning Card...</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Issue Visa Virtual Card</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="relative w-full max-w-[460px] mx-auto lg:max-w-none rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-zinc-950 via-[#181126] to-[#0d0a14] border border-white/15 text-white shadow-2xl shadow-purple-950/20 flex flex-col justify-between aspect-[1.586] overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-brand-purple/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 flex items-center justify-between">
                <StableBankLogoWhite />
                <span
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border shadow-xs transition-colors",
                    selectedCard?.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : selectedCard?.status === "frozen"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-red-500/20 text-red-300 border-red-500/30"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      selectedCard?.status === "active" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                    )}
                  />
                  {selectedCard?.status?.toUpperCase()}
                </span>
              </div>

              <div className="relative z-10 my-auto flex flex-col gap-3 pt-2">
                <EMVChip />
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-base sm:text-xl font-mono font-bold tracking-[0.22em] text-white/95 drop-shadow-sm select-all">
                    {selectedCard?.cardNumber}
                  </p>
                  <button
                    onClick={handleCopyCardNumber}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Copy Card Number"
                  >
                    {copiedNumber ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">Cardholder</span>
                  <span className="text-xs sm:text-sm font-sans font-bold text-white tracking-wide uppercase truncate max-w-[180px]">
                    {selectedCard?.cardholderName}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">Expires</span>
                    <span className="text-xs sm:text-sm font-mono font-bold text-white">
                      {selectedCard?.expiryMonth}/{selectedCard?.expiryYear}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase">CVV</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-mono font-bold text-white">
                        {showCvv ? "842" : "•••"}
                      </span>
                      <button
                        onClick={() => setShowCvv(!showCvv)}
                        className="text-white/60 hover:text-white transition-colors p-0.5"
                        title={showCvv ? "Hide CVV" : "Show CVV"}
                      >
                        {showCvv ? <EyeOff size={12} /> : <Eye size={12} />}
                      </button>
                    </div>
                  </div>

                  <div className="pl-2">
                    <VisaLogo className="h-6 sm:h-7 w-auto drop-shadow-md" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <button
                onClick={handleFreezeCard}
                disabled={isProcessing || !selectedCard}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-xs sm:text-sm font-sans font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                  selectedCard?.status === "active"
                    ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900"
                    : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800"
                )}
              >
                {selectedCard?.status === "active" ? (
                  <>
                    <Snowflake size={16} className="text-blue-500 shrink-0" />
                    <span>Freeze</span>
                  </>
                ) : (
                  <>
                    <Unlock size={16} className="text-emerald-600 shrink-0" />
                    <span>Unfreeze</span>
                  </>
                )}
              </button>

              <Dialog>
                <DialogTrigger
                  disabled={!selectedCard}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white border border-zinc-200 px-3 py-3 text-xs sm:text-sm font-sans font-bold text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={15} className="text-zinc-600 shrink-0" />
                  <span>Regenerate</span>
                </DialogTrigger>
                <RegenerateCardModal card={selectedCard} onSuccess={fetchCardsData} />
              </Dialog>

              <Dialog>
                <DialogTrigger
                  disabled={!selectedCard}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-white border border-zinc-200 px-3 py-3 text-xs sm:text-sm font-sans font-bold text-red-600 hover:text-red-700 hover:bg-red-50/60 shadow-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} className="text-red-500 shrink-0" />
                  <span>Delete</span>
                </DialogTrigger>
                <DeleteVirtualCardModal card={selectedCard} onConfirm={handleDeleteCard} />
              </Dialog>
            </div>

            <Card className="rounded-3xl border border-zinc-200/90 bg-white p-5 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-bold text-zinc-950">Daily Spending Limit</span>
                  <span className="text-xs font-mono font-bold text-zinc-950">
                    $0.00 / ${(selectedCard?.limits?.daily || 5000).toLocaleString()}.00
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
                  <div className="h-full bg-brand-purple rounded-full w-[0%]"></div>
                </div>

                <div className="pt-2 border-t border-zinc-100 grid grid-cols-2 gap-3 text-xs font-sans text-zinc-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                    <span>3D Secure 2.0 Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-brand-purple shrink-0" />
                    <span>0% Foreign FX Fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone size={15} className="text-zinc-700 shrink-0" />
                    <span>Apple & Google Wallet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap size={15} className="text-amber-500 shrink-0" />
                    <span>Bridge Instant Liquidation</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200">
              <div className="flex items-center gap-1.5 w-full">
                <button
                  onClick={() => setActiveTab("funding")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer",
                    activeTab === "funding"
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                  )}
                >
                  <Layers size={16} className={activeTab === "funding" ? "text-brand-purple" : "text-zinc-500"} />
                  <span>Funding Sources</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-brand-purple/10 text-brand-purple font-bold">
                    {balance?.chains?.length || 4}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("transactions")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-sans font-bold transition-all cursor-pointer",
                    activeTab === "transactions"
                      ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/60"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40"
                  )}
                >
                  <ShoppingBag size={16} className={activeTab === "transactions" ? "text-brand-purple" : "text-zinc-500"} />
                  <span>Live Activity</span>
                  <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-zinc-200 text-zinc-700 font-bold">
                    {transactions.length}
                  </span>
                </button>
              </div>
            </div>

            {activeTab === "funding" ? (
              <FundingSourcesView balance={balance} />
            ) : (
              <TransactionsView transactions={transactions} />
            )}
          </div>
        </div>
      )}

      <IssueCardModal
        open={isIssueModalOpen}
        onOpenChange={setIsIssueModalOpen}
        onConfirm={handleConfirmIssueCard}
        isLoading={isCreatingCard}
        cardholderName={`${user?.firstName || "Stable"} ${user?.lastName || "Member"}`.trim()}
      />

      <OnboardingModal
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        onComplete={handleKycComplete}
        triggerReason="card"
      />
    </div>
  );
}

function FundingSourcesView({ balance }: { balance: UnifiedBalance | null }) {
  const getChainBal = (name: string) => {
    return balance?.chains?.find((c) => c.chainName.toLowerCase().includes(name.toLowerCase()))?.balanceUSD || 0;
  };

  const defaultChains = [
    {
      id: "solana",
      chainName: "Solana",
      priority: 1,
      balanceUSD: getChainBal("solana") || balance?.totalUSD || 0,
      tokens: ["USDC", "USDB", "EURC"],
      isPrimary: true,
      tag: "Bridge Primary Rail",
    },
    {
      id: "base",
      chainName: "Base",
      priority: 2,
      balanceUSD: getChainBal("base"),
      tokens: ["USDC", "EURC"],
      isPrimary: false,
      tag: "Fallback Rail",
    },
    {
      id: "polygon",
      chainName: "Polygon POS",
      priority: 3,
      balanceUSD: getChainBal("polygon"),
      tokens: ["USDC", "USDT"],
      isPrimary: false,
      tag: "Fallback Rail",
    },
    {
      id: "ethereum",
      chainName: "Ethereum Mainnet",
      priority: 4,
      balanceUSD: getChainBal("ethereum"),
      tokens: ["USDC", "USDT"],
      isPrimary: false,
      tag: "Reserve Rail",
    },
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-zinc-950">
            Multi-Chain Liquidation Hierarchy
          </h2>
          <p className="text-zinc-500 font-sans text-xs mt-0.5">
            Cards draw liquidity automatically in order of priority when purchases occur
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Auto-Debiting Active
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {defaultChains.map((chain) => (
          <Card
            key={chain.id}
            className={cn(
              "rounded-2xl border bg-white p-4 shadow-xs transition-all hover:border-brand-purple/30",
              chain.isPrimary ? "border-brand-purple/40 bg-purple-50/20" : "border-zinc-200/90"
            )}
          >
            <CardContent className="flex items-center justify-between p-0 gap-3">
              <div className="flex items-center gap-3">
                <ChainLogo chainId={chain.id} chainName={chain.chainName} size={42} />

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-sans font-bold text-zinc-950">{chain.chainName}</p>
                    <span
                      className={cn(
                        "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full",
                        chain.isPrimary
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-zinc-100 text-zinc-600"
                      )}
                    >
                      Priority #{chain.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    {chain.tokens.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200/60"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="text-[10px] font-sans text-zinc-400 hidden sm:inline">• {chain.tag}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm sm:text-base font-mono font-bold text-zinc-950">
                  ${(chain.balanceUSD || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] font-sans font-medium text-emerald-600">Available to Spend</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl bg-zinc-50 border border-zinc-200/80 p-4 text-xs font-sans text-zinc-600">
        <p>Need to top up your card balance? Deposit stablecoins to your Bridge custodial address anytime.</p>
      </div>
    </div>
  );
}

function TransactionsView({ transactions }: { transactions: CardTransaction[] }) {
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "declined">("all");

  const filteredTx = (transactions || []).filter((tx) => {
    if (filter === "all") return true;
    return tx.status === filter;
  });

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <h2 className="text-base sm:text-lg font-display font-bold text-zinc-950">Card Transaction Stream</h2>
          <p className="text-zinc-500 font-sans text-xs mt-0.5">Real-time authorizations and settlement activity</p>
        </div>

        {transactions && transactions.length > 0 && (
          <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-200/80 self-start sm:self-auto">
            {(["all", "approved", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-sans font-bold capitalize transition-colors cursor-pointer",
                  filter === f ? "bg-white text-zinc-950 shadow-2xs" : "text-zinc-500 hover:text-zinc-900"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction List or Clean Empty State */}
      {filteredTx.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/70 p-6">
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 mb-3 shadow-xs">
            <ShoppingBag size={22} className="text-zinc-500" />
          </div>
          <p className="text-zinc-900 font-sans font-bold text-sm">No card activity yet</p>
          <p className="text-xs text-zinc-500 font-sans mt-1 max-w-[320px] leading-relaxed">
            When you make purchases online or in-store using your Visa Virtual Card, live authorizations and Bridge settlement logs will appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filteredTx.map((tx) => (
            <Card key={tx.id} className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-xs transition-colors hover:bg-zinc-50/50">
              <CardContent className="flex items-center justify-between p-0 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold shrink-0">
                    <ShoppingBag size={18} className="text-brand-purple" />
                  </div>
                  <div>
                    <p className="text-sm font-sans font-bold text-zinc-950">{tx.merchant}</p>
                    <p className="text-xs font-sans text-zinc-500">
                      {tx.merchantCategory || "Card Purchase"} •{" "}
                      <span className="font-mono text-zinc-400">
                        {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString() : "Recent"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-mono font-bold text-zinc-950">
                    -${(tx.amount || 0).toFixed(2)}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span
                      className={cn(
                        "text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full uppercase",
                        tx.status === "approved"
                          ? "text-emerald-600 bg-emerald-50 border border-emerald-200/60"
                          : tx.status === "declined"
                            ? "text-red-600 bg-red-50 border border-red-200/60"
                            : "text-amber-600 bg-amber-50 border border-amber-200/60"
                      )}
                    >
                      {tx.status}
                    </span>
                    <span className="text-[10px] font-sans text-zinc-400 hidden sm:inline">0% FX Fee</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
