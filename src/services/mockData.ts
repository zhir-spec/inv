import { Broker, Affiliate, AuthUser } from '../types';

const STORAGE_KEY = 'broker_saas_data';

interface AppData {
  brokers: Broker[];
  affiliates: Affiliate[];
  currentUser: AuthUser | null;
}

const DEFAULT_DATA: AppData = {
  brokers: [
    {
      id: 'broker-1',
      name: 'Investment Affiliate',
      domain: 'investment-affiliate',
      branding: {
        primaryColor: '#EAB308', // Gold
        secondaryColor: '#0F172A', // Slate 900
        accentColor: '#FACC15', // Yellow 400
        logoUrl: '',
        companyName: 'Investment Affiliate',
        heroTitle: 'The Elite Trading Network',
        heroSubtitle: 'Join the world\'s most profitable affiliate program for institutional-grade brokers.'
      },
      stats: {
        totalAffiliates: 124,
        totalClicks: 45200,
        totalSignups: 1200,
        totalRevenue: 250000
      },
      createdAt: new Date().toISOString()
    }
  ],
  affiliates: [],
  currentUser: null
};

export const getAppData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return DEFAULT_DATA;
};

export const saveAppData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getBrokerByDomain = (domain: string): Broker | undefined => {
  const data = getAppData();
  return data.brokers.find(b => b.domain === domain);
};

export const updateBrokerBranding = (brokerId: string, branding: Partial<Broker['branding']>) => {
  const data = getAppData();
  const index = data.brokers.findIndex(b => b.id === brokerId);
  if (index !== -1) {
    data.brokers[index].branding = { ...data.brokers[index].branding, ...branding };
    saveAppData(data);
  }
};
