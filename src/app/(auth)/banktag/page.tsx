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
        <div className="flex w-fit items-center gap-3.5 rounded-full bg-[#0F0F0F] py-2 pr-16 pl-2.5 text-base font-medium shadow-2xl shadow-[#171E2E]">
          <Sparkles size={18} />
          <span>Create your Unique Banktag</span>
        </div>
        <h1 className="text-4xl font-semibold">
          Select and reserve a{" "}
          <span className="text-brand-yellow">username.</span>
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative h-[52px] rounded-[8px] bg-[#0F0F0F] text-base font-medium text-white placeholder:text-white/60">
          <input
            type="text"
            value={tagData.bankTag}
            onChange={(e) => updateTagData("bankTag", e.target.value)}
            placeholder="Input desired banktag"
            className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-4 ring-0 outline-0"
          />
          <MoveRight
            size={24}
            className="absolute top-1/2 right-2 -translate-1/2 transform"
            color="#FFFFFF52"
          />
        </div>

        <div className="relative h-[52px] rounded-[8px] bg-[#0F0F0F] text-base font-medium text-white placeholder:text-white/60">
          <input
            type="text"
            value={tagData.displayName}
            onChange={(e) => updateTagData("displayName", e.target.value)}
            placeholder="Input desired display name"
            className="hide-autofill h-full w-full rounded-[8px] border-0 bg-inherit px-4 ring-0 outline-0"
          />
          <MoveRight
            size={24}
            className="absolute top-1/2 right-2 -translate-1/2 transform"
            color="#FFFFFF52"
          />
        </div>
      </div>

      <Button
        disabled={tagData.loading}
        className="text-brand-white bg-brand-purple flex h-12 cursor-pointer items-center justify-center rounded-[40px] px-8 text-base font-semibold"
      >
        {tagData.loading ? "Checking..." : "Create Banktag"}
      </Button>
    </form>
  );
}
