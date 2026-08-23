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
    <DialogContent className="w-full !max-w-[400px] rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-2xl text-zinc-950">
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-2">
          <p className="font-display font-bold text-lg text-zinc-950">Regenerate Card Details</p>
          <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
            This will generate new card numbers and security codes. Update any
            saved payment methods.
          </p>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
        <DialogClose asChild>
          <Button
            disabled={isProcessing}
            className="rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 h-11 text-sm font-sans font-bold cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>

        <Button
          onClick={handleRegenerate}
          disabled={isProcessing}
          className="bg-brand-purple hover:bg-brand-purple/90 text-white rounded-full h-11 text-sm font-sans font-bold shadow-md shadow-brand-purple/20 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? "Processing..." : "Regenerate"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
