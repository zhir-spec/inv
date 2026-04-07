import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export const crmService = {
  // Mock CRM Integration
  async createAffiliate(userData: any) {
    console.log("CRM: Creating affiliate", userData);
    return { crmId: `crm_${Math.random().toString(36).substr(2, 9)}` };
  },

  async fetchReferralLink(referralCode: string) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/ref/${referralCode}`;
  },

  async syncConversions(affiliateId: string) {
    console.log("CRM: Syncing conversions for", affiliateId);
    // In a real app, this would fetch from a CRM API
    return [];
  }
};

export const trackingService = {
  async trackClick(referralCode: string) {
    try {
      // Find affiliate by referral code
      const q = query(collection(db, 'users'), where('referralCode', '==', referralCode));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const affiliateDoc = querySnapshot.docs[0];
      const affiliateId = affiliateDoc.id;

      // Log click
      await addDoc(collection(db, 'clicks'), {
        affiliateId,
        referralCode,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent
      });

      // Increment click count on user profile
      await updateDoc(doc(db, 'users', affiliateId), {
        totalClicks: increment(1)
      });

      return affiliateId;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'clicks');
      return null;
    }
  },

  async trackSignup(affiliateId: string, referredUserId: string) {
    try {
      await addDoc(collection(db, 'referrals'), {
        affiliateId,
        referredUserId,
        status: 'signup',
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'users', affiliateId), {
        totalSignups: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'referrals');
    }
  }
};
