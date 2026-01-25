import { apiClient } from "@/config/axios";
import type {
  PointsSummary,
  TierInfo,
  PointsTransaction,
  LeaderboardEntry,
  PointsConfig,
} from "@/types/points";

export const pointsService = {
  /**
   * Get user's points summary
   */
  getPointsSummary: async (): Promise<PointsSummary> => {
    return apiClient.get("/points/summary");
  },

  /**
   * Get user's tier information
   */
  getUserTier: async (): Promise<TierInfo> => {
    return apiClient.get("/points/tier");
  },

  /**
   * Get points transaction history
   */
  getPointsHistory: async (params?: { page?: number; limit?: number }): Promise<PointsTransaction[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get(`/points/history${query ? `?${query}` : ""}`);
  },

  /**
   * Get points leaderboard
   */
  getLeaderboard: async (params?: { limit?: number }): Promise<LeaderboardEntry[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const query = queryParams.toString();
    return apiClient.get(`/points/leaderboard${query ? `?${query}` : ""}`);
  },

  /**
   * Process daily login reward
   */
  processDailyLogin: async (): Promise<{ points: number; message: string }> => {
    return apiClient.post("/points/daily-login");
  },

  /**
   * Get points system configuration
   */
  getPointsConfig: async (): Promise<PointsConfig> => {
    return apiClient.get("/points/config");
  },

  /**
   * Award points (admin only)
   */
  awardPoints: async (data: { userId: number; points: number; reason: string }): Promise<any> => {
    return apiClient.post("/points/award", data);
  },

  /**
   * Get points analytics (admin only)
   */
  getPointsAnalytics: async (): Promise<any> => {
    return apiClient.get("/points/analytics");
  },
};
