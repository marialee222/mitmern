// controllers/adminController.js
const User = require('../models/User');

exports.getAdminDashboard = (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
};

exports.manageUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
};
