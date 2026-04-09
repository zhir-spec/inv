import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard } from 'lucide-react';

export default function SuperAdminNavbar() {
  const location = useLocation();
  return (
    <>
      <Link to="/admin" className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/admin' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
        <Shield className="w-4 h-4" />
        <span className="hidden sm:inline">Super Admin</span>
      </Link>
      <Link to="/admin/all-pages" className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname === '/admin/all-pages' ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">All Pages</span>
      </Link>
    </>
  );
}
