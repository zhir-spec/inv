import React, { useState, useEffect } from 'react';
import { Users, Briefcase, TrendingUp, Plus, Settings, ExternalLink, Shield, Trash2, Edit2, Save, X } from 'lucide-react';
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Broker } from '../types';
import { useAuth } from '../App';

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'brokers' | 'users' | 'demos'>('brokers');
  const [isAddingBroker, setIsAddingBroker] = useState(false);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [newBroker, setNewBroker] = useState({ name: '', domain: '' });

  // ... (rest of the component)

  useEffect(() => {
    if (profile?.role !== 'super_admin') return;
    const fetchData = async () => {
      try {
        const bQ = query(collection(db, 'brokers'), orderBy('createdAt', 'desc'));
        const bSnap = await getDocs(bQ);
        setBrokers(bSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Broker)));

        const uQ = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(50));
        const uSnap = await getDocs(uQ);
        setUsers(uSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const dQ = query(collection(db, 'demo_requests'), orderBy('createdAt', 'desc'), limit(50));
        const dSnap = await getDocs(dQ);
        setDemoRequests(dSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [profile]);

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleAddBroker = async (e: React.FormEvent) => {
    e.preventDefault();
    const brokerData = {
      name: newBroker.name,
      domain: newBroker.domain.toLowerCase().replace(/\s+/g, '-'),
      branding: {
        primaryColor: '#3B82F6',
        secondaryColor: '#1E293B',
        accentColor: '#60A5FA',
        logoUrl: '',
        companyName: newBroker.name,
        heroTitle: `Welcome to ${newBroker.name}`,
        heroSubtitle: 'Join our elite affiliate network and start earning today.'
      },
      stats: {
        totalAffiliates: 0,
        totalClicks: 0,
        totalSignups: 0,
        totalRevenue: 0
      },
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'brokers'), brokerData);
      setBrokers([{ id: docRef.id, ...brokerData } as Broker, ...brokers]);
      setIsAddingBroker(false);
      setNewBroker({ name: '', domain: '' });
    } catch (error) {
      console.error('Error adding broker:', error);
    }
  };

  const handleDeleteBroker = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this broker? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'brokers', id));
        setBrokers(brokers.filter(b => b.id !== id));
      } catch (error) {
        console.error('Error deleting broker:', error);
      }
    }
  };

  const totalRevenue = brokers.length > 0 
    ? brokers.reduce((acc, b) => acc + (b.stats?.totalRevenue || 0), 0)
    : 145800; // Mock global revenue
  const totalAffiliates = brokers.length > 0
    ? brokers.reduce((acc, b) => acc + (b.stats?.totalAffiliates || 0), 0)
    : 1240; // Mock global affiliates
  const displayBrokersCount = brokers.length > 0 ? brokers.length : 12; // Mock global brokers

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (profile?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Access Denied. Super Admin only.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="text-blue-500" />
            Super Admin Control
          </h1>
          <p className="text-slate-400">Manage your broker network and global performance.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('brokers')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'brokers' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            Brokers
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('demos')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'demos' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            Demo Requests
            {demoRequests.filter(d => d.status === 'new').length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {demoRequests.filter(d => d.status === 'new').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setIsAddingBroker(true)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            <Plus size={20} />
            Add Broker
          </button>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Brokers', value: displayBrokersCount, icon: Briefcase, color: 'blue' },
          { label: 'Total Affiliates', value: totalAffiliates, icon: Users, color: 'purple' },
          { label: 'Global Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl"
          >
            <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
              <stat.icon className={`text-${stat.color}-500`} size={24} />
            </div>
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Broker List or User List */}
      {activeTab === 'brokers' ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-bottom border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Brokers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Broker Name</th>
                  <th className="px-6 py-4 font-semibold">Domain</th>
                  <th className="px-6 py-4 font-semibold">Logo URL</th>
                  <th className="px-6 py-4 font-semibold">Affiliates</th>
                  <th className="px-6 py-4 font-semibold">Revenue</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {brokers.length > 0 ? brokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold">
                          {broker.name[0]}
                        </div>
                        <span className="font-medium">{broker.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                      {broker.domain}
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="text"
                        value={broker.branding?.logoUrl || ''}
                        onChange={async (e) => {
                          const newLogoUrl = e.target.value;
                          try {
                            await updateDoc(doc(db, 'brokers', broker.id), { 'branding.logoUrl': newLogoUrl });
                            setBrokers(brokers.map(b => b.id === broker.id ? { ...b, branding: { ...b.branding, logoUrl: newLogoUrl } } : b));
                          } catch (error) {
                            console.error('Error updating logo:', error);
                          }
                        }}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white w-32"
                        placeholder="Logo URL"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{broker.stats?.totalAffiliates || 0}</td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      ${(broker.stats?.totalRevenue || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingBroker(broker)}
                          className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-500 transition-colors"
                          title="Edit Broker"
                        >
                          <Edit2 size={18} />
                        </button>
                        <a 
                          href={`/broker/${broker.domain}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                          title="View Portal"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button 
                          onClick={() => handleDeleteBroker(broker.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors" 
                          title="Delete Broker"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  // Mock Brokers for Preview
                  ['Capital One', 'Global FX', 'Prime Traders', 'Elite Markets'].map((name, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors group opacity-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold">
                            {name[0]}
                          </div>
                          <span className="font-medium">{name} (Demo)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-sm">
                        {name.toLowerCase().replace(/\s+/g, '-')}
                      </td>
                      <td className="px-6 py-4 font-medium">{Math.floor(Math.random() * 500)}</td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        ${Math.floor(Math.random() * 50000).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-wider">
                          Preview
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        Locked in Preview
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'demos' ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-bottom border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold">Demo Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Brokerage</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {demoRequests.length > 0 ? demoRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">{req.fullName}</td>
                    <td className="px-6 py-4 text-slate-400">{req.email}</td>
                    <td className="px-6 py-4 font-medium">{req.brokerageName}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={req.status || 'new'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await updateDoc(doc(db, 'demo_requests', req.id), { status: newStatus });
                            setDemoRequests(demoRequests.map(d => d.id === req.id ? { ...d, status: newStatus } : d));
                          } catch (error) {
                            console.error('Error updating status:', error);
                          }
                        }}
                        className={`bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-500 ${req.status === 'new' ? 'text-red-400' : req.status === 'contacted' ? 'text-blue-400' : 'text-emerald-400'}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={async () => {
                          if (window.confirm('Delete this request?')) {
                            try {
                              await deleteDoc(doc(db, 'demo_requests', req.id));
                              setDemoRequests(demoRequests.filter(d => d.id !== req.id));
                            } catch (error) {
                              console.error('Error deleting request:', error);
                            }
                          }
                        }}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No demo requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-bottom border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold">Platform Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Broker</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.displayName}</td>
                    <td className="px-6 py-4 text-slate-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="broker_admin">Broker Admin</option>
                        <option value="affiliate">Affiliate</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {brokers.find(b => b.id === user.brokerId)?.name || 'None'}
                    </td>
                    <td className="px-6 py-4">
                      {/* Add more user actions if needed */}
                    </td>
                  </tr>
                )) : (
                  // Mock Users for Preview
                  ['John Doe', 'Jane Smith', 'Robert Brown'].map((name, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors opacity-50">
                      <td className="px-6 py-4 font-medium">{name} (Demo)</td>
                      <td className="px-6 py-4 text-slate-400">{name.toLowerCase().replace(' ', '.')}@example.com</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          Affiliate
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">None</td>
                      <td className="px-6 py-4 text-slate-600 text-xs">Locked</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Broker Modal */}
      {editingBroker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Edit {editingBroker.name}</h2>
              <button onClick={() => setEditingBroker(null)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateDoc(doc(db, 'brokers', editingBroker.id), { 
                  name: editingBroker.name,
                  domain: editingBroker.domain,
                  branding: editingBroker.branding,
                  stats: editingBroker.stats
                });
                setBrokers(brokers.map(b => b.id === editingBroker.id ? editingBroker : b));
                setEditingBroker(null);
              } catch (error) {
                console.error('Error updating broker:', error);
              }
            }} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Broker Name</label>
                  <input type="text" value={editingBroker.name} onChange={(e) => setEditingBroker({...editingBroker, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Domain</label>
                  <input type="text" value={editingBroker.domain} onChange={(e) => setEditingBroker({...editingBroker, domain: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-lg font-semibold mb-4">Branding & UI</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                    <input type="text" value={editingBroker.branding?.companyName || ''} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, companyName: e.target.value}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Logo URL</label>
                    <input type="text" value={editingBroker.branding?.logoUrl || ''} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, logoUrl: e.target.value}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Hero Title</label>
                    <input type="text" value={editingBroker.branding?.heroTitle || ''} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, heroTitle: e.target.value}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Hero Subtitle</label>
                    <input type="text" value={editingBroker.branding?.heroSubtitle || ''} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, heroSubtitle: e.target.value}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Primary Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={editingBroker.branding?.primaryColor || '#3B82F6'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, primaryColor: e.target.value}} as Broker)} className="h-12 w-12 rounded cursor-pointer bg-slate-800 border border-slate-700" />
                        <input type="text" value={editingBroker.branding?.primaryColor || '#3B82F6'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, primaryColor: e.target.value}} as Broker)} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Secondary Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={editingBroker.branding?.secondaryColor || '#1E293B'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, secondaryColor: e.target.value}} as Broker)} className="h-12 w-12 rounded cursor-pointer bg-slate-800 border border-slate-700" />
                        <input type="text" value={editingBroker.branding?.secondaryColor || '#1E293B'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, secondaryColor: e.target.value}} as Broker)} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Accent Color</label>
                      <div className="flex gap-2">
                        <input type="color" value={editingBroker.branding?.accentColor || '#60A5FA'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, accentColor: e.target.value}} as Broker)} className="h-12 w-12 rounded cursor-pointer bg-slate-800 border border-slate-700" />
                        <input type="text" value={editingBroker.branding?.accentColor || '#60A5FA'} onChange={(e) => setEditingBroker({...editingBroker, branding: {...editingBroker.branding, accentColor: e.target.value}} as Broker)} className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <h3 className="text-lg font-semibold mb-4">Stats Override</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Total Affiliates</label>
                    <input type="number" value={editingBroker.stats?.totalAffiliates || 0} onChange={(e) => setEditingBroker({...editingBroker, stats: {...editingBroker.stats, totalAffiliates: parseInt(e.target.value) || 0}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Total Clicks</label>
                    <input type="number" value={editingBroker.stats?.totalClicks || 0} onChange={(e) => setEditingBroker({...editingBroker, stats: {...editingBroker.stats, totalClicks: parseInt(e.target.value) || 0}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Total Signups</label>
                    <input type="number" value={editingBroker.stats?.totalSignups || 0} onChange={(e) => setEditingBroker({...editingBroker, stats: {...editingBroker.stats, totalSignups: parseInt(e.target.value) || 0}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Total Revenue ($)</label>
                    <input type="number" value={editingBroker.stats?.totalRevenue || 0} onChange={(e) => setEditingBroker({...editingBroker, stats: {...editingBroker.stats, totalRevenue: parseInt(e.target.value) || 0}} as Broker)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3" />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-6">
                <Save size={20} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Broker Modal */}
      {isAddingBroker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-6">Setup New Broker</h2>
            <form onSubmit={handleAddBroker} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Broker Name</label>
                <input 
                  type="text"
                  required
                  value={newBroker.name}
                  onChange={(e) => setNewBroker({ ...newBroker, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Global Markets"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Subdomain / Slug</label>
                <input 
                  type="text"
                  required
                  value={newBroker.domain}
                  onChange={(e) => setNewBroker({ ...newBroker, domain: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. global-markets"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingBroker(false)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold border border-slate-700 hover:bg-slate-800 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Create Broker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
