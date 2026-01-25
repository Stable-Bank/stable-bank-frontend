// Points and Rewards Types

export type UserTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface PointsSummary {
  balance: number;
  totalEarned: number;
  totalRedeemed: number;
  tier: UserTier;
  nextTier?: UserTier;
  pointsToNextTier?: number;
}

export interface TierInfo {
  currentTier: UserTier;
  nextTier?: UserTier;
  pointsRequired: number;
  pointsToNextTier?: number;
  benefits: string[];
  multiplier: number;
}

export interface PointsTransaction {
  id: number;
  userId: number;
  type: 'earn' | 'redeem' | 'bonus' | 'referral';
  amount: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  bankTag?: string;
  displayName?: string;
  totalPoints: number;
  tier: UserTier;
}

export interface PointsConfig {
  tiers: {
    tier: UserTier;
    minPoints: number;
    multiplier: number;
    benefits: string[];
  }[];
  activities: {
    activity: string;
    points: number;
    description: string;
  }[];
}
