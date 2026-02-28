// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { bookAppointment, getLiveQueue } = require('../controllers/appointmentController');

// Define routes and attach controller functions
router.post('/book', bookAppointment);
router.get('/queue/:doctorId', getLiveQueue);

module.exports = router;