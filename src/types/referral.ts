// Referral System Types

export interface ReferralLink {
  code: string;
  url: string;
  clicks: number;
  conversions: number;
  createdAt: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
}

export interface ReferralTreeNode {
  userId: number;
  bankTag?: string;
  displayName?: string;
  level: number;
  referralDate: string;
  status: 'active' | 'inactive';
  earnings: number;
  children: ReferralTreeNode[];
}

export interface ReferralAnalytics {
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  earningsThisMonth: number;
  earningsLastMonth: number;
  topReferrals: {
    userId: number;
    bankTag?: string;
    earnings: number;
  }[];
}

export interface ReferralReward {
  tier: number;
  reward: number;
  description: string;
}

export interface ReferralActivity {
  id: number;
  type: 'signup' | 'transaction' | 'milestone';
  referredUserId: number;
  referredUserBankTag?: string;
  reward: number;
  createdAt: string;
}
