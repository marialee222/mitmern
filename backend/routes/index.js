const userRoutes = require('./api/users');
const authRoutes = require('./api/auth');
const accountRoutes = require('./accounts');
const transactionRoutes = require('./transactions');

module.exports = {
  userRoutes,
  authRoutes,
  accountRoutes,
  transactionRoutes,
};
