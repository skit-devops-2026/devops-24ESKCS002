// models/Application.js
// Tracks a student's application to an opportunity.
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile', required: true },
  opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },

  // Recruiter updates this; student sees it on their dashboard
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'selected', 'rejected'],
    default: 'applied'
  },

  appliedAt: { type: Date, default: Date.now },

}, { timestamps: true });

// A student can apply to each opportunity only once
applicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
