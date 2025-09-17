const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getUsers = asyncHandler(async (req, res) => {
  const { role, facility_id, status, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department,
           u.phone, u.first_name, u.last_name, u.status, u.created_at, u.last_login,
           f.name as facility_name
    FROM users u
    LEFT JOIN facilities f ON u.facility_id = f.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Apply filters based on user role
  if (req.user.role === 'Facility Admin') {
    query += ' AND u.facility_id = ?';
    queryParams.push(req.user.facility_id);
  } else if (facility_id) {
    query += ' AND u.facility_id = ?';
    queryParams.push(facility_id);
  }

  if (role) {
    query += ' AND u.role = ?';
    queryParams.push(role);
  }

  if (status) {
    query += ' AND u.status = ?';
    queryParams.push(status);
  }

  if (search) {
    query += ' AND (u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const users = await executeQuery(query, queryParams);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM users u WHERE 1=1';
  const countParams = queryParams.slice(0, -2);

  if (req.user.role === 'Facility Admin') {
    countQuery += ' AND u.facility_id = ?';
  } else if (facility_id) {
    countQuery += ' AND u.facility_id = ?';
  }

  if (role) countQuery += ' AND u.role = ?';
  if (status) countQuery += ' AND u.status = ?';
  if (search) countQuery += ' AND (u.username LIKE ? OR u.email LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)';

  const totalResult = await executeQuery(countQuery, countParams);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await executeQuery(
    `SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department,
            u.phone, u.first_name, u.last_name, u.status, u.created_at, u.last_login,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.id = ?`,
    [id]
  );

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check access
  if (req.user.role === 'Facility Admin' && user[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: user[0]
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if user exists
  const existingUser = await executeQuery(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  if (existingUser.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check access
  if (req.user.role === 'Facility Admin' && existingUser[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Build update query
  const updateFields = [];
  const updateValues = [];

  const allowedFields = ['username', 'email', 'role', 'facility_id', 'department', 'phone', 'first_name', 'last_name', 'status'];

  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      updateValues.push(updateData[field]);
    }
  });

  if (updateFields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid fields to update'
    });
  }

  updateFields.push('updated_at = NOW()');
  updateValues.push(id);

  await executeQuery(
    `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated user
  const updatedUser = await executeQuery(
    `SELECT u.id, u.username, u.email, u.role, u.facility_id, u.department,
            u.phone, u.first_name, u.last_name, u.status, u.created_at, u.updated_at,
            f.name as facility_name
     FROM users u
     LEFT JOIN facilities f ON u.facility_id = f.id
     WHERE u.id = ?`,
    [id]
  );

  res.json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser[0]
  });
});

// @desc    Reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Private (Admin only)
const resetUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  // Check if user exists
  const user = await executeQuery(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check access
  if (req.user.role === 'Facility Admin' && user[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Hash new password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await executeQuery(
    'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
    [hashedPassword, id]
  );

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

// @desc    Toggle user status
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin only)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const user = await executeQuery(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check access
  if (req.user.role === 'Facility Admin' && user[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Prevent self-deactivation
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot change your own status'
    });
  }

  const newStatus = user[0].status === 'Active' ? 'Inactive' : 'Active';

  await executeQuery(
    'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
    [newStatus, id]
  );

  res.json({
    success: true,
    message: `User ${newStatus.toLowerCase()} successfully`,
    data: { status: newStatus }
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Super Admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const user = await executeQuery(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );

  if (user.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent self-deletion
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  // Check if user has created records
  const userRecords = await executeQuery(`
    SELECT 
      (SELECT COUNT(*) FROM requisitions WHERE requested_by = ?) as requisitions,
      (SELECT COUNT(*) FROM dispatches WHERE dispatched_by = ?) as dispatches,
      (SELECT COUNT(*) FROM inventory WHERE created_by = ?) as inventory_items
  `, [id, id, id]);

  const { requisitions, dispatches, inventory_items } = userRecords[0];

  if (requisitions > 0 || dispatches > 0 || inventory_items > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete user with existing records. Consider deactivating instead.'
    });
  }

  await executeQuery('DELETE FROM users WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  resetUserPassword,
  toggleUserStatus,
  deleteUser
};