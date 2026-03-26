const { db, auth } = require('./config/firebase');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Add Buses
    const bus1 = await db.collection('buses').add({
      busNumber: 'MH-12-AB-1234',
      capacity: 50,
      status: 'active',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Added Bus MH-12-AB-1234');

    const bus2 = await db.collection('buses').add({
      busNumber: 'MH-12-XY-9876',
      capacity: 40,
      status: 'maintenance',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Added Bus MH-12-XY-9876');

    // 2. Add Routes
    await db.collection('routes').add({
      source: 'City Center',
      destination: 'Campus Main Gate',
      stops: ['Station', 'Market', 'Square'],
      createdAt: new Date().toISOString()
    });
    console.log('✅ Added Route: City Center to Campus');

    // 3. Add Users
    const users = [
      { email: 'admin@college.edu', name: 'Admin User', role: 'admin', assignedBus: null, password: 'password123' },
      { email: 'incharge@college.edu', name: 'Transport Incharge', role: 'transport_in_charge', assignedBus: null, password: 'password123' },
      { email: 'driver@college.edu', name: 'John Driver', role: 'driver', assignedBus: 'MH-12-AB-1234', password: 'password123' },
      { email: 'student@college.edu', name: 'Alice Student', role: 'student', assignedBus: null, password: 'password123' }
    ];

    for (const usr of users) {
      try {
        // Create auth user
        let userRecord;
        try {
          userRecord = await auth.getUserByEmail(usr.email);
          console.log(`User ${usr.email} already exists in auth.`);
        } catch (e) {
             userRecord = await auth.createUser({
                email: usr.email,
                password: usr.password,
                displayName: usr.name,
              });
        }
       
        // Create firestore document
        await db.collection('users').doc(userRecord.uid).set({
          name: usr.name,
          email: usr.email,
          role: usr.role,
          assignedBus: usr.assignedBus,
          createdAt: new Date().toISOString()
        });
        console.log(`✅ Added User: ${usr.name} (${usr.role})`);
      } catch (err) {
        console.error(`❌ Failed to add user ${usr.email}:`, err.message);
      }
    }

    // 4. Add Sample Complaints
    const studentDoc = await db.collection('users').where('role', '==', 'student').limit(1).get();
    let studentId = studentDoc.empty ? 'sample_student_id' : studentDoc.docs[0].id;

    await db.collection('complaints').add({
      studentId: studentId,
      studentName: 'Alice Student',
      title: 'Bus was delayed',
      description: 'The bus arrived 20 minutes late at the Market stop today.',
      category: 'delay',
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    console.log('✅ Added Sample Complaint');

    console.log('✨ Database seeding complete! You can now log in with the test accounts.');
    console.log('\n--- Test Accounts (Password for all: password123) ---');
    console.log('Admin: admin@college.edu');
    console.log('In-Charge: incharge@college.edu');
    console.log('Driver: driver@college.edu');
    console.log('Student: student@college.edu');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();
