import { apiClient } from "@/config/axios";
import type {
  ReferralLink,
  ReferralStats,
  ReferralTreeNode,
  ReferralAnalytics,
  ReferralReward,
  ReferralActivity,
} from "@/types/referral";

export const referralService = {
  /**
   * Create a referral code for the user
   */
  createReferral: async (): Promise<ReferralLink> => {
    return apiClient.post("/referral/create");
  },

  /**
   * Get referral statistics
   */
  getReferralStats: async (): Promise<ReferralStats> => {
    return apiClient.get("/referral/stats");
  },

  /**
   * Get referral link information
   */
  getReferralLink: async (): Promise<ReferralLink> => {
    return apiClient.get("/referral/link");
  },

  /**
   * Get referral tree (network of referrals)
   */
  getReferralTree: async (): Promise<ReferralTreeNode> => {
    return apiClient.get("/referral/tree");
  },

  /**
   * Get referral analytics
   */
  getReferralAnalytics: async (): Promise<ReferralAnalytics> => {
    return apiClient.get("/referral/analytics");
  },

  /**
   * Get recent referral activity
   */
  getRecentActivity: async (params?: { limit?: number }): Promise<ReferralActivity[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get(`/referral/activity${query ? `?${query}` : ""}`);
  },

  /**
   * Get referral performance metrics
   */
  getReferralPerformance: async (): Promise<any> => {
    return apiClient.get("/referral/performance");
  },

  /**
   * Validate a referral link (public)
   */
  validateReferralLink: async (code: string): Promise<{ valid: boolean; referrerInfo?: any }> => {
    return apiClient.get(`/referral/validate?code=${code}`);
  },

  /**
   * Get referral rewards structure (public)
   */
  getReferralRewards: async (): Promise<ReferralReward[]> => {
    return apiClient.get("/referral/rewards");
  },

  /**
   * Get referral leaderboard (public)
   */
  getReferralLeaderboard: async (params?: { limit?: number }): Promise<any[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get(`/referral/leaderboard${query ? `?${query}` : ""}`);
  },

  /**
   * Search for referrers
   */
  searchReferrers: async (query: string): Promise<any[]> => {
    return apiClient.get(`/referral/search?q=${encodeURIComponent(query)}`);
  },
};
