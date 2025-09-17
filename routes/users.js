const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  resetUserPassword,
  toggleUserStatus,
  deleteUser
} = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Apply authentication to all routes
router.use(verifyToken);

// Routes accessible to admins
router.get('/',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getUsers
);

router.get('/:id',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  getUser
);

router.put('/:id',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  updateUser
);

router.put('/:id/reset-password',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  resetUserPassword
);

router.put('/:id/toggle-status',
  checkRole(['Super Admin', 'Warehouse Admin', 'Facility Admin']),
  toggleUserStatus
);

// Super Admin only routes
router.delete('/:id',
  checkRole(['Super Admin']),
  deleteUser
);

module.exports = router;