const { executeQuery, getConnection } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');
const { upload, deleteImage } = require('../config/cloudinary');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
const getAssets = asyncHandler(async (req, res) => {
  const { facility_id, category, status, condition, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT a.*, f.name as facility_name
    FROM assets a
    LEFT JOIN facilities f ON a.facility_id = f.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Apply filters based on user role
  if (req.user.role !== 'Super Admin') {
    query += ' AND a.facility_id = ?';
    queryParams.push(req.user.facility_id);
  } else if (facility_id) {
    query += ' AND a.facility_id = ?';
    queryParams.push(facility_id);
  }

  if (category) {
    query += ' AND a.category = ?';
    queryParams.push(category);
  }

  if (status) {
    query += ' AND a.status = ?';
    queryParams.push(status);
  }

  if (condition) {
    query += ' AND a.condition = ?';
    queryParams.push(condition);
  }

  query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const assets = await executeQuery(query, queryParams);

  // Get total count
  let countQuery = `SELECT COUNT(*) as total FROM assets a WHERE 1=1`;
  const countParams = queryParams.slice(0, -2);

  if (req.user.role !== 'Super Admin') {
    countQuery += ' AND a.facility_id = ?';
  } else if (facility_id) {
    countQuery += ' AND a.facility_id = ?';
  }

  if (category) countQuery += ' AND a.category = ?';
  if (status) countQuery += ' AND a.status = ?';
  if (condition) countQuery += ' AND a.condition = ?';

  const totalResult = await executeQuery(countQuery, countParams);

  res.json({
    success: true,
    data: {
      assets,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
const getAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const asset = await executeQuery(
    `SELECT a.*, f.name as facility_name
     FROM assets a
     LEFT JOIN facilities f ON a.facility_id = f.id
     WHERE a.id = ?`,
    [id]
  );

  if (asset.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Asset not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && asset[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Get maintenance history
  const maintenanceHistory = await executeQuery(
    `SELECT am.*, u.username as created_by_name
     FROM asset_maintenance am
     LEFT JOIN users u ON am.created_by = u.id
     WHERE am.asset_id = ?
     ORDER BY am.maintenance_date DESC`,
    [id]
  );

  // Get movement history
  const movementHistory = await executeQuery(
    `SELECT amv.*, u.username as created_by_name
     FROM asset_movements amv
     LEFT JOIN users u ON amv.created_by = u.id
     WHERE amv.asset_id = ?
     ORDER BY amv.movement_date DESC`,
    [id]
  );

  res.json({
    success: true,
    data: {
      asset: asset[0],
      maintenance_history: maintenanceHistory,
      movement_history: movementHistory
    }
  });
});

// @desc    Create asset
// @route   POST /api/assets
// @access  Private (Admin only)
const createAsset = asyncHandler(async (req, res) => {
  const {
    asset_code, name, category, description, serial_number, department,
    location, purchase_date, purchase_cost, vendor, warranty_end_date,
    condition, status
  } = req.body;

  // Check if asset code already exists
  const existingAsset = await executeQuery(
    'SELECT id FROM assets WHERE asset_code = ?',
    [asset_code]
  );

  if (existingAsset.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Asset code already exists'
    });
  }

  // Determine facility_id
  let facility_id = req.user.facility_id;
  if (req.user.role === 'Super Admin' && req.body.facility_id) {
    facility_id = req.body.facility_id;
  }

  // Handle file upload if present
  let attachments = null;
  if (req.file) {
    attachments = JSON.stringify([{
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname
    }]);
  }

  const result = await executeQuery(
    `INSERT INTO assets (
      asset_code, name, category, description, serial_number, facility_id,
      department, location, purchase_date, purchase_cost, vendor,
      warranty_end_date, condition, status, attachments, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      asset_code, name, category, description, serial_number, facility_id,
      department, location, purchase_date, purchase_cost, vendor,
      warranty_end_date, condition, status, attachments, req.user.id
    ]
  );

  // Get created asset
  const newAsset = await executeQuery(
    `SELECT a.*, f.name as facility_name
     FROM assets a
     LEFT JOIN facilities f ON a.facility_id = f.id
     WHERE a.id = ?`,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Asset created successfully',
    data: newAsset[0]
  });
});

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private (Admin only)
const updateAsset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if asset exists
  const existingAsset = await executeQuery(
    'SELECT * FROM assets WHERE id = ?',
    [id]
  );

  if (existingAsset.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Asset not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && existingAsset[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Build update query
  const updateFields = [];
  const updateValues = [];

  const allowedFields = [
    'name', 'category', 'description', 'serial_number', 'department',
    'location', 'purchase_date', 'purchase_cost', 'vendor',
    'warranty_end_date', 'condition', 'status'
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
    `UPDATE assets SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated asset
  const updatedAsset = await executeQuery(
    `SELECT a.*, f.name as facility_name
     FROM assets a
     LEFT JOIN facilities f ON a.facility_id = f.id
     WHERE a.id = ?`,
    [id]
  );

  res.json({
    success: true,
    message: 'Asset updated successfully',
    data: updatedAsset[0]
  });
});

// @desc    Add maintenance record
// @route   POST /api/assets/:id/maintenance
// @access  Private (Admin only)
const addMaintenanceRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { maintenance_date, maintenance_type, description, technician, cost, estimated_duration, notes } = req.body;

  // Check if asset exists
  const asset = await executeQuery(
    'SELECT * FROM assets WHERE id = ?',
    [id]
  );

  if (asset.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Asset not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && asset[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Handle file upload if present
  let attachment = null;
  if (req.file) {
    attachment = JSON.stringify({
      url: req.file.path,
      public_id: req.file.filename,
      original_name: req.file.originalname
    });
  }

  const result = await executeQuery(
    `INSERT INTO asset_maintenance (
      asset_id, maintenance_date, maintenance_type, description, technician,
      cost, estimated_duration, notes, attachment, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [id, maintenance_date, maintenance_type, description, technician, cost, estimated_duration, notes, attachment, req.user.id]
  );

  // Update asset status if maintenance type requires it
  if (maintenance_type === 'Corrective' || maintenance_type === 'Emergency') {
    await executeQuery(
      'UPDATE assets SET status = ?, updated_at = NOW() WHERE id = ?',
      ['Under Maintenance', id]
    );
  }

  res.status(201).json({
    success: true,
    message: 'Maintenance record added successfully',
    data: { id: result.insertId }
  });
});

// @desc    Add movement record
// @route   POST /api/assets/:id/movement
// @access  Private (Admin only)
const addMovementRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { movement_date, from_location, to_location, reason, handled_by } = req.body;

  // Check if asset exists
  const asset = await executeQuery(
    'SELECT * FROM assets WHERE id = ?',
    [id]
  );

  if (asset.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Asset not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && asset[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Add movement record
    await connection.execute(
      `INSERT INTO asset_movements (
        asset_id, movement_date, from_location, to_location, reason, handled_by, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, movement_date, from_location, to_location, reason, handled_by, req.user.id]
    );

    // Update asset location
    await connection.execute(
      'UPDATE assets SET location = ?, updated_at = NOW() WHERE id = ?',
      [to_location, id]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Movement record added successfully'
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  addMaintenanceRecord,
  addMovementRecord
};