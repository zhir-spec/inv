import React, { useState } from 'react';
import { Copy, ExternalLink, MousePointerClick, Users, Wallet, Zap } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import AIContentGenerator from './AIContentGenerator';
import { motion } from 'motion/react';

export default function Dashboard({ profile }: { profile: any }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/ref/${profile?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {profile?.displayName?.split(' ')[0]}!</h1>
          <p className="text-slate-400">Here's how your affiliate empire is performing today.</p>
        </div>
        <div className="flex items-center gap-3 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <div className="px-4 py-2 rounded-lg bg-gold-500 text-black text-sm font-bold">
            {profile?.level} Tier
          </div>
          <div className="px-4 py-2 text-slate-400 text-sm font-medium">
            Next: Silver at 50 Signups
          </div>
        </div>
      </header>

      {/* Referral Link Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-gold-500/10 to-gold-600/10 border border-gold-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-32 h-32 text-gold-500" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gold-500" />
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/50 border border-slate-800 rounded-xl px-4 py-3 font-mono text-sm text-gold-500 truncate">
              {referralLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-black rounded-xl font-bold hover:bg-gold-400 transition-colors active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <a 
              href={`/${profile?.displayName?.toLowerCase().replace(/\s+/g, '')}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <ExternalLink className="w-4 h-4" />
              View Landing Page
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<MousePointerClick className="w-5 h-5 text-gold-500" />}
          label="Total Clicks"
          value={profile?.totalClicks || 0}
          trend="+12% from last week"
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          label="Signups"
          value={profile?.totalSignups || 0}
          trend="+5 new today"
        />
        <StatCard 
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          label="Conversions"
          value={profile?.totalConversions || 0}
          trend="3.2% conversion rate"
        />
        <StatCard 
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          label="Total Earnings"
          value={formatCurrency(profile?.earnings || 0)}
          trend="Next payout: April 15"
        />
      </div>

      {/* AI Content Generator Section */}
      <div className="pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">AI Marketing Engine</h2>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Powered by Gemini 2.0</div>
        </div>
        <AIContentGenerator profile={profile} referralLink={referralLink} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string | number, trend: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-gold-500/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-slate-800">{icon}</div>
      </div>
      <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
      <p className="text-xs text-slate-500 font-medium">{trend}</p>
    </motion.div>
  );
}
