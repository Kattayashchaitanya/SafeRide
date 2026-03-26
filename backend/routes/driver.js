const express = require('express');
const router = express.Router();
const { logArrival, reportBreakdown, getNearbyBuses } = require('../controllers/driverController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);
// Ensure only authenticated drivers (and admins) can log arrivals and breakdowns
router.use(checkRole(['driver', 'transport_in_charge', 'admin']));

router.post('/log-arrival', logArrival);
router.post('/breakdown', reportBreakdown);
router.get('/nearby', getNearbyBuses);

module.exports = router;
