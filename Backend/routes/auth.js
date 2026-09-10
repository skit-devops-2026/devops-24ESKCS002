// routes/auth.js
// No sessions. Login just checks credentials and returns user data.
// Frontend saves the user object in localStorage.

const express  = require('express');
const router   = express.Router();
const User     = require('../models/User');
const StudentProfile   = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

// ── REGISTER ─────────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const user = await User.create({ name, email, password, role });

    if (role === 'student') {
      if (!rollNumber) return res.status(400).json({ message: 'University roll number is required.' });
      const rollExists = await StudentProfile.findOne({ rollNumber: rollNumber.toUpperCase() });
      if (rollExists) return res.status(409).json({ message: 'Roll number already registered.' });
      await StudentProfile.create({ user: user._id, rollNumber, branch: 'CSE' });
    }

    if (role === 'recruiter') {
      if (!companyName) return res.status(400).json({ message: 'Company name is required.' });
      await RecruiterProfile.create({ user: user._id, companyName });
    }

    // Return user data — frontend saves it to localStorage
    res.status(201).json({
      message: 'Registration successful!',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

// ── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
// Just checks email + password. Returns user if match found.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Send back user info — frontend stores it and sends userId with future requests
    res.json({
      message: 'Login successful!',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
