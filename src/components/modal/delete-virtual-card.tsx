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
    <DialogContent className="w-full !max-w-[400px] rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-2xl text-zinc-950">
      <DialogHeader>
        <DialogTitle className="flex flex-col gap-2">
          <p className="font-display font-bold text-lg text-zinc-950">Delete Virtual Card</p>
          <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed">
            Are you sure you want to delete card ending in{" "}
            <span className="font-mono font-bold text-zinc-950">
              {card.cardNumber.slice(-4)}
            </span>
            ? This action cannot be undone.
          </p>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="grid grid-cols-2 gap-4 mt-4">
        <DialogClose asChild>
          <Button
            type="button"
            className="rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 h-11 text-sm font-sans font-bold cursor-pointer"
          >
            Cancel
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white h-11 text-sm font-sans font-bold shadow-md shadow-red-600/20 cursor-pointer"
          >
            Delete Card
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
