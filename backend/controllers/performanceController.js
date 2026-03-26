const { db } = require('../config/firebase');

const getDriverPerformance = async (req, res) => {
  try {
    const { driverId } = req.params;
    const doc = await db.collection('users').doc(driverId).get();
    
    if (!doc.exists || doc.data().role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }
    
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPerformances = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'driver').get();
    const performances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(performances);
  } catch (error) {
    console.error('Error fetching all performances:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deductPoints = async (req, res) => {
  try {
    const { driverId, pointsToDeduct, reason } = req.body;
    const driverRef = db.collection('users').doc(driverId);
    
    await db.runTransaction(async (t) => {
      const doc = await t.get(driverRef);
      if (!doc.exists) throw new Error('Driver not found');
      
      const currentPoints = doc.data().points !== undefined ? doc.data().points : 100;
      t.update(driverRef, { points: Math.max(0, currentPoints - pointsToDeduct) });
      
      const penaltyRef = db.collection('penalties').doc();
      t.set(penaltyRef, {
        driverId,
        pointsDeducted: pointsToDeduct,
        reason,
        createdAt: new Date().toISOString()
      });
    });

    res.status(200).json({ message: 'Points deducted successfully' });
  } catch (error) {
    console.error('Error deducting points:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getInsights = async (req, res) => {
  try {
    // 1. Delays / Inefficient Routes
    const arrivalsSnap = await db.collection('arrivals').where('status', '==', 'delayed').get();
    let totalDelayMinutes = 0;
    const delayedRoutesMap = {};
    
    arrivalsSnap.forEach(doc => {
      const data = doc.data();
      totalDelayMinutes += data.delayMinutes || 0;
      delayedRoutesMap[data.busNumber] = (delayedRoutesMap[data.busNumber] || 0) + 1;
    });

    // 2. Overcrowded buses
    const complaintsSnap = await db.collection('complaints').where('complaintType', '==', 'overcrowding').get();
    const overcrowdedBusMap = {};
    complaintsSnap.forEach(doc => {
      const data = doc.data();
      overcrowdedBusMap[data.busNumber] = (overcrowdedBusMap[data.busNumber] || 0) + 1;
    });

    res.status(200).json({
      totalDelays: arrivalsSnap.size,
      totalDelayMinutes,
      problematicBuses: delayedRoutesMap,
      overcrowdedBuses: overcrowdedBusMap
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDriverPerformance, getAllPerformances, deductPoints, getInsights };
