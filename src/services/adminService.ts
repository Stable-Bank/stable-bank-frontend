import { apiClient } from "@/config/axios";

export interface AdminUser {
  _id: string;
  email: string;
  role: "user" | "admin" | "moderator";
  kycStatus: "pending" | "approved" | "rejected" | "not_started";
  bankTag?: string;
  virtualBalances?: Array<{ currency: string; amount: number; lastUpdated?: string }>;
  accountType: "individual" | "business";
  status: "active" | "suspended" | "banned";
  createdAt: string;
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
};
