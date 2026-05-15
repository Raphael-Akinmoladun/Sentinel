const Shipment = require('../models/shipment');
const squadService = require('../services/squadService');

exports.initiateEscrowPayment = async (req, res) => {
    try {
        const { shipmentId, callbackUrl, amount, email } = req.body;
        
        // 1. Find the shipment in the database
        let shipment = await Shipment.findById(shipmentId);
        
        // --- DEMO LOGIC: If it's a Supplier ID instead of a Shipment ID, create a shipment on the fly ---
        if (!shipment) {
            const User = require('../models/User');
            const supplier = await User.findById(shipmentId);
            if (supplier && supplier.role === 'supplier') {
                shipment = new Shipment({
                    buyerId: req.user.id,
                    supplierId: supplier._id,
                    productName: 'Custom Escrow Payment',
                    amount: amount || 0,
                    supplierBankName: supplier.supplierBankName || 'Sentinel Bank',
                    supplierBankCode: supplier.supplierBankCode || '000',
                    supplierAccountNumber: supplier.supplierAccountNumber || '0000000000',
                    status: 'PENDING_PAYMENT'
                });
                await shipment.save();
            }
        }

        if (!shipment) return res.status(404).json({ message: 'Shipment or Supplier not found' });

        // 2. Security Check: Is the person making this request the actual buyer of this shipment?
        if (shipment.buyerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized: Only the assigned buyer can fund this escrow.' });
        }

        // 3. Initiate payment via Squad Service
        const squadData = await squadService.initiatePayment(amount || shipment.amount, email || req.user.email, shipment._id, callbackUrl);



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