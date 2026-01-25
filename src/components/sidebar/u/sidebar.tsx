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

export default function USidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[220px] flex-col gap-5 bg-[#0E121C] py-10">
      <div className="flex flex-col gap-5 px-5">
        <Image
          src={"/images/brand/full-logo-purple.svg"}
          alt="stablebank logo"
          width={168}
          height={20}
          className="h-5 w-auto"
        />

        <div className="flex items-center gap-2">
          <Image
            src={"/images/placeholder/qr-code.svg"}
            alt="qr code"
            width={44}
            height={44}
            className="h-10 w-10"
          />

          <div>
            <p className="text-xs font-medium text-[#FFFFFF99]">
              StableBank Banktag
            </p>
            <div
              onClick={() => copyToClipboard("mfoniso@stablebank")}
              className="flex cursor-pointer items-center gap-0.5 text-sm font-medium"
            >
              <span>mfoniso@stablebank</span>
              <Copy size={8} color="#FFFFFF99" />
            </div>
          </div>
        </div>

        <div className="h-[0.3px] w-full bg-[#FFFFFF]/20" />
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
