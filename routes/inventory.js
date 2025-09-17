const express = require('express');
const router = express.Router();
const {
  getInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  updateStock,
  getStockMovements,
  deleteInventoryItem,
  getInventoryStats
} = require('../controllers/inventoryController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, inventorySchemas } = require('../middleware/validation');

// Apply authentication to all routes
router.use(verifyToken);

// Public inventory routes (all authenticated users)
router.get('/', getInventoryItems);
router.get('/stats', getInventoryStats);
router.get('/:id', getInventoryItem);
router.get('/:id/movements', getStockMovements);

// Admin only routes
router.post('/', 
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  validate(inventorySchemas.createItem),
  createInventoryItem
);

router.put('/:id',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  updateInventoryItem
);

router.post('/:id/stock',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  validate(inventorySchemas.updateStock),
  updateStock
);

router.delete('/:id',
  checkRole(['Super Admin', 'Warehouse Admin']),
  deleteInventoryItem
);

module.exports = router;