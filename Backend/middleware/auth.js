// middleware/auth.js
// No sessions, no JWT.
// Frontend stores userId in localStorage and sends it with every request.
// GET requests → send as query param: ?userId=xxx
// POST/PUT/PATCH requests → send in request body: { userId, ...otherData }

const User = require('../models/User');

const requireLogin = async (req, res, next) => {
  const userId = req.body.userId || req.query.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Not logged in. Please log in to continue.' });
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid user ID.' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied. Required: ${roles.join(' or ')}.` });
  }
  next();
};

module.exports = { requireLogin, requireRole };
