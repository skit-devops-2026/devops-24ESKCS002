// routes/opportunity.js
// Opportunities accessible to logged-in students (filtered by eligibility on student route)
// This route handles general opportunity details
const express     = require('express');
const router      = express.Router();
const { requireLogin } = require('../middleware/auth');
const Opportunity = require('../models/Opportunity');

// GET /api/opportunity/:id  — single opportunity detail
router.get('/:id', requireLogin, async (req, res) => {
  try {
    const opp = await Opportunity.findById(req.params.id)
      .populate('recruiter', 'companyName website industry description');
    if (!opp) return res.status(404).json({ message: 'Opportunity not found.' });
    res.json(opp);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
