const express = require('express');
const router = express.Router();
const {
  getRequisitions,
  getRequisition,
  createRequisition,
  updateRequisitionStatus,
  getRequisitionStats
} = require('../controllers/requisitionController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, requisitionSchemas } = require('../middleware/validation');

// Apply authentication to all routes
router.use(verifyToken);

// Routes accessible to all authenticated users
router.get('/', getRequisitions);
router.get('/stats', getRequisitionStats);
router.get('/:id', getRequisition);

// Create requisition (all users can create)
router.post('/',
  validate(requisitionSchemas.create),
  createRequisition
);

// Update requisition status (Admin only)
router.put('/:id/status',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  validate(requisitionSchemas.updateStatus),
  updateRequisitionStatus
);

module.exports = router;