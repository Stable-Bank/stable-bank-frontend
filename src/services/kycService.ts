import { apiClient } from "@/config/axios";
import type { KYCStatus, StartKYCResponse } from "@/types/kyc";

export const kycService = {
  /**
   * Start KYC verification process
   */
  startKyc: async (): Promise<StartKYCResponse> => {
    return apiClient.post("/kyc/start");
  },

  /**
   * Get KYC status for authenticated user
   */
  getKycStatus: async (): Promise<KYCStatus> => {
    return apiClient.get("/kyc/status");
  },
};
