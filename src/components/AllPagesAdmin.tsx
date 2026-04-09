import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function AllPagesAdmin() {
  const pages = [
    { name: 'Role Selection', path: '/' },
    { name: 'Super Admin Dashboard', path: '/admin' },
    { name: 'All Pages Admin', path: '/admin/all-pages' },
    { name: 'Broker Portal (Dynamic)', path: '/broker/:brokerDomain' },
    { name: 'Broker Dashboard', path: '/broker/:brokerDomain/dashboard' },
    { name: 'Broker Admin', path: '/broker/:brokerDomain/admin' },
    { name: 'Broker Leaderboard', path: '/broker/:brokerDomain/leaderboard' },
    { name: 'Login', path: '/login' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Shield className="text-blue-500" />
        System Pages Directory
      </h1>
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Page Name</th>
              <th className="px-6 py-4 font-semibold">Path</th>
              <th className="px-6 py-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pages.map((page) => (
              <tr key={page.path} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium">{page.name}</td>
                <td className="px-6 py-4 font-mono text-sm text-blue-400">{page.path}</td>
                <td className="px-6 py-4">
                  <Link to={page.path.replace(':brokerDomain', 'investment-affiliate')} className="text-sm text-slate-400 hover:text-white">
                    Visit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
