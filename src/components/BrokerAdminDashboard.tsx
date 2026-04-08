import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Settings, 
  Palette, 
  Layout, 
  Save, 
  Eye, 
  Copy,
  CheckCircle2,
  BarChart3,
  DollarSign
} from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Broker } from '../types';
import { useAuth } from '../App';

export default function BrokerAdminDashboard() {
  const { brokerDomain } = useParams<{ brokerDomain: string }>();
  const { profile } = useAuth();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [branding, setBranding] = useState<Broker['branding'] | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'affiliates'>('overview');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBroker = async () => {
      if (!brokerDomain) return;
      try {
        const q = query(collection(db, 'brokers'), where('domain', '==', brokerDomain));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const b = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Broker;
          
          // Authorization check
          if (profile?.role !== 'super_admin' && profile?.brokerId !== b.id) {
            setBroker(null);
            setLoading(false);
            return;
          }

          setBroker(b);
          setBranding(b.branding);
        }
      } catch (error) {
        console.error('Error fetching broker:', error);
      }
      setLoading(false);
    };

    fetchBroker();
  }, [brokerDomain]);

  const handleSaveBranding = async () => {
    if (broker && branding) {
      try {
        await updateDoc(doc(db, 'brokers', broker.id), { branding });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
      } catch (error) {
        console.error('Error updating branding:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!broker || !branding) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Broker not found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="text-blue-500" />
            {broker.name} Admin
          </h1>
          <p className="text-slate-400">Manage your affiliate network and customize your portal.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to={`/broker/${broker.domain}`}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <Eye size={18} />
            Preview Portal
          </Link>
          <button 
            onClick={handleSaveBranding}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20"
          >
            <Save size={18} />
            {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'branding', label: 'Branding & UI', icon: Palette },
          { id: 'affiliates', label: 'Affiliates', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
              activeTab === tab.id ? 'text-blue-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Total Affiliates', value: broker.stats?.totalAffiliates || 0, icon: Users, color: 'blue' },
              { label: 'Total Clicks', value: (broker.stats?.totalClicks || 0).toLocaleString(), icon: TrendingUp, color: 'purple' },
              { label: 'Signups', value: (broker.stats?.totalSignups || 0).toLocaleString(), icon: CheckCircle2, color: 'emerald' },
              { label: 'Revenue', value: `$${(broker.stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'amber' },
            ].map((stat, i) => (
              <div key={stat.label} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                <div className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
                  <stat.icon className={`text-${stat.color}-500`} size={20} />
                </div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-lg font-bold mb-4">Portal Access</h3>
            <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
              <code className="flex-1 text-blue-400">
                {window.location.origin}/broker/{broker.domain}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/broker/${broker.domain}`)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
              >
                <Copy size={18} />
              </button>
            </div>
            <p className="text-slate-400 text-sm mt-4">
              Share this link with your potential affiliates. They can sign up and start generating content immediately.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6 bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Palette size={20} className="text-blue-500" />
              Visual Identity
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Primary Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={branding.primaryColor}
                    onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Accent Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="w-10 h-10 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text"
                    value={branding.accentColor}
                    onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
              <input 
                type="text"
                value={branding.companyName}
                onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <h3 className="text-lg font-bold pt-4 flex items-center gap-2">
              <Layout size={20} className="text-blue-500" />
              Content & Messaging
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Hero Title</label>
              <input 
                type="text"
                value={branding.heroTitle}
                onChange={(e) => setBranding({ ...branding, heroTitle: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Hero Subtitle</label>
              <textarea 
                rows={3}
                value={branding.heroSubtitle}
                onChange={(e) => setBranding({ ...branding, heroSubtitle: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold">Live Preview</h3>
            <div className="border border-slate-800 rounded-3xl overflow-hidden bg-white/5 aspect-video relative">
              <div 
                className="absolute inset-0 opacity-20"
                style={{ backgroundColor: branding.primaryColor }}
              />
              <div className="relative p-8 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: branding.primaryColor }} />
                  <span className="font-bold text-white">{branding.companyName}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {branding.heroTitle}
                </h4>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {branding.heroSubtitle}
                </p>
                <div className="mt-6">
                  <button 
                    className="px-6 py-2 rounded-full text-sm font-bold text-black"
                    style={{ backgroundColor: branding.accentColor }}
                  >
                    Join Now
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-sm text-blue-400">
              <strong>Tip:</strong> Use your brand colors to make the portal feel like an extension of your main website.
            </div>
          </div>
        </div>
      )}

      {activeTab === 'affiliates' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h3 className="text-lg font-bold">Your Affiliates</h3>
          </div>
          <div className="p-12 text-center text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-20" />
            <p>No affiliates have joined your network yet.</p>
            <p className="text-sm mt-1">Once they sign up via your portal, they will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
