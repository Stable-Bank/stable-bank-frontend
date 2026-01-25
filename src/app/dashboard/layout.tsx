import { UFooter } from "@/components/footer/u";
import { USidebar } from "@/components/sidebar/u";
import { UTopbar } from "@/components/topbar/u";
import { MobileBottomNav } from "@/components/navbar";
import { AuthProvider as ProtectedRoute } from "@/layouts/auth/auth.provider";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "StableBank | Dashboard",
  description:
    "Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.",
  icons: {
    icon: "/images/brand/favicon.svg",
  },
};

export default function UserDashboardLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <div className="hidden lg:block">
          <USidebar />
        </div>
        
        <div className="flex h-full w-full flex-col gap-4 sm:gap-6 lg:gap-8 overflow-y-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 pb-20 lg:pb-6">
          <UTopbar />
          {children}
          <UFooter />
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </ProtectedRoute>
  );
}
