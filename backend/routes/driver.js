const express = require('express');
const router = express.Router();
const { logArrival, reportBreakdown, getNearbyBuses, getActiveAlerts, assistAlert, getArrivals } = require('../controllers/driverController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.use(verifyToken);

// Publicly accessible arrivals (for students)
router.get('/arrivals', getArrivals);

// Ensure only authenticated drivers (and admins) can log arrivals and breakdowns
router.use(checkRole(['driver', 'transport_in_charge', 'admin']));

router.post('/log-arrival', logArrival);
router.post('/breakdown', reportBreakdown);
router.get('/nearby', getNearbyBuses);
router.get('/alerts', getActiveAlerts);
router.post('/alerts/assist', assistAlert);

module.exports = router;
