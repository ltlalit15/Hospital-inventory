const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public (Admin only in production)
const register = asyncHandler(async (req, res) => {
  const { username, email, password, role, facility_id, department, phone, first_name, last_name } = req.body;

  // Check if user already exists
  const existingUser = await executeQuery(
    'SELECT id FROM users WHERE username = ? OR email = ?',
    [username, email]
  );

  if (existingUser.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'User with this username or email already exists'
    });
  }

  // Check if facility exists
  const facility = await executeQuery(
    'SELECT id FROM facilities WHERE id = ?',
    [facility_id]
  );

  if (facility.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid facility ID'
    });
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const result = await executeQuery(
    `INSERT INTO users (username, email, password, role, facility_id, department, phone, first_name, last_name, status, created_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', NOW())`,
    [username, email, hashedPassword, role, facility_id, department, phone, first_name, last_name]
  );

  // Get created user (without password)
  const newUser = await executeQuery(
    `SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department, u.phone, u.first_name, u.last_name, u.status, u.created_at,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.id = ?`,
    [result.insertId]
  );

  // Generate token
  const token = generateToken(result.insertId);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser[0],
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Get user with password
  const users = await executeQuery(
    `SELECT u.id, u.username, u.email, u.password, u.role, u.facility_id, u.department, u.phone, u.first_name, u.last_name, u.status,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.username = ? OR u.email = ?`,
    [username, username]
  );

  if (users.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const user = users[0];

  // Check if user is active
  if (user.status !== 'Active') {
    return res.status(401).json({
      success: false,
      message: 'Account is inactive. Please contact administrator.'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  await executeQuery(
    'UPDATE users SET last_login = NOW() WHERE id = ?',
    [user.id]
  );

  // Remove password from response
  delete user.password;

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  const user = await executeQuery(
    `SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department, u.phone, u.first_name, u.last_name, u.status, u.created_at, u.last_login,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.id = ?`,
    [req.user.id]
  );

  res.json({
    success: true,
    data: user[0]
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, phone, first_name, last_name, department } = req.body;
  const userId = req.user.id;

  // Check if username/email already exists for other users
  if (username || email) {
    const existingUser = await executeQuery(
      'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username || '', email || '', userId]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
    }
  }

  // Build update query dynamically
  const updateFields = [];
  const updateValues = [];

  if (username) {
    updateFields.push('username = ?');
    updateValues.push(username);
  }
  if (email) {
    updateFields.push('email = ?');
    updateValues.push(email);
  }
  if (phone) {
    updateFields.push('phone = ?');
    updateValues.push(phone);
  }
  if (first_name) {
    updateFields.push('first_name = ?');
    updateValues.push(first_name);
  }
  if (last_name) {
    updateFields.push('last_name = ?');
    updateValues.push(last_name);
  }
  if (department) {
    updateFields.push('department = ?');
    updateValues.push(department);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No fields to update'
    });
  }

  updateFields.push('updated_at = NOW()');
  updateValues.push(userId);

  await executeQuery(
    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated user
  const updatedUser = await executeQuery(
    `SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department, u.phone, u.first_name, u.last_name, u.status, u.created_at, u.updated_at,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.id = ?`,
    [userId]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser[0]
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Get current password
  const user = await executeQuery(
    'SELECT password FROM users WHERE id = ?',
    [userId]
  );

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user[0].password);

  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Hash new password
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await executeQuery(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
    [hashedNewPassword, userId]
  );

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
};