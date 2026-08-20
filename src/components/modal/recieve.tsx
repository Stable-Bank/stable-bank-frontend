"use client";

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { 
  ArrowDownLeft, 
  Copy, 
  Check, 
  Wallet, 
  Send, 
  ShieldAlert, 
  Sparkles, 
  Info
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { NetworkIcon, TokenIcon } from "@web3icons/react/dynamic";
import { cn } from "@/utils/cn";
import { USFlagIcon, UKFlagIcon, EUFlagIcon, MultiFlagIcon } from "@/components/ui/flag-icons";

export default function RecieveModal() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState<"wire" | "crypto" | "tag">("wire");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  const [selectedToken, setSelectedToken] = useState<"usdc" | "usdt" | "eurc">("usdc");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("arbitrum");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return toast.error("Nothing to copy!");
    copyToClipboard(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tagValue = user?.bankTag || "";
  const addressValue = user?.walletAddress || "";

  const networks = [
    { name: "Arbitrum", id: "arbitrum" },
    { name: "Base", id: "base" },
    { name: "Ethereum", id: "ethereum" },
    { name: "Optimism", id: "optimism" },
    { name: "Polygon", id: "polygon" },
  ];

  const tokens = [
    { name: "USD Coin", symbol: "usdc", label: "USDC" },
    { name: "Tether USD", symbol: "usdt", label: "USDT" },
    { name: "Euro Coin", symbol: "eurc", label: "EURC" },
  ];

  const accountDetails = {
    USD: {
      bankName: "StableBank Corp (New York)",
      routing: "021000021",
      accountNumber: "1002 9845 2371",
      currency: "USD",
      rail: "ACH & FedWire",
      details: [
        { label: "Routing (ABA)", value: "021000021" },
        { label: "Account Number", value: "100298452371" },
        { label: "Bank Name", value: "StableBank Corp (New York)" },
        { label: "Beneficiary Name", value: user ? `${user.firstName || "Member"} ${user.lastName || "Account"}` : "StableBank Ltd / Client Account" },
        { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" }
      ]
    },
    GBP: {
      bankName: "StableBank UK Ltd (London)",
      sortCode: "20-45-12",
      accountNumber: "40982312",
      currency: "GBP",
      rail: "Faster Payments & BACS",
      details: [
        { label: "Sort Code", value: "20-45-12" },
        { label: "Account Number", value: "40982312" },
        { label: "Bank Name", value: "StableBank UK Ltd (London)" },
        { label: "Beneficiary Name", value: user ? `${user.firstName || "Member"} ${user.lastName || "Account"}` : "StableBank Ltd / Client Account" },
        { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" }
      ]
    },
    EUR: {
      bankName: "StableBank Europe AG (Frankfurt)",
      iban: "DE89 3704 0044 0532 0130 00",
      bic: "STBKDEFFXXX",
      currency: "EUR",
      rail: "SEPA Instant",
      details: [
        { label: "IBAN", value: "DE89370400440532013000" },
        { label: "BIC / SWIFT", value: "STBKDEFFXXX" },
        { label: "Bank Name", value: "StableBank Europe AG (Frankfurt)" },
        { label: "Beneficiary Name", value: user ? `${user.firstName || "Member"} ${user.lastName || "Account"}` : "StableBank Ltd / Client Account" },
        { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" }
      ]
    }
  };

  const currentAccount = accountDetails[activeCurrency];

  return (
    <DialogContent className="w-full !max-w-[440px] rounded-[28px] border border-white/10 bg-[#0A0D14]/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl text-white animate-in zoom-in-95 duration-200 gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <DialogHeader className="space-y-1">
        <DialogTitle className="flex items-center gap-3">
          <div className="bg-brand-purple/20 border border-brand-purple/30 text-brand-purple flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-lg shadow-brand-purple/10">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
              Add Funds <Sparkles size={14} className="text-[#E9F2A3]" />
            </h2>
            <p className="text-xs text-white/50 font-medium">
              Choose your preferred deposit channel
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Multi-Step Channel Selectors */}
      <div className="grid grid-cols-3 bg-white/[0.03] border border-white/5 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveChannel("wire")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "wire"
              ? "bg-brand-purple text-white shadow-md"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <div className="flex items-center gap-1">
            <MultiFlagIcon className="w-5 h-4" />
          </div>
          <span className="text-[11px] truncate">Bank Wire</span>
        </button>

        <button
          onClick={() => setActiveChannel("crypto")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "crypto"
              ? "bg-brand-purple text-white shadow-md"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Wallet size={14} />
          <span className="text-[11px] truncate">On-Chain</span>
        </button>

        <button
          onClick={() => setActiveChannel("tag")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "tag"
              ? "bg-brand-purple text-white shadow-md"
              : "text-white/50 hover:text-white hover:bg-white/5"
          )}
        >
          <Send size={14} />
          <span className="text-[11px] truncate">StableTag</span>
        </button>
      </div>

      {/* Channel 1: Virtual Bank Wire */}
      {activeChannel === "wire" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          
          {/* Currency Subtabs with SVG Flags */}
          <div className="flex gap-2">
            {[
              { code: "USD" as const, name: "US Dollar", icon: USFlagIcon },
              { code: "GBP" as const, name: "British Pound", icon: UKFlagIcon },
              { code: "EUR" as const, name: "Euro", icon: EUFlagIcon },
            ].map((curr) => {
              const IconComp = curr.icon;
              const isSelected = activeCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setActiveCurrency(curr.code)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                    isSelected
                      ? "bg-brand-yellow/15 border-brand-yellow/40 text-brand-yellow shadow-sm"
                      : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{curr.code}</span>
                </button>
              );
            })}
          </div>

          {/* Account Details Panel */}
          <div className="rounded-2xl border border-white/5 bg-[#070A10] p-4 space-y-3.5 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                {activeCurrency === "USD" && <USFlagIcon className="w-5 h-5" />}
                {activeCurrency === "GBP" && <UKFlagIcon className="w-5 h-5" />}
                {activeCurrency === "EUR" && <EUFlagIcon className="w-5 h-5" />}
                <span className="text-xs font-bold text-white">{currentAccount.bankName}</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {currentAccount.rail}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentAccount.details.map((field) => (
                <div key={field.label} className="flex justify-between items-center gap-3 text-xs">
                  <span className="text-white/40 font-semibold">{field.label}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-white font-mono font-bold truncate max-w-[190px]" title={field.value}>
                      {field.value}
                    </span>
                    <button
                      onClick={() => handleCopy(field.value, `${activeCurrency} ${field.label}`)}
                      className="p-1 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === `${activeCurrency} ${field.label}` ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Prop Alert */}
          <div className="rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 p-3 flex items-start gap-2.5">
            <Info size={16} className="text-brand-yellow shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/70 leading-relaxed">
              Deposits from your personal or business bank account are automatically credited to your stablecoin wallet at 1:1 with zero conversion markup.
            </p>
          </div>
        </div>
      )}

      {/* Channel 2: Crypto On-Chain */}
      {activeChannel === "crypto" && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          
          {/* Token Picker */}
          <div className="w-full flex gap-2">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => setSelectedToken(token.symbol as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  selectedToken === token.symbol
                    ? "bg-brand-purple/20 border-brand-purple/40 text-white"
                    : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/5"
                )}
              >
                <TokenIcon symbol={token.symbol} variant="branded" size={16} className="rounded-full" />
                <span>{token.label}</span>
              </button>
            ))}
          </div>

          {/* QR Code Container */}
          <div className="relative p-3.5 rounded-2xl bg-[#070A10] border border-white/5 shadow-inner group">
            <div className="absolute inset-0 bg-brand-purple/5 rounded-2xl filter blur-xl group-hover:bg-brand-purple/10 transition-colors" />
            <div className="relative bg-white p-2 rounded-xl">
              {addressValue ? (
                <QRCodeSVG
                  value={addressValue}
                  size={135}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-black/40 text-xs font-mono">No address</div>
              )}
            </div>
          </div>

          {/* Copyable Address */}
          <div className="w-full space-y-1.5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block text-center">
              Your Multi-Chain Wallet Address
            </span>
            <button
              onClick={() => handleCopy(addressValue, "Wallet Address")}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-3.5 py-2.5 text-xs font-semibold transition-all group cursor-pointer"
            >
              <span className="text-[#E9F2A3] font-mono tracking-wide truncate max-w-[280px]">
                {addressValue || "unidentified"}
              </span>
              {copiedField === "Wallet Address" ? (
                <Check size={14} className="text-emerald-400 shrink-0" />
              ) : (
                <Copy size={14} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
              )}
            </button>
          </div>

          {/* Networks Row */}
          <div className="w-full space-y-2 border-t border-white/5 pt-3">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block text-center">
              Supported Networks
            </span>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {networks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => setSelectedNetwork(net.id)}
                  title={net.name}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer",
                    selectedNetwork === net.id
                      ? "bg-brand-purple/20 border-brand-purple/40 text-white"
                      : "bg-white/[0.02] border-white/5 text-white/40 hover:text-white"
                  )}
                >
                  <NetworkIcon id={net.id} variant="branded" size={14} className="rounded-full" />
                  <span>{net.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="w-full flex gap-2 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/20 p-2.5 text-left">
            <ShieldAlert size={16} className="text-brand-yellow shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/70 leading-snug">
              Send only EVM-compatible stablecoins (USDC, USDT, EURC, DAI) on supported networks.
            </p>
          </div>
        </div>
      )}

      {/* Channel 3: StableTag Internal Transfer */}
      {activeChannel === "tag" && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="relative p-3.5 rounded-2xl bg-[#070A10] border border-white/5 shadow-inner group">
            <div className="relative bg-white p-2 rounded-xl">
              {tagValue ? (
                <QRCodeSVG
                  value={tagValue}
                  size={135}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-black/40 text-xs font-mono">No tag found</div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your StableTag</span>
            <button
              onClick={() => handleCopy(tagValue, "StableTag")}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-4 py-3 text-sm font-semibold transition-all group cursor-pointer"
            >
              <span className="text-[#E9F2A3] font-mono font-bold tracking-wider">${tagValue || "not set"}</span>
              {copiedField === "StableTag" ? (
                <Check size={16} className="text-emerald-400 shrink-0" />
              ) : (
                <Copy size={16} className="text-white/40 group-hover:text-white transition-colors shrink-0" />
              )}
            </button>
            <p className="text-xs text-white/40 text-center px-2 mt-1 leading-relaxed">
              Share your tag with other StableBank users to receive instant, zero-gas internal transfers.
            </p>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
