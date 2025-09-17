const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  addMaintenanceRecord,
  addMovementRecord
} = require('../controllers/assetController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, assetSchemas } = require('../middleware/validation');
const { upload } = require('../config/cloudinary');

// Apply authentication to all routes
router.use(verifyToken);

// Routes accessible to all authenticated users (except Facility User for some)
router.get('/', getAssets);
router.get('/:id', getAsset);

// Admin only routes
router.post('/',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  upload.single('attachment'),
  validate(assetSchemas.create),
  createAsset
);

router.put('/:id',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  updateAsset
);

router.post('/:id/maintenance',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  upload.single('attachment'),
  validate(assetSchemas.maintenance),
  addMaintenanceRecord
);

router.post('/:id/movement',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  addMovementRecord
);

module.exports = router;