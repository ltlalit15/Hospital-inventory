const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all facilities
// @route   GET /api/facilities
// @access  Private
const getFacilities = asyncHandler(async (req, res) => {
  const { type, search, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM facilities WHERE 1=1';
  const queryParams = [];

  if (type) {
    query += ' AND type = ?';
    queryParams.push(type);
  }

  if (search) {
    query += ' AND (name LIKE ? OR address LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const facilities = await executeQuery(query, queryParams);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM facilities WHERE 1=1';
  const countParams = queryParams.slice(0, -2);

  if (type) countQuery += ' AND type = ?';
  if (search) countQuery += ' AND (name LIKE ? OR address LIKE ?)';

  const totalResult = await executeQuery(countQuery, countParams);

  res.json({
    success: true,
    data: {
      facilities,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single facility
// @route   GET /api/facilities/:id
// @access  Private
const getFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const facility = await executeQuery(
    'SELECT * FROM facilities WHERE id = ?',
    [id]
  );

  if (facility.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  // Get facility statistics
  const stats = await executeQuery(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE facility_id = ?) as user_count,
      (SELECT COUNT(*) FROM inventory WHERE facility_id = ?) as inventory_count,
      (SELECT COUNT(*) FROM assets WHERE facility_id = ?) as asset_count,
      (SELECT COUNT(*) FROM requisitions WHERE facility_id = ? AND status = 'Pending') as pending_requisitions
  `, [id, id, id, id]);

  res.json({
    success: true,
    data: {
      facility: facility[0],
      statistics: stats[0]
    }
  });
});

// @desc    Create facility
// @route   POST /api/facilities
// @access  Private (Super Admin only)
const createFacility = asyncHandler(async (req, res) => {
  const { name, type, address, phone, email, description, capacity, services } = req.body;

  // Check if facility name already exists
  const existingFacility = await executeQuery(
    'SELECT id FROM facilities WHERE name = ?',
    [name]
  );

  if (existingFacility.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Facility with this name already exists'
    });
  }

  const result = await executeQuery(
    `INSERT INTO facilities (
      name, type, address, phone, email, description, capacity, services, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [name, type, address, phone, email, description, capacity, services, req.user.id]
  );

  // Get created facility
  const newFacility = await executeQuery(
    'SELECT * FROM facilities WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Facility created successfully',
    data: newFacility[0]
  });
});

// @desc    Update facility
// @route   PUT /api/facilities/:id
// @access  Private (Super Admin only)
const updateFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if facility exists
  const existingFacility = await executeQuery(
    'SELECT * FROM facilities WHERE id = ?',
    [id]
  );

  if (existingFacility.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  // Build update query
  const updateFields = [];
  const updateValues = [];

  const allowedFields = [
    'name', 'type', 'address', 'phone', 'email', 'description', 'capacity', 'services'
  ];

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
    `UPDATE facilities SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated facility
  const updatedFacility = await executeQuery(
    'SELECT * FROM facilities WHERE id = ?',
    [id]
  );

  res.json({
    success: true,
    message: 'Facility updated successfully',
    data: updatedFacility[0]
  });
});

// @desc    Delete facility
// @route   DELETE /api/facilities/:id
// @access  Private (Super Admin only)
const deleteFacility = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if facility exists
  const facility = await executeQuery(
    'SELECT * FROM facilities WHERE id = ?',
    [id]
  );

  if (facility.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Facility not found'
    });
  }

  // Check if facility has users, inventory, or assets
  const dependencies = await executeQuery(`
    SELECT 
      (SELECT COUNT(*) FROM users WHERE facility_id = ?) as user_count,
      (SELECT COUNT(*) FROM inventory WHERE facility_id = ?) as inventory_count,
      (SELECT COUNT(*) FROM assets WHERE facility_id = ?) as asset_count
  `, [id, id, id]);

  const { user_count, inventory_count, asset_count } = dependencies[0];

  if (user_count > 0 || inventory_count > 0 || asset_count > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete facility with existing users, inventory, or assets'
    });
  }

  await executeQuery('DELETE FROM facilities WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Facility deleted successfully'
  });
});

module.exports = {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility
};