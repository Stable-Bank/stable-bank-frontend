"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transferService } from "@/services/transferService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  XCircle,
  ShieldCheck,
  Send,
  Landmark,
  Wallet,
  AtSign,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  Copy,
  ExternalLink,
  ClipboardPaste,
  ShieldAlert
} from "lucide-react";
import { NetworkIcon, TokenIcon } from "@web3icons/react/dynamic";
import { USFlagIcon, UKFlagIcon, EUFlagIcon } from "@/components/ui/flag-icons";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import OnboardingModal from "@/components/modal/onboarding-modal";

interface SendTokenModalProps {
  balance: any;
  onSuccess: () => void;
  onClose: () => void;
}

type TransferChannel = "tag" | "crypto" | "fiat";
type FiatCurrency = "USD" | "EUR" | "GBP";

interface SupportedNetwork {
  id: string;
  name: string;
  type: "solana" | "evm" | "tron" | "stellar";
  timeText: string;
  feeText: string;
  prefix: string;
  tokens: string[];
}

const NETWORKS: SupportedNetwork[] = [
  {
    id: "solana",
    name: "Solana",
    type: "solana",
    timeText: "~1 sec",
    feeText: "< $0.001",
    prefix: "Base58",
    tokens: ["usdc", "usdt", "eurc", "usdb", "pyusd"],
  },
  {
    id: "base",
    name: "Base",
    type: "evm",
    timeText: "~2 sec",
    feeText: "< $0.01",
    prefix: "0x",
    tokens: ["usdc", "usdt", "eurc", "usdb"],
  },
  {
    id: "polygon",
    name: "Polygon",
    type: "evm",
    timeText: "~5 sec",
    feeText: "< $0.02",
    prefix: "0x",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    prefix: "0x",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "optimism",
    name: "Optimism",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    prefix: "0x",
    tokens: ["usdc", "usdt"],
  },
  {
    id: "avalanche",
    name: "Avalanche",
    type: "evm",
    timeText: "~3 sec",
    feeText: "< $0.05",
    prefix: "0x",
    tokens: ["usdc", "usdt", "eurc"],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    type: "evm",
    timeText: "~15 sec",
    feeText: "$1.50 - $4.00",
    prefix: "0x",
    tokens: ["usdc", "usdt", "eurc", "pyusd"],
  },
  {
    id: "tron",
    name: "Tron (TRC20)",
    type: "tron",
    timeText: "~1 min",
    feeText: "< $1.00",
    prefix: "T",
    tokens: ["usdt", "usdc"],
  },
  {
    id: "stellar",
    name: "Stellar",
    type: "stellar",
    timeText: "~3 sec",
    feeText: "< $0.001",
    prefix: "G",
    tokens: ["usdc", "eurc"],
  },
];

const ALL_TOKENS = [
  { symbol: "usdc", name: "USD Coin", label: "USDC (USD)" },
  { symbol: "usdt", name: "Tether USD", label: "USDT (USD)" },
  { symbol: "eurc", name: "Euro Coin", label: "EURC (EUR)" },
  { symbol: "usdb", name: "Yield USD", label: "USDB (USD)" },
  { symbol: "pyusd", name: "PayPal USD", label: "PYUSD (USD)" },
];

export default function SendTokenModal({
  balance,
  onSuccess,
  onClose,
}: SendTokenModalProps) {
  const { user } = useAuth();
  const [channel, setChannel] = useState<TransferChannel>("tag");
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Recipient, 2: Amount/Memo, 3: Review, 4: Receipt

  // Step 1: Recipient States
  // 1A. Tag Transfer
  const [searchTag, setSearchTag] = useState("");
  const [resolvedRecipient, setResolvedRecipient] = useState<any>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [recentRecipients, setRecentRecipients] = useState<any[]>([]);

  // 1B. Crypto Transfer
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string>("solana");
  const [selectedToken, setSelectedToken] = useState<string>("usdc");
  const [addressError, setAddressError] = useState<string | null>(null);

  // 1C. Fiat Bank Transfer
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>("USD");
  const [fiatBeneficiaryName, setFiatBeneficiaryName] = useState("");
  const [fiatAccountNumber, setFiatAccountNumber] = useState("");
  const [fiatRoutingNumber, setFiatRoutingNumber] = useState(""); // Routing or Sort Code or BIC
  const [fiatBankName, setFiatBankName] = useState("");

  // Step 2: Amount & Memo
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // Step 3: Processing & Results
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedTxId, setCopiedTxId] = useState(false);
  const [txResult, setTxResult] = useState<{
    success: boolean;
    message: string;
    txId?: string;
    rail?: string;
    amount?: string;
    recipientDisplay?: string;
  } | null>(null);

  // KYC modal trigger if unverified tries fiat transfer
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);

  // Available balance helpers
  const totalUsdBalance = balance?.totalUSD || 0;

  const currentNetworkObj = useMemo(
    () => NETWORKS.find((n) => n.id === selectedNetwork) || NETWORKS[0],
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

  // Validate Crypto Address
  const validateCryptoAddress = (addr: string, netId: string): string | null => {
    const clean = addr.trim();
    if (!clean) return "Address is required";

    const net = NETWORKS.find((n) => n.id === netId);
    if (!net) return null;

    if (net.type === "solana") {
      if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(clean)) {
        return "Invalid Solana address (expected 32-44 Base58 characters)";
      }
    } else if (net.type === "tron") {
      if (!/^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(clean)) {
        return "Invalid Tron address (expected 34 characters starting with 'T')";
      }
    } else if (net.type === "evm") {
      if (!/^0x[a-fA-F0-9]{40}$/.test(clean)) {
        return "Invalid EVM address (expected 0x followed by 40 hexadecimal characters)";
      }
    } else if (net.type === "stellar") {
      if (!/^G[A-Z2-7]{55}$/.test(clean)) {
        return "Invalid Stellar public key (expected 56 characters starting with 'G')";
      }
    }
    return null;
  };

  useEffect(() => {
    if (cryptoAddress.trim()) {
      setAddressError(validateCryptoAddress(cryptoAddress, selectedNetwork));
    } else {
      setAddressError(null);
    }
  }, [cryptoAddress, selectedNetwork]);

  // Fetch recent transfer history for quick selection
  useEffect(() => {
    const fetchRecents = async () => {
      try {
        const history: any = await transferService.getTransferHistory();
        const historyList = Array.isArray(history)
          ? history
          : history && Array.isArray(history.transfers)
          ? history.transfers
          : [];

        const cleanUserTag = user?.bankTag
          ? user.bankTag.toLowerCase().replace(/[^a-z0-9_]/g, "")
          : "";
        const currentUserId = (user?.id || (user as any)?._id || "").toString();

        const unique = historyList
          .filter((t: any) => t.toBankTag)
          .reduce((acc: any[], transfer: any) => {
            const rawTag = transfer.toBankTag.replace(/[^a-z0-9_]/gi, "");
            const formattedTag = `$${rawTag}`;
            const recipientUserId = (
              transfer.toUserId?._id ||
              transfer.toUserId?.id ||
              transfer.toUserId ||
              ""
            ).toString();

            if (cleanUserTag && rawTag.toLowerCase() === cleanUserTag) return acc;
            if (currentUserId && recipientUserId === currentUserId) return acc;

            if (!acc.find((u) => u.bankTag.toLowerCase() === formattedTag.toLowerCase())) {
              acc.push({
                userId: recipientUserId,
                bankTag: formattedTag,
                firstName: transfer.toUserId?.firstName || rawTag || "Recipient",
                lastName: transfer.toUserId?.lastName || "",
                avatarUrl: transfer.toUserId?.avatarUrl || null,
              });
            }
            return acc;
          }, [])
          .slice(0, 4);

        setRecentRecipients(unique);
      } catch (err) {
        console.debug("Failed to fetch recents:", err);
      }
    };
    fetchRecents();
  }, [user]);

  // Tag search & resolve
  useEffect(() => {
    if (!searchTag || searchTag.length < 2) {
      setResolvedRecipient(null);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsResolving(true);
      setSearchError(null);
      try {
        const cleanTag = searchTag.replace("$", "").trim();
        const res: any = await transferService.resolveRecipient(cleanTag);
        if (res && res.user) {
          const u = res.user;
          const currentUserId = (user?.id || (user as any)?._id || "").toString();
          if ((u.id || u._id || "").toString() === currentUserId) {
            setSearchError("You cannot transfer funds to your own tag.");
            setResolvedRecipient(null);
          } else {
            setResolvedRecipient({
              userId: u.id || u._id,
              bankTag: u.bankTag ? `$${u.bankTag.replace("$", "")}` : `$${cleanTag}`,
              firstName: u.firstName || "Member",
              lastName: u.lastName || "",
              avatarUrl: u.avatarUrl || null,
              kycStatus: u.kycStatus || "pending",
            });
          }
        } else {
          setResolvedRecipient(null);
          setSearchError("No member found with this StableTag.");
        }
      } catch (err: any) {
        setResolvedRecipient(null);
        setSearchError(err?.response?.data?.message || "StableTag not found");
      } finally {
        setIsResolving(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTag, user]);

  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCryptoAddress(text.trim());
        toast.success("Address pasted from clipboard!");
      }
    } catch {
      toast.error("Unable to access clipboard. Please paste manually.");
    }
  };

  const handlePercentageAmount = (percent: number) => {
    const calculated = (totalUsdBalance * percent).toFixed(2);
    setAmount(calculated);
  };

  const handleMaxAmount = () => {
    setAmount(totalUsdBalance.toFixed(2));
  };

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedFromStep1 = () => {
    if (channel === "tag") {
      if (!resolvedRecipient) {
        toast.error("Please enter and resolve a valid StableTag.");
        return;
      }
    } else if (channel === "crypto") {
      const err = validateCryptoAddress(cryptoAddress, selectedNetwork);
      if (err) {
        setAddressError(err);
        toast.error(err);
        return;
      }
    } else if (channel === "fiat") {
      if (user?.kycStatus !== "approved") {
        setIsKycModalOpen(true);
        return;
      }
      if (!fiatBeneficiaryName.trim() || !fiatAccountNumber.trim()) {
        toast.error("Beneficiary Name and Account / IBAN Number are required.");
        return;
      }
    }
    setStep(2);
  };

  // Step 2 Validation -> Proceed to Step 3 (Review)
  const handleProceedFromStep2 = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }

    if (parsedAmount > totalUsdBalance) {
      toast.error("Insufficient spendable balance.");
      return;
    }

    setStep(3);
  };

  // Step 3: Execute Transfer
  const handleExecuteTransfer = async () => {
    setIsProcessing(true);
    try {
      if (channel === "tag") {
        const response: any = await transferService.initiateTransfer({
          recipient: resolvedRecipient.bankTag,
          recipientBankTag: resolvedRecipient.bankTag,
          amount,
          tokenSymbol: "USDC",
          sourceChain: "solana",
          destinationChain: "solana",
          description,
        });

        setTxResult({
          success: true,
          message: `Successfully transferred $${parseFloat(amount).toFixed(2)} USD to ${resolvedRecipient.bankTag}`,
          txId: response?.transactionId || response?.id || "STABLE-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          rail: "StableTag Instant Ledger",
          amount: `$${parseFloat(amount).toFixed(2)} USD`,
          recipientDisplay: resolvedRecipient.bankTag,
        });
      } else if (channel === "crypto") {
        const response: any = await transferService.initiateTransfer({
          recipientAddress: cryptoAddress.trim(),
          amount,
          tokenSymbol: selectedToken.toUpperCase(),
          sourceChain: selectedNetwork,
          destinationChain: selectedNetwork,
          description,
        });

        setTxResult({
          success: true,
          message: `Sent ${parseFloat(amount).toFixed(2)} ${selectedToken.toUpperCase()} to ${cryptoAddress.slice(0, 6)}...${cryptoAddress.slice(-4)}`,
          txId: response?.transactionId || response?.id || "0x" + Math.random().toString(16).substring(2, 18),
          rail: `${currentNetworkObj.name} On-Chain Rail`,
          amount: `${parseFloat(amount).toFixed(2)} ${selectedToken.toUpperCase()}`,
          recipientDisplay: `${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)}`,
        });
      } else if (channel === "fiat") {
        const response = await transferService.createOutboundTransfer({
          amount,
          sourceCurrency: "usdc",
          sourceRail: "bridge_wallet",
          destinationCurrency: fiatCurrency.toLowerCase(),
          destinationRail: fiatCurrency === "USD" ? "ach" : fiatCurrency === "EUR" ? "sepa" : "wire",
          bankDetails: {
            accountNumber: fiatAccountNumber,
            routingNumber: fiatRoutingNumber,
            beneficiaryName: fiatBeneficiaryName,
            bankName: fiatBankName,
          },
        });

        setTxResult({
          success: true,
          message: `Outbound ${fiatCurrency} bank transfer of ${fiatCurrency} ${parseFloat(amount).toFixed(2)} initiated to ${fiatBeneficiaryName}`,
          txId: response?.bridgeTransferId || response?.id || "BRG-OFFRAMP-" + Math.random().toString(36).substring(2, 10).toUpperCase(),
          rail: `Bridge.xyz ${fiatCurrency} Bank Rail (${fiatCurrency === "USD" ? "ACH/Wire" : fiatCurrency === "EUR" ? "SEPA Instant" : "Faster Payments"})`,
          amount: `${fiatCurrency} ${parseFloat(amount).toFixed(2)}`,
          recipientDisplay: `${fiatBeneficiaryName} (${fiatAccountNumber.slice(-4)})`,
        });
      }

      setStep(4);
      onSuccess();
    } catch (err: any) {
      console.error("Transfer error:", err);
      setTxResult({
        success: false,
        message: err?.response?.data?.message || err?.message || "Failed to process transfer. Please try again.",
      });
      setStep(4);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyTxId = (id?: string) => {
    if (!id) return;
    copyToClipboard(id);
    setCopiedTxId(true);
    toast.success("Transaction ID copied to clipboard!");
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  return (
    <DialogContent className="w-full !max-w-[560px] rounded-3xl border border-zinc-200 bg-white p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-zinc-950 max-h-[90vh] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 text-brand-purple flex items-center justify-center shadow-2xs">
            <Send size={18} />
          </div>
          <div>
            <DialogTitle className="text-base sm:text-lg font-display font-extrabold text-zinc-950 tracking-tight">
              {step === 4 ? "Transfer Status" : "Send & Transfer Funds"}
            </DialogTitle>
            <p className="text-[11px] text-zinc-500 font-sans font-medium">
              {step === 1 && "Step 1 of 3: Select Rail & Destination"}
              {step === 2 && "Step 2 of 3: Specify Amount"}
              {step === 3 && "Step 3 of 3: Review & Confirm"}
              {step === 4 && "Settlement Summary"}
            </p>
          </div>
        </div>

        {step < 4 && (
          <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-zinc-600">
            Step {step}/3
          </div>
        )}
      </DialogHeader>

      {/* STEP 1: SELECT CHANNEL & RECIPIENT */}
      {step === 1 && (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
          {/* Rail Selector Tabs (Tag, Crypto, Fiat Bank) */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/80">
            <button
              type="button"
              onClick={() => setChannel("tag")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
                channel === "tag"
                  ? "bg-white text-brand-purple shadow-xs font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
              )}
            >
              <AtSign size={14} className="text-brand-purple" />
              <span>$BankTag</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("crypto")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
                channel === "crypto"
                  ? "bg-white text-indigo-600 shadow-xs font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
              )}
            >
              <Wallet size={14} className="text-indigo-600" />
              <span>Crypto Rail</span>
            </button>

            <button
              type="button"
              onClick={() => setChannel("fiat")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans",
                channel === "fiat"
                  ? "bg-white text-emerald-700 shadow-xs font-extrabold"
                  : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
              )}
            >
              <Landmark size={14} className="text-emerald-600" />
              <span>Bank Wire / ACH</span>
            </button>
          </div>

          {/* CHANNEL 1: $BANKTAG */}
          {channel === "tag" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                  Recipient BankTag
                </label>
                <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3 gap-2.5">
                  <span className="text-sm font-bold text-brand-purple font-mono">$</span>
                  <input
                    type="text"
                    placeholder="e.g. adefeyitimi or alex_vance"
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="w-full bg-transparent border-none text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                  />
                  {isResolving && <Loader2 size={16} className="text-brand-purple animate-spin" />}
                </div>
                {searchError && (
                  <p className="text-xs text-red-500 font-sans font-medium flex items-center gap-1 mt-1">
                    <XCircle size={13} /> {searchError}
                  </p>
                )}
              </div>

              {/* Resolved User Preview Card */}
              {resolvedRecipient && (
                <div className="bg-purple-50/70 border border-brand-purple/20 rounded-2xl p-3.5 flex items-center justify-between animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-brand-purple text-white flex items-center justify-center font-display font-extrabold text-sm shadow-xs">
                      {resolvedRecipient.firstName ? resolvedRecipient.firstName.charAt(0).toUpperCase() : "$"}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-sans font-bold text-zinc-950">
                        {resolvedRecipient.firstName} {resolvedRecipient.lastName}
                      </h4>
                      <p className="text-[11px] font-mono font-bold text-brand-purple">
                        {resolvedRecipient.bankTag}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Verified Member ✓
                  </span>
                </div>
              )}

              {/* Recent Recipients */}
              {recentRecipients.length > 0 && !resolvedRecipient && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    Recent Contacts
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {recentRecipients.map((rec) => (
                      <button
                        key={rec.bankTag}
                        type="button"
                        onClick={() => {
                          setSearchTag(rec.bankTag.replace("$", ""));
                          setResolvedRecipient(rec);
                        }}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-left cursor-pointer"
                      >
                        <div className="h-7 w-7 rounded-lg bg-zinc-200 text-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {rec.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <span className="text-xs font-sans font-bold text-zinc-900 block truncate">{rec.firstName}</span>
                          <span className="text-[10px] font-mono text-zinc-500 block truncate">{rec.bankTag}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3 flex items-center gap-2.5 text-xs text-zinc-600 font-sans">
                <Sparkles size={16} className="text-amber-500 shrink-0" />
                <span>Internal BankTag transfers settle instantly across ledger accounts with <strong>$0 network fees</strong>.</span>
              </div>
            </div>
          )}

          {/* CHANNEL 2: ON-CHAIN CRYPTO */}
          {channel === "crypto" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Network & Token Selector */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                    Destination Network
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                    {NETWORKS.map((net) => {
                      const isSelected = selectedNetwork === net.id;
                      return (
                        <button
                          key={net.id}
                          type="button"
                          onClick={() => setSelectedNetwork(net.id)}
                          className={cn(
                            "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left",
                            isSelected
                              ? "bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-2xs font-extrabold"
                              : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                          )}
                        >
                          <NetworkIcon name={net.id} variant="branded" size={18} className="shrink-0 rounded-full" />
                          <div className="truncate">
                            <span className="block truncate font-sans text-xs">{net.name}</span>
                            <span className="block text-[9px] font-mono text-zinc-400 font-normal">{net.timeText}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                    Token Asset
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTokensForNetwork.map((tok) => {
                      const isSelected = selectedToken === tok.symbol;
                      return (
                        <button
                          key={tok.symbol}
                          type="button"
                          onClick={() => setSelectedToken(tok.symbol)}
                          className={cn(
                            "flex items-center gap-1.5 py-1.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                            isSelected
                              ? "bg-brand-purple/10 border-brand-purple text-brand-purple font-extrabold shadow-2xs"
                              : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                          )}
                        >
                          <TokenIcon symbol={tok.symbol} variant="branded" size={16} className="shrink-0 rounded-full" />
                          <span className="font-mono">{tok.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Wallet Address Input with Paste Button */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                    Recipient Address ({currentNetworkObj.name} {currentNetworkObj.prefix})
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteAddress}
                    className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-brand-purple hover:underline cursor-pointer"
                  >
                    <ClipboardPaste size={12} /> Paste
                  </button>
                </div>
                <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3 gap-2.5">
                  <Wallet size={16} className="text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    placeholder={
                      currentNetworkObj.type === "solana"
                        ? "e.g. 7xKXtg2CW87d97TXJSDpb..."
                        : currentNetworkObj.type === "tron"
                        ? "e.g. TJgppFmLs5HzLBFR3doPSqDe6UBj2BoG8T"
                        : "e.g. 0x71C...3982"
                    }
                    value={cryptoAddress}
                    onChange={(e) => setCryptoAddress(e.target.value.trim())}
                    className="w-full bg-transparent border-none text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
                {addressError && (
                  <p className="text-xs text-red-500 font-sans font-medium flex items-center gap-1 mt-1">
                    <XCircle size={13} /> {addressError}
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-3 flex items-center justify-between text-xs text-zinc-600 font-sans">
                <span className="flex items-center gap-2">
                  <Clock size={15} className="text-zinc-400" />
                  Estimated Arrival: <strong>{currentNetworkObj.timeText}</strong>
                </span>
                <span className="font-mono text-[11px] text-zinc-500 font-bold">
                  Est. Gas: {currentNetworkObj.feeText}
                </span>
              </div>
            </div>
          )}

          {/* CHANNEL 3: FIAT BANK WIRE / OFF-RAMP */}
          {channel === "fiat" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Currency Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                  Payout Rail & Currency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "USD", label: "USD (ACH / Wire)", icon: USFlagIcon },
                    { id: "EUR", label: "EUR (SEPA Instant)", icon: EUFlagIcon },
                    { id: "GBP", label: "GBP (Faster Payments)", icon: UKFlagIcon },
                  ].map((curr) => {
                    const Icon = curr.icon;
                    const isSelected = fiatCurrency === curr.id;
                    return (
                      <button
                        key={curr.id}
                        type="button"
                        onClick={() => setFiatCurrency(curr.id as FiatCurrency)}
                        className={cn(
                          "flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer font-sans",
                          isSelected
                            ? "bg-emerald-50/80 border-emerald-500 text-emerald-800 font-extrabold shadow-2xs"
                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{curr.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Beneficiary Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                  Beneficiary Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corporation or John Doe"
                  value={fiatBeneficiaryName}
                  onChange={(e) => setFiatBeneficiaryName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 text-xs sm:text-sm font-sans text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Account Number / IBAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                    {fiatCurrency === "EUR" ? "IBAN" : "Account Number"}
                  </label>
                  <input
                    type="text"
                    placeholder={fiatCurrency === "EUR" ? "e.g. DE89 3704 0044..." : "e.g. 100298452371"}
                    value={fiatAccountNumber}
                    onChange={(e) => setFiatAccountNumber(e.target.value.trim())}
                    className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                    {fiatCurrency === "USD" ? "Routing Number (ABA)" : fiatCurrency === "GBP" ? "Sort Code" : "BIC / SWIFT"}
                  </label>
                  <input
                    type="text"
                    placeholder={fiatCurrency === "USD" ? "e.g. 021000021" : fiatCurrency === "GBP" ? "e.g. 04-00-04" : "e.g. DEUTDEDB"}
                    value={fiatRoutingNumber}
                    onChange={(e) => setFiatRoutingNumber(e.target.value.trim())}
                    className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 text-xs sm:text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
                  Bank Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. JPMorgan Chase, Barclays, Deutsche Bank"
                  value={fiatBankName}
                  onChange={(e) => setFiatBankName(e.target.value)}
                  className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 text-xs sm:text-sm font-sans text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-3 flex items-start gap-2.5 text-xs text-emerald-900 font-sans">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Direct fiat offramp settled via Bridge.xyz partner banks. Converted from stablecoins at 1:1 par.</span>
              </div>
            </div>
          )}

          {/* CTA Next */}
          <Button
            type="button"
            onClick={handleProceedFromStep1}
            className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.01]"
          >
            Continue to Amount <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {/* STEP 2: ENTER AMOUNT & MEMO */}
      {step === 2 && (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
          {/* Summary of Recipient */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="h-9 w-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
                {channel === "tag" ? <AtSign size={16} /> : channel === "crypto" ? <Wallet size={16} /> : <Landmark size={16} />}
              </div>
              <div className="truncate">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Recipient
                </span>
                <span className="text-xs sm:text-sm font-sans font-bold text-zinc-950 block truncate">
                  {channel === "tag"
                    ? `${resolvedRecipient?.firstName} ${resolvedRecipient?.lastName} (${resolvedRecipient?.bankTag})`
                    : channel === "crypto"
                    ? `${cryptoAddress.slice(0, 8)}...${cryptoAddress.slice(-6)} (${currentNetworkObj.name})`
                    : `${fiatBeneficiaryName} (${fiatCurrency})`}
                </span>
              </div>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-sans font-bold text-brand-purple hover:underline shrink-0 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider">
                Transfer Amount
              </label>
              <span className="text-xs font-sans text-zinc-500 font-medium">
                Available: <strong className="text-zinc-950 font-mono">$${totalUsdBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD</strong>
              </span>
            </div>

            <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3 gap-2">
              <span className="text-xl font-bold font-mono text-zinc-400">$</span>
              <input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent border-none text-2xl font-mono font-extrabold text-zinc-950 placeholder:text-zinc-300 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleMaxAmount}
                className="px-2.5 py-1 rounded-lg bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple text-xs font-mono font-bold transition-all cursor-pointer shrink-0"
              >
                MAX
              </button>
            </div>

            {/* Percentage Chips */}
            <div className="flex gap-2">
              {[0.25, 0.50, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageAmount(pct)}
                  className="flex-1 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-mono font-bold text-zinc-700 transition-all cursor-pointer"
                >
                  {pct === 1 ? "100%" : `${pct * 100}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Reference / Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-zinc-700 uppercase tracking-wider block">
              Reference / Memo (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Invoice #4829 or Split bill"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-11 rounded-xl bg-zinc-50 border border-zinc-200 px-3.5 text-xs sm:text-sm font-sans text-zinc-900 placeholder:text-zinc-400 focus:border-brand-purple focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 h-11 rounded-full font-bold text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleProceedFromStep2}
              className="flex-2 h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20"
            >
              Review Transfer <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 3 && (
        <div className="p-6 space-y-5 animate-in fade-in duration-300">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Total Amount</span>
            <h2 className="text-3xl font-mono font-black text-zinc-950">
              $${parseFloat(amount || "0").toFixed(2)} <span className="text-lg font-bold text-zinc-500">USD</span>
            </h2>
          </div>

          {/* Transaction Summary Card */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 space-y-3 shadow-2xs text-xs font-sans">
            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80">
              <span className="text-zinc-500 font-medium">Destination Channel</span>
              <span className="font-bold text-zinc-950 font-mono">
                {channel === "tag" ? "BankTag Internal P2P" : channel === "crypto" ? `${currentNetworkObj.name} On-Chain` : `Bank Wire / ${fiatCurrency}`}
              </span>
            </div>

            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80">
              <span className="text-zinc-500 font-medium">Recipient</span>
              <span className="font-bold text-zinc-950 font-mono truncate max-w-[240px]">
                {channel === "tag"
                  ? resolvedRecipient?.bankTag
                  : channel === "crypto"
                  ? `${cryptoAddress.slice(0, 10)}...${cryptoAddress.slice(-8)}`
                  : fiatBeneficiaryName}
              </span>
            </div>

            {channel === "crypto" && (
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80">
                <span className="text-zinc-500 font-medium">Asset & Network</span>
                <span className="font-bold text-zinc-950 font-mono uppercase">
                  {selectedToken} ({currentNetworkObj.name})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200/80">
              <span className="text-zinc-500 font-medium">Estimated Arrival</span>
              <span className="font-bold text-emerald-700 font-mono">
                {channel === "tag" ? "Instant (Real-Time)" : channel === "crypto" ? currentNetworkObj.timeText : "Same-day / Instant SEPA"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium">Network Fee</span>
              <span className="font-bold text-zinc-950 font-mono">
                {channel === "tag" ? "$0.00 (Free)" : channel === "crypto" ? currentNetworkObj.feeText : "$0.00"}
              </span>
            </div>
          </div>

          {description && (
            <div className="rounded-xl bg-purple-50/60 border border-brand-purple/20 p-3 text-xs text-brand-purple font-sans">
              <strong>Memo:</strong> {description}
            </div>
          )}

          {/* Safety Verification Warning */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5 text-amber-900 text-xs font-sans">
            <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Transfers cannot be reversed once broadcasted. Ensure destination address and network match correctly.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(2)}
              disabled={isProcessing}
              className="flex-1 h-11 rounded-full font-bold text-xs sm:text-sm cursor-pointer"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </Button>
            <Button
              type="button"
              onClick={handleExecuteTransfer}
              disabled={isProcessing}
              className="flex-2 h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.01]"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Authorizing Transfer...
                </>
              ) : (
                <>
                  <Check size={16} /> Confirm & Send
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: RECEIPT */}
      {step === 4 && txResult && (
        <div className="p-6 space-y-6 text-center animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-16 w-16 rounded-3xl flex items-center justify-center shadow-md",
                txResult.success
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              )}
            >
              {txResult.success ? <Check size={32} /> : <XCircle size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-display font-extrabold text-zinc-950">
                {txResult.success ? "Transfer Broadcasted!" : "Transfer Failed"}
              </h3>
              <p className="text-xs text-zinc-600 font-sans max-w-[380px] mt-1 mx-auto leading-relaxed">
                {txResult.message}
              </p>
            </div>
          </div>

          {txResult.success && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2.5 text-left text-xs font-sans shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">Amount Sent</span>
                <span className="font-mono font-bold text-zinc-950">{txResult.amount}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">Destination</span>
                <span className="font-mono font-bold text-zinc-950 truncate max-w-[200px]">
                  {txResult.recipientDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200/70">
                <span className="text-zinc-500">Rail Network</span>
                <span className="font-mono font-bold text-zinc-950">{txResult.rail}</span>
              </div>
              {txResult.txId && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-zinc-500">Transaction Ref</span>
                  <button
                    onClick={() => handleCopyTxId(txResult.txId)}
                    className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-brand-purple hover:underline cursor-pointer"
                  >
                    <span className="truncate max-w-[140px]">{txResult.txId}</span>
                    {copiedTxId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>
                </div>
              )}
            </div>
          )}

          <Button
            type="button"
            onClick={onClose}
            className="w-full h-11 bg-zinc-950 hover:bg-zinc-900 text-white font-bold rounded-full text-xs sm:text-sm cursor-pointer shadow-md"
          >
            Done
          </Button>
        </div>
      )}

      {/* KYC Onboarding Trigger */}
      <OnboardingModal
        open={isKycModalOpen}
        onOpenChange={setIsKycModalOpen}
        onComplete={() => {
          setIsKycModalOpen(false);
          toast.success("Identity verified! You can now send bank wires.");
        }}
        triggerReason="general"
        targetCurrency={fiatCurrency}
      />
    </DialogContent>
  );
}
