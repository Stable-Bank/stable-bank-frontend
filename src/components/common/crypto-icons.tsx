"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { NetworkIcon, TokenIcon } from "@web3icons/react/dynamic";
import {
  USDCIcon,
  USDTIcon,
  EURCIcon,
  PYUSDIcon,
  DAIIcon,
  USDBIcon,
  CNGNIcon,
  BRLAIcon,
  ZARPIcon,
  NTZSIcon,
  KESXIcon,
  EGPXIcon,
  GHSXIcon,
} from "@/components/ui/token-icons";

/* -------------------------------------------------------------------------- */
/*                            CHAIN / NETWORK LOGO                            */
/* -------------------------------------------------------------------------- */
export interface ChainLogoProps {
  chainId?: string | number;
  chainName?: string;
  size?: number;
  className?: string;
}

export function ChainLogo({
  chainId = "solana",
  chainName = "",
  size = 28,
  className,
}: ChainLogoProps) {
  const normId = String(chainId).toLowerCase().trim();
  const normName = String(chainName).toLowerCase().trim();

  // Solana Custom SVG
  if (normId.includes("solana") || normName.includes("solana")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-1.5 flex items-center justify-center shrink-0 shadow-xs",
          className
        )}
      >
        <svg viewBox="0 0 397 311" className="w-full h-full" fill="none">
          <path
            d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h313.7c5.6 0 8.4 6.7 4.5 10.7l-54.9 56.1c-2.4 2.4-5.7 3.8-9.2 3.8H4.2c-5.6 0-8.4-6.7-4.5-10.7l64.9-56.1zM64.6 3.8C67 1.4 70.3 0 73.8 0h313.7c5.6 0 8.4 6.7 4.5 10.7L337.1 66.8c-2.4 2.4-5.7 3.8-9.2 3.8H14.2c-5.6 0-8.4-6.7-4.5-10.7L64.6 3.8zM332.4 120.8c-2.4-2.4-5.7-3.8-9.2-3.8H9.5c-5.6 0-8.4 6.7-4.5 10.7l54.9 56.1c2.4 2.4 5.7 3.8 9.2 3.8h313.7c5.6 0 8.4-6.7 4.5-10.7l-64.9-56.1z"
            fill="#ffffff"
          />
        </svg>
      </div>
    );
  }

  // Base SVG
  if (normId.includes("base") || normName.includes("base")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#0052FF] p-1.5 flex items-center justify-center shrink-0 shadow-xs",
          className
        )}
      >
        <div className="w-full h-full rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    );
  }

  // Polygon SVG
  if (normId.includes("polygon") || normId.includes("matic") || normName.includes("polygon")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#7B3FE4] p-1.5 flex items-center justify-center shrink-0 shadow-xs",
          className
        )}
      >
        <svg viewBox="0 0 38 33" className="w-full h-full" fill="none">
          <path
            d="M29 10.2L20.4 5.2C19.6 4.7 18.5 4.7 17.6 5.2L9 10.2C8.2 10.7 7.6 11.7 7.6 12.6V22.6C7.6 23.6 8.2 24.5 9 25L17.6 30C18.4 30.5 19.5 30.5 20.4 30L29 25C29.8 24.5 30.4 23.5 30.4 22.6V12.6C30.4 11.7 29.8 10.7 29 10.2Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }

  // Ethereum SVG
  if (normId.includes("ethereum") || normId.includes("eth") || normName.includes("ethereum") || normId === "1") {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#627EEA] p-1.5 flex items-center justify-center shrink-0 shadow-xs",
          className
        )}
      >
        <svg viewBox="0 0 256 417" className="w-3/5 h-3/5" fill="none">
          <path d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z" fill="white" />
          <path d="M127.962 0L0 212.32L127.962 287.959V157.098V0Z" fill="#C0CBF6" />
          <path d="M127.961 312.187L126.386 314.106V413.605L127.961 417.202L256 236.52L127.961 312.187Z" fill="white" />
          <path d="M127.962 417.202V312.187L0 236.52L127.962 417.202Z" fill="#C0CBF6" />
          <path d="M127.961 287.958L255.923 212.32L127.961 157.099V287.958Z" fill="#E5EBFC" />
          <path d="M0 212.32L127.962 287.958V157.099L0 212.32Z" fill="#A4B5F3" />
        </svg>
      </div>
    );
  }

  // Arbitrum SVG
  if (normId.includes("arbitrum") || normName.includes("arbitrum")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#28A0F0] p-1.5 flex items-center justify-center shrink-0 shadow-xs",
          className
        )}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
    );
  }

  // Optimism SVG
  if (normId.includes("optimism") || normName.includes("optimism") || normId.includes("op")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#FF0420] p-1 flex items-center justify-center shrink-0 shadow-xs text-white font-mono font-bold text-xs",
          className
        )}
      >
        OP
      </div>
    );
  }

  // Tron SVG
  if (normId.includes("tron") || normName.includes("tron") || normId.includes("trx")) {
    return (
      <div
        style={{ width: size, height: size }}
        className={cn(
          "rounded-full bg-[#FF0013] p-1 flex items-center justify-center shrink-0 shadow-xs text-white font-mono font-bold text-[10px]",
          className
        )}
      >
        TRX
      </div>
    );
  }

  // Fallback Dynamic NetworkIcon
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0 overflow-hidden font-mono font-bold text-xs",
        className
      )}
    >
      <NetworkIcon
        id={normId}
        variant="branded"
        size={size - 4}
        fallback={<span className="uppercase">{normName.slice(0, 3) || normId.slice(0, 3)}</span>}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            TOKEN / ASSET LOGO                              */
/* -------------------------------------------------------------------------- */
export interface TokenLogoProps {
  symbol?: string;
  name?: string;
  size?: number;
  className?: string;
}

export function TokenLogo({
  symbol = "USDC",
  size = 36,
  className,
}: TokenLogoProps) {
  const normSym = String(symbol).toUpperCase().trim();

  // 1. USDC
  if (normSym === "USDC") {
    return <USDCIcon size={size} className={className} />;
  }

  // 2. USDT
  if (normSym === "USDT") {
    return <USDTIcon size={size} className={className} />;
  }

  // 3. EURC
  if (normSym === "EURC") {
    return <EURCIcon size={size} className={className} />;
  }

  // 4. USDB
  if (normSym === "USDB") {
    return <USDBIcon size={size} className={className} />;
  }

  // 5. PYUSD
  if (normSym === "PYUSD") {
    return <PYUSDIcon size={size} className={className} />;
  }

  // 6. DAI
  if (normSym === "DAI") {
    return <DAIIcon size={size} className={className} />;
  }

  // 7. cNGN
  if (normSym === "CNGN" || normSym === "NGN") {
    return <CNGNIcon size={size} className={className} />;
  }

  // 8. BRLA
  if (normSym === "BRLA" || normSym === "BRL") {
    return <BRLAIcon size={size} className={className} />;
  }

  // 9. ZARP
  if (normSym === "ZARP" || normSym === "ZAR") {
    return <ZARPIcon size={size} className={className} />;
  }

  // 10. NTZS
  if (normSym === "NTZS" || normSym === "TZS") {
    return <NTZSIcon size={size} className={className} />;
  }

  // 11. KESX
  if (normSym === "KESX" || normSym === "KES") {
    return <KESXIcon size={size} className={className} />;
  }

  // 12. EGPX
  if (normSym === "EGPX" || normSym === "EGP") {
    return <EGPXIcon size={size} className={className} />;
  }

  // 13. GHSX
  if (normSym === "GHSX" || normSym === "GHS") {
    return <GHSXIcon size={size} className={className} />;
  }

  // 14. SOL
  if (normSym === "SOL") {
    return <ChainLogo chainId="solana" size={size} className={className} />;
  }

  // 15. ETH
  if (normSym === "ETH") {
    return <ChainLogo chainId="ethereum" size={size} className={className} />;
  }

  // 16. POL / MATIC
  if (normSym === "POL" || normSym === "MATIC") {
    return <ChainLogo chainId="polygon" size={size} className={className} />;
  }

  // Fallback Dynamic TokenIcon
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 overflow-hidden font-mono font-bold text-xs text-zinc-800",
        className
      )}
    >
      <TokenIcon
        symbol={normSym.toLowerCase()}
        variant="branded"
        size={size - 4}
        fallback={<span className="text-[11px] font-bold">{normSym.slice(0, 3)}</span>}
      />
    </div>
  );
}
