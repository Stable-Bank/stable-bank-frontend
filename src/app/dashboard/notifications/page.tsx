"use client";

import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  Trash2,
  CheckCheck,
  Shield,
  Sparkles,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { cn } from "@/utils/cn";

const GlassCard = ({
  children,
  className,
  unread,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  unread?: boolean;
  id?: string;
}) => (
  <Card
    id={id}
    className={cn(
      "overflow-hidden transition-all duration-200 border rounded-2xl shadow-sm",
      unread
        ? "border-brand-purple/40 bg-purple-50/40"
        : "border-zinc-200 bg-white hover:bg-zinc-50/50",
      className
    )}
  >
    <CardContent className="p-5">{children}</CardContent>
  </Card>
);

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

  const getNotificationIcon = (type: string, title: string) => {
    const isReceived = title.toLowerCase().includes("received") || title.toLowerCase().includes("credited") || title.toLowerCase().includes("deposit");
    
    switch (type) {
      case "transaction":
        return (
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
            isReceived ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-brand-purple/10 text-brand-purple border-brand-purple/20"
          )}>
            {isReceived ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
          </div>
        );
      case "security":
        return (
          <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
            <Shield size={18} />
          </div>
        );
      case "promotion":
        return (
          <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
        );
      case "referral":
        return (
          <div className="h-10 w-10 rounded-full bg-purple-50 text-brand-purple border border-brand-purple/20 flex items-center justify-center shrink-0">
            <Gift size={18} />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center shrink-0">
            <Bell size={18} />
          </div>
        );
    }
  };

  // Filter notifications by tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "transaction") return notif.type === "transaction";
    if (activeTab === "security") return notif.type === "security" || notif.type === "system";
    if (activeTab === "promotion") return notif.type === "promotion" || notif.type === "referral";
    return true;
  });

  return (
    <div className="flex animate-in fade-in flex-col gap-8 pb-20 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-zinc-950 tracking-tight">
            Notifications
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base font-sans max-w-[500px]">
            Keep track of incoming transfers, deposits, security updates, and promotional offers.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <Button
            id="mark-all-read-btn"
            onClick={markAllAsRead}
            className="bg-brand-purple hover:bg-brand-purple/90 text-white font-sans font-bold rounded-full h-11 shrink-0 flex items-center gap-2 shadow-md shadow-brand-purple/20 cursor-pointer"
          >
            <CheckCheck size={16} />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-zinc-200 gap-1.5 overflow-x-auto pb-1">
        {(["all", "transaction", "security", "promotion"] as const).map((tab) => {
          const tabLabels = {
            all: "All Alerts",
            transaction: "Transactions",
            security: "Security & System",
            promotion: "Promos & Rewards",
          };
          return (
            <button
              key={tab}
              id={`filter-${tab}`}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-3 text-xs sm:text-sm font-sans font-bold border-b-2 transition-all shrink-0 capitalize outline-none cursor-pointer",
                activeTab === tab
                  ? "border-brand-purple text-brand-purple font-extrabold"
                  : "border-transparent text-zinc-500 hover:text-zinc-900"
              )}
            >
              {tabLabels[tab]}
            </button>
          );
        })}
      </div>

      {/* Notifications Area */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse h-24 bg-zinc-100 border border-zinc-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-200 mb-4 shadow-2xs">
              <BellOff size={28} />
            </div>
            <h3 className="text-zinc-950 text-lg font-display font-bold">All caught up!</h3>
            <p className="text-zinc-500 font-sans text-sm mt-1 max-w-xs text-center leading-relaxed">
              {activeTab === "all"
                ? "You don't have any notifications right now."
                : `You don't have any notifications in ${tabLabels[activeTab] || activeTab} right now.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isUnread = notif.status === "unread";
            return (
              <GlassCard
                key={notif._id}
                id={`notification-item-${notif._id}`}
                unread={isUnread}
                className="relative group overflow-visible"
              >
                <div className="flex items-start gap-4">
                  {/* Icon Indicator */}
                  {getNotificationIcon(notif.type, notif.title)}

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className={cn(
                        "text-base font-sans font-bold text-zinc-950",
                        isUnread ? "font-extrabold" : "text-zinc-800"
                      )}>
                        {notif.title}
                      </h4>
                      {isUnread && (
                        <span className="h-2 w-2 rounded-full bg-brand-purple animate-ping inline-block shrink-0" />
                      )}
                    </div>
                    <p className="text-zinc-600 font-sans text-sm mt-1 leading-relaxed break-words font-medium">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] font-bold uppercase tracking-widest mt-2">
                      <Clock size={12} />
                      <span>{getRelativeTime(notif.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {isUnread && (
                      <button
                        id={`mark-read-btn-${notif._id}`}
                        onClick={() => markAsRead(notif._id)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                        title="Mark as read"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button
                      id={`delete-btn-${notif._id}`}
                      onClick={() => deleteNotification(notif._id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
}

const tabLabels = {
  all: "All Alerts",
  transaction: "Transactions",
  security: "Security & System",
  promotion: "Promos & Rewards",
};
