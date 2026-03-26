const { db } = require('../config/firebase');

const submitComplaint = async (req, res) => {
  try {
    const { busNumber, complaintType, description, date } = req.body;
    
    const complaintData = {
      busNumber,
      complaintType,
      description,
      date,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('complaints').add(complaintData);
    
    res.status(201).json({ id: docRef.id, message: 'Complaint submitted securely' });
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

const resolveComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, resolutionNotes } = req.body;
    await db.collection('complaints').doc(complaintId).update({
      status,
      resolutionNotes: resolutionNotes || '',
      resolvedAt: new Date().toISOString()
    });
    res.json({ message: 'Complaint updated' });
  } catch (error) {
    console.error('Error resolving complaint:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { submitComplaint, getComplaints, resolveComplaint };
