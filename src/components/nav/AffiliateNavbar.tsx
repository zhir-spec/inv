import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Trophy, User as UserIcon, LogOut } from 'lucide-react';

export default function AffiliateNavbar({ brokerPath, user, profile, onLogout }: any) {
  const location = useLocation();
  return (
    <>
      <Link to={`${brokerPath}/dashboard`} className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.endsWith('/dashboard') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <Link to={`${brokerPath}/leaderboard`} className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.endsWith('/leaderboard') ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
        <Trophy className="w-4 h-4" />
        <span className="hidden sm:inline">Leaderboard</span>
      </Link>
    </>
  );
}
