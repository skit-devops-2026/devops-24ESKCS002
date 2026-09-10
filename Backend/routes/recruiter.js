// routes/recruiter.js
const express          = require('express');
const router           = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const RecruiterProfile = require('../models/RecruiterProfile');
const Opportunity      = require('../models/Opportunity');
const Application      = require('../models/Application');

const guard = [requireLogin, requireRole('recruiter')];

const requireApproved = async (req, res, next) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  if (!profile || profile.status !== 'approved') {
    return res.status(403).json({ message: 'Your account is pending institute approval.' });
  }
  req.recruiterProfile = profile;
  next();
};

// GET /api/recruiter/profile?userId=xxx
router.get('/profile', guard, async (req, res) => {
  const profile = await RecruiterProfile.findOne({ user: req.user._id });
  res.json(profile);
});

// PUT /api/recruiter/profile   body: { userId, ...fields }
router.put('/profile', guard, async (req, res) => {
  try {
    const allowed = ['companyName', 'website', 'industry', 'hrName', 'hrPhone', 'description'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const updated = await RecruiterProfile.findOneAndUpdate({ user: req.user._id }, updates, { new: true });
    res.json({ message: 'Profile updated!', profile: updated });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/recruiter/opportunity   body: { userId, title, type, ... }
router.post('/opportunity', guard, requireApproved, async (req, res) => {
  try {
    const { title, type, description, location, stipend, eligibility, deadline } = req.body;
    const opp = await Opportunity.create({
      recruiter: req.recruiterProfile._id,
      title, type, description, location, stipend, eligibility, deadline
    });
    res.status(201).json({ message: 'Opportunity posted!', opportunity: opp });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/recruiter/opportunities?userId=xxx
router.get('/opportunities', guard, requireApproved, async (req, res) => {
  const opps = await Opportunity.find({ recruiter: req.recruiterProfile._id }).sort('-createdAt');
  res.json(opps);
});

// PATCH /api/recruiter/opportunity/:id/toggle   body: { userId }
router.patch('/opportunity/:id/toggle', guard, requireApproved, async (req, res) => {
  const opp = await Opportunity.findOne({ _id: req.params.id, recruiter: req.recruiterProfile._id });
  if (!opp) return res.status(404).json({ message: 'Not found.' });
  opp.isActive = !opp.isActive;
  await opp.save();
  res.json({ opportunity: opp });
});

// GET /api/recruiter/opportunity/:id/applicants?userId=xxx
router.get('/opportunity/:id/applicants', guard, requireApproved, async (req, res) => {
  const apps = await Application.find({ opportunity: req.params.id })
    .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
    .sort('-appliedAt');
  res.json(apps);
});

// PATCH /api/recruiter/application/:id/status   body: { userId, status }
router.patch('/application/:id/status', guard, requireApproved, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['shortlisted', 'selected', 'rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status.' });
  const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!app) return res.status(404).json({ message: 'Not found.' });
  res.json({ application: app });
});

module.exports = router;
