const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
  accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }] // Link to the Account model
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
