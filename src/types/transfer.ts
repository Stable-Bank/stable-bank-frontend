// Transfer Types

export interface TransferRequest {
  recipientBankTag?: string;
  recipientAddress?: string;
  amount: string;
  tokenSymbol: string;
  sourceChain: string;
  destinationChain: string;
  description?: string;
}

export interface TransferFeeRequest {
  amount: string;
  tokenSymbol: string;
  sourceChain: string;
  destinationChain: string;
}

export interface TransferFee {
  feeAmount: string;
  feeUSD: number;
  estimatedTime: string;
  gasCost: string;
  bridgeFee?: string;
}

export interface ValidateRecipientRequest {
  recipientBankTag?: string;
  recipientAddress?: string;
}

export interface ValidateRecipientResponse {
  isValid: boolean;
  recipientInfo?: {
    bankTag?: string;
    address: string;
    displayName?: string;
  };
  error?: string;
}

export interface Transfer {
  id: string;
  internalId: string;
  transactionHash?: string;
  type: 'transfer' | 'cross_chain';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  fromUserId: number;
  toUserId?: number;
  fromAddress: string;
  toAddress: string;
  fromBankTag?: string;
  toBankTag?: string;
  amount: string;
  amountUSD: number;
  fee: string;
  feeUSD: number;
  tokenSymbol: string;
  fromChainId?: number;
  toChainId?: number;
  description?: string;
  createdAt: string;
  confirmedAt?: string;
  failedAt?: string;
  failureReason?: string;
}

export interface SupportedToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoUrl?: string;
  isNative: boolean;
}

export interface TransferStats {
  totalTransfers: number;
  totalVolume: number;
  successRate: number;
  averageAmount: number;
}
