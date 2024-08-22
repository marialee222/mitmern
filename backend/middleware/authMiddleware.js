const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


exports.adminOnly = (req, res, next) => {
  // Check if the user is present and has an admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    console.error('Access denied, admin only. Current role:', req.user ? req.user.role : 'No user'); // Log the user's role
    // Return a forbidden status if the user is not an admin
    res.status(403).json({ msg: 'Access denied, admin only' });
  }
};
