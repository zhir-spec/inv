import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BrokerLanding() {
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this would be the actual broker's signup page.
    // Here we just show a mock success message.
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8">
        <div className="w-10 h-10 bg-emerald-500 rounded-full animate-pulse"></div>
      </div>
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to the Brokerage</h1>
      <p className="text-xl text-slate-400 mb-10">
        You've been successfully referred! This is where the user would complete their registration with the broker.
      </p>
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 w-full mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Registration Form (Mock)</h3>
        <div className="space-y-4">
          <div className="h-12 bg-slate-800 rounded-lg"></div>
          <div className="h-12 bg-slate-800 rounded-lg"></div>
          <div className="h-12 bg-gold-500 rounded-lg"></div>
        </div>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="text-slate-500 hover:text-white transition-colors underline underline-offset-4"
      >
        Back to Affiliate Portal
      </button>
    </div>
  );
}
