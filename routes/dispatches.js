const express = require('express');
const router = express.Router();
const {
  getDispatches,
  getDispatch,
  createDispatch,
  updateDispatchStatus,
  getDispatchStats
} = require('../controllers/dispatchController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, dispatchSchemas } = require('../middleware/validation');

// Apply authentication to all routes
router.use(verifyToken);

// Routes accessible to all authenticated users
router.get('/', getDispatches);
router.get('/stats', getDispatchStats);
router.get('/:id', getDispatch);

// Warehouse Admin only routes
router.post('/',
  checkRole(['Super Admin', 'Warehouse Admin']),
  validate(dispatchSchemas.create),
  createDispatch
);

// Update dispatch status (Warehouse Admin and Facility users for delivery confirmation)
router.put('/:id/status',
  validate(dispatchSchemas.updateStatus),
  updateDispatchStatus
);

module.exports = router;