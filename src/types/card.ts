// Virtual Card Types

export interface CardLimits {
  daily: number;
  monthly: number;
  perTransaction: number;
}

export interface VirtualCard {
  id: string;
  cardId: string;
  cardNumber: string; // masked
  expiryMonth: string;
  expiryYear: string;
  cvv: string; // masked
  cardholderName: string;
  status: 'active' | 'frozen' | 'terminated';
  balance: number;
  limits: CardLimits;
  createdAt: string;
  lastUsedAt?: string;
}

export interface CreateCardRequest {
  cardholderName: string;
  limits?: Partial<CardLimits>;
}

export interface CardTransaction {
  id: string;
  cardId: string;
  amount: number;
  currency: string;
  merchant: string;
  merchantCategory: string;
  status: 'approved' | 'declined' | 'pending';
  transactionDate: string;
  description?: string;
}

export interface UpdateLimitsRequest {
  daily?: number;
  monthly?: number;
  perTransaction?: number;
}

export interface FraudAssessment {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  flags: string[];
  recommendations: string[];
}
