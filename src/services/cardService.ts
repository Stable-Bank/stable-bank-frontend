import { apiClient } from "@/config/axios";
import type {
  VirtualCard,
  CreateCardRequest,
  CardTransaction,
  UpdateLimitsRequest,
  FraudAssessment,
} from "@/types/card";

export const cardService = {
  /**
   * Get all virtual cards for authenticated user
   */
  getUserCards: async (): Promise<VirtualCard[]> => {
    try {
      const res: any = await apiClient.get("/cards");
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.cards)) return res.cards;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Create a new virtual card
   */
  createCard: async (data: CreateCardRequest): Promise<VirtualCard> => {
    return apiClient.post("/cards", data);
  },

  /**
   * Freeze a card
   */
  freezeCard: async (cardId: string): Promise<{ message: string }> => {
    return apiClient.post(`/cards/${cardId}/freeze`);
  },

  /**
   * Unfreeze a card
   */
  unfreezeCard: async (cardId: string): Promise<{ message: string }> => {
    return apiClient.post(`/cards/${cardId}/unfreeze`);
  },

  /**
   * Terminate (delete) a card
   */
  terminateCard: async (cardId: string): Promise<{ message: string }> => {
    return apiClient.delete(`/cards/${cardId}`);
  },

  /**
   * Get card transaction history
   */
  getCardTransactions: async (
    cardId: string,
    params?: { page?: number; limit?: number; startDate?: string; endDate?: string }
  ): Promise<CardTransaction[]> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const query = queryParams.toString();
    return apiClient.get(`/cards/${cardId}/transactions${query ? `?${query}` : ""}`);
  },

  /**
   * Update card spending limits
   */
  updateCardLimits: async (cardId: string, data: UpdateLimitsRequest): Promise<VirtualCard> => {
    return apiClient.put(`/cards/${cardId}/limits`, data);
  },

  /**
   * Get fraud risk assessment
   */
  getFraudAssessment: async (): Promise<FraudAssessment> => {
    return apiClient.get("/cards/fraud-assessment");
  },
};
