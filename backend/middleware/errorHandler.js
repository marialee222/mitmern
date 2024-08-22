// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message || 'Something went wrong',
    });
  };
  
  module.exports = errorHandler;
  