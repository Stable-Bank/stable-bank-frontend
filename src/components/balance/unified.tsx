"use client";

import { ArrowDownLeft, ArrowUpRight, RefreshCcw } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RecieveModal from "../modal/recieve";
import { useRouter } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { toast } from "sonner";

export default function UnifiedBalance() {
  const router = useRouter();
  const { user } = useAuth();
  const { balance, isLoading, error, refresh } = useBalance(user?.walletAddress);

  const handleSend = () => {
    router.push(appRoutes.dashboard.send);
  };

  const handleRefresh = async () => {
    try {
      await refresh();
      toast.success("Balance refreshed");
    } catch {
      toast.error("Failed to refresh balance");
    }
  };

  return (
    <div className="w-full rounded-[12px] sm:rounded-[16px] lg:rounded-[20px] bg-[#0E121C] px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8">
      <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg lg:text-xl font-medium">
        <span>Unified Balance</span>
        <RefreshCcw
          size={12}
          className={`sm:w-[14px] sm:h-[14px] cursor-pointer hover:opacity-80 transition-opacity ${isLoading ? "animate-spin" : ""}`}
          color="#4649D6"
          onClick={handleRefresh}
        />
      </h2>

      <div className="mt-2 sm:mt-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3">
        {isLoading && !balance ? (
          <div className="h-12 w-32 animate-pulse rounded bg-white/10" />
        ) : error ? (
          <div className="flex flex-col gap-1">
            <p className="text-xl sm:text-2xl font-bold text-red-400">Unable to load balance</p>
            <button 
              onClick={handleRefresh}
              className="w-fit text-sm font-medium text-brand-purple hover:text-brand-purple/80 underline underline-offset-4 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            ${balance?.totalUSD?.toFixed(2) || "0.00"}
          </p>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={handleSend}
            className="bg-brand-purple flex aspect-square h-8 w-8 sm:h-9 sm:w-9 shrink-0 cursor-pointer items-center justify-center rounded-full hover:opacity-90 transition-opacity"
          >
            <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
          </div>

          <Dialog>
            <DialogTrigger className="cursor-pointer">
              <div className="bg-brand-purple flex aspect-square h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full hover:opacity-90 transition-opacity">
                <ArrowDownLeft size={16} className="sm:w-5 sm:h-5" />
              </div>
            </DialogTrigger>
            <RecieveModal />
          </Dialog>
        </div>
      </div>

      {isLoading && !balance ? (
        <div className="mt-2 h-6 w-48 animate-pulse rounded bg-white/10" />
      ) : (
        <p className="text-brand-yellow mt-2 text-sm sm:text-base font-medium">
          DeFi Balance: ${balance?.defiBalanceUSD?.toFixed(2) || "0.00"}
        </p>
      )}
    </div>
  );
}
