const Appointment = require('../models/appointment');

//  Book a new appointment and calculate queue
const bookAppointment = async (req, res) => {
    try {
        const { patientName, doctorId, priority } = req.body;

        // 1. Find current queue length for this specific doctor
        const currentQueueLength = await Appointment.countDocuments({ 
            doctorId: doctorId, 
            status: 'Waiting' 
        });

        // 2. Simple Math for Mid-Sem (15 mins per patient)
        // If it's an Emergency, we will handle priority sorting later!
        const estimatedWait = currentQueueLength * 15; 

        // 3. Create the appointment object
        const newAppointment = new Appointment({
            patientName,
            doctorId,
            priority: priority || 'Normal',
            queuePosition: currentQueueLength + 1,
            estimatedWaitTime: estimatedWait
        });

        // 4. Save to Database
        await newAppointment.save();

        // 5. Send Success Response
        res.status(201).json({
            success: true,
            message: "Appointment Booked Successfully",
            data: newAppointment
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get the live queue for the Doctor's Dashboard
const getLiveQueue = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const queue = await Appointment.find({ doctorId: doctorId, status: 'Waiting' })
                                       .sort({ createdAt: 1 }); // Oldest first
        
        res.status(200).json({ success: true, count: queue.length, data: queue });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not fetch queue" });
    }
};

module.exports = {
    bookAppointment,
    getLiveQueue
};