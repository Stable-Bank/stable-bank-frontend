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
  Lock,
  PiggyBank,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { useAuth } from "@/contexts/AuthContext";

export default function USidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push(appRoutes.auth.signIn);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  return (
    <div className="flex h-full w-[280px] flex-col bg-[#0A0D14]/80 backdrop-blur-xl border-r border-white/5 shadow-2xl">
      {/* Brand Header */}
      <div className="px-6 py-10 flex items-center justify-center">
        <Link href={appRoutes.dashboard.home} className="hover:opacity-80 transition-opacity">
          <Image
            src={"/images/brand/logo-full.svg"}
            alt="Stable Bank"
            width={160}
            height={40}
            priority
          />
        </Link>
      </div>

      {/* Profile Card */}
      <div className="px-5 mb-8">
        <div className="group relative flex flex-col gap-4 rounded-3xl bg-white/[0.03] p-5 border border-white/10 hover:border-brand-purple/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg">
              <Image
                src={
                  user?.avatarUrl 
                    ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${user.avatarUrl}`
                    : `/images/svg/default-avatar.svg`
                }
                alt="avatar"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-white truncate leading-tight">
                {user?.firstName ? `${user.firstName} ${user.lastName}` : "Stable Member"}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <ShieldCheck size={11} className="text-brand-purple" />
                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">
                  Verified
                </span>
                <div className="h-0.5 w-0.5 rounded-full bg-white/20" />
                <span className="text-[10px] font-medium text-white/30 truncate">
                  {user?.role || "Personal"}
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-black/40 border border-white/5 group/tag backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest mb-0.5">My Tag</span>
                <span className="text-[13px] font-mono font-bold text-[#E9F2A3] tracking-tighter">
                  ${user?.bankTag || "..."}
                </span>
              </div>
              <button
                 onClick={() => user?.bankTag && copyToClipboard(user.bankTag)}
                 className="p-2 rounded-xl bg-white/5 text-white/40 hover:text-brand-purple hover:bg-brand-purple/10 transition-all active:scale-90"
              >
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <section>
          <span className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 block">Dashboard</span>
          <div className="flex flex-col gap-1.5">
            {navItems.map((ni) => {
              const isActive = ni.route === appRoutes.dashboard.home 
                ? pathname === ni.route 
                : pathname.startsWith(ni.route);
              return (
                <Link
                  key={ni.route}
                  href={ni.route}
                  className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-brand-purple text-white shadow-xl shadow-brand-purple/10"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    <div className={`${isActive ? "text-white" : "text-brand-purple/60 group-hover:text-brand-purple"}`}>
                      <ni.icon size={20} />
                    </div>
                    <span className={`text-[14px] ${isActive ? "font-bold" : "font-medium"}`}>{ni.label}</span>
                  </div>
                  {!isActive && <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Utilities Section */}
        <section>
          <span className="px-4 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 block">Support</span>
          <div className="flex flex-col gap-1.5">
            {utilItems.map((ni) => {
              const isActive = pathname === ni.route;
              return (
                <Link
                  key={ni.route}
                  href={ni.route}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-brand-purple text-white shadow-xl shadow-brand-purple/10"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <div className={`${isActive ? "text-white" : "text-brand-purple/60 group-hover:text-brand-purple"}`}>
                    <ni.icon size={20} />
                  </div>
                  <span className={`text-[14px] ${isActive ? "font-bold" : "font-medium"}`}>{ni.label}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Sign Out</span>
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
    label: "Vaults",
    route: appRoutes.dashboard.vaults,
    icon: Lock,
  },
  {
    label: "Savings",
    route: appRoutes.dashboard.savings,
    icon: PiggyBank,
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
