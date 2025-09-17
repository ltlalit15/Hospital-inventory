const express = require('express');
const router = express.Router();
const {
  getInventoryReport,
  getConsumptionReport,
  getExpiryReport,
  getStockMovementReport,
  getDashboardStats
} = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Apply authentication to all routes
router.use(verifyToken);

// Dashboard stats (all users)
router.get('/dashboard-stats', getDashboardStats);

// Report routes (Admin access required)
router.get('/inventory',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getInventoryReport
);

router.get('/consumption',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getConsumptionReport
);

router.get('/expiry',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getExpiryReport
);

router.get('/stock-movements',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getStockMovementReport
);

module.exports = router;