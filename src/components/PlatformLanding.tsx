import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, TrendingUp, Users, ArrowRight, ChevronRight, CheckCircle2, Globe, BarChart3, X } from 'lucide-react';

export default function PlatformLanding({ brokers = [] }: { brokers?: any[] }) {
  const navigate = useNavigate();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState(false);
  const [demoFormStatus, setDemoFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setDemoFormStatus('success');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">LuzLoom</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#benefits" className="hover:text-white transition-colors">For Brokers</a>
            <button onClick={() => setIsAffiliateModalOpen(true)} className="hover:text-white transition-colors">For Affiliates</button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden md:block"
            >
              Admin Login
            </button>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all"
            >
              Request Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8">
            <Globe className="w-4 h-4" />
            <span>The #1 Multi-Tenant Affiliate Infrastructure</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent leading-tight">
            Scale Your Brokerage <br className="hidden md:block" />
            With AI-Powered Affiliates.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            LuzLoom is the ultimate white-label affiliate platform for investment brokers. 
            Launch your own branded portal, automate payouts, and empower your partners with AI marketing tools.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              Get a Broker Demo <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAffiliateModalOpen(true)}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-8 py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2"
            >
              I'm an Affiliate <Users className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-900/20 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to grow.</h2>
            <p className="text-slate-400 text-lg">Built specifically for high-volume investment and forex brokers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'White-Label Portals',
                desc: 'Your brand, your domain. Give your affiliates a premium, fully-branded dashboard experience.'
              },
              {
                icon: BarChart3,
                title: 'Real-Time Tracking',
                desc: 'Sub-second click and conversion tracking. Know exactly which campaigns are driving volume.'
              },
              {
                icon: Zap,
                title: 'AI Content Generator',
                desc: 'Equip your affiliates with an AI that generates high-converting social media posts and ad copy.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl hover:border-slate-700 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800/50 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-blue-500" />
          <span className="text-xl font-bold tracking-tight text-white">LuzLoom</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 LuzLoom Affiliate Platform. All rights reserved.</p>
      </footer>

      {/* Broker Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsDemoModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            
            {demoFormStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
                <p className="text-slate-400 mb-8">Our team will contact you shortly to schedule your personalized demo.</p>
                <button onClick={() => setIsDemoModalOpen(false)} className="w-full bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Request a Demo</h2>
                <p className="text-slate-400 mb-8">See how LuzLoom can scale your brokerage.</p>
                
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                    <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Work Email</label>
                    <input type="email" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@brokerage.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Brokerage Name</label>
                    <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Global Markets FX" />
                  </div>
                  <button 
                    type="submit" 
                    disabled={demoFormStatus === 'submitting'}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-6 py-4 rounded-xl font-bold transition-all mt-4 flex items-center justify-center"
                  >
                    {demoFormStatus === 'submitting' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Affiliate Selection Modal */}
      {isAffiliateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setIsAffiliateModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white z-10">
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6 pr-8">
              <h2 className="text-2xl font-bold mb-2">Select Your Broker</h2>
              <p className="text-slate-400">Choose the broker you want to promote or log into.</p>
            </div>

            <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
              {brokers && brokers.length > 0 ? brokers.map((broker) => (
                <div 
                  key={broker.id}
                  onClick={() => navigate(`/broker/${broker.domain}`)}
                  className="group bg-slate-800/50 border border-slate-700 p-4 rounded-2xl hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner"
                      style={{ backgroundColor: broker.branding?.primaryColor || '#3B82F6', color: '#fff' }}
                    >
                      {broker.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{broker.name}</h3>
                      <p className="text-slate-500 text-sm">{broker.domain}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              )) : (
                <div className="text-center p-8 bg-slate-800/30 border border-dashed border-slate-700 rounded-2xl">
                  <p className="text-slate-500">No active brokers found on the platform.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
