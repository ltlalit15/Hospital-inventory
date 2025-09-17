const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');

// Public routes
router.post('/register', validate(userSchemas.register), register);
router.post('/login', validate(userSchemas.login), login);

// Protected routes
router.use(verifyToken); // Apply authentication to all routes below

router.get('/profile', getProfile);
router.put('/profile', validate(userSchemas.updateProfile), updateProfile);
router.put('/change-password', validate(userSchemas.changePassword), changePassword);
router.post('/logout', logout);

module.exports = router;