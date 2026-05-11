"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Image from "next/image";

export default function NetworkSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("optimism");
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
        className="flex transform cursor-pointer items-center rounded-full p-1 pr-4 transition-colors duration-200 hover:bg-[#0E121C]"
      >
        <div className="flex -space-x-2">
          {otherNetworks.slice(0, 4).map((network, index) => (
            <div
              key={network.id}
              className={`h-7 w-7 rounded-full ${network.bgColor} ${network.textColor} flex items-center justify-center font-sans text-xs font-medium z-${10 - index}`}
            >
              {network.logo ? <Image src={network.logo} alt={network.name} width={16} height={16} className="rounded-full" /> : network.icon}
            </div>
          ))}

          <div
            className={`h-7 w-7 rounded-full ${selectedNetworkData?.bgColor} ${selectedNetworkData?.textColor} z-20 flex items-center justify-center text-xs font-medium`}
          >
            {selectedNetworkData?.logo ? <Image src={selectedNetworkData.logo} alt={selectedNetworkData.name} width={16} height={16} className="rounded-full" /> : selectedNetworkData?.icon}
          </div>

          {otherNetworks.length > 4 && (
            <div className="z-30 flex h-7 w-7 items-center justify-center rounded-full bg-[#4649D6] text-xs font-medium text-white">
              +{otherNetworks.length - 4}
            </div>
          )}
        </div>

        <span className="ml-2 text-sm font-medium">Networks</span>
        <ChevronDown
          className={`ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          size={10}
          color="white"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-3.5 max-h-[360px] w-[230px] overflow-y-auto rounded-[20px] border-[0.2px] border-[#FEF8F1]/60 bg-[#0E121C] shadow-xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="flex flex-col gap-[18px] px-3.5 py-3">
            <div className="text-lg font-semibold text-white/60">
              All Networks
            </div>

            <div className="flex items-center gap-2 rounded-[20px] border-[0.3px] border-solid border-white/60 px-3 py-2">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search Networks"
                className="hide-autofill h-full w-full border-0 bg-inherit ring-0 outline-0"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3">
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
                    className={`flex w-full items-center gap-5 rounded-lg p-2 transition-colors hover:bg-gray-700 ${
                      selectedNetwork === network.id ? "bg-gray-700" : ""
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full ${network.bgColor} ${network.textColor} flex items-center justify-center text-xs font-bold`}
                    >
                      {network.logo ? <Image src={network.logo} alt={network.name} width={20} height={20} className="rounded-full" /> : network.icon}
                    </div>
                    <span className="text-xl font-medium text-white">
                      {network.name}
                    </span>
                    {selectedNetwork === network.id && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-blue-500"></div>
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
    id: "optimism",
    name: "Optimism",
    icon: "OP",
    logo: "/networks/optimism.svg",
    bgColor: "bg-red-500",
    textColor: "text-white",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "♦",
    logo: "/networks/ethereum.svg",
    bgColor: "bg-blue-600",
    textColor: "text-white",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "▲",
    logo: "/networks/polygon.svg",
    bgColor: "bg-purple-600",
    textColor: "text-white",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "ARB",
    logo: "/networks/arbitrum.svg",
    bgColor: "bg-blue-500",
    textColor: "text-white",
  },
  {
    id: "base",
    name: "Base",
    icon: "◯",
    logo: "/networks/base.svg",
    bgColor: "bg-blue-400",
    textColor: "text-white",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    icon: "AVAX",
    logo: "/networks/avalanche.svg",
    bgColor: "bg-red-600",
    textColor: "text-white",
  },
  {
    id: "bsc",
    name: "BSC",
    icon: "BNB",
    logo: "/networks/bsc.svg",
    bgColor: "bg-yellow-500",
    textColor: "text-black",
  },
];
