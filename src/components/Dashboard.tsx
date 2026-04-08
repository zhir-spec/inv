import React, { useState } from 'react';
import { Copy, ExternalLink, MousePointerClick, Users, Wallet, Zap } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import AIContentGenerator from './AIContentGenerator';

export default function Dashboard({ profile }: { profile: any }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://ib.investment-spot.com/?ref=${profile?.referralCode}`;

  // Use mock data for preview if stats are zero
  const isNewUser = !profile?.stats || (profile.stats.clicks === 0 && profile.stats.earnings === 0);
  const displayStats = isNewUser ? {
    clicks: 1240,
    signups: 86,
    conversions: 12,
    earnings: 2450.50
  } : profile.stats;

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
          <div className="px-4 py-2 rounded-lg bg-[var(--primary)] text-black text-sm font-bold">
            {profile?.level} Tier
          </div>
          <div className="px-4 py-2 text-slate-400 text-sm font-medium">
            Next: Silver at 50 Signups
          </div>
        </div>
      </header>

      {/* Referral Link Card */}
      <div className="p-6 rounded-2xl bg-[rgba(var(--primary-rgb),0.1)] border border-[rgba(var(--primary-rgb),0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Zap className="w-32 h-32 text-[var(--primary)]" />
        </div>
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--primary)]" />
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/50 border border-slate-800 rounded-xl px-4 py-3 font-mono text-sm text-[var(--primary)] truncate">
              {referralLink}
            </div>
            <button 
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary)] text-black rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
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
          value={displayStats.clicks}
          trend={isNewUser ? "Demo Data" : "+12% from last week"}
          isDemo={isNewUser}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-emerald-400" />}
          label="Signups"
          value={displayStats.signups}
          trend={isNewUser ? "Demo Data" : "+5 new today"}
          isDemo={isNewUser}
        />
        <StatCard 
          icon={<Zap className="w-5 h-5 text-amber-400" />}
          label="Conversions"
          value={displayStats.conversions}
          trend={isNewUser ? "Demo Data" : "3.2% conversion rate"}
          isDemo={isNewUser}
        />
        <StatCard 
          icon={<Wallet className="w-5 h-5 text-purple-400" />}
          label="Total Earnings"
          value={formatCurrency(displayStats.earnings)}
          trend={isNewUser ? "Demo Data" : "Next payout: April 15"}
          isDemo={isNewUser}
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

function StatCard({ icon, label, value, trend, isDemo }: { icon: React.ReactNode, label: string, value: string | number, trend: string, isDemo?: boolean }) {
  return (
    <div 
      className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[rgba(var(--primary-rgb),0.2)] transition-colors relative overflow-hidden"
    >
      {isDemo && (
        <div className="absolute top-0 right-0 bg-blue-500/10 text-blue-500 text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-tighter border-l border-b border-blue-500/20">
          Demo
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-slate-800">{icon}</div>
      </div>
      <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white mb-2">{value}</h3>
      <p className="text-xs text-slate-500 font-medium">{trend}</p>
    </div>
  );
}
