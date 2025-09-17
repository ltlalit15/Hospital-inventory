const { executeQuery, getConnection } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
const getInventoryItems = asyncHandler(async (req, res) => {
  const { facility_id, category, status, search, page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  let query = `
    SELECT i.*, f.name as facility_name,
           CASE 
             WHEN i.current_stock = 0 THEN 'Out of Stock'
             WHEN i.current_stock < i.min_level THEN 'Low Stock'
             ELSE 'In Stock'
           END as stock_status
    FROM inventory i
    LEFT JOIN facilities f ON i.facility_id = f.id
    WHERE 1=1
  `;
  
  const queryParams = [];

  // Apply filters
  if (facility_id) {
    query += ' AND i.facility_id = ?';
    queryParams.push(facility_id);
  }

  if (category) {
    query += ' AND i.category = ?';
    queryParams.push(category);
  }

  if (search) {
    query += ' AND (i.name LIKE ? OR i.item_code LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  if (status) {
    if (status === 'Low Stock') {
      query += ' AND i.current_stock < i.min_level AND i.current_stock > 0';
    } else if (status === 'Out of Stock') {
      query += ' AND i.current_stock = 0';
    } else if (status === 'In Stock') {
      query += ' AND i.current_stock >= i.min_level';
    }
  }

  // Add ordering and pagination
  query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(parseInt(limit), parseInt(offset));

  const items = await executeQuery(query, queryParams);

  // Get total count for pagination
  let countQuery = `
    SELECT COUNT(*) as total
    FROM inventory i
    WHERE 1=1
  `;
  
  const countParams = queryParams.slice(0, -2); // Remove limit and offset
  
  if (facility_id) countQuery += ' AND i.facility_id = ?';
  if (category) countQuery += ' AND i.category = ?';
  if (search) countQuery += ' AND (i.name LIKE ? OR i.item_code LIKE ?)';
  if (status) {
    if (status === 'Low Stock') {
      countQuery += ' AND i.current_stock < i.min_level AND i.current_stock > 0';
    } else if (status === 'Out of Stock') {
      countQuery += ' AND i.current_stock = 0';
    } else if (status === 'In Stock') {
      countQuery += ' AND i.current_stock >= i.min_level';
    }
  }

  const totalResult = await executeQuery(countQuery, countParams);
  const total = totalResult[0].total;

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
const getInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await executeQuery(
    `SELECT i.*, f.name as facility_name,
            CASE 
              WHEN i.current_stock = 0 THEN 'Out of Stock'
              WHEN i.current_stock < i.min_level THEN 'Low Stock'
              ELSE 'In Stock'
            END as stock_status
     FROM inventory i
     LEFT JOIN facilities f ON i.facility_id = f.id
     WHERE i.id = ?`,
    [id]
  );

  if (item.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Inventory item not found'
    });
  }

  // Get stock movement history
  const movements = await executeQuery(
    `SELECT * FROM stock_movements 
     WHERE inventory_id = ? 
     ORDER BY created_at DESC 
     LIMIT 10`,
    [id]
  );

  res.json({
    success: true,
    data: {
      item: item[0],
      recent_movements: movements
    }
  });
});

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private (Admin only)
const createInventoryItem = asyncHandler(async (req, res) => {
  const {
    item_code, name, category, description, unit, standard_cost,
    moving_avg_cost, last_po_cost, facility_transfer_price, abc_class,
    min_level, max_level
  } = req.body;

  // Check if item code already exists
  const existingItem = await executeQuery(
    'SELECT id FROM inventory WHERE item_code = ?',
    [item_code]
  );

  if (existingItem.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Item code already exists'
    });
  }

  // Determine facility_id based on user role
  let facility_id = req.user.facility_id;
  if (req.user.role === 'Super Admin' && req.body.facility_id) {
    facility_id = req.body.facility_id;
  }

  const result = await executeQuery(
    `INSERT INTO inventory (
      item_code, name, category, description, unit, current_stock, standard_cost,
      moving_avg_cost, last_po_cost, facility_transfer_price, abc_class,
      min_level, max_level, facility_id, created_by, created_at
    ) VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      item_code, name, category, description, unit, standard_cost,
      moving_avg_cost, last_po_cost, facility_transfer_price, abc_class,
      min_level, max_level, facility_id, req.user.id
    ]
  );

  // Get created item
  const newItem = await executeQuery(
    `SELECT i.*, f.name as facility_name
     FROM inventory i
     LEFT JOIN facilities f ON i.facility_id = f.id
     WHERE i.id = ?`,
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    message: 'Inventory item created successfully',
    data: newItem[0]
  });
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin only)
const updateInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if item exists
  const existingItem = await executeQuery(
    'SELECT * FROM inventory WHERE id = ?',
    [id]
  );

  if (existingItem.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Inventory item not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && existingItem[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only update items in your facility.'
    });
  }

  // Build update query dynamically
  const updateFields = [];
  const updateValues = [];

  const allowedFields = [
    'name', 'category', 'description', 'unit', 'standard_cost',
    'moving_avg_cost', 'last_po_cost', 'facility_transfer_price',
    'abc_class', 'min_level', 'max_level'
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
    `UPDATE inventory SET ${updateFields.join(', ')} WHERE id = ?`,
    updateValues
  );

  // Get updated item
  const updatedItem = await executeQuery(
    `SELECT i.*, f.name as facility_name
     FROM inventory i
     LEFT JOIN facilities f ON i.facility_id = f.id
     WHERE i.id = ?`,
    [id]
  );

  res.json({
    success: true,
    message: 'Inventory item updated successfully',
    data: updatedItem[0]
  });
});

// @desc    Update stock quantity
// @route   POST /api/inventory/:id/stock
// @access  Private
const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, batch_number, expiry_date, transaction_type, reference_number, notes } = req.body;

  const connection = await getConnection();
  
  try {
    await connection.beginTransaction();

    // Get current item
    const [item] = await connection.execute(
      'SELECT * FROM inventory WHERE id = ?',
      [id]
    );

    if (item.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Check facility access
    if (req.user.role !== 'Super Admin' && item[0].facility_id !== req.user.facility_id) {
      await connection.rollback();
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update stock in your facility.'
      });
    }

    let newStock = item[0].current_stock;

    // Calculate new stock based on transaction type
    switch (transaction_type) {
      case 'IN':
        newStock += quantity;
        break;
      case 'OUT':
        newStock = Math.max(0, newStock - quantity);
        break;
      case 'ADJUSTMENT':
        newStock = quantity;
        break;
      default:
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid transaction type'
        });
    }

    // Update inventory stock
    await connection.execute(
      'UPDATE inventory SET current_stock = ?, updated_at = NOW() WHERE id = ?',
      [newStock, id]
    );

    // Record stock movement
    await connection.execute(
      `INSERT INTO stock_movements (
        inventory_id, transaction_type, quantity, batch_number, expiry_date,
        reference_number, notes, created_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [id, transaction_type, quantity, batch_number, expiry_date, reference_number, notes, req.user.id]
    );

    await connection.commit();

    // Get updated item
    const updatedItem = await executeQuery(
      `SELECT i.*, f.name as facility_name,
              CASE 
                WHEN i.current_stock = 0 THEN 'Out of Stock'
                WHEN i.current_stock < i.min_level THEN 'Low Stock'
                ELSE 'In Stock'
              END as stock_status
       FROM inventory i
       LEFT JOIN facilities f ON i.facility_id = f.id
       WHERE i.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedItem[0]
    });

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

// @desc    Get stock movements
// @route   GET /api/inventory/:id/movements
// @access  Private
const getStockMovements = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const movements = await executeQuery(
    `SELECT sm.*, u.username as created_by_name
     FROM stock_movements sm
     LEFT JOIN users u ON sm.created_by = u.id
     WHERE sm.inventory_id = ?
     ORDER BY sm.created_at DESC
     LIMIT ? OFFSET ?`,
    [id, parseInt(limit), parseInt(offset)]
  );

  const totalResult = await executeQuery(
    'SELECT COUNT(*) as total FROM stock_movements WHERE inventory_id = ?',
    [id]
  );

  res.json({
    success: true,
    data: {
      movements,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(totalResult[0].total / limit),
        total_items: totalResult[0].total,
        items_per_page: parseInt(limit)
      }
    }
  });
});

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private (Admin only)
const deleteInventoryItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if item exists
  const item = await executeQuery(
    'SELECT * FROM inventory WHERE id = ?',
    [id]
  );

  if (item.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Inventory item not found'
    });
  }

  // Check facility access
  if (req.user.role !== 'Super Admin' && item[0].facility_id !== req.user.facility_id) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only delete items in your facility.'
    });
  }

  // Check if item has stock movements
  const movements = await executeQuery(
    'SELECT COUNT(*) as count FROM stock_movements WHERE inventory_id = ?',
    [id]
  );

  if (movements[0].count > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete item with existing stock movements. Consider marking as inactive instead.'
    });
  }

  await executeQuery('DELETE FROM inventory WHERE id = ?', [id]);

  res.json({
    success: true,
    message: 'Inventory item deleted successfully'
  });
});

// @desc    Get inventory statistics
// @route   GET /api/inventory/stats
// @access  Private
const getInventoryStats = asyncHandler(async (req, res) => {
  const { facility_id } = req.query;

  let facilityFilter = '';
  const queryParams = [];

  if (facility_id) {
    facilityFilter = 'WHERE facility_id = ?';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin') {
    facilityFilter = 'WHERE facility_id = ?';
    queryParams.push(req.user.facility_id);
  }

  const stats = await executeQuery(`
    SELECT 
      COUNT(*) as total_items,
      SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock,
      SUM(CASE WHEN current_stock < min_level AND current_stock > 0 THEN 1 ELSE 0 END) as low_stock,
      SUM(CASE WHEN current_stock >= min_level THEN 1 ELSE 0 END) as in_stock,
      SUM(current_stock * COALESCE(standard_cost, 0)) as total_value
    FROM inventory ${facilityFilter}
  `, queryParams);

  // Get category breakdown
  const categoryStats = await executeQuery(`
    SELECT 
      category,
      COUNT(*) as item_count,
      SUM(current_stock) as total_stock,
      SUM(current_stock * COALESCE(standard_cost, 0)) as category_value
    FROM inventory ${facilityFilter}
    GROUP BY category
    ORDER BY category_value DESC
  `, queryParams);

  res.json({
    success: true,
    data: {
      overview: stats[0],
      by_category: categoryStats
    }
  });
});

module.exports = {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  updateStock,
  getStockMovements,
  deleteInventoryItem,
  getInventoryStats
};