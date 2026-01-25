"use client";

import UProfileCard from "@/components/cards/u/profile";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { transferService } from "@/services/transferService";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserProfile } from "@/types/user";
import UConfirmTransaction from "@/components/modal/confirm-transaction";

export default function USendTo() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recipient, setRecipient] = useState<UserProfile | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fee, setFee] = useState<any>(null);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);

  // Fetch recipient info
  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        // Try to resolve as BankTag first
        const result = await transferService.resolveRecipient(`@${id}`);
        setRecipient({
          id: result.userId || 0,
          username: result.bankTag || result.displayName || id,
          bankTag: result.bankTag,
          displayName: result.displayName,
          avatar: result.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`,
          bgColor: result.bgColor || "from-purple-500 to-blue-500",
        });
      } catch (error) {
        console.error("Failed to fetch recipient:", error);
        toast.error("Recipient not found");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRecipient();
    }
  }, [id, router]);

  // Calculate fee when amount changes
  useEffect(() => {
    const calculateFee = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setFee(null);
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
  }, [amount]);

  if (isLoading) {
    return (
      <div className="flex w-full max-w-[675px] items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
      </div>
    );
  }

  if (!recipient) {
    return null;
  }

  return (
    <div className="flex w-full max-w-[675px] flex-col gap-5">
      <h1 className="text-2xl font-semibold text-[#E9F2A3]">Send to</h1>
      <div className="h-[144px] w-[132px]">
        <UProfileCard 
          user={{
            id: recipient.id,
            username: recipient.username || recipient.bankTag || "Unknown",
            avatar: recipient.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.bankTag}`,
            bgColor: recipient.bgColor || "from-purple-500 to-blue-500",
          }} 
          clickable={false} 
        />
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-[20px] bg-[#0E121C] px-6 py-6">
        <label className="text-sm font-medium text-white/80">Amount (USDC)</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="hide-autofill h-full w-full border-b border-solid border-white/60 bg-inherit pb-3 text-2xl font-semibold text-white ring-0 outline-0 hover:border-[#4649D6] focus:border-[#4649D6]"
        />
        {isCalculatingFee && (
          <p className="text-xs text-white/40">Calculating fee...</p>
        )}
        {fee && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Fee:</span>
            <span className="font-medium text-white">${fee.feeUSD?.toFixed(2) || "0.00"}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-[20px] bg-[#0E121C] px-6 py-6">
        <textarea
          placeholder="Add Remark (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="hide-autofill h-full w-full resize-none border-0 bg-inherit text-white ring-0 outline-0 placeholder:text-white/60"
        />
      </div>

      <Dialog>
        <DialogTrigger asChild className="cursor-pointer">
          <Button
            disabled={!amount || parseFloat(amount) <= 0}
            className="text-brand-white bg-brand-purple flex h-12 cursor-pointer items-center justify-center rounded-[10px] px-8 text-[22px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </DialogTrigger>
        <UConfirmTransaction
          recipient={recipient}
          amount={amount}
          description={description}
          fee={fee}
        />
      </Dialog>
    </div>
  );
}
