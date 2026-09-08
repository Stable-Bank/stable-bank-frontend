import { apiClient, getApiBaseUrl } from "@/config/axios";

export interface AdminUser {
  _id: string;
  email: string;
  role: "user" | "admin" | "moderator";
  kycStatus: "pending" | "approved" | "rejected" | "not_started";
  bankTag?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  virtualBalances?: Array<{ currency: string; amount: number; lastUpdated?: string }>;
  accountType: "individual" | "business";
  status: "active" | "suspended" | "banned";
  isRestricted?: boolean;
  restrictedReason?: string;
  restrictedAt?: string;
  restrictedBy?: string;
  lastLoginAt?: string;
  lastLoginIp?: string;
  lastUserAgent?: string;
  createdAt: string;
}

export interface AuditLogItem {
  _id: string;
  actorId?: {
    _id: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
  } | string;
  actorEmail?: string;
  actorBankTag?: string;
  actorRole: "user" | "admin" | "system";
  actorIp?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
    ip?: string;
  };
  action: string;
  category: "auth" | "transaction" | "card" | "savings" | "compliance" | "security" | "user" | "admin" | "system";
  severity: "info" | "warning" | "error" | "critical";
  status: "success" | "failed" | "pending" | "blocked";
  description: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, any>;
  errorMessage?: string;
  timestamp: string;
  createdAt?: string;
}

export interface AdminStats {
  users: {
    total: number;
    active: number;
    restricted: number;
    pendingKyc: number;
    approvedKyc: number;
    rejectedKyc: number;
  };
  auditLogs24h: {
    total: number;
    auth: number;
    transactions: number;
    security: number;
    admin: number;
    errors: number;
  };
  volume24h: {
    totalUSD: number;
    totalTransfers: number;
  };
  savings: {
    totalLockedUSD: number;
    activeSavers: number;
  };
  system: {
    redis: string;
    postgres: string;
    mongo: string;
    status: string;
  };
}

export interface AdminUserDeepDive {
  user: AdminUser & {
    bridgeCustomerId?: string;
    virtualBalances?: Array<{
      currency: string;
      amount: number;
      lastUpdated?: string;
    }>;
  };
  wallets: Array<{
    id: string;
    chain: string;
    address: string;
    status: string;
  }>;
  recentTransfers: Array<{
    id: string;
    bridge_transfer_id?: string;
    source_currency: string;
    source_amount: number;
    destination_currency: string;
    destination_amount: number;
    state: string;
    transfer_type: string;
    created_at: string;
  }>;
  recentAuditLogs: AuditLogItem[];
  savingsBuckets?: Array<{
    _id: string;
    bucketType: string;
    currency: string;
    targetAmount?: number;
    currentAmount: number;
    status: string;
  }>;
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: number;
  timestamp: string;
  services: {
    mongo: { status: string };
    postgres: { status: string };
    redis: { status: string };
  };
}

export interface LedgerEntry {
  _id: string;
  id?: string;
  userId?: {
    _id: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
  currency: string;
  amount: number;
  sourceAmount?: number;
  destinationAmount?: number;
  sourceCurrency?: string;
  destinationCurrency?: string;
  sourceRail?: string;
  destinationRail?: string;
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "reward" | "fee" | string;
  rawType?: string;
  status: "pending" | "completed" | "failed";
  state?: string;
  referenceId?: string;
  bridgeTransferId?: string;
  idempotencyKey?: string;
  depositTxHash?: string;
  destinationTxHash?: string;
  receiptUrl?: string;
  developerFeeUSD?: number;
  gasFeeUSD?: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CardTransaction {
  _id: string;
  id: string;
  cardAccountId: string;
  bridgeCardAccountId: string;
  userId: {
    _id: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
  };
  amountUSD: number;
  settledAmountUSD?: number | null;
  merchantName: string;
  merchantCategoryCode?: string;
  status: "approved" | "declined" | "settled" | "pending";
  last4?: string;
  cardType?: string;
  authorizedAt?: string;
  postedAt?: string;
  createdAt: string;
}

export interface WebhookEventLog {
  id: string;
  bridgeEventId: string;
  eventCategory: string;
  eventType: string;
  eventObjectId: string;
  payload: any;
  processed: boolean;
  errorLog?: string | null;
  receivedAt: string;
  processedAt?: string | null;
}

export interface SavingsSummary {
  summary: {
    totalUSDC: number;
    totalUSDT: number;
    combinedSavings: number;
    activeSaversCount: number;
    totalDeposits?: number;
    totalYieldPaid?: number;
    reserveRatio?: number;
    requiredReserve?: number;
    utilizableBalance?: number;
    activeDepositorsCount?: number;
    totalUsersCount?: number;
    provider?: string;
  };
  individualSavings: Array<{
    userId: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
    usdcBalance: number;
    usdtBalance: number;
    lockedSavings?: number;
    yieldEarned?: number;
    totalSavings: number;
    activeBucketsCount?: number;
    buckets?: Array<{
      id: string;
      name: string;
      type: string;
      amount: number;
      interestRate: number;
      maturityDate?: string;
    }>;
  }>;
}

export interface ReconciliationReport {
  userId: string;
  email: string;
  bridgeCustomerId?: string;
  primaryWalletAddress?: string;
  sourceOfTruth: string;
  reconciledAt: string;
  balances: {
    bridgeTotalUSD: number;
    spendableAvailableUSD: number;
    lockedSavingsUSD: number;
    totalYieldAccrued: number;
    dbLedgerTotalUSD: number;
    discrepancyUSD: number;
    isBalanced: boolean;
  };
  bridgeWallets: Array<{
    walletId: string;
    chain: string;
    address: string;
    balanceUSD: number;
    tokens: Array<{ currency: string; amount: number; usdValue: number }>;
  }>;
  savingsBuckets: Array<{
    id: string;
    name: string;
    type: string;
    currentAmount: number;
    interestRate: number;
    maturityDate?: string;
  }>;
}

export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    return apiClient.get("/admin/users");
  },

  promoteUser: async (email: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post("/admin/promote", { email });
  },

  getLedger: async (params?: { page?: number; limit?: number; type?: string; status?: string; search?: string }): Promise<LedgerEntry[]> => {
    return apiClient.get("/admin/ledger", { params } as any);
  },

  getCardTransactions: async (params?: { page?: number; limit?: number; status?: string }): Promise<CardTransaction[]> => {
    return apiClient.get("/admin/cards/transactions", { params } as any);
  },

  getWebhookLogs: async (params?: { page?: number; limit?: number; category?: string; processed?: boolean }): Promise<WebhookEventLog[]> => {
    return apiClient.get("/admin/webhooks", { params } as any);
  },

  getSavings: async (): Promise<SavingsSummary> => {
    return apiClient.get("/admin/savings");
  },

  sendMemo: async (title: string, message: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post("/admin/memo", { title, message });
  },

  withdrawOperational: async (recipient: string, amount: number, network: string): Promise<{ success: boolean; message: string; transferId?: string }> => {
    return apiClient.post("/admin/withdraw-operational", { recipient, amount, network });
  },

  getReconciliationReport: async (userId: string): Promise<ReconciliationReport> => {
    return apiClient.get(`/admin/reconciliation/${userId}`);
  },

  reconcileAll: async (): Promise<{ totalReconciled: number; timestamp: string; reports: ReconciliationReport[] }> => {
    return apiClient.get("/admin/reconciliation");
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    severity?: string;
    status?: string;
    action?: string;
    actorId?: string;
    search?: string;
  }): Promise<{
    logs: AuditLogItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    return apiClient.get("/admin/audit-logs", { params } as any);
  },

  getAdminStats: async (): Promise<AdminStats> => {
    return apiClient.get("/admin/stats");
  },

  getUserDeepDive: async (userId: string): Promise<AdminUserDeepDive> => {
    const raw: any = await apiClient.get(`/admin/users/${userId}`);
    const data = raw?.data || raw;
    return {
      user: data?.user || data || {},
      wallets: Array.isArray(data?.wallets) ? data.wallets : [],
      recentTransfers: Array.isArray(data?.recentTransfers)
        ? data.recentTransfers
        : Array.isArray(data?.transfers)
        ? data.transfers
        : [],
      recentAuditLogs: Array.isArray(data?.recentAuditLogs)
        ? data.recentAuditLogs
        : Array.isArray(data?.auditLogs)
        ? data.auditLogs
        : [],
      savingsBuckets: Array.isArray(data?.savingsBuckets) ? data.savingsBuckets : [],
    } as AdminUserDeepDive;
  },

  restrictUser: async (
    userId: string,
    isRestricted: boolean,
    reason?: string
  ): Promise<{ success: boolean; message: string; user: AdminUser }> => {
    return apiClient.post(`/admin/users/${userId}/restrict`, { isRestricted, reason });
  },

  getSystemHealth: async (): Promise<SystemHealth> => {
    return apiClient.get("/admin/system/health");
  },

  connectAuditStream: (
    onEvent: (event: AuditLogItem) => void,
    onConnected?: () => void,
    onError?: (err: any) => void
  ): (() => void) => {
    if (typeof window === "undefined") return () => {};

    const baseUrl = getApiBaseUrl();
    const token = localStorage.getItem("accessToken") || "";
    const url = `${baseUrl}/admin/audit/stream?token=${encodeURIComponent(token)}`;

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      onConnected?.();
    };

    eventSource.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data);
        if (parsed && parsed.type !== "heartbeat") {
          onEvent(parsed);
        }
      } catch {
        // Ignore unparseable frames (like keepalives)
      }
    };

    eventSource.onerror = (err) => {
      onError?.(err);
    };

    return () => {
      eventSource.close();
    };
  },
};
