const jwt = require('jsonwebtoken');
const { getPool } = require('../config/database');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const pool = getPool();
    const result = await pool.request()
      .input('userId', decoded.userId)
      .query('SELECT id, email, name, role, department FROM users WHERE id = @userId AND active = 1');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    req.user = result.recordset[0];
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};