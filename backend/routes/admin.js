const express = require('express');
const router = express.Router();
const { addUser, addBus, addRoute } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Apply middleware to all routes in this file
router.use(verifyToken);
// Assuming admin routes are only accessible by transport in-charge or admin
router.use(checkRole(['admin']));

router.post('/user', addUser);
router.post('/bus', addBus);
router.post('/route', addRoute);

module.exports = router;
