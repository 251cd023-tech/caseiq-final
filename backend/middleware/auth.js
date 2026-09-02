const jwt = require('jsonwebtoken');
const { users } = require('../data/seedData');

const JWT_SECRET = process.env.JWT_SECRET || 'caseiq_ultra_secure_jwt_secret_key_2026';

// Required Authentication Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Missing or invalid Bearer token.',
      message: 'Authentication required. Missing or invalid Bearer token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found or session expired.',
        message: 'User not found or session expired.'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token.',
      message: 'Invalid or expired token.'
    });
  }
};

// Optional Authentication Middleware (identifies user if token present)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      // ignore token error for optional auth
    }
  }
  next();
};

module.exports = {
  JWT_SECRET,
  requireAuth,
  optionalAuth,
  authenticate: requireAuth,
  authenticateOptional: optionalAuth
};
