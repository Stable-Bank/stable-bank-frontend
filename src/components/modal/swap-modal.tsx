"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transferService } from "@/services/transferService";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowDownUp,
  ArrowLeft,
  Loader2,
  Check,
  CheckCircle2,
  Clock,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Landmark,
  Wallet,
  Search,
  X,
} from "lucide-react";
import { TokenIcon } from "@web3icons/react/dynamic";
import {
  USFlagIcon,
  UKFlagIcon,
  EUFlagIcon,
  BRFlagIcon,
  MXFlagIcon,
  COFlagIcon,
} from "@/components/ui/flag-icons";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

interface SwapModalProps {
  balance: any;
  onSuccess: () => void;
  onClose: () => void;
}

export type AssetType = "crypto" | "fiat";

export interface SwapAsset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  decimals: number;
  rail: string;
  flagComponent?: React.ComponentType<{ className?: string }>;
}

const SUPPORTED_ASSETS: SwapAsset[] = [
  // Stablecoins
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    type: "crypto",
    decimals: 6,
    rail: "bridge_wallet",
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether USD",
    type: "crypto",
    decimals: 6,
    rail: "bridge_wallet",
  },
  {
    id: "usdb",
    symbol: "USDB",
    name: "Yield USD",
    type: "crypto",
    decimals: 6,
    rail: "bridge_wallet",
  },
  {
    id: "eurc",
    symbol: "EURC",
    name: "Euro Coin",
    type: "crypto",
    decimals: 6,
    rail: "bridge_wallet",
  },
  {
    id: "pyusd",
    symbol: "PYUSD",
    name: "PayPal USD",
    type: "crypto",
    decimals: 6,
    rail: "bridge_wallet",
  },
  // Fiat rails supported by Bridge
  {
    id: "eur",
    symbol: "EUR",
    name: "Euro (SEPA Instant)",
    type: "fiat",
    decimals: 2,
    rail: "sepa",
    flagComponent: EUFlagIcon,
  },
  {
    id: "usd",
    symbol: "USD",
    name: "US Dollar (ACH/Wire)",
    type: "fiat",
    decimals: 2,
    rail: "ach",
    flagComponent: USFlagIcon,
  },
  {
    id: "gbp",
    symbol: "GBP",
    name: "British Pound (Faster Payments)",
    type: "fiat",
    decimals: 2,
    rail: "faster_payments",
    flagComponent: UKFlagIcon,
  },
  {
    id: "mxn",
    symbol: "MXN",
    name: "Mexican Peso (SPEI)",
    type: "fiat",
    decimals: 2,
    rail: "spei",
    flagComponent: MXFlagIcon,
  },
  {
    id: "brl",
    symbol: "BRL",
    name: "Brazilian Real (Pix)",
    type: "fiat",
    decimals: 2,
    rail: "pix",
    flagComponent: BRFlagIcon,
  },
  {
    id: "cop",
    symbol: "COP",
    name: "Colombian Peso (Bre-B)",
    type: "fiat",
    decimals: 2,
    rail: "bre_b",
    flagComponent: COFlagIcon,
  },
];

export default function SwapModal({ balance, onSuccess, onClose }: SwapModalProps) {
  const { user } = useAuth();

  // Step flow: 1 = Configure Swap, 2 = Review & Confirm, 3 = Success Receipt
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Asset selection state
  const [payAsset, setPayAsset] = useState<SwapAsset>(SUPPORTED_ASSETS[0]); // default USDC
  const [receiveAsset, setReceiveAsset] = useState<SwapAsset>(SUPPORTED_ASSETS[5]); // default EUR (SEPA)

  // Dedicated in-modal Asset Selector state (eliminates dropdown clipping completely)
  const [selectingAssetFor, setSelectingAssetFor] = useState<"pay" | "receive" | null>(null);
  const [assetSearchQuery, setAssetSearchQuery] = useState("");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState<"all" | "crypto" | "fiat">("all");

  // Amount & Quote State
  const [payAmount, setPayAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<string>("");
  const [exchangeRate, setExchangeRate] = useState<number>(0.9248);
  const [inverseRate, setInverseRate] = useState<number>(1.0813);
  const [showInverseRate, setShowInverseRate] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [swapResult, setSwapResult] = useState<any>(null);

  // UX details accordion
  const [showDetails, setShowDetails] = useState(false);
  const [quoteCountdown, setQuoteCountdown] = useState<number>(30);

  // User available balances map
  const availableBalances = useMemo(() => {
    const map: Record<string, number> = {
      usdc: 0,
      usdt: 0,
      usdb: 0,
      eurc: 0,
      pyusd: 0,
      usd: 0,
      eur: 0,
      gbp: 0,
      mxn: 0,
      brl: 0,
      cop: 0,
    };

    if (balance?.chains && Array.isArray(balance.chains)) {
      balance.chains.forEach((chain: any) => {
        chain.tokens?.forEach((tok: any) => {
          const sym = (tok.symbol || "").toLowerCase();
          if (map[sym] !== undefined) {
            map[sym] += parseFloat(tok.balance) || 0;
          }
        });
      });
    }

    // If totalUSD exists and USDC is 0, give fallback spendable estimation
    if (map.usdc === 0 && balance?.totalUSD) {
      map.usdc = Number(balance.totalUSD);
    }

    return map;
  }, [balance]);

  const maxAvailablePay = useMemo(() => {
    return availableBalances[payAsset.id] || 0;
  }, [availableBalances, payAsset.id]);

  // Filtered assets for selector view
  const filteredAssets = useMemo(() => {
    return SUPPORTED_ASSETS.filter((asset) => {
      if (assetCategoryFilter !== "all" && asset.type !== assetCategoryFilter) {
        return false;
      }
      if (!assetSearchQuery.trim()) return true;
      const q = assetSearchQuery.toLowerCase();
      return (
        asset.symbol.toLowerCase().includes(q) ||
        asset.name.toLowerCase().includes(q) ||
        asset.rail.toLowerCase().includes(q)
      );
    });
  }, [assetCategoryFilter, assetSearchQuery]);

  // Fetch live exchange rate quote
  const fetchQuote = useCallback(
    async (amountToQuote: string, isFixedOut = false) => {
      const num = parseFloat(amountToQuote);
      if (!num || num <= 0) {
        setReceiveAmount("");
        setQuoteDetails(null);
        return;
      }

      setIsQuoteLoading(true);
      try {
        const res = await transferService.getSwapQuote({
          sourceCurrency: payAsset.id,
          sourceRail: payAsset.rail,
          destinationCurrency: receiveAsset.id,
          destinationRail: receiveAsset.rail,
          amount: amountToQuote,
          fixedOutput: isFixedOut,
        });

        if (res && res.data) {
          const data = res.data;
          setQuoteDetails(data);
          const rate = parseFloat(data.exchangeRate) || 1.0;
          setExchangeRate(rate);
          setInverseRate(rate > 0 ? 1 / rate : 1.0);

          if (isFixedOut) {
            setPayAmount(parseFloat(data.sourceAmount).toFixed(payAsset.decimals));
          } else {
            setReceiveAmount(parseFloat(data.destinationAmount).toFixed(receiveAsset.decimals));
          }
          setQuoteCountdown(30);
        }
      } catch {
        // Fallback calculation using local rate if offline or mock
        const fallbackRate = payAsset.id === receiveAsset.id ? 1.0 : 0.9248;
        setExchangeRate(fallbackRate);
        setInverseRate(fallbackRate > 0 ? 1 / fallbackRate : 1.0);
        if (!isFixedOut) {
          setReceiveAmount((num * fallbackRate).toFixed(receiveAsset.decimals));
        }
      } finally {
        setIsQuoteLoading(false);
      }
    },
    [payAsset, receiveAsset]
  );

  // Debounced input watcher for Doherty Threshold (<400ms feedback)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (payAmount && parseFloat(payAmount) > 0) {
        fetchQuote(payAmount, false);
      } else {
        setReceiveAmount("");
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [payAmount, fetchQuote]);

  // 30s auto-refresh countdown for quote freshness
  useEffect(() => {
    if (step !== 1 || !payAmount || parseFloat(payAmount) <= 0) return;

    const interval = setInterval(() => {
      setQuoteCountdown((prev) => {
        if (prev <= 1) {
          fetchQuote(payAmount, false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, payAmount, fetchQuote]);

  // Flip pay and receive assets (Jakob's Law familiar interaction)
  const handleInvertAssets = () => {
    const tempAsset = payAsset;
    setPayAsset(receiveAsset);
    setReceiveAsset(tempAsset);

    // Swap amounts and invert rate
    const currentPay = payAmount;
    const currentRec = receiveAmount;
    setPayAmount(currentRec);
    setReceiveAmount(currentPay);
  };

  // Quick preset percentage fill (Hick's Law)
  const handlePercentageSelect = (pct: number) => {
    if (maxAvailablePay <= 0) {
      toast.info(`No ${payAsset.symbol} balance available.`);
      return;
    }
    const val = (maxAvailablePay * pct).toFixed(payAsset.decimals > 2 ? 4 : 2);
    setPayAmount(val);
  };

  // Validation logic (Postel's Law - proactive prevention)
  const validation = useMemo(() => {
    const num = parseFloat(payAmount);
    if (!payAmount || isNaN(num) || num <= 0) {
      return { isValid: false, message: "Enter an amount" };
    }
    if (num < 1.0) {
      return { isValid: false, message: "Minimum swap amount is 1.00" };
    }
    if (payAsset.type === "crypto" && num > maxAvailablePay) {
      return {
        isValid: false,
        message: `Insufficient ${payAsset.symbol} balance (${maxAvailablePay.toFixed(2)} available)`,
        isInsufficient: true,
      };
    }
    return { isValid: true, message: "Preview Swap" };
  }, [payAmount, maxAvailablePay, payAsset.symbol, payAsset.type]);

  // Execute Swap via Bridge API
  const handleExecuteSwap = async () => {
    setIsSwapping(true);
    try {
      const payload: any = {
        sourceCurrency: payAsset.id,
        sourceRail: payAsset.rail,
        destinationCurrency: receiveAsset.id,
        destinationRail: receiveAsset.rail,
        amount: payAmount,
        fixedOutput: false,
      };

      // If user has primary onchain wallet, attach toAddress for crypto destinations
      if (receiveAsset.type === "crypto" && user?.primaryWalletAddress) {
        payload.toAddress = user.primaryWalletAddress;
      }

      const res = await transferService.executeSwap(payload);

      if (res && res.data) {
        setSwapResult(res.data);
        setStep(3); // Go to success receipt
        toast.success("Swap executed successfully!");
        onSuccess();
      } else {
        throw new Error("Invalid response from swap engine");
      }
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to execute swap";
      toast.error(errMsg);
    } finally {
      setIsSwapping(false);
    }
  };

  // Render Asset Icon (Token or Flag)
  const renderAssetIcon = (asset: SwapAsset, size = "w-6 h-6") => {
    if (asset.flagComponent) {
      const FlagComp = asset.flagComponent;
      return <FlagComp className={size} />;
    }
    return (
      <div className={cn("rounded-full flex items-center justify-center bg-zinc-100 overflow-hidden", size)}>
        <TokenIcon symbol={asset.symbol} size={24} variant="branded" />
      </div>
    );
  };

  return (
    <DialogContent
      className="max-w-md w-full p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl transition-all duration-300"
      showCloseButton={step !== 2 && selectingAssetFor === null}
    >
      <DialogHeader className="px-6 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-sans font-bold text-zinc-900 dark:text-white">
                {selectingAssetFor !== null
                  ? selectingAssetFor === "pay"
                    ? "Select Pay Asset"
                    : "Select Receive Asset"
                  : step === 1
                  ? "Swap Assets"
                  : step === 2
                  ? "Review Swap"
                  : "Swap Confirmed"}
              </DialogTitle>
              <p className="text-xs text-zinc-500 font-sans">
                {selectingAssetFor !== null
                  ? "Choose stablecoins or fiat payout rails"
                  : step === 1
                  ? "Bridge liquidity • Zero slippage on stables"
                  : step === 2
                  ? "Double check transaction details"
                  : "Funds settled via Bridge Orchestration"}
              </p>
            </div>
          </div>

          {step === 1 && selectingAssetFor === null && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
              <Clock className="w-3 h-3 text-brand-purple" />
              <span>{quoteCountdown}s</span>
            </div>
          )}
        </div>
      </DialogHeader>

      {/* UNCLIPPED ASSET SELECTOR VIEW (Uniswap / Revolut Pattern) */}
      {selectingAssetFor !== null ? (
        <div className="p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                setSelectingAssetFor(null);
                setAssetSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-sans font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Swap</span>
            </button>

            <span className="text-[11px] font-mono text-zinc-400">
              {filteredAssets.length} asset{filteredAssets.length === 1 ? "" : "s"} available
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={assetSearchQuery}
              onChange={(e) => setAssetSearchQuery(e.target.value)}
              placeholder="Search name, symbol, or rail (e.g. EUR, USDC, SPEI)..."
              autoFocus
              className="w-full h-11 pl-10 pr-9 rounded-xl bg-zinc-100/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-sans text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/10 transition-all"
            />
            {assetSearchQuery && (
              <button
                type="button"
                onClick={() => setAssetSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All Assets" },
              { id: "crypto", label: "Stablecoins" },
              { id: "fiat", label: "Fiat Rails" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAssetCategoryFilter(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all cursor-pointer",
                  assetCategoryFilter === tab.id
                    ? "bg-brand-purple text-white font-bold shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Asset List Container (Unclipped, smooth internal scroll) */}
          <div className="max-h-[340px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-zinc-100 dark:divide-zinc-850">
            {filteredAssets.length === 0 ? (
              <div className="text-center py-10 text-xs text-zinc-400">
                No assets matching &quot;{assetSearchQuery}&quot;
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const isCurrentSelected =
                  (selectingAssetFor === "pay" ? payAsset.id : receiveAsset.id) === asset.id;
                const assetBal = availableBalances[asset.id] || 0;

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      if (selectingAssetFor === "pay") {
                        if (asset.id === receiveAsset.id) {
                          handleInvertAssets();
                        } else {
                          setPayAsset(asset);
                        }
                      } else {
                        if (asset.id === payAsset.id) {
                          handleInvertAssets();
                        } else {
                          setReceiveAsset(asset);
                        }
                      }
                      setSelectingAssetFor(null);
                      setAssetSearchQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer group pt-2.5",
                      isCurrentSelected
                        ? "bg-brand-purple/10 border border-brand-purple/30 text-brand-purple"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {renderAssetIcon(asset, "w-8 h-8")}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-sans font-bold text-zinc-900 dark:text-white">
                            {asset.symbol}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 uppercase font-semibold">
                            {asset.rail}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 font-sans">{asset.name}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-medium text-zinc-900 dark:text-white">
                          {assetBal.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}
                        </div>
                        <div className="text-[10px] text-zinc-400">Available</div>
                      </div>
                      {isCurrentSelected && <Check className="w-4 h-4 text-brand-purple shrink-0" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* STEP 1: CONFIGURE SWAP */
        step === 1 && (
          <div className="p-6 space-y-4">
            {/* Card: YOU PAY */}
            <div className="rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 p-4 transition-all focus-within:border-brand-purple focus-within:ring-2 focus-within:ring-brand-purple/10">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">You Pay</span>
                <div className="flex items-center gap-1.5">
                  <span>Avail:</span>
                  <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {maxAvailablePay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}{" "}
                    {payAsset.symbol}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePercentageSelect(1)}
                    className="ml-1 text-[10px] font-bold text-brand-purple hover:underline uppercase cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  inputMode="decimal"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-zinc-900 dark:text-white placeholder:text-zinc-300 dark:placeholder:text-zinc-700 outline-none"
                />

                {/* Asset Selector Trigger Button (Opens Unclipped Picker) */}
                <button
                  type="button"
                  onClick={() => {
                    setAssetSearchQuery("");
                    setSelectingAssetFor("pay");
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-brand-purple hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {renderAssetIcon(payAsset)}
                  <span className="text-sm font-sans font-bold text-zinc-900 dark:text-white">
                    {payAsset.symbol}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Quick Percentage Chips */}
              <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-zinc-200/50 dark:border-zinc-800/60">
                {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePercentageSelect(pct)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] font-mono font-medium text-zinc-600 dark:text-zinc-300 hover:border-brand-purple hover:text-brand-purple transition-all cursor-pointer"
                  >
                    {pct === 1.0 ? "MAX" : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* FLIP / SWITCH BUTTON (Fitts's Law 44px+ hit area) */}
            <div className="relative flex justify-center -my-2 z-10">
              <button
                type="button"
                onClick={handleInvertAssets}
                className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:border-brand-purple hover:text-brand-purple hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                title="Switch swap direction"
              >
                <ArrowDownUp className="w-4 h-4" />
              </button>
            </div>

            {/* Card: YOU RECEIVE */}
            <div className="rounded-2xl bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 p-4 transition-all">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-sans mb-2">
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  You Receive (Estimated)
                </span>
                <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                  {receiveAsset.type === "crypto" ? (
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-emerald-600" /> Primary Wallet
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-blue-600" /> Bank Payout ({receiveAsset.rail.toUpperCase()})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isQuoteLoading ? (
                    <div className="flex items-center gap-2 text-zinc-400">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-purple" />
                      <span className="text-xl font-mono">Calculating...</span>
                    </div>
                  ) : (
                    <input
                      type="text"
                      readOnly
                      value={receiveAmount || "0.00"}
                      placeholder="0.00"
                      className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400 outline-none"
                    />
                  )}
                </div>

                {/* Receive Asset Selector Trigger Button */}
                <button
                  type="button"
                  onClick={() => {
                    setAssetSearchQuery("");
                    setSelectingAssetFor("receive");
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-brand-purple hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {renderAssetIcon(receiveAsset)}
                  <span className="text-sm font-sans font-bold text-zinc-900 dark:text-white">
                    {receiveAsset.symbol}
                  </span>
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* LIVE EXCHANGE RATE BAR (Doherty Threshold & Jakob's Law) */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 text-xs">
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-mono">
                <span className="font-semibold">Rate:</span>
                <button
                  type="button"
                  onClick={() => setShowInverseRate(!showInverseRate)}
                  className="flex items-center gap-1 hover:text-brand-purple transition-colors cursor-pointer"
                  title="Click to view inverse rate"
                >
                  {!showInverseRate ? (
                    <span>
                      1 {payAsset.symbol} ≈ {exchangeRate.toFixed(4)} {receiveAsset.symbol}
                    </span>
                  ) : (
                    <span>
                      1 {receiveAsset.symbol} ≈ {inverseRate.toFixed(4)} {payAsset.symbol}
                    </span>
                  )}
                  <RefreshCw className="w-3 h-3 text-zinc-400 ml-1" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-[11px] font-sans font-semibold text-brand-purple hover:underline cursor-pointer"
              >
                {showDetails ? "Hide details" : "View route"}
              </button>
            </div>

            {/* EXPANDABLE TRANSACTION DETAILS (Tesler's Law) */}
            {showDetails && (
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-2 text-xs font-sans animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Network / Gas Fee</span>
                  <span className="font-mono text-emerald-600 font-semibold">$0.00 (Sponsored)</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Bridge Liquidity Fee</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-white">0.00%</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Estimated Speed</span>
                  <span className="font-mono font-medium text-zinc-900 dark:text-white">
                    {quoteDetails?.estimatedTime || "Instant (< 2 mins)"}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Route Rail</span>
                  <span className="font-mono text-zinc-900 dark:text-white uppercase">
                    {payAsset.rail} → {receiveAsset.rail}
                  </span>
                </div>
              </div>
            )}

            {/* PRIMARY CTA (Von Restorff Effect & Postel's Law) */}
            <Button
              type="button"
              disabled={!validation.isValid || isQuoteLoading}
              onClick={() => setStep(2)}
              className={cn(
                "w-full h-12 rounded-xl text-sm font-sans font-bold transition-all shadow-md active:scale-98 cursor-pointer",
                validation.isValid
                  ? "bg-brand-purple hover:bg-brand-purple/90 text-white shadow-brand-purple/20"
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
              )}
            >
              {validation.message}
            </Button>
          </div>
        )
      )}

      {/* STEP 2: REVIEW & CONFIRM */}
      {step === 2 && selectingAssetFor === null && (
        <div className="p-6 space-y-5">
          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="text-xs text-zinc-500">You Pay</div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-zinc-900 dark:text-white">
                  {payAmount} {payAsset.symbol}
                </div>
                <div className="text-[11px] text-zinc-400">{payAsset.name}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/80 dark:border-zinc-800">
              <div className="text-xs text-zinc-500">You Receive</div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {receiveAmount} {receiveAsset.symbol}
                </div>
                <div className="text-[11px] text-zinc-400">{receiveAsset.name}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 pt-1">
              <div className="flex justify-between">
                <span>Exchange Rate</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-white">
                  1 {payAsset.symbol} = {exchangeRate.toFixed(4)} {receiveAsset.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Speed</span>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {quoteDetails?.estimatedTime || "Instant (< 2 mins)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Fees</span>
                <span className="font-mono text-emerald-600 font-bold">$0.00</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <span>Bridge provides institutional-grade execution with automated AML/travel rule safety.</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSwapping}
              onClick={() => setStep(1)}
              className="w-1/3 h-12 rounded-xl text-xs font-sans font-semibold border-zinc-200 dark:border-zinc-700 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            <Button
              type="button"
              disabled={isSwapping}
              onClick={handleExecuteSwap}
              className="w-2/3 h-12 rounded-xl text-sm font-sans font-bold bg-brand-purple hover:bg-brand-purple/90 text-white shadow-lg shadow-brand-purple/20 transition-all cursor-pointer"
            >
              {isSwapping ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Swapping...</span>
                </div>
              ) : (
                "Confirm Swap"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS CONFIRMATION (Peak-End Rule) */}
      {step === 3 && selectingAssetFor === null && (
        <div className="p-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-9 h-9 animate-in zoom-in-50 duration-300" />
          </div>

          <div>
            <h3 className="text-xl font-sans font-bold text-zinc-900 dark:text-white">
              Swap Successful!
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Your conversion has been processed via Bridge Orchestration.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-4 space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-zinc-500">Amount Sent:</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-white">
                {payAmount} {payAsset.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Amount Received:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {receiveAmount} {receiveAsset.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 uppercase text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {swapResult?.state || "Settled"}
              </span>
            </div>
            {swapResult?.bridgeTransferId && (
              <div className="flex justify-between pt-1 border-t border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500">Reference:</span>
                <span className="font-mono text-zinc-500 text-[11px]">
                  {swapResult.bridgeTransferId.slice(0, 16)}...
                </span>
              </div>
            )}
          </div>

          {swapResult?.receipt?.url && (
            <a
              href={swapResult.receipt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-purple hover:underline"
            >
              <span>View Bridge Receipt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <Button
            type="button"
            onClick={onClose}
            className="w-full h-12 rounded-xl text-sm font-sans font-bold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all cursor-pointer"
          >
            Done
          </Button>
        </div>
      )}
    </DialogContent>
  );
}
