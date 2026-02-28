// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/db');
require('dotenv').config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import Routes
const appointmentRoutes = require('./routes/appointmentRoutes');
const authRoutes = require('./routes/authRoutes');

// Mount Routes
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

// Base Test Route
app.get('/', (req, res) => {
    res.send('Kairos Queue Engine API is actively running! 🚀');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});