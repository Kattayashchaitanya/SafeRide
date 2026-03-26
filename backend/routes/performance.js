const express = require('express');
const router = express.Router();
const { getDriverPerformance, getAllPerformances, reportBreakdown } = require('../controllers/performanceController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/:driverId', verifyToken, checkRole(['driver', 'admin', 'transport_in_charge']), getDriverPerformance);
router.get('/', verifyToken, checkRole(['admin', 'transport_in_charge']), getAllPerformances);

router.post('/breakdown', verifyToken, checkRole(['driver']), reportBreakdown);

module.exports = router;
