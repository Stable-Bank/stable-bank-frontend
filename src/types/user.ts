// User Types

export interface User {
  id: string;
  email: string;
  bankTag?: string;
  firstName?: string;
  lastName?: string;
  walletAddress?: string;
  kycStatus?: 'pending' | 'approved' | 'rejected' | 'not_started';
  role?: 'user' | 'admin' | 'moderator';
  status?: 'active' | 'suspended' | 'banned';
  totalPoints?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  createdAt?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  bankTag: string;
  displayName?: string;
  avatar?: string;
  bgColor?: string;
  totalTransactions?: number;
  totalVolume?: number;
  isPublic?: boolean;
}

export interface TopUser extends UserProfile {
  rank: number;
  activityScore: number;
}
