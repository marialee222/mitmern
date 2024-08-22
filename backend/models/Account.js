const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  accountType: { 
    type: [String], // Updated to an array of strings
    required: true 
  },
  accountNumber: { 
    type: String, 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
});

const Account = mongoose.model('Account', AccountSchema);

module.exports = Account;
