const { db } = require('./config/firebase');

async function seedRahul() {
  const rahulId = 'JlIRuzwRz6YwIyF4Y10hgW9s3si1';
  const bus = 'B-101';
  
  console.log(`🎯 Seeding FINAL data for Rahul Sharma (Bus ${bus})...`);

  // 1. Clear existing arrivals for this bus (optional but good for clean demo)
  // 2. Add Arrivals
  const arrivalEntries = [
    { busNumber: bus, status: 'on-time', timestamp: new Date(Date.now() - 3600000).toISOString(), delayMinutes: 0 },
    { busNumber: bus, status: 'delayed', timestamp: new Date(Date.now() - 7200000).toISOString(), delayMinutes: 12 },
    { busNumber: bus, status: 'on-time', timestamp: new Date(Date.now() - 86400000).toISOString(), delayMinutes: 0 },
    { busNumber: bus, status: 'on-time', timestamp: new Date(Date.now() - 90000000).toISOString(), delayMinutes: 0 },
    { busNumber: bus, status: 'delayed', timestamp: new Date(Date.now() - 172800000).toISOString(), delayMinutes: 8 }
  ];

  for (const entry of arrivalEntries) {
    await db.collection('arrivals').add(entry);
  }

  // 3. Add Complaints
  const complaintEntries = [
    {
      busNumber: bus,
      studentName: 'Yash C.',
      complaintType: 'rash_driving',
      description: 'The driver was driving too fast at the sharp turn near the college entrance.',
      status: 'pending',
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      busNumber: bus,
      studentName: 'Mohit A.',
      complaintType: 'overcrowding',
      description: 'Bus B-101 is always full by the 3rd stop. We need a bigger bus.',
      status: 'resolved',
      createdAt: new Date(Date.now() - 90000000).toISOString()
    }
  ];

  for (const entry of complaintEntries) {
    await db.collection('complaints').add(entry);
  }

  // 4. Add Penalties
  const penaltyEntries = [
    {
      driverId: rahulId,
      pointsDeducted: 5,
      reason: 'Safety Violation: Rash driving reported by student Yash C.',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  for (const entry of penaltyEntries) {
    await db.collection('penalties').add(entry);
  }

  console.log('✅ Final data seeded for Rahul Sharma!');
  process.exit(0);
}

seedRahul();
