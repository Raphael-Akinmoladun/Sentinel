const Shipment = require('../models/shipment');
const User = require('../models/User');

/**
 * Get basic shipment details for the Smart Escrow funding page
 * (Public route so users can see what they are funding before login/payment)
 */
exports.getPublicShipmentDetails = async (req, res) => {
    try {
        const id = req.params.id;
        
        // 1. Try finding a Shipment first
        let shipment = await Shipment.findById(id).populate('supplierId', 'businessName');

        if (shipment) {
            return res.status(200).json({
                success: true,
                type: 'shipment',
                data: {
                    productName: shipment.productName,
                    amount: shipment.amount,
                    supplierName: shipment.supplierId.businessName,
                    virtualAccount: {
                        account_name: shipment.supplierId.businessName,
                        account_number: shipment.supplierAccountNumber,
                        bank_name: shipment.supplierBankName
                    }
                }
            });
        }

        // 2. If not a shipment, try finding a User (Supplier)
        const supplier = await User.findById(id);
        if (supplier && supplier.role === 'supplier') {
            return res.status(200).json({
                success: true,
                type: 'supplier',
                data: {
                    productName: 'Custom Payment',
                    amount: 0,
                    supplierName: supplier.businessName,
                    virtualAccount: {
                        account_name: supplier.businessName,
                        account_number: supplier.supplierAccountNumber || '0000000000',
                        bank_name: supplier.supplierBankName || 'Sentinel Bank'
                    }
                }
            });
        }

        return res.status(404).json({ message: 'No shipment or supplier found with this ID' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching details', error: error.message });
    }
};



/**
 * Create a new shipment (Buyer only)
 */
exports.createShipment = async (req, res) => {
    try {
        const { 
            supplierId, 
            productName, 
            amount, 
            supplierBankName, 
            supplierBankCode, 
            supplierAccountNumber 
        } = req.body;

        // 1. Verify supplier exists
        const supplier = await User.findById(supplierId);
        if (!supplier || supplier.role !== 'supplier') {
            return res.status(400).json({ message: 'Invalid supplier ID' });
        }

        // 2. Create the shipment
        const shipment = new Shipment({
            buyerId: req.user.id, // From authMiddleware
            supplierId,
            productName,
            amount,
            supplierBankName,
            supplierBankCode,
            supplierAccountNumber,
            status: 'PENDING_PAYMENT'
        });

        await shipment.save();

        res.status(201).json({
            message: 'Shipment created successfully',
            shipment
        });

    } catch (error) {
        console.error('Create Shipment Error:', error.message);
        res.status(500).json({ message: 'Failed to create shipment', error: error.message });
    }
};

/**
 * Get all shipments for the logged-in user
 */
exports.getMyShipments = async (req, res) => {
    try {
        const query = req.user.role === 'buyer' 
            ? { buyerId: req.user.id } 
            : { supplierId: req.user.id };

        const shipments = await Shipment.find(query)
            .populate('buyerId', 'businessName email')
            .populate('supplierId', 'businessName email')
            .sort({ createdAt: -1 });

        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch shipments', error: error.message });
    }
};

/**
 * Get a single shipment by ID
 */
exports.getShipmentById = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id)
            .populate('buyerId', 'businessName email')
            .populate('supplierId', 'businessName email');

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });

        // Security: Only the buyer or supplier of this shipment can see it
        if (shipment.buyerId._id.toString() !== req.user.id && shipment.supplierId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to this shipment' });
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch shipment', error: error.message });
    }
};

/**
 * Retry a failed payout (Admin or Buyer only)
 */
exports.retryPayout = async (req, res) => {
    try {
        const { id } = req.params;
        const shipment = await Shipment.findById(id).populate('supplierId');

        if (!shipment) return res.status(404).json({ message: 'Shipment not found' });
        
        if (shipment.status !== 'VERIFIED') {
            return res.status(400).json({ message: 'Payout can only be retried for VERIFIED shipments that haven\'t been RELEASED yet.' });
        }

        const squadService = require('../services/squadService');
        
        await squadService.releasePayout({
            amount: shipment.amount,
            bank_code: shipment.supplierBankCode,
            account_number: shipment.supplierAccountNumber,
            account_name: shipment.supplierId.businessName,
            transaction_reference: `PAYOUT-RETRY-${shipment._id}-${Date.now()}`
        });

        shipment.status = 'RELEASED';
        await shipment.save();

        res.status(200).json({ message: 'Payout retried and released successfully', shipment });

    } catch (error) {
        console.error('Retry Payout Error:', error.message);
        res.status(500).json({ message: 'Failed to retry payout', error: error.message });
    }
};
