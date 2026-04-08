export type UserRole = 'super_admin' | 'broker_admin' | 'affiliate';

export interface BrokerBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  companyName: string;
  heroTitle: string;
  heroSubtitle: string;
  accentColor: string;
}

export interface Broker {
  id: string;
  name: string;
  domain: string; // e.g., 'investment-affiliate'
  branding: BrokerBranding;
  stats: {
    totalAffiliates: number;
    totalClicks: number;
    totalSignups: number;
    totalRevenue: number;
  };
  createdAt: string;
}

export interface Affiliate {
  id: string;
  brokerId: string;
  displayName: string;
  email: string;
  referralCode: string;
  stats: {
    clicks: number;
    signups: number;
    conversions: number;
    earnings: number;
  };
  joinedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  brokerId?: string; // Only for broker_admin and affiliate
  displayName: string;
}
