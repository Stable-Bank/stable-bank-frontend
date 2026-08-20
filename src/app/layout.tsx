import type { Metadata } from "next";
import { Darker_Grotesque } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import "./globals.css";

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spend USDT Like Cash | Stablecoin Virtual Cards | StableBank",
  description:
    "Spend USDT, USDC, and other stablecoins like cash. Generate virtual crypto debit cards instantly for global purchases with zero hidden fees.",
  icons: {
    icon: "/images/brand/favicon.svg",
  },
  openGraph: {
    title: "Spend USDT Like Cash | Stablecoin Virtual Cards | StableBank",
    description:
      "Spend USDT, USDC, and other stablecoins like cash. Generate virtual crypto debit cards instantly for global purchases with zero hidden fees.",
    url: "https://stablebank-staging.vercel.app/",
    siteName: "StableBank",
    images: [
      {
        url: "https://stablebank-staging.vercel.app/images/brand/stablebank-card-back.svg",
        width: 1200,
        height: 630,
        alt: "StableBank Card",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spend USDT Like Cash | Stablecoin Virtual Cards | StableBank",
    description:
      "Spend USDT, USDC, and other stablecoins like cash. Generate virtual crypto debit cards instantly for global purchases with zero hidden fees.",
    images: [
      "https://stablebank-staging.vercel.app/images/brand/stablebank-card-back.svg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${darkerGrotesque.variable} font-grotesque antialiased`}
      >
        <AuthProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-center" />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
