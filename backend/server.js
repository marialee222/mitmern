const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables from .env file in the backend folder
require('dotenv').config({ path: './backend/.env' });

const app = express();

// Enable CORS for all routes
app.use(cors());

// Custom middleware to handle preflight requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Connect to the database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/transfer', require('./routes/transfer'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'build')));

// Handle any other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Custom error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
