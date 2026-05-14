const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productName: { type: String, required: true },
    amount: { type: Number, required: true },
    supplierBankName: { type: String, required: true },
    supplierBankCode: { type: String, required: true },
    supplierAccountNumber: { type: String, required: true },
    status: { type: String, default: 'PENDING_PAYMENT', enum: ['PENDING_PAYMENT', 'FUNDED', 'VERIFIED', 'RELEASED', 'REJECTED'] },
    aiScore: { type: Number, default: 0.0 }
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);