"use client";

import { CircleQuestionMark, Copy } from "lucide-react";
import NetworkSelector from "../selector/network";
import Image from "next/image";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { qrService } from "@/services/qrService";
import { useState, useEffect } from "react";

export default function Balances() {
  const { user } = useAuth();
  const { balance, isLoading } = useBalance(user?.walletAddress);
  const [qrCode, setQrCode] = useState<string>("/images/placeholder/qr-code.svg");
  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  // Fetch QR code separately (only once)
  useEffect(() => {
    const fetchQR = async () => {
      if (!user?.walletAddress) return;

      try {
        const qrData = await qrService.generateQR({
          data: user.walletAddress,
          size: 200,
        });
        setQrCode(qrData.qrCode);
      } catch {
        // QR generation failed - use placeholder
        console.log("QR code generation not available, using placeholder");
      }
    };

    fetchQR();
  }, [user?.walletAddress]);

  const visibleChains = hideZeroBalance
    ? balance?.chains?.filter((chain) => chain.balanceUSD > 0) || []
    : balance?.chains || [];

  const totalAssets =
    balance?.chains?.reduce((acc, chain) => acc + chain.tokens.length, 0) || 0;

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

      <div className="flex w-full flex-col md:flex-row items-center justify-center gap-4 sm:gap-6 rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-[#0E121C] px-4 sm:px-6 py-10 sm:py-16 lg:py-20">
        {isLoading ? (
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 animate-pulse rounded bg-white/10" />
        ) : (
          <Image
            src={qrCode}
            alt="qr code"
            width={160}
            height={160}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
          />
        )}
        <div className="flex flex-col gap-2 sm:gap-2.5 text-center md:text-left">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
            Add tokens to your{" "}
            <span className="font-normal text-[#E9F2A3] italic">
              StableBank
            </span>{" "}
            Wallet
          </h2>

          <div
            onClick={() => {
              if (user?.bankTag) {
                copyToClipboard(user.bankTag);
              } else if (user?.walletAddress) {
                copyToClipboard(user.walletAddress);
              }
            }}
            className="flex cursor-pointer items-center justify-center md:justify-start gap-2 sm:gap-4 rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-[#131926] px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white/60 hover:text-white/80 transition-colors"
          >
            <span>{user?.bankTag || user?.walletAddress || "Not connected"}</span>
            <Copy size={8} color="#FFFFFF99" />
          </div>

          <div className="mt-1 sm:mt-0">
            <NetworkSelector />
          </div>
        </div>
      </div>

      {/* Display chain balances */}
      {visibleChains.length > 0 && (
        <div className="flex flex-col gap-3">
          {visibleChains.map((chain) => (
            <div
              key={chain.chainId}
              className="rounded-[12px] bg-[#0E121C] px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{chain.chainName}</h3>
                <p className="text-lg font-bold text-[#E9F2A3]">
                  ${chain.balanceUSD.toFixed(2)}
                </p>
              </div>
              {chain.tokens.length > 0 && (
                <div className="mt-2 flex flex-col gap-1">
                  {chain.tokens.map((token) => (
                    <div
                      key={token.address}
                      className="flex items-center justify-between text-sm text-white/60"
                    >
                      <span>{token.symbol}</span>
                      <span>${token.balanceUSD.toFixed(2)}</span>
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
