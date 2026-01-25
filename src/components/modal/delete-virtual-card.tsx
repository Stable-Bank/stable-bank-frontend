"use client";

import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import type { VirtualCard } from "@/types/card";

interface DeleteVirtualCardModalProps {
  card: VirtualCard | null;
  onConfirm: () => void;
}

export default function DeleteVirtualCardModal({
  card,
  onConfirm,
}: DeleteVirtualCardModalProps) {
  if (!card) return null;

  return (
    <DialogContent className="w-full !max-w-[400px] rounded-[20px] border-none bg-[#0E121C] px-[18px] py-5">
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-3 font-medium">
          <p className="text-base">Delete Virtual Card</p>
          <p className="text-xs text-white/60">
            Are you sure you want to delete card ending in{" "}
            <span className="font-semibold text-white">
              {card.cardNumber.slice(-4)}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-7">
        <DialogClose asChild>
          <Button
            type="button"
            className="rounded-[20px] bg-[#1F2937] py-3 text-base font-medium"
          >
            Cancel
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button
            type="button"
            onClick={onConfirm}
            className="rounded-[20px] bg-[#FE0420] py-3 text-base font-medium hover:bg-[#FE0420]/90"
          >
            Delete Card
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
