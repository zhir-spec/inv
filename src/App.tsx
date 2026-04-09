import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
import { generateReferralCode } from './lib/utils';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import Leaderboard from './components/Leaderboard';
import Auth from './components/Auth';
import ReferralRedirect from './components/ReferralRedirect';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import BrokerAdminDashboard from './components/BrokerAdminDashboard';
import AllPagesAdmin from './components/AllPagesAdmin';
import DynamicPortal from './components/DynamicPortal';
import PlatformLanding from './components/PlatformLanding';
import ProfileSettings from './components/ProfileSettings';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

function AdminLayout() {
  const { user, profile, logout } = useAuth();
  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-blue-500/30">
      <Navbar user={user} profile={profile} onLogout={logout} />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrokers = async () => {
      try {
        const bSnap = await getDocs(collection(db, 'brokers'));
        const brokersData = bSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log("Fetched brokers:", brokersData);
        setBrokers(brokersData);
      } catch (error) {
        console.error("Error fetching brokers:", error);
      }
    };
    fetchBrokers();
  }, []);

  useEffect(() => {
    console.log("App profile:", profile);
    // Safety timeout to prevent infinite loading if Firebase hangs
    const timeout = setTimeout(() => {
      if (loading) setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch profile from Firestore
          let userDoc;
          try {
            userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
            return;
          }

          if (userDoc.exists()) {
            const data = userDoc.data();
            setProfile(data);
            
            // Auto-seed/Update the "Investment Affiliate" broker if user is super admin
            if (data.role === 'super_admin') {
              const brokerDomain = 'investment-affiliate';
              const brokersRef = collection(db, 'brokers');
              let brokerSnap;
              try {
                const q = query(brokersRef, where('domain', '==', brokerDomain));
                brokerSnap = await getDocs(q);
              } catch (error) {
                handleFirestoreError(error, OperationType.LIST, 'brokers');
                return;
              }
              
              const goldBlackBranding = {
                primaryColor: '#d4af37', // Gold
                secondaryColor: '#000000', // Black
                accentColor: '#d4af37',
                logoUrl: '',
                companyName: 'Investment Affiliate',
                heroTitle: 'The Future of Investing is Here.',
                heroSubtitle: 'Join our elite affiliate network and start earning today.'
              };

              if (brokerSnap.empty) {
                console.log('Seeding Investment Affiliate broker...');
                try {
                  await addDoc(brokersRef, {
                    name: 'Investment Affiliate',
                    domain: brokerDomain,
                    branding: goldBlackBranding,
                    stats: {
                      totalAffiliates: 0,
                      totalClicks: 0,
                      totalSignups: 0,
                      totalRevenue: 0
                    },
                    createdAt: new Date().toISOString()
                  });
                } catch (error) {
                  handleFirestoreError(error, OperationType.CREATE, 'brokers');
                }
              } else {
                // Force update branding if it's different (to ensure gold/black theme)
                const existingBroker = brokerSnap.docs[0];
                const existingData = existingBroker.data();
                if (existingData.branding.primaryColor !== '#d4af37') {
                  console.log('Updating Investment Affiliate branding to Gold/Black...');
                  try {
                    await updateDoc(doc(db, 'brokers', existingBroker.id), {
                      branding: goldBlackBranding
                    });
                  } catch (error) {
                    handleFirestoreError(error, OperationType.UPDATE, `brokers/${existingBroker.id}`);
                  }
                }
              }
            }
          } else {
            // Create default profile if it doesn't exist
            const pathParts = window.location.pathname.split('/');
            const brokerDomainFromUrl = pathParts[1] === 'broker' ? pathParts[2] : null;
            
            let brokerId = null;
            if (brokerDomainFromUrl) {
              try {
                const bSnap = await getDocs(query(collection(db, 'brokers'), where('domain', '==', brokerDomainFromUrl)));
                if (!bSnap.empty) {
                  brokerId = bSnap.docs[0].id;
                }
              } catch (error) {
                handleFirestoreError(error, OperationType.LIST, 'brokers');
              }
            }

            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              role: firebaseUser.email === 'zhir.investmentspot@gmail.com' ? 'super_admin' : 'affiliate',
              brokerId: brokerId,
              referralCode: generateReferralCode(),
              level: 'Bronze',
              stats: {
                clicks: 0,
                signups: 0,
                conversions: 0,
                earnings: 0
              },
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
              setProfile(newProfile);
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
            }
          }
        } catch (error) {
          console.error('Error in auth state change handler:', error);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
      clearTimeout(timeout);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      <Router>
        {user && !user.emailVerified && user.email !== 'zhir.investmentspot@gmail.com' && (
          <div className="bg-amber-500 text-black text-center py-2 text-xs font-bold sticky top-0 z-[60]">
            Please verify your email address to access all features. 
            <button 
              onClick={async () => {
                try {
                  await sendEmailVerification(auth.currentUser!);
                  alert('Verification email sent!');
                } catch (e) {
                  alert('Failed to send verification email. Please try again later.');
                }
              }}
              className="ml-2 underline"
            >
              Resend Email
            </button>
          </div>
        )}
        <Routes>
          {/* Super Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={
              profile?.role === 'super_admin' 
                ? <SuperAdminDashboard /> 
                : (user ? <Navigate to="/" /> : <Auth onLogin={() => {}} currentUser={user} />)
            } />
            <Route path="/admin/all-pages" element={
              profile?.role === 'super_admin' 
                ? <AllPagesAdmin /> 
                : (user ? <Navigate to="/" /> : <Auth onLogin={() => {}} currentUser={user} />)
            } />
            <Route path="/profile" element={user ? <ProfileSettings /> : <Navigate to="/login" />} />
            <Route path="/settings" element={user ? <ProfileSettings /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Auth onLogin={() => {}} currentUser={user} />} />
          </Route>

          {/* Multi-tenant Broker Routes */}
          <Route path="/broker/:brokerDomain" element={<DynamicPortal />}>
            <Route index element={<LandingPage />} />
            <Route path="auth" element={<Auth onLogin={() => {}} currentUser={user} />} />
            <Route path="dashboard" element={user ? <Dashboard profile={profile} /> : <Navigate to="../auth" />} />
            <Route path="admin" element={
              profile?.role === 'super_admin' || (profile?.role === 'broker_admin' && profile?.brokerId) 
                ? <BrokerAdminDashboard /> 
                : <Navigate to="../auth" />
            } />
            <Route path="profile" element={user ? <ProfileSettings /> : <Navigate to="../auth" />} />
            <Route path="settings" element={user ? <ProfileSettings /> : <Navigate to="../auth" />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="ref/:code" element={<ReferralRedirect />} />
            <Route path=":username" element={<LandingPage />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<PlatformLanding brokers={brokers} />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
