const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  account: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Account', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount must be positive'],  // Ensures that only positive amounts are stored
  },
  transactionType: { 
    type: String, 
    enum: ['deposit', 'withdraw'], 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true  // Adds createdAt and updatedAt fields automatically
});

// Creating a model from the schema
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
