import { apiClient } from "@/config/axios";

export interface AdminUser {
  _id: string;
  email: string;
  role: "user" | "admin" | "moderator";
  kycStatus: "pending" | "approved" | "rejected" | "not_started";
  bankTag?: string;
  virtualBalances: Array<{ currency: string; amount: number; lastUpdated: string }>;
  accountType: "individual" | "business";
  status: "active" | "suspended" | "banned";
  createdAt: string;
}

export interface LedgerEntry {
  _id: string;
  userId?: {
    _id: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
  };
  currency: string;
  amount: number;
  type: "deposit" | "withdrawal" | "transfer_in" | "transfer_out" | "reward" | "fee";
  status: "pending" | "completed" | "failed";
  referenceId?: string;
  counterpartyId?: {
    _id: string;
    email: string;
    bankTag?: string;
    firstName?: string;
    lastName?: string;
  };
  description?: string;
  createdAt: string;
}

export interface SavingsSummary {
  summary: {
    totalUSDC: number;
    totalUSDT: number;
    combinedSavings: number;
    activeSaversCount: number;
    totalDeposits?: number;
    reserveRatio?: number;
    requiredReserve?: number;
    utilizableBalance?: number;
    activeDepositorsCount?: number;
  };
  individualSavings: Array<{
    userId: string;
    email: string;
    bankTag?: string;
    usdcBalance: number;
    usdtBalance: number;
    totalSavings: number;
  }>;
}

export const adminService = {
  getUsers: async (): Promise<AdminUser[]> => {
    return apiClient.get("/admin/users");
  },

  promoteUser: async (email: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post("/admin/promote", { email });
  },

  getLedger: async (): Promise<LedgerEntry[]> => {
    return apiClient.get("/admin/ledger");
  },

  getSavings: async (): Promise<SavingsSummary> => {
    return apiClient.get("/admin/savings");
  },

  sendMemo: async (title: string, message: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post("/admin/memo", { title, message });
  },

  withdrawOperational: async (recipient: string, amount: number, network: string): Promise<{ success: boolean; message: string; hash?: string }> => {
    return apiClient.post("/admin/withdraw-operational", { recipient, amount, network });
  },
};
