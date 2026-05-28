import { apiClient } from "@/config/axios";
import { NotificationsResponse, Notification } from "@/types/notification";

export const notificationService = {
  /**
   * Get user notifications with optional pagination and filters
   */
  getNotifications: async (params?: {
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse> => {
    return apiClient.get("/notifications", { params } as any);
  },

  /**
   * Mark a single notification as read
   */
  markAsRead: async (id: string): Promise<Notification> => {
    return apiClient.put(`/notifications/${id}/read`);
  },

  /**
   * Mark all unread notifications as read
   */
  markAllAsRead: async (): Promise<{ matchedCount: number; modifiedCount: number }> => {
    return apiClient.put("/notifications/read-all");
  },

  /**
   * Soft delete a notification
   */
  deleteNotification: async (id: string): Promise<Notification> => {
    return apiClient.delete(`/notifications/${id}`);
  },

  /**
   * Helper to construct the real-time EventSource URL
   */
  getStreamUrl: (token: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    return `${baseUrl}/notifications/stream?token=${encodeURIComponent(token)}`;
  },
};
