import { Link } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Trophy, User as UserIcon } from 'lucide-react';

export default function Navbar({ user, profile, onLogout }: { user: any, profile: any, onLogout: () => void }) {
  return (
    <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-gold-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-black" />
          </div>
          <span className="hidden sm:inline">Investment <span className="text-gold-500">Affiliate</span></span>
        </Link>

        <div className="flex items-center gap-6">
          {user && (
            <>
              <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-gold-500 transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link to="/leaderboard" className="text-sm font-medium text-slate-400 hover:text-gold-500 transition-colors flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </Link>
            </>
          )}
          
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-gold-500/50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-gold-500/30">
                    <UserIcon className="w-4 h-4 text-gold-500" />
                  </div>
                )}
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-white leading-none">{user.displayName}</p>
                  <p className="text-[10px] text-gold-500 uppercase tracking-wider mt-1 font-bold">{profile?.level || 'Bronze'}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link to="/leaderboard" className="text-sm font-medium text-slate-400 hover:text-gold-500 transition-colors flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
