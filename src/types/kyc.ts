// KYC Types

export interface KYCStatus {
  status: 'pending' | 'approved' | 'rejected' | 'not_started';
  reference?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  requiredDocuments?: string[];
}

export interface StartKYCResponse {
  verificationUrl: string;
  reference: string;
  expiresAt: string;
}
