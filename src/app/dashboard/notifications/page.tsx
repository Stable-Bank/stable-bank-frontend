"use client";

import { useState, useMemo } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Bell,
  BellOff,
  Trash2,
  CheckCheck,
  Shield,
  Tag,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Search,
  X,
  CreditCard,
  Landmark,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Notification } from "@/types/notification";
import { appRoutes } from "@/lib/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface NotificationGroup {
  label: string;
  sublabel: string;
  notifications: Notification[];
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [activeTab, setActiveTab] = useState<"all" | "transaction" | "security" | "promotion">("all");
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [locallyDeletedIds, setLocallyDeletedIds] = useState<Set<string>>(new Set());

  // Relative time helper
  const getRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  // Icon selector with distinct brand styles and accessible contrast
  const getNotificationIcon = (type: string, title: string, size: "sm" | "lg" = "sm") => {
    const isReceived =
      title.toLowerCase().includes("received") ||
      title.toLowerCase().includes("credited") ||
      title.toLowerCase().includes("deposit");
    const isCard = title.toLowerCase().includes("card");
    const isAccount = title.toLowerCase().includes("account") || title.toLowerCase().includes("bank");

    const containerSize = size === "lg" ? "h-12 w-12 rounded-2xl" : "h-11 w-11 rounded-xl";
    const iconSize = size === "lg" ? 22 : 18;

    if (isCard) {
      return (
        <div className={cn(containerSize, "bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shrink-0 shadow-xs")}>
          <CreditCard size={iconSize} />
        </div>
      );
    }

    if (isAccount) {
      return (
        <div className={cn(containerSize, "bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0 shadow-xs")}>
          <Landmark size={iconSize} />
        </div>
      );
    }

    switch (type) {
      case "transaction":
        return (
          <div
            className={cn(
              containerSize,
              "flex items-center justify-center shrink-0 border shadow-xs",
              isReceived
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-purple-50 text-brand-purple border-purple-200"
            )}
          >
            {isReceived ? <ArrowDownLeft size={iconSize} /> : <ArrowUpRight size={iconSize} />}
          </div>
        );
      case "security":
      case "system":
        return (
          <div className={cn(containerSize, "bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0 shadow-xs")}>
            <Shield size={iconSize} />
          </div>
        );
      case "promotion":
        return (
          <div className={cn(containerSize, "bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs")}>
            <Tag size={iconSize} />
          </div>
        );
      case "referral":
        return (
          <div className={cn(containerSize, "bg-purple-50 text-brand-purple border border-purple-200 flex items-center justify-center shrink-0 shadow-xs")}>
            <Gift size={iconSize} />
          </div>
        );
      default:
        return (
          <div className={cn(containerSize, "bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center shrink-0 shadow-xs")}>
            <Bell size={iconSize} />
          </div>
        );
    }
  };

  // Helper to extract financial amounts or metadata chips
  const extractAmount = (notif: Notification) => {
    if (notif.metadata?.amount && notif.metadata?.currency) {
      const isCredit =
        notif.title.toLowerCase().includes("received") ||
        notif.title.toLowerCase().includes("credited") ||
        notif.title.toLowerCase().includes("deposit");
      return {
        text: `${isCredit ? "+" : ""}${Number(notif.metadata.amount).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} ${notif.metadata.currency}`,
        isCredit,
      };
    }
    const match =
      notif.message.match(/(\$|USDC\s*|USDT\s*)(\d+(\.\d{1,6})?)/i) ||
      notif.title.match(/(\$|USDC\s*|USDT\s*)(\d+(\.\d{1,6})?)/i);
    if (match) {
      const isCredit =
        notif.title.toLowerCase().includes("received") ||
        notif.title.toLowerCase().includes("credited") ||
        notif.title.toLowerCase().includes("deposit");
      return { text: match[0].trim(), isCredit };
    }
    return null;
  };

  // Filtered notifications calculation (search + tab + unread + deleted)
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Hide locally deleted items
      if (locallyDeletedIds.has(notif._id)) return false;

      // Filter by unread-only
      if (onlyUnread && notif.status !== "unread") return false;

      // Filter by tab
      if (activeTab === "transaction" && notif.type !== "transaction") return false;
      if (activeTab === "security" && notif.type !== "security" && notif.type !== "system") return false;
      if (activeTab === "promotion" && notif.type !== "promotion" && notif.type !== "referral") return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = notif.title.toLowerCase().includes(query);
        const inMessage = notif.message.toLowerCase().includes(query);
        const inType = notif.type.toLowerCase().includes(query);
        const inAmount = notif.metadata?.amount ? String(notif.metadata.amount).includes(query) : false;
        const inCurrency = notif.metadata?.currency ? notif.metadata.currency.toLowerCase().includes(query) : false;
        if (!inTitle && !inMessage && !inType && !inAmount && !inCurrency) return false;
      }

      return true;
    });
  }, [notifications, locallyDeletedIds, onlyUnread, activeTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    const base = notifications.filter((n) => !locallyDeletedIds.has(n._id));
    return {
      all: base.length,
      transaction: base.filter((n) => n.type === "transaction").length,
      security: base.filter((n) => n.type === "security" || n.type === "system").length,
      promotion: base.filter((n) => n.type === "promotion" || n.type === "referral").length,
    };
  }, [notifications, locallyDeletedIds]);

  // Chronological grouping helper
  const groupedNotifications = useMemo(() => {
    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayMidnight = todayMidnight - 86400000;
    const sevenDaysAgo = todayMidnight - 6 * 86400000;

    const groups: { [key: string]: Notification[] } = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: [],
    };

    filteredNotifications.forEach((item) => {
      const itemDate = new Date(item.createdAt).getTime();
      if (itemDate >= todayMidnight) {
        groups.today.push(item);
      } else if (itemDate >= yesterdayMidnight) {
        groups.yesterday.push(item);
      } else if (itemDate >= sevenDaysAgo) {
        groups.thisWeek.push(item);
      } else {
        groups.older.push(item);
      }
    });

    const result: NotificationGroup[] = [];
    if (groups.today.length > 0) {
      const unreadToday = groups.today.filter((n) => n.status === "unread").length;
      result.push({
        label: "Today",
        sublabel: unreadToday > 0 ? `${unreadToday} unread` : `${groups.today.length} alerts`,
        notifications: groups.today,
      });
    }
    if (groups.yesterday.length > 0) {
      result.push({
        label: "Yesterday",
        sublabel: `${groups.yesterday.length} alerts`,
        notifications: groups.yesterday,
      });
    }
    if (groups.thisWeek.length > 0) {
      result.push({
        label: "Earlier This Week",
        sublabel: `${groups.thisWeek.length} alerts`,
        notifications: groups.thisWeek,
      });
    }
    if (groups.older.length > 0) {
      result.push({
        label: "Older",
        sublabel: `${groups.older.length} alerts`,
        notifications: groups.older,
      });
    }
    return result;
  }, [filteredNotifications]);

  // Deletion with Undo Toast (Postel's Law - Rule 14 & 15)
  const handleDeleteWithUndo = async (notif: Notification, e?: React.MouseEvent) => {
    e?.stopPropagation();

    // Optimistically hide
    setLocallyDeletedIds((prev) => new Set([...prev, notif._id]));
    if (selectedNotification?._id === notif._id) {
      setSelectedNotification(null);
    }

    toast("Notification removed", {
      description: `"${notif.title.slice(0, 32)}${notif.title.length > 32 ? "..." : ""}"`,
      action: {
        label: "Undo",
        onClick: () => {
          // Restore locally
          setLocallyDeletedIds((prev) => {
            const next = new Set(prev);
            next.delete(notif._id);
            return next;
          });
        },
      },
    });

    // Invoke delete on server
    try {
      await deleteNotification(notif._id);
    } catch {
      // In case of error, restore
      setLocallyDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(notif._id);
        return next;
      });
      toast.error("Failed to delete notification");
    }
  };

  // Contextual CTA generator for the Details Modal
  const getContextualCta = (notif: Notification) => {
    const isCard = notif.title.toLowerCase().includes("card");
    const isTransaction = notif.type === "transaction" || notif.title.toLowerCase().includes("transfer");
    const isSecurity = notif.type === "security" || notif.title.toLowerCase().includes("password") || notif.title.toLowerCase().includes("otp");
    const isPromo = notif.type === "promotion" || notif.type === "referral";

    if (isCard) {
      return (
        <Link href={appRoutes.dashboard.vcard}>
          <Button className="h-10 px-4 rounded-full text-xs font-semibold bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1.5 cursor-pointer">
            <CreditCard size={14} />
            <span>Manage Card</span>
          </Button>
        </Link>
      );
    }
    if (isTransaction) {
      return (
        <Link href={appRoutes.dashboard.home}>
          <Button className="h-10 px-4 rounded-full text-xs font-semibold bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1.5 cursor-pointer">
            <ArrowUpRight size={14} />
            <span>View Transfer</span>
          </Button>
        </Link>
      );
    }
    if (isSecurity) {
      return (
        <Link href={appRoutes.dashboard.settings}>
          <Button className="h-10 px-4 rounded-full text-xs font-semibold bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1.5 cursor-pointer">
            <Shield size={14} />
            <span>Security Settings</span>
          </Button>
        </Link>
      );
    }
    if (isPromo) {
      return (
        <Link href={appRoutes.dashboard.apps}>
          <Button className="h-10 px-4 rounded-full text-xs font-semibold bg-brand-purple hover:bg-brand-purple/90 text-white flex items-center gap-1.5 cursor-pointer">
            <Sparkles size={14} />
            <span>Explore Apps</span>
          </Button>
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="flex animate-in fade-in flex-col gap-6 sm:gap-7 pb-20 max-w-[1440px] mx-auto w-full">
      {/* 1. Page Header (Rule 7, 9 & 11) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 ? (
              <div className="flex items-center gap-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/25 px-3 py-1 text-xs font-mono font-bold text-brand-purple">
                <span className="h-2 w-2 rounded-full bg-brand-purple animate-ping" />
                <span>{unreadCount} Unread</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono font-bold text-emerald-700">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>All Caught Up</span>
              </div>
            )}
          </div>
          <p className="text-zinc-600 text-xs sm:text-sm font-sans max-w-xl">
            Real-time feed for deposits, card spending, security events, and protocol alerts.
          </p>
        </div>

        {/* Primary Header Action (Rule 7 & 8) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            id="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={cn(
              "font-sans font-bold rounded-full h-11 px-5 flex items-center gap-2 transition-all cursor-pointer",
              unreadCount > 0
                ? "bg-brand-purple hover:bg-brand-purple/90 text-white shadow-md shadow-brand-purple/20"
                : "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed"
            )}
          >
            <CheckCheck size={16} />
            <span>Mark all read</span>
          </Button>
        </div>
      </div>

      {/* 2. Search & Filter Bar (Rule 1: Hick's Law & Rule 5: Miller's Law) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl p-3 sm:p-4 shadow-xs">
        {/* Instant Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, amounts, references..."
            className="h-10 sm:h-11 w-full rounded-xl bg-zinc-50/80 border border-zinc-200/90 pl-10 pr-9 text-xs sm:text-sm text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:border-brand-purple outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Tabs & Unread Toggle */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {(["all", "transaction", "security", "promotion"] as const).map((tab) => {
            const labels = {
              all: "All",
              transaction: "Transfers",
              security: "Security",
              promotion: "Perks",
            };
            const count = tabCounts[tab];
            const isCurrent = activeTab === tab;
            return (
              <button
                key={tab}
                id={`filter-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-sans font-bold transition-all shrink-0 cursor-pointer border",
                  isCurrent
                    ? "bg-brand-purple text-white border-brand-purple shadow-xs"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"
                )}
              >
                <span>{labels[tab]}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-mono",
                    isCurrent ? "bg-white/20 text-white" : "bg-zinc-200/70 text-zinc-600"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="h-6 w-[1px] bg-zinc-200 shrink-0 mx-0.5 hidden sm:block" />

          {/* Unread Only Toggle */}
          <button
            type="button"
            onClick={() => setOnlyUnread((prev) => !prev)}
            className={cn(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans font-bold transition-all shrink-0 cursor-pointer border",
              onlyUnread
                ? "bg-purple-50 text-brand-purple border-brand-purple/40 ring-2 ring-brand-purple/15 shadow-xs"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", onlyUnread ? "bg-brand-purple" : "bg-zinc-400")} />
            <span>Unread only</span>
          </button>
        </div>
      </div>

      {/* 3. Notifications List Area (Rule 4: Proximity & Rule 5: Chunking) */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="animate-pulse h-24 bg-white border border-zinc-200 rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="h-11 w-11 rounded-xl bg-zinc-200 shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="h-4 w-48 bg-zinc-200 rounded-md" />
                  <div className="h-3 w-full max-w-md bg-zinc-100 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* Empty States (Rule 10: Peak-End Rule) */
          <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-zinc-200 rounded-3xl bg-white text-center shadow-xs">
            <div className="h-16 w-16 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-200 mb-4 shadow-xs">
              {onlyUnread ? <CheckCircle2 size={30} className="text-emerald-500" /> : <BellOff size={30} />}
            </div>
            <h3 className="text-zinc-950 text-lg font-display font-bold">
              {searchQuery
                ? "No matching alerts"
                : onlyUnread
                ? "All caught up!"
                : "No notifications right now"}
            </h3>
            <p className="text-zinc-500 font-sans text-xs sm:text-sm mt-1.5 max-w-sm text-center leading-relaxed">
              {searchQuery
                ? `No alerts match "${searchQuery}". Try a different keyword or clear your search.`
                : onlyUnread
                ? "You have 0 unread alerts. All notifications have been reviewed."
                : "Incoming deposits, card authorization alerts, and security confirmations will appear here."}
            </p>
            {(searchQuery || onlyUnread || activeTab !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setOnlyUnread(false);
                  setActiveTab("all");
                }}
                className="mt-5 rounded-full text-xs font-semibold h-10 px-5 border-zinc-200 hover:bg-zinc-50 cursor-pointer"
              >
                Reset All Filters
              </Button>
            )}
          </div>
        ) : (
          /* Chronological Groups */
          groupedNotifications.map((group) => (
            <div key={group.label} className="space-y-3">
              {/* Chronological Section Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-display font-bold text-zinc-900 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <span className="text-[11px] font-mono font-semibold text-zinc-500 bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded-full">
                    {group.sublabel}
                  </span>
                </div>
              </div>

              {/* Group Cards */}
              <div className="space-y-2.5">
                {group.notifications.map((notif) => {
                  const isUnread = notif.status === "unread";
                  const amountData = extractAmount(notif);

                  return (
                    <Card
                      key={notif._id}
                      id={`notification-item-${notif._id}`}
                      tabIndex={0}
                      onClick={() => {
                        setSelectedNotification(notif);
                        if (isUnread) markAsRead(notif._id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedNotification(notif);
                          if (isUnread) markAsRead(notif._id);
                        }
                      }}
                      className={cn(
                        "relative overflow-hidden transition-all duration-150 border rounded-2xl shadow-xs cursor-pointer group outline-none focus-visible:ring-2 focus-visible:ring-brand-purple",
                        isUnread
                          ? "border-brand-purple/40 bg-purple-50/20 hover:bg-purple-50/35 hover:border-brand-purple/60"
                          : "border-zinc-200 bg-white hover:bg-zinc-50/60 hover:border-zinc-300"
                      )}
                    >
                      {/* Left vertical brand accent for unread items */}
                      {isUnread && (
                        <div className="w-1.5 bg-brand-purple rounded-l-2xl absolute left-0 top-0 bottom-0" />
                      )}

                      <CardContent className="p-4 sm:p-5 pl-4 sm:pl-6">
                        <div className="flex items-start gap-3.5 sm:gap-4">
                          {/* Icon Indicator (Fitts's Law large target) */}
                          {getNotificationIcon(notif.type, notif.title)}

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            {/* Top metadata line: category + timestamp */}
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                                {notif.type}
                              </span>
                              <span className="text-zinc-400 font-mono text-[11px] flex items-center gap-1 font-medium">
                                <Clock size={11} />
                                {getRelativeTime(notif.createdAt)}
                              </span>
                              {isUnread && (
                                <span className="h-2 w-2 rounded-full bg-brand-purple animate-pulse shrink-0" />
                              )}
                            </div>

                            {/* Title */}
                            <h4
                              className={cn(
                                "text-sm sm:text-base font-sans text-zinc-950 leading-snug",
                                isUnread ? "font-extrabold" : "font-semibold"
                              )}
                            >
                              {notif.title}
                            </h4>

                            {/* Message Preview */}
                            <p className="text-zinc-600 font-sans text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
                              {notif.message}
                            </p>

                            {/* Bottom row: Amount badge or quick link chip */}
                            {amountData && (
                              <div className="mt-2.5 flex items-center gap-2">
                                <span
                                  className={cn(
                                    "px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border",
                                    amountData.isCredit
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-zinc-100 text-zinc-800 border-zinc-200"
                                  )}
                                >
                                  {amountData.text}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons (Fitts's Law 44px+ hit areas) */}
                          <div
                            className="flex items-center gap-1 shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isUnread && (
                              <button
                                id={`mark-read-btn-${notif._id}`}
                                onClick={() => markAsRead(notif._id)}
                                className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center cursor-pointer"
                                title="Mark as read"
                                aria-label="Mark as read"
                              >
                                <CheckCheck size={18} />
                              </button>
                            )}
                            <button
                              id={`delete-btn-${notif._id}`}
                              onClick={(e) => handleDeleteWithUndo(notif, e)}
                              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center cursor-pointer"
                              title="Delete notification"
                              aria-label="Delete notification"
                            >
                              <Trash2 size={18} />
                            </button>
                            <div className="hidden sm:flex items-center text-zinc-300 group-hover:text-zinc-500 pl-1">
                              <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Interactive Details Dialog (Rule 3 & 8: Contextual Actions & Deep Inspection) */}
      <Dialog
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
      >
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-zinc-200 rounded-3xl bg-white shadow-2xl">
          {selectedNotification && (
            <div className="flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/60 flex items-start gap-4">
                {getNotificationIcon(selectedNotification.type, selectedNotification.title, "lg")}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-zinc-200 text-zinc-700">
                      {selectedNotification.type}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {new Date(selectedNotification.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-zinc-950 leading-snug">
                    {selectedNotification.title}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <p className="text-zinc-700 text-sm sm:text-base font-sans leading-relaxed">
                  {selectedNotification.message}
                </p>

                {/* Structured Metadata Box */}
                {selectedNotification.metadata &&
                  Object.keys(selectedNotification.metadata).length > 0 && (
                    <div className="rounded-2xl bg-zinc-50 border border-zinc-200/90 p-4 space-y-3">
                      <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                        Event Metadata
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {selectedNotification.metadata.amount && (
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Amount</span>
                            <span className="font-semibold text-zinc-950 font-mono text-sm">
                              {selectedNotification.metadata.amount}{" "}
                              {selectedNotification.metadata.currency || ""}
                            </span>
                          </div>
                        )}
                        {selectedNotification.metadata.bankName && (
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Bank / Institution</span>
                            <span className="font-semibold text-zinc-950">
                              {selectedNotification.metadata.bankName}
                            </span>
                          </div>
                        )}
                        {selectedNotification.metadata.accountNumber && (
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Account Number</span>
                            <span className="font-mono text-zinc-950 font-semibold">
                              •••• {String(selectedNotification.metadata.accountNumber).slice(-4)}
                            </span>
                          </div>
                        )}
                        {selectedNotification.metadata.cardLast4 && (
                          <div>
                            <span className="text-zinc-400 block text-[11px]">Card</span>
                            <span className="font-mono text-zinc-950 font-semibold">
                              Visa •••• {selectedNotification.metadata.cardLast4}
                            </span>
                          </div>
                        )}
                        {selectedNotification.metadata.txHash && (
                          <div className="col-span-2">
                            <span className="text-zinc-400 block text-[11px]">Reference / Hash</span>
                            <span className="font-mono text-zinc-700 break-all text-[11px] bg-white p-2 rounded-lg border border-zinc-200 block mt-1 select-all">
                              {selectedNotification.metadata.txHash}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-5 border-t border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {selectedNotification.status === "unread" && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        markAsRead(selectedNotification._id);
                        setSelectedNotification((prev) =>
                          prev ? { ...prev, status: "read" } : null
                        );
                      }}
                      className="h-10 rounded-full text-xs font-semibold flex items-center gap-1.5 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 cursor-pointer"
                    >
                      <CheckCheck size={14} className="text-emerald-600" />
                      <span>Mark Read</span>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteWithUndo(selectedNotification)}
                    className="h-10 rounded-full text-xs font-semibold flex items-center gap-1.5 border-zinc-200 text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {getContextualCta(selectedNotification)}
                  <Button
                    onClick={() => setSelectedNotification(null)}
                    className="h-10 px-5 rounded-full text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 text-white cursor-pointer"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
