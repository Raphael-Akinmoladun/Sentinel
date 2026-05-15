const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Public routes (No JWT required to access these)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', requireAuth, getProfile);

module.exports = router;