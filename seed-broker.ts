
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  const domain = 'investment-affiliate';
  const q = query(collection(db, 'brokers'), where('domain', '==', domain));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('Creating Investment Affiliate broker...');
    await addDoc(collection(db, 'brokers'), {
      name: 'Investment Affiliate',
      domain: domain,
      branding: {
        primaryColor: '#d4af37', // Gold
        secondaryColor: '#000000', // Black
        accentColor: '#d4af37',
        logoUrl: '',
        companyName: 'Investment Affiliate',
        heroTitle: 'The Future of Investing is Here.',
        heroSubtitle: 'Join our elite affiliate network and start earning today.'
      },
      stats: {
        totalAffiliates: 0,
        totalClicks: 0,
        totalSignups: 0,
        totalRevenue: 0
      },
      createdAt: new Date().toISOString()
    });
    console.log('Done!');
  } else {
    console.log('Broker already exists.');
  }
}

seed().catch(console.error);
