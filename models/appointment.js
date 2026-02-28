const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorId: { type: String, required: true },
  
  // Queue Management
  status: { 
    type: String, 
    enum: ['Waiting', 'In-Progress', 'Completed', 'No-Show'], 
    default: 'Waiting' 
  },
  priority: { 
    type: String, 
    enum: ['Normal', 'Emergency'], 
    default: 'Normal' 
  },
  
  // Real-Time Queue Data
  queuePosition: { type: Number, default: 0 },
  estimatedWaitTime: { type: Number, default: 0 }, // In minutes
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);