const { db } = require('../config/firebase');

const submitComplaint = async (req, res) => {
  try {
    const { busNumber, driverName, complaintType, description, date } = req.body;
    
    const complaintData = {
      busNumber,
      driverName,
      complaintType,
      description,
      date,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('complaints').add(complaintData);
    
    // Update driver performance if driverName is provided
    // In a real app, we would link driverName to a driverId
    const driverSnapshot = await db.collection('users').where('name', '==', driverName).where('role', '==', 'driver').get();
    
    if (!driverSnapshot.empty) {
      const driverId = driverSnapshot.docs[0].id;
      const perfRef = db.collection('driverPerformance').doc(driverId);
      const perfDoc = await perfRef.get();
      
      if (perfDoc.exists) {
        const currentData = perfDoc.data();
        await perfRef.update({
          complaintsCount: currentData.complaintsCount + 1,
          score: Math.max(0, currentData.score - 10)
        });
      } else {
        await perfRef.set({
          driverId,
          complaintsCount: 1,
          score: 90
        });
      }
    }

    res.status(201).json({ id: docRef.id, message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getComplaints = async (req, res) => {
  try {
    const snapshot = await db.collection('complaints').orderBy('createdAt', 'desc').get();
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { submitComplaint, getComplaints };
