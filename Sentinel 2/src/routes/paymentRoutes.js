const express = require('express');
const router = express.Router();
const { initiateEscrowPayment } = require('../controllers/paymentController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// SECURED ROUTE:
// Only an authenticated user with the 'buyer' role can initiate an escrow funding
router.post('/initiate', requireAuth, requireRole('buyer'), initiateEscrowPayment);

module.exports = router;