const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const {
  FIREBASE_SERVICE_ACCOUNT_PATH,
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} = process.env;

let credential;

// Method 1: Load from JSON file path (Easiest & Most Reliable)
if (FIREBASE_SERVICE_ACCOUNT_PATH) {
  const resolvedPath = path.isAbsolute(FIREBASE_SERVICE_ACCOUNT_PATH) 
    ? FIREBASE_SERVICE_ACCOUNT_PATH 
    : path.join(__dirname, '..', FIREBASE_SERVICE_ACCOUNT_PATH);
    
  if (fs.existsSync(resolvedPath)) {
    credential = admin.credential.cert(resolvedPath);
  }
}

// Method 2: Fallback to individual ENV variables
if (!credential && FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
  let privateKey = FIREBASE_PRIVATE_KEY.trim();
  // Remove surrounding quotes if they exist
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }
  privateKey = privateKey.replace(/\\n/g, '\n');
  
  credential = admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  });
}

if (!credential) {
  console.error('❌ Firebase credentials not found. Please check your .env file.');
  process.exit(1);
}

admin.initializeApp({ credential });

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
