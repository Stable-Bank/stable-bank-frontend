"use client";

import LogoutModal from "@/components/modal/logout";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useNotifications } from "@/contexts/NotificationContext";
import { Power, Bell } from "lucide-react";
import Link from "next/link";

export default function UTopbar() {
  const { unreadCount } = useNotifications();

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
          className="flex h-[34px] sm:h-[38px] w-[34px] sm:w-[38px] items-center justify-center rounded-full bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 shadow-xs transition-all relative shrink-0"
          title="Notifications"
        >
          <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </Link>

        <Dialog>
          <DialogTrigger className="cursor-pointer">
            <div className="flex h-[34px] sm:h-[38px] w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-red-50 border border-red-200 px-3.5 sm:px-4 py-1.5 font-sans font-semibold text-red-600 hover:bg-red-100/80 transition-colors shadow-xs">
              <Power size={13} className="sm:w-[14px] sm:h-[14px]" />
              <span className="text-xs sm:text-sm lg:hidden">Logout</span>
            </div>
          </DialogTrigger>
          <LogoutModal />
        </Dialog>
      </div>
    </div>
  );
}
