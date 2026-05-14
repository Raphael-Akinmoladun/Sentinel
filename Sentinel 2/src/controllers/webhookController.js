const Shipment = require('../models/shipment');
const crypto = require('crypto');

exports.handleSquadWebhook = async (req, res) => {
    try {
        const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY;
        const hash = crypto.createHmac('sha512', SQUAD_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        // 1. Verify Signature
        if (hash !== req.headers['x-squad-signature']) {
            return res.status(401).json({ message: 'Invalid signature' });
        }

        const { event, data } = req.body;

        // 2. Handle Payment Success
        if (event === 'charge.success') {
            const transactionRef = data.transaction_ref;
            // transaction_ref was formatted as: SENTINEL-shipmentId-timestamp
            const shipmentId = transactionRef.split('-')[1];

            const shipment = await Shipment.findById(shipmentId);
            if (shipment && shipment.status === 'PENDING_PAYMENT') {
                shipment.status = 'FUNDED';
                await shipment.save();
                console.log(`Shipment ${shipmentId} funded successfully.`);
            }
        }

        // 3. Acknowledge Receipt
        res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
