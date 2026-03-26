const { db } = require('../config/firebase');

const logArrival = async (req, res) => {
  try {
    const { driverId, busNumber, expectedTime } = req.body;
    const now = new Date();
    
    let delayMinutes = 0;
    if (expectedTime) {
      const expected = new Date();
      const [hours, minutes] = expectedTime.split(':');
      expected.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      
      if (now > expected) {
        delayMinutes = Math.floor((now - expected) / 60000);
      }
    }
    
    await db.collection('arrivals').add({
      driverId,
      busNumber,
      timestamp: now.toISOString(),
      expectedTime: expectedTime || null,
      delayMinutes,
      status: delayMinutes > 5 ? 'delayed' : 'on-time'
    });

    res.status(201).json({ message: 'Arrival logged successfully', delayMinutes });
  } catch (error) {
    console.error('Error logging arrival:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const reportBreakdown = async (req, res) => {
  try {
    const { driverId, busNumber, location } = req.body;
    
    await db.collection('alerts').add({
      type: 'breakdown',
      driverId,
      busNumber,
      location: location || 'Unknown Route Location',
      status: 'active',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Breakdown alert broadcasted successfully' });
  } catch (error) {
    console.error('Error reporting breakdown:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getNearbyBuses = async (req, res) => {
  try {
    // In a system without GPS, we query backup drivers manually assigned by the admin
    const backupsSnapshot = await db.collection('users')
      .where('role', '==', 'driver')
      .where('isBackup', '==', true)
      .get();
      
    const backupDrivers = [];
    backupsSnapshot.forEach(doc => backupDrivers.push({ id: doc.id, ...doc.data() }));

    res.status(200).json({ backupDrivers });
  } catch (error) {
    console.error('Error fetching nearby resources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { logArrival, reportBreakdown, getNearbyBuses };
