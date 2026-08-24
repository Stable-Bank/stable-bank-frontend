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
  LogOut,
  ChevronRight,
  ShieldCheck,
  PiggyBank,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import BrandLogo from "@/components/brand/brand-logo";

export default function USidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const itemsToRender = user?.role === "admin"
    ? [
        {
          label: "Home",
          route: appRoutes.dashboard.home,
          icon: Home,
        },
        {
          label: "Admin Panel",
          route: "/dashboard/admin",
          icon: ShieldCheck,
        },
        {
          label: "Memo",
          route: "/dashboard/admin/memo",
          icon: Bell,
        },
        {
          label: "Withdrawal",
          route: "/dashboard/admin/withdrawal",
          icon: ArrowUp,
        },
      ]
    : navItems;

  const handleLogout = async () => {
    try {
      await logout();
      router.push(appRoutes.auth.signIn);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  return (
    <div className="flex h-full w-[280px] flex-col bg-white border-r border-zinc-200 shadow-sm">
      {/* Brand Header */}
      <div className="px-6 py-8 flex items-center justify-start">
        <Link href={appRoutes.dashboard.home} className="hover:opacity-90 transition-opacity">
          <BrandLogo />
        </Link>
      </div>

      {/* Profile Card */}
      <div className="px-5 mb-6">
        <div className="group relative flex flex-col gap-4 rounded-2xl bg-zinc-50 p-4 border border-zinc-200 hover:border-brand-purple/40 hover:shadow-sm transition-all duration-300 overflow-hidden">
          <div className="relative flex items-center gap-3.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xs">
              <Image
                src={
                  user?.avatarUrl 
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`
                    : `/images/svg/default-avatar.svg`
                }
                alt="avatar"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-display font-bold text-zinc-950 truncate leading-tight tracking-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Stable Member"}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <ShieldCheck size={12} className="text-brand-purple" />
                <span className="text-[9px] font-mono font-bold text-brand-purple uppercase tracking-wider leading-none">
                  Verified
                </span>
                <div className="h-1 w-1 rounded-full bg-zinc-300" />
                <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider leading-none">
                  {user?.role || "Personal"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 group/tag shadow-2xs">
              <div className="flex flex-col">
                <span className="text-[9px] text-zinc-400 font-mono font-bold uppercase tracking-widest mb-0.5">My Tag</span>
                <span className="text-xs font-mono font-bold text-zinc-900 tracking-tight">
                  ${user?.bankTag || "..."}
                </span>
              </div>
              <button
                 onClick={() => user?.bankTag && copyToClipboard(user.bankTag)}
                 className="p-1.5 rounded-lg bg-zinc-100 text-zinc-500 hover:text-brand-purple hover:bg-brand-purple/10 transition-all active:scale-90 cursor-pointer"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <section>
          <span className="px-3 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5 block">Dashboard</span>
          <div className="flex flex-col gap-1">
            {itemsToRender.map((ni) => {
              const isActive = ni.route === appRoutes.dashboard.home 
                ? pathname === ni.route 
                : pathname.startsWith(ni.route);
              return (
                <Link
                  key={ni.route}
                  href={ni.route}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-purple text-white shadow-sm shadow-brand-purple/20 font-bold"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-3 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 w-full">
                    <div className={`${isActive ? "text-white" : "text-brand-purple group-hover:text-brand-purple"}`}>
                      <ni.icon size={18} />
                    </div>
                    <span className="text-sm font-sans">{ni.label}</span>
                    {ni.label === "Notifications" && unreadCount > 0 && (
                      <span className="ml-auto flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {!isActive && ni.label !== "Notifications" && <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-1 group-hover:translate-x-0 transition-all ml-auto text-zinc-400" />}
                </Link>
              );
            })}

          </div>
        </section>

        {/* Utilities Section */}
        <section>
          <span className="px-3 text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5 block">Support</span>
          <div className="flex flex-col gap-1">
            {utilItems.map((ni) => {
              const isActive = pathname === ni.route;
              return (
                <Link
                  key={ni.route}
                  href={ni.route}
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-brand-purple text-white shadow-sm shadow-brand-purple/20 font-bold"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 font-medium"
                  }`}
                >
                  <div className={`${isActive ? "text-white" : "text-brand-purple group-hover:text-brand-purple"}`}>
                    <ni.icon size={18} />
                  </div>
                  <span className="text-sm font-sans">{ni.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-zinc-200">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group cursor-pointer text-sm font-bold font-sans"
        >
          <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
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
    label: "Virtual Card",
    route: appRoutes.dashboard.vcard,
    icon: CreditCard,
  },
  {
    label: "Invest",
    route: appRoutes.dashboard.invest,
    icon: ChartNoAxesCombined,
  },
  {
    label: "Savings & Lock",
    route: appRoutes.dashboard.savings,
    icon: PiggyBank,
  },
  {
    label: "Rewards",
    route: appRoutes.dashboard.rewards,
    icon: Gift,
  },
  {
    label: "Notifications",
    route: appRoutes.dashboard.notifications,
    icon: Bell,
  },
];

const utilItems = [
  {
    label: "Settings",
    route: appRoutes.dashboard.settings,
    icon: Settings,
  },
];
