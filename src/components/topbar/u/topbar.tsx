"use client";

import LogoutModal from "@/components/modal/logout";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { CircleCheck, Copy, Power, UserRound, Bell } from "lucide-react";
import Link from "next/link";

import { useState, useEffect } from "react";
import { transferService } from "@/services/transferService";

export default function UTopbar() {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await transferService.getTransferStats();
        const statsData = stats as any;
        if (statsData.statusBreakdown && statsData.statusBreakdown.pending) {
          setPendingCount(statsData.statusBreakdown.pending);
        } else {
          setPendingCount(0);
        }
      } catch (error) {
        console.error("Failed to fetch transfer stats:", error);
      }
    };

    fetchStats();
    // Refresh every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string | undefined) => {
    if (!address) return "Not connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (user?.walletAddress) {
      copyToClipboard(user.walletAddress);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      {/* <div className="flex items-center gap-3 sm:gap-[18px] w-full sm:w-auto">
        <div className="text-brand-purple flex w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-[#0E121C] px-3 sm:px-4 py-1.5 sm:py-2">
          <CircleCheck size={15} className="sm:w-[17px] sm:h-[17px] shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 text-sm sm:text-sm font-medium">
              <UserRound size={10} className="sm:w-3 sm:h-3" />
              <span>{user?.accountType === 'business' ? 'Business' : 'Personal'}</span>
            </div>
            <div
              className="flex items-center gap-0.5 text-white/60 cursor-pointer hover:text-white/80 transition-colors"
              onClick={handleCopyAddress}
            >
              <p className="text-sm sm:text-base font-medium">
                {formatAddress(user?.walletAddress)}
              </p>
              <Copy size={8} />
            </div>
          </div>
        </div>
      </div> */}
      <div className="flex items-center gap-3 sm:gap-4 w-full justify-end">
        <Link
          href="/dashboard/notifications"
          className="flex h-[32px] sm:h-[37px] w-[32px] sm:w-[37px] items-center justify-center rounded-full bg-[#0E121C] text-white/60 hover:text-white hover:bg-[#151A26] transition-all relative shrink-0"
          title="Notifications"
        >
          <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        <Dialog>
          <DialogTrigger className="cursor-pointer">
            <div className="flex h-[32px] sm:h-[37px] w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-[#0E121C] px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-[#FE0420]">
              <Power size={12} className="sm:w-[14px] sm:h-[14px]" />
              <span className="text-sm sm:text-sm lg:hidden">Logout</span>
            </div>
          </DialogTrigger>
          <LogoutModal />
        </Dialog>
      </div>
    </div>
  );
}
