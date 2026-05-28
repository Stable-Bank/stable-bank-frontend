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
        <p className="text-xl text-white/60">No virtual cards yet</p>
        <Button className="bg-brand-purple text-white">
          <Plus size={20} className="mr-2" />
          Create Virtual Card
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#E9F2A3]">Virtual Card</h1>
        <p className="text-brand-white text-sm sm:text-sm font-normal">
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
            className="h-auto w-full object-contain"
          />
          {selectedCard && (
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              <div className="flex justify-between">
                <span className="text-sm font-medium">StableBank</span>
                <span
                  className={cn(
                    "text-sm font-semibold px-2 py-1 rounded",
                    selectedCard.status === "active"
                      ? "bg-green-500"
                      : selectedCard.status === "frozen"
                        ? "bg-blue-500"
                        : "bg-red-500"
                  )}
                >
                  {selectedCard.status.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-mono tracking-wider">
                  {selectedCard.cardNumber}
                </p>
                <div className="mt-2 flex justify-between text-sm">
                  <span>{selectedCard.cardholderName}</span>
                  <span>
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
          className="flex items-center justify-center gap-1 sm:gap-1.5 rounded-[6px] bg-[#0E121C] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[22px] font-bold text-white/60 hover:text-white/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src={"/images/svg/freeze.svg"}
            alt="freeze icon"
            width={20}
            height={20}
            className="sm:w-[22px] sm:h-[22px] lg:w-[26px] lg:h-[26px]"
          />
          <span>
            {selectedCard?.status === "active" ? "Freeze Card" : "Unfreeze Card"}
          </span>
        </button>

        <Dialog>
          <DialogTrigger
            disabled={!selectedCard}
            className="flex cursor-pointer items-center justify-center gap-1 sm:gap-1.5 rounded-[6px] bg-[#0E121C] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[22px] font-bold text-white/60 hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={20} className="sm:w-[22px] sm:h-[22px] lg:w-[26px] lg:h-[26px]" />
            <span>Regenerate</span>
          </DialogTrigger>
          <RegenerateCardModal card={selectedCard} onSuccess={() => {}} />
        </Dialog>

        <Dialog>
          <DialogTrigger
            disabled={!selectedCard}
            className="flex cursor-pointer items-center justify-center gap-1 sm:gap-1.5 rounded-[6px] bg-[#0E121C] px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-base sm:text-lg lg:text-[22px] font-bold text-white/60 hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} className="sm:w-[22px] sm:h-[22px] lg:w-[26px] lg:h-[26px]" />
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
      <div className="mb-4 sm:mb-5 flex w-full sm:w-fit rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-[#0E121C] p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "transform rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-sm font-medium transition-all duration-200 ease-linear whitespace-nowrap",
              activeTab === tab.key ? "bg-brand-purple" : "bg-transparent"
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
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-white/60">No funding sources available</p>
        <p className="text-sm text-white/40">Add funds to your wallet to use your card</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#E9F2A3]">
        Funding Sources
      </h2>
      <p className="text-brand-white mb-5 sm:mb-6 lg:mb-8 text-sm sm:text-sm">
        Cards will pull funds in priority order from your available balances
      </p>

      <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
        {balance.chains.map((chain, i) => (
          <Card
            key={chain.chainId}
            className="rounded-[10px] sm:rounded-[12px] lg:rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !py-3 sm:!py-4 !pr-4 sm:!pr-8 lg:!pr-12 !pl-2.5 sm:!pl-3.5 shadow-md"
          >
            <CardContent className="flex items-center justify-between px-0 py-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full shrink-0 bg-gradient-to-br from-purple-500 to-blue-500">
                  <span className="text-lg font-bold">
                    {chain.chainName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-base sm:text-lg lg:text-2xl font-semibold">
                    {chain.chainName}
                  </p>
                  <p className="text-sm sm:text-sm text-[#E9E9E9]">Priority #{i + 1}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-base sm:text-lg lg:text-2xl font-semibold text-[#E9F2A3]">
                  ${(chain.balanceUSD || 0).toFixed(2)}
                </p>
                <p className="text-sm sm:text-sm text-[#E9E9E9]">
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
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-white/60">No transactions yet</p>
        <p className="text-sm text-white/40">
          Your card transactions will appear here
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#E9F2A3]">Recent Transactions</h2>
      <p className="text-brand-white mb-8 text-sm">
        Your card transaction history
      </p>

      <div className="flex flex-col gap-6">
        {transactions.map((tx) => (
          <Card
            key={tx.id}
            className="rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !px-0 !py-0 shadow-md"
          >
            <CardContent className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-2xl font-semibold">{tx.merchant}</p>
                  <p className="text-sm text-[#E9E9E9]">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </p>
                  <div
                    className={cn(
                      "flex items-center gap-1 font-semibold",
                      tx.status === "approved"
                        ? "text-[#319F43]"
                        : tx.status === "declined"
                          ? "text-[#FE0420]"
                          : "text-[#FFA500]"
                    )}
                  >
                    <CircleCheckBig size={12} />
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-[#E9F2A3]">
                  ${(tx.amount || 0).toFixed(2)}
                </p>
                <p className="text-sm text-[#E9E9E9]">{tx.currency}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex gap-1.5 rounded-[8px] bg-[#EFF6FF] p-2">
        <Info size={24} color="#4649D6" />

        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-bold text-[#0E121C]">Important Note</h2>
          <p className="text-sm text-[#4649D6]">
            Your card automatically converts crypto to fiat at the time of
            purchase. Ensure you have sufficient balance in your priority
            funding sources
          </p>
        </div>
      </div>
    </div>
  );
}
