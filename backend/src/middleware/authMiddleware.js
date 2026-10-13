const { verifyToken } = require('../utils/security');
const db = require('../config/db');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication session.' });
    }

    if (db.isMock()) {
      const mock = require('../config/mockDb');
      const user = mock.tables.users.find(u => u.id === decoded.id);
      if (!user || user.status === 'SUSPENDED') {
        return res.status(401).json({ success: false, message: 'Account is inactive or suspended.' });
      }
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      };
      return next();
    }

    const [users] = await db.query('SELECT id, email, role, status, is_verified FROM users WHERE id = ?', [decoded.id]);
    if (!users || users.length === 0 || users[0].status === 'SUSPENDED') {
      return res.status(401).json({ success: false, message: 'Account is inactive or suspended.' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Authentication failed.', error: error.message });
  }
}

function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      if (decoded && decoded.id) {
        if (db.isMock()) {
          const mock = require('../config/mockDb');
          const user = mock.tables.users.find(u => u.id === decoded.id);
          if (user && user.status === 'ACTIVE') {
            req.user = { id: user.id, email: user.email, role: user.role, is_verified: user.is_verified };
          }
        }
      }
    }
  } catch (e) {
    // Ignore optional auth errors
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access forbidden. Admin privileges required.' });
    }
    next();
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole
};
