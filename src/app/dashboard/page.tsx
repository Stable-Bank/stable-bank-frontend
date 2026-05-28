"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBalance } from "@/hooks/useBalance";
import { cardService } from "@/services/cardService";
import { earnService } from "@/services/earnService";
import { transferService } from "@/services/transferService";
import { adminService } from "@/services/adminService";
import { apiClient } from "@/config/axios";
// import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import RecieveModal from "@/components/modal/recieve";
import SendTokenModal from "@/components/modal/send-token";
import { QRCodeSVG } from "qrcode.react";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { appRoutes } from "@/lib/navigation";
import Image from "next/image";
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
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  DollarSign,
  Star,
  Activity,
  Inbox,
  ArrowDownCircle,
  ArrowUpCircle,
  Repeat,
  Network,
  Lock,
  Target,
  Unlock,
  Users,
  BookOpen,
  ShieldAlert,
  Coins
} from "lucide-react";
import { cn } from "@/utils/cn";
import { TokenIcon, NetworkIcon } from "@web3icons/react/dynamic";

export default function UHome() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { balance, isLoading: isBalanceLoading, error: balanceError, refresh: refreshBalance } = useBalance(user?.walletAddress);

  // Send Token Modal State
  const [isSendOpen, setIsSendOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("send") === "true") {
      setIsSendOpen(true);
    }
  }, [searchParams]);

  // States for widgets
  const [cards, setCards] = useState<any[]>([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [earnSummary, setEarnSummary] = useState<any>(null);
  const [isEarnLoading, setIsEarnLoading] = useState(true);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [isTransfersLoading, setIsTransfersLoading] = useState(true);
  const [savingsBuckets, setSavingsBuckets] = useState<any[]>([]);
  const [isSavingsLoading, setIsSavingsLoading] = useState(true);
  const [hideZeroBalance, setHideZeroBalance] = useState(false);
  const [savingsDepositAmount, setSavingsDepositAmount] = useState<string>("");
  const [isDepositingSavings, setIsDepositingSavings] = useState(false);

  // Admin dashboard state
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminLedger, setAdminLedger] = useState<any[]>([]);
  const [adminSavings, setAdminSavings] = useState<any>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  const fetchAdminDashboardData = async () => {
    setIsAdminLoading(true);
    try {
      const [usersData, ledgerData, savingsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getLedger(),
        adminService.getSavings(),
      ]);
      setAdminUsers(usersData || []);
      setAdminLedger(ledgerData || []);
      setAdminSavings(savingsData || null);
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
    } finally {
      setIsAdminLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
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

    // Fetch Earn Summary
    try {
      setIsEarnLoading(true);
      const summary = await earnService.getEarnSummary();
      setEarnSummary(summary);
    } catch (err) {
      console.error("Failed to fetch earn summary:", err);
    } finally {
      setIsEarnLoading(false);
    }

    // Fetch Transfers
    try {
      setIsTransfersLoading(true);
      const history: any = await transferService.getTransferHistory();
      const historyList = Array.isArray(history) 
        ? history 
        : (history && Array.isArray(history.transfers) ? history.transfers : []);
      // Sort to show newest first
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
  };

  const pollDashboardData = async () => {
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
      const summary = await earnService.getEarnSummary();
      setEarnSummary(summary);
    } catch (err) {
      console.error("Failed to fetch earn summary silently:", err);
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
  };

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      pollDashboardData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user?.walletAddress]);

  const handleRefresh = async () => {
    try {
      await refreshBalance();
      await fetchDashboardData();
    } catch (err) {
      console.error("Manual refresh failed:", err);
    }
  };

  const handleSavingsQuickDeposit = async (bucketId: string) => {
    const amount = parseFloat(savingsDepositAmount);
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid deposit amount");
      return;
    }
    setIsDepositingSavings(true);
    try {
      await apiClient.post(`/savings/${bucketId}/deposit`, { amount });
      toast.success(`Deposited $${amount.toFixed(2)} to savings!`);
      setSavingsDepositAmount("");
      // Refresh savings and balance
      const { data } = await apiClient.get("/savings");
      setSavingsBuckets(data?.data || []);
      await refreshBalance();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setIsDepositingSavings(false);
    }
  };

  // Group tokens by symbol for a truly unified balance (no chain breakdown)
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

  // Get active savings bucket (highest progress first)
  const activeSavingsBucket = savingsBuckets.length > 0 
    ? [...savingsBuckets]
        .filter(b => b.status !== "completed")
        .sort((a, b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount))[0]
    : null;

  const topSavingsBuckets = savingsBuckets.length > 0
    ? [...savingsBuckets]
        .sort((a, b) => b.currentAmount - a.currentAmount)
        .slice(0, 3)
    : [];

  if (user?.role === "admin") {
    return (
      <div className="flex animate-in fade-in flex-col gap-8 pb-20 p-2 sm:p-4 lg:p-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-brand-purple/20 via-black/40 to-emerald-500/10 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-brand-purple/10 rounded-full blur-3xl" />
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-md bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-full font-bold border border-brand-purple/30 uppercase tracking-wider">
                Platform Administrator
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter">
              Welcome, <span className="bg-gradient-to-r from-brand-purple via-pink-400 to-[#E9F2A3] bg-clip-text text-transparent">System Admin</span>
            </h1>
            <p className="text-white/40 text-sm font-medium">
              Supervising StableBank&apos;s operations, virtual ledgers, and deposit stats. Logged in as <span className="text-white/70 font-bold">{user?.email}</span>
            </p>
          </div>
          <Button
            onClick={fetchAdminDashboardData}
            disabled={isAdminLoading}
            className="bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl h-12 px-5 border border-white/10 flex items-center gap-2.5 z-10 shrink-0 self-start md:self-center transition-all cursor-pointer"
          >
            <RefreshCcw size={16} className={cn(isAdminLoading && "animate-spin")} />
            Refresh Portal Data
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40 rounded-[24px] p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-md font-bold text-white/40 uppercase tracking-widest">Total Users</span>
              <div className="h-10 w-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <Users size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">{isAdminLoading ? "..." : adminUsers.length}</h2>
            <p className="text-md text-white/40 mt-1">Active platform accounts</p>
          </div>

          {/* Total Deposits */}
          <div className="overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40 rounded-[24px] p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E9F2A3]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-md font-bold text-white/40 uppercase tracking-widest">Total Deposits</span>
              <div className="h-10 w-10 rounded-xl bg-[#E9F2A3]/10 flex items-center justify-center text-[#E9F2A3]">
                <Coins size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-md text-white/40 mt-1">
              USDC: ${(adminSavings?.summary?.totalUSDC || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} | USDT: ${(adminSavings?.summary?.totalUSDT || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Utilizable Balance */}
          <div className="overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40 rounded-[24px] p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-md font-bold text-white/40 uppercase tracking-widest">Utilizable Balance</span>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingUp size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.utilizableBalance || ((adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0) * 0.8)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-md text-white/40 mt-1">80% available for yield allocation</p>
          </div>

          {/* Required Reserve */}
          <div className="overflow-hidden transition-all duration-300 border border-white/5 bg-[#0E121C]/50 backdrop-blur-md shadow-2xl shadow-black/40 rounded-[24px] p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-md font-bold text-white/40 uppercase tracking-widest">Required Reserve</span>
              <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                <ShieldCheck size={18} />
              </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {isAdminLoading ? "..." : `$${(adminSavings?.summary?.requiredReserve || ((adminSavings?.summary?.totalDeposits || adminSavings?.summary?.combinedSavings || 0) * 0.2)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </h2>
            <p className="text-md text-white/40 mt-1">20% liquidity buffer for safety</p>
          </div>
        </div>

        {/* Quick Links / Operations */}
        <div className="space-y-4">
          <h3 className="text-md font-bold text-white/40 uppercase tracking-widest">Administrative Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div 
              onClick={() => router.push("/dashboard/admin")}
              className="group cursor-pointer rounded-[24px] border border-white/5 bg-[#0A0D14]/80 hover:bg-[#0E121C]/50 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="h-12 w-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-4 group-hover:scale-105 transition-all">
                <Users size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-brand-purple transition-colors">Users & Admin Control</h4>
              <p className="text-md text-white/40 leading-relaxed">Promote roles, view KYC approvals, and verify profile details.</p>
              <ArrowRight size={14} className="text-brand-purple opacity-0 group-hover:opacity-100 absolute bottom-6 right-6 transition-all group-hover:translate-x-1" />
            </div>

            <div 
              onClick={() => router.push("/dashboard/admin")}
              className="group cursor-pointer rounded-[24px] border border-white/5 bg-[#0A0D14]/80 hover:bg-[#0E121C]/50 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-all">
                <BookOpen size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Internal Ledger Audit</h4>
              <p className="text-md text-white/40 leading-relaxed">Inspect, filter, and track all off-chain virtual tag transfers and user actions.</p>
              <ArrowRight size={14} className="text-blue-400 opacity-0 group-hover:opacity-100 absolute bottom-6 right-6 transition-all group-hover:translate-x-1" />
            </div>

            <div 
              onClick={() => router.push("/dashboard/admin")}
              className="group cursor-pointer rounded-[24px] border border-white/5 bg-[#0A0D14]/80 hover:bg-[#0E121C]/50 backdrop-blur-xl p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 relative"
            >
              <div className="h-12 w-12 rounded-2xl bg-[#E9F2A3]/10 border border-[#E9F2A3]/20 flex items-center justify-center text-[#E9F2A3] mb-4 group-hover:scale-105 transition-all">
                <TrendingUp size={22} />
              </div>
              <h4 className="text-base font-bold text-white mb-1 group-hover:text-[#E9F2A3] transition-colors">Deposits Leaderboard</h4>
              <p className="text-md text-white/40 leading-relaxed">Analyze overall liquidity pools, user deposit profiles, and utilization metrics.</p>
              <ArrowRight size={14} className="text-[#E9F2A3] opacity-0 group-hover:opacity-100 absolute bottom-6 right-6 transition-all group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Activity & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl flex flex-col">
            <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-brand-purple" /> Recent Users
            </h3>
            <div className="divide-y divide-white/5 flex flex-col flex-1">
              {isAdminLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-14 w-full bg-white/5 rounded-xl animate-pulse my-1.5" />)
              ) : adminUsers.slice(0, 5).map((u) => (
                <div key={u._id} className="py-3 flex justify-between items-center group transition-colors">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">{u.email}</span>
                    <span className="text-[10px] font-mono text-[#E9F2A3]">@{u.bankTag || "no tag"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded border uppercase",
                      u.role === "admin" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-white/5 text-white/40 border-white/10"
                    )}>
                      {u.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Operations */}
          <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl flex flex-col">
            <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-blue-400" /> Recent Operations
            </h3>
            <div className="divide-y divide-white/5 flex flex-col flex-1">
              {isAdminLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-14 w-full bg-white/5 rounded-xl animate-pulse my-1.5" />)
              ) : adminLedger.slice(0, 5).map((entry) => {
                const isPositive = entry.amount > 0;
                return (
                  <div key={entry._id} className="py-3 flex justify-between items-center group transition-colors">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white capitalize">{entry.type.replace("_", " ")}</span>
                      <span className="text-[10px] text-white/30 truncate max-w-[200px]" title={entry.description}>{entry.description}</span>
                    </div>
                    <div className="text-right">
                      <span className={cn("text-md font-mono font-bold block", isPositive ? "text-green-400" : "text-red-400")}>
                        {isPositive ? "+" : ""}{entry.amount.toFixed(2)} {entry.currency}
                      </span>
                      <span className="text-[9px] text-white/30 block">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-1 sm:p-2 lg:p-4 animate-in fade-in duration-700 pb-16">
      
      {/* Welcome Top Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter flex items-center gap-2">
            Welcome back, {user?.firstName || "Stable Member"} <Sparkles size={20} className="text-[#E9F2A3] animate-pulse" />
          </h1>
          <p className="text-white/40 text-sm mt-0.5">
            Monitor and manage your multi-chain digital assets and yields securely.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* Left Column (2/3 width on Desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
          
          {/* Redesigned Unified Balance Hero */}
          <div className="relative w-full rounded-[24px] bg-gradient-to-br from-[#0F1322] via-[#0B0E16] to-[#120D23] border border-white/5 px-6 py-6 sm:py-8 shadow-2xl overflow-hidden group">
            {/* Glowing background meshes */}
            <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none transition-all group-hover:bg-brand-purple/15 duration-700" />
            <div className="absolute -bottom-10 -left-10 w-[200px] h-[200px] bg-brand-yellow/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 z-10">
              <div className="space-y-1">
                <span className="text-sm font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={12} className="text-brand-purple" /> Unified Balance
                </span>
                
                {isBalanceLoading && !balance ? (
                  <div className="h-14 w-48 animate-pulse rounded-xl bg-white/10 mt-1" />
                ) : balanceError ? (
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-xl font-bold text-red-400">Unable to load balance</p>
                    <button 
                      onClick={handleRefresh}
                      className="w-fit text-sm font-semibold text-brand-purple hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2 mt-1">
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ${balance?.totalUSD?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                    </h2>
                    <span className="text-sm font-bold text-[#E9F2A3] bg-brand-purple/20 px-2 py-0.5 rounded-full border border-brand-purple/30">USD</span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-brand-yellow text-sm font-bold">
                    DeFi Earnings Active: ${balance?.defiBalanceUSD?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-4 sm:flex items-center gap-3 w-full sm:w-auto pt-4 sm:pt-0 border-t border-white/5 sm:border-t-0">
                {/* Send */}
                <button 
                  onClick={() => setIsSendOpen(true)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all duration-300 shadow-lg shadow-brand-purple/10 group-hover:scale-105 active:scale-95">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-white/50 group-hover:text-white transition-colors">Send</span>
                </button>

                {/* Deposit */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex flex-col items-center gap-1.5 group cursor-pointer">
                      <div className="h-12 w-12 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400 group-hover:bg-green-500 group-hover:text-black transition-all duration-300 shadow-lg shadow-green-500/5 group-hover:scale-105 active:scale-95">
                        <ArrowDownLeft size={20} />
                      </div>
                      <span className="text-[11px] font-bold text-white/50 group-hover:text-white transition-colors">Deposit</span>
                    </button>
                  </DialogTrigger>
                  <RecieveModal />
                </Dialog>

                {/* Savings / Yield */}
                <button 
                  onClick={() => router.push(appRoutes.dashboard.savings)}
                  className="flex flex-col items-center gap-1.5 group cursor-pointer"
                >
                  <div className="h-12 w-12 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow group-hover:bg-brand-yellow group-hover:text-black transition-all duration-300 shadow-lg shadow-brand-yellow/5 group-hover:scale-105 active:scale-95">
                    <PiggyBank size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-white/50 group-hover:text-white transition-colors">Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Assets Breakdown */}
          <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Asset Distribution <span className="text-sm text-white/40 font-medium font-mono">({totalAssetsCount})</span>
                </h3>
                <p className="text-white/40 text-sm mt-0.5">Your balances indexed across multi-chain wallets.</p>
              </div>

              <div className="flex items-center gap-3 text-sm font-bold text-white/50">
                <span>Hide Zero Balances</span>
                <button
                  type="button"
                  onClick={() => setHideZeroBalance(!hideZeroBalance)}
                  className={cn(
                    "relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0",
                    hideZeroBalance ? "bg-brand-purple" : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                      hideZeroBalance ? "translate-x-4.5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {isBalanceLoading && !balance ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <Inbox size={32} className="text-white/20 mb-2" />
                <p className="text-white/50 font-semibold text-sm">No assets found</p>
                <p className="text-white/30 text-sm mt-0.5">Deposit funds to get started or adjust filters</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 flex flex-col">
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
                              size={40}
                              className="rounded-xl overflow-hidden"
                              fallback={
                                <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center font-bold text-brand-purple text-sm">
                                  {token.symbol.charAt(0)}
                                </div>
                              }
                            />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-white">{token.name}</span>
                              <span className="text-sm font-semibold text-white/40 font-mono">{token.symbol}</span>
                            </div>
                          </div>
                        </div>

                        {/* Balance Details */}
                        <div className="text-right">
                          <p className="text-sm font-black text-[#E9F2A3]">${token.balanceUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <p className="text-sm font-semibold text-white/40 mt-0.5">
                            {token.balance.toFixed(4)} {token.symbol}
                          </p>
                        </div>

                      </div>

                      {/* Weight Line */}
                      <div className="w-full flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-purple rounded-full transition-all duration-1000"
                            style={{ width: `${percentageOfTotal}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-bold text-white/30 font-mono w-8 text-right">
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
          <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Activity size={18} className="text-brand-purple" /> Recent Transactions
                </h3>
                <p className="text-white/40 text-sm mt-0.5">Your recent inbound, outbound, and cross-chain transfers.</p>
              </div>
            </div>

            {isTransfersLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : transfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <Inbox size={32} className="text-white/20 mb-2" />
                <p className="text-white/50 font-semibold text-sm">No transaction history</p>
                <p className="text-white/30 text-sm mt-0.5">Your transaction operations will display here.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {transfers.slice(0, 5).map((tx) => {
                  const currentUserId = user?.id || (user as any)?._id;
                  const fromUserId = (tx.fromUserId as any)?._id || tx.fromUserId;
                  const isOutbound = 
                    fromUserId === currentUserId ||
                    (tx.fromAddress && user?.walletAddress && tx.fromAddress.toLowerCase() === user.walletAddress.toLowerCase());
                  
                  return (
                    <div 
                      key={tx.id} 
                      className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        {/* Transaction Icon */}
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                          tx.type === "cross_chain"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : isOutbound
                              ? "bg-red-500/10 border-red-500/20 text-red-400"
                              : "bg-green-500/10 border-green-500/20 text-green-400"
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
                            <span className="text-sm font-bold text-white">
                              {tx.type === "cross_chain" 
                                ? "Cross-Chain Bridge"
                                : isOutbound
                                  ? `Sent to $${tx.toBankTag || tx.toAddress.slice(0,6) + '...'}`
                                  : `Received from $${tx.fromBankTag || tx.fromAddress.slice(0,6) + '...'}`
                              }
                            </span>
                            
                            {/* Status Pill */}
                            <span className={cn(
                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border leading-none capitalize",
                              tx.status === "completed"
                                ? "bg-green-500/10 border-green-500/20 text-green-400"
                                : tx.status === "pending" || tx.status === "processing"
                                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 animate-pulse"
                                  : "bg-red-500/10 border-red-500/20 text-red-400"
                            )}>
                              {tx.status}
                            </span>
                          </div>

                          <div className="text-sm text-white/30 flex items-center gap-2 mt-0.5">
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

                      {/* Amounts */}
                      <div className="text-right self-end sm:self-center">
                        <p className={cn(
                          "text-sm font-black",
                          isOutbound ? "text-white" : "text-green-400"
                        )}>
                          {isOutbound ? "-" : "+"}{parseFloat(tx.amount).toFixed(2)} {tx.tokenSymbol}
                        </p>
                        <p className="text-[11px] font-semibold text-white/40 mt-0.5">
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

          {/* DeFi Staking Summary Card */}
          {/* <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <TrendingUp size={16} className="text-brand-purple" /> DeFi Staking Yield
                </h4>
                <p className="text-white/40 text-sm mt-0.5">High-yield compounding pools.</p>
              </div>
            </div>

            {isEarnLoading ? (
              <div className="h-[120px] w-full animate-pulse rounded-2xl bg-white/5" />
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Total Staked</span>
                    <span className="text-lg font-black text-white mt-1 block">
                      ${earnSummary?.totalStakedUSD?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl">
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Yield Earned</span>
                    <span className="text-lg font-black text-green-400 mt-1 block">
                      ${earnSummary?.totalEarnedUSD?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-brand-yellow fill-brand-yellow" />
                    <span className="text-sm font-bold text-white">Yield Pool APY:</span>
                  </div>
                  <span className="text-sm font-black text-brand-yellow">Up to 12.50%</span>
                </div>

                <Button 
                  onClick={() => router.push(appRoutes.dashboard.savings)}
                  className="w-full bg-brand-purple/20 border border-brand-purple/40 text-white hover:bg-brand-purple/35 rounded-xl font-bold text-sm h-10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Stake Assets Now <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </div> */}

          {/* Active Target Savings Widget */}
          <div className="rounded-[24px] bg-[#0A0D14]/80 backdrop-blur-xl border border-white/5 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <PiggyBank size={16} className="text-brand-purple" /> Savings & Locks
                </h4>
                <p className="text-white/40 text-sm mt-0.5">Top savings & locks by contribution.</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push(appRoutes.dashboard.savings)}
                className="text-brand-purple hover:text-brand-purple/80 hover:bg-brand-purple/10 flex items-center gap-1 text-sm font-bold shrink-0 p-1.5 cursor-pointer"
              >
                View All <ChevronRight size={14} />
              </Button>
            </div>

            {isSavingsLoading ? (
              <div className="flex flex-col gap-3">
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-white/5" />
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-white/5" />
                <div className="h-[70px] w-full animate-pulse rounded-2xl bg-white/5" />
              </div>
            ) : topSavingsBuckets.length > 0 ? (
              <div className="flex flex-col gap-4 divide-y divide-white/5">
                {topSavingsBuckets.map((bucket, index) => {
                  const isSafeLock = bucket.savingsType === "safelock";
                  const isPiggy = bucket.savingsType === "piggybank";
                  const isTarget = bucket.savingsType === "target";
                  const isFlex = bucket.savingsType === "flex";
                  
                  const progress = bucket.targetAmount > 0 
                    ? Math.min((bucket.currentAmount / bucket.targetAmount) * 100, 100)
                    : 0;

                  return (
                    <div key={bucket._id} className={cn("flex flex-col gap-2.5", index > 0 && "pt-4")}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center border",
                            isSafeLock ? "bg-brand-yellow/10 border-brand-yellow/30 text-brand-yellow" :
                            isPiggy ? "bg-brand-purple/10 border-brand-purple/30 text-brand-purple" :
                            isTarget ? "bg-[#319F43]/10 border-[#319F43]/30 text-[#319F43]" :
                            "bg-blue-500/10 border-blue-500/30 text-blue-400"
                          )}>
                            {isSafeLock ? <Lock size={16} /> : isPiggy ? <PiggyBank size={16} /> : isTarget ? <Target size={16} /> : <Unlock size={16} />}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block leading-snug">{bucket.name}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mt-0.5">
                              {isSafeLock ? "SafeLock" : isPiggy ? "Piggybank" : isTarget ? "Target Savings" : "Flex Wallet"} • {bucket.interestRate * 100}% APY
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-white block">
                            ${bucket.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {bucket.targetAmount > 0 && (
                            <span className="text-[10px] text-white/40 font-bold block mt-0.5">Goal: ${bucket.targetAmount.toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      {bucket.targetAmount > 0 && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-1000",
                                isSafeLock ? "bg-brand-yellow" :
                                isPiggy ? "bg-brand-purple" :
                                isTarget ? "bg-[#319F43]" : "bg-blue-500"
                              )}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-[#E9F2A3]">{progress.toFixed(1)}% Completed</span>
                            <span className="text-white/40">${Math.max(0, bucket.targetAmount - bucket.currentAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })} left</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center bg-white/[0.01]">
                <PiggyBank size={28} className="text-white/20 mb-2" />
                <p className="text-sm font-bold text-white">No active savings goals or locks</p>
                <p className="text-white/40 text-sm mt-1 max-w-[200px] leading-relaxed">
                  Start a SafeLock or Target Savings bucket and earn high yield.
                </p>
                <Button 
                  onClick={() => router.push(appRoutes.dashboard.savings)}
                  className="mt-4 bg-brand-purple text-white hover:bg-brand-purple/90 font-bold rounded-xl text-sm h-9 cursor-pointer"
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

    </div>
  );
}
