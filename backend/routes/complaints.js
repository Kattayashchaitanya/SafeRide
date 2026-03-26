const express = require('express');
const router = express.Router();
const { submitComplaint, getComplaints, resolveComplaint } = require('../controllers/complaintsController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Students can submit complaints anonymously (or with token)
router.post('/', submitComplaint);

// Only Transport In-Charge and Admin can view all complaints
router.get('/', verifyToken, checkRole(['transport_in_charge', 'admin']), getComplaints);
router.put('/:complaintId/resolve', verifyToken, checkRole(['transport_in_charge', 'admin']), resolveComplaint);

module.exports = router;
