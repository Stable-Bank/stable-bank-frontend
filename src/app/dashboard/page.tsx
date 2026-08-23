"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { cardService } from "@/services/cardService";
import { transferService } from "@/services/transferService";
import { adminService } from "@/services/adminService";
import { apiClient } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RecieveModal from "@/components/modal/recieve";
import SendTokenModal from "@/components/modal/send-token";
import OnboardingModal from "@/components/modal/onboarding-modal";
import OnboardingBanner from "@/components/dashboard/onboarding-banner";
import BusinessKybGateway from "@/components/dashboard/business-kyb-gateway";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Wallet,
  ChevronRight,
  Plus,
  Copy,
  ArrowRight,
  Activity,
  Inbox,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Lock,
  Target,
  Unlock,
  Users,
  Coins,
  Check,
  Info,
  Eye,
  EyeOff,
  Gift,
  Percent
} from "lucide-react";
import { cn } from "@/utils/cn";
import { TokenIcon } from "@web3icons/react/dynamic";
import { USFlagIcon, UKFlagIcon, EUFlagIcon, MultiFlagIcon } from "@/components/ui/flag-icons";

// Accounts & Cards Tabbed Widget with SVG Flag Icons
type AccountsAndCardsWidgetProps = {
  cards: any[];
  isCardsLoading: boolean;
  router: any;
};

function AccountsAndCardsWidget({ cards, isCardsLoading, router }: AccountsAndCardsWidgetProps) {
  const [activeTab, setActiveTab] = useState<"accounts" | "cards">("accounts");
  const [activeCurrency, setActiveCurrency] = useState<"USD" | "GBP" | "EUR">("USD");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedField(null), 2000);
  };

  const accountDetails = {
    USD: {
      bankName: "StableBank Corp (New York)",
      routing: "021000021",
      accountNumber: "1002 9845 2371",
      icon: USFlagIcon,
      rail: "ACH / FedWire",
      details: [
        { label: "Routing Number", value: "021000021" },
        { label: "Account Number", value: "100298452371" },
        { label: "Bank Name", value: "StableBank Corp (New York)" },
        { label: "Beneficiary", value: "StableBank Ltd / User Account" }
      ]
    },
    GBP: {
      bankName: "StableBank UK Ltd (London)",
      sortCode: "20-45-12",
      accountNumber: "40982312",
      icon: UKFlagIcon,
      rail: "Faster Payments",
      details: [
        { label: "Sort Code", value: "20-45-12" },
        { label: "Account Number", value: "40982312" },
        { label: "Bank Name", value: "StableBank UK Ltd (London)" },
        { label: "Beneficiary", value: "StableBank Ltd / User Account" }
      ]
    },
    EUR: {
      bankName: "StableBank Europe AG (Frankfurt)",
      iban: "DE89 3704 0044 0532 0130 00",
      bic: "STBKDEFFXXX",
      icon: EUFlagIcon,
      rail: "SEPA Instant",
      details: [
        { label: "IBAN", value: "DE89370400440532013000" },
        { label: "BIC / SWIFT", value: "STBKDEFFXXX" },
        { label: "Bank Name", value: "StableBank Europe AG (Frankfurt)" },
        { label: "Beneficiary", value: "StableBank Ltd / User Account" }
      ]
    }
  };

  const activeAccount = accountDetails[activeCurrency];
  const primaryCard = cards.length > 0 ? cards[0] : null;

  return (
    <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm relative overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h4 className="text-base font-display font-bold text-zinc-950 tracking-tight flex items-center gap-2">
            <Wallet size={16} className="text-brand-purple" /> Accounts & Cards
          </h4>
          <p className="text-zinc-500 text-xs font-sans mt-0.5">Your virtual bank coordinates & cards.</p>
        </div>
      </div>

      {/* Panel Selector Tabs */}
      <div className="flex rounded-xl bg-zinc-100 border border-zinc-200 p-1 mb-5">
        <button
          onClick={() => setActiveTab("accounts")}
          className={cn(
            "flex-1 py-2 text-xs sm:text-sm font-sans font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5",
            activeTab === "accounts" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
          )}
        >
          <MultiFlagIcon className="w-5 h-4" />
          <span>Virtual Accounts</span>
        </button>
        <button
          onClick={() => setActiveTab("cards")}
          className={cn(
            "flex-1 py-2 text-xs sm:text-sm font-sans font-bold rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5",
            activeTab === "cards" ? "bg-brand-purple text-white shadow-xs" : "text-zinc-600 hover:text-zinc-950"
          )}
        >
          <CreditCard size={14} />
          <span>Virtual Cards</span>
        </button>
      </div>

      {activeTab === "accounts" ? (
        <div className="space-y-4">
          {/* Currency Subtabs with SVG Flags */}
          <div className="flex gap-2">
            {[
              { code: "USD" as const, name: "USD", icon: USFlagIcon },
              { code: "GBP" as const, name: "GBP", icon: UKFlagIcon },
              { code: "EUR" as const, name: "EUR", icon: EUFlagIcon },
            ].map((curr) => {
              const IconComponent = curr.icon;
              const isSelected = activeCurrency === curr.code;
              return (
                <button
                  key={curr.code}
                  onClick={() => setActiveCurrency(curr.code)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer",
                    isSelected
                      ? "bg-brand-purple/10 border-brand-purple text-brand-purple shadow-2xs"
                      : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{curr.name}</span>
                </button>
              );
            })}
          </div>

          {/* Account Details Box */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-2.5">
              <div className="flex items-center gap-2">
                <activeAccount.icon className="w-4 h-4" />
                <span className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">{activeAccount.bankName}</span>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {activeAccount.rail}
              </span>
            </div>
            
            <div className="space-y-2.5">
              {activeAccount.details.map((field) => (
                <div key={field.label} className="flex justify-between items-center gap-3 text-xs">
                  <span className="text-zinc-500 font-sans font-medium">{field.label}</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-zinc-900 font-mono font-bold truncate max-w-[180px]" title={field.value}>{field.value}</span>
                    <button
                      onClick={() => handleCopy(field.value, `${activeCurrency}-${field.label}`)}
                      className="p-1 rounded hover:bg-zinc-200/60 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer shrink-0"
                    >
                      {copiedField === `${activeCurrency}-${field.label}` ? (
                        <Check size={12} className="text-emerald-600" />
                      ) : (
                        <Copy size={12} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-[11px] text-brand-purple font-sans font-medium flex items-center gap-1.5 leading-snug">
            <Info size={13} className="shrink-0" />
            <span>Incoming wire deposits convert and credit into your stablecoin balance.</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {isCardsLoading ? (
            <div className="h-[140px] w-full animate-pulse rounded-2xl bg-zinc-100" />
          ) : primaryCard ? (
            <div className="space-y-4">
              {/* Glassmorphic micro-card */}
              <div 
                onClick={() => router.push(appRoutes.dashboard.vcard)}
                className="relative aspect-[1.586/1] w-full rounded-2xl p-4 sm:p-5 overflow-hidden border border-zinc-800 bg-gradient-to-br from-[#1c1830] via-[#0b0a14] to-[#121124] shadow-md flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-brand-purple)_0%,transparent_60%)] opacity-35 pointer-events-none" />
                <div className="relative flex justify-between items-start z-10">
                  <div>
                    <span className="text-[8px] font-mono font-bold tracking-widest text-white/50 uppercase">StableBank</span>
                    <h5 className="text-xs font-display font-bold text-white mt-0.5">Black Metal</h5>
                  </div>
                  <span className={cn(
                    "text-[8px] font-mono px-1.5 py-0.5 rounded font-bold uppercase",
                    primaryCard.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/60"
                  )}>
                    {primaryCard.status}
                  </span>
                </div>
                
                <div className="relative z-10 text-base sm:text-lg font-mono tracking-widest text-white font-bold select-all">
                  {primaryCard.cardNumber || "•••• •••• •••• 8492"}
                </div>

                <div className="relative flex justify-between items-end z-10 text-[9px]">
                  <div>
                    <span className="text-white/40 block uppercase font-mono">Card Holder</span>
                    <span className="font-semibold text-white truncate max-w-[120px]">{primaryCard.cardholderName || "Stable Member"}</span>
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <span className="text-white/40 block uppercase font-mono">Expires</span>
                      <span className="font-mono font-semibold text-white">
                        {primaryCard.expiryMonth && primaryCard.expiryYear 
                          ? `${primaryCard.expiryMonth}/${primaryCard.expiryYear.toString().slice(-2)}`
                          : "12/30"
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => router.push(appRoutes.dashboard.vcard)}
                className="w-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-900 rounded-xl font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                Manage Card Controls <ArrowRight size={14} />
              </Button>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-300 rounded-2xl p-5 text-center flex flex-col items-center justify-center bg-zinc-50">
              <CreditCard size={28} className="text-zinc-400 mb-2" />
              <p className="text-sm font-display font-bold text-zinc-950">No active virtual cards</p>
              <p className="text-zinc-500 text-xs mt-1 max-w-[200px] leading-relaxed font-sans">
                Generate a Visa card in seconds to spend stablecoins instantly.
              </p>
              <Button
                onClick={() => router.push(appRoutes.dashboard.vcard)}
                className="mt-4 bg-brand-purple text-white hover:bg-brand-purple/90 font-bold rounded-full text-xs h-9 cursor-pointer shadow-sm shadow-brand-purple/20"
              >
                <Plus size={14} className="mr-1" /> Create Card
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function UHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { balance, isLoading: isBalanceLoading, error: balanceError, refresh: refreshBalance } = useBalance(user?.walletAddress);

  // Send Token Modal State
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    if (searchParams.get("send") === "true") {
      setIsSendOpen(true);
    }
  }, [searchParams]);

  // States for widgets
  const [cards, setCards] = useState<any[]>([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [isTransfersLoading, setIsTransfersLoading] = useState(true);
  const [savingsBuckets, setSavingsBuckets] = useState<any[]>([]);
  const [isSavingsLoading, setIsSavingsLoading] = useState(true);
  const [hideZeroBalance, setHideZeroBalance] = useState(false);

  // Admin dashboard state
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminSavings, setAdminSavings] = useState<any>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const fetchAdminDashboardData = useCallback(async () => {
    setIsAdminLoading(true);
    try {
      const [usersData, savingsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getSavings(),
      ]);
      setAdminUsers(usersData || []);
      setAdminSavings(savingsData || null);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminDashboardData();
    }
  }, [user, fetchAdminDashboardData]);

  const fetchDashboardData = useCallback(async () => {
    if (!user?.walletAddress) return;

    // Fetch Cards
    try {
      setIsCardsLoading(true);
      const cardsData = await cardService.getUserCards();
      setCards(cardsData || []);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setIsCardsLoading(false);
    }

    // Fetch Transfers
    try {
      setIsTransfersLoading(true);
      const history: any = await transferService.getTransferHistory();
      const historyList = Array.isArray(history) 
        ? history 
        : (history && Array.isArray(history.transfers) ? history.transfers : []);
      const sortedHistory = [...historyList].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransfers(sortedHistory);
    } catch (err) {
      console.error("Failed to fetch transfers:", err);
    } finally {
      setIsTransfersLoading(false);
    }

    // Fetch Savings
    try {
      setIsSavingsLoading(true);
      const { data } = await apiClient.get("/savings");
      setSavingsBuckets(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch savings buckets:", err);
    } finally {
      setIsSavingsLoading(false);
    }
  }, [user?.walletAddress]);

  const pollDashboardData = useCallback(async () => {
    if (!user?.walletAddress) return;

    try {
      await refreshBalance();
    } catch (err) {
      console.error("Silent balance refresh failed:", err);
    }

    try {
      const cardsData = await cardService.getUserCards();
      setCards(cardsData || []);
    } catch (err) {
      console.error("Failed to fetch cards silently:", err);
    }

    try {
      const history: any = await transferService.getTransferHistory();
      const historyList = Array.isArray(history) 
        ? history 
        : (history && Array.isArray(history.transfers) ? history.transfers : []);
      const sortedHistory = [...historyList].sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setTransfers(sortedHistory);
    } catch (err) {
      console.error("Failed to fetch transfers silently:", err);
    }

    try {
      const { data } = await apiClient.get("/savings");
      setSavingsBuckets(data?.data || []);
    } catch (err) {
      console.error("Failed to fetch savings buckets silently:", err);
    }
  }, [user?.walletAddress, refreshBalance]);

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      pollDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user?.walletAddress, fetchDashboardData, pollDashboardData]);

  const handleRefresh = async () => {
    try {
      await refreshBalance();
      await fetchDashboardData();
    } catch (err) {
      console.error("Manual refresh failed:", err);
    }
  };

  // Group tokens by symbol for unified balance
  const groupedTokensMap: { [symbol: string]: any } = {};

  balance?.chains?.forEach(chain => {
    chain.tokens.forEach(token => {
      const sym = token.symbol.toUpperCase();
      if (!groupedTokensMap[sym]) {
        groupedTokensMap[sym] = {
          symbol: token.symbol,
          name: token.name,
          balance: 0,
          balanceUSD: 0,
          logoUrl: token.logoUrl,
        };
      }
      groupedTokensMap[sym].balance += parseFloat(token.balance) || 0;
      groupedTokensMap[sym].balanceUSD += token.balanceUSD || 0;
    });
  });

  const allTokens = Object.values(groupedTokensMap);
  const totalAssetsCount = allTokens.length;

  const filteredTokens = allTokens.filter(token => {
    if (hideZeroBalance && token.balanceUSD <= 0) return false;
    return true;
  });

  const topSavingsBuckets = savingsBuckets.length > 0
    ? [...savingsBuckets]
        .sort((a, b) => b.currentAmount - a.currentAmount)
        .slice(0, 3)
    : [];

  if (user?.role === "admin") {
    return (
      <div className="flex animate-in fade-in flex-col gap-8 pb-20 p-2 sm:p-4 lg:p-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-zinc-50 border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-mono font-bold border border-brand-purple/20 uppercase tracking-wider">
                Platform Administrator
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
              Welcome, <span className="text-brand-purple">System Admin</span>
            </h1>
            <p className="text-zinc-600 text-sm font-sans">
              Supervising StableBank&apos;s operations, virtual ledgers, and deposit stats. Logged in as <span className="text-zinc-900 font-bold">{user?.email}</span>
            </p>
          </div>
          <Button
            onClick={fetchAdminDashboardData}
            disabled={isAdminLoading}
            className="bg-white hover:bg-zinc-50 text-zinc-900 font-bold rounded-full h-12 px-5 border border-zinc-200 shadow-sm flex items-center gap-2.5 z-10 shrink-0 self-start md:self-center transition-all cursor-pointer"
          >
            <RefreshCcw size={16} className={cn(isAdminLoading && "animate-spin")} />
            Refresh Portal Data
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="overflow-hidden transition-all duration-300 border border-zinc-200 bg-white shadow-sm rounded-2xl p-6 relative group hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Total Users</span>
              <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Users size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">{isAdminLoading ? "..." : adminUsers.length}</h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">Active platform accounts</p>
          </div>

          {/* Total Deposits */}
          <div className="overflow-hidden transition-all duration-300 border border-zinc-200 bg-white shadow-sm rounded-2xl p-6 relative group hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Total Deposits</span>
              <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Coins size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">
              USDC: ${(adminSavings?.summary?.totalUSDC || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} | USDT: ${(adminSavings?.summary?.totalUSDT || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Utilizable Balance */}
          <div className="overflow-hidden transition-all duration-300 border border-zinc-200 bg-white shadow-sm rounded-2xl p-6 relative group hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Utilizable Balance</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.utilizableBalance || ((adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0) * 0.8)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">80% available for yield allocation</p>
          </div>

          {/* Required Reserve */}
          <div className="overflow-hidden transition-all duration-300 border border-zinc-200 bg-white shadow-sm rounded-2xl p-6 relative group hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest">Required Reserve</span>
              <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <Lock size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.requiredReserve || ((adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0) * 0.2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-xs text-zinc-500 font-sans mt-1">20% liquidity buffer for safety</p>
          </div>
        </div>
      </div>
    );
  }

  // Restrictive KYB Gatekeeper for Business Accounts
  if (user?.accountType === "business" && user?.kycStatus !== "approved") {
    return <BusinessKybGateway onRefreshStatus={handleRefresh} />;
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-1 sm:p-2 lg:p-4 animate-in fade-in duration-700 pb-20 max-w-[1440px] mx-auto w-full">
      
      {/* Onboarding & KYC Alert Banner (Non-Restrictive) */}
      <OnboardingBanner onStartOnboarding={() => setIsOnboardingOpen(true)} />

      {/* Top Portfolio Hero Card (Inspired by Modern FinTech Dashboard) */}
      <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white border border-indigo-100 p-6 sm:p-8 md:p-10 shadow-sm overflow-hidden group">
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 z-10">
          
          {/* Balance & Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                Portfolio Value · USD
              </span>
              <button 
                onClick={() => setHideBalance(!hideBalance)}
                className="text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer p-1"
                aria-label={hideBalance ? "Show balance" : "Hide balance"}
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {isBalanceLoading && !balance ? (
              <div className="h-14 w-56 animate-pulse rounded-2xl bg-zinc-200" />
            ) : balanceError ? (
              <div className="flex flex-col gap-1">
                <p className="text-2xl font-bold text-red-600 font-display">Unable to load portfolio</p>
                <button onClick={handleRefresh} className="w-fit text-sm font-semibold text-brand-purple hover:underline">
                  Try again
                </button>
              </div>
            ) : (
              <div className="flex items-baseline gap-3">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-mono font-black text-zinc-950 tracking-tight">
                  {hideBalance ? "••••••••" : `$${balance?.totalUSD?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`}
                </h1>
                <span className="text-xs font-mono font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded-full border border-brand-purple/20">
                  USD
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-emerald-700 text-xs font-bold font-mono">
                  DeFi Yield: ${balance?.defiBalanceUSD?.toFixed(2) || "0.00"}
                </p>
              </div>
              <div className="text-xs text-zinc-500 font-sans hidden sm:block">
                Protected by MPC Segregated Ledgers
              </div>
            </div>
          </div>

          {/* Quick Action Circular Buttons */}
          <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-around md:justify-end pt-4 md:pt-0 border-t border-zinc-200 md:border-t-0">
            {/* Deposit Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="h-14 w-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:bg-brand-purple group-hover:text-white group-hover:border-brand-purple transition-all duration-300 shadow-sm group-hover:scale-105 active:scale-95">
                    <ArrowDownLeft size={22} className="group-hover:translate-y-0.5 transition-transform" />
                  </div>
                  <span className="text-xs font-sans font-bold text-zinc-600 group-hover:text-brand-purple transition-colors">Deposit</span>
                </button>
              </DialogTrigger>
              <RecieveModal />
            </Dialog>

            {/* Send */}
            <button 
              onClick={() => setIsSendOpen(true)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="h-14 w-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:bg-brand-purple group-hover:text-white group-hover:border-brand-purple transition-all duration-300 shadow-sm group-hover:scale-105 active:scale-95">
                <ArrowUpRight size={22} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-xs font-sans font-bold text-zinc-600 group-hover:text-brand-purple transition-colors">Send</span>
            </button>

            {/* Swap */}
            <button 
              onClick={() => router.push(appRoutes.dashboard.invest)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="h-14 w-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:bg-brand-yellow group-hover:text-black group-hover:border-brand-yellow transition-all duration-300 shadow-sm group-hover:scale-105 active:scale-95">
                <Repeat size={22} />
              </div>
              <span className="text-xs font-sans font-bold text-zinc-600 group-hover:text-zinc-950 transition-colors">Swap</span>
            </button>

            {/* Save / Earn */}
            <button 
              onClick={() => router.push(appRoutes.dashboard.savings)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="h-14 w-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:bg-[#319F43] group-hover:text-white group-hover:border-[#319F43] transition-all duration-300 shadow-sm group-hover:scale-105 active:scale-95">
                <PiggyBank size={22} />
              </div>
              <span className="text-xs font-sans font-bold text-zinc-600 group-hover:text-zinc-950 transition-colors">Save</span>
            </button>
          </div>

        </div>
      </div>

      {/* Card Promo Banner ("Spend USDT Like Cash") */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-zinc-50 border border-zinc-200 p-6 sm:p-7 shadow-sm overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-11 rounded-xl bg-gradient-to-tr from-brand-purple to-indigo-900 border border-brand-purple/20 shadow-md flex items-center justify-center shrink-0">
            <CreditCard size={24} className="text-white drop-shadow-sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-display font-bold text-zinc-950">Get the Black Metal Card</h3>
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                3% Cashback
              </span>
            </div>
            <p className="text-sm text-zinc-600 font-sans mt-0.5">
              Spend your USDT & USDC like cash anywhere Visa is accepted worldwide with zero FX markup.
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.push(appRoutes.dashboard.vcard)}
          className="bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold rounded-full h-11 px-6 text-sm shrink-0 cursor-pointer shadow-sm shadow-brand-yellow/20"
        >
          {cards.length > 0 ? "Manage Card" : "Activate Card"}
        </Button>
      </div>

      {/* Feature Discovery Highlights Row (Inspired by Modern FinTech) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Feature 1: Virtual Accounts */}
        <div 
          onClick={() => router.push(appRoutes.dashboard.home)}
          className="rounded-2xl bg-white border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-brand-purple/40 transition-all duration-300 group cursor-pointer flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center shrink-0">
            <MultiFlagIcon className="w-7 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-display font-bold text-zinc-950 group-hover:text-brand-purple transition-colors truncate">
              Virtual USD, GBP & EUR
            </h4>
            <p className="text-xs text-zinc-500 font-sans mt-0.5 line-clamp-1">
              Direct wire coordinates with automatic stablecoin settlement.
            </p>
          </div>
        </div>

        {/* Feature 2: High Yield Vaults */}
        <div 
          onClick={() => router.push(appRoutes.dashboard.savings)}
          className="rounded-2xl bg-white border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-amber-400/40 transition-all duration-300 group cursor-pointer flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
            <Percent size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-display font-bold text-zinc-950 group-hover:text-amber-700 transition-colors truncate">
                High-Yield Vaults
              </h4>
              <span className="text-[10px] font-mono font-bold text-emerald-600">Up to 6.79%</span>
            </div>
            <p className="text-xs text-zinc-500 font-sans mt-0.5 line-clamp-1">
              Automated compounding yields on idle stable assets.
            </p>
          </div>
        </div>

        {/* Feature 3: Team & Rewards */}
        <div 
          onClick={() => router.push(appRoutes.dashboard.rewards)}
          className="rounded-2xl bg-white border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-emerald-400/40 transition-all duration-300 group cursor-pointer flex items-center gap-4"
        >
          <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 text-emerald-600">
            <Gift size={22} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-display font-bold text-zinc-950 group-hover:text-emerald-600 transition-colors truncate">
              Refer Friends & Earn
            </h4>
            <p className="text-xs text-zinc-500 font-sans mt-0.5 line-clamp-1">
              Earn lifetime rewards whenever your invited peers spend.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (2/3 width on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
          
          {/* Asset Distribution */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                  Asset Distribution <span className="text-xs text-zinc-400 font-mono font-semibold">({totalAssetsCount})</span>
                </h3>
                <p className="text-zinc-500 text-xs font-sans mt-0.5">Your balances indexed across multi-chain wallets.</p>
              </div>

              <div className="flex items-center gap-3 text-xs font-sans font-bold text-zinc-600">
                <span>Hide Zero Balances</span>
                <button
                  type="button"
                  onClick={() => setHideZeroBalance(!hideZeroBalance)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    hideZeroBalance ? "bg-brand-purple" : "bg-zinc-200"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out",
                      hideZeroBalance ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {isBalanceLoading && !balance ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-zinc-100" />
                ))}
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                <Inbox size={32} className="text-zinc-400 mb-2" />
                <p className="text-zinc-700 font-sans font-semibold text-sm">No assets found</p>
                <p className="text-zinc-400 font-sans text-xs mt-0.5">Deposit funds to get started or adjust filters</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 flex flex-col">
                {filteredTokens.map((token, i) => {
                  const percentageOfTotal = balance?.totalUSD && balance.totalUSD > 0
                    ? (token.balanceUSD / balance.totalUSD) * 100 
                    : 0;

                  return (
                    <div key={`${token.symbol}-${i}`} className="py-4 first:pt-0 last:pb-0 flex flex-col gap-2 group">
                      <div className="flex items-center justify-between">
                        
                        {/* Token Info */}
                        <div className="flex items-center gap-3">
                          <div className="relative group-hover:scale-105 transition-transform duration-300 shrink-0">
                            <TokenIcon
                              symbol={token.symbol.toLowerCase()}
                              variant="branded"
                              size={38}
                              className="rounded-xl overflow-hidden"
                              fallback={
                                <div className="h-9 w-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center font-bold text-brand-purple text-xs font-mono">
                                  {token.symbol.charAt(0)}
                                </div>
                              }
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-sans font-bold text-zinc-950">{token.name}</span>
                              <span className="text-xs font-semibold text-zinc-400 font-mono">{token.symbol}</span>
                            </div>
                          </div>
                        </div>

                        {/* Balance Details */}
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-zinc-950">
                            {hideBalance ? "••••" : `$${token.balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                          </p>
                          <p className="text-xs font-mono font-medium text-zinc-500 mt-0.5">
                            {hideBalance ? "••••" : `${token.balance.toFixed(4)} ${token.symbol}`}
                          </p>
                        </div>

                      </div>

                      {/* Weight Line */}
                      <div className="w-full flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-purple rounded-full transition-all duration-1000"
                            style={{ width: `${percentageOfTotal}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 font-mono w-8 text-right">
                          {percentageOfTotal.toFixed(1)}%
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transfers Activity */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 sm:p-7 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                  <Activity size={18} className="text-brand-purple" /> Recent Transactions
                </h3>
                <p className="text-zinc-500 font-sans text-xs mt-0.5">Inbound wires, on-chain deposits, and cross-chain transfers.</p>
              </div>
            </div>

            {isTransfersLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-zinc-100" />
                ))}
              </div>
            ) : transfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                <Inbox size={32} className="text-zinc-400 mb-2" />
                <p className="text-zinc-700 font-sans font-semibold text-sm">No transaction history</p>
                <p className="text-zinc-400 font-sans text-xs mt-0.5">Your incoming and outgoing transfers will display here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {transfers.slice(0, 5).map((tx) => {
                  const currentUserId = user?.id || (user as any)?._id;
                  const fromUserId = (tx.fromUserId as any)?._id || tx.fromUserId;
                  const isOutbound = 
                    fromUserId === currentUserId ||
                    (tx.fromAddress && user?.walletAddress && tx.fromAddress.toLowerCase() === user.walletAddress.toLowerCase());
                  
                  return (
                    <div 
                      key={tx.id} 
                      className="p-4 rounded-2xl bg-zinc-50/60 hover:bg-zinc-100/60 border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                          tx.type === "cross_chain"
                            ? "bg-purple-50 border-brand-purple/20 text-brand-purple"
                            : isOutbound
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "bg-emerald-50 border-emerald-200 text-emerald-600"
                        )}>
                          {tx.type === "cross_chain" ? (
                            <Repeat size={18} />
                          ) : isOutbound ? (
                            <ArrowUpCircle size={18} />
                          ) : (
                            <ArrowDownCircle size={18} />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-sans font-bold text-zinc-950">
                              {tx.type === "cross_chain" 
                                ? "Cross-Chain Bridge"
                                : isOutbound
                                  ? `Sent to $${tx.toBankTag || tx.toAddress.slice(0,6) + '...'}`
                                  : `Received from $${tx.fromBankTag || tx.fromAddress.slice(0,6) + '...'}`
                              }
                            </span>
                            
                            <span className={cn(
                              "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border leading-none capitalize",
                              tx.status === "completed"
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                : tx.status === "pending" || tx.status === "processing"
                                  ? "bg-amber-50 border-amber-200 text-amber-700 animate-pulse"
                                  : "bg-red-50 border-red-200 text-red-700"
                            )}>
                              {tx.status}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-500 font-sans flex items-center gap-2 mt-0.5">
                            <span>
                              {new Date(tx.createdAt).toLocaleDateString(undefined, { 
                                month: "short", 
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </span>
                            <span>•</span>
                            <span className="capitalize font-mono">
                              {tx.type === "cross_chain" 
                                ? "Bridge Route"
                                : `Direct transfer`
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right self-end sm:self-center">
                        <p className={cn(
                          "text-sm font-mono font-black",
                          isOutbound ? "text-zinc-950" : "text-emerald-600"
                        )}>
                          {isOutbound ? "-" : "+"}{parseFloat(tx.amount).toFixed(2)} {tx.tokenSymbol}
                        </p>
                        <p className="text-[11px] font-mono font-semibold text-zinc-500 mt-0.5">
                          ${tx.amountUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3 width on Desktop) */}
        <div className="flex flex-col gap-6 sm:gap-8">

          {/* Accounts & Cards Control Panel with SVG Flag Icons */}
          <AccountsAndCardsWidget cards={cards} isCardsLoading={isCardsLoading} router={router} />

          {/* Active Target Savings Widget */}
          <div className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-base font-display font-bold text-zinc-950 tracking-tight flex items-center gap-2">
                  <PiggyBank size={16} className="text-brand-purple" /> Savings & Locks
                </h4>
                <p className="text-zinc-500 font-sans text-xs mt-0.5">Top active savings & yield buckets.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(appRoutes.dashboard.savings)}
                className="text-brand-purple hover:text-brand-purple hover:bg-brand-purple/10 flex items-center gap-1 text-xs font-bold shrink-0 p-1.5 cursor-pointer font-sans"
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>

            {isSavingsLoading ? (
              <div className="flex flex-col gap-3">
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-zinc-100" />
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-zinc-100" />
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-zinc-100" />
              </div>
            ) : topSavingsBuckets.length > 0 ? (
              <div className="flex flex-col gap-4 divide-y divide-zinc-100">
                {topSavingsBuckets.map((bucket, index) => {
                  const isSafeLock = bucket.savingsType === "safelock";
                  const isPiggy = bucket.savingsType === "piggybank";
                  const isTarget = bucket.savingsType === "target";
                  
                  const progress = bucket.targetAmount > 0 
                    ? Math.min((bucket.currentAmount / bucket.targetAmount) * 100, 100)
                    : 0;

                  return (
                    <div key={bucket._id} className={cn("flex flex-col gap-2.5", index > 0 && "pt-4")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center border",
                            isSafeLock ? "bg-amber-50 border-amber-200 text-amber-700" :
                            isPiggy ? "bg-brand-purple/10 border-brand-purple/20 text-brand-purple" :
                            isTarget ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
                            "bg-purple-50 border-brand-purple/20 text-brand-purple"
                          )}>
                            {isSafeLock ? <Lock size={16} /> : isPiggy ? <PiggyBank size={16} /> : isTarget ? <Target size={16} /> : <Unlock size={16} />}
                          </div>
                          <div>
                            <span className="text-sm font-sans font-bold text-zinc-950 block leading-snug">{bucket.name}</span>
                            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest block mt-0.5">
                              {isSafeLock ? "SafeLock" : isPiggy ? "Piggybank" : isTarget ? "Target Savings" : "Flex Wallet"} • {bucket.interestRate * 100}% APY
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-mono font-bold text-zinc-950 block">
                            ${bucket.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {bucket.targetAmount > 0 && (
                            <span className="text-[10px] font-mono text-zinc-500 font-bold block mt-0.5">Goal: ${bucket.targetAmount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {bucket.targetAmount > 0 && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                isSafeLock ? "bg-amber-500" :
                                isPiggy ? "bg-brand-purple" :
                                isTarget ? "bg-emerald-500" : "bg-brand-purple"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-mono font-bold">
                            <span className="text-brand-purple">{progress.toFixed(1)}% Completed</span>
                            <span className="text-zinc-500">${Math.max(0, bucket.targetAmount - bucket.currentAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} left</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-zinc-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center bg-zinc-50">
                <PiggyBank size={28} className="text-zinc-400 mb-2" />
                <p className="text-sm font-display font-bold text-zinc-950">No active savings goals or locks</p>
                <p className="text-zinc-500 font-sans text-xs mt-1 max-w-[200px] leading-relaxed">
                  Start a SafeLock or Target Savings bucket and earn high yield.
                </p>
                <Button 
                  onClick={() => router.push(appRoutes.dashboard.savings)}
                  className="mt-4 bg-brand-purple text-white hover:bg-brand-purple/90 font-bold rounded-full text-xs h-9 cursor-pointer shadow-sm shadow-brand-purple/20"
                >
                  <Plus size={14} className="mr-1" /> Get Started
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Send Token Multistep Modal */}
      <Dialog open={isSendOpen} onOpenChange={(open) => {
        if (!open) {
          setIsSendOpen(false);
          if (searchParams.get("send") === "true") {
            router.replace(appRoutes.dashboard.home);
          }
        }
      }}>
        {isSendOpen && (
          <SendTokenModal
            balance={balance}
            onSuccess={handleRefresh}
            onClose={() => {
              setIsSendOpen(false);
              if (searchParams.get("send") === "true") {
                router.replace(appRoutes.dashboard.home);
              }
            }}
          />
        )}
      </Dialog>

      {/* Onboarding & Identity Verification Multi-Step Modal */}
      <OnboardingModal
        open={isOnboardingOpen}
        onOpenChange={setIsOnboardingOpen}
        onComplete={handleRefresh}
      />

    </div>
  );
}
