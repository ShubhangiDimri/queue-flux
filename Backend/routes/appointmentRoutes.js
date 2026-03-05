const express = require('express');
const router = express.Router();
const { bookAppointment, getQueue, completeAppointment } = require('../controllers/appointmentController');
const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// POST /api/appointments/book - Only patients can book
router.post('/book', protect, authorizeRole('patient'), bookAppointment);

// GET /api/appointments/queue/:doctorId - Get waiting queue (FIFO)
router.get('/queue/:doctorId', getQueue);

// PUT /api/appointments/complete/:id - Only doctors can complete
router.put('/complete/:id', protect, authorizeRole('doctor'), completeAppointment);

module.exports = router;