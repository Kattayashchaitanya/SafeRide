const { db } = require('../config/firebase');

const logArrival = async (req, res) => {
  try {
    const { driverId, busNumber } = req.body;
    const now = new Date();

    // Setup the absolute delay threshold (09:10 AM)
    const delayThreshold = new Date();
    delayThreshold.setHours(9, 10, 0, 0);
    
    let delayMinutes = 0;
    if (now > delayThreshold) {
      // Only count time AFTER 9:10 AM
      delayMinutes = Math.floor((now - delayThreshold) / 60000);
    }
    
    // Status is 'delayed' if there are any minutes after 9:10 AM
    const isDelayed = delayMinutes > 0; 
    
    await db.collection('arrivals').add({
      driverId,
      busNumber,
      timestamp: now.toISOString(),
      expectedTime: '09:10', // Updated expected time to the cutoff
      delayMinutes,
      status: isDelayed ? 'delayed' : 'on-time'
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

const getActiveAlerts = async (req, res) => {
  try {
    const alertsSnap = await db.collection('alerts').get();
      
    const alerts = alertsSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(alert => alert.status === 'active' || alert.status === 'assisting')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({ alerts });
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const assistAlert = async (req, res) => {
  try {
    const { alertId, helperName } = req.body;
    await db.collection('alerts').doc(alertId).update({
      assistedBy: helperName,
      assistedAt: new Date().toISOString(),
      status: 'assisting'
    });
    res.status(200).json({ message: 'Assistance recorded' });
  } catch (error) {
    console.error('Error assisting alert:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getArrivals = async (req, res) => {
  try {
    const snap = await db.collection('arrivals')
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    
    const arrivals = [];
    snap.forEach(doc => arrivals.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(arrivals);
  } catch (error) {
    console.error('Error fetching arrivals:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { logArrival, reportBreakdown, getNearbyBuses, getActiveAlerts, assistAlert, getArrivals };
