const admin = require('firebase-admin');
const { auth } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

const checkRole = (roles) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // In a real app, you'd fetch the role from Firestore if it's not in custom claims
    // For simplicity, we'll assume it's passed or fetched here
    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists || !roles.includes(userDoc.data().role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    req.userData = userDoc.data();
    next();
  };
};

module.exports = { verifyToken, checkRole };
