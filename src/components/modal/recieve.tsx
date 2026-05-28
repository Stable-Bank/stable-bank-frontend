"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { ArrowDownLeft, Copy, Check, Wallet, Send, ShieldAlert, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { NetworkIcon } from "@web3icons/react/dynamic";
import { cn } from "@/utils/cn";

export default function RecieveModal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"tag" | "wallet">("tag");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    if (!text) return toast.error("No tag set!");
    copyToClipboard(text);
    toast.success("Copied to clipboard!  ");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tagValue = user?.bankTag || "";
  const addressValue = user?.walletAddress || "";

  const networks = [
    { name: "Ethereum", id: "ethereum" },
    { name: "Arbitrum", id: "arbitrum" },
    { name: "Optimism", id: "optimism" },
    { name: "Base", id: "base" },
    { name: "Polygon", id: "polygon" },
  ];

  return (
    <DialogContent className="w-full !max-w-[400px] rounded-[24px] border border-white/5 bg-[#0F1322]/95 backdrop-blur-2xl p-5 shadow-2xl text-white animate-in zoom-in-95 duration-200 gap-4">
      <DialogHeader className="space-y-1">
        <DialogTitle className="flex items-center gap-2.5">
          <div className="bg-brand-purple/20 border border-brand-purple/30 text-brand-purple flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
            <ArrowDownLeft size={18} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1">
              Deposit Funds <Sparkles size={14} className="text-[#E9F2A3]" />
            </h2>
            <p className="text-[11px] font-medium text-white/40">
              Add stable assets to your unified balance
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Tabs */}
      <div className="flex bg-white/[0.03] border border-white/5 p-1 rounded-xl mt-1">
        <button
          onClick={() => {
            setActiveTab("tag");
            setCopied(false);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
            activeTab === "tag"
              ? "bg-brand-purple text-white shadow-lg"
              : "text-white/40 hover:text-white/60 hover:bg-white/[0.01]"
          )}
        >
          <Send size={12} />
          <span>StableTag</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("wallet");
            setCopied(false);
          }}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer",
            activeTab === "wallet"
              ? "bg-brand-purple text-white shadow-lg"
              : "text-white/40 hover:text-white/60 hover:bg-white/[0.01]"
          )}
        >
          <Wallet size={12} />
          <span>Crypto Address</span>
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="flex flex-col items-center gap-4 mt-2">
        
        {/* QR Code Container */}
        <div className="relative p-3 rounded-2xl bg-[#090D1A] border border-white/5 shadow-inner group">
          <div className="absolute inset-0 bg-brand-purple/5 rounded-2xl filter blur-xl group-hover:bg-brand-purple/10 transition-colors" />
          <div className="relative bg-[#090D1A] p-1.5 rounded-xl">
            {activeTab === "tag" ? (
              tagValue ? (
                <QRCodeSVG
                  value={tagValue}
                  size={140}
                  bgColor="transparent"
                  fgColor="#ffffff"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-white/30 text-sm font-mono">No tag found</div>
              )
            ) : (
              addressValue ? (
                <QRCodeSVG
                  value={addressValue}
                  size={140}
                  bgColor="transparent"
                  fgColor="#ffffff"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-white/30 text-sm font-mono">No address found</div>
              )
            )}
          </div>
        </div>

        {/* Copy Target Container */}
        {activeTab === "tag" ? (
          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-md font-bold text-white/30 uppercase tracking-widest">Your StableTag</span>
            <button
              onClick={() => handleCopy(tagValue)}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-4 py-3 text-sm font-semibold transition-all group cursor-pointer"
            >
              <span className="text-[#E9F2A3] font-mono tracking-wide">{tagValue || "not set"}</span>
              {copied ? (
                <Check size={16} className="text-green-400 shrink-0" />
              ) : (
                <Copy size={16} className="text-white/40 group-hover:text-white/80 transition-colors shrink-0" />
              )}
            </button>
            <p className="text-[11px] text-white/30 text-center px-4 mt-1">
              Share your tag with other StableBank members to receive instant, gas-free internal deposits.
            </p>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex flex-col items-center gap-1.5">
              <span className="text-md font-bold text-white/30 uppercase tracking-widest">Your Deposit Address</span>
              <button
                onClick={() => handleCopy(addressValue)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-4 py-3 text-sm font-semibold transition-all group cursor-pointer"
              >
                <span className="text-[#E9F2A3] font-mono tracking-wide truncate max-w-[260px]">
                  {addressValue || "unidentified"}
                </span>
                {copied ? (
                  <Check size={16} className="text-green-400 shrink-0" />
                ) : (
                  <Copy size={16} className="text-white/40 group-hover:text-white/80 transition-colors shrink-0" />
                )}
              </button>
            </div>

            {/* Supported Networks */}
            <div className="w-full space-y-2 border-t border-white/5 pt-4">
              <div className="flex items-center justify-center">
                <span className="text-md font-bold text-white/30 uppercase tracking-widest">Supported Networks</span>
                {/* <span className="text-[9px] font-bold text-[#E9F2A3] bg-brand-purple/20 px-2 py-0.5 rounded border border-brand-purple/30">Auto-Sweep</span> */}
              </div>
              <div className="flex items-center justify-center gap-3">
                {networks.map((net) => (
                  <div
                    key={net.id}
                    title={net.name}
                    className="h-8 w-8 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all hover:bg-white/[0.07]"
                  >
                    <NetworkIcon
                      id={net.id}
                      variant="branded"
                      size={18}
                      className="rounded-full"
                      fallback={
                        <div className="text-[8px] font-bold opacity-60 uppercase">{net.name[0]}</div>
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Note */}
            <div className="flex gap-2.5 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 p-3 text-left">
              <ShieldAlert size={20} className="text-[#E9F2A3] shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-0.5">
                <h4 className="text-lg font-bold text-[#E9F2A3]">Important Deposit Notice</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Send only USD stable assets (USDC, USDT, DAI) to this address. Sending unsupported tokens or networks may result in permanent loss.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
