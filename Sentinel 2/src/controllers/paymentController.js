const Shipment = require('../models/shipment');
const squadService = require('../services/squadService');

exports.initiateEscrowPayment = async (req, res) => {
    try {
        const { shipmentId } = req.body;
        
        // 1. Find the shipment in the database
        const shipment = await Shipment.findById(shipmentId);
        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        // 2. Security Check: Is the person making this request the actual buyer of this shipment?
        if (shipment.buyerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: Only the assigned buyer can fund this escrow.' });
        }

        // 3. Initiate payment via Squad Service
        const squadData = await squadService.initiatePayment(shipment.amount, req.user.email, shipment._id);

        // 4. Send the checkout URL back to the React frontend
        res.status(200).json({
            message: 'Payment initiated successfully',
            checkoutUrl: squadData.checkout_url,
            transactionRef: squadData.transaction_ref
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to initiate Squad payment', error: error.message });
    }
};