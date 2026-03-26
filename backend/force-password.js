const { auth } = require('./config/firebase');

async function forcePasswords() {
  console.log("Forcing passwords to 'password123' for all test accounts...");
  const emails = [
    'admin@college.edu',
    'incharge@college.edu',
    'driver@college.edu',
    'student@college.edu'
  ];

  for (const email of emails) {
    try {
      const userRecord = await auth.getUserByEmail(email);
      await auth.updateUser(userRecord.uid, {
        password: 'password123'
      });
      console.log(`✅ Password reset for ${email} to 'password123'`);
    } catch (error) {
       console.log(`❌ Could not update ${email}: it might not exist.`);
    }
  }
}

forcePasswords().then(() => process.exit(0));
