"use client";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { cardService } from "@/services/cardService";
import { toast } from "sonner";
import { useState } from "react";
import type { VirtualCard } from "@/types/card";

interface RegenerateCardModalProps {
  card: VirtualCard | null;
  onSuccess: () => void;
}

export default function RegenerateCardModal({
  card,
  onSuccess,
}: RegenerateCardModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRegenerate = async () => {
    if (!card) return;

    setIsProcessing(true);
    try {
      // First terminate the old card
      await cardService.terminateCard(card.cardId);

      // Create a new card with same details
      await cardService.createCard({
        cardholderName: card.cardholderName,
        limits: card.limits,
      });

      toast.success("Card regenerated successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Failed to regenerate card:", error);
      toast.error(error?.message || "Failed to regenerate card");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!card) return null;

  return (
    <DialogContent className="w-full !max-w-[400px] rounded-[20px] border-none bg-[#0E121C] px-[18px] py-5">
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-3 font-medium">
          <p className="text-base">Regenerate Card Details</p>
          <p className="text-xs text-white/60">
            This will generate new card numbers and security codes. Update any
            saved payment methods.
          </p>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-7">
        <DialogClose asChild>
          <Button
            disabled={isProcessing}
            className="rounded-[20px] bg-[#1F2937] py-3 text-base font-medium"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          onClick={handleRegenerate}
          disabled={isProcessing}
          className="bg-brand-purple rounded-[20px] py-3 text-base font-medium disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Regenerate"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
