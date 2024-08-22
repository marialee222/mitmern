const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

router.post('/', async (req, res) => {
  const { senderAccountId, receiverAccountId, amount } = req.body;

  try {
    // Validate sender's account
    const senderAccount = await Account.findById(senderAccountId);
    if (!senderAccount || senderAccount.balance < amount) {
      return res.status(400).json({ msg: 'Insufficient balance or sender account not found' });
    }

    // Validate receiver's account
    const receiverAccount = await Account.findById(receiverAccountId);
    if (!receiverAccount) {
      return res.status(404).json({ msg: 'Receiver account not found' });
    }

    // Perform the transfer
    senderAccount.balance -= amount;
    receiverAccount.balance += amount;

    // Save accounts
    await senderAccount.save();
    await receiverAccount.save();

    res.json({ msg: 'Transfer successful' });
  } catch (err) {
    console.error('Transfer error:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
