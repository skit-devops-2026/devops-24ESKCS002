// models/StudentProfile.js
// Stores all placement-relevant details for a student.
// University Roll Number is unique and mandatory — used as student identifier.
const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // ── Personal ──────────────────────────────────────────
  phone:      { type: String, trim: true },
  // University roll number — unique per student (e.g. 2200123CS001)
  rollNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },

  // ── Academic ──────────────────────────────────────────
  branch: {
    type: String,
    enum: ['CSE', 'CSE (AI)', 'IT', 'ECE', 'Mechanical', 'Civil', 'Other'],
    required: true
  },
  cgpa:        { type: Number, min: 0, max: 10 },
  passingYear: { type: Number },
  tenthPct:    { type: Number, min: 0, max: 100 },  // 10th percentage
  twelfthPct:  { type: Number, min: 0, max: 100 },  // 12th percentage

  // ── Professional ─────────────────────────────────────
  skills:    [{ type: String }],       // ["Python", "React", ...]
  resumeUrl: { type: String },         // link to Google Drive / resume PDF
  linkedIn:  { type: String },
  github:    { type: String },

  // ── Status ────────────────────────────────────────────
  isProfileComplete: { type: Boolean, default: false },
  isPlaced:          { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
