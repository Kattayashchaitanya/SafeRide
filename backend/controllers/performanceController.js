const { db } = require('../config/firebase');

const getDriverPerformance = async (req, res) => {
  try {
    const { driverId } = req.params;
    const doc = await db.collection('driverPerformance').doc(driverId).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Performance record not found' });
    }
    
    res.json(doc.data());
  } catch (error) {
    console.error('Error fetching performance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPerformances = async (req, res) => {
  try {
    const snapshot = await db.collection('driverPerformance').get();
    const performances = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(performances);
  } catch (error) {
    console.error('Error fetching all performances:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const reportBreakdown = async (req, res) => {
  try {
    const { driverId, busNumber, details } = req.body;
    
    // Log the breakdown
    await db.collection('breakdowns').add({
      driverId,
      busNumber,
      details,
      status: 'active',
      reportedAt: new Date().toISOString()
    });

    // Optionally update bus status if we have a buses collection mapping
    const busQuery = await db.collection('buses').where('busNumber', '==', busNumber).get();
    if (!busQuery.empty) {
      const busDoc = busQuery.docs[0];
      await db.collection('buses').doc(busDoc.id).update({ status: 'breakdown' });
    }

    res.status(200).json({ message: 'Breakdown reported successfully' });
  } catch (error) {
    console.error('Error reporting breakdown:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getDriverPerformance, getAllPerformances, reportBreakdown };
