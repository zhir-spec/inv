import { Link, useLocation } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Trophy, User as UserIcon, Shield, Settings, ChevronDown, Mail, Key } from 'lucide-react';
import { useState } from 'react';
import { useTenant } from './DynamicPortal';
import AffiliateNavbar from './nav/AffiliateNavbar';
import BrokerNavbar from './nav/BrokerNavbar';
import SuperAdminNavbar from './nav/SuperAdminNavbar';

export default function Navbar({ user, profile, onLogout }: { user: any, profile: any, onLogout: () => void }) {
  const { broker } = useTenant();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Check if we are in a broker portal
  const isBrokerPortal = location.pathname.startsWith('/broker/');
  const brokerPath = isBrokerPortal && broker ? `/broker/${broker.domain}` : '';

  return (
    <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={brokerPath || '/'} className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: !broker?.branding?.logoUrl ? (broker?.branding?.primaryColor || '#3B82F6') : 'transparent' }}
          >
            {broker?.branding?.logoUrl ? (
              <img src={broker.branding.logoUrl} alt={broker.name} className="w-full h-full object-cover" />
            ) : (
              broker ? <BarChart3 className="w-5 h-5 text-black" /> : <Shield className="w-5 h-5 text-black" />
            )}
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
          {/* Role Selection Link - Only show for Super Admin */}
          {profile?.role === 'super_admin' && (
            <Link to="/" className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Role Selection</span>
            </Link>
          )}

          {/* Role-Specific Navbars */}
          {profile && (
            <>
              {profile.role === 'super_admin' && <SuperAdminNavbar />}
              {(profile.role === 'super_admin' || profile.role === 'broker_admin') && broker && <BrokerNavbar brokerPath={brokerPath} />}
              {profile.role === 'affiliate' && broker && <AffiliateNavbar brokerPath={brokerPath} user={user} profile={profile} onLogout={onLogout} />}
            </>
          )}
          
          {user ? (
            <div className="relative pl-4 border-l border-slate-800">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-800 p-2 rounded-xl transition-colors"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-500/50" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-800 mb-2">
                    <p className="text-sm font-bold text-white truncate">{user.displayName || profile?.displayName}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    <UserIcon className="w-4 h-4" /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <Link to="/contact" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    <Mail className="w-4 h-4" /> Contact Support
                  </Link>
                  <button 
                    onClick={onLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
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
