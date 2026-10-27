// server.js — PlacementHub entry point
require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const client = require('prom-client');

const authRoutes        = require('./routes/auth');
const studentRoutes     = require('./routes/student');
const recruiterRoutes   = require('./routes/recruiter');
const instituteRoutes   = require('./routes/institute');
const opportunityRoutes = require('./routes/opportunity');

const app = express();
// Prometheus monitoring
const register = new client.Registry();

client.collectDefaultMetrics({
  register
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// ── DATABASE ──────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB error:', err); process.exit(1); });

// ── MIDDLEWARE ────────────────────────────────────────────
app.use(cors({
origin: process.env.FRONTEND_URL || 'http://localhost:5173',
credentials: true
}));



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
