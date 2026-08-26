"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { NetworkIcon } from "@web3icons/react/dynamic";
import Image from "next/image";

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("solana");
  const [searchFilter, setSearchFilter] = useState("");

  const selectedNetworkData = networks.find((n) => n.id === selectedNetwork);
  const otherNetworks = networks.filter((n) => n.id !== selectedNetwork);

  const handleNetworkSelect = (networkId: string) => {
    setSelectedNetwork(networkId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex transform cursor-pointer items-center rounded-full p-1 pr-3 transition-colors duration-200 hover:bg-zinc-100 border border-zinc-200 bg-white"
      >
        <div className="flex -space-x-2">
          {otherNetworks.slice(0, 4).map((network, index) => (
            <div
              key={network.id}
              className={`h-7 w-7 rounded-full ${network.bgColor} ${network.textColor} flex items-center justify-center font-sans text-xs font-medium z-${10 - index} border border-white overflow-hidden`}
            >
              {network.logo ? (
                <Image src={network.logo} alt={network.name} width={16} height={16} className="rounded-full" />
              ) : (
                <NetworkIcon id={network.id} variant="branded" size={16} fallback={<span>{network.icon}</span>} />
              )}
            </div>
          ))}

          <div
            className={`h-7 w-7 rounded-full ${selectedNetworkData?.bgColor} ${selectedNetworkData?.textColor} z-20 flex items-center justify-center text-xs font-medium border border-white overflow-hidden`}
          >
            {selectedNetworkData?.logo ? (
              <Image src={selectedNetworkData.logo} alt={selectedNetworkData.name} width={16} height={16} className="rounded-full" />
            ) : (
              <NetworkIcon id={selectedNetworkData?.id || "solana"} variant="branded" size={16} fallback={<span>{selectedNetworkData?.icon}</span>} />
            )}
          </div>

          {otherNetworks.length > 4 && (
            <div className="z-30 flex h-7 w-7 items-center justify-center rounded-full bg-brand-purple text-xs font-mono font-bold text-white border border-white">
              +{otherNetworks.length - 4}
            </div>
          )}
        </div>

        <span className="ml-2 text-xs font-sans font-bold text-zinc-900">
          {selectedNetworkData ? selectedNetworkData.name : "Networks"}
        </span>
        <ChevronDown
          className={`ml-1 transition-transform text-zinc-500 ${isOpen ? "rotate-180" : ""}`}
          size={12}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 max-h-[360px] w-[260px] overflow-y-auto rounded-2xl border border-zinc-200 bg-white shadow-xl custom-scrollbar">
          <div className="flex flex-col gap-3 px-3.5 py-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Bridge Supported Networks
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2">
              <Search size={14} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Search Networks"
                className="hide-autofill h-full w-full border-0 bg-transparent ring-0 outline-0 text-xs font-sans text-zinc-900 placeholder:text-zinc-400"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              {networks
                .filter((network) =>
                  network.name
                    .toLowerCase()
                    .includes(searchFilter.toLowerCase())
                )
                .map((network) => (
                  <button
                    key={network.id}
                    onClick={() => handleNetworkSelect(network.id)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-100 cursor-pointer ${
                      selectedNetwork === network.id ? "bg-zinc-100 font-bold" : ""
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full ${network.bgColor} ${network.textColor} flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden`}
                    >
                      {network.logo ? (
                        <Image src={network.logo} alt={network.name} width={18} height={18} className="rounded-full" />
                      ) : (
                        <NetworkIcon id={network.id} variant="branded" size={18} fallback={<span>{network.icon}</span>} />
                      )}
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-sans text-zinc-900 leading-none">
                        {network.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 mt-0.5">
                        {network.ecosystem}
                      </span>
                    </div>
                    {selectedNetwork === network.id && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-brand-purple"></div>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}

const networks = [
  {
    id: "solana",
    name: "Solana",
    icon: "SOL",
    ecosystem: "Non-EVM",
    bgColor: "bg-purple-900",
    textColor: "text-white",
  },
  {
    id: "base",
    name: "Base",
    icon: "◯",
    ecosystem: "EVM L2",
    logo: "/networks/base.svg",
    bgColor: "bg-blue-400",
    textColor: "text-white",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "♦",
    ecosystem: "EVM L1",
    logo: "/networks/ethereum.svg",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "▲",
    ecosystem: "EVM",
    logo: "/networks/polygon.svg",
    bgColor: "bg-purple-600",
    textColor: "text-white",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "ARB",
    ecosystem: "EVM L2",
    logo: "/networks/arbitrum.svg",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: "optimism",
    name: "Optimism",
    icon: "OP",
    ecosystem: "EVM L2",
    logo: "/networks/optimism.svg",
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    icon: "AVAX",
    ecosystem: "EVM",
    logo: "/networks/avalanche.svg",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
  {
    id: "stellar",
    name: "Stellar",
    icon: "XLM",
    ecosystem: "Non-EVM",
    bgColor: "bg-black",
    textColor: "text-white",
  },
  {
    id: "tron",
    name: "Tron",
    icon: "TRX",
    ecosystem: "Non-EVM",
    bgColor: "bg-red-700",
    textColor: "text-white",
  },
  {
    id: "sui",
    name: "Sui",
    icon: "SUI",
    ecosystem: "Move / Non-EVM",
    bgColor: "bg-cyan-600",
    textColor: "text-white",
  },
  {
    id: "aptos",
    name: "Aptos",
    icon: "APT",
    ecosystem: "Move / Non-EVM",
    bgColor: "bg-zinc-800",
    textColor: "text-white",
  },
  {
    id: "celo",
    name: "Celo",
    icon: "CELO",
    ecosystem: "EVM",
    bgColor: "bg-emerald-600",
    textColor: "text-white",
  },
];

