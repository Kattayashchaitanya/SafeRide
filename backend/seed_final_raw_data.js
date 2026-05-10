const { db } = require('./config/firebase');

async function seedFinalRawData() {
  console.log('🚀 Seeding EXTENSIVE Raw Data for ALL Drivers...');

  // 1. Fetch all drivers
  const driversSnap = await db.collection('users').where('role', '==', 'driver').get();
  const drivers = driversSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (drivers.length === 0) {
    console.log('❌ No drivers found. Seeding aborted.');
    process.exit(1);
  }

  const statuses = ['on-time', 'delayed', 'on-time', 'on-time', 'delayed'];
  const complaintTypes = ['rash_driving', 'overcrowding', 'hygiene', 'behavior', 'delay'];

  for (const driver of drivers) {
    const busNumber = driver.assignedBus || 'B-999';
    console.log(`📦 Generating 20+ records for ${driver.name} (Bus: ${busNumber})...`);

    // Add 10 Arrivals
    for (let i = 0; i < 10; i++) {
      const status = statuses[i % statuses.length];
      await db.collection('arrivals').add({
        busNumber,
        timestamp: new Date(Date.now() - (i * 3600000 * 6)).toISOString(),
        status,
        delayMinutes: status === 'delayed' ? Math.floor(Math.random() * 20) + 5 : 0
      });
    }

    // Add 5 Complaints
    for (let i = 0; i < 5; i++) {
      await db.collection('complaints').add({
        studentName: `Student ${i + 1}`,
        busNumber,
        complaintType: complaintTypes[i % complaintTypes.length],
        description: `This is a sample raw complaint #${i+1} for bus ${busNumber}. Logged during testing.`,
        status: i % 2 === 0 ? 'pending' : 'resolved',
        createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
      });
    }

    // Add 3 Penalties
    for (let i = 0; i < 3; i++) {
      await db.collection('penalties').add({
        driverId: driver.id,
        pointsDeducted: 2 * (i + 1),
        reason: `Penalty log #${i+1}: Observed deviation from standard safety protocol.`,
        createdAt: new Date(Date.now() - (i * 172800000)).toISOString()
      });
    }
  }

  console.log('✅ EXTENSIVE Seeding Complete!');
  process.exit(0);
}

seedFinalRawData();
