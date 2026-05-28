"use client";

import { CircleQuestionMark, Copy, Star, ArrowRight } from "lucide-react";
import NetworkSelector from "../selector/network";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { cn } from "@/utils/cn";

export default function Balances() {
  const router = useRouter();
  const { user } = useAuth();
  const { balance } = useBalance(user?.walletAddress);
  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  const visibleChains = hideZeroBalance
    ? balance?.chains?.filter((chain) => chain.balanceUSD > 0) || []
    : balance?.chains || [];

  const totalAssets =
    balance?.chains?.reduce((acc, chain) => acc + chain.tokens.length, 0) || 0;

  const handleTagAction = () => {
    if (user?.bankTag) {
      copyToClipboard(user.bankTag);
    } else {
      router.push(appRoutes.dashboard.settings);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 text-sm sm:text-base font-medium text-white/60">
          <p className="flex items-center gap-1.5">
            <span>Balance ({totalAssets})</span>
            <CircleQuestionMark size={12} className="sm:w-[14px] sm:h-[14px]" color="#4649D6" />
          </p>
          <label className="flex items-center gap-2 cursor-pointer">
            <span>Hide 0 balance</span>
            <input
              type="checkbox"
              checked={hideZeroBalance}
              onChange={(e) => setHideZeroBalance(e.target.checked)}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 cursor-pointer"
            />
          </label>
        </div>

        <NetworkSelector />
      </div>

      <div className="flex w-full flex-col md:flex-row items-center justify-center gap-8 md:gap-12 rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-purple/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#E9F2A3]/5 rounded-full blur-[80px]" />

        <div className="relative flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-[28px] shadow-2xl shadow-brand-purple/20 border-4 border-white/10 group-hover:scale-[1.02] transition-transform duration-500">
            <QRCodeSVG
              value={`ethereum:${user?.walletAddress || ""}`}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/images/brand/favicon.png",
                x: undefined,
                y: undefined,
                height: 40,
                width: 40,
                excavate: true,
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 text-center md:text-left relative z-10">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Fund your{" "}
              <span className="text-[#E9F2A3] italic font-serif">
                StableBank
              </span>
            </h2>
            <p className="text-white/40 text-sm max-w-[300px]">
              Scan this QR with a wallet like Trust Wallet to fund your account.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div
              onClick={handleTagAction}
              className={cn(
                "group/tag flex cursor-pointer items-center justify-between gap-4 rounded-2xl border px-5 py-4 transition-all duration-300",
                user?.bankTag 
                  ? "bg-white/[0.03] border-white/5 hover:border-brand-purple/30" 
                  : "bg-brand-purple/10 border-brand-purple/40 hover:bg-brand-purple/20 shadow-lg shadow-brand-purple/10"
              )}
            >
              <div className="flex flex-col items-start overflow-hidden">
                <span className="text-md font-bold text-white/20 uppercase tracking-widest mb-1">
                  {user?.bankTag ? "Your Tag" : "Claim your Profile"}
                </span>
                <span className={cn(
                  "text-base font-bold transition-all duration-300 truncate w-full",
                  user?.bankTag ? "text-white group-hover/tag:text-brand-purple" : "text-brand-yellow flex items-center gap-2"
                )}>
                  {user?.bankTag ? `$${user.bankTag}` : <span>Claim your $BankTag <Star size={14} className="fill-brand-yellow animate-pulse" /></span>}
                </span>
              </div>
              <div className={cn(
                "p-2 rounded-xl transition-all",
                user?.bankTag 
                  ? "bg-white/5 text-white/40 group-hover/tag:text-brand-purple group-hover/tag:bg-brand-purple/10" 
                  : "bg-brand-purple text-white shadow-lg"
              )}>
                {user?.bankTag ? <Copy size={16} /> : <ArrowRight size={16} />}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-md font-bold text-white/20 uppercase tracking-widest">Network</span>
              <NetworkSelector />
            </div>
          </div>
        </div>
      </div>

      {/* Display chain balances */}
      {visibleChains.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleChains.map((chain) => (
            <div
              key={chain.chainId}
              className="rounded-3xl bg-[#0A0D14]/60 backdrop-blur-md border border-white/5 p-6 hover:border-brand-purple/20 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <span className="text-md font-bold text-white/20 uppercase tracking-widest mb-0.5">Chain</span>
                  <h3 className="text-sm font-bold text-white group-hover:text-brand-purple transition-colors">{chain.chainName}</h3>
                </div>
                <p className="text-xl font-bold text-[#E9F2A3]">
                  ${chain.balanceUSD.toFixed(2)}
                </p>
              </div>
              
              {chain.tokens.length > 0 && (
                <div className="space-y-2">
                  {chain.tokens.map((token) => (
                    <div
                      key={token.address}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] text-sm"
                    >
                      <span className="text-white/60 font-medium">{token.symbol}</span>
                      <span className="text-white font-bold">${token.balanceUSD.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
