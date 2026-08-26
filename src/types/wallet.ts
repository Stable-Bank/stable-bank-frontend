// Wallet and Balance Types

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceUSD: number;
  address: string;
  decimals: number;
  logoUrl?: string;
}

export interface ChainBalance {
  chainId: number;
  chainName: string;
  nativeBalance: string;
  nativeBalanceUSD: number;
  balanceUSD: number;
  tokens: TokenBalance[];
}

export interface UnifiedBalance {
  totalUSD: number;
  defiBalanceUSD: number;
  chains: ChainBalance[];
  walletsByChain?: Record<string, string>;
  evmWalletAddress?: string;
  solanaWalletAddress?: string;
  tronWalletAddress?: string;
  virtualAccounts?: any[];
  lastUpdated?: string;
}

export interface WalletInfo {
  address: string;
  unifiedBalance: UnifiedBalance;
  chains: ChainBalance[];
}

export interface GasPrice {
  chainId: number;
  gasPrice: string;
  gasPriceGwei: string;
  estimatedCost: string;
}
