import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Briefcase, Users, ArrowRight, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../App';

export default function RoleGateway({ brokers = [] }: { brokers?: any[] }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  console.log("RoleGateway brokers:", brokers);
  console.log("RoleGateway user:", user);

  const isAdmin = user?.email === 'zhir.investmentspot@gmail.com';

  const roles = [
    {
      id: 'super_admin',
      title: 'LuzLoom Owner',
      subtitle: 'Super Admin',
      description: 'Manage the entire LuzLoom ecosystem, onboard new brokers, and view global performance.',
      icon: Shield,
      color: 'blue',
      path: '/admin',
      features: ['Broker Onboarding', 'Global Analytics', 'Platform Settings'],
      hidden: !isAdmin
    },
    {
      id: 'broker_admin',
      title: 'Broker Partner',
      subtitle: 'Broker Admin',
      description: 'Manage your own branded affiliate network. Select a broker to manage.',
      icon: Briefcase,
      color: 'gold',
      features: ['Custom Branding', 'Affiliate Management', 'Broker Stats']
    },
    {
      id: 'affiliate',
      title: 'Affiliate Partner',
      subtitle: 'Broker Affiliate',
      description: 'Promote a specific broker and earn commissions. Select a broker to join.',
      icon: Users,
      color: 'emerald',
      features: ['Promote Broker', 'Earn Commissions', 'AI Marketing Tools']
    }
  ];

  const filteredRoles = roles.filter(r => !r.hidden);

  const handleRoleClick = (role: any) => {
    if (role.path) {
      navigate(role.path);
    } else {
      setSelectedRole(role.id);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            <span>LuzLoom Multi-Tenant Affiliate Ecosystem</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Select Your Perspective
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Explore the different roles and dashboards within the LuzLoom platform. 
            Each role has a dedicated experience tailored to their needs.
          </p>
        </div>

        {!selectedRole ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredRoles.map((role) => (
              <div 
                key={role.id}
                onClick={() => handleRoleClick(role)}
                className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl p-8 hover:border-slate-700 transition-all cursor-pointer overflow-hidden"
              >
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                  <role.icon className="w-32 h-32" />
                </div>

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${role.color === 'gold' ? '[#d4af37]' : role.color + '-500'}/10 border border-${role.color === 'gold' ? '[#d4af37]' : role.color + '-500'}/20`}>
                    <role.icon className={`w-6 h-6 text-${role.color === 'gold' ? '[#d4af37]' : role.color + '-500'}`} />
                  </div>

                  <div className="mb-6">
                    <p className={`text-xs font-bold uppercase tracking-widest mb-1 text-${role.color === 'gold' ? '[#d4af37]' : role.color + '-500'}`}>
                      {role.subtitle}
                    </p>
                    <h2 className="text-2xl font-bold text-white">{role.title}</h2>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {role.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-500">
                        <div className={`w-1 h-1 rounded-full bg-${role.color === 'gold' ? '[#d4af37]' : role.color + '-500'}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-3 transition-all">
                    {role.id === 'super_admin' ? 'Enter Dashboard' : 'Select Broker'}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <button 
              onClick={() => setSelectedRole(null)}
              className="mb-8 text-slate-500 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Role Selection
            </button>

            <h2 className="text-3xl font-bold mb-8 text-center">
              Choose a Broker to {selectedRole === 'broker_admin' ? 'Manage' : 'Join'}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {brokers.length > 0 ? brokers.map((broker) => (
                <div 
                  key={broker.id}
                  onClick={() => navigate(`/broker/${broker.domain}${selectedRole === 'broker_admin' ? '/admin' : ''}`)}
                  className="group bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: broker.branding?.primaryColor || '#3B82F6', color: '#000' }}
                    >
                      {broker.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{broker.name}</h3>
                      <p className="text-slate-500 text-sm">{broker.domain}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors" />
                </div>
              )) : (
                <div className="text-center p-12 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                  <p className="text-slate-500">No brokers found. Please add a broker in the Super Admin panel first.</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-20 text-center text-slate-600 text-sm">
          <p>© 2026 LuzLoom Affiliate Platform. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
