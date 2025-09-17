const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user details from database
    const user = await executeQuery(
      'SELECT id, username, email, role, facility_id, department, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user.length) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (user[0].status !== 'Active') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.'
      });
    }

    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Check user role
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check facility access
const checkFacilityAccess = async (req, res, next) => {
  try {
    const facilityId = req.params.facilityId || req.body.facility_id;
    
    // Super Admin can access all facilities
    if (req.user.role === 'Super Admin') {
      return next();
    }

    // Other users can only access their assigned facility
    if (req.user.facility_id !== parseInt(facilityId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your assigned facility.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error checking facility access.',
      error: error.message
    });
  }
};

module.exports = {
  verifyToken,
  checkRole,
  checkFacilityAccess
};