// models/Opportunity.js
// Job or internship posted by a verified recruiter.
const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  recruiter:   { type: mongoose.Schema.Types.ObjectId, ref: 'RecruiterProfile', required: true },

  title:       { type: String, required: true, trim: true },
  type:        { type: String, enum: ['job', 'internship'], required: true },
  description: { type: String, required: true },
  location:    { type: String },
  stipend:     { type: String },          // e.g. "₹15,000/month" or "5 LPA"

  // Eligibility filters
  eligibility: {
    minCGPA:   { type: Number, default: 0 },
    branches:  [{ type: String }],        // ["CSE", "IT"] — empty means all
    passingYear: { type: Number }
  },

  deadline:    { type: Date, required: true },
  isActive:    { type: Boolean, default: true },

}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);
