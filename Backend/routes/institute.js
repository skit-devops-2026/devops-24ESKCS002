// routes/institute.js
const express          = require('express');
const router           = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const RecruiterProfile = require('../models/RecruiterProfile');
const StudentProfile   = require('../models/StudentProfile');
const Application      = require('../models/Application');

const guard = [requireLogin, requireRole('institute')];

// GET /api/institute/recruiters?userId=xxx&status=pending
router.get('/recruiters', guard, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const recruiters = await RecruiterProfile.find(filter)
    .populate('user', 'name email createdAt')
    .sort('-createdAt');
  res.json(recruiters);
});

// PATCH /api/institute/recruiter/:id/verify   body: { userId, action }
router.patch('/recruiter/:id/verify', guard, async (req, res) => {
  const { action } = req.body;
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ message: 'Invalid action.' });
  const profile = await RecruiterProfile.findByIdAndUpdate(
    req.params.id,
    { status: action === 'approve' ? 'approved' : 'rejected' },
    { new: true }
  );
  if (!profile) return res.status(404).json({ message: 'Recruiter not found.' });
  res.json({ profile });
});

// GET /api/institute/students?userId=xxx
router.get('/students', guard, async (req, res) => {
  const students = await StudentProfile.find()
    .populate('user', 'name email createdAt')
    .sort('-createdAt');
  res.json(students);
});

// GET /api/institute/stats?userId=xxx
router.get('/stats', guard, async (req, res) => {
  const totalStudents        = await StudentProfile.countDocuments();
  const placedStudents       = await StudentProfile.countDocuments({ isPlaced: true });
  const totalRecruiters      = await RecruiterProfile.countDocuments({ status: 'approved' });
  const pendingRecruiters    = await RecruiterProfile.countDocuments({ status: 'pending' });
  const totalApplications    = await Application.countDocuments();
  const selectedApplications = await Application.countDocuments({ status: 'selected' });
  res.json({ totalStudents, placedStudents, totalRecruiters, pendingRecruiters, totalApplications, selectedApplications });
});

// GET /api/institute/applications?userId=xxx
router.get('/applications', guard, async (req, res) => {
  const apps = await Application.find()
    .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'opportunity', populate: { path: 'recruiter', select: 'companyName' } })
    .sort('-appliedAt');
  res.json(apps);
});

module.exports = router;
