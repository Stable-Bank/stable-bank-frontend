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
      <DialogContent className="w-full !max-w-[660px] rounded-[20px] border-none bg-[#0E121C] px-[18px] py-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-5">
            <span className="text-brand-white text-base font-semibold">
              Confirm Transaction
            </span>
          </DialogTitle>

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
              avatar: recipient.avatar,
              amount: `+$${amount}`,
              token: "USDC",
              bank: recipient.bankTag,
            }}
          />

          <div className="mt-4 space-y-2 rounded-lg bg-[#131926] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Amount:</span>
              <span className="font-medium text-white">${amount} USDC</span>
            </div>
            {fee && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Network Fee:</span>
                <span className="font-medium text-white">${fee.feeUSD?.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold">
              <span className="text-white">Total:</span>
              <span className="text-brand-yellow">${totalAmount.toFixed(2)}</span>
            </div>
            {description && (
              <div className="border-t border-white/10 pt-2">
                <p className="text-xs text-white/60">Remark:</p>
                <p className="text-sm text-white">{description}</p>
              </div>
            )}
          </div>
        </DialogHeader>

        <DialogFooter className="flex gap-3">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[10px] border-white/20 px-8 text-lg font-semibold"
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleTransfer}
            disabled={isProcessing}
            className="text-brand-white bg-brand-purple flex h-12 flex-1 cursor-pointer items-center justify-center rounded-[10px] px-8 text-lg font-semibold disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Confirm Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
}
