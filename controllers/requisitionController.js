const { executeQuery, getConnection } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all requisitions
// @route   GET /api/requisitions
// @access  Private
const getRequisitions = asyncHandler(async (req, res) => {
  const { status, facility_id, department, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT r.*, f.name as facility_name, u.username as requested_by_name,
           COUNT(ri.id) as item_count
    FROM requisitions r
    LEFT JOIN facilities f ON r.facility_id = f.id
    LEFT JOIN users u ON r.requested_by = u.id
    LEFT JOIN requisition_items ri ON r.id = ri.requisition_id
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Apply filters based on user role
  if (req.user.role === 'Facility User' || req.user.role === 'Facility Admin') {
    query += ' AND r.facility_id = ?';
    queryParams.push(req.user.facility_id);
  } else if (facility_id) {
    query += ' AND r.facility_id = ?';
    queryParams.push(facility_id);
  }

  if (status) {
    query += ' AND r.status = ?';
    queryParams.push(status);
  }

  if (department) {
    query += ' AND r.department = ?';
    queryParams.push(department);
  }

  query += ' GROUP BY r.id ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const requisitions = await executeQuery(query, queryParams);

  // Get total count
  let countQuery = `
    SELECT COUNT(DISTINCT r.id) as total
    FROM requisitions r
    WHERE 1=1
  `;
  
  const countParams = [];
  
  if (req.user.role === 'Facility User' || req.user.role === 'Facility Admin') {
    countQuery += ' AND r.facility_id = ?';
    countParams.push(req.user.facility_id);
  } else if (facility_id) {
    countQuery += ' AND r.facility_id = ?';
    countParams.push(facility_id);
  }

  if (status) {
    countQuery += ' AND r.status = ?';
    countParams.push(status);
  }

  if (department) {
    countQuery += ' AND r.department = ?';
    countParams.push(department);
  }

  const totalResult = await executeQuery(countQuery, countParams);

  res.json({
    success: true,
    data: {
      requisitions,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single requisition
// @route   GET /api/requisitions/:id
// @access  Private
const getRequisition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const requisition = await executeQuery(
    `SELECT r.*, f.name as facility_name, u.username as requested_by_name,
            au.username as approved_by_name
     FROM requisitions r
     LEFT JOIN facilities f ON r.facility_id = f.id
     LEFT JOIN users u ON r.requested_by = u.id
     LEFT JOIN users au ON r.approved_by = au.id
     WHERE r.id = ?`,
    [id]
  );

  if (requisition.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Requisition not found'
    });
  }

  // Check access
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin' && 
      requisition[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Get requisition items
  const items = await executeQuery(
    `SELECT ri.*, i.name as item_name, i.item_code, i.unit, i.current_stock
     FROM requisition_items ri
     LEFT JOIN inventory i ON ri.inventory_id = i.id
     WHERE ri.requisition_id = ?`,
    [id]
  );

  res.json({
    success: true,
    data: {
      requisition: requisition[0],
      items
    }
  });
});

// @desc    Create requisition
// @route   POST /api/requisitions
// @access  Private
const createRequisition = asyncHandler(async (req, res) => {
  const { facility_id, department, duration, duration_unit, notes, items } = req.body;

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Determine facility_id
    let targetFacilityId = req.user.facility_id;
    if (req.user.role === 'Super Admin' && facility_id) {
      targetFacilityId = facility_id;
    }

    // Create requisition
    const [requisitionResult] = await connection.execute(
      `INSERT INTO requisitions (
        facility_id, department, duration, duration_unit, notes, status,
        requested_by, created_at
      ) VALUES (?, ?, ?, ?, ?, 'Pending', ?, NOW())`,
      [targetFacilityId, department, duration, duration_unit, notes, req.user.id]
    );

    const requisitionId = requisitionResult.insertId;

    // Add requisition items
    for (const item of items) {
      await connection.execute(
        `INSERT INTO requisition_items (
          requisition_id, inventory_id, requested_quantity, notes, created_at
        ) VALUES (?, ?, ?, ?, NOW())`,
        [requisitionId, item.inventory_id, item.requested_quantity, item.notes]
      );
    }

    await connection.commit();

    // Get created requisition with details
    const newRequisition = await executeQuery(
      `SELECT r.*, f.name as facility_name, u.username as requested_by_name
       FROM requisitions r
       LEFT JOIN facilities f ON r.facility_id = f.id
       LEFT JOIN users u ON r.requested_by = u.id
       WHERE r.id = ?`,
      [requisitionId]
    );

    res.status(201).json({
      success: true,
      message: 'Requisition created successfully',
      data: newRequisition[0]
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Update requisition status
// @route   PUT /api/requisitions/:id/status
// @access  Private (Admin only)
const updateRequisitionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes, items } = req.body;

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Check if requisition exists
    const [requisition] = await connection.execute(
      'SELECT * FROM requisitions WHERE id = ?',
      [id]
    );

    if (requisition.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Requisition not found'
      });
    }

    // Update requisition status
    await connection.execute(
      `UPDATE requisitions SET 
        status = ?, admin_notes = ?, approved_by = ?, approved_at = NOW(), updated_at = NOW()
       WHERE id = ?`,
      [status, admin_notes, req.user.id, id]
    );

    // Update individual items if provided
    if (items && Array.isArray(items)) {
      for (const item of items) {
        await connection.execute(
          `UPDATE requisition_items SET 
            approved_quantity = ?, notes = ?, updated_at = NOW()
           WHERE id = ?`,
          [item.approved_quantity, item.notes, item.requisition_item_id]
        );
      }
    }

    await connection.commit();

    // Get updated requisition
    const updatedRequisition = await executeQuery(
      `SELECT r.*, f.name as facility_name, u.username as requested_by_name,
              au.username as approved_by_name
       FROM requisitions r
       LEFT JOIN facilities f ON r.facility_id = f.id
       LEFT JOIN users u ON r.requested_by = u.id
       LEFT JOIN users au ON r.approved_by = au.id
       WHERE r.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Requisition status updated successfully',
      data: updatedRequisition[0]
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Get requisition statistics
// @route   GET /api/requisitions/stats
// @access  Private
const getRequisitionStats = asyncHandler(async (req, res) => {
  const { facility_id } = req.query;

  let facilityFilter = '';
  const queryParams = [];

  if (facility_id) {
    facilityFilter = 'WHERE facility_id = ?';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin') {
    facilityFilter = 'WHERE facility_id = ?';
    queryParams.push(req.user.facility_id);
  }

  const stats = await executeQuery(`
    SELECT 
      COUNT(*) as total_requisitions,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected,
      SUM(CASE WHEN status = 'Partially Approved' THEN 1 ELSE 0 END) as partially_approved,
      SUM(CASE WHEN status = 'Dispatched' THEN 1 ELSE 0 END) as dispatched,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed
    FROM requisitions ${facilityFilter}
  `, queryParams);

  res.json({
    success: true,
    data: stats[0]
  });
});

module.exports = {
  getRequisitions,
  getRequisition,
  createRequisition,
  updateRequisitionStatus,
  getRequisitionStats
};