const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// =============================================
//  POST /api/auth/register  —  Register a new patient
// =============================================
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Only "patient" role is allowed for public registration
        //    (Doctors & admins will be created by an admin later)
        if (role && role !== 'patient') {
            return res.status(403).json({
                success: false,
                message: 'Public registration is only allowed for patients'
            });
        }

        // 2. Check if a user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // 3. Hash the password before saving (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and save the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient'       // Always patient for public signup
        });

        // 5. Send success response (never return the password!)
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// =============================================
//  POST /api/auth/login  —  Login & get JWT token
// =============================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 2. Compare the entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 3. Generate a JWT token (valid for 2 hours)
        const token = jwt.sign(
            { userId: user._id, role: user.role },  // Payload
            process.env.JWT_SECRET,                  // Secret key from .env
            { expiresIn: '2h' }                      // Token expiry
        );

        // 4. Send token back to the client
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// =============================================
//  POST /api/auth/create-user  —  Admin creates a doctor/admin
// =============================================
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Only admins can hit this route (middleware checks token,
        //    but we double-check the role here for safety)
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admins can create users'
            });
        }

        // 2. Validate that a valid role is provided
        if (!role || !['patient', 'doctor', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Valid role is required (patient, doctor, admin)'
            });
        }

        // 3. Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create user with the specified role
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // 6. Send success response
        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Create User Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { register, login, createUser };
