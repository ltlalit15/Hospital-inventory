const express = require('express');
const router = express.Router();
const {
  getFacilities,
  getFacility,
  createFacility,
  updateFacility,
  deleteFacility
} = require('../controllers/facilityController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { validate, facilitySchemas } = require('../middleware/validation');

// Apply authentication to all routes
router.use(verifyToken);

// Routes accessible to all authenticated users
router.get('/', getFacilities);
router.get('/:id', getFacility);

// Super Admin only routes
router.post('/',
  checkRole(['Super Admin']),
  validate(facilitySchemas.create),
  createFacility
);

router.put('/:id',
  checkRole(['Super Admin']),
  updateFacility
);

router.delete('/:id',
  checkRole(['Super Admin']),
  deleteFacility
);

module.exports = router;