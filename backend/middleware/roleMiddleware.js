// middleware/roleMiddleware.js
const roleMiddleware = (requiredRole) => (req, res, next) => {
    if (req.user && req.user.role === requiredRole) {
      next(); // User has the correct role, proceed to the next middleware
    } else {
      res.status(403).json({ msg: 'Access denied: insufficient permissions' });
    }
  };
  
  module.exports = roleMiddleware;
  