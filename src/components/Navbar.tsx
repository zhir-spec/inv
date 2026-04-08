import { Link, useLocation } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Trophy, User as UserIcon, Shield, Settings } from 'lucide-react';
import { useTenant } from './DynamicPortal';

export default function Navbar({ user, profile, onLogout }: { user: any, profile: any, onLogout: () => void }) {
  const { broker } = useTenant();
  const location = useLocation();
  
  // Check if we are in a broker portal
  const isBrokerPortal = location.pathname.startsWith('/broker/');
  const brokerPath = isBrokerPortal && broker ? `/broker/${broker.domain}` : '';

  return (
    <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={brokerPath || '/'} className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: broker?.branding?.primaryColor || '#3B82F6' }}
          >
            {broker ? <BarChart3 className="w-5 h-5 text-black" /> : <Shield className="w-5 h-5 text-black" />}
          </div>
          <span className="hidden sm:inline">
            {broker ? (
              <>
                {broker.branding?.companyName?.split(' ')[0]} <span style={{ color: broker.branding?.primaryColor }}>{broker.branding?.companyName?.split(' ')[1] || 'Portal'}</span>
              </>
            ) : (
              <>LuzLoom <span className="text-blue-500">Affiliate</span></>
            )}
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {/* Role Selection Link */}
          <Link to="/" className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Role Selection</span>
          </Link>

          {/* Super Admin Link - Only show if Super Admin */}
          {profile?.role === 'super_admin' && (
            <Link to="/admin" className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/admin' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Super Admin</span>
            </Link>
          )}

          {/* Broker Admin Link - Show if Super Admin or the correct Broker Admin */}
          {(profile?.role === 'super_admin' || (profile?.role === 'broker_admin' && profile?.brokerId === broker?.id)) && broker && (
            <Link to={`${brokerPath}/admin`} className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.endsWith('/admin') ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Broker Settings</span>
            </Link>
          )}

          {user && broker && (
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
          )}
          
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-slate-800">
              <div className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-500/50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-white leading-none">{user.displayName || profile?.displayName}</p>
                  <p className="text-[10px] uppercase tracking-wider mt-1 font-bold" style={{ color: broker?.branding?.primaryColor || '#3B82F6' }}>
                    {profile?.role === 'super_admin' ? 'Super Admin' : (profile?.role === 'broker_admin' ? 'Broker Admin' : profile?.level || 'Bronze')}
                  </p>
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
            <div className="flex items-center gap-4">
              {broker ? (
                <Link to={`${brokerPath}/leaderboard`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Leaderboard</span>
                </Link>
              ) : (
                <Link to="/login" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
