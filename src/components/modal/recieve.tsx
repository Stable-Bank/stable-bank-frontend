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
  Info,
  Plus,
  Loader2
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { accountService } from "@/services/accountService";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { NetworkIcon, TokenIcon } from "@web3icons/react/dynamic";
import { cn } from "@/utils/cn";
import { USFlagIcon, UKFlagIcon, EUFlagIcon, MultiFlagIcon } from "@/components/ui/flag-icons";
import OnboardingModal from "@/components/modal/onboarding-modal";

interface SupportedNetwork {
  id: string;
  name: string;
  type: "solana" | "evm" | "tron" | "stellar";
  timeText: string;
  feeText: string;
  tokens: string[];
}

const SUPPORTED_NETWORKS: SupportedNetwork[] = [
  {
    id: "solana",
    name: "Solana",
    type: "solana",
    timeText: "~1 sec",
    feeText: "< $0.001",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "base",
    name: "Base",
    type: "evm",
    timeText: "~2 sec",
    feeText: "< $0.01",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "polygon",
    name: "Polygon",
    type: "evm",
    timeText: "~5 sec",
    feeText: "< $0.02",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "optimism",
    name: "Optimism",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    tokens: ["usdc", "usdt"],
  },
  {
    id: "avalanche",
    name: "Avalanche",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    type: "evm",
    timeText: "~15 sec",
    feeText: "$1.50 - $4.00",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "tron",
    name: "Tron (TRC20)",
    type: "tron",
    timeText: "~1 min",
    feeText: "< $1.00",
    tokens: ["usdt", "usdc"],
  },
  {
    id: "stellar",
    name: "Stellar",
    type: "stellar",
    timeText: "~3 sec",
    feeText: "< $0.001",
    tokens: ["usdc", "eurc"],
  },
];

const ALL_TOKENS = [
  { symbol: "usdc", name: "USD Coin", label: "USDC (USD)", issuer: "Circle" },
  { symbol: "usdt", name: "Tether USD", label: "USDT (USD)", issuer: "Tether" },
  { symbol: "eurc", name: "Euro Coin", label: "EURC (EUR)", issuer: "Circle" },
];

export default function RecieveModal() {
  const { user } = useAuth();
  const [activeChannel, setActiveChannel] = useState<"wire" | "crypto" | "tag">("wire");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("solana");
  const [selectedToken, setSelectedToken] = useState<string>("usdc");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [virtualAccounts, setVirtualAccounts] = useState<any[]>([]);
  const [isCreatingVA, setIsCreatingVA] = useState(false);
  const [isLoadingVA, setIsLoadingVA] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [kycTargetCurrency, setKycTargetCurrency] = useState<string>("USD");

  const currentNetworkObj = useMemo(
    () => SUPPORTED_NETWORKS.find((n) => n.id === selectedNetwork) || SUPPORTED_NETWORKS[0],
    [selectedNetwork]
  );

  const availableTokensForNetwork = useMemo(() => {
    return ALL_TOKENS.filter((t) => currentNetworkObj.tokens.includes(t.symbol));
  }, [currentNetworkObj]);

  useEffect(() => {
    if (!currentNetworkObj.tokens.includes(selectedToken)) {
      setSelectedToken(currentNetworkObj.tokens[0] || "usdc");
    }
  }, [selectedNetwork, currentNetworkObj, selectedToken]);

  const fetchVA = async () => {
    try {
      setIsLoadingVA(true);
      const data = await accountService.getVirtualAccounts();
      setVirtualAccounts(data || []);
    } catch (err) {
      console.debug("Virtual accounts fetch:", err);
    } finally {
      setIsLoadingVA(false);
    }
  };

  useEffect(() => {
    fetchVA();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text || text === "Pending Setup") return toast.error("Account detail not available");
    copyToClipboard(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateVirtualAccount = async (currency: string) => {
    if (user?.kycStatus !== "approved") {
      setKycTargetCurrency(currency);
      setIsOnboardingOpen(true);
      return;
    }

    try {
      setIsCreatingVA(true);
      toast.loading(`Provisioning Bridge ${currency} Virtual Account...`);
      await accountService.createVirtualAccount({ currency: currency.toLowerCase() });
      toast.dismiss();
      toast.success(`Bridge ${currency} Virtual Account created successfully!`);
      await fetchVA();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Failed to create virtual account");
    } finally {
      setIsCreatingVA(false);
    }
  };

  const handleKycComplete = async () => {
    await fetchVA();
    if (kycTargetCurrency) {
      try {
        await accountService.createVirtualAccount({ currency: kycTargetCurrency.toLowerCase() });
        toast.success(`Bridge ${kycTargetCurrency} Virtual Account created successfully!`);
        await fetchVA();
      } catch (err: any) {
        console.debug("Post-KYC VA creation:", err);
      }
    }
  };

  const tagValue = user?.bankTag || "";
  const { balance } = useBalance((user as any)?.primaryWalletAddress || user?.walletAddress);

  const getNetworkAddress = (networkId: string, networkType: string) => {
    if (balance?.walletsByChain && balance.walletsByChain[networkId]) {
      return balance.walletsByChain[networkId];
    }
    if (networkType === "solana") {
      return balance?.solanaWalletAddress || (user as any)?.solanaWalletAddress || (user as any)?.primaryWalletAddress || "";
    }
    if (networkType === "tron") {
      return balance?.tronWalletAddress || (user as any)?.tronWalletAddress || "";
    }
    return balance?.evmWalletAddress || (user as any)?.evmWalletAddress || user?.walletAddress || "";
  };

  const addressValue = getNetworkAddress(selectedNetwork, currentNetworkObj.type);

  const getAccountData = (currency: "USD" | "GBP" | "EUR") => {
    const va = virtualAccounts.find((a: any) => (a.currency || "").toUpperCase() === currency);
    const userName = user ? `${user.firstName || "Member"} ${user.lastName || "Account"}` : "StableBank Ltd / Client Account";

    if (!va) return null;

    if (currency === "USD") {
      return {
        bankName: va.bank_name || va.bankName || "Bridge USD Settlement Partner (Lead Bank)",
        routing: va.routing_number || va.routingNumber || "Pending Setup",
        accountNumber: va.account_number || va.accountNumber || "Pending Setup",
        currency: "USD",
        rail: "ACH & FedWire",
        isLive: true,
        details: [
          { label: "Routing Number (ABA)", value: va.routing_number || va.routingNumber || "Pending Setup" },
          { label: "Account Number", value: va.account_number || va.accountNumber || "Pending Setup" },
          { label: "Bank Name", value: va.bank_name || va.bankName || "Lead Bank (Bridge Partner)" },
          { label: "Beneficiary Legal Name", value: va.account_holder_name || va.accountHolderName || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    } else if (currency === "EUR") {
      return {
        bankName: va.bank_name || va.bankName || "Bridge EU Clearing (Luxembourg)",
        iban: va.iban || "Pending Setup",
        bic: va.bic || "Pending Setup",
        currency: "EUR",
        rail: "SEPA Instant",
        isLive: true,
        details: [
          { label: "IBAN", value: va.iban || "Pending Setup" },
          { label: "BIC / SWIFT", value: va.bic || "Pending Setup" },
          { label: "Bank Name", value: va.bank_name || va.bankName || "Bridge EU Clearing (Luxembourg)" },
          { label: "Beneficiary Legal Name", value: va.account_holder_name || va.accountHolderName || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    } else {
      return {
        bankName: va.bank_name || va.bankName || "Bridge UK Clearing",
        sortCode: va.sort_code || va.sortCode || "Pending Setup",
        accountNumber: va.account_number || va.accountNumber || "Pending Setup",
        currency: "GBP",
        rail: "Faster Payments",
        isLive: true,
        details: [
          { label: "Sort Code", value: va.sort_code || va.sortCode || "Pending Setup" },
          { label: "Account Number", value: va.account_number || va.accountNumber || "Pending Setup" },
          { label: "Bank Name", value: va.bank_name || va.bankName || "Bridge UK Clearing" },
          { label: "Beneficiary Legal Name", value: va.account_holder_name || va.accountHolderName || userName },
          { label: "Reference Note", value: tagValue ? `TAG-${tagValue.toUpperCase()}` : "STABLE-DEP" },
        ],
      };
    }
  };

  const currentAccount = getAccountData(activeCurrency);

  return (
    <DialogContent className="w-full !max-w-[640px] rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl text-zinc-950 animate-in zoom-in-95 duration-200 gap-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
      
      {/* Header */}
      <DialogHeader className="space-y-1">
        <DialogTitle className="flex items-center gap-3">
          <div className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-xs">
            <ArrowDownLeft size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-display font-extrabold text-zinc-950 tracking-tight">
              Add & Receive Funds
            </h2>
            <p className="text-xs text-zinc-500 font-sans font-medium">
              Direct deposit via dedicated bank wires, multi-chain crypto, or internal $StableTag
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      {/* Main Channel Selector Tabs */}
      <div className="grid grid-cols-3 bg-zinc-100/90 border border-zinc-200/90 p-1.5 rounded-2xl gap-1.5">
        <button
          onClick={() => setActiveChannel("wire")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
            activeChannel === "wire"
              ? "bg-white text-emerald-700 shadow-xs font-extrabold"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <MultiFlagIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">Bank Wire</span>
        </button>

        <button
          onClick={() => setActiveChannel("crypto")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
            activeChannel === "crypto"
              ? "bg-white text-indigo-600 shadow-xs font-extrabold"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <Wallet size={15} className="text-indigo-600 shrink-0" />
          <span className="truncate">Crypto On-Chain</span>
        </button>

        <button
          onClick={() => setActiveChannel("tag")}
          className={cn(
            "flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
            activeChannel === "tag"
              ? "bg-white text-brand-purple shadow-xs font-extrabold"
              : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
          )}
        >
          <Send size={15} className="text-brand-purple shrink-0" />
          <span className="truncate">$StableTag</span>
        </button>
      </div>

      {/* CHANNEL 1: VIRTUAL BANK WIRE (USD, EUR, GBP) */}
      {activeChannel === "wire" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          
          {/* Currency Subtabs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: "USD" as const, name: "US Dollar", sub: "ACH / FedWire", icon: USFlagIcon },
              { code: "EUR" as const, name: "Euro", sub: "SEPA Instant", icon: EUFlagIcon },
              { code: "GBP" as const, name: "British Pound", sub: "Faster Payments", icon: UKFlagIcon },
            ].map((curr) => {
              const IconComp = curr.icon;
              const isSelected = activeCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setActiveCurrency(curr.code)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer gap-1",
                    isSelected
                      ? "bg-emerald-50/70 border-emerald-500 text-emerald-900 shadow-2xs font-extrabold"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span className="font-mono font-bold text-xs">{curr.code}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans font-medium">{curr.sub}</span>
                </button>
              );
            })}
          </div>

          {/* Account Details Panel */}
          {isLoadingVA ? (
            <div className="h-[220px] w-full animate-pulse rounded-2xl bg-zinc-100" />
          ) : currentAccount ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 space-y-3.5 shadow-2xs">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <div className="flex items-center gap-2">
                  {activeCurrency === "USD" && <USFlagIcon className="w-5 h-5" />}
                  {activeCurrency === "GBP" && <UKFlagIcon className="w-5 h-5" />}
                  {activeCurrency === "EUR" && <EUFlagIcon className="w-5 h-5" />}
                  <div>
                    <span className="text-xs font-bold text-zinc-950 font-sans block">{currentAccount.bankName}</span>
                    <span className="text-[10px] text-zinc-500 font-sans font-medium">Dedicated Bridge Virtual Account</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300">
                  {currentAccount.rail}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentAccount.details.map((field) => (
                  <div key={field.label} className="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-zinc-200/80 text-xs">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{field.label}</span>
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <span className="text-zinc-950 font-mono font-bold truncate text-xs sm:text-sm" title={field.value}>
                        {field.value}
                      </span>
                      <button
                        onClick={() => handleCopy(field.value, field.label)}
                        className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer shrink-0"
                        title="Copy"
                      >
                        {copiedField === field.label ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-300 rounded-2xl p-6 text-center flex flex-col items-center justify-center bg-zinc-50/50">
              <div className="h-12 w-12 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mb-2 shadow-2xs">
                {activeCurrency === "USD" && <USFlagIcon className="w-6 h-6" />}
                {activeCurrency === "GBP" && <UKFlagIcon className="w-6 h-6" />}
                {activeCurrency === "EUR" && <EUFlagIcon className="w-6 h-6" />}
              </div>
              <h3 className="text-base font-display font-bold text-zinc-950">No {activeCurrency} Virtual Account</h3>
              <p className="text-zinc-500 text-xs mt-1 max-w-[320px] leading-relaxed font-sans">
                Generate dedicated {activeCurrency} bank routing details powered by Bridge.xyz to accept inbound wire, ACH, or SEPA transfers.
              </p>
              <button
                onClick={() => handleCreateVirtualAccount(activeCurrency)}
                disabled={isCreatingVA}
                className="mt-4 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-xs h-10 px-5 cursor-pointer shadow-md shadow-brand-purple/20 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isCreatingVA ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Provisioning Account...</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Provision {activeCurrency} Account</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-3 flex items-center gap-2.5 text-xs text-emerald-900 font-sans">
            <Info size={16} className="text-emerald-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Inbound bank wires automatically convert at 1:1 par with zero slippage and credit directly into your unified balance.
            </p>
          </div>
        </div>
      )}

      {/* CHANNEL 2: ON-CHAIN MULTI-CHAIN CRYPTO */}
      {activeChannel === "crypto" && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-300">
          
          {/* Step A: Select Chain / Network */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider">
                1. Select Deposit Network
              </label>
              <span className="text-[11px] font-sans text-zinc-500 font-medium">
                Speed: <strong className="text-zinc-900">{currentNetworkObj.timeText}</strong> • Gas: <strong className="text-zinc-900">{currentNetworkObj.feeText}</strong>
              </span>
            </div>

            {/* Network Selector Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {SUPPORTED_NETWORKS.map((net) => {
                const isSelected = selectedNetwork === net.id;
                return (
                  <button
                    key={net.id}
                    onClick={() => setSelectedNetwork(net.id)}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer font-sans text-left",
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-500 text-indigo-950 shadow-2xs font-extrabold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    )}
                  >
                    <NetworkIcon id={net.id} variant="branded" size={18} className="rounded-full shrink-0" />
                    <div className="truncate">
                      <span className="block truncate text-xs">{net.name}</span>
                      <span className="block text-[9px] font-mono text-zinc-400 font-normal">{net.timeText}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step B: Select Asset Supported on this Network */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider">
              2. Select Stablecoin Asset ({availableTokensForNetwork.length} supported on {currentNetworkObj.name})
            </label>

            <div className="grid grid-cols-3 gap-2">
              {availableTokensForNetwork.map((token) => {
                const isSelected = selectedToken === token.symbol;
                return (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token.symbol)}
                    className={cn(
                      "flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                      isSelected
                        ? "bg-brand-purple/10 border-brand-purple text-brand-purple shadow-2xs font-extrabold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                    )}
                  >
                    <TokenIcon symbol={token.symbol} variant="branded" size={16} className="rounded-full shrink-0" />
                    <span className="font-mono">{token.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step C: QR Code & Deposit Address Display */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-2xs">
            
            {/* QR Code */}
            <div className="p-2.5 rounded-2xl bg-white border border-zinc-200 shadow-sm shrink-0">
              {addressValue ? (
                <QRCodeSVG
                  value={addressValue}
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-30 w-30 flex items-center justify-center text-zinc-400 text-xs font-mono">No Address</div>
              )}
            </div>

            {/* Address & Rail Details */}
            <div className="flex-1 space-y-2.5 w-full text-left">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  {currentNetworkObj.type === "solana" ? "Solana Custodial Address" : "Multi-Chain EVM Address"}
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  {currentNetworkObj.name} Rail
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => handleCopy(addressValue, "Deposit Address")}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 px-3.5 py-2.5 text-xs font-semibold transition-all group cursor-pointer shadow-2xs"
                >
                  <span className="text-zinc-950 font-mono font-bold tracking-wide truncate max-w-[280px]">
                    {addressValue || "Generating address..."}
                  </span>
                  {copiedField === "Deposit Address" ? (
                    <Check size={16} className="text-emerald-600 shrink-0" />
                  ) : (
                    <Copy size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
                  )}
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                Send only <strong>{selectedToken.toUpperCase()}</strong> on the <strong>{currentNetworkObj.name}</strong> network. Deposits settle directly under Bridge.xyz institutional custody.
              </p>
            </div>

          </div>

          {/* Safety Notice */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-amber-900 text-xs font-sans">
            <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Cross-chain deposits sent to incorrect network addresses cannot be automatically recovered. Please verify network compatibility before broadcasting transactions.
            </p>
          </div>

        </div>
      )}

      {/* CHANNEL 3: STABLETAG INTERNAL LEDGER */}
      {activeChannel === "tag" && (
        <div className="flex flex-col items-center gap-5 py-2 animate-in fade-in duration-300">
          
          <div className="relative p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-2xs">
            <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
              {tagValue ? (
                <QRCodeSVG
                  value={tagValue}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="M"
                />
              ) : (
                <div className="h-32 w-32 flex items-center justify-center text-zinc-400 text-xs font-mono">No tag found</div>
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-2 max-w-[420px]">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Your Unique StableTag
            </span>
            <button
              onClick={() => handleCopy(tagValue, "StableTag")}
              className="flex w-full items-center justify-between gap-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 px-4 py-3.5 text-sm font-semibold transition-all group cursor-pointer shadow-2xs"
            >
              <span className="text-brand-purple font-mono font-bold text-base tracking-wider">${tagValue || "not set"}</span>
              {copiedField === "StableTag" ? (
                <Check size={16} className="text-emerald-600 shrink-0" />
              ) : (
                <Copy size={16} className="text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
              )}
            </button>
            <p className="text-xs text-zinc-500 font-sans text-center px-2 leading-relaxed">
              Share your StableTag with other members to receive real-time, zero-gas internal transfers on the platform ledger.
            </p>
          </div>

        </div>
      )}

      {/* Contextual KYC Verification Modal */}
      <OnboardingModal
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        onComplete={handleKycComplete}
        triggerReason="virtual_account"
        targetCurrency={kycTargetCurrency}
      />
    </DialogContent>
  );
}
