"use client";

import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { ArrowDownLeft, Copy } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function RecieveModal() {
  const { user } = useAuth();
  return (
    <DialogContent className="w-full !max-w-[370px] rounded-[20px] border-none bg-[#0E121C] px-[18px] py-5">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-5">
          <div className="bg-brand-purple flex aspect-square h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <ArrowDownLeft />
          </div>
          <div>
            <h1 className="!text-2xl !font-semibold">Recieve</h1>
            <p className="text-xs font-normal text-white/60">
              Use thesedetails to receive funds in your walllet
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      <DialogFooter className="flex !flex-col items-center gap-2.5">
        <Image
          src={"/images/placeholder/qr-code.svg"}
          alt="qr code"
          width={242}
          height={242}
        />
        <div
          onClick={() => {
            if (user?.bankTag) copyToClipboard(user.bankTag);
          }}
          className="flex w-full max-w-[242px] cursor-pointer items-center gap-4 rounded-[20px] bg-[#131926] px-4 py-2 text-sm font-medium text-white/60"
        >
          <span>{user?.bankTag || "unidentified"}</span>
          <Copy size={8} color="#FFFFFF99" />
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
