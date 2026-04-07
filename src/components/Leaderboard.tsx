import { useEffect, useState } from 'react';
import { Trophy, User as UserIcon } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

const MOCK_LEADERBOARD = [
  { id: '1', displayName: 'Alex Thompson', totalSignups: 142, earnings: 5420.50, level: 'Gold', photoURL: 'https://picsum.photos/seed/alex/100/100' },
  { id: '2', displayName: 'Sarah Chen', totalSignups: 98, earnings: 3210.00, level: 'Gold', photoURL: 'https://picsum.photos/seed/sarah/100/100' },
  { id: '3', displayName: 'Marco Rossi', totalSignups: 76, earnings: 2150.75, level: 'Silver', photoURL: 'https://picsum.photos/seed/marco/100/100' },
  { id: '4', displayName: 'Elena Gilbert', totalSignups: 54, earnings: 1420.00, level: 'Silver', photoURL: 'https://picsum.photos/seed/elena/100/100' },
  { id: '5', displayName: 'David Miller', totalSignups: 42, earnings: 980.25, level: 'Bronze', photoURL: 'https://picsum.photos/seed/david/100/100' },
];

export default function Leaderboard() {
  const [topAffiliates, setTopAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => {
      setTopAffiliates(MOCK_LEADERBOARD);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 bg-slate-900 rounded-2xl border border-slate-800"></div>
      ))}
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-gold-500" />
          Top Affiliates
        </h1>
        <p className="text-slate-400">The best performing traders in our global network.</p>
      </div>

      <div className="space-y-4">
        {topAffiliates.map((affiliate, index) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={affiliate.id}
            className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${
              index === 0 ? 'bg-gold-500/10 border-gold-500/20' : 
              index === 1 ? 'bg-slate-300/10 border-slate-300/20' :
              index === 2 ? 'bg-orange-500/10 border-orange-500/20' :
              'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="w-10 text-2xl font-black text-slate-700 italic">
                #{index + 1}
              </div>
              <div className="flex items-center gap-4">
                {affiliate.photoURL ? (
                  <img src={affiliate.photoURL} alt="" className="w-12 h-12 rounded-full border-2 border-slate-800" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-white text-lg">{affiliate.displayName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gold-500 uppercase tracking-widest">{affiliate.level}</span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-xs text-slate-500">{affiliate.totalSignups || 0} Signups</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Earnings</p>
              <p className="text-xl font-bold text-white">{formatCurrency(affiliate.earnings || 0)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
