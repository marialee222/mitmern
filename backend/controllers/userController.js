const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction'); // Import the Transaction model

// Register new user
exports.registerUser = async (req, res, next) => {
  const { name, email, password, role, accountType } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (!accountType || accountType.length === 0) {
    return res.status(400).json({ msg: 'Please select at least one account type' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user with an empty accounts array
    user = new User({
      name,
      email,
      password,
      role: email === 'admin@example.com' ? 'admin' : (role || 'customer'),
      accounts: [] // Initialize as an empty array
    });

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('Hashed Password:', user.password);  // Log the hashed password
    await user.save();

    // Create and link accounts to the user
    const accountTypes = Array.isArray(accountType) ? accountType : [accountType];
    for (const type of accountTypes) {
      const account = new Account({
        user: user._id,
        accountType: type,
        accountNumber: 'ACCT' + Date.now() + Math.floor(Math.random() * 1000),
        balance: 0
      });
      await account.save();

      // Link account to the user
      user.accounts.push(account._id);
    }

    await user.save();

    // Generate a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err.message);
          return next(err);
        }
        res.json({ success: true, token, user });
      }
    );
  } catch (err) {
    console.error('Error registering user:', err.message);
    next(err);
  }
};

// Fetch all users with their account details
exports.getAllUsers = async (req, res) => {
  try {
    // Populate 'accounts' and get the necessary details
    const users = await User.find().populate({
      path: 'accounts',
      select: 'accountType balance accountNumber' // Select fields you want to display
    });

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).send('Server error');
  }
};

// Fetch user details including accounts and transactions
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('accounts');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Fetch transactions for all the user's accounts
    const accountIds = user.accounts.map(account => account._id);
    const transactions = await Transaction.find({ account: { $in: accountIds } });

    res.json({ user, transactions });
  } catch (err) {
    console.error('Error fetching user details:', err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email }).populate('accounts');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password Match:', isMatch);  // Log whether the passwords match
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Generate JWT and return it
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
      }
    );
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Server error');
  }
};
