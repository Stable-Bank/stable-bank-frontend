"use client";

import { CircleCheckBig, Info, RefreshCw, Trash2 } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import RegenerateCardModal from "@/components/modal/regenerate-card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import DeleteVirtualCardModal from "@/components/modal/delete-virtual-card";

export default function UVCard() {
  const [activeTab, setActiveTab] = useState<"funding" | "transactions">(
    "funding"
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-[#E9F2A3]">Virtual Card</h1>
        <p className="text-brand-white text-sm font-normal">
          Manage your crypto-funded virtual card
        </p>
      </div>

      <div>
        <Image
          src={"/images/brand/stablebank-card-back.svg"}
          alt="Stablebank Card Back"
          width={500}
          height={220}
          className="h-[220px] w-auto object-cover"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 rounded-[6px] bg-[#0E121C] px-8 py-3 text-[22px] font-bold text-white/60">
          <Image
            src={"/images/svg/freeze.svg"}
            alt="freeze icon"
            width={26}
            height={26}
          />
          <span>Freeze Card</span>
        </div>

        <Dialog>
          <DialogTrigger className="flex cursor-pointer items-center gap-1.5 rounded-[6px] bg-[#0E121C] px-8 py-3 text-[22px] font-bold text-white/60">
            <RefreshCw size={26} />
            <span>Regenerate</span>
          </DialogTrigger>
          <RegenerateCardModal />
        </Dialog>

        <Dialog>
          <DialogTrigger className="flex cursor-pointer items-center gap-1.5 rounded-[6px] bg-[#0E121C] px-8 py-3 text-[22px] font-bold text-white/60">
            <Trash2 size={26} />
            <span>Delete Card</span>
          </DialogTrigger>
          <DeleteVirtualCardModal />
        </Dialog>
      </div>

      <div className="w-full max-w-[640px]">
        <VCardTabs
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          sources={[
            {
              name: "Ethereum",
              priority: 1,
              icon: "/icons/eth.svg",
              balance: "1.2547",
              fiatValue: "$3,241.49",
              symbol: "ETH",
              color: "bg-blue-500",
            },
            {
              name: "BNB",
              priority: 2,
              icon: "/icons/bnb.svg",
              balance: "1.2547",
              fiatValue: "$3,241.49",
              symbol: "BNB",
              color: "bg-yellow-400",
            },
          ]}
        />
      </div>
    </div>
  );
}

type VCardTab = {
  name: string;
  priority: number;
  icon: string;
  balance: string;
  fiatValue: string;
  symbol: string;
  color: string;
};

type VCardTabsProps = {
  activeTab: "funding" | "transactions";
  onTabChange: (tab: "funding" | "transactions") => void;
  sources: VCardTab[];
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
  sources,
}) => {
  return (
    <div className="">
      <div className="mb-5 flex w-fit rounded-[20px] bg-[#0E121C] p-1">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "transform rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-linear",
              activeTab === tab.key ? "bg-brand-purple" : "bg-transparent"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="transition-all duration-200 ease-linear transform-content">
        {activeTab === "funding" && <FundingTab sources={sources} />}
        {activeTab === "transactions" && <TransactionTab />}
      </div>
    </div>
  );
};

function FundingTab({ sources }: { sources: VCardTab[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#E9F2A3]">Funding Sources</h2>
      <p className="text-brand-white mb-8 text-sm">
        Cards Will Pull Funds in priority order: Ethereum first, then BNB, then
        USDC
      </p>

      <div className="flex flex-col gap-6">
        {sources.map((src, i) => (
          <Card
            key={i}
            className="rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !py-4 !pr-12 !pl-3.5 shadow-md"
          >
            <CardContent className="flex items-center justify-between px-0 py-0">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    src.color
                  )}
                >
                  <Image
                    src={src.icon}
                    alt={src.name}
                    width={46}
                    height={46}
                    className="h-[46px] w-[46px] object-contain"
                  />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{src.name}</p>
                  <p className="text-sm text-[#E9E9E9]">
                    Priority #{src.priority}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-[#E9F2A3]">
                  {src.balance} {src.symbol}
                </p>
                <p className="text-sm text-[#E9E9E9]">{src.fiatValue}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TransactionTab() {
  const dummyTransactions = [
    {
      name: "Amazon",
      priority: 1,
      date: "2025-01-08",
      icon: "/icons/eth.svg",
      balance: "1.2547",
      fiatValue: "$3,241.49",
      symbol: "ETH",
      color: "bg-blue-500",
    },
    {
      name: "Startbucks",
      priority: 2,
      date: "2025-01-08",
      icon: "/icons/bnb.svg",
      balance: "1.2547",
      fiatValue: "$3,241.49",
      symbol: "BNB",
      color: "bg-yellow-400",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#E9F2A3]">Funding Sources</h2>
      <p className="text-brand-white mb-8 text-sm">
        Cards Will Pull Funds in priority order: Ethereum first, then BNB, then
        USDC
      </p>

      <div className="flex flex-col gap-6">
        {dummyTransactions.map((src, i) => (
          <Card
            key={i}
            className="rounded-[14px] border-[0.2px] border-solid border-white/60 bg-[#0E121C] !px-0 !py-0 shadow-md"
          >
            <CardContent className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-2xl font-semibold">{src.name}</p>
                  <p className="text-sm text-[#E9E9E9]">{src.date}</p>
                  <div className="flex items-center gap-1 font-semibold text-[#319F43]">
                    <CircleCheckBig size={12} color="#319F43" />
                    <span>Completed</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-[#E9F2A3]">
                  {src.balance} {src.symbol}
                </p>
                <p className="text-sm text-[#E9E9E9]">{src.fiatValue}</p>
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
