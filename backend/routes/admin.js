const express = require('express');
const router = express.Router();
const { addUser, addBus, addRoute, getStats, addAnnouncement, getAnnouncements, getBuses } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);

// Publicly accessible for all authenticated users
router.get('/stats', getStats);
router.get('/announcements', getAnnouncements);
router.get('/buses', getBuses);

// Announcements (Posting)
router.post('/announcement', checkRole(['admin', 'transport_in_charge']), addAnnouncement);

// Management routes restricted to super-admin
router.post('/user', checkRole(['admin']), addUser);
router.post('/bus', checkRole(['admin']), addBus);
router.post('/route', checkRole(['admin']), addRoute);

module.exports = router;
