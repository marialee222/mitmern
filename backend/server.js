const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users');
const adminRoutes = require('./routes/adminRoutes');
const accountsRoutes = require('./routes/accounts');
const transactionsRoutes = require('./routes/transactions');
const transferRoutes = require('./routes/transfer');

// Load environment variables from .env file in the backend folder
require('dotenv').config({ path: './backend/.env' });

const app = express();

// Enable CORS for all routes
app.use(cors());

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/transfer', transferRoutes);

// Custom error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
