const { db, auth } = require('../config/firebase');

const addUser = async (req, res) => {
  try {
    const { name, email, role, assignedBus, password } = req.body;
    
    // In a production app, we would create the user in Firebase Auth
    // and store their metadata in Firestore. Here we just store metadata assuming
    // auth creation is handled elsewhere or default password is set.
    const userData = {
      name,
      email,
      role,
      assignedBus: assignedBus || null,
      createdAt: new Date().toISOString()
    };

    if (role === 'driver') {
      userData.points = 100; // Start with 100 safety points
      userData.isBackup = req.body.isBackup || false;
      userData.backupContact = req.body.backupContact || null;
    }

    // If you want to create the user in Firebase Auth directly:
    const userRecord = await auth.createUser({
      email,
      password: password || 'defaultPassword123!',
      displayName: name
    });

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({ message: 'User added successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

const addBus = async (req, res) => {
  try {
    const { busNumber, capacity } = req.body;
    
    await db.collection('buses').add({
      busNumber,
      capacity: parseInt(capacity, 10),
      status: 'active',
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Bus added successfully' });
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addRoute = async (req, res) => {
  try {
    const routeData = req.body; // e.g. { source, destination, stops }
    
    await db.collection('routes').add({
      ...routeData,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ message: 'Route added successfully' });
  } catch (error) {
    console.error('Error adding route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const [complaintsSnap, busesSnap, usersSnap] = await Promise.all([
      db.collection('complaints').get(),
      db.collection('buses').get(),
      db.collection('users').get()
    ]);

    res.json({
      totalComplaints: complaintsSnap.size,
      activeBuses: busesSnap.size,
      totalUsers: usersSnap.size,
      totalDrivers: usersSnap.docs.filter(d => d.data().role === 'driver').length
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addAnnouncement = async (req, res) => {
  try {
    const { text, importance } = req.body;
    await db.collection('announcements').add({
      text,
      importance: importance || 'normal',
      date: new Date().toISOString(),
      active: true
    });
    res.status(201).json({ message: 'Announcement posted' });
  } catch (error) {
    console.error('Error adding announcement:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const snap = await db.collection('announcements')
      .limit(10)
      .get();
    
    const announcements = [];
    snap.forEach(doc => announcements.push({ id: doc.id, ...doc.data() }));
    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getBuses = async (req, res) => {
  try {
    const snap = await db.collection('buses').get();
    const buses = [];
    snap.forEach(doc => buses.push({ id: doc.id, ...doc.data() }));
    res.json(buses);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addUser, addBus, addRoute, getStats, addAnnouncement, getAnnouncements, getBuses };
