import { apiClient } from "@/config/axios";

export interface VirtualAccount {
  id: string;
  currency: string;
  bankName: string;
  accountNumber: string;
  routingNumber?: string;
  iban?: string;
  bic?: string;
  sortCode?: string;
  accountHolderName: string;
  status: string;
  paymentRails?: string[];
  createdAt?: string;
}

export interface CreateVirtualAccountPayload {
  currency: string;
  destinationRail?: string;
  destinationCurrency?: string;
}

export const accountService = {
  /**
   * Get all virtual bank accounts for authenticated user
   */
  getVirtualAccounts: async (): Promise<VirtualAccount[]> => {
    try {
      const res: any = await apiClient.get("/virtual-accounts");
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.accounts)) return res.accounts;
      if (res && Array.isArray(res.virtualAccounts)) return res.virtualAccounts;
      if (res && Array.isArray(res.data)) return res.data;
      if (res && res.data && Array.isArray(res.data.accounts)) return res.data.accounts;
      if (res && res.data && Array.isArray(res.data.virtualAccounts)) return res.data.virtualAccounts;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new Bridge virtual bank account (USD ACH/Wire or EUR SEPA)
   */
  createVirtualAccount: async (payload: CreateVirtualAccountPayload): Promise<VirtualAccount> => {
    return apiClient.post("/virtual-accounts", payload);
  },

  /**
   * Simulate a sandbox deposit into a virtual bank account
   */
  simulateDeposit: async (virtualAccountId: string, amount: string): Promise<any> => {
    return apiClient.post(`/virtual-accounts/${virtualAccountId}/simulate-deposit`, { amount });
  },
};
