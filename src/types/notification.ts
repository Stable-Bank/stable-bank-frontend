export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: "transaction" | "security" | "promotion" | "system" | "referral";
  status: "unread" | "read" | "archived";
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  unreadCount: number;
}
