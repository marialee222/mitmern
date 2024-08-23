const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, getUserDetails } = require('../../controllers/userController');
const { protect } = require('../../middleware/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Fetch all users (admin only)
router.get('/', protect, getAllUsers);

// Fetch user details by ID (authenticated users)
router.get('/:userId', protect, getUserDetails);

module.exports = router;
