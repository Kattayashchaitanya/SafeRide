const { db } = require('./config/firebase');

async function seedDetailedData() {
  console.log('🌱 Seeding Dynamic Driver Performance Data...');

  // Fetch all drivers
  const driversSnap = await db.collection('users').where('role', '==', 'driver').get();
  const drivers = driversSnap.docs.map(d => ({ id: d.id, ...d.data() }));

  if (drivers.length === 0) {
    console.log('❌ No drivers found in database. Please add drivers first.');
    process.exit(1);
  }

  for (const driver of drivers) {
    const busNumber = driver.assignedBus || 'TRIAL-BUS';
    console.log(`Processing data for ${driver.name} (Bus: ${busNumber})...`);

    // 1. Recent Arrivals
    const arrivals = [
      { busNumber, timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), status: 'on-time', delayMinutes: 0 },
      { busNumber, timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), status: 'delayed', delayMinutes: 15 },
      { busNumber, timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), status: 'on-time', delayMinutes: 0 }
    ];
    for (const arrival of arrivals) {
      await db.collection('arrivals').add(arrival);
    }

    // 2. Student Complaints
    const complaints = [
      { 
        studentName: 'Test Student', 
        busNumber, 
        complaintType: 'rash_driving', 
        description: `Observation for ${driver.name}: Driving speed was slightly high near junctions.`,
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      }
    ];
    for (const complaint of complaints) {
      await db.collection('complaints').add(complaint);
    }

    // 3. Penalties
    await db.collection('penalties').add({
      driverId: driver.id,
      pointsDeducted: 5,
      reason: 'Standard safety audit adjustment',
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
    });
  }

  console.log('✨ Dynamic seeding complete for all drivers!');
  process.exit(0);
}

seedDetailedData();
