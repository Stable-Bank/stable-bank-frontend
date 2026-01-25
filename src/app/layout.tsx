import type { Metadata } from "next";
import { Darker_Grotesque } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const darkerGrotesque = Darker_Grotesque({
  variable: "--font-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StableBank",
  description:
    "Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.",
  icons: {
    icon: "/images/brand/favicon.svg",
  },
  openGraph: {
    title: "StableBank | Secure, Scalable, Decentralized",
    description:
      "Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.",
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
    title: "StableBank | Secure, Scalable, Decentralized",
    description:
      "Secure, scalable, and decentralized solutions for your digital assets—experience the future of financial freedom.",
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
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
