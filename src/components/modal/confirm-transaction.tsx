"use client";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { appRoutes } from "@/lib/navigation";
import TransactionCard from "../cards/u/transaction";
import { transferService } from "@/services/transferService";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import type { UserProfile } from "@/types/user";

interface UConfirmTransactionProps {
  recipient: UserProfile;
  amount: string;
  description?: string;
  fee?: any;
}

export default function UConfirmTransaction({
  recipient,
  amount,
  description,
  fee,
}: UConfirmTransactionProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransfer = async () => {
    if (!user?.walletAddress || !recipient.bankTag) {
      toast.error("Missing required information");
      return;
    }

    setIsProcessing(true);

    try {
      await transferService.initiateTransfer({
        recipientBankTag: recipient.bankTag,
        amount,
        tokenSymbol: "USDC",
        sourceChain: "polygon",
        destinationChain: "polygon",
        description,
      });

      toast.success("Transfer initiated successfully!");
      router.push(appRoutes.dashboard.home);
    } catch (error: any) {
      console.error("Transfer failed:", error);
      toast.error(error?.message || "Transfer failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = parseFloat(amount) + (fee?.feeUSD || 0);

  return (
    <div>
      <DialogContent className="w-full !max-w-[660px] rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-2xl text-zinc-950">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-5">
            <span className="font-display font-bold text-xl text-zinc-950">
              Confirm Transaction
            </span>
          </DialogTitle>

          <div className="mt-4">
            <TransactionCard
              timestamp={new Date().toLocaleString()}
              from={{
                name: user?.bankTag || "You",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.walletAddress}`,
                amount: `-$${amount}`,
                bank: user?.bankTag || "Your Wallet",
              }}
              to={{
                name: recipient.displayName || recipient.username,
                avatar: recipient.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.bankTag}`,
                amount: `+$${amount}`,
                token: "USDC",
                bank: recipient.bankTag,
              }}
            />
          </div>

          <div className="mt-4 space-y-2 rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
              <span className="text-zinc-500">Amount:</span>
              <span className="font-mono font-bold text-zinc-950">${amount} USDC</span>
            </div>
            {fee && (
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="text-zinc-500">Network Fee:</span>
                <span className="font-mono font-bold text-zinc-950">${fee.feeUSD?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-zinc-200 pt-2 text-sm sm:text-base font-sans font-bold">
              <span className="text-zinc-950">Total:</span>
              <span className="font-mono font-black text-brand-purple">${totalAmount.toFixed(2)}</span>
            </div>
            {description && (
              <div className="border-t border-zinc-200 pt-2">
                <p className="text-xs text-zinc-500 font-sans">Remark:</p>
                <p className="text-xs sm:text-sm text-zinc-800 font-sans mt-0.5">{description}</p>
              </div>
            )}
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full border-zinc-200 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-8 text-sm font-sans font-bold"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={isProcessing}
            className="text-white bg-brand-purple hover:bg-brand-purple/90 flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full px-8 text-sm font-sans font-bold shadow-md shadow-brand-purple/20 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
