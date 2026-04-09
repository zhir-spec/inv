import React, { useState } from 'react';
import { LogIn, ShieldCheck, TrendingUp, Zap, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useTenant } from './DynamicPortal';

import { useAuth } from '../App';

export default function Auth({ currentUser }: { onLogin: (user: any) => void, currentUser: any }) {
  const navigate = useNavigate();
  const { broker } = useTenant();
  const { profile } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return `Authentication method not enabled. Please check Firebase Console for project: ${auth.app.options.projectId}.`;
      case 'auth/popup-blocked':
        return 'Login popup was blocked by your browser. Please allow popups for this site.';
      case 'auth/cancelled-by-user':
        return 'Login was cancelled.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      // Ensure provider is configured correctly
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        setVerificationSent(true);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified && userCredential.user.email !== 'zhir.investmentspot@gmail.com') {
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
          await auth.signOut();
          return;
        }
      }
      if (!isRegistering) navigate('/');
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      setError(getFriendlyErrorMessage(err.code));
    }
  };

  // Default branding for Super Admin / Global Login
  const branding = broker?.branding || {
    primaryColor: '#3B82F6',
    accentColor: '#60A5FA',
    secondaryColor: '#1E293B',
    companyName: 'LuzLoom Affiliate',
    heroTitle: 'Global Affiliate Network',
    heroSubtitle: 'The most powerful multi-tenant affiliate management platform.'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-3xl w-full">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium mb-6 bg-[rgba(var(--primary-rgb),0.1)] border-[rgba(var(--primary-rgb),0.3)] text-[var(--primary)]"
        >
          <Zap className="w-4 h-4" />
          <span>AI-Powered Affiliate Machine</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
          {branding.heroTitle}
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto">
          {branding.heroSubtitle}
        </p>

        {broker && !currentUser && (
          <div className="mb-8 p-4 bg-[rgba(var(--primary-rgb),0.1)] border border-[rgba(var(--primary-rgb),0.2)] rounded-2xl inline-block">
            <p className="text-sm font-medium text-white">
              You are joining <span className="text-[var(--primary)] font-bold">{broker.name}</span> as an Affiliate Partner.
            </p>
          </div>
        )}

        {currentUser ? (
          <div className="flex flex-col items-center mb-16">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl mb-8 w-full max-w-md shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-slate-400 text-sm mb-1">Signed in as</p>
              <p className="text-white font-bold text-xl mb-2">{currentUser.email}</p>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                {profile?.role?.replace('_', ' ')}
              </div>
              <button 
                onClick={() => auth.signOut()}
                className="block w-full text-slate-500 hover:text-white text-sm font-medium transition-colors"
              >
                Sign Out to Test Registration
              </button>
            </div>
            <button
              onClick={() => {
                if (profile?.role === 'super_admin') {
                  navigate('/admin');
                } else if (broker) {
                  navigate('../dashboard');
                } else {
                  navigate('/');
                }
              }}
              className="flex items-center justify-center gap-2 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 bg-[var(--accent)] text-black"
              style={{ 
                boxShadow: `0 10px 15px -3px rgba(var(--primary-rgb),0.3)`
              }}
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-slate-900/50 border border-slate-800 p-8 rounded-3xl mb-16">
            <h2 className="text-2xl font-bold mb-6">{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
            
            {verificationSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Mail className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
                <p className="text-slate-400 mb-6">
                  We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
                  Please verify your account to continue.
                </p>
                <button 
                  onClick={() => {
                    setVerificationSent(false);
                    setIsRegistering(false);
                  }}
                  className="text-blue-400 font-semibold hover:underline"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <>
                <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold transition-all active:scale-95 bg-blue-600 text-white hover:bg-blue-700"
              >
                {isRegistering ? 'Register' : 'Login'}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-bold transition-all hover:bg-slate-100 active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              Google Login
            </button>

            <p className="mt-6 text-slate-400 text-sm">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-400 font-semibold hover:underline"
              >
                {isRegistering ? 'Login' : 'Register'}
              </button>
            </p>
          </>
        )}
      </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
            title="Real-time Tracking"
            description="Track every click, signup, and conversion with precision. No more guessing."
            accentColor={branding.primaryColor}
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-amber-400" />}
            title="AI Content Engine"
            description="Generate viral TikTok scripts and Instagram captions in seconds with Gemini AI."
            accentColor={branding.primaryColor}
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-400" />}
            title="Secure Payouts"
            description="Transparent earnings model with CPA and RevShare logic built-in."
            accentColor={branding.primaryColor}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, accentColor }: { icon: React.ReactNode, title: string, description: string, accentColor: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 transition-all duration-300"
      style={{ 
        borderColor: isHovered ? `${accentColor}50` : undefined,
        transform: isHovered ? 'translateY(-4px)' : undefined
      }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
