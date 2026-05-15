const axios = require('axios');

const SQUAD_BASE_URL = 'https://sandbox-api-d.squadco.com'; // NOTE the '-d'
const SQUAD_SECRET_KEY = process.env.SQUAD_SECRET_KEY; 

const squadHeaders = {
    'Authorization': `Bearer ${SQUAD_SECRET_KEY}`,
    'Content-Type': 'application/json'
};


/**
 * Initiates an escrow payment
 * @param {number} amount - Amount in Naira
 * @param {string} email - Buyer's email
 * @param {string} shipmentId - Reference ID
 * @param {string} callbackUrl - Optional redirect URL after payment
 */
exports.initiatePayment = async (amount, email, shipmentId, callbackUrl = 'https://www.linkedin.com/') => {
    try {
        const payload = {
            amount: amount * 100, // Convert to kobo
            email: email,
            currency: "NGN",
            initiate_type: "inline",
            transaction_ref: `SENTINEL-${shipmentId}-${Date.now()}`,
            callback_url: callbackUrl
        };

        const response = await axios.post(`${SQUAD_BASE_URL}/transaction/initiate`, payload, { headers: squadHeaders });
        return response.data.data;
    } catch (error) {

        console.error('Squad Initiate Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to initiate payment');
    }
};


/**
 * Verifies a transaction
 * @param {string} transactionRef - Transaction reference
 */
exports.verifyPayment = async (transactionRef) => {
    try {
        const response = await axios.get(`${SQUAD_BASE_URL}/transaction/verify/${transactionRef}`, { headers: squadHeaders });
        return response.data.data;
    } catch (error) {
        console.error('Squad Verify Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to verify payment');
    }
};

/**
 * Transfers funds to a supplier (Payout)
 * @param {object} details - { amount, bank_code, account_number, account_name, transaction_reference }
 */
exports.releasePayout = async (details) => {
    try {
        const payload = {
            amount: details.amount * 100, // Convert to kobo
            bank_code: details.bank_code,
            account_number: details.account_number,
            account_name: details.account_name,
            transaction_reference: details.transaction_reference,
            currency_id: 'NGN',
            remark: 'Sentinel Escrow Payout'
        };

        const response = await axios.post(`${SQUAD_BASE_URL}/payout/transfer`, payload, { headers: squadHeaders });
        return response.data.data;
    } catch (error) {
        console.error('Squad Payout Error:', error.response ? error.response.data : error.message);
        throw new Error(error.response?.data?.message || 'Failed to release payout');
    }
};
