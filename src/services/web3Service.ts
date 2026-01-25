import { apiClient } from "@/config/axios";
import type { UnifiedBalance, ChainBalance, WalletInfo, GasPrice } from "@/types/wallet";

export const web3Service = {
  /**
   * Get unified balance across all chains for an address
   */
  getUnifiedBalance: async (address: string): Promise<UnifiedBalance> => {
    return apiClient.get(`/web3/unified-balance/${address}`);
  },

  /**
   * Get balance for a specific chain
   */
  getChainBalance: async (chain: string, address: string): Promise<ChainBalance> => {
    return apiClient.get(`/web3/chain-balance/${chain}/${address}`);
  },

  /**
   * Get USDC balance for an address
   */
  getUSDCBalance: async (address: string): Promise<{ balance: string; balanceUSD: number }> => {
    return apiClient.get(`/web3/balance/usdc/${address}`);
  },

  /**
   * Get native token balance for an address
   */
  getNativeBalance: async (address: string): Promise<{ balance: string; balanceUSD: number }> => {
    return apiClient.get(`/web3/balance/native/${address}`);
  },

  /**
   * Get authenticated user's wallet information
   */
  getMyWalletInfo: async (): Promise<WalletInfo> => {
    return apiClient.get("/web3/my-wallet");
  },

  /**
   * Get wallet information for any address
   */
  getWalletInfo: async (address: string): Promise<WalletInfo> => {
    return apiClient.get(`/web3/wallet/${address}`);
  },

  /**
   * Get current gas price for a chain
   */
  getGasPrice: async (): Promise<GasPrice> => {
    return apiClient.get("/web3/gas-price");
  },

  /**
   * Get transaction details by hash
   */
  getTransactionByHash: async (hash: string): Promise<any> => {
    return apiClient.get(`/web3/transaction/${hash}`);
  },
};
