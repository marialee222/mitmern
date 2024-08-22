const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get all users with account details
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().populate('accounts'); // Populate accounts field
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
