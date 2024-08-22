const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Account = require('../models/Account');
const { transferFunds } = require('../controllers/transactionController');
const { createAccount } = require('../controllers/accountController');

// Fetch all accounts for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err.message);
    res.status(500).send('Server error');
  }
});

// Update account balance
router.patch('/:accountId/balance', protect, async (req, res) => {
  const { accountId } = req.params;
  const { balance } = req.body;

  try {
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    if (balance < 0) {
      return res.status(400).json({ msg: 'Balance cannot be negative' });
    }

    account.balance = balance;
    await account.save();
    res.json(account);
  } catch (err) {
    console.error('Error updating account balance:', err.message);
    res.status(500).send('Server error');
  }
});

// Route to transfer funds between accounts
router.post('/transfer', protect, transferFunds);

// Route to create a new account
router.post('/', protect, async (req, res) => {
  try {
    const { accountType } = req.body;
    
    // Check if account type(s) are provided
    if (!accountType || !Array.isArray(accountType) || accountType.length === 0) {
      return res.status(400).json({ msg: 'Please select at least one account type' });
    }

    const createdAccounts = [];

    // Loop through the provided account types and create each account
    for (const type of accountType) {
      const newAccount = new Account({
        user: req.user.id,
        accountType: type,
        accountNumber: 'ACCT' + Date.now() + Math.floor(Math.random() * 1000),
        balance: 0
      });

      const account = await newAccount.save();
      createdAccounts.push(account);
    }

    res.status(201).json(createdAccounts);
  } catch (err) {
    console.error('Error creating accounts:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
