"use client";

import LogoutModal from "@/components/modal/logout";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { appRoutes } from "@/lib/navigation";
import { Power, Bell, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UTopbar() {
  const { unreadCount } = useNotifications();
  const { user } = useAuth();

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ""}`.toUpperCase()
    : user?.bankTag
      ? user.bankTag.slice(0, 2).toUpperCase()
      : "SB";

  return (
    <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 w-full">
      {/* Far Left: Profile icon linking to Settings (Mobile Only) */}
      <div className="flex lg:hidden items-center">
        <Link
          href={appRoutes.dashboard.settings}
          className="flex items-center gap-2.5 p-1 sm:p-1.5 pr-3 sm:pr-3.5 rounded-full bg-white border border-zinc-200 hover:border-brand-purple/40 hover:bg-zinc-50 shadow-xs transition-all duration-200 group cursor-pointer"
          title="Profile & Settings"
        >
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-brand-purple/10 flex items-center justify-center text-brand-purple">
            {user?.avatarUrl ? (
              <Image
                src={
                  user.avatarUrl.startsWith("http")
                    ? user.avatarUrl
                    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}${user.avatarUrl}`
                }
                alt="avatar"
                fill
                className="object-cover"
              />
            ) : user?.firstName || user?.bankTag ? (
              <span className="text-[11px] sm:text-xs font-mono font-bold text-brand-purple">
                {userInitials}
              </span>
            ) : (
              <UserIcon size={14} className="sm:w-4 sm:h-4 text-brand-purple" />
            )}
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-zinc-900 group-hover:text-brand-purple transition-colors leading-none truncate max-w-[110px] sm:max-w-[140px]">
              ${user?.bankTag || "Profile"}
            </span>
            <span className="text-[9px] font-sans font-semibold text-zinc-400 leading-none mt-0.5">
              Settings
            </span>
          </div>
        </Link>
      </div>

      {/* Far Right: Notifications & Logout */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <Link
          href={appRoutes.dashboard.notifications}
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
            <div className="flex h-[34px] sm:h-[38px] w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-red-50 border border-red-200 px-3 sm:px-4 py-1.5 font-sans font-semibold text-red-600 hover:bg-red-100/80 transition-colors shadow-xs">
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
