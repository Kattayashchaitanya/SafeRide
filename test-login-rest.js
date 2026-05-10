const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load frontend .env
const envPath = path.join(__dirname, '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const apiKey = envConfig.VITE_FIREBASE_API_KEY;

console.log('Using API Key from frontend/.env:', apiKey ? apiKey.substring(0, 8) + '***' : 'MISSING');

if (!apiKey || apiKey === 'YOUR_API_KEY') {
  console.error('❌ ERROR: API Key is missing or still set to the placeholder YOUR_API_KEY.');
  process.exit(1);
}

async function testAuth() {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@college.edu',
        password: 'password123',
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ SUCCESS! Successfully authenticated student@college.edu with password123 against the provided API Key.');
      console.log('The credentials and API Key in .env are VALID. The issue is definitely that the React/Vite server was not restarted.');
    } else {
      console.error('❌ FAILED. Firebase Error:', data.error.message);
      if (data.error.message === 'INVALID_LOGIN_CREDENTIALS') {
        console.error('➡️ This means the email/password is wrong for the project associated with this API key. Are you sure you copied the right config?');
      } else if (data.error.message === 'OPERATION_NOT_ALLOWED') {
        console.error('➡️ This means Email/Password authentication is completely DISABLED in your Firebase Console.');
      } else if (data.error.message === 'API_KEY_INVALID') {
        console.error('➡️ Your .env file has an invalid API key.');
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testAuth();
