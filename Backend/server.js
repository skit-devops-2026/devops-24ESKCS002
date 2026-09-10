// server.js — PlacementHub entry point
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const authRoutes        = require('./routes/auth');
const studentRoutes     = require('./routes/student');
const recruiterRoutes   = require('./routes/recruiter');
const instituteRoutes   = require('./routes/institute');
const opportunityRoutes = require('./routes/opportunity');

const app = express();

// ── DATABASE ──────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',   // Vite dev server
  credentials: true                  // allow cookies/session
}));
app.use(express.json());



// ── ROUTES ────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/student',     studentRoutes);
app.use('/api/recruiter',   recruiterRoutes);
app.use('/api/institute',   instituteRoutes);
app.use('/api/opportunity', opportunityRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ── START ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
