const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const apiKey = envConfig.VITE_FIREBASE_API_KEY;

if (!apiKey || apiKey === 'YOUR_API_KEY') {
  console.error('❌ ERROR: API Key is missing or still set to YOUR_API_KEY. Please update frontend/.env');
  process.exit(1);
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
    console.log('✅✅✅ SUCCESS: API Key is valid and student@college.edu successfully logged in via REST API.');
  } else {
    console.log('❌❌❌ FAIL:', data.error.message);
  }
}).catch(err => console.error('Fetch error:', err));
