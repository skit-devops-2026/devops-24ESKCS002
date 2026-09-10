// models/RecruiterProfile.js
// Stores company/recruiter details. Needs institute approval before posting jobs.
const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  companyName: { type: String, required: true, trim: true },
  website:     { type: String, trim: true },
  industry:    { type: String, trim: true },      // e.g. "IT", "Finance", "Core Engineering"
  hrName:      { type: String, trim: true },
  hrPhone:     { type: String, trim: true },
  description: { type: String },                 // short company description

  // Institute reviews this and flips it to 'approved' or 'rejected'
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
