const { executeQuery, getConnection } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all dispatches
// @route   GET /api/dispatches
// @access  Private
const getDispatches = asyncHandler(async (req, res) => {
  const { status, facility_id, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT d.*, f.name as facility_name, r.id as requisition_number,
           u.username as dispatched_by_name
    FROM dispatches d
    LEFT JOIN facilities f ON d.facility_id = f.id
    LEFT JOIN requisitions r ON d.requisition_id = r.id
    LEFT JOIN users u ON d.dispatched_by = u.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Apply filters based on user role
  if (req.user.role === 'Facility User' || req.user.role === 'Facility Admin') {
    query += ' AND d.facility_id = ?';
    queryParams.push(req.user.facility_id);
  } else if (facility_id) {
    query += ' AND d.facility_id = ?';
    queryParams.push(facility_id);
  }

  if (status) {
    query += ' AND d.status = ?';
    queryParams.push(status);
  }

  query += ' ORDER BY d.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const dispatches = await executeQuery(query, queryParams);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM dispatches d WHERE 1=1';
  const countParams = queryParams.slice(0, -2);

  if (req.user.role === 'Facility User' || req.user.role === 'Facility Admin') {
    countQuery += ' AND d.facility_id = ?';
  } else if (facility_id) {
    countQuery += ' AND d.facility_id = ?';
  }

  if (status) countQuery += ' AND d.status = ?';

  const totalResult = await executeQuery(countQuery, countParams);

  res.json({
    success: true,
    data: {
      dispatches,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single dispatch
// @route   GET /api/dispatches/:id
// @access  Private
const getDispatch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dispatch = await executeQuery(
    `SELECT d.*, f.name as facility_name, f.address as facility_address,
            r.id as requisition_number, u.username as dispatched_by_name
     FROM dispatches d
     LEFT JOIN facilities f ON d.facility_id = f.id
     LEFT JOIN requisitions r ON d.requisition_id = r.id
     LEFT JOIN users u ON d.dispatched_by = u.id
     WHERE d.id = ?`,
    [id]
  );

  if (dispatch.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Dispatch not found'
    });
  }

  // Check access
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin' && 
      dispatch[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Get dispatch items
  const items = await executeQuery(
    `SELECT di.*, i.name as item_name, i.item_code, i.unit
     FROM dispatch_items di
     LEFT JOIN inventory i ON di.inventory_id = i.id
     WHERE di.dispatch_id = ?`,
    [id]
  );

  res.json({
    success: true,
    data: {
      dispatch: dispatch[0],
      items
    }
  });
});

// @desc    Create dispatch
// @route   POST /api/dispatches
// @access  Private (Warehouse Admin only)
const createDispatch = asyncHandler(async (req, res) => {
  const { requisition_id, facility_id, estimated_delivery_date, notes, items } = req.body;

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Verify requisition exists and is approved
    const [requisition] = await connection.execute(
      'SELECT * FROM requisitions WHERE id = ? AND status = ?',
      [requisition_id, 'Approved']
    );

    if (requisition.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Requisition not found or not approved'
      });
    }

    // Generate tracking number
    const trackingNumber = `TRK-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    // Create dispatch
    const [dispatchResult] = await connection.execute(
      `INSERT INTO dispatches (
        requisition_id, facility_id, tracking_number, estimated_delivery_date,
        notes, status, dispatched_by, created_at
      ) VALUES (?, ?, ?, ?, ?, 'Processing', ?, NOW())`,
      [requisition_id, facility_id, trackingNumber, estimated_delivery_date, notes, req.user.id]
    );

    const dispatchId = dispatchResult.insertId;

    // Add dispatch items and update inventory
    for (const item of items) {
      // Check stock availability
      const [inventoryItem] = await connection.execute(
        'SELECT current_stock FROM inventory WHERE id = ?',
        [item.inventory_id]
      );

      if (inventoryItem.length === 0 || inventoryItem[0].current_stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for item ID: ${item.inventory_id}`
        });
      }

      // Add dispatch item
      await connection.execute(
        `INSERT INTO dispatch_items (
          dispatch_id, inventory_id, quantity, batch_number, created_at
        ) VALUES (?, ?, ?, ?, NOW())`,
        [dispatchId, item.inventory_id, item.quantity, item.batch_number]
      );

      // Update inventory stock
      await connection.execute(
        'UPDATE inventory SET current_stock = current_stock - ?, updated_at = NOW() WHERE id = ?',
        [item.quantity, item.inventory_id]
      );

      // Record stock movement
      await connection.execute(
        `INSERT INTO stock_movements (
          inventory_id, transaction_type, quantity, batch_number,
          reference_number, notes, created_by, created_at
        ) VALUES (?, 'OUT', ?, ?, ?, 'Dispatched to facility', ?, NOW())`,
        [item.inventory_id, item.quantity, item.batch_number, `DISPATCH-${dispatchId}`, req.user.id]
      );
    }

    // Update requisition status
    await connection.execute(
      'UPDATE requisitions SET status = ?, updated_at = NOW() WHERE id = ?',
      ['Dispatched', requisition_id]
    );

    await connection.commit();

    // Get created dispatch
    const newDispatch = await executeQuery(
      `SELECT d.*, f.name as facility_name, r.id as requisition_number
       FROM dispatches d
       LEFT JOIN facilities f ON d.facility_id = f.id
       LEFT JOIN requisitions r ON d.requisition_id = r.id
       WHERE d.id = ?`,
      [dispatchId]
    );

    res.status(201).json({
      success: true,
      message: 'Dispatch created successfully',
      data: newDispatch[0]
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Update dispatch status
// @route   PUT /api/dispatches/:id/status
// @access  Private
const updateDispatchStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, tracking_number, delivery_date, received_by, notes } = req.body;

  // Check if dispatch exists
  const dispatch = await executeQuery(
    'SELECT * FROM dispatches WHERE id = ?',
    [id]
  );

  if (dispatch.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Dispatch not found'
    });
  }

  // Check access
  if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin' && 
      dispatch[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Update dispatch
    await connection.execute(
      `UPDATE dispatches SET 
        status = ?, tracking_number = ?, delivery_date = ?, received_by = ?, 
        notes = CONCAT(COALESCE(notes, ''), ?, '\n'), updated_at = NOW()
       WHERE id = ?`,
      [status, tracking_number, delivery_date, received_by, notes || '', id]
    );

    // If status is 'Delivered', update requisition status to 'Completed'
    if (status === 'Delivered') {
      await connection.execute(
        'UPDATE requisitions SET status = ?, updated_at = NOW() WHERE id = ?',
        ['Completed', dispatch[0].requisition_id]
      );
    }

    await connection.commit();

    // Get updated dispatch
    const updatedDispatch = await executeQuery(
      `SELECT d.*, f.name as facility_name
       FROM dispatches d
       LEFT JOIN facilities f ON d.facility_id = f.id
       WHERE d.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Dispatch status updated successfully',
      data: updatedDispatch[0]
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Get dispatch statistics
// @route   GET /api/dispatches/stats
// @access  Private
const getDispatchStats = asyncHandler(async (req, res) => {
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
      COUNT(*) as total_dispatches,
      SUM(CASE WHEN status = 'Processing' THEN 1 ELSE 0 END) as processing,
      SUM(CASE WHEN status = 'Dispatched' THEN 1 ELSE 0 END) as dispatched,
      SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) as in_transit,
      SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled
    FROM dispatches ${facilityFilter}
  `, queryParams);

  res.json({
    success: true,
    data: stats[0]
  });
});

module.exports = {
  getDispatches,
  getDispatch,
  createDispatch,
  updateDispatchStatus,
  getDispatchStats
};