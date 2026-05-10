import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('Using API Key:', firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 8) + '***' : 'MISSING');

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testLogin() {
  try {
    console.log('Attempting login with student@college.edu...');
    const userCredential = await signInWithEmailAndPassword(auth, 'student@college.edu', 'password123');
    console.log('✅ SUCCESS! Logged in as:', userCredential.user.email);
    console.log('Since it succeeded here, the issue is that your frontend React app needs to be restarted, or your browser is caching the old version.');
  } catch (error) {
    console.error('❌ FAILED. Firebase Error Code:', error.code);
    console.error('Firebase Error Message:', error.message);
    
    if (error.code === 'auth/invalid-credential') {
      console.log('➡️ This means the email/password is wrong, or the .env points to a different Firebase project than where the user exists.');
    } else if (error.code === 'auth/operation-not-allowed') {
      console.log('➡️ This means Email/Password authentication is completely DISABLED in your Firebase Console.');
    } else if (error.code === 'auth/invalid-api-key') {
      console.log('➡️ Your .env file has an invalid API key.');
    }
  } finally {
    process.exit(0);
  }
}

testLogin();
