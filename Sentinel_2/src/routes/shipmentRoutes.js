const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const { verifyProductImage } = require('../controllers/verificationController');
const { 
    createShipment, 
    getMyShipments, 
    getShipmentById, 
    retryPayout,
    getPublicShipmentDetails
} = require('../controllers/shipmentController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');

// Public route for Smart Escrow page
router.get('/details/:id', getPublicShipmentDetails);


// 1. Create a shipment (Buyer only)
router.post('/', requireAuth, requireRole('buyer'), createShipment);

// 2. Get all shipments for the logged-in user
router.get('/', requireAuth, getMyShipments);

// 3. Get a specific shipment
router.get('/:id', requireAuth, getShipmentById);

// 4. Retry Payout (Buyer only, if verified but failed)
router.post('/:id/retry-payout', requireAuth, requireRole('buyer'), retryPayout);

// 5. Verify product image (Supplier only)
router.post(
    '/:id/verify', 
    requireAuth, 
    requireRole('supplier'), 
    upload.single('productImage'), 
    verifyProductImage
);

module.exports = router;