import { UFooter } from "@/components/footer/u";
import { USidebar } from "@/components/sidebar/u";
import { UTopbar } from "@/components/topbar/u";
import { AuthProvider } from "@/layouts/auth/auth.provider";
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
    <AuthProvider>
      <div className="flex h-screen overflow-hidden">
        <USidebar />
        <div className="flex h-full w-full flex-col gap-8 overflow-y-auto px-12 py-6">
          <UTopbar />
          {children}
          <UFooter />
        </div>
      </div>
    </AuthProvider>
  );
}
