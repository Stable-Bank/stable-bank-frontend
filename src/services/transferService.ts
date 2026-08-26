import { apiClient } from "@/config/axios";
import type {
  TransferRequest,
  TransferFeeRequest,
  TransferFee,
  ValidateRecipientRequest,
  ValidateRecipientResponse,
  Transfer,
  SupportedToken,
  TransferStats,
} from "@/types/transfer";

export const transferService = {
  /**
   * Search for users by BankTag or name
   */
  searchUsers: async (query: string): Promise<any[]> => {
    return apiClient.get(`/bank-tag/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Resolve a BankTag to user information
   */
  resolveRecipient: async (bankTag: string): Promise<any> => {
    return apiClient.get(`/bank-tag/resolve?bankTag=${encodeURIComponent(bankTag)}`);
  },

  /**
   * Resolve BankTag to wallet address
   */
  resolveToAddress: async (bankTag: string): Promise<{ address: string }> => {
    return apiClient.get(`/bank-tag/resolve-address?bankTag=${encodeURIComponent(bankTag)}`);
  },

  /**
   * Calculate transfer fee
   */
  calculateFee: async (data: TransferFeeRequest): Promise<TransferFee> => {
    return apiClient.post("/transfer/calculate-fee", data);
  },

  /**
   * Validate recipient before transfer
   */
  validateRecipient: async (data: ValidateRecipientRequest): Promise<ValidateRecipientResponse> => {
    return apiClient.post("/transfer/validate-recipient", data);
  },

  /**
   * Initiate a cross-chain transfer
   */
  initiateTransfer: async (data: TransferRequest): Promise<Transfer> => {
    return apiClient.post("/transfer/cross-chain", data);
  },

  /**
   * Create an outbound fiat bank transfer or offramp via Bridge
   */
  createOutboundTransfer: async (data: any): Promise<any> => {
    return apiClient.post("/transfer/outbound", data);
  },

  /**
   * Get transfer history for authenticated user
   */
  getTransferHistory: async (): Promise<Transfer[]> => {
    return apiClient.get("/transfer/history");
  },

  /**
   * Get transfer by ID
   */
  getTransferById: async (id: string): Promise<Transfer> => {
    return apiClient.get(`/transfer/${id}`);
  },

  /**
   * Get supported tokens for a chain
   */
  getSupportedTokens: async (chain: string): Promise<SupportedToken[]> => {
    return apiClient.get(`/transfer/supported-tokens/${chain}`);
  },

  /**
   * Get transfer statistics
   */
  getTransferStats: async (): Promise<TransferStats> => {
    return apiClient.get("/transfer/stats");
  },
};
