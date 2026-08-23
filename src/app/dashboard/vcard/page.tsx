"use client";

import { CircleCheckBig, Info, RefreshCw, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import RegenerateCardModal from "@/components/modal/regenerate-card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteVirtualCardModal from "@/components/modal/delete-virtual-card";
import { cardService } from "@/services/cardService";
import { web3Service } from "@/services/web3Service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { VirtualCard, CardTransaction } from "@/types/card";
import type { UnifiedBalance } from "@/types/wallet";

export default function UVCard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"funding" | "transactions">("funding");
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<VirtualCard | null>(null);
  const [transactions, setTransactions] = useState<CardTransaction[]>([]);
  const [balance, setBalance] = useState<UnifiedBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch cards and balance
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.walletAddress) return;

      setIsLoading(true);
      try {
        // Fetch cards
        const cardsData = await cardService.getUserCards();
        setCards(cardsData);
        if (cardsData.length > 0) {
          setSelectedCard(cardsData[0]);
        }

        // Fetch balance for funding sources
        const balanceData = await web3Service.getUnifiedBalance(user.walletAddress);
        setBalance(balanceData);
      } catch (error: any) {
        console.error("Failed to fetch card data:", error);
        toast.error(error?.message || "Failed to load card data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.walletAddress]);

  // Fetch transactions when card is selected
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedCard) return;

      try {
        const txData = await cardService.getCardTransactions(selectedCard.cardId, {
          limit: 10,
        });
        setTransactions(txData);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    if (activeTab === "transactions") {
      fetchTransactions();
    }
  }, [selectedCard, activeTab]);

  const handleFreezeCard = async () => {
    if (!selectedCard) return;

    setIsProcessing(true);
    try {
      if (selectedCard.status === "active") {
        await cardService.freezeCard(selectedCard.cardId);
        toast.success("Card frozen successfully");
      } else {
        await cardService.unfreezeCard(selectedCard.cardId);
        toast.success("Card unfrozen successfully");
      }

      // Refresh cards
      const cardsData = await cardService.getUserCards();
      setCards(cardsData);
      const updated = cardsData.find((c) => c.cardId === selectedCard.cardId);
      if (updated) setSelectedCard(updated);
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
      toast.success("Card deleted successfully");

      // Refresh cards
      const cardsData = await cardService.getUserCards();
      setCards(cardsData);
      setSelectedCard(cardsData.length > 0 ? cardsData[0] : null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete card");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-xl text-zinc-500 font-sans">No virtual cards yet</p>
        <Button className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full font-bold shadow-md shadow-brand-purple/20">
          <Plus size={20} className="mr-2" />
          Create Virtual Card
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8 max-w-[1440px] mx-auto w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950">Virtual Card</h1>
        <p className="text-zinc-600 text-sm sm:text-base font-sans mt-0.5">
          Manage your crypto-funded virtual card
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="relative min-w-[300px] max-w-[500px]">
          <Image
            src={"/images/brand/stablebank-card-back.svg"}
            alt="Stablebank Card"
            width={500}
            height={220}
            className="h-auto w-full object-contain drop-shadow-md"
          />
          {selectedCard && (
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              <div className="flex justify-between">
                <span className="text-sm font-bold font-sans">StableBank</span>
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-0.5 rounded-full uppercase",
                    selectedCard.status === "active"
                      ? "bg-emerald-500/90 text-white"
                      : selectedCard.status === "frozen"
                        ? "bg-amber-500/90 text-white"
                        : "bg-red-500/90 text-white"
                  )}
                >
                  {selectedCard.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-mono font-bold tracking-wider">
                  {selectedCard.cardNumber}
                </p>
                <div className="mt-2 flex justify-between text-xs sm:text-sm font-sans font-medium">
                  <span>{selectedCard.cardholderName}</span>
                  <span className="font-mono">
                    {selectedCard.expiryMonth}/{selectedCard.expiryYear}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-6">
        <button
          onClick={handleFreezeCard}
          disabled={isProcessing || !selectedCard}
          className="flex items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-bold text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src={"/images/svg/freeze.svg"}
            alt="freeze icon"
            width={18}
            height={18}
            className="sm:w-[20px] sm:h-[20px]"
          />
          <span>
            {selectedCard?.status === "active" ? "Freeze Card" : "Unfreeze Card"}
          </span>
        </button>

        <Dialog>
          <DialogTrigger
            disabled={!selectedCard}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-bold text-zinc-800 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className="sm:w-[20px] sm:h-[20px]" />
            <span>Regenerate</span>
          </DialogTrigger>
          <RegenerateCardModal card={selectedCard} onSuccess={() => {}} />
        </Dialog>

        <Dialog>
          <DialogTrigger
            disabled={!selectedCard}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-sans font-bold text-red-600 hover:text-red-700 hover:bg-red-50 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} className="sm:w-[20px] sm:h-[20px]" />
            <span>Delete Card</span>
          </DialogTrigger>
          <DeleteVirtualCardModal card={selectedCard} onConfirm={handleDeleteCard} />
        </Dialog>
      </div>

      <div className="w-full max-w-full lg:max-w-[640px]">
        <VCardTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          balance={balance}
          transactions={transactions}
        />
      </div>
    </div>
  );
}

type VCardTabsProps = {
  activeTab: "funding" | "transactions";
  onTabChange: (tab: "funding" | "transactions") => void;
  balance: UnifiedBalance | null;
  transactions: CardTransaction[];
};

type Tab = {
  key: "funding" | "transactions";
  label: string;
};

const tabs: Tab[] = [
  { key: "funding", label: "Funding Sources" },
  { key: "transactions", label: "Transactions" },
];

const VCardTabs: React.FC<VCardTabsProps> = ({
  activeTab,
  onTabChange,
  balance,
  transactions,
}) => {
  return (
    <div className="">
      <div className="mb-4 sm:mb-5 flex w-full sm:w-fit rounded-xl bg-zinc-100 border border-zinc-200 p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "transform rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-sans font-bold transition-all duration-200 ease-linear whitespace-nowrap cursor-pointer",
              activeTab === tab.key ? "bg-brand-purple text-white shadow-xs" : "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="transition-all duration-200 ease-linear transform-content">
        {activeTab === "funding" && <FundingTab balance={balance} />}
        {activeTab === "transactions" && <TransactionTab transactions={transactions} />}
      </div>
    </div>
  );
};

function FundingTab({ balance }: { balance: UnifiedBalance | null }) {
  if (!balance || !balance.chains || balance.chains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50 p-6">
        <p className="text-zinc-700 font-sans font-semibold text-sm">No funding sources available</p>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">Add funds to your wallet to use your card</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-display font-bold text-zinc-950">
        Funding Sources
      </h2>
      <p className="text-zinc-600 mb-5 sm:mb-6 font-sans text-xs sm:text-sm mt-0.5">
        Cards will pull funds in priority order from your available balances
      </p>

      <div className="flex flex-col gap-3 sm:gap-4">
        {balance.chains.map((chain, i) => (
          <Card
            key={chain.chainId}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <CardContent className="flex items-center justify-between px-0 py-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shrink-0 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple font-mono font-bold">
                  <span className="text-base font-bold">
                    {chain.chainName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm sm:text-base font-sans font-bold text-zinc-950">
                    {chain.chainName}
                  </p>
                  <p className="text-xs font-mono font-semibold text-zinc-400">Priority #{i + 1}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm sm:text-base font-mono font-bold text-zinc-950">
                  ${(chain.balanceUSD || 0).toFixed(2)}
                </p>
                <p className="text-xs font-sans text-zinc-500">
                  {chain.tokens?.length || 0} token{chain.tokens?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TransactionTab({ transactions }: { transactions: CardTransaction[] }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50 p-6">
        <p className="text-zinc-700 font-sans font-semibold text-sm">No transactions yet</p>
        <p className="text-xs text-zinc-400 font-sans mt-0.5">
          Your card transaction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-display font-bold text-zinc-950">Recent Transactions</h2>
      <p className="text-zinc-600 mb-5 font-sans text-xs sm:text-sm mt-0.5">
        Your card transaction history
      </p>

      <div className="flex flex-col gap-3">
        {transactions.map((tx) => (
          <Card
            key={tx.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <CardContent className="flex items-center justify-between px-0 py-0">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm sm:text-base font-sans font-bold text-zinc-950">{tx.merchant}</p>
                  <p className="text-xs text-zinc-500 font-sans">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs font-mono font-bold mt-1",
                      tx.status === "approved"
                        ? "text-emerald-600"
                        : tx.status === "declined"
                          ? "text-red-600"
                          : "text-amber-600"
                    )}
                  >
                    <CircleCheckBig size={12} />
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm sm:text-base font-mono font-bold text-zinc-950">
                  ${(tx.amount || 0).toFixed(2)}
                </p>
                <p className="text-xs font-mono text-zinc-500">{tx.currency}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 p-4">
        <Info size={20} className="text-brand-purple shrink-0 mt-0.5" />

        <div className="flex flex-col gap-0.5">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">Important Note</h2>
          <p className="text-xs text-zinc-700 font-sans leading-relaxed">
            Your card automatically converts crypto to fiat at the time of
            purchase. Ensure you have sufficient balance in your priority
            funding sources
          </p>
        </div>
      </div>
    </div>
  );
}
