const express = require('express');
const router = express.Router();
const { submitComplaint, getComplaints } = require('../controllers/complaintsController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Students can submit complaints anonymously (or with token)
router.post('/', submitComplaint);

// Only Transport In-Charge and Admin can view all complaints
router.get('/', verifyToken, checkRole(['transport_in_charge', 'admin']), getComplaints);

module.exports = router;
