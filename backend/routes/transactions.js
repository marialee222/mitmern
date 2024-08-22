const express = require('express');
const router = express.Router();
const { createTransaction, getAccountTransactions, transferFunds } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

// Route to create a transaction (deposit or withdraw)
router.post('/', protect, createTransaction);  // Added protect middleware

// Route to get transactions for a specific account
router.get('/:accountId', protect, getAccountTransactions);

// Route to transfer funds between accounts
router.post('/transfer', protect, transferFunds);  // Added protect middleware

module.exports = router;
