const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '..', 'frontend', '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const apiKey = envConfig.VITE_FIREBASE_API_KEY;

if (!apiKey || apiKey === 'YOUR_API_KEY') {
  console.log('🚨 FAIL: VITE_FIREBASE_API_KEY is missing or set to a placeholder in frontend/.env');
  process.exit(0);
}

const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@college.edu',
    password: 'password123',
    returnSecureToken: true
  })
}).then(res => res.json()).then(data => {
  if (data.idToken) {
    console.log('✅✅✅ SUCCESS: Auth passed securely for student@college.edu');
  } else {
    console.log(`❌❌❌ FAIL: Firebase error message: ${data.error.message}`);
  }
}).catch(err => console.error('Fetch error:', err));
