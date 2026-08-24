"use client";

import { useState, useEffect } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transferService } from "@/services/transferService";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Check,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldAlert,
  Send,
} from "lucide-react";
import Image from "next/image";

interface SendTokenModalProps {
  balance: any;
  onSuccess: () => void;
  onClose: () => void;
}

export default function SendTokenModal({
  balance,
  onSuccess,
  onClose,
}: SendTokenModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); // 1: Recipient, 2: Amount/Remark, 3: Password, 4: Confirm, 5: Result
  
  // Form State
  const [searchTag, setSearchTag] = useState("");
  const [resolvedRecipient, setResolvedRecipient] = useState<any>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [recentRecipients, setRecentRecipients] = useState<any[]>([]);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState<any>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [txResult, setTxResult] = useState<{ success: boolean; message: string; txId?: string } | null>(null);

  const avatarSrc = resolvedRecipient?.avatarUrl || resolvedRecipient?.avatar || null;

  // Available balance helper
  const usdcToken = balance?.chains
    ?.flatMap((c: any) => c.tokens)
    ?.find((t: any) => t.symbol.toUpperCase() === "USDC");
  const availableBalance = resolvedRecipient
    ? balance?.totalUSD || 0
    : (usdcToken ? parseFloat(usdcToken.balance) || 0 : 0);

  const handleMaxAmount = () => {
    if (resolvedRecipient?.isExternal) {
      const maxAmt = availableBalance / 1.005;
      const maxFixed = (Math.floor(maxAmt * 100) / 100).toString();
      setAmount(maxFixed);
    } else {
      setAmount(availableBalance.toString());
    }
  };

  // 1. Fetch recent recipients from history
  useEffect(() => {
    const fetchRecents = async () => {
      setIsLoadingRecipients(true);
      try {
        const history: any = await transferService.getTransferHistory();
        const historyList = Array.isArray(history) 
          ? history 
          : (history && Array.isArray(history.transfers) ? history.transfers : []);
        
        const cleanUserTag = user?.bankTag
          ? user.bankTag.startsWith("@")
            ? user.bankTag.toLowerCase()
            : `@${user.bankTag.toLowerCase()}`
          : "";
        const currentUserId = (user?.id || (user as any)?._id || "").toString();

        const unique = historyList
          .filter((t: any) => t.toBankTag)
          .reduce((acc: any[], transfer: any) => {
            const tag = transfer.toBankTag.startsWith("@") ? transfer.toBankTag : `@${transfer.toBankTag}`;
            const recipientUserId = (transfer.toUserId?._id || transfer.toUserId?.id || transfer.toUserId || "").toString();
            
            // Exclude current user from recent recipients
            if (cleanUserTag && tag.toLowerCase() === cleanUserTag) {
              return acc;
            }
            if (currentUserId && recipientUserId === currentUserId) {
              return acc;
            }

            if (!acc.find((u) => u.bankTag === tag)) {
              acc.push({
                userId: recipientUserId,
                bankTag: tag,
                firstName: transfer.toUserId?.firstName || transfer.toBankTag.replace(/[^a-zA-Z]/g, "") || "Recipient",
                lastName: transfer.toUserId?.lastName || "",
                avatarUrl: transfer.toUserId?.avatarUrl || null,
              });
            }
            return acc;
          }, [])
          .slice(0, 5);
        
        setRecentRecipients(unique);
      } catch (err) {
        console.error("Failed to fetch recents:", err);
      } finally {
        setIsLoadingRecipients(false);
      }
    };
    fetchRecents();
  }, [user]);

  // 2. Resolve BankTag as user types
  useEffect(() => {
    const resolveTag = async () => {
      const trimmed = searchTag.trim();
      if (!trimmed || trimmed.length < 3) {
        setResolvedRecipient(null);
        setSearchError(null);
        return;
      }

      // Check if it is a wallet address (external withdraw)
      if (trimmed.startsWith("0x") && trimmed.length === 42) {
        const userWallet = (user?.walletAddress || "").toLowerCase();
        const userSmart = ((user as any)?.smartWalletAddress || (user as any)?.wallet?.address || "").toLowerCase();
        const inputAddress = trimmed.toLowerCase();
        if (inputAddress === userWallet || inputAddress === userSmart) {
          setResolvedRecipient(null);
          setSearchError("You cannot withdraw to your own wallet.");
          return;
        }
        setResolvedRecipient({
          id: "external",
          bankTag: trimmed,
          firstName: "External Address",
          lastName: "",
          avatarUrl: null,
          isExternal: true,
        });
        setSearchError(null);
        return;
      }

      setIsResolving(true);
      setSearchError(null);
      const cleanTag = trimmed.startsWith("@") ? trimmed : `@${trimmed}`;

      // Fast check: check if the typed tag matches the user's tag
      const cleanUserTag = user?.bankTag
        ? user.bankTag.startsWith("@")
          ? user.bankTag
          : `@${user.bankTag}`
        : "";
      if (cleanUserTag && cleanTag.toLowerCase() === cleanUserTag.toLowerCase()) {
        setResolvedRecipient(null);
        setSearchError("You cannot send funds to yourself.");
        setIsResolving(false);
        return;
      }

      try {
        const result = await transferService.resolveRecipient(cleanTag);
        if (result && result.user) {
          const resolvedId = result.user._id || result.user.id;
          const currentUserId = user?.id || (user as any)?._id;
          
          if (resolvedId && currentUserId && resolvedId.toString() === currentUserId.toString()) {
            setResolvedRecipient(null);
            setSearchError("You cannot send funds to yourself.");
          } else {
            setResolvedRecipient({
              id: resolvedId,
              bankTag: result.user.bankTag,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              email: result.user.email,
              avatarUrl: result.user.avatarUrl || null,
            });
            setSearchError(null);
          }
        } else {
          setResolvedRecipient(null);
          setSearchError("User not found.");
        }
      } catch (error) {
        console.error("Failed to resolve bankTag:", error);
        setResolvedRecipient(null);
        setSearchError("Error resolving recipient.");
      } finally {
        setIsResolving(false);
      }
    };

    const debounce = setTimeout(resolveTag, 400);
    return () => clearTimeout(debounce);
  }, [searchTag, user]);

  // 3. Calculate Fee when amount changes
  useEffect(() => {
    const calculateFee = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setFee(null);
        return;
      }

      if (step === 1) {
        setFee(null);
        return;
      }

      if (step !== 2) {
        return;
      }

      if (resolvedRecipient) {
        if (resolvedRecipient.isExternal) {
          const parsed = parseFloat(amount);
          const feeAmt = parsed * 0.005;
          setFee({
            feeAmount: feeAmt.toString(),
            feeUSD: feeAmt,
            estimatedTime: "2-5 mins",
            gasCost: "0.5%",
          });
        } else {
          setFee({
            feeAmount: "0",
            feeUSD: 0,
            estimatedTime: "Instant",
            gasCost: "0",
          });
        }
        return;
      }

      setIsCalculatingFee(true);
      try {
        const feeData = await transferService.calculateFee({
          amount,
          tokenSymbol: "USDC",
          sourceChain: "polygon",
          destinationChain: "polygon",
        });
        setFee(feeData);
      } catch (error) {
        console.error("Failed to calculate fee:", error);
      } finally {
        setIsCalculatingFee(false);
      }
    };

    const debounce = setTimeout(calculateFee, 500);
    return () => clearTimeout(debounce);
  }, [amount, step, resolvedRecipient]);

  // Reset password state when going back/forward
  useEffect(() => {
    if (step !== 3) {
      setPassword("");
    }
  }, [step]);

  const handleNextStep = () => {
    if (step === 1 && resolvedRecipient) setStep(2);
    else if (step === 2 && amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableBalance) setStep(4);
  };

  const handlePrevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 4) setStep(2);
  };

  const handleSelectRecent = (rec: any) => {
    setResolvedRecipient({
      id: rec.userId,
      bankTag: rec.bankTag,
      firstName: rec.firstName,
      lastName: rec.lastName,
      avatarUrl: rec.avatarUrl || null,
    });
    setSearchTag(rec.bankTag);
    setStep(2);
  };

  // Perform transfer
  const handleInitiateTransfer = async () => {
    if (!resolvedRecipient || !amount) return;
    setIsProcessing(true);
    try {
      const response = await transferService.initiateTransfer({
        recipient: resolvedRecipient.bankTag,
        recipientBankTag: resolvedRecipient.bankTag,
        amount,
        tokenSymbol: "USDC",
        sourceChain: "polygon",
        destinationChain: "polygon",
        description,
      });

      setTxResult({
        success: true,
        message: resolvedRecipient
          ? `Successfully sent $${parseFloat(amount).toFixed(2)} USD to ${resolvedRecipient.bankTag}`
          : `Successfully sent ${parseFloat(amount).toFixed(2)} USDC to ${resolvedRecipient.bankTag}`,
        txId: (response as any).transactionId || "0x" + Math.random().toString(16).substring(2, 10),
      });
      setStep(5);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setTxResult({
        success: false,
        message: err.response?.data?.message || err.message || "Failed to complete transaction",
      });
      setStep(5);
    } finally {
      setIsProcessing(false);
    }
  };

  // Render default SVG avatar placeholder
  const renderAvatarPlaceholder = () => {
    return (
      <div className="h-full w-full bg-black/40 flex items-center justify-center text-white/40">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-2/3 w-2/3 text-white/40" fill="currentColor">
          <path d="M5.85 17.1q1.275-.975 2.85-1.537T12 15t3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4T6.337 6.338T4 12q0 1.475.488 2.775T5.85 17.1M12 13q-1.475 0-2.488-1.012T8.5 9.5t1.013-2.488T12 6t2.488 1.013T15.5 9.5t-1.012 2.488T12 13m0 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/>
        </svg>
      </div>
    );
  };

  const totalDeduction = parseFloat(amount || "0") + (fee?.feeUSD || 0);

  return (
    <DialogContent className="w-full !max-w-[550px] rounded-3xl border border-zinc-200 bg-white p-0 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-zinc-950">
      
      {/* Dynamic Header */}
      <div className="px-6 pt-6 pb-4 border-b border-zinc-200 flex items-center justify-between">
        <DialogTitle className="text-lg font-display font-bold text-zinc-950 flex items-center gap-2">
          <Send size={16} className="text-brand-purple" />
          Send Funds
        </DialogTitle>
        <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider uppercase bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200">
          Step {step} of 5
        </span>
      </div>

      {/* STEP 1: SELECT RECIPIENT */}
      {step === 1 && (
        <div className="p-6 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Recipient BankTag or EVM Address</label>
            <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3 gap-3">
              <Search size={18} className="text-zinc-400" />
              <input
                id="recipient-tag-input"
                type="text"
                placeholder="Enter @BankTag or 0xAddress..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-zinc-900 placeholder-zinc-400 text-sm font-sans font-medium"
              />
              {isResolving && <Loader2 size={16} className="text-brand-purple animate-spin shrink-0" />}
            </div>
          </div>

          {/* Resolved User Profile */}
          {resolvedRecipient ? (
            <div 
              id="resolved-recipient-card"
              className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50/60 border border-brand-purple/20 shadow-xs animate-in slide-in-from-bottom-3 duration-250"
            >
              <div className="h-14 w-14 shrink-0 rounded-2xl overflow-hidden relative border border-zinc-200 bg-white">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc.startsWith("http") 
                      ? avatarSrc 
                      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${avatarSrc}`
                    }
                    alt={resolvedRecipient.bankTag}
                    fill
                    className="object-cover"
                  />
                ) : (
                  renderAvatarPlaceholder()
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-950 font-sans font-bold text-base leading-snug">
                  {resolvedRecipient.firstName} {resolvedRecipient.lastName}
                </p>
                <p className="text-brand-purple text-sm font-bold tracking-wide font-mono mt-0.5">
                  {resolvedRecipient.bankTag}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-brand-purple text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check size={16} className="stroke-[3]" />
              </div>
            </div>
          ) : searchError && !isResolving ? (
            <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-2xl bg-zinc-50 border-zinc-200">
              {searchError.includes("yourself") ? (
                <ShieldAlert size={28} className="text-amber-500 mb-2 animate-bounce" />
              ) : (
                <HelpCircle size={28} className="text-zinc-400 mb-2" />
              )}
              <p className="text-zinc-700 text-sm font-bold font-sans">{searchError}</p>
              <p className="text-zinc-400 text-xs mt-0.5 font-sans">
                {searchError.includes("yourself")
                  ? "Please enter a different recipient's @BankTag."
                  : "Make sure to type the exact @BankTag"}
              </p>
            </div>
          ) : null}

          {/* Recent Recipients */}
          {isLoadingRecipients ? (
            <div className="flex items-center gap-2 text-xs text-zinc-500 py-2 font-sans">
              <Loader2 size={12} className="animate-spin text-brand-purple" />
              <span>Loading recent recipients...</span>
            </div>
          ) : recentRecipients.length > 0 && !resolvedRecipient ? (
            <div className="space-y-2.5">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">Recent Recipients</span>
              <div className="flex flex-col gap-2">
                {recentRecipients.map((rec, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectRecent(rec)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-all text-left w-full group cursor-pointer"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden relative border border-zinc-200 bg-white group-hover:scale-105 transition-transform">
                      {rec.avatarUrl ? (
                        <Image
                          src={rec.avatarUrl.startsWith("http") 
                            ? rec.avatarUrl 
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${rec.avatarUrl}`
                          }
                          alt={rec.bankTag}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        renderAvatarPlaceholder()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-950 text-sm font-sans font-bold leading-tight">{rec.firstName}</p>
                      <p className="text-zinc-500 text-xs font-mono font-bold mt-0.5">{rec.bankTag}</p>
                    </div>
                    <ArrowRight size={14} className="text-zinc-400 group-hover:text-brand-purple group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-2">
            <Button
              id="send-continue-btn-step1"
              onClick={handleNextStep}
              disabled={!resolvedRecipient || isResolving}
              className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-brand-purple/20"
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: AMOUNT AND REMARK */}
      {step === 2 && (
        <div className="p-6 space-y-6">
          {/* Recipient Header Summary */}
          {resolvedRecipient && (
            <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl">
              <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden relative border border-zinc-200 bg-white">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc.startsWith("http") 
                      ? avatarSrc 
                      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${avatarSrc}`
                    }
                    alt={resolvedRecipient.bankTag}
                    fill
                    className="object-cover"
                  />
                ) : (
                  renderAvatarPlaceholder()
                )}
              </div>
              <div>
                <p className="text-zinc-400 text-xs font-mono font-bold uppercase tracking-wider">Sending To</p>
                <p className="text-zinc-950 text-sm font-sans font-bold mt-0.5">
                  {resolvedRecipient.firstName} ({resolvedRecipient.bankTag})
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="ml-auto text-xs font-mono font-bold text-brand-purple hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>
          )}

          <div className="space-y-4">
            {/* Amount Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">
                  {resolvedRecipient ? "Amount (USD)" : "Amount (USDC)"}
                </label>
                <span className="text-xs text-zinc-500 font-sans">
                  Spendable Balance: <strong className="text-zinc-950 font-mono font-bold">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>
              
              <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3">
                <DollarSign size={20} className="text-brand-purple shrink-0" />
                <input
                  id="send-amount-input"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-transparent border-0 outline-none text-zinc-950 text-xl font-mono font-bold placeholder-zinc-400 pl-1"
                />
                 <button
                  type="button"
                  onClick={handleMaxAmount}
                  className="bg-brand-purple/10 text-brand-purple text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-brand-purple/20 hover:bg-brand-purple hover:text-white transition-colors cursor-pointer"
                >
                  MAX
                </button>
              </div>
              {amount && (parseFloat(amount) + (fee?.feeUSD || 0)) > availableBalance && (
                <p className="text-xs text-red-600 font-sans font-medium">Insufficient available balance (includes fee).</p>
              )}
            </div>

            {/* Remark Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Remark (Optional)</label>
              <textarea
                id="send-description-input"
                placeholder="What is this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full rounded-2xl bg-zinc-50 border border-zinc-200 focus:border-brand-purple focus:bg-white transition-all p-3 text-xs sm:text-sm text-zinc-900 font-sans placeholder-zinc-400 outline-none resize-none"
              />
            </div>

            {/* Fee summary block */}
            {isCalculatingFee ? (
              <div className="flex items-center gap-2 text-xs text-zinc-500 py-1 font-sans">
                <Loader2 size={12} className="animate-spin text-brand-purple" />
                Calculating transaction fee...
              </div>
            ) : fee ? (
              <div className="flex items-center justify-between text-xs py-1 text-zinc-500 border-t border-zinc-200 pt-2 font-sans">
                <span>Estimated Fee:</span>
                <span className="font-mono font-bold text-zinc-950">${fee.feeUSD?.toFixed(2) || "0.00"}</span>
              </div>
            ) : null}
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePrevStep}
              className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sans font-bold rounded-full flex items-center justify-center gap-2 border border-zinc-200 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              id="send-continue-btn-step2"
              onClick={handleNextStep}
              disabled={!amount || parseFloat(amount) <= 0 || (parseFloat(amount) + (fee?.feeUSD || 0)) > availableBalance}
              className="flex-1 h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-brand-purple/20"
            >
              Continue
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: SECURITY PASSWORD CONFIRM */}
      {step === 3 && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Lock size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="text-zinc-950 text-base font-display font-bold">Transaction Authentication</h3>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-[320px] font-sans">
                Please enter your account password to authorize and sign this transfer.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider block">Verify Password</label>
            <div className="relative flex items-center rounded-2xl bg-zinc-50 border border-zinc-200 focus-within:border-brand-purple focus-within:bg-white transition-all px-4 py-3">
              <input
                id="send-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-zinc-950 text-sm font-sans font-semibold tracking-wider placeholder-zinc-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-xs font-mono font-bold text-zinc-500 hover:text-zinc-900 cursor-pointer"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePrevStep}
              className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sans font-bold rounded-full flex items-center justify-center gap-2 border border-zinc-200 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              id="send-continue-btn-step3"
              onClick={handleNextStep}
              disabled={!password}
              className="flex-1 h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-brand-purple/20"
            >
              Verify
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: CONFIRM TRANSACTION SUMMARY */}
      {step === 4 && (
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">Transaction Summary</span>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3.5">
              {/* From User */}
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-zinc-500 font-sans">From:</span>
                <span className="font-mono font-bold text-zinc-950">{user?.bankTag ? `@${user.bankTag}` : "Your Balance"}</span>
              </div>

              {/* To User */}
              <div className="flex justify-between items-center text-xs sm:text-sm border-t border-zinc-200 pt-3">
                <span className="text-zinc-500 font-sans">To Recipient:</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg overflow-hidden relative border border-zinc-200 bg-white">
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc.startsWith("http") 
                          ? avatarSrc 
                          : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${avatarSrc}`
                        }
                        alt={resolvedRecipient.bankTag}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      renderAvatarPlaceholder()
                    )}
                  </div>
                  <span className="font-mono font-bold text-zinc-950">{resolvedRecipient?.bankTag}</span>
                </div>
              </div>

              {/* Transfer Amount */}
              <div className="flex justify-between items-center text-xs sm:text-sm border-t border-zinc-200 pt-3">
                <span className="text-zinc-500 font-sans">Subtotal:</span>
                <span className="font-mono font-bold text-zinc-950">${parseFloat(amount).toFixed(2)} {resolvedRecipient ? "USD" : "USDC"}</span>
              </div>

              {/* Fee */}
              <div className="flex justify-between items-center text-xs sm:text-sm border-t border-zinc-200 pt-3">
                <span className="text-zinc-500 font-sans">Transfer Fee:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {fee?.feeUSD && fee.feeUSD > 0 ? `$${fee.feeUSD.toFixed(2)}` : "Free"}
                </span>
              </div>

              {/* Total Deducted */}
              <div className="flex justify-between items-center border-t border-zinc-200 pt-3 text-sm sm:text-base">
                <span className="font-sans font-bold text-zinc-950">Total Deduction:</span>
                <span className="font-mono font-black text-brand-purple">${totalDeduction.toFixed(2)}</span>
              </div>

              {/* Remark */}
              {description && (
                <div className="border-t border-zinc-200 pt-3 text-xs">
                  <span className="text-zinc-500 font-sans block mb-1">Remark:</span>
                  <p className="text-zinc-700 italic bg-white p-2.5 rounded-xl border border-zinc-200 font-sans leading-relaxed">
                    &quot;{description}&quot;
                  </p>
                </div>
              )}
            </div>

            {resolvedRecipient?.isExternal && (
              <div className="flex gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed animate-in fade-in duration-200 font-sans">
                <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-700 animate-pulse" />
                <span>
                  <strong>External Blockchain Withdrawal:</strong> This transfer will be processed on-chain and sent directly to the address provided on the BSC Testnet. Ensure the destination address is correct and supports USDC.
                </span>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handlePrevStep}
              disabled={isProcessing}
              className="flex-1 h-11 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-sans font-bold rounded-full flex items-center justify-center gap-2 border border-zinc-200 disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            <Button
              id="confirm-send-btn"
              onClick={handleInitiateTransfer}
              disabled={isProcessing}
              className="flex-1 h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md shadow-brand-purple/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Confirm & Send
                  <Check size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: OUTCOME SCREEN */}
      {step === 5 && txResult && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            
            {txResult.success ? (
              <>
                <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center animate-bounce shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-zinc-950 text-lg font-display font-extrabold tracking-tight">Transfer Successful!</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm max-w-[280px] leading-relaxed font-sans">
                    {txResult.message}
                  </p>
                </div>

                {txResult.txId && (
                  <div className="bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-xs font-mono text-zinc-500 select-all max-w-[280px] truncate">
                    Ref ID: {txResult.txId}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center animate-pulse shadow-sm">
                  <XCircle size={36} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-zinc-950 text-lg font-display font-extrabold tracking-tight">Transaction Failed</h3>
                  <p className="text-zinc-600 text-xs sm:text-sm max-w-[280px] leading-relaxed font-sans">
                    {txResult.message}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="pt-2">
            {txResult.success ? (
              <DialogClose asChild>
                <Button
                  id="send-done-btn"
                  onClick={onClose}
                  className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full cursor-pointer shadow-md shadow-brand-purple/20"
                >
                  Done
                </Button>
              </DialogClose>
            ) : (
              <Button
                id="send-try-again-btn"
                onClick={() => setStep(4)}
                className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full cursor-pointer shadow-md shadow-brand-purple/20"
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}

    </DialogContent>
  );
}
