import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Broker } from '../types';
import Navbar from './Navbar';
import { useAuth } from '../App';

export interface TenantContextType {
  broker: Broker | null;
  loading: boolean;
}

export const TenantContext = createContext<TenantContextType>({ broker: null, loading: true });

export const useTenant = () => useContext(TenantContext);

export default function DynamicPortal() {
  const { brokerDomain } = useParams<{ brokerDomain: string }>();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile, logout } = useAuth();

  useEffect(() => {
    const fetchBroker = async () => {
      if (!brokerDomain) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'brokers'), where('domain', '==', brokerDomain));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setBroker({ id: doc.id, ...doc.data() } as Broker);
        } else {
          setBroker(null);
        }
      } catch (error) {
        console.error('Error fetching broker:', error);
        setBroker(null);
      }
      setLoading(false);
    };

    fetchBroker();
  }, [brokerDomain]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!broker && brokerDomain !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Broker Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          The broker portal you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
          >
            Go Home
          </button>
          <button 
            onClick={() => window.location.href = '/admin'}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors"
          >
            Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ broker, loading }}>
      <div 
        className="min-h-screen bg-slate-950 text-slate-100"
        style={broker ? { 
          '--primary': broker.branding.primaryColor,
          '--accent': broker.branding.accentColor,
          '--secondary': broker.branding.secondaryColor,
          '--primary-rgb': broker.branding.primaryColor.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')
        } as any : {}}
      >
        <Navbar user={user} profile={profile} onLogout={logout} />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    </TenantContext.Provider>
  );
}
