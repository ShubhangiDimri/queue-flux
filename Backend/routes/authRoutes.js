// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, createUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes — no auth middleware needed
router.post('/register', register);   // POST /api/auth/register
router.post('/login', login);         // POST /api/auth/login

// Admin-only route — requires login + admin role
router.post('/create-user', protect, createUser);   // POST /api/auth/create-user

module.exports = router;
