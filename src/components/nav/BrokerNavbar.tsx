import { Link, useLocation } from 'react-router-dom';
import { Settings, Users, BarChart3 } from 'lucide-react';

export default function BrokerNavbar({ brokerPath }: any) {
  const location = useLocation();
  return (
    <>
      <Link to={`${brokerPath}/admin`} className={`text-sm font-medium flex items-center gap-2 transition-colors ${location.pathname.endsWith('/admin') ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}>
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Broker Settings</span>
      </Link>
    </>
  );
}
