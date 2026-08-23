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
    <div className="w-full rounded-2xl bg-white border border-zinc-200 px-5 sm:px-6 py-6 sm:py-8 shadow-sm">
      <h2 className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg lg:text-xl font-display font-bold text-zinc-950">
        <span>Unified Balance</span>
        <RefreshCcw
          size={14}
          className={`cursor-pointer text-brand-purple hover:opacity-80 transition-opacity ${isLoading ? "animate-spin" : ""}`}
          onClick={handleRefresh}
        />
      </h2>

      <div className="mt-2 sm:mt-2.5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {isLoading && !balance ? (
          <div className="h-12 w-32 animate-pulse rounded-xl bg-zinc-100" />
        ) : error ? (
          <div className="flex flex-col gap-1">
            <p className="text-xl sm:text-2xl font-display font-bold text-red-600">Unable to load balance</p>
            <button 
              onClick={handleRefresh}
              className="w-fit text-xs sm:text-sm font-sans font-bold text-brand-purple hover:underline transition-colors cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : (
          <p className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black tracking-tight text-zinc-950">
            ${balance?.totalUSD?.toFixed(2) || "0.00"}
          </p>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            onClick={handleSend}
            className="bg-brand-purple text-white flex aspect-square h-8 w-8 sm:h-9 sm:w-9 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-brand-purple/90 transition-opacity shadow-xs"
          >
            <ArrowUpRight size={16} className="sm:w-5 sm:h-5" />
          </div>

          <Dialog>
            <DialogTrigger className="cursor-pointer">
              <div className="bg-brand-purple text-white flex aspect-square h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full hover:bg-brand-purple/90 transition-opacity shadow-xs">
                <ArrowDownLeft size={16} className="sm:w-5 sm:h-5" />
              </div>
            </DialogTrigger>
            <RecieveModal />
          </Dialog>
        </div>
      </div>

      {isLoading && !balance ? (
        <div className="mt-2 h-6 w-48 animate-pulse rounded bg-zinc-100" />
      ) : (
        <p className="text-brand-purple mt-2 text-xs sm:text-sm font-mono font-bold">
          DeFi Balance: ${balance?.defiBalanceUSD?.toFixed(2) || "0.00"}
        </p>
      )}
    </div>
  );
}
