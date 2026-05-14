require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Initialize App
const app = express();
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

const authRoutes = require('./src/routes/authRoutes');
const shipmentRoutes = require('./src/routes/shipmentRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/webhooks', webhookRoutes);

// Test Route
app.get('/', (req, res) => res.send('Sentinel Node API Active'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));