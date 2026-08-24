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
  Info
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { accountService } from "@/services/accountService";
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
  const [virtualAccounts, setVirtualAccounts] = useState<any[]>([]);
  const [isCreatingVA, setIsCreatingVA] = useState(false);

  useEffect(() => {
    const fetchVA = async () => {
      try {
        const data = await accountService.getVirtualAccounts();
        setVirtualAccounts(data || []);
      } catch (err) {
        console.debug("Virtual accounts fetch:", err);
      }
    };
    fetchVA();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return toast.error("Nothing to copy!");
    copyToClipboard(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateVirtualAccount = async (currency: string) => {
    try {
      setIsCreatingVA(true);
      toast.loading(`Provisioning Bridge ${currency} Virtual Account...`);
      await accountService.createVirtualAccount({ currency: currency.toLowerCase() });
      toast.dismiss();
      toast.success(`Bridge ${currency} Virtual Account created successfully!`);
      const updated = await accountService.getVirtualAccounts();
      setVirtualAccounts(updated || []);
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Failed to create virtual account");
    } finally {
      setIsCreatingVA(false);
    }
  };

  const tagValue = user?.bankTag || "";
  const addressValue = user?.walletAddress || "";

  const networks = [
    { name: "Solana", id: "solana" },
    { name: "Base", id: "base" },
    { name: "Arbitrum", id: "arbitrum" },
    { name: "Ethereum", id: "ethereum" },
    { name: "Optimism", id: "optimism" },
    { name: "Polygon", id: "polygon" },
  ];

  const tokens = [
    { name: "USD Coin", symbol: "usdc", label: "USDC" },
    { name: "Tether USD", symbol: "usdt", label: "USDT" },
    { name: "Euro Coin", symbol: "eurc", label: "EURC" },
  ];

  const getAccountData = (currency: "USD" | "GBP" | "EUR") => {
    const va = virtualAccounts.find((a: any) => (a.currency || "").toUpperCase() === currency);
    const userName = user ? `${user.firstName || "Member"} ${user.lastName || "Account"}` : "StableBank Ltd / Client Account";

    if (currency === "USD") {
      return {
        bankName: va?.bank_name || va?.bankName || "Bridge Partner Bank (New York)",
        routing: va?.routing_number || va?.routingNumber || "101019644",
        accountNumber: va?.account_number || va?.accountNumber || "8518033136",
        currency: "USD",
        rail: "ACH & FedWire",
        isLive: !!va,
        details: [
          { label: "Routing (ABA)", value: va?.routing_number || va?.routingNumber || "101019644" },
          { label: "Account Number", value: va?.account_number || va?.accountNumber || "8518033136" },
          { label: "Bank Name", value: va?.bank_name || va?.bankName || "Bank of Nowhere (Bridge USD)" },
          { label: "Beneficiary Name", value: va?.account_holder_name || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    } else if (currency === "EUR") {
      return {
        bankName: va?.bank_name || va?.bankName || "Bridge Europe Bank (Luxembourg)",
        iban: va?.iban || "LU44 0000 1234 5678 9000",
        bic: va?.bic || "BGELULXX",
        currency: "EUR",
        rail: "SEPA Instant",
        isLive: !!va,
        details: [
          { label: "IBAN", value: va?.iban || "LU44 0000 1234 5678 9000" },
          { label: "BIC / SWIFT", value: va?.bic || "BGELULXX" },
          { label: "Bank Name", value: va?.bank_name || va?.bankName || "Bridge EU Clearing (Luxembourg)" },
          { label: "Beneficiary Name", value: va?.account_holder_name || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    } else {
      return {
        bankName: va?.bank_name || va?.bankName || "Bridge UK Ltd (London)",
        sortCode: va?.sort_code || va?.sortCode || "20-45-12",
        accountNumber: va?.account_number || va?.accountNumber || "40982312",
        currency: "GBP",
        rail: "Faster Payments & BACS",
        isLive: !!va,
        details: [
          { label: "Sort Code", value: va?.sort_code || va?.sortCode || "20-45-12" },
          { label: "Account Number", value: va?.account_number || va?.accountNumber || "40982312" },
          { label: "Bank Name", value: va?.bank_name || va?.bankName || "Bridge UK Clearing" },
          { label: "Beneficiary Name", value: va?.account_holder_name || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    }
  };

  const currentAccount = getAccountData(activeCurrency);

  return (
    <DialogContent className="w-full !max-w-[440px] rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-2xl text-zinc-950 animate-in zoom-in-95 duration-200 gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
      <DialogHeader className="space-y-1">
        <DialogTitle className="flex items-center gap-3">
          <div className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-extrabold text-zinc-950 tracking-tight">
              Add Funds
            </h2>
            <p className="text-xs text-zinc-500 font-sans font-medium">
              Choose your preferred deposit channel
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Multi-Step Channel Selectors */}
      <div className="grid grid-cols-3 bg-zinc-100 border border-zinc-200 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveChannel("wire")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "wire"
              ? "bg-brand-purple text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <div className="flex items-center gap-1">
            <MultiFlagIcon className="w-5 h-4" />
          </div>
          <span className="text-[11px] font-sans truncate">Bank Wire</span>
        </button>

        <button
          onClick={() => setActiveChannel("crypto")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "crypto"
              ? "bg-brand-purple text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <Wallet size={14} />
          <span className="text-[11px] font-sans truncate">On-Chain</span>
        </button>

        <button
          onClick={() => setActiveChannel("tag")}
          className={cn(
            "flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer gap-1",
            activeChannel === "tag"
              ? "bg-brand-purple text-white shadow-xs"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <Send size={14} />
          <span className="text-[11px] font-sans truncate">StableTag</span>
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
                      ? "bg-brand-purple/10 border-brand-purple text-brand-purple shadow-2xs font-extrabold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  )}
                >
                  <IconComp className="w-4 h-4" />
                  <span className="font-mono">{curr.code}</span>
                </button>
              );
            })}
          </div>

          {/* Account Details Panel */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3.5 shadow-2xs">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2.5">
              <div className="flex items-center gap-2">
                {activeCurrency === "USD" && <USFlagIcon className="w-5 h-5" />}
                {activeCurrency === "GBP" && <UKFlagIcon className="w-5 h-5" />}
                {activeCurrency === "EUR" && <EUFlagIcon className="w-5 h-5" />}
                <span className="text-xs font-bold text-zinc-950 font-sans">{currentAccount.bankName}</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentAccount.rail}
              </span>
            </div>

            <div className="space-y-2.5">
              {currentAccount.details.map((field) => (
                <div key={field.label} className="flex justify-between items-center gap-3 text-xs">
                  <span className="text-zinc-500 font-sans font-medium">{field.label}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-zinc-950 font-mono font-bold truncate max-w-[190px]" title={field.value}>
                      {field.value}
                    </span>
                    <button
                      onClick={() => handleCopy(field.value, `${activeCurrency} ${field.label}`)}
                      className="p-1 rounded-md hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === `${activeCurrency} ${field.label}` ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!currentAccount.isLive && (
            <div className="flex justify-end pt-0.5">
              <button
                type="button"
                onClick={() => handleCreateVirtualAccount(activeCurrency)}
                disabled={isCreatingVA}
                className="text-[11px] text-brand-purple underline font-bold hover:opacity-80 cursor-pointer"
              >
                {isCreatingVA ? "Provisioning..." : `Activate Live Bridge ${activeCurrency} Account`}
              </button>
            </div>
          )}

          {/* Value Prop Alert */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
            <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-700 font-sans leading-relaxed">
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
                    ? "bg-brand-purple/10 border-brand-purple text-brand-purple shadow-2xs font-extrabold"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                )}
              >
                <TokenIcon symbol={token.symbol} variant="branded" size={16} className="rounded-full" />
                <span className="font-mono">{token.label}</span>
              </button>
            ))}
          </div>

          {/* QR Code Container */}
          <div className="relative p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs group">
            <div className="relative bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
              {addressValue ? (
                <QRCodeSVG
                  value={addressValue}
                  size={135}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-zinc-400 text-xs font-mono">No address</div>
              )}
            </div>
          </div>

          {/* Copyable Address */}
          <div className="w-full space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block text-center">
              Your Multi-Chain Wallet Address
            </span>
            <button
              onClick={() => handleCopy(addressValue, "Wallet Address")}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold transition-all group cursor-pointer"
            >
              <span className="text-brand-purple font-mono tracking-wide truncate max-w-[280px] font-bold">
                {addressValue || "unidentified"}
              </span>
              {copiedField === "Wallet Address" ? (
                <Check size={14} className="text-emerald-600 shrink-0" />
              ) : (
                <Copy size={14} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
              )}
            </button>
          </div>

          {/* Networks Row */}
          <div className="w-full space-y-2 border-t border-zinc-200 pt-3">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block text-center">
              Supported Networks
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {networks.map((net) => (
                <button
                  key={net.id}
                  onClick={() => setSelectedNetwork(net.id)}
                  title={net.name}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all cursor-pointer",
                    selectedNetwork === net.id
                      ? "bg-brand-purple/10 border-brand-purple text-brand-purple font-extrabold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:text-zinc-950"
                  )}
                >
                  <NetworkIcon id={net.id} variant="branded" size={14} className="rounded-full" />
                  <span className="font-sans">{net.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Safety Notice */}
          <div className="w-full flex gap-2 rounded-2xl bg-amber-50 border border-amber-200 p-2.5 text-left">
            <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-700 font-sans leading-snug">
              Send only EVM-compatible stablecoins (USDC, USDT, EURC, DAI) on supported networks.
            </p>
          </div>
        </div>
      )}

      {/* Channel 3: StableTag Internal Transfer */}
      {activeChannel === "tag" && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="relative p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs group">
            <div className="relative bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
              {tagValue ? (
                <QRCodeSVG
                  value={tagValue}
                  size={135}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-zinc-400 text-xs font-mono">No tag found</div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Your StableTag</span>
            <button
              onClick={() => handleCopy(tagValue, "StableTag")}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-4 py-3 text-sm font-semibold transition-all group cursor-pointer"
            >
              <span className="text-brand-purple font-mono font-bold tracking-wider">${tagValue || "not set"}</span>
              {copiedField === "StableTag" ? (
                <Check size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <Copy size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
              )}
            </button>
            <p className="text-xs text-zinc-500 font-sans text-center px-2 mt-1 leading-relaxed">
              Share your tag with other StableBank users to receive instant, zero-gas internal transfers.
            </p>
          </div>
        </div>
      )}
    </DialogContent>
  );
}
