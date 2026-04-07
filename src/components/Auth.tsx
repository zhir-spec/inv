import React from 'react';
import { LogIn, ShieldCheck, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Auth({ onLogin, currentUser }: { onLogin: (user: any) => void, currentUser: any }) {
  const navigate = useNavigate();

  const handleMockLogin = () => {
    if (currentUser) {
      navigate('/dashboard');
      return;
    }
    onLogin({
      displayName: 'Investment Partner',
      email: 'partner@investment-spot.com',
      photoURL: null
    });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" />
          <span>AI-Powered Affiliate Machine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          Scale Your Investment <br /> Affiliate Empire
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
          Join the elite network of investment affiliates. Get unique tracking links, AI-generated marketing content, and real-time performance analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={handleMockLogin}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gold-500 hover:bg-gold-600 text-black rounded-xl font-bold transition-all shadow-lg shadow-gold-500/20 active:scale-95"
          >
            {currentUser ? (
              <>
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Get Started Now
              </>
            )}
          </button>
          
          <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all border border-slate-800 active:scale-95">
            Learn More
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
            title="Real-time Tracking"
            description="Track every click, signup, and conversion with precision. No more guessing."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-400" />}
            title="AI Content Engine"
            description="Generate viral TikTok scripts and Instagram captions in seconds with Gemini AI."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-gold-400" />}
            title="Secure Payouts"
            description="Transparent earnings model with CPA and RevShare logic built-in."
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-gold-500/30 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
