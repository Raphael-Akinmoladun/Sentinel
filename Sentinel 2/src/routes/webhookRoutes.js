const express = require('express');
const router = express.Router();
const { handleSquadWebhook } = require('../controllers/webhookController');

router.post('/squad', handleSquadWebhook);

module.exports = router;
