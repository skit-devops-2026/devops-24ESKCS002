// routes/student.js
// All routes require userId sent from frontend (body for POST/PUT, query for GET)

const express        = require('express');
const router         = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const StudentProfile = require('../models/StudentProfile');
const Application    = require('../models/Application');
const Opportunity    = require('../models/Opportunity');

const guard = [requireLogin, requireRole('student')];

// GET /api/student/profile?userId=xxx
router.get('/profile', guard, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found.' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/student/profile   body: { userId, ...fields }
router.put('/profile', guard, async (req, res) => {
  try {
    const allowed = ['phone', 'branch', 'cgpa', 'passingYear', 'tenthPct',
                     'twelfthPct', 'skills', 'resumeUrl', 'linkedIn', 'github'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    const merged  = { ...profile.toObject(), ...updates };
    updates.isProfileComplete = !!(merged.phone && merged.cgpa && merged.passingYear
                                   && merged.skills?.length && merged.resumeUrl);

    const updated = await StudentProfile.findOneAndUpdate(
      { user: req.user._id }, updates, { new: true }
    );
    res.json({ message: 'Profile updated!', profile: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/student/opportunities?userId=xxx
router.get('/opportunities', guard, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile?.isProfileComplete) {
      return res.status(403).json({ message: 'Please complete your profile to view opportunities.' });
    }
    const now  = new Date();
    const opps = await Opportunity.find({
      isActive: true,
      deadline: { $gte: now },
      'eligibility.minCGPA': { $lte: profile.cgpa || 0 },
      $or: [
        { 'eligibility.branches': { $size: 0 } },
        { 'eligibility.branches': profile.branch }
      ]
    }).populate('recruiter', 'companyName industry');
    res.json(opps);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/student/apply/:opportunityId   body: { userId }
router.post('/apply/:opportunityId', guard, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (!profile?.isProfileComplete) {
      return res.status(403).json({ message: 'Complete your profile before applying.' });
    }
    const app = await Application.create({
      student: profile._id,
      opportunity: req.params.opportunityId
    });
    res.status(201).json({ message: 'Application submitted!', application: app });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already applied.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/student/applications?userId=xxx
router.get('/applications', guard, async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const apps = await Application.find({ student: profile._id })
      .populate({ path: 'opportunity', populate: { path: 'recruiter', select: 'companyName' } })
      .sort('-appliedAt');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
