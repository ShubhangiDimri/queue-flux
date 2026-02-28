const mongoose = require('mongoose');

// ---- User Schema for Authentication ----
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,           // No duplicate emails allowed
        lowercase: true,        // Store emails in lowercase
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6            // Minimum 6 characters
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],   // Only these 3 roles allowed
        default: 'patient'                       // New users are patients by default
    }
}, {
    timestamps: true    // Adds createdAt & updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
