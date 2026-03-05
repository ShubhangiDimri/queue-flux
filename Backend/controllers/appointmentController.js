const Appointment = require('../models/appointment');

// Book a new appointment (patient only)
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const patientId = req.user.userId;

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date,
            status: 'Waiting'
        });

        await newAppointment.save();

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: newAppointment
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get waiting queue for a doctor (FIFO)
const getQueue = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const queue = await Appointment.find({ 
            doctorId, 
            status: 'Waiting' 
        }).sort({ createdAt: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: queue.length, 
            data: queue 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not fetch queue" });
    }
};

// Complete an appointment (doctor only)
const completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status: 'Completed' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ 
                success: false, 
                message: "Appointment not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Appointment completed",
            data: appointment
        });

    } catch (error) {
        console.error("Complete Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = {
    bookAppointment,
    getQueue,
    completeAppointment
};