"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Star,
  Zap,
  ShieldCheck,
  Globe2,
  X,
  ArrowRight,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// ==========================================
// CUSTOM VECTOR SVGs FOR LIFESTYLE & APPS
// ==========================================

function EsimSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="10" width="40" height="48" rx="8" fill="url(#esim-bg)" stroke="#7C3AED" strokeWidth="2" />
      <path d="M12 22 L24 10" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
      {/* SIM Chip Lines */}
      <rect x="22" y="24" width="20" height="20" rx="4" fill="#DDD6FE" stroke="#6D28D9" strokeWidth="1.5" />
      <path d="M22 34 H42 M32 24 V44 M27 24 V34 M37 34 V44" stroke="#6D28D9" strokeWidth="1.2" />
      {/* Wireless Signal Waves */}
      <path d="M46 16 C49 19, 49 25, 46 28" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 13 C54 18, 54 28, 49 33" stroke="#10B981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <defs>
        <linearGradient id="esim-bg" x1="12" y1="10" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAF5FF" />
          <stop offset="1" stopColor="#EDE9FE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function FlightSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="26" fill="url(#flight-bg)" stroke="#2563EB" strokeWidth="2" />
      {/* Flight Arc */}
      <path d="M16 42 Q32 18 48 24" stroke="#93C5FD" strokeWidth="2" strokeDasharray="3 3" />
      {/* Jet Plane */}
      <path d="M44 22 L38 23 L28 15 L25 16 L29 24 L22 25 L19 22 L17 22 L18 27 L17 32 L19 32 L22 29 L29 30 L25 38 L28 39 L38 31 L44 32 C47 32 49 30 49 27 C49 24 47 22 44 22 Z" fill="#1D4ED8" />
      <defs>
        <linearGradient id="flight-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EFF6FF" />
          <stop offset="1" stopColor="#DBEAFE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function StaysSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#stays-bg)" stroke="#EA580C" strokeWidth="2" />
      {/* Hotel Building */}
      <path d="M18 48 V22 C18 20 19 19 21 19 H37 C39 19 40 20 40 22 V48" fill="#FFEDD5" stroke="#C2410C" strokeWidth="2" />
      <path d="M40 30 H46 C47 30 48 31 48 32 V48 H40" fill="#FED7AA" stroke="#C2410C" strokeWidth="2" />
      {/* Windows */}
      <rect x="23" y="24" width="4" height="4" rx="1" fill="#EA580C" />
      <rect x="31" y="24" width="4" height="4" rx="1" fill="#EA580C" />
      <rect x="23" y="32" width="4" height="4" rx="1" fill="#EA580C" />
      <rect x="31" y="32" width="4" height="4" rx="1" fill="#EA580C" />
      {/* Door */}
      <path d="M26 48 V40 H32 V48" fill="#9A3412" />
      {/* Moon / Sparkle */}
      <circle cx="45" cy="18" r="4" fill="#FBBF24" />
      <defs>
        <linearGradient id="stays-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF7ED" />
          <stop offset="1" stopColor="#FFEDD5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function CabSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#cab-bg)" stroke="#CA8A04" strokeWidth="2" />
      {/* Taxi Roof Sign */}
      <rect x="27" y="19" width="10" height="4" rx="1" fill="#CA8A04" />
      {/* Car Body */}
      <path d="M16 38 L20 27 C21 25 23 24 25 24 H39 C41 24 43 25 44 27 L48 38 C49 39 50 40 50 42 V45 C50 46 49 47 48 47 H46 V44 H18 V47 H16 C15 47 14 46 14 45 V42 C14 40 15 39 16 38 Z" fill="#FDE047" stroke="#A16207" strokeWidth="2" />
      {/* Windshield */}
      <path d="M21 34 L23.5 28 H40.5 L43 34 Z" fill="#FEF08A" stroke="#A16207" strokeWidth="1.5" />
      {/* Headlights */}
      <circle cx="20" cy="41" r="2.5" fill="#FFFFFF" stroke="#A16207" strokeWidth="1" />
      <circle cx="44" cy="41" r="2.5" fill="#FFFFFF" stroke="#A16207" strokeWidth="1" />
      <defs>
        <linearGradient id="cab-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEFCE8" />
          <stop offset="1" stopColor="#FEF08A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function UtilitiesSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#util-bg)" stroke="#059669" strokeWidth="2" />
      {/* Lightning & Power */}
      <path d="M34 16 L20 34 H32 L28 48 L44 28 H32 L36 16 Z" fill="#34D399" stroke="#047857" strokeWidth="2" strokeLinejoin="round" />
      <defs>
        <linearGradient id="util-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECFDF5" />
          <stop offset="1" stopColor="#D1FAE5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function GiftCardSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#gift-bg)" stroke="#E11D48" strokeWidth="2" />
      {/* Gift Box Base */}
      <rect x="16" y="26" width="32" height="22" rx="3" fill="#FFE4E6" stroke="#BE123C" strokeWidth="2" />
      <rect x="14" y="22" width="36" height="6" rx="2" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2" />
      {/* Ribbons */}
      <line x1="32" y1="22" x2="32" y2="48" stroke="#E11D48" strokeWidth="2.5" />
      {/* Bow */}
      <path d="M32 22 C30 17 24 17 26 21 C28 23 32 22 32 22 Z" fill="#E11D48" />
      <path d="M32 22 C34 17 40 17 38 21 C36 23 32 22 32 22 Z" fill="#E11D48" />
      <defs>
        <linearGradient id="gift-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF1F2" />
          <stop offset="1" stopColor="#FFE4E6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DiningSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#dine-bg)" stroke="#9333EA" strokeWidth="2" />
      {/* Cloche Dome */}
      <path d="M18 38 C18 26 24 22 32 22 C40 22 46 26 46 38 Z" fill="#F3E8FF" stroke="#7E22CE" strokeWidth="2" />
      <rect x="16" y="38" width="32" height="4" rx="1.5" fill="#E9D5FF" stroke="#7E22CE" strokeWidth="1.5" />
      {/* Handle */}
      <circle cx="32" cy="19" r="2.5" fill="#7E22CE" />
      {/* Steam / Star */}
      <path d="M26 15 Q28 12 26 9" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M38 15 Q40 12 38 9" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" />
      <defs>
        <linearGradient id="dine-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAF5FF" />
          <stop offset="1" stopColor="#F3E8FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VaultsSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#vault-bg)" stroke="#0D9488" strokeWidth="2" />
      {/* Safe Door */}
      <circle cx="32" cy="32" r="16" fill="#CCFBF1" stroke="#0F766E" strokeWidth="2" />
      <circle cx="32" cy="32" r="7" fill="#5EEAD4" stroke="#0F766E" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="3" fill="#115E59" />
      {/* Vault Wheel Spokes */}
      <line x1="32" y1="18" x2="32" y2="24" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="40" x2="32" y2="46" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="32" x2="24" y2="32" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="32" x2="46" y2="32" stroke="#0F766E" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="vault-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F0FDFA" />
          <stop offset="1" stopColor="#CCFBF1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PayrollSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#pay-bg)" stroke="#4F46E5" strokeWidth="2" />
      {/* Invoice Sheet */}
      <rect x="18" y="16" width="28" height="34" rx="3" fill="#EEF2FF" stroke="#4338CA" strokeWidth="2" />
      <line x1="24" y1="24" x2="40" y2="24" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="30" x2="36" y2="30" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="36" x2="32" y2="36" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
      {/* Stamp Checkmark */}
      <circle cx="38" cy="40" r="6" fill="#10B981" />
      <path d="M35 40 L37 42 L41 38" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="pay-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EEF2FF" />
          <stop offset="1" stopColor="#E0E7FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function TaxSvg({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="44" height="44" rx="12" fill="url(#tax-bg)" stroke="#475569" strokeWidth="2" />
      {/* Calculator Body */}
      <rect x="18" y="16" width="28" height="34" rx="4" fill="#F8FAFC" stroke="#334155" strokeWidth="2" />
      <rect x="22" y="21" width="20" height="7" rx="1" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
      {/* Buttons */}
      <circle cx="25" cy="33" r="2" fill="#64748B" />
      <circle cx="32" cy="33" r="2" fill="#64748B" />
      <circle cx="39" cy="33" r="2" fill="#64748B" />
      <circle cx="25" cy="40" r="2" fill="#64748B" />
      <circle cx="32" cy="40" r="2" fill="#64748B" />
      <circle cx="39" cy="40" r="2" fill="#3B82F6" />
      <defs>
        <linearGradient id="tax-bg" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ==========================================
// APPS DATA MODEL
// ==========================================

interface AppItem {
  id: string;
  name: string;
  category: "travel" | "utilities" | "lifestyle" | "finance";
  categoryLabel: string;
  tagline: string;
  description: string;
  badge: string;
  rating: string;
  userCount: string;
  svgIcon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  features: string[];
}

const APPS_CATALOG: AppItem[] = [
  {
    id: "esim",
    name: "StableNet eSIM",
    category: "travel",
    categoryLabel: "Travel & Mobility",
    tagline: "Instant 5G roaming in 160+ countries",
    description: "High-speed local connectivity with zero roaming charges. Scan a QR code, activate in 60s, and settle directly with your stablecoin balance.",
    badge: "Instant eSIM",
    rating: "4.9",
    userCount: "18.4k users",
    svgIcon: EsimSvg,
    accentColor: "from-purple-500/10 to-indigo-500/10 border-purple-200",
    features: ["Instant QR Activation", "Global 5G & LTE", "Zero Roaming Fees", "Pay with USDC/USDT"],
  },
  {
    id: "travel",
    name: "SkyPass Flights",
    category: "travel",
    categoryLabel: "Travel & Mobility",
    tagline: "Global airline bookings with zero FX",
    description: "Book tickets on 450+ airlines worldwide with live seat confirmation and instant e-ticket issuance directly to your device.",
    badge: "Save up to 12%",
    rating: "4.8",
    userCount: "9.2k users",
    svgIcon: FlightSvg,
    accentColor: "from-blue-500/10 to-sky-500/10 border-blue-200",
    features: ["450+ Airlines Worldwide", "No Credit Card Surcharge", "Instant E-Ticket", "USDT/USDC Direct"],
  },
  {
    id: "stays",
    name: "StableStays & Villas",
    category: "travel",
    categoryLabel: "Travel & Mobility",
    tagline: "2.2M+ hotels, resorts, & boutique villas",
    description: "Luxury accommodations, serviced apartments, and beach retreats with best-rate guarantees and 3% points cashback.",
    badge: "3% Cashback",
    rating: "4.9",
    userCount: "14.6k users",
    svgIcon: StaysSvg,
    accentColor: "from-orange-500/10 to-amber-500/10 border-orange-200",
    features: ["2.2M+ Global Properties", "Flexible Free Cancellation", "3% Rewards Cashback", "Instant Room Confirmation"],
  },
  {
    id: "cabs",
    name: "CityRide & Airport Cabs",
    category: "travel",
    categoryLabel: "Travel & Mobility",
    tagline: "On-demand city rides & chauffeur transfers",
    description: "Hail city taxis, executive sedans, and airport pickup in 70+ metropolitan hubs without exchanging currency at local kiosks.",
    badge: "Zero FX Markup",
    rating: "4.7",
    userCount: "6.8k users",
    svgIcon: CabSvg,
    accentColor: "from-yellow-500/10 to-amber-500/10 border-yellow-200",
    features: ["Instant Airport Pickup", "Fixed Guaranteed Fares", "Executive Black Cars", "Direct Wallet Settlement"],
  },
  {
    id: "utilities",
    name: "Global Utility Hub",
    category: "utilities",
    categoryLabel: "Utilities & Bills",
    tagline: "Pay electricity, water, & mobile airtime in 120+ countries",
    description: "Instantly recharge mobile numbers, domestic power grids, and municipal utilities with automatic receipt archiving.",
    badge: "Instant Top-Up",
    rating: "4.8",
    userCount: "25.1k users",
    svgIcon: UtilitiesSvg,
    accentColor: "from-emerald-500/10 to-teal-500/10 border-emerald-200",
    features: ["120+ Countries Supported", "Direct Meter Recharge", "Zero Processing Markups", "Auto-Recurring Refills"],
  },
  {
    id: "giftcards",
    name: "GiftCard SuperMall",
    category: "lifestyle",
    categoryLabel: "Lifestyle & Perks",
    tagline: "Digital vouchers for Amazon, Apple, Steam & 1,000+ brands",
    description: "Buy digital vouchers delivered instantly to your inbox. Enjoy exclusive discounts and redeem seamlessly across top global merchants.",
    badge: "Up to 5% Off",
    rating: "4.9",
    userCount: "38.2k users",
    svgIcon: GiftCardSvg,
    accentColor: "from-rose-500/10 to-pink-500/10 border-rose-200",
    features: ["1,000+ Major Brands", "Instant Code Delivery", "5% Reward Bonus", "Send as a Digital Gift"],
  },
  {
    id: "dining",
    name: "VIP Concierge & Dining",
    category: "lifestyle",
    categoryLabel: "Lifestyle & Perks",
    tagline: "Michelin table reservations & luxury club access",
    description: "Priority reservations at top dining establishments, private member clubs, and luxury yacht charters across Paris, Tokyo, Dubai, and NYC.",
    badge: "VIP Access",
    rating: "4.9",
    userCount: "4.1k users",
    svgIcon: DiningSvg,
    accentColor: "from-purple-500/10 to-fuchsia-500/10 border-purple-200",
    features: ["Michelin Star Tables", "Private Members Access", "24/7 Dedicated Desk", "Complimentary Welcome Drinks"],
  },
  {
    id: "vaults",
    name: "StableYield Vaults",
    category: "finance",
    categoryLabel: "Finance & Web3",
    tagline: "Audited institutional stablecoin yield up to 8.4% APY",
    description: "Put your idle balances to work with smart contract vaults that compound daily yields with zero lock-up requirements.",
    badge: "Up to 8.4% APY",
    rating: "4.9",
    userCount: "22.3k users",
    svgIcon: VaultsSvg,
    accentColor: "from-teal-500/10 to-cyan-500/10 border-teal-200",
    features: ["Daily Auto-Compounding", "Zero Lockup Penalties", "Dual Audited Contracts", "Direct Withdrawal anytime"],
  },
  {
    id: "payroll",
    name: "Global Invoicing & Payroll",
    category: "finance",
    categoryLabel: "Finance & Web3",
    tagline: "Pay remote contractors & issue professional invoices",
    description: "Send compliant PDF invoices with payment links, or disburse international team payroll in 1-click across 160+ countries.",
    badge: "B2B Ready",
    rating: "4.8",
    userCount: "5.7k users",
    svgIcon: PayrollSvg,
    accentColor: "from-indigo-500/10 to-blue-500/10 border-indigo-200",
    features: ["Compliant PDF Invoicing", "Instant Multi-Recipient Payout", "Tax-Ready Summary Logs", "Zero Wire Reversal Delays"],
  },
  {
    id: "tax",
    name: "TaxLedger Pro",
    category: "finance",
    categoryLabel: "Finance & Web3",
    tagline: "Audit-grade capital gains & transaction reporting",
    description: "Export complete transaction logs, IRS Form 8949 reconciliations, and accountant-certified accounting reports in seconds.",
    badge: "Audit-Grade",
    rating: "4.7",
    userCount: "7.9k users",
    svgIcon: TaxSvg,
    accentColor: "from-slate-500/10 to-zinc-500/10 border-slate-200",
    features: ["IRS & HMRC Compliant", "FIFO/LIFO Cost Tracking", "1-Click CSV & PDF Export", "Auditor-Verified Ledgers"],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Apps" },
  { id: "travel", label: "Travel & Mobility" },
  { id: "utilities", label: "Utilities & Bills" },
  { id: "lifestyle", label: "Lifestyle & Perks" },
  { id: "finance", label: "Finance & Web3" },
];

export default function AppsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulated Drawer form states
  const [simLoading, setSimLoading] = useState(false);
  const [simSuccess, setSimSuccess] = useState(false);

  // eSIM state
  const [esimCountry, setEsimCountry] = useState("Japan");
  const [esimPlan, setEsimPlan] = useState("5GB · 30 Days ($11.00)");

  // Flights state
  const [flightFrom, setFlightFrom] = useState("New York (JFK)");
  const [flightTo, setFlightTo] = useState("London (LHR)");

  // Stays state
  const [stayCity, setStayCity] = useState("Tokyo, Japan");

  // Cabs state
  const [cabPickup, setCabPickup] = useState("Haneda Airport (HND)");
  const [cabDropoff, setCabDropoff] = useState("Shibuya Crossing Hotel");

  // Gift Card state
  const [giftBrand, setGiftBrand] = useState("Apple Gift Card");
  const [giftAmount, setGiftAmount] = useState("$50.00");

  // Utilities state
  const [utilType, setUtilType] = useState("Electricity Pre-paid");
  const [utilMeter, setUtilMeter] = useState("0419 8234 9182");

  // Filtered Apps according to Hick's Law & Miller's Law
  const filteredApps = useMemo(() => {
    return APPS_CATALOG.filter((app) => {
      const matchesCategory = activeCategory === "all" || app.category === activeCategory;
      const matchesSearch = 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenApp = (app: AppItem) => {
    setSelectedApp(app);
    setSimSuccess(false);
    setIsModalOpen(true);
  };

  const handleSimulateAction = async (actionName: string) => {
    setSimLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSimSuccess(true);
      toast.success(`${actionName} confirmed! Settled instantly with your StableBank balance.`);
    } catch {
      toast.error("Operation timed out. Please retry.");
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full pb-10">
      
      {/* Hero Header Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-brand-purple to-purple-950 text-white p-6 sm:p-8 md:p-10 shadow-lg border border-purple-800/40">
        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono font-semibold text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>StableBank Lifestyle Ecosystem</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold tracking-tight text-white">
            Spend, Travel & Live with Stables
          </h1>
          
          <p className="text-sm sm:text-base text-purple-200/90 font-sans leading-relaxed">
            Directly connect your USDC & USDT to real-world services. Instant global eSIM data, airline tickets, luxury villas, city rides, and utility bills with zero bank markups.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-purple-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              MPC Segregated Balances
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Globe2 className="w-4 h-4 text-sky-400" />
              160+ Countries
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Zap className="w-4 h-4 text-brand-yellow" />
              Instant Settlement
            </span>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Search & Category Filter Section (Hick's Law & Fitts's Law) */}
      <div className="space-y-4">
        {/* Search Bar - Large clickable target, instant filter */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps (eSIM, flights, hotels, cabs, gift cards, utilities...)"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white border border-zinc-200 text-sm sm:text-base font-sans text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Pills - Mobile scrollable, comfortable tap targets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all duration-200 shrink-0 cursor-pointer flex items-center gap-2",
                  isActive
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-950"
                )}
              >
                <span>{cat.label}</span>
                {cat.id === "all" && (
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.5 rounded-md",
                    isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                  )}>
                    {APPS_CATALOG.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Highlighted Card (Von Restorff Effect) */}
      {activeCategory === "all" && !searchQuery && (
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-[#F7FBE8]/50 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 bg-white rounded-2xl border border-purple-200 shadow-sm shrink-0">
              <EsimSvg className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-purple bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                  Featured Partner App
                </span>
                <span className="text-xs font-mono text-zinc-500">Global 5G</span>
              </div>
              <h3 className="text-base sm:text-lg font-display font-bold text-zinc-950">
                Traveling soon? Install an eSIM in 60 seconds with StableNet
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-xl">
                Get high-speed data for USA, Europe, Japan, UAE, and 160+ destinations without roaming bills. Directly deducted from your USDC or USDT.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenApp(APPS_CATALOG[0])}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold text-sm shadow-sm transition-all shrink-0 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
          >
            <span>Get eSIM Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Apps Grid - Mobile 1-col, Tablet 2-col, Desktop 3-col (Jakob's Law & Fitts's Law) */}
      {filteredApps.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 font-display">No apps found</h3>
          <p className="text-sm text-zinc-500 font-sans max-w-sm mx-auto">
            We couldn&apos;t find any apps matching &quot;{searchQuery}&quot;. Try adjusting your search query or selecting another category.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold font-sans hover:bg-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredApps.map((app) => {
            const SvgComponent = app.svgIcon;
            return (
              <div
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="group relative rounded-2xl border border-zinc-200 bg-white p-5 hover:border-brand-purple/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Top Section */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 group-hover:scale-105 group-hover:bg-purple-50 group-hover:border-purple-200 transition-all duration-300 shrink-0">
                        <SvgComponent className="w-9 h-9" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-display font-bold text-zinc-950 group-hover:text-brand-purple transition-colors">
                            {app.name}
                          </h3>
                        </div>
                        <p className="text-xs font-mono font-medium text-zinc-400">
                          {app.categoryLabel}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#EEF8A8]/80 text-[#556000] border border-[#D0E244]/80 shrink-0">
                      {app.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-600 font-sans leading-relaxed line-clamp-2">
                    {app.description}
                  </p>

                  {/* Feature Tags (Miller's Law - Small digestible chunks) */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {app.features.slice(0, 3).map((feat, i) => (
                      <span 
                        key={i}
                        className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Bar / Action (Fitts's Law 48px+ clickable button) */}
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-zinc-800">{app.rating}</span>
                    <span className="text-zinc-400">({app.userCount})</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenApp(app);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-zinc-100 hover:bg-brand-purple hover:text-white text-zinc-700 text-xs font-bold font-sans transition-all duration-200 flex items-center gap-1.5 group/btn cursor-pointer"
                  >
                    <span>Open App</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive App Preview / Simulated Launch Modal (Doherty Threshold & Error Prevention) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden border border-zinc-200 rounded-3xl bg-white shadow-2xl">
          {selectedApp && (
            <div className="flex flex-col">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-b from-purple-50/70 to-white border-b border-zinc-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-2xl bg-white border border-zinc-200 shadow-sm shrink-0">
                      {React.createElement(selectedApp.svgIcon, { className: "w-10 h-10" })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <DialogTitle className="text-lg font-display font-bold text-zinc-950">
                          {selectedApp.name}
                        </DialogTitle>
                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#EEF8A8] text-[#556000] border border-[#D0E244]">
                          {selectedApp.badge}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-500 mt-0.5">
                        {selectedApp.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body: Interactive Flow Per App */}
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {simSuccess ? (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto animate-in zoom-in-50 duration-300">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-display font-bold text-zinc-950">
                        {selectedApp.name} Connected!
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-600 font-sans max-w-sm mx-auto">
                        Transaction successfully settled from your primary StableBank custodial ledger. Details and invoice receipt sent to your email.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-600 text-left space-y-1">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Payment Rail:</span>
                        <span className="font-bold text-zinc-800">Bridge MPC Settlement</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Status:</span>
                        <span className="text-emerald-600 font-bold">Confirmed on-chain</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="w-full py-3 rounded-xl bg-zinc-900 text-white font-sans font-bold text-sm hover:bg-zinc-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    {/* eSIM Interactive Form */}
                    {selectedApp.id === "esim" && (
                      <div className="space-y-4 font-sans">
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">1. Select Destination Country</label>
                          <select 
                            value={esimCountry} 
                            onChange={(e) => setEsimCountry(e.target.value)}
                            className="mt-1.5 w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple"
                          >
                            <option value="Japan">🇯🇵 Japan (SoftBank / NTT Docomo 5G)</option>
                            <option value="United States">🇺🇸 United States (T-Mobile 5G Ultra)</option>
                            <option value="United Kingdom">🇬🇧 United Kingdom (EE / Vodafone)</option>
                            <option value="European Union">🇪🇺 European Union (33 Countries)</option>
                            <option value="United Arab Emirates">🇦🇪 United Arab Emirates (Etisalat 5G)</option>
                            <option value="Turkey">🇹🇷 Turkey (Turkcell 5G)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">2. Select Data Bundle</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-1.5">
                            {[
                              { label: "1GB", days: "7 Days", price: "$3.50" },
                              { label: "5GB", days: "30 Days", price: "$11.00", popular: true },
                              { label: "20GB", days: "30 Days", price: "$28.00" },
                            ].map((pkg) => (
                              <button
                                key={pkg.label}
                                type="button"
                                onClick={() => setEsimPlan(`${pkg.label} · ${pkg.days} (${pkg.price})`)}
                                className={cn(
                                  "p-3 rounded-xl border text-left transition-all cursor-pointer",
                                  esimPlan.startsWith(pkg.label)
                                    ? "border-brand-purple bg-purple-50/60 ring-2 ring-brand-purple/20"
                                    : "border-zinc-200 hover:border-zinc-300"
                                )}
                              >
                                {pkg.popular && (
                                  <span className="text-[9px] font-mono uppercase font-extrabold bg-[#EEF8A8] text-[#556000] px-1.5 py-0.5 rounded-full mb-1 inline-block">
                                    Best Value
                                  </span>
                                )}
                                <p className="font-bold text-sm text-zinc-900">{pkg.label}</p>
                                <p className="text-xs text-zinc-500 font-mono">{pkg.days}</p>
                                <p className="text-xs font-bold text-brand-purple mt-1">{pkg.price} USDT</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-brand-purple" />
                            Direct QR Code Delivery
                          </p>
                          <p className="text-purple-700">
                            Scan the QR code directly with your iPhone or Android eSIM settings for instant internet.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Flight Interactive Form */}
                    {selectedApp.id === "travel" && (
                      <div className="space-y-4 font-sans">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-mono font-bold text-zinc-500 uppercase">From</label>
                            <input 
                              type="text" 
                              value={flightFrom} 
                              onChange={(e) => setFlightFrom(e.target.value)}
                              className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-mono font-bold text-zinc-500 uppercase">To</label>
                            <input 
                              type="text" 
                              value={flightTo} 
                              onChange={(e) => setFlightTo(e.target.value)}
                              className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                            />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-1">
                          <p className="font-bold">Zero FX Markup Airline Partner Network</p>
                          <p className="text-blue-700">Directly priced in USDT with no 3-5% international conversion fees.</p>
                        </div>
                      </div>
                    )}

                    {/* Stays Interactive Form */}
                    {selectedApp.id === "stays" && (
                      <div className="space-y-4 font-sans">
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Destination</label>
                          <input 
                            type="text" 
                            value={stayCity} 
                            onChange={(e) => setStayCity(e.target.value)}
                            className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                          />
                        </div>
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <p className="font-bold">3% Points Cashback on All Stays</p>
                          <p className="text-amber-800">Earn rewards points automatically credited to your StableBank Tier status.</p>
                        </div>
                      </div>
                    )}

                    {/* Cabs Interactive Form */}
                    {selectedApp.id === "cabs" && (
                      <div className="space-y-4 font-sans">
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Pickup Location</label>
                          <input 
                            type="text" 
                            value={cabPickup} 
                            onChange={(e) => setCabPickup(e.target.value)}
                            className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Dropoff Destination</label>
                          <input 
                            type="text" 
                            value={cabDropoff} 
                            onChange={(e) => setCabDropoff(e.target.value)}
                            className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                          />
                        </div>
                      </div>
                    )}

                    {/* Utilities Interactive Form */}
                    {selectedApp.id === "utilities" && (
                      <div className="space-y-4 font-sans">
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Country & Utility</label>
                          <select 
                            value={utilType} 
                            onChange={(e) => setUtilType(e.target.value)}
                            className="mt-1.5 w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                          >
                            <option value="Electricity Pre-paid">⚡ Electricity (Pre-paid Token Voucher)</option>
                            <option value="Mobile Airtime & Data">📱 Mobile Airtime & High-Speed Data</option>
                            <option value="Fiber Broadband">🌐 Fiber Broadband & Cable Internet</option>
                            <option value="Municipal Water">💧 Municipal Water Utility</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Meter / Account ID</label>
                          <input 
                            type="text" 
                            value={utilMeter} 
                            onChange={(e) => setUtilMeter(e.target.value)}
                            className="mt-1.5 w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-sm font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Gift Cards Interactive Form */}
                    {selectedApp.id === "giftcards" && (
                      <div className="space-y-4 font-sans">
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Retailer Brand</label>
                          <select 
                            value={giftBrand} 
                            onChange={(e) => setGiftBrand(e.target.value)}
                            className="mt-1.5 w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm font-medium"
                          >
                            <option value="Apple Gift Card">🍏 Apple (App Store & iTunes)</option>
                            <option value="Amazon.com">📦 Amazon.com Worldwide</option>
                            <option value="Steam Wallet">🎮 Steam Gaming Wallet</option>
                            <option value="Netflix">🍿 Netflix Subscription</option>
                            <option value="Uber & Eats">🚗 Uber & Uber Eats</option>
                            <option value="Airbnb">🏡 Airbnb Stays Voucher</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-mono font-bold text-zinc-500 uppercase">Denomination</label>
                          <div className="grid grid-cols-4 gap-2 mt-1.5">
                            {["$25", "$50", "$100", "$250"].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => setGiftAmount(amt)}
                                className={cn(
                                  "py-2 rounded-xl border text-center font-bold text-sm font-mono cursor-pointer transition-all",
                                  giftAmount === amt
                                    ? "border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200"
                                    : "border-zinc-200 hover:border-zinc-300 text-zinc-700"
                                )}
                              >
                                {amt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General / Finance Interactive Details */}
                    {["dining", "vaults", "payroll", "tax"].includes(selectedApp.id) && (
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 font-sans">
                        <p className="text-xs font-semibold text-zinc-700">
                          {selectedApp.description}
                        </p>
                        <div className="space-y-1.5">
                          {selectedApp.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Confirmation Action (Von Restorff Effect & Doherty Threshold) */}
                    <div className="pt-2">
                      <button
                        onClick={() => handleSimulateAction(`Order for ${selectedApp.name}`)}
                        disabled={simLoading}
                        className="w-full py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.98]"
                      >
                        {simLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connecting via MPC Rail...</span>
                          </>
                        ) : (
                          <>
                            <span>Authorize with StableBank</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-zinc-400 font-mono text-center mt-2">
                        Zero gas fees · Immediate settlement via Bridge partner rails
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
