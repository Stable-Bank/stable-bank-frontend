import { apiClient } from "@/config/axios";

export interface GenerateQRRequest {
  data: string;
  size?: number;
  format?: 'png' | 'svg';
}

export interface GenerateQRResponse {
  qrCode: string; // base64 or SVG string
  format: string;
}

export const qrService = {
  /**
   * Generate QR code
   */
  generateQR: async (data: GenerateQRRequest): Promise<GenerateQRResponse> => {
    return apiClient.post("/qr/generate", data);
  },
};
