const { auth } = require('./config/firebase');

async function checkUsers() {
  try {
    const listUsersResult = await auth.listUsers(10);
    const users = listUsersResult.users.map(u => ({ email: u.email, uid: u.uid }));
    console.log("Users in Firebase Auth:", JSON.stringify(users, null, 2));
    
    // Check if Password auth is enabled. The admin SDK can't easily check auth providers status directly, 
    // but we can check if the user exists.
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    process.exit(0);
  }
}

checkUsers();
