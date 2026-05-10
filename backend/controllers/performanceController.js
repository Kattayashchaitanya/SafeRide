const { db } = require('../config/firebase');

const getDriverPerformance = async (req, res) => {
  try {
    const { driverId } = req.params;
    const doc = await db.collection('users').doc(driverId).get();
    
    if (!doc.exists || doc.data().role !== 'driver') {
      return res.status(404).json({ message: 'Driver not found' });
    }

    const driverData = doc.data();
    const busNumber = (driverData.assignedBus || '').trim();

    // Fetch penalties
    const penaltiesSnap = await db.collection('penalties')
      .where('driverId', '==', driverId)
      .get();
    
    const penalties = penaltiesSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Fetch recent arrivals
    const arrivalsSnap = await db.collection('arrivals')
      .where('busNumber', '==', busNumber)
      .get();
    
    const arrivals = arrivalsSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    // Fetch complaints related to this bus
    const complaintsSnap = await db.collection('complaints')
      .where('busNumber', '==', busNumber)
      .get();
    
    const complaints = complaintsSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ 
      id: doc.id, 
      ...driverData,
      history: {
        penalties,
        arrivals,
        complaints
      }
    });
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
    const arrivalsSnap = await db.collection('arrivals').get();
    let totalDelayMinutes = 0;
    const delayedRoutesMap = {};
    const delaysByDay = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    arrivalsSnap.forEach(doc => {
      const data = doc.data();
      if (data.status === 'delayed') {
        totalDelayMinutes += data.delayMinutes || 0;
        delayedRoutesMap[data.busNumber] = (delayedRoutesMap[data.busNumber] || 0) + 1;
      }
      
      // Aggregate delays by day for the chart (last 7 days)
      const timestamp = data.timestamp ? new Date(data.timestamp) : null;
      if (timestamp) {
        const dayName = dayNames[timestamp.getDay()];
        delaysByDay[dayName] += data.delayMinutes || 0;
      }
    });

    // 2. Overcrowded buses
    const complaintsSnap = await db.collection('complaints').where('complaintType', '==', 'overcrowding').get();
    const overcrowdedBusMap = {};
    complaintsSnap.forEach(doc => {
      const data = doc.data();
      overcrowdedBusMap[data.busNumber] = (overcrowdedBusMap[data.busNumber] || 0) + 1;
    });

    res.status(200).json({
      totalDelays: arrivalsSnap.docs.filter(d => d.data().status === 'delayed').length,
      totalDelayMinutes,
      problematicBuses: delayedRoutesMap,
      overcrowdedBuses: overcrowdedBusMap,
      delaysByDay
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDriverPerformance, getAllPerformances, deductPoints, getInsights };
