import { useEffect, useState } from 'react';
import { Trophy, User as UserIcon } from 'lucide-react';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { formatCurrency } from '../lib/utils';
import { useTenant } from './DynamicPortal';

export default function Leaderboard() {
  const { broker } = useTenant();
  const [topAffiliates, setTopAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!broker?.id) return;
      try {
        const q = query(
          collection(db, 'users'),
          where('brokerId', '==', broker.id),
          where('role', '==', 'affiliate'),
          orderBy('stats.earnings', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (list.length === 0) {
          // Use mock data for preview if no real data exists
          setTopAffiliates([
            { id: '1', displayName: 'Alex Rivera', level: 'Diamond', stats: { earnings: 12450, signups: 156 }, photoURL: 'https://picsum.photos/seed/alex/100/100' },
            { id: '2', displayName: 'Sarah Chen', level: 'Platinum', stats: { earnings: 8920, signups: 98 }, photoURL: 'https://picsum.photos/seed/sarah/100/100' },
            { id: '3', displayName: 'Marcus Thorne', level: 'Gold', stats: { earnings: 5600, signups: 64 }, photoURL: 'https://picsum.photos/seed/marcus/100/100' },
            { id: '4', displayName: 'Elena Vance', level: 'Silver', stats: { earnings: 3200, signups: 42 }, photoURL: 'https://picsum.photos/seed/elena/100/100' },
            { id: '5', displayName: 'David Kim', level: 'Bronze', stats: { earnings: 1500, signups: 21 }, photoURL: 'https://picsum.photos/seed/david/100/100' },
          ]);
        } else {
          setTopAffiliates(list);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Fallback to mock data on error
        setTopAffiliates([
          { id: '1', displayName: 'Alex Rivera (Demo)', level: 'Diamond', stats: { earnings: 12450, signups: 156 }, photoURL: 'https://picsum.photos/seed/alex/100/100' },
          { id: '2', displayName: 'Sarah Chen (Demo)', level: 'Platinum', stats: { earnings: 8920, signups: 98 }, photoURL: 'https://picsum.photos/seed/sarah/100/100' },
        ]);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [broker]);

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
          <div
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
                    <span className="text-xs text-slate-500">{affiliate.stats?.signups || 0} Signups</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Earnings</p>
              <p className="text-xl font-bold text-white">{formatCurrency(affiliate.stats?.earnings || 0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
