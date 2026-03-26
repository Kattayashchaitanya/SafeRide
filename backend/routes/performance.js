const express = require('express');
const router = express.Router();
const { getDriverPerformance, getAllPerformances, deductPoints, getInsights } = require('../controllers/performanceController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/insights', verifyToken, checkRole(['transport_in_charge', 'admin']), getInsights);
router.post('/deduct', verifyToken, checkRole(['transport_in_charge', 'admin']), deductPoints);
router.get('/:driverId', verifyToken, checkRole(['driver', 'admin', 'transport_in_charge']), getDriverPerformance);
router.get('/', verifyToken, checkRole(['admin', 'transport_in_charge']), getAllPerformances);

module.exports = router;
