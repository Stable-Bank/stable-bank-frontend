"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  XCircle,
  X,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Activity,
  User,
  Clock,
  ExternalLink,
  Globe,
  AlertTriangle,
  Ban,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import {
  adminService,
  AuditLogItem,
  AdminUserDeepDive,
} from "@/services/adminService";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    total: 0,
    page: 1,
    limit: 25,
    totalPages: 1,
  });

  const [streamConnected, setStreamConnected] = useState(false);
  const [activeInspectorLog, setActiveInspectorLog] = useState<AuditLogItem | null>(null);
  const [copied, setCopied] = useState(false);

  // User Deep Dive Modal state
  const [deepDiveUserId, setDeepDiveUserId] = useState<string | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<AdminUserDeepDive | null>(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  // Restriction Modal state
  const [restrictingUser, setRestrictingUser] = useState<{
    id: string;
    email: string;
    isRestricted: boolean;
  } | null>(null);
  const [restrictReason, setRestrictReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submittingRestriction, setSubmittingRestriction] = useState(false);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs({
        page,
        limit: 25,
        search: search.trim() || undefined,
        category: selectedCategory || undefined,
        severity: selectedSeverity || undefined,
        status: selectedStatus || undefined,
      });

      if (res && res.logs) {
        setLogs(res.logs);
        setPagination(res.pagination || { total: res.logs.length, page, limit: 25, totalPages: 1 });
      }
    } catch (err: any) {
      console.error("Failed to load audit logs", err);
      toast.error(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedSeverity, selectedStatus]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Connect to live SSE audit stream
  useEffect(() => {
    const disconnect = adminService.connectAuditStream(
      (newEvent) => {
        // Prepend new event if on first page and no active filters
        if (page === 1 && !selectedCategory && !selectedSeverity && !selectedStatus && !search) {
          setLogs((prev) => [newEvent, ...prev.slice(0, 24)]);
          setPagination((prev) => ({ ...prev, total: prev.total + 1 }));
        }
      },
      () => setStreamConnected(true),
      () => setStreamConnected(false)
    );

    return () => {
      disconnect();
    };
  }, [page, selectedCategory, selectedSeverity, selectedStatus, search]);

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    toast.success("JSON copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) {
      toast.error("No logs to export");
      return;
    }
    const headers = [
      "Timestamp",
      "Action",
      "Category",
      "Severity",
      "Status",
      "ActorEmail",
      "ActorBankTag",
      "ActorRole",
      "ActorIP",
      "Description",
    ];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.severity}"`,
      `"${l.status}"`,
      `"${l.actorEmail || (typeof l.actorId === "object" ? l.actorId?.email : "") || ""}"`,
      `"${l.actorBankTag || (typeof l.actorId === "object" ? l.actorId?.bankTag : "") || ""}"`,
      `"${l.actorRole || ""}"`,
      `"${l.actorIp || ""}"`,
      `"${(l.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stablebank_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit logs exported to CSV");
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
      toast.success(newStatus ? "User has been restricted" : "User restriction removed");

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
      fetchLogs();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user restriction");
    } finally {
      setSubmittingRestriction(false);
    }
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

  return (
    <div className="flex animate-in fade-in flex-col gap-6 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin"
              className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-zinc-950 tracking-tight flex items-center gap-3">
              Platform Audit Logs
            </h1>
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded-full border",
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
              {streamConnected ? "LIVE STREAM ACTIVE" : "STREAM DISCONNECTED"}
            </div>
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-sans pl-8">
            Immutable platform-wide audit trail with real-time SSE streaming, actor deep dives, and security auditing.
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-sans font-semibold text-xs h-10 px-4 flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </Button>
          <Button
            onClick={fetchLogs}
            disabled={loading}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold text-xs rounded-xl h-10 px-4 flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <RefreshCw size={14} className={cn(loading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-zinc-200 bg-white shadow-xs rounded-2xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search by action, email, stable tag, IP, or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 text-xs font-sans text-zinc-900 outline-none focus:border-brand-purple focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="h-10 bg-white border border-zinc-200 rounded-xl px-3 py-1 text-xs font-sans font-semibold text-zinc-800 outline-none focus:border-brand-purple cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="auth">Auth & Security</option>
              <option value="transaction">Transactions & P2P</option>
              <option value="card">Cards</option>
              <option value="savings">Savings</option>
              <option value="compliance">Compliance & KYC</option>
              <option value="security">Security Alerts</option>
              <option value="admin">Admin Actions</option>
              <option value="system">System & Webhooks</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                setPage(1);
              }}
              className="h-10 bg-white border border-zinc-200 rounded-xl px-3 py-1 text-xs font-sans font-semibold text-zinc-800 outline-none focus:border-brand-purple cursor-pointer"
            >
              <option value="">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="h-10 bg-white border border-zinc-200 rounded-xl px-3 py-1 text-xs font-sans font-semibold text-zinc-800 outline-none focus:border-brand-purple cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="blocked">Blocked</option>
            </select>

            {(selectedCategory || selectedSeverity || selectedStatus || search) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSeverity("");
                  setSelectedStatus("");
                  setSearch("");
                  setPage(1);
                }}
                className="h-10 px-3 text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Audit Logs Table */}
      <Card className="border border-zinc-200 bg-white shadow-xs rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75 font-mono text-xs text-zinc-500">
                <th className="p-4 font-bold uppercase tracking-wider">Timestamp</th>
                <th className="p-4 font-bold uppercase tracking-wider">Category</th>
                <th className="p-4 font-bold uppercase tracking-wider">Action</th>
                <th className="p-4 font-bold uppercase tracking-wider">Actor</th>
                <th className="p-4 font-bold uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold uppercase tracking-wider">Description</th>
                <th className="p-4 font-bold uppercase tracking-wider">IP / Device</th>
                <th className="p-4 font-bold uppercase tracking-wider text-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCw size={24} className="text-brand-purple animate-spin" />
                      <span className="text-xs font-sans text-zinc-500">Loading audit records...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-zinc-500 font-sans text-sm">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const actorEmail =
                    log.actorEmail ||
                    (typeof log.actorId === "object" ? log.actorId?.email : null) ||
                    "System";
                  const actorTag =
                    log.actorBankTag ||
                    (typeof log.actorId === "object" ? log.actorId?.bankTag : null);

                  return (
                    <tr
                      key={log._id}
                      onClick={() => setActiveInspectorLog(log)}
                      className={cn(
                        "border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors cursor-pointer text-xs",
                        activeInspectorLog?._id === log._id && "bg-brand-purple/5"
                      )}
                    >
                      <td className="p-4 font-mono text-zinc-600 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md border inline-block",
                            getCategoryBadgeClass(log.category)
                          )}
                        >
                          {log.category}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded text-[11px]">
                          {log.action}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-sans font-bold text-zinc-950">
                            {actorTag ? `@${actorTag}` : actorEmail}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={cn(
                                "text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase",
                                log.actorRole === "admin"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : log.actorRole === "system"
                                  ? "bg-zinc-100 text-zinc-600 border-zinc-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {log.actorRole}
                            </span>
                            {actorTag && actorEmail && (
                              <span className="text-[10px] text-zinc-400 font-sans">{actorEmail}</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border inline-block",
                            getStatusBadgeClass(log.status)
                          )}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td
                        className="p-4 text-zinc-700 font-sans max-w-[280px] truncate"
                        title={log.description}
                      >
                        {log.description}
                      </td>

                      <td className="p-4 font-mono text-zinc-500 whitespace-nowrap">
                        <div className="flex flex-col text-[11px]">
                          <span>{log.actorIp || "127.0.0.1"}</span>
                          {log.deviceInfo?.browser && (
                            <span className="text-[9px] text-zinc-400">
                              {log.deviceInfo.browser} ({log.deviceInfo.os || "OS"})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveInspectorLog(log);
                          }}
                          className="h-8 px-2.5 text-brand-purple hover:bg-brand-purple/10 text-xs font-semibold cursor-pointer"
                        >
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-zinc-600">
          <div>
            Showing page <span className="font-bold text-zinc-900">{pagination.page}</span> of{" "}
            <span className="font-bold text-zinc-900">{pagination.totalPages || 1}</span> (
            <span className="font-mono font-bold text-zinc-900">{pagination.total}</span> total events)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3 text-xs border-zinc-200 cursor-pointer"
            >
              <ChevronLeft size={14} className="mr-1" /> Prev
            </Button>

            <span className="text-xs font-mono font-bold px-2">
              {page} / {pagination.totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= (pagination.totalPages || 1) || loading}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 px-3 text-xs border-zinc-200 cursor-pointer"
            >
              Next <ChevronRight size={14} className="ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* EVENT INSPECTOR MODAL / SLIDEOVER */}
      {activeInspectorLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <Activity size={18} />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-zinc-950">
                    Audit Event Inspector
                  </h3>
                  <p className="text-xs font-mono text-zinc-500">
                    ID: {activeInspectorLog._id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveInspectorLog(null)}
                className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Event Summary Banner */}
              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border",
                      getCategoryBadgeClass(activeInspectorLog.category)
                    )}
                  >
                    {activeInspectorLog.category}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border",
                      getStatusBadgeClass(activeInspectorLog.status)
                    )}
                  >
                    {activeInspectorLog.status}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase px-2 py-0.5 rounded",
                      getSeverityBadgeClass(activeInspectorLog.severity)
                    )}
                  >
                    {activeInspectorLog.severity}
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px] ml-auto">
                    {new Date(activeInspectorLog.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm font-sans font-bold text-zinc-900 pt-1">
                  {activeInspectorLog.description}
                </p>
              </div>

              {/* Grid: Actor Details & Execution Context */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Actor Info */}
                <div className="p-4 border border-zinc-200 rounded-xl bg-white space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono font-bold uppercase text-[10px]">
                    <User size={12} /> Actor Profile
                  </div>
                  <div className="space-y-1">
                    <div className="font-sans font-bold text-zinc-950 text-sm">
                      {activeInspectorLog.actorBankTag
                        ? `@${activeInspectorLog.actorBankTag}`
                        : activeInspectorLog.actorEmail || "System"}
                    </div>
                    {activeInspectorLog.actorEmail && (
                      <div className="text-zinc-500 font-sans text-xs">
                        {activeInspectorLog.actorEmail}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        Role: {activeInspectorLog.actorRole}
                      </span>
                      {activeInspectorLog.actorId && (
                        <button
                          onClick={() => {
                            const uid =
                              typeof activeInspectorLog.actorId === "object"
                                ? activeInspectorLog.actorId?._id
                                : activeInspectorLog.actorId;
                            if (uid) openDeepDive(uid);
                          }}
                          className="text-[10px] font-sans font-bold text-brand-purple hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Deep Dive <ExternalLink size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Network & Client Info */}
                <div className="p-4 border border-zinc-200 rounded-xl bg-white space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono font-bold uppercase text-[10px]">
                    <Globe size={12} /> Network & Device
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-zinc-700">
                    <div>IP: <span className="font-bold text-zinc-900">{activeInspectorLog.actorIp || "127.0.0.1"}</span></div>
                    <div>Browser: {activeInspectorLog.deviceInfo?.browser || "Unknown"}</div>
                    <div>OS: {activeInspectorLog.deviceInfo?.os || "Unknown"}</div>
                    <div>Device: {activeInspectorLog.deviceInfo?.device || "Desktop"}</div>
                  </div>
                </div>
              </div>

              {/* Resource Info if available */}
              {(activeInspectorLog.resourceType || activeInspectorLog.resourceId) && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                  <span className="text-zinc-500 font-mono text-[11px] uppercase">
                    Target Resource:
                  </span>
                  <span className="font-mono font-bold text-zinc-900 text-[11px]">
                    {activeInspectorLog.resourceType} ({activeInspectorLog.resourceId})
                  </span>
                </div>
              )}

              {/* Raw JSON Payload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 font-mono font-bold uppercase text-[10px]">
                    Structured Event Details (JSON)
                  </span>
                  <button
                    onClick={() => handleCopyJson(activeInspectorLog.details || activeInspectorLog)}
                    className="text-zinc-600 hover:text-brand-purple font-sans font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    {copied ? "Copied" : "Copy JSON"}
                  </button>
                </div>
                <pre className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                  {JSON.stringify(activeInspectorLog.details || {}, null, 2)}
                </pre>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between">
              {activeInspectorLog.actorId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const uid =
                      typeof activeInspectorLog.actorId === "object"
                        ? activeInspectorLog.actorId?._id
                        : activeInspectorLog.actorId;
                    if (uid) openDeepDive(uid);
                  }}
                  className="text-xs font-semibold cursor-pointer"
                >
                  <User size={14} className="mr-1.5" /> Inspect Actor History
                </Button>
              )}

              <Button
                onClick={() => setActiveInspectorLog(null)}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 ml-auto cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* USER DEEP-DIVE MODAL */}
      {deepDiveUserId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
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
                  <p className="text-xs font-mono text-zinc-500">
                    ID: {deepDiveUserId}
                  </p>
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

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {loadingDeepDive ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={28} className="text-brand-purple animate-spin" />
                  <p className="text-zinc-500 font-sans">Compiling user audit profile & wallets...</p>
                </div>
              ) : deepDiveData ? (
                <>
                  {/* Top Stats Profile */}
                  <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        Account Holder
                      </span>
                      <span className="font-sans font-bold text-zinc-950 text-sm">
                        {deepDiveData.user.firstName
                          ? `${deepDiveData.user.firstName} ${deepDiveData.user.lastName}`
                          : "StableBank User"}
                      </span>
                      <div className="text-zinc-500 text-xs mt-0.5">{deepDiveData.user.email}</div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        Stable Tag
                      </span>
                      <span className="font-mono font-bold text-brand-purple text-sm">
                        {deepDiveData.user.bankTag ? `@${deepDiveData.user.bankTag}` : "None"}
                      </span>
                      <div className="text-zinc-400 text-xs mt-0.5 capitalize">
                        Role: {deepDiveData.user.role}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        KYC Verification
                      </span>
                      <span className="font-sans font-bold text-zinc-900 text-sm capitalize flex items-center gap-1 mt-0.5">
                        {deepDiveData.user.kycStatus === "approved" ? (
                          <span className="text-emerald-600 flex items-center gap-1 font-bold">
                            <CheckCircle size={14} /> Approved
                          </span>
                        ) : deepDiveData.user.kycStatus === "rejected" ? (
                          <span className="text-red-600 flex items-center gap-1 font-bold">
                            <XCircle size={14} /> Rejected
                          </span>
                        ) : (
                          <span className="text-amber-600 flex items-center gap-1 font-bold">
                            <Clock size={14} /> {deepDiveData.user.kycStatus}
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <Button
                        onClick={() => {
                          setRestrictingUser({
                            id: deepDiveData.user._id,
                            email: deepDiveData.user.email,
                            isRestricted: !!deepDiveData.user.isRestricted,
                          });
                        }}
                        variant={deepDiveData.user.isRestricted ? "default" : "destructive"}
                        size="sm"
                        className="w-full text-xs font-bold cursor-pointer"
                      >
                        <Ban size={14} className="mr-1.5" />
                        {deepDiveData.user.isRestricted ? "Remove Restriction" : "Restrict Account"}
                      </Button>
                    </div>
                  </div>

                  {/* Restriction Banner if active */}
                  {deepDiveData.user.isRestricted && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1">
                      <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                        <AlertTriangle size={14} /> Account Under Administrative Restriction
                      </div>
                      <p className="text-xs font-sans">
                        Reason: {deepDiveData.user.restrictedReason || "Violation of terms or suspicious activity"}
                      </p>
                      {deepDiveData.user.restrictedAt && (
                        <p className="text-[10px] font-mono text-red-600">
                          Restricted on {new Date(deepDiveData.user.restrictedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bridge Custodial Wallets */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-zinc-500 tracking-wider">
                      Bridge Custodial Wallets ({deepDiveData.wallets?.length || 0})
                    </h4>
                    {deepDiveData.wallets?.length === 0 ? (
                      <p className="text-zinc-500 italic">No Bridge wallets provisioned yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {deepDiveData.wallets.map((w) => (
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
                      Actor Recent Audit Trail ({deepDiveData.recentAuditLogs?.length || 0})
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
                          {deepDiveData.recentAuditLogs?.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-6 text-center text-zinc-500 font-sans">
                                No recent audit events found for this actor.
                              </td>
                            </tr>
                          ) : (
                            deepDiveData.recentAuditLogs.map((log) => (
                              <tr key={log._id} className="border-b border-zinc-100 hover:bg-zinc-50 text-[11px]">
                                <td className="p-3 font-mono text-zinc-500 whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleTimeString()}
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
              ) : null}
            </div>

            {/* Footer */}
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
