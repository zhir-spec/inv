import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackingService } from '../services/trackingService';

export default function ReferralRedirect() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState(false);

  useEffect(() => {
    const track = async () => {
      if (code) {
        const affiliateId = await trackingService.trackClick(code);
        if (affiliateId) {
          // Store affiliate ID in local storage for signup tracking
          localStorage.setItem('referred_by', affiliateId);
          // Redirect to the actual broker's signup page
          window.location.href = `https://ib.investment-spot.com/?ref=${code}`;
        } else {
          setError(true);
        }
      }
    };
    track();
  }, [code, navigate]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Invalid Referral Link</h1>
        <p className="text-slate-400 mb-8">This referral code doesn't seem to exist.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gold-500 text-black rounded-xl font-bold hover:bg-gold-600 transition-colors"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500 mb-4"></div>
      <p className="text-slate-400">Redirecting you to our secure trading platform...</p>
    </div>
  );
}
