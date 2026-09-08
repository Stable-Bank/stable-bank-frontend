"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  Coins,
  Search,
  ShieldAlert,
  RefreshCw,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Radio,
  Activity,
  FileText,
  ChevronRight,
  Eye,
  Ban,
  User,
  AlertTriangle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import {
  adminService,
  AdminUser,
  LedgerEntry,
  SavingsSummary,
  AdminStats,
  AuditLogItem,
  AdminUserDeepDive,
} from "@/services/adminService";

const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Card className={cn("overflow-hidden transition-all duration-200 border border-zinc-200 bg-white shadow-sm rounded-2xl", className)}>
    <CardContent className="p-6">
      {children}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "ledger" | "savings" | "users">("overview");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [savings, setSavings] = useState<SavingsSummary | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Live SSE stream state
  const [streamConnected, setStreamConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState<AuditLogItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditLogItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Search/Filter states
  const [userQuery, setUserQuery] = useState("");
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>("all");
  const [promoteEmail, setPromoteEmail] = useState("");
  const [submittingPromote, setSubmittingPromote] = useState(false);

  // User Deep Dive modal
  const [deepDiveUserId, setDeepDiveUserId] = useState<string | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<AdminUserDeepDive | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  // User Restriction modal
  const [restrictingUser, setRestrictingUser] = useState<{
    id: string;
    email: string;
    isRestricted: boolean;
  } | null>(null);
  const [restrictReason, setRestrictReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submittingRestriction, setSubmittingRestriction] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersData, ledgerData, savingsData, statsData, initialLogsData] = await Promise.all([
        adminService.getUsers(),
        adminService.getLedger(),
        adminService.getSavings(),
        adminService.getAdminStats().catch(() => null),
        adminService.getAuditLogs({ limit: 20 }).catch(() => ({ logs: [] })),
      ]);
      setUsers(usersData);
      setLedger(ledgerData);
      setSavings(savingsData);
      if (statsData) setStats(statsData);
      if (initialLogsData && initialLogsData.logs) {
        setLiveEvents(initialLogsData.logs);
        if (initialLogsData.logs.length > 0 && !selectedEvent) {
          setSelectedEvent(initialLogsData.logs[0]);
        }
      }
    } catch (error: any) {
      console.error("Failed to load admin dashboard data", error);
      toast.error(error.message || "Unauthorized or failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Connect to live SSE audit stream
    const disconnect = adminService.connectAuditStream(
      (newEvent) => {
        setLiveEvents((prev) => [newEvent, ...prev.slice(0, 49)]);
        if (!selectedEvent) {
          setSelectedEvent(newEvent);
        }
      },
      () => setStreamConnected(true),
      () => setStreamConnected(false)
    );

    return () => {
      disconnect();
    };
  }, []);

  const handlePromote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoteEmail) return toast.error("Please enter a user email");
    setSubmittingPromote(true);
    try {
      const response = await adminService.promoteUser(promoteEmail);
      toast.success(response.message || "User promoted to admin!");
      setPromoteEmail("");
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Failed to promote user.");
    } finally {
      setSubmittingPromote(false);
    }
  };

  const openDeepDive = async (userId: string) => {
    setDeepDiveUserId(userId);
    setLoadingDeepDive(true);
    try {
      const data = await adminService.getUserDeepDive(userId);
      setDeepDiveData(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load user deep dive");
      setDeepDiveUserId(null);
    } finally {
      setLoadingDeepDive(false);
    }
  };

  const handleApplyRestriction = async () => {
    if (!restrictingUser) return;
    const finalReason = restrictReason === "Custom" ? customReason : restrictReason;
    if (restrictingUser.isRestricted === false && !finalReason) {
      toast.error("Please provide a reason for restricting this user");
      return;
    }

    setSubmittingRestriction(true);
    try {
      const newStatus = !restrictingUser.isRestricted;
      await adminService.restrictUser(restrictingUser.id, newStatus, finalReason);
      toast.success(newStatus ? "User restricted" : "User restriction lifted");

      // Update user in local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === restrictingUser.id
            ? { ...u, isRestricted: newStatus, restrictedReason: newStatus ? finalReason : undefined }
            : u
        )
      );

      if (deepDiveData && deepDiveData.user._id === restrictingUser.id) {
        setDeepDiveData({
          ...deepDiveData,
          user: {
            ...deepDiveData.user,
            isRestricted: newStatus,
            restrictedReason: newStatus ? finalReason : undefined,
          },
        });
      }

      setRestrictingUser(null);
      setRestrictReason("");
      setCustomReason("");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user restriction");
    } finally {
      setSubmittingRestriction(false);
    }
  };

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "auth":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "transaction":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "card":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "savings":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "compliance":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "security":
        return "bg-red-50 text-red-700 border-red-200";
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const getSeverityBadgeClass = (sev: string) => {
    switch (sev) {
      case "critical":
        return "bg-red-600 text-white font-bold";
      case "error":
        return "bg-red-100 text-red-700 border border-red-200 font-semibold";
      case "warning":
        return "bg-amber-100 text-amber-800 border border-amber-200 font-semibold";
      default:
        return "bg-zinc-100 text-zinc-600 border border-zinc-200 font-medium";
    }
  };

  const getStatusBadgeClass = (st: string) => {
    switch (st) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "failed":
        return "bg-red-50 text-red-700 border-red-200";
      case "blocked":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  // Filtered lists
  const filteredUsers = users.filter((u) => {
    const q = userQuery.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      (u.bankTag && u.bankTag.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const filteredLedger = ledger.filter((l) => {
    if (ledgerTypeFilter === "all") return true;
    if (ledgerTypeFilter === "stable_tags") {
      return l.type === "transfer_in" || l.type === "transfer_out" || l.rawType === "p2p_internal";
    }
    if (ledgerTypeFilter === "deposit") {
      return l.type === "deposit" || l.rawType === "onramp";
    }
    if (ledgerTypeFilter === "withdrawal") {
      return (
        l.type === "withdrawal" ||
        l.rawType === "offramp" ||
        l.rawType === "crypto_outbound" ||
        l.rawType === "operational_withdrawal"
      );
    }
    return l.type === ledgerTypeFilter || l.rawType === ledgerTypeFilter;
  });

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight flex items-center gap-3">
            Admin Control Hub
            <span className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1 rounded-full font-mono font-bold border border-brand-purple/20 uppercase tracking-wider">
              Superuser
            </span>
            <div
              className={cn(
                "hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-full border",
                streamConnected
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-zinc-100 text-zinc-500 border-zinc-200"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  streamConnected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                )}
              />
              {streamConnected ? "LIVE AUDIT ACTIVE" : "STREAM OFFLINE"}
            </div>
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base max-w-[700px] font-sans">
            Real-time platform activity streaming, multi-rail virtual ledgers, actor governance, and comprehensive audit monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/audit-logs"
            className="border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-sans font-semibold rounded-xl h-11 px-4 flex items-center gap-2 text-sm transition-colors cursor-pointer"
          >
            <Activity size={16} className="text-brand-purple" />
            Audit Explorer ↗
          </Link>
          <Button
            onClick={fetchData}
            disabled={loading}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-xl h-11 px-5 flex items-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
            Reload
          </Button>
        </div>
      </div>

      {/* Top KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Users & Governance */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Platform Users
            </span>
            <div className="h-9 w-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
              <Users size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
            {stats?.users?.total ?? users.length}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-emerald-600 font-mono font-bold">
              {stats?.users?.approvedKyc ?? 0} KYC Verified
            </span>
            {stats?.users?.restricted ? (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">
                {stats.users.restricted} Restricted
              </span>
            ) : null}
          </div>
        </GlassCard>

        {/* KPI 2: Total Volume / Deposits */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Total Deposits
            </span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Coins size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-mono font-black text-zinc-950 tracking-tight">
            ${(savings?.summary?.totalDeposits || savings?.summary?.combinedSavings || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            USDC: ${(savings?.summary?.totalUSDC || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} | USDT: ${(savings?.summary?.totalUSDT || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </GlassCard>

        {/* KPI 3: 24h Audit Activity */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Audit Events (24h)
            </span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Activity size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-mono font-black text-blue-600 tracking-tight">
            {(stats?.auditLogs24h?.total ?? liveEvents.length).toLocaleString()}
          </h2>
          <div className="flex items-center gap-2 mt-1.5 text-xs font-sans text-zinc-500">
            <span>Auth: {stats?.auditLogs24h?.auth ?? 0}</span>
            <span>·</span>
            <span>Tx: {stats?.auditLogs24h?.transactions ?? 0}</span>
            <span>·</span>
            <span className={cn(stats?.auditLogs24h?.errors ? "text-red-600 font-bold" : "")}>
              Err: {stats?.auditLogs24h?.errors ?? 0}
            </span>
          </div>
        </GlassCard>

        {/* KPI 4: Liquidity Buffer */}
        <GlassCard className="relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              Liquidity Buffer (20%)
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ShieldCheck size={18} />
            </div>
          </div>
          <h2 className="text-3xl font-mono font-black text-emerald-600 tracking-tight">
            ${(savings?.summary?.requiredReserve || ((savings?.summary?.totalDeposits || savings?.summary?.combinedSavings || 0) * 0.2)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="text-xs text-zinc-500 font-sans mt-1">
            Utilizable: ${(savings?.summary?.utilizableBalance || ((savings?.summary?.totalDeposits || savings?.summary?.combinedSavings || 0) * 0.8)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </p>
        </GlassCard>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-zinc-200 gap-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "overview" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <Radio size={16} className={cn(streamConnected && "text-emerald-500 animate-pulse")} />
            Live Audit Stream
          </span>
          {activeTab === "overview" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("ledger")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "ledger" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <BookOpen size={16} /> Internal Ledger
          </span>
          {activeTab === "ledger" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("savings")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "savings" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <TrendingUp size={16} /> Deposits Leaderboard
          </span>
          {activeTab === "savings" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "pb-3 text-sm font-sans font-bold transition-all relative outline-none cursor-pointer",
            activeTab === "users" ? "text-brand-purple font-extrabold" : "text-zinc-500 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-2">
            <Users size={16} /> Users & Privileges
          </span>
          {activeTab === "users" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full animate-in fade-in" />
          )}
        </button>
      </div>

      {/* Tab Contents */}
      {loading ? (
        <div className="space-y-6">
          <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          {/* TAB 0: LIVE AUDIT STREAM & INSPECTOR (ZIZZ ARCHITECTURE) */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Column: Live Activity Feed (2 Cols) */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                      <Radio size={14} className="animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-base font-display font-bold text-zinc-950">
                        Real-Time Platform Activity Stream
                      </h3>
                      <p className="text-xs text-zinc-500 font-sans">
                        Streaming authentication, transfers, cards, savings, and security checks
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard/admin/audit-logs"
                    className="text-xs font-mono font-bold text-brand-purple hover:underline flex items-center gap-1"
                  >
                    View All Logs <ChevronRight size={14} />
                  </Link>
                </div>

                <GlassCard className="p-0 overflow-hidden">
                  <div className="flex flex-col divide-y divide-zinc-100 max-h-[580px] overflow-y-auto">
                    {liveEvents.length === 0 ? (
                      <div className="py-16 text-center flex flex-col items-center justify-center gap-2 text-zinc-400">
                        <Activity size={24} className="animate-spin text-brand-purple" />
                        <p className="text-xs font-mono">Listening for live platform audit events...</p>
                      </div>
                    ) : (
                      liveEvents.map((evt, idx) => {
                        const isSelected = selectedEvent?._id === evt._id;
                        const actor =
                          evt.actorBankTag
                            ? `@${evt.actorBankTag}`
                            : evt.actorEmail || evt.actorRole;

                        return (
                          <div
                            key={evt._id || idx}
                            onClick={() => setSelectedEvent(evt)}
                            className={cn(
                              "p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs",
                              isSelected ? "bg-brand-purple/5 border-l-4 border-l-brand-purple" : "hover:bg-zinc-50",
                              idx === 0 && "animate-in fade-in slide-in-from-top-2 duration-300"
                            )}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <span
                                className={cn(
                                  "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0",
                                  getCategoryBadgeClass(evt.category)
                                )}
                              >
                                {evt.category}
                              </span>

                              <div className="overflow-hidden min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-zinc-900 text-[11px] truncate">
                                    {evt.action}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border",
                                      getStatusBadgeClass(evt.status)
                                    )}
                                  >
                                    {evt.status}
                                  </span>
                                </div>
                                <p className="text-zinc-500 text-[11px] truncate font-sans mt-0.5">
                                  {evt.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end shrink-0 pl-2">
                              <span className="font-mono text-[10px] text-zinc-400">
                                {new Date(evt.timestamp).toLocaleTimeString()}
                              </span>
                              <span className="font-sans font-bold text-zinc-700 text-[10px] truncate max-w-[120px]">
                                {actor}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </GlassCard>
              </div>

              {/* Right Column: Live Event Inspector Pane */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20 flex items-center justify-center">
                      <FileText size={14} />
                    </div>
                    <h3 className="text-base font-display font-bold text-zinc-950">
                      Live Inspector
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {selectedEvent ? selectedEvent._id?.slice(-8) : "NO EVENT"}
                  </span>
                </div>

                <GlassCard className="space-y-4">
                  {selectedEvent ? (
                    <div className="space-y-4 text-xs">
                      {/* Description Banner */}
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono font-bold uppercase text-zinc-400 block">
                          Action Summary
                        </span>
                        <p className="font-sans font-bold text-zinc-950 text-xs">
                          {selectedEvent.description}
                        </p>
                      </div>

                      {/* Pill tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className={cn("text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border", getCategoryBadgeClass(selectedEvent.category))}>
                          {selectedEvent.category}
                        </span>
                        <span className={cn("text-[10px] font-mono uppercase px-2 py-0.5 rounded border", getStatusBadgeClass(selectedEvent.status))}>
                          {selectedEvent.status}
                        </span>
                        <span className={cn("text-[10px] font-mono uppercase px-2 py-0.5 rounded", getSeverityBadgeClass(selectedEvent.severity))}>
                          {selectedEvent.severity}
                        </span>
                      </div>

                      {/* Actor & Context */}
                      <div className="p-3 border border-zinc-200 rounded-xl space-y-2 bg-white">
                        <div className="flex items-center justify-between text-zinc-400 font-mono text-[10px] uppercase font-bold">
                          <span>Actor Profile</span>
                          <span className="text-brand-purple">{selectedEvent.actorRole}</span>
                        </div>
                        <div className="font-sans font-bold text-zinc-950">
                          {selectedEvent.actorBankTag ? `@${selectedEvent.actorBankTag}` : selectedEvent.actorEmail || "System"}
                        </div>
                        {selectedEvent.actorEmail && (
                          <div className="text-zinc-500 text-[11px]">{selectedEvent.actorEmail}</div>
                        )}
                        <div className="font-mono text-[10px] text-zinc-500 pt-1 border-t border-zinc-100 flex items-center justify-between">
                          <span>IP: {selectedEvent.actorIp || "127.0.0.1"}</span>
                          <span>{selectedEvent.deviceInfo?.browser || "Device"}</span>
                        </div>
                      </div>

                      {/* Details JSON */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">
                            Payload Details
                          </span>
                          <button
                            onClick={() => handleCopyJson(selectedEvent.details || selectedEvent)}
                            className="text-[10px] font-sans font-bold text-zinc-600 hover:text-brand-purple flex items-center gap-1 cursor-pointer"
                          >
                            {copied ? <Check size={10} className="text-emerald-600" /> : <Copy size={10} />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <pre className="p-3 bg-zinc-950 text-zinc-200 rounded-xl font-mono text-[10px] max-h-48 overflow-y-auto leading-relaxed">
                          {JSON.stringify(selectedEvent.details || {}, null, 2)}
                        </pre>
                      </div>

                      {/* Action buttons */}
                      {selectedEvent.actorId && (
                        <div className="pt-2 flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const uid =
                                typeof selectedEvent.actorId === "object"
                                  ? selectedEvent.actorId?._id
                                  : selectedEvent.actorId;
                              if (uid) openDeepDive(uid);
                            }}
                            className="w-full text-xs font-semibold border-zinc-200 cursor-pointer"
                          >
                            <User size={14} className="mr-1.5 text-brand-purple" />
                            Deep Dive Actor Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-zinc-400 font-sans text-xs">
                      Select an event from the live stream to inspect its metadata.
                    </div>
                  )}
                </GlassCard>
              </div>
            </div>
          )}

          {/* TAB 1: LEDGER */}
          {activeTab === "ledger" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-xl font-display font-bold text-zinc-950">Multi-Rail Financial Ledger Log</h3>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider shrink-0">Filter Type:</span>
                  <select
                    value={ledgerTypeFilter}
                    onChange={(e) => setLedgerTypeFilter(e.target.value)}
                    className="bg-white border border-zinc-200 rounded-xl px-4 py-2 text-xs font-sans font-semibold text-zinc-800 outline-none focus:border-brand-purple transition-colors cursor-pointer"
                  >
                    <option value="all">All Operations</option>
                    <option value="stable_tags">P2P Stable Tags</option>
                    <option value="deposit">Inbound Deposits (Wire/ACH)</option>
                    <option value="withdrawal">Outbound Withdrawals</option>
                    <option value="card_purchase">Visa Card Purchases</option>
                    <option value="operational_withdrawal">Admin Operational</option>
                  </select>
                </div>
              </div>

              <GlassCard className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">User / Email</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Type / Rail</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Asset</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Status / State</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Description</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Reference / Hash</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedger.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500 font-sans text-sm">
                          No ledger records found matching filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLedger.map((entry) => {
                        const amountVal = entry.amount || 0;
                        const isPositive = entry.type === "deposit" || entry.type === "transfer_in";
                        const isStableTag = entry.type === "transfer_in" || entry.type === "transfer_out" || entry.rawType === "p2p_internal";
                        const isCompleted = entry.status === "completed" || entry.state === "completed" || entry.state === "payment_processed";

                        return (
                          <tr key={entry._id || entry.id || Math.random()} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="font-sans font-bold text-zinc-950 text-sm">
                                  {entry.userId?.firstName ? `${entry.userId.firstName} ${entry.userId.lastName}` : (entry.userId?.bankTag ? `@${entry.userId.bankTag}` : "Platform User")}
                                </span>
                                <span className="text-xs text-zinc-500 font-sans">{entry.userId?.email || "unknown@stablebank"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <span className={cn(
                                  "text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border inline-block w-fit",
                                  (entry.type === "deposit" || entry.rawType === "onramp") && "bg-emerald-50 text-emerald-700 border-emerald-200",
                                  (entry.type === "withdrawal" || entry.rawType === "offramp" || entry.rawType === "operational_withdrawal") && "bg-red-50 text-red-700 border-red-200",
                                  isStableTag && "bg-purple-50 text-brand-purple border-purple-200",
                                  entry.type === "card_purchase" && "bg-blue-50 text-blue-700 border-blue-200",
                                  entry.type === "reward" && "bg-amber-50 text-amber-700 border-amber-200",
                                  entry.type === "fee" && "bg-zinc-100 text-zinc-700 border-zinc-200"
                                )}>
                                  {entry.type ? String(entry.type).replace("_", " ") : "transfer"}
                                </span>
                                {entry.sourceRail && (
                                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                                    {entry.sourceRail} → {entry.destinationRail || "wallet"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 font-mono font-bold text-xs text-zinc-900">{entry.currency || "USDC"}</td>
                            <td className={cn("p-4 font-mono font-bold text-xs", isPositive ? "text-emerald-600" : "text-zinc-900")}>
                              {isPositive ? "+" : "-"}${amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full inline-block",
                                isCompleted ? "bg-emerald-50 text-emerald-700" : entry.status === "failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                              )}>
                                {entry.state || entry.status || "completed"}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-zinc-600 max-w-[200px] truncate font-sans" title={entry.description}>
                              {entry.description || "Bridge Money Movement"}
                            </td>
                            <td className="p-4 font-mono text-xs text-zinc-400 max-w-[140px] truncate">
                              {entry.destinationTxHash || entry.depositTxHash ? (
                                <span className="text-brand-purple hover:underline cursor-pointer" title={entry.destinationTxHash || entry.depositTxHash}>
                                  {(entry.destinationTxHash || entry.depositTxHash)?.substring(0, 10)}...
                                </span>
                              ) : entry.referenceId ? (
                                <span title={entry.referenceId}>
                                  {entry.referenceId.substring(0, 10)}...
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                            <td className="p-4 text-xs font-mono text-zinc-500">
                              {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* TAB 2: DEPOSITS REVIEW */}
          {activeTab === "savings" && savings && (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-display font-bold text-zinc-950">Deposits Leaderboard & Balances</h3>

              <GlassCard className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Rank</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">User / Email</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Stable Tag</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">USDC Virtual Balance</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">USDT Virtual Balance</th>
                      <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">Combined Deposits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!savings?.individualSavings || savings.individualSavings.length === 0) ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans text-sm">
                          No deposit records found.
                        </td>
                      </tr>
                    ) : (
                      savings.individualSavings.map((saver, idx) => (
                        <tr key={saver.userId} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-xs">
                            {idx === 0 ? (
                              <span className="text-amber-600 flex items-center gap-1 font-bold">🥇 1</span>
                            ) : idx === 1 ? (
                              <span className="text-zinc-500 flex items-center gap-1 font-bold">🥈 2</span>
                            ) : idx === 2 ? (
                              <span className="text-amber-800 flex items-center gap-1 font-bold">🥉 3</span>
                            ) : (
                              <span className="text-zinc-400 pl-6">{idx + 1}</span>
                            )}
                          </td>
                          <td className="p-4 text-sm font-sans font-bold text-zinc-950">{saver.email}</td>
                          <td className="p-4 font-mono font-bold text-xs text-brand-purple">
                            {saver.bankTag ? `@${saver.bankTag}` : "—"}
                          </td>
                          <td className="p-4 font-mono text-xs text-zinc-600 text-right">
                            ${saver.usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-xs text-zinc-600 text-right">
                            ${saver.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="p-4 font-mono text-right font-black text-xs text-emerald-600">
                            ${saver.totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          )}

          {/* TAB 3: USERS & ADMIN PRIVILEGES */}
          {activeTab === "users" && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Side: Users List */}
              <div className="flex flex-col gap-6 flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-xl font-display font-bold text-zinc-950">Platform Users</h3>

                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search email, stable tag, role..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <GlassCard className="p-0 overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-50/70 font-mono text-xs">
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Email / Tag</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">KYC Status</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Account Status</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider">Joined Date</th>
                        <th className="p-4 font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-zinc-500 font-sans text-sm">
                            No users found matching query.
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user._id} className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4">
                              <div className="flex flex-col">
                                <span className="text-sm font-sans font-bold text-zinc-950">{user.email}</span>
                                <span className="text-xs text-brand-purple font-mono font-bold">
                                  {user.bankTag ? `@${user.bankTag}` : "no tag"}
                                </span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={cn(
                                "text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase",
                                user.role === "admin" ? "bg-red-50 text-red-700 border-red-200" : "bg-zinc-100 text-zinc-700 border-zinc-200"
                              )}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="flex items-center gap-1.5 text-xs font-sans font-semibold text-zinc-900">
                                {user.kycStatus === "approved" ? (
                                  <>
                                    <CheckCircle size={14} className="text-emerald-600" />
                                    <span>Approved</span>
                                  </>
                                ) : user.kycStatus === "rejected" ? (
                                  <>
                                    <XCircle size={14} className="text-red-600" />
                                    <span>Rejected</span>
                                  </>
                                ) : user.kycStatus === "pending" ? (
                                  <>
                                    <Clock size={14} className="text-amber-600" />
                                    <span>Pending</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock size={14} className="text-zinc-400" />
                                    <span className="text-zinc-400">Not Started</span>
                                  </>
                                )}
                              </span>
                            </td>
                            <td className="p-4">
                              {user.isRestricted ? (
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 w-fit">
                                  <Ban size={12} /> Restricted
                                </span>
                              ) : (
                                <span className="flex items-center gap-1.5 text-xs text-zinc-700">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-xs font-mono text-zinc-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDeepDive(user._id)}
                                  className="h-8 px-2 text-xs font-semibold text-brand-purple hover:bg-brand-purple/10 cursor-pointer"
                                >
                                  <Eye size={14} className="mr-1" /> Inspect
                                </Button>
                                <Button
                                  variant={user.isRestricted ? "outline" : "ghost"}
                                  size="sm"
                                  onClick={() =>
                                    setRestrictingUser({
                                      id: user._id,
                                      email: user.email,
                                      isRestricted: !!user.isRestricted,
                                    })
                                  }
                                  className={cn(
                                    "h-8 px-2 text-xs font-semibold cursor-pointer",
                                    user.isRestricted
                                      ? "text-emerald-600 hover:bg-emerald-50"
                                      : "text-red-600 hover:bg-red-50"
                                  )}
                                >
                                  <Ban size={14} className="mr-1" />
                                  {user.isRestricted ? "Unrestrict" : "Restrict"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </GlassCard>
              </div>

              {/* Right Side: Promotion Action Tool */}
              <GlassCard className="w-full lg:w-96 shrink-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-zinc-950">Promote Admin</h3>
                    <p className="text-xs text-zinc-500 font-sans">Add administrative privileges</p>
                  </div>
                </div>

                <form onSubmit={handlePromote} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-zinc-700 uppercase tracking-wider">User Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      className="w-full h-11 bg-zinc-50 border border-zinc-200 rounded-xl px-4 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submittingPromote}
                    className="w-full h-11 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full flex items-center justify-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
                  >
                    <ShieldCheck size={16} />
                    {submittingPromote ? "Assigning..." : "Assign Admin Privilege"}
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">
                    <ShieldAlert size={14} /> Security Advisory
                  </div>
                  <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                    Administrators gain write access to fraud alerts, watchlist modifications, and are allowed to authorize/reject platform operations. Only promote trusted team members.
                  </p>
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* USER DEEP-DIVE MODAL */}
      {deepDiveUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-zinc-950 flex items-center gap-2">
                    User Governance & Audit Profile
                    {deepDiveData?.user?.isRestricted && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-mono font-bold border border-red-200">
                        RESTRICTED
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-mono text-zinc-500">ID: {deepDiveUserId}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setDeepDiveUserId(null);
                  setDeepDiveData(null);
                }}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {loadingDeepDive ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={28} className="text-brand-purple animate-spin" />
                  <p className="text-zinc-500 font-sans">Compiling user audit profile & wallets...</p>
                </div>
              ) : deepDiveData && deepDiveData.user ? (() => {
                const user = deepDiveData.user;
                const wallets = Array.isArray(deepDiveData.wallets) ? deepDiveData.wallets : [];
                const recentAuditLogs: AuditLogItem[] = Array.isArray(deepDiveData.recentAuditLogs)
                  ? deepDiveData.recentAuditLogs
                  : Array.isArray((deepDiveData as any).auditLogs)
                  ? (deepDiveData as any).auditLogs
                  : [];
                const virtualBalances = Array.isArray(user.virtualBalances) ? user.virtualBalances : [];

                return (
                  <>
                    <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Account Holder
                        </span>
                        <span className="font-sans font-bold text-zinc-950 text-sm">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName || ""}`.trim()
                            : "StableBank User"}
                        </span>
                        <div className="text-zinc-500 text-xs mt-0.5">{user.email}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          Stable Tag
                        </span>
                        <span className="font-mono font-bold text-brand-purple text-sm">
                          {user.bankTag ? `@${user.bankTag}` : "None"}
                        </span>
                        <div className="text-zinc-400 text-xs mt-0.5 capitalize">
                          Role: {user.role || "user"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                          KYC Verification
                        </span>
                        <span className="font-sans font-bold text-zinc-900 text-sm capitalize flex items-center gap-1 mt-0.5">
                          {user.kycStatus === "approved" ? (
                            <span className="text-emerald-600 flex items-center gap-1 font-bold">
                              <CheckCircle size={14} /> Approved
                            </span>
                          ) : user.kycStatus === "rejected" ? (
                            <span className="text-red-600 flex items-center gap-1 font-bold">
                              <XCircle size={14} /> Rejected
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1 font-bold">
                              <Clock size={14} /> {user.kycStatus || "Not Started"}
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col justify-center">
                        <Button
                          onClick={() => {
                            setRestrictingUser({
                              id: user._id,
                              email: user.email,
                              isRestricted: !!user.isRestricted,
                            });
                          }}
                          variant={user.isRestricted ? "default" : "destructive"}
                          size="sm"
                          className="w-full text-xs font-bold cursor-pointer"
                        >
                          <Ban size={14} className="mr-1.5" />
                          {user.isRestricted ? "Remove Restriction" : "Restrict Account"}
                        </Button>
                      </div>
                    </div>

                    {user.isRestricted && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                        <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                          <AlertTriangle size={14} /> Account Under Administrative Restriction
                        </div>
                        <p className="text-xs font-sans">
                          Reason: {user.restrictedReason || "Violation of terms or suspicious activity"}
                        </p>
                        {user.restrictedAt && (
                          <p className="text-[10px] font-mono text-red-600">
                            Restricted on {new Date(user.restrictedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Virtual Balances */}
                    {virtualBalances.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
                          Virtual Balances ({virtualBalances.length})
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {virtualBalances.map((vb: any, i: number) => (
                            <div key={vb._id || i} className="p-3 border border-zinc-200 rounded-xl bg-white space-y-0.5">
                              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">{vb.currency}</span>
                              <div className="text-base font-mono font-bold text-zinc-950">
                                ${(vb.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bridge Wallets */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
                        Bridge Custodial Wallets ({wallets.length})
                      </h4>
                      {wallets.length === 0 ? (
                        <p className="text-zinc-500 italic">No Bridge wallets provisioned yet.</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {wallets.map((w) => (
                            <div key={w.id} className="p-3 border border-zinc-200 rounded-xl bg-white space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-mono font-bold uppercase text-[10px] text-brand-purple">
                                  {w.chain}
                                </span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                                  {w.status}
                                </span>
                              </div>
                              <div className="font-mono text-xs text-zinc-900 break-all select-all">
                                {w.address}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Audit Trail */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
                        Actor Recent Audit Trail ({recentAuditLogs.length})
                      </h4>
                      <div className="border border-zinc-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-zinc-200 bg-zinc-50 font-mono text-[10px] text-zinc-500">
                              <th className="p-3 font-bold uppercase">Time</th>
                              <th className="p-3 font-bold uppercase">Action</th>
                              <th className="p-3 font-bold uppercase">Category</th>
                              <th className="p-3 font-bold uppercase">Status</th>
                              <th className="p-3 font-bold uppercase">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentAuditLogs.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="p-6 text-center text-zinc-500 font-sans">
                                  No recent audit events found for this actor.
                                </td>
                              </tr>
                            ) : (
                              recentAuditLogs.map((log) => (
                                <tr key={log._id} className="border-b border-zinc-100 hover:bg-zinc-50 text-[11px]">
                                  <td className="p-3 font-mono text-zinc-500 whitespace-nowrap">
                                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "N/A"}
                                  </td>
                                  <td className="p-3 font-mono font-bold text-zinc-900 whitespace-nowrap">
                                    {log.action}
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className={cn("text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border", getCategoryBadgeClass(log.category))}>
                                      {log.category}
                                    </span>
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className={cn("text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border", getStatusBadgeClass(log.status))}>
                                      {log.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-zinc-600 font-sans truncate max-w-[300px]">
                                    {log.description}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                );
              })() : null}
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end">
              <Button
                onClick={() => {
                  setDeepDiveUserId(null);
                  setDeepDiveData(null);
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* USER RESTRICTION CONFIRMATION MODAL */}
      {restrictingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-950 font-display font-bold">
                <ShieldAlert size={18} className="text-red-600" />
                {restrictingUser.isRestricted ? "Remove User Restriction" : "Restrict User Account"}
              </div>
              <button
                onClick={() => setRestrictingUser(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-zinc-700 font-sans">
                {restrictingUser.isRestricted
                  ? `Are you sure you want to lift restrictions for ${restrictingUser.email}? The user will regain normal access to logins and transfers.`
                  : `Restricting ${restrictingUser.email} will immediately block authentication and platform money transfers.`}
              </p>

              {!restrictingUser.isRestricted && (
                <div className="space-y-3">
                  <label className="text-[11px] font-mono font-bold uppercase text-zinc-600 block">
                    Reason for Restriction
                  </label>
                  <select
                    value={restrictReason}
                    onChange={(e) => setRestrictReason(e.target.value)}
                    className="w-full h-10 bg-white border border-zinc-200 rounded-xl px-3 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple cursor-pointer"
                  >
                    <option value="">Select a preset reason...</option>
                    <option value="Suspicious login attempt from unauthorized location">
                      Suspicious login attempt / IP mismatch
                    </option>
                    <option value="High-frequency failed transactions / Rate limit breach">
                      High-frequency failed transactions
                    </option>
                    <option value="AML / Compliance document verification required">
                      AML / Compliance document review required
                    </option>
                    <option value="Chargeback dispute / fraud risk">
                      Chargeback dispute / fraud risk
                    </option>
                    <option value="Custom">Custom reason...</option>
                  </select>

                  {restrictReason === "Custom" && (
                    <textarea
                      placeholder="Enter detailed restriction rationale..."
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      className="w-full h-20 p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white resize-none"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRestrictingUser(null)}
                disabled={submittingRestriction}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleApplyRestriction}
                disabled={submittingRestriction}
                className={cn(
                  "text-xs font-bold text-white cursor-pointer",
                  restrictingUser.isRestricted
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {submittingRestriction
                  ? "Processing..."
                  : restrictingUser.isRestricted
                  ? "Confirm Unrestrict"
                  : "Confirm Restriction"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
