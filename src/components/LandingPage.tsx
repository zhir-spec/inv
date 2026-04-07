import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="max-w-5xl mx-auto py-12">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-sm font-bold mb-8"
        >
          Recommended by {username}
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
          The Future of <span className="text-gold-500">Investing</span> is Here.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Join thousands of investors using our institutional-grade platform. Low spreads, lightning-fast execution, and 24/7 expert support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-5 bg-gold-500 hover:bg-gold-600 text-black rounded-2xl font-black text-lg transition-all shadow-xl shadow-gold-600/30 flex items-center justify-center gap-2 group">
            Open Free Account
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-lg transition-all border border-slate-800">
            View Live Spreads
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 opacity-50 grayscale hover:grayscale-0 transition-all">
        <div className="flex items-center justify-center font-bold text-xl text-slate-500">FINMA REGULATED</div>
        <div className="flex items-center justify-center font-bold text-xl text-slate-500">ASIC LICENSED</div>
        <div className="flex items-center justify-center font-bold text-xl text-slate-500">FCA AUTHORIZED</div>
        <div className="flex items-center justify-center font-bold text-xl text-slate-500">SFC COMPLIANT</div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        <Feature 
          icon={<Zap className="w-8 h-8 text-gold-400" />}
          title="0.0 Pips Spreads"
          description="Institutional liquidity for retail traders. Get the best pricing in the market."
        />
        <Feature 
          icon={<TrendingUp className="w-8 h-8 text-emerald-400" />}
          title="1:300 Leverage"
          description="Maximize your trading potential with flexible leverage options."
        />
        <Feature 
          icon={<Shield className="w-8 h-8 text-gold-500" />}
          title="Negative Balance Protection"
          description="Your safety is our priority. You can never lose more than your balance."
        />
      </div>

      {/* Social Proof */}
      <div className="p-12 rounded-[3rem] bg-slate-900 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <CheckCircle2 className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">Why trade with us?</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-gold-500" />
              Over 250+ tradable assets (Forex, Crypto, Stocks)
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-gold-500" />
              Instant deposits and same-day withdrawals
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-gold-500" />
              Award-winning MT4/MT5 and WebTrader platforms
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCircle2 className="w-5 h-5 text-gold-500" />
              Dedicated account manager for every client
            </li>
          </ul>
          <button className="mt-10 px-8 py-4 bg-white text-slate-950 rounded-xl font-black transition-all hover:bg-slate-100 active:scale-95">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-slate-950 border border-slate-900 hover:border-gold-500/20 transition-all group">
      <div className="mb-6 p-4 rounded-2xl bg-slate-900 w-fit group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
