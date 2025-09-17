const { executeQuery } = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get inventory report
// @route   GET /api/reports/inventory
// @access  Private
const getInventoryReport = asyncHandler(async (req, res) => {
  const { facility_id, category, date_from, date_to, format = 'json' } = req.query;

  let facilityFilter = '';
  const queryParams = [];

  if (facility_id) {
    facilityFilter = 'WHERE i.facility_id = ?';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin') {
    facilityFilter = 'WHERE i.facility_id = ?';
    queryParams.push(req.user.facility_id);
  }

  let categoryFilter = '';
  if (category) {
    categoryFilter = facilityFilter ? ' AND i.category = ?' : 'WHERE i.category = ?';
    queryParams.push(category);
  }

  const inventoryReport = await executeQuery(`
    SELECT 
      i.item_code,
      i.name,
      i.category,
      i.current_stock,
      i.unit,
      i.min_level,
      i.max_level,
      i.standard_cost,
      i.moving_avg_cost,
      i.last_po_cost,
      i.facility_transfer_price,
      i.abc_class,
      (i.current_stock * COALESCE(i.standard_cost, 0)) as total_value,
      f.name as facility_name,
      CASE 
        WHEN i.current_stock = 0 THEN 'Out of Stock'
        WHEN i.current_stock < i.min_level THEN 'Low Stock'
        ELSE 'In Stock'
      END as stock_status
    FROM inventory i
    LEFT JOIN facilities f ON i.facility_id = f.id
    ${facilityFilter}${categoryFilter}
    ORDER BY i.name
  `, queryParams);

  // Calculate summary
  const summary = {
    total_items: inventoryReport.length,
    total_value: inventoryReport.reduce((sum, item) => sum + (item.total_value || 0), 0),
    out_of_stock: inventoryReport.filter(item => item.stock_status === 'Out of Stock').length,
    low_stock: inventoryReport.filter(item => item.stock_status === 'Low Stock').length,
    in_stock: inventoryReport.filter(item => item.stock_status === 'In Stock').length
  };

  res.json({
    success: true,
    data: {
      report: inventoryReport,
      summary,
      generated_at: new Date().toISOString(),
      filters: { facility_id, category, date_from, date_to }
    }
  });
});

// @desc    Get consumption report
// @route   GET /api/reports/consumption
// @access  Private
const getConsumptionReport = asyncHandler(async (req, res) => {
  const { facility_id, date_from, date_to, period = 'monthly' } = req.query;

  let facilityFilter = '';
  const queryParams = [];

  if (facility_id) {
    facilityFilter = 'AND sm.inventory_id IN (SELECT id FROM inventory WHERE facility_id = ?)';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin') {
    facilityFilter = 'AND sm.inventory_id IN (SELECT id FROM inventory WHERE facility_id = ?)';
    queryParams.push(req.user.facility_id);
  }

  let dateFilter = '';
  if (date_from && date_to) {
    dateFilter = 'AND sm.created_at BETWEEN ? AND ?';
    queryParams.push(date_from, date_to);
  }

  // Determine date grouping based on period
  let dateGrouping = '';
  switch (period) {
    case 'daily':
      dateGrouping = 'DATE(sm.created_at)';
      break;
    case 'weekly':
      dateGrouping = 'YEARWEEK(sm.created_at)';
      break;
    case 'monthly':
      dateGrouping = 'DATE_FORMAT(sm.created_at, "%Y-%m")';
      break;
    case 'yearly':
      dateGrouping = 'YEAR(sm.created_at)';
      break;
    default:
      dateGrouping = 'DATE_FORMAT(sm.created_at, "%Y-%m")';
  }

  const consumptionReport = await executeQuery(`
    SELECT 
      ${dateGrouping} as period,
      i.category,
      SUM(CASE WHEN sm.transaction_type = 'OUT' THEN sm.quantity ELSE 0 END) as consumed_quantity,
      SUM(CASE WHEN sm.transaction_type = 'IN' THEN sm.quantity ELSE 0 END) as received_quantity,
      COUNT(DISTINCT sm.inventory_id) as unique_items
    FROM stock_movements sm
    LEFT JOIN inventory i ON sm.inventory_id = i.id
    WHERE sm.transaction_type IN ('IN', 'OUT') ${facilityFilter} ${dateFilter}
    GROUP BY ${dateGrouping}, i.category
    ORDER BY period DESC, i.category
  `, queryParams);

  res.json({
    success: true,
    data: {
      report: consumptionReport,
      generated_at: new Date().toISOString(),
      filters: { facility_id, date_from, date_to, period }
    }
  });
});

// @desc    Get expiry report
// @route   GET /api/reports/expiry
// @access  Private
const getExpiryReport = asyncHandler(async (req, res) => {
  const { facility_id, days_ahead = 90 } = req.query;

  let facilityFilter = '';
  const queryParams = [days_ahead];

  if (facility_id) {
    facilityFilter = 'AND i.facility_id = ?';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin') {
    facilityFilter = 'AND i.facility_id = ?';
    queryParams.push(req.user.facility_id);
  }

  const expiryReport = await executeQuery(`
    SELECT 
      sm.batch_number,
      sm.expiry_date,
      i.item_code,
      i.name,
      i.category,
      i.unit,
      SUM(CASE WHEN sm.transaction_type = 'IN' THEN sm.quantity 
               WHEN sm.transaction_type = 'OUT' THEN -sm.quantity 
               ELSE 0 END) as remaining_quantity,
      DATEDIFF(sm.expiry_date, CURDATE()) as days_to_expiry,
      f.name as facility_name,
      CASE 
        WHEN DATEDIFF(sm.expiry_date, CURDATE()) < 0 THEN 'Expired'
        WHEN DATEDIFF(sm.expiry_date, CURDATE()) <= 30 THEN 'Critical'
        WHEN DATEDIFF(sm.expiry_date, CURDATE()) <= 60 THEN 'Warning'
        ELSE 'Normal'
      END as expiry_status
    FROM stock_movements sm
    LEFT JOIN inventory i ON sm.inventory_id = i.id
    LEFT JOIN facilities f ON i.facility_id = f.id
    WHERE sm.expiry_date IS NOT NULL 
      AND DATEDIFF(sm.expiry_date, CURDATE()) <= ?
      ${facilityFilter}
    GROUP BY sm.batch_number, sm.expiry_date, i.id
    HAVING remaining_quantity > 0
    ORDER BY sm.expiry_date ASC
  `, queryParams);

  // Calculate summary
  const summary = {
    total_batches: expiryReport.length,
    expired: expiryReport.filter(item => item.expiry_status === 'Expired').length,
    critical: expiryReport.filter(item => item.expiry_status === 'Critical').length,
    warning: expiryReport.filter(item => item.expiry_status === 'Warning').length,
    total_value_at_risk: expiryReport.reduce((sum, item) => {
      return sum + (item.remaining_quantity * (item.standard_cost || 0));
    }, 0)
  };

  res.json({
    success: true,
    data: {
      report: expiryReport,
      summary,
      generated_at: new Date().toISOString(),
      filters: { facility_id, days_ahead }
    }
  });
});

// @desc    Get stock movement report
// @route   GET /api/reports/stock-movements
// @access  Private
const getStockMovementReport = asyncHandler(async (req, res) => {
  const { facility_id, date_from, date_to, transaction_type } = req.query;

  let facilityFilter = '';
  const queryParams = [];

  if (facility_id) {
    facilityFilter = 'AND i.facility_id = ?';
    queryParams.push(facility_id);
  } else if (req.user.role !== 'Super Admin' && req.user.role !== 'Warehouse Admin') {
    facilityFilter = 'AND i.facility_id = ?';
    queryParams.push(req.user.facility_id);
  }

  let dateFilter = '';
  if (date_from && date_to) {
    dateFilter = 'AND sm.created_at BETWEEN ? AND ?';
    queryParams.push(date_from, date_to);
  }

  let typeFilter = '';
  if (transaction_type) {
    typeFilter = 'AND sm.transaction_type = ?';
    queryParams.push(transaction_type);
  }

  const movementReport = await executeQuery(`
    SELECT 
      sm.id,
      sm.created_at,
      sm.transaction_type,
      sm.quantity,
      sm.batch_number,
      sm.expiry_date,
      sm.reference_number,
      sm.notes,
      i.item_code,
      i.name as item_name,
      i.category,
      i.unit,
      f.name as facility_name,
      u.username as created_by_name
    FROM stock_movements sm
    LEFT JOIN inventory i ON sm.inventory_id = i.id
    LEFT JOIN facilities f ON i.facility_id = f.id
    LEFT JOIN users u ON sm.created_by = u.id
    WHERE 1=1 ${facilityFilter} ${dateFilter} ${typeFilter}
    ORDER BY sm.created_at DESC
  `, queryParams);

  res.json({
    success: true,
    data: {
      report: movementReport,
      generated_at: new Date().toISOString(),
      filters: { facility_id, date_from, date_to, transaction_type }
    }
  });
});

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard-stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
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

  // Get inventory stats
  const inventoryStats = await executeQuery(`
    SELECT 
      COUNT(*) as total_items,
      SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock,
      SUM(CASE WHEN current_stock < min_level AND current_stock > 0 THEN 1 ELSE 0 END) as low_stock,
      SUM(current_stock * COALESCE(standard_cost, 0)) as total_inventory_value
    FROM inventory ${facilityFilter}
  `, queryParams);

  // Get requisition stats
  const requisitionStats = await executeQuery(`
    SELECT 
      COUNT(*) as total_requisitions,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending_requisitions,
      SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved_requisitions,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_requisitions
    FROM requisitions ${facilityFilter}
  `, queryParams);

  // Get dispatch stats
  const dispatchStats = await executeQuery(`
    SELECT 
      COUNT(*) as total_dispatches,
      SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) as in_transit,
      SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today_dispatches
    FROM dispatches ${facilityFilter}
  `, queryParams);

  // Get asset stats (if user has access)
  let assetStats = { total_assets: 0, under_maintenance: 0, available: 0 };
  if (req.user.role !== 'Facility User') {
    const assetResult = await executeQuery(`
      SELECT 
        COUNT(*) as total_assets,
        SUM(CASE WHEN status = 'Under Maintenance' THEN 1 ELSE 0 END) as under_maintenance,
        SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) as available
      FROM assets ${facilityFilter}
    `, queryParams);
    assetStats = assetResult[0];
  }

  res.json({
    success: true,
    data: {
      inventory: inventoryStats[0],
      requisitions: requisitionStats[0],
      dispatches: dispatchStats[0],
      assets: assetStats,
      generated_at: new Date().toISOString()
    }
  });
});

module.exports = {
  getInventoryReport,
  getConsumptionReport,
  getExpiryReport,
  getStockMovementReport,
  getDashboardStats
};