"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthContext";
import { getToken } from "@/composables/token";
import { notificationService } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import { toast } from "sonner";
import { Bell, ArrowDownLeft, Shield, Tag, Gift } from "lucide-react";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (page?: number, limit?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const getTypeIcon = (type: Notification["type"]) => {
  switch (type) {
    case "transaction":
      return <ArrowDownLeft className="text-emerald-400 h-5 w-5" />;
    case "security":
      return <Shield className="text-rose-400 h-5 w-5" />;
    case "promotion":
      return <Tag className="text-amber-400 h-5 w-5" />;
    case "referral":
      return <Gift className="text-brand-purple h-5 w-5" />;
    default:
      return <Bell className="text-brand-purple h-5 w-5" />;
  }
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const fetchNotifications = async (page = 1, limit = 20) => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({ page, limit });
      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) => (notif._id === id ? { ...notif, status: "read" as const } : notif))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((notif) => ({ ...notif, status: "read" as const })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const notifToDelete = notifications.find((n) => n._id === id);
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((notif) => notif._id !== id));
      if (notifToDelete && notifToDelete.status === "unread") {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  // Set up EventSource for real-time notification pushes
  useEffect(() => {
    if (!isAuthenticated) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Initial load
    fetchNotifications();

    const { token } = getToken();
    if (!token) return;

    const streamUrl = notificationService.getStreamUrl(token);
    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener("connected", (event) => {
      console.log("SSE Stream connected:", event.data);
    });

    es.onmessage = (event) => {
      try {
        const newNotif: Notification = JSON.parse(event.data);
        console.log("Received new notification:", newNotif);

        // Prepend to local state
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Display toast using sonner
        toast(newNotif.title, {
          description: newNotif.message,
          icon: getTypeIcon(newNotif.type),
          duration: 6000,
          action: {
            label: "View",
            onClick: () => {
              window.location.href = "/dashboard/notifications";
            },
          },
        });
      } catch (err) {
        console.error("Failed to parse SSE data:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error:", err);
      // EventSource automatically retries connection, but let's log it
    };

    return () => {
      if (es) {
        es.close();
      }
      eventSourceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
