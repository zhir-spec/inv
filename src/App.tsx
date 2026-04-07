import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateReferralCode } from './lib/utils';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth';
import ReferralRedirect from './components/ReferralRedirect';
import BrokerLanding from './components/BrokerLanding';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock loading
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setProfile(parsed);
    }
    setLoading(false);
  }, []);

  const login = (userData: any) => {
    const newProfile = {
      ...userData,
      uid: userData.uid || Math.random().toString(36).substr(2, 9),
      referralCode: userData.referralCode || generateReferralCode(),
      role: 'affiliate',
      level: 'Bronze',
      totalClicks: 124,
      totalSignups: 12,
      totalConversions: 3,
      earnings: 450.50,
      createdAt: new Date().toISOString(),
    };
    setUser(newProfile);
    setProfile(newProfile);
    localStorage.setItem('mock_user', JSON.stringify(newProfile));
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('mock_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-gold-500/30">
        <Navbar user={user} profile={profile} onLogout={logout} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Auth onLogin={login} currentUser={user} />} />
            <Route path="/dashboard" element={user ? <Dashboard profile={profile} /> : <Navigate to="/" />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/ref/:code" element={<ReferralRedirect />} />
            <Route path="/broker-landing" element={<BrokerLanding />} />
            <Route path="/:username" element={<LandingPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
