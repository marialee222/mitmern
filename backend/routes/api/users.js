const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect } = require('../../middleware/authMiddleware');
const Account = require('../../models/Account');
const Transaction = require('../../models/Transaction');

// Register a new user or add an account for an existing user
router.post('/register', async (req, res, next) => {
  const { name, email, password, accountType } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (!accountType || !Array.isArray(accountType)) {
    return res.status(400).json({ msg: 'Account type must be an array' });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // If the user already exists, create new accounts for them
      for (const type of accountType) {
        const account = new Account({
          user: user._id,
          accountType: type,
          accountNumber: 'ACCT' + Date.now() + Math.floor(Math.random() * 1000),
          balance: 0,
        });
        await account.save();

        // Add the new account to the user's accounts array
        user.accounts.push(account._id);
      }

      await user.save();

      return res.json({ msg: 'New accounts added successfully', user });
    } else {
      // Set role based on the email
      const role = email === 'admin@example.com' ? 'admin' : 'customer';

      // Create a new user
      user = new User({
        name,
        email,
        password,
        role,
        accounts: [],
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Create and link accounts to the new user
      for (const type of accountType) {
        const account = new Account({
          user: user._id,
          accountType: type,
          accountNumber: 'ACCT' + Date.now() + Math.floor(Math.random() * 1000),
          balance: 0,
        });
        await account.save();

        // Link accounts to the user
        user.accounts.push(account._id);
      }

      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) return next(err);
          res.json({ msg: 'User registered successfully', token, user });
        }
      );
    }
  } catch (err) {
    console.error('Server error during registration:', err.message);
    next(err);
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) return res.status(500).json({ msg: 'Server error' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch All Users
router.get('/', protect, async (req, res) => {
  try {
    const users = await User.find().populate('accounts');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
});

// Fetch User Details, including transactions
router.get('/:id', protect, async (req, res) => {
  try {
    // Verify that the ID is provided
    if (!req.params.id) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    const user = await User.findById(req.params.id).populate('accounts');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch transactions for all the user's accounts
    const accountIds = user.accounts.map(account => account._id);
    const transactions = await Transaction.find({ account: { $in: accountIds } });

    // Return the user and an empty transactions array if no transactions are found
    res.json({ user, transactions: transactions.length > 0 ? transactions : [] });
  } catch (err) {
    console.error('Error fetching user details:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
