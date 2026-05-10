const { db, auth } = require('./config/firebase');

async function seedTestCredentials() {
  console.log('🌱 Adding Test Credentials for Drivers and Students...');

  const users = [
    { email: 'driver1@college.edu', name: 'Rahul Sharma', role: 'driver', assignedBus: 'B-101', points: 95 },
    { email: 'driver2@college.edu', name: 'Suresh Kumar', role: 'driver', assignedBus: 'B-202', points: 88 },
    { email: 'student1@college.edu', name: 'Yash Chaitanya', role: 'student', assignedBus: 'B-101' },
    { email: 'student2@college.edu', name: 'Mohit Akash', role: 'student', assignedBus: 'B-202' }
  ];

  for (const usr of users) {
    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(usr.email);
        console.log(`User ${usr.email} already exists.`);
      } catch (e) {
        userRecord = await auth.createUser({
          email: usr.email,
          password: 'password123',
          displayName: usr.name,
        });
        console.log(`✅ Auth User Created: ${usr.email}`);
      }

      await db.collection('users').doc(userRecord.uid).set({
        name: usr.name,
        email: usr.email,
        role: usr.role,
        assignedBus: usr.assignedBus || null,
        points: usr.points !== undefined ? usr.points : 100,
        createdAt: new Date().toISOString()
      }, { merge: true });
      console.log(`✅ Firestore Doc Synced: ${usr.name} (${usr.role})`);
    } catch (err) {
      console.error(`❌ Error seeding ${usr.email}:`, err.message);
    }
  }

  // Ensure buses exist for these drivers
  const buses = ['B-101', 'B-202'];
  for (const bNum of buses) {
    const busQuery = await db.collection('buses').where('busNumber', '==', bNum).get();
    if (busQuery.empty) {
      await db.collection('buses').add({
        busNumber: bNum,
        capacity: 50,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Bus Created: ${bNum}`);
    }
  }

  console.log('✨ Seeding complete!');
  process.exit(0);
}

seedTestCredentials();
