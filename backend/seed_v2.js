const { db } = require('./config/firebase');

async function seedAdvancedData() {
  console.log('--- Seeding Advanced Demo Data ---');
  
  // 1. Create some delayed arrivals to show in analytics
  const arrivals = [
    { busNumber: 'B-102', delayMinutes: 15, status: 'delayed', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { busNumber: 'B-102', delayMinutes: 8, status: 'delayed', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { busNumber: 'B-205', delayMinutes: 20, status: 'delayed', timestamp: new Date(Date.now() - 43200000).toISOString() },
    { busNumber: 'B-101', delayMinutes: 2, status: 'on-time', timestamp: new Date().toISOString() }
  ];

  for (const arrival of arrivals) {
    await db.collection('arrivals').add(arrival);
  }
  console.log('✅ Added sample arrival logs');

  // 2. Create some overcrowding complaints
  const complaints = [
    { busNumber: 'B-102', complaintType: 'overcrowding', description: 'Bus was completely full at the second stop.', status: 'pending', createdAt: new Date().toISOString() },
    { busNumber: 'B-102', complaintType: 'overcrowding', description: 'No space to stand.', status: 'pending', createdAt: new Date().toISOString() },
    { busNumber: 'B-205', complaintType: 'behavior', description: 'Driving too fast near the gate.', status: 'pending', createdAt: new Date().toISOString() }
  ];

  for (const complaint of complaints) {
    await db.collection('complaints').add(complaint);
  }
  console.log('✅ Added sample complaints');

  // 3. Ensure drivers have points initialized
  const driversSnap = await db.collection('users').where('role', '==', 'driver').get();
  for (const doc of driversSnap.docs) {
    await db.collection('users').doc(doc.id).update({
      points: 95,
      isBackup: doc.data().name.includes('Backup') || false,
      backupContact: '9876543210'
    });
  }
  console.log('✅ Updated driver points and backup flags');

  console.log('--- Seeding Complete ---');
  process.exit(0);
}

seedAdvancedData();
