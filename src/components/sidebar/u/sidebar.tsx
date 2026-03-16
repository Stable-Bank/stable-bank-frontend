"use client";

import Image from "next/image";
import {
  Home,
  ArrowUp,
  CreditCard,
  Gift,
  Settings,
  ChartNoAxesCombined,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useAuth } from "@/contexts/AuthContext";

export default function USidebar() {
  const pathname = usePathname();

  const { user } = useAuth();
  
  return (
    <div className="flex h-full w-[280px] flex-col gap-6 bg-[#0E121C] px-5 py-8">
      <Link href={appRoutes.dashboard.home}>
        <Image
          src={"/images/brand/logo-full.svg"}
          alt="logo"
          width={160}
          height={40}
        />
      </Link>

      <div className="group relative flex flex-col gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 hover:bg-white/[0.08] transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-brand-purple/30 bg-black/20 ring-4 ring-brand-purple/5">
            <Image
              src={
                user?.avatarUrl 
                  ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`
                  : `/images/svg/default-avatar.svg`
              }
              alt="avatar"
              width={48}
              height={48}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-white truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : "Stable Member"}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
                Personal
              </span>
              <div className="h-1 w-1 rounded-full bg-brand-purple/40" />
              <span className="text-[11px] font-medium text-brand-purple/80 tracking-tight">
                Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/30 border border-white/5 group/tag">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">My Tag</span>
              <span className="text-xs font-bold text-white tracking-tight">
                ${user?.bankTag || "unidentified"}
              </span>
            </div>
            <button
               onClick={() => user?.bankTag && copyToClipboard(user.bankTag)}
               className="p-1.5 rounded-lg bg-white/5 text-white/40 hover:text-brand-purple hover:bg-brand-purple/10 transition-all active:scale-90"
               title="Copy StableTag"
            >
              <Copy size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map((ni) => {
          // Exact match for home, startsWith for others
          const isActive = ni.route === appRoutes.dashboard.home 
            ? pathname === ni.route 
            : pathname.startsWith(ni.route);
          return (
            <div key={ni.route} className="relative px-3">
              {isActive && (
                <div className="bg-brand-purple absolute top-0 left-0 h-full w-1 rounded-sm" />
              )}
              <Link
                href={ni.route}
                className={`flex transform items-center gap-2.5 px-5 py-3 transition-all duration-200 ease-linear ${
                  isActive
                    ? "bg-brand-purple rounded-[6px] text-base font-semibold"
                    : "text-sm font-normal"
                } `}
              >
                <ni.icon size={20} />
                <span>{ni.label}</span>
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-8 px-5">
        <div className="h-[0.3px] w-full bg-[#FFFFFF]/20" />
      </div>

      <div className="flex flex-col gap-1">
        {utilItems.map((ni) => {
          const isActive = pathname === ni.route;
          return (
            <div key={ni.route} className="relative px-3">
              {isActive && (
                <div className="bg-brand-purple absolute top-0 left-0 h-full w-1 rounded-sm" />
              )}
              <Link
                href={ni.route}
                className={`flex items-center gap-2.5 px-5 py-3 ${
                  isActive
                    ? "bg-brand-purple rounded-[6px] text-base font-semibold"
                    : "text-sm font-normal"
                } `}
              >
                <ni.icon size={20} />
                <span>{ni.label}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const navItems = [
  {
    label: "Home",
    route: appRoutes.dashboard.home,
    icon: Home,
  },
  {
    label: "Send",
    route: appRoutes.dashboard.send,
    icon: ArrowUp,
  },
  {
    label: "Virtual Card",
    route: appRoutes.dashboard.vcard,
    icon: CreditCard,
  },
  {
    label: "Invest & Stake",
    route: appRoutes.dashboard.invest,
    icon: ChartNoAxesCombined,
  },
  {
    label: "Rewards",
    route: appRoutes.dashboard.rewards,
    icon: Gift,
  },
];

const utilItems = [
  {
    label: "Settings",
    route: appRoutes.dashboard.settings,
    icon: Settings,
  },
];
