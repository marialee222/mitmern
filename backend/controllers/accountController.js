const Account = require('../models/Account');

// Fetch accounts for the logged-in user
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    console.error('Error fetching accounts:', err.message);
    res.status(500).send('Server error');
  }
};

// Create new accounts
exports.createAccount = async (req, res) => {
    const { accountType } = req.body;
  
    if (!accountType || !Array.isArray(accountType) || accountType.length === 0) {
      return res.status(400).json({ msg: 'accountType must be an array' });
    }
  
    try {
      const createdAccounts = [];
  
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
  
      res.json(createdAccounts);
    } catch (err) {
      console.error('Error creating accounts:', err.message);
      res.status(500).send('Server error');
    }
  };
  