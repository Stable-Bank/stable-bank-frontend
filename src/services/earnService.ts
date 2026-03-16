import { apiClient } from "@/config/axios";

export interface StakingOption {
  days: number;
  min: number;
  apy: number;
}

export interface AimPlan {
  id: string;
  name: string;
  description: string;
  riskLevel: string;
  expectedReturn: string;
}

export interface EarnSummary {
  activeStakes: any[];
  activeInvestments: any[];
  totalStakedUSD: number;
  totalInvestedUSD: number;
  totalEarnedUSD: number;
}

export const earnService = {
  /**
   * Get user's earn summary
   */
  getEarnSummary: async (): Promise<EarnSummary> => {
    return apiClient.get("/earn/summary");
  },

  /**
   * Get available staking options
   */
  getStakingOptions: async (): Promise<StakingOption[]> => {
    return apiClient.get("/earn/staking-options");
  },

  /**
   * Get AIM investment plans
   */
  getAimPlans: async (): Promise<AimPlan[]> => {
    return apiClient.get("/earn/aim-plans");
  },

  /**
   * Get trending synthetic stocks
   */
  getTrendingStocks: async (): Promise<any[]> => {
    return apiClient.get("/earn/stocks");
  },

  /**
   * Stake tokens
   */
  stakeTokens: async (data: {
    tokenId: string;
    amount: number;
    lockPeriodInDays: number;
    apy: number;
  }): Promise<any> => {
    return apiClient.post("/earn/stake", data);
  },
};
