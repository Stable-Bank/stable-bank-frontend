"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ArrowUp,
  CreditCard,
  Settings,
  ChartNoAxesCombined,
} from "lucide-react";
import { appRoutes } from "@/lib/navigation";
import { cn } from "@/utils/cn";

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
    label: "Card",
    route: appRoutes.dashboard.vcard,
    icon: CreditCard,
  },
  {
    label: "Invest",
    route: appRoutes.dashboard.invest,
    icon: ChartNoAxesCombined,
  },
  {
    label: "More",
    route: appRoutes.dashboard.settings,
    icon: Settings,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0E121C]/95 backdrop-blur-lg border-t border-white/10 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          // Exact match for home, startsWith for others
          const isActive = item.route === appRoutes.dashboard.home
            ? pathname === item.route
            : pathname.startsWith(item.route);
          const Icon = item.icon;

          return (
            <Link
              key={item.route}
              href={item.route}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-[56px] active:scale-95",
                isActive
                  ? "text-brand-purple bg-brand-purple/10"
                  : "text-white/60 hover:text-white/80 active:bg-white/5"
              )}
            >
              <Icon
                size={22}
                className={cn(
                  "transition-all duration-200",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn(
                "text-[10px] font-medium transition-all duration-200",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
