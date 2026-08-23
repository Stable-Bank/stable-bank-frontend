"use client";

import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/navigation";
import axios, { AxiosResponse } from "axios";
import { MoveRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CreateBankTagResponse {
  id: number;
  bankTag: string;
  displayName: string;
  ownerUserId: number;
}

interface CheckBankTagResponse {
  available: boolean;
}

export default function CreateBankTag() {
  const router = useRouter();
  const [tagData, setTagData] = useState({
    bankTag: "",
    displayName: "",
    loading: false,
  });

  function updateTagData<K extends keyof typeof tagData>(
    field: K,
    value: (typeof tagData)[K]
  ) {
    setTagData((prev) => ({ ...prev, [field]: value }));
  }

  async function checkBankTagAvailability() {
    if (!tagData.bankTag) {
      toast.error("Banktag is required.");
      return;
    }
    try {
      const res: AxiosResponse<CheckBankTagResponse> = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bank-tag/check?bankTag=@${tagData.bankTag}`
      );
      console.log("response in checker", res);

      if (res.status >= 200 && res.status < 300) {
        if (res.data.available) {
          toast.success("Banktag is available!");
          return true;
        } else {
          toast.error("Banktag is already taken.");
          return false;
        }
      }

      return false;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errMsg = error.response.data.message;
        console.error("Banktag error:", error);
        toast.error(errMsg || "Failed to check banktag. Please try again.");
        return false;
      }
    }
  }

  async function createBankTag() {
    try {
      const res: AxiosResponse<CreateBankTagResponse> = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bank-tag`,
        {
          bankTag: `@${tagData.bankTag}`,
          displayName: tagData.displayName,
        }
      );

      if (res.status >= 200 && res.status < 300) {
        console.log("response in creator", res);

        toast.success("BankTag created successfully!");
        router.push(appRoutes.dashboard.home);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errMsg = error.response.data.message;
        console.error("Create BankTag error:", error);
        toast.error(errMsg || "BankTag failed. Please try again.");
      }
    } finally {
      updateTagData("loading", false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateTagData("loading", true);

    const isAvailable = await checkBankTagAvailability();

    if (isAvailable) {
      await createBankTag();
    } else {
      updateTagData("loading", false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <div className="flex w-fit items-center gap-2 sm:gap-3.5 rounded-full bg-zinc-100 border border-zinc-200 py-1.5 pr-8 pl-3 text-xs sm:text-sm font-mono font-semibold text-zinc-800 shadow-sm">
          <Sparkles size={14} className="text-brand-purple" />
          <span>Create your Unique Banktag</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950">
          Select and reserve a{" "}
          <span className="text-brand-purple">username.</span>
        </h1>
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
          <input
            type="text"
            value={tagData.bankTag}
            onChange={(e) => updateTagData("bankTag", e.target.value)}
            placeholder="Input desired banktag"
            className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent px-4 pr-10 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
          />
          <MoveRight
            size={20}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
          />
        </div>

        <div className="relative h-[48px] sm:h-[52px] rounded-xl bg-zinc-50 border border-zinc-200 text-sm sm:text-base font-medium text-zinc-900 placeholder:text-zinc-400 focus-within:border-brand-purple focus-within:bg-white transition-all shadow-xs">
          <input
            type="text"
            value={tagData.displayName}
            onChange={(e) => updateTagData("displayName", e.target.value)}
            placeholder="Input desired display name"
            className="hide-autofill h-full w-full rounded-xl border-0 bg-transparent px-4 pr-10 ring-0 outline-0 text-zinc-900 placeholder:text-zinc-400 font-sans"
          />
          <MoveRight
            size={20}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
          />
        </div>
      </div>

      <Button
        disabled={tagData.loading}
        className="text-white bg-brand-purple hover:bg-brand-purple/90 flex h-12 cursor-pointer items-center justify-center rounded-full px-8 text-base font-bold shadow-md shadow-brand-purple/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {tagData.loading ? "Checking..." : "Create Banktag"}
      </Button>
    </form>
  );
}
