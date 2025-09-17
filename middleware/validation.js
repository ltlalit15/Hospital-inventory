const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Super Admin', 'Warehouse Admin', 'Facility Admin', 'Facility User').required(),
    facility_id: Joi.number().integer().positive().required(),
    department: Joi.string().max(100).required(),
    phone: Joi.string().max(20).optional(),
    first_name: Joi.string().max(50).optional(),
    last_name: Joi.string().max(50).optional()
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    username: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().max(20).optional(),
    first_name: Joi.string().max(50).optional(),
    last_name: Joi.string().max(50).optional(),
    department: Joi.string().max(100).optional()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })
};

// Inventory validation schemas
const inventorySchemas = {
  createItem: Joi.object({
    item_code: Joi.string().max(50).required(),
    name: Joi.string().max(200).required(),
    category: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    unit: Joi.string().max(20).required(),
    standard_cost: Joi.number().precision(2).min(0).optional(),
    moving_avg_cost: Joi.number().precision(2).min(0).optional(),
    last_po_cost: Joi.number().precision(2).min(0).optional(),
    facility_transfer_price: Joi.number().precision(2).min(0).optional(),
    abc_class: Joi.string().valid('A', 'B', 'C').optional(),
    min_level: Joi.number().integer().min(0).optional(),
    max_level: Joi.number().integer().min(0).optional()
  }),

  updateStock: Joi.object({
    quantity: Joi.number().integer().required(),
    batch_number: Joi.string().max(50).optional(),
    expiry_date: Joi.date().optional(),
    transaction_type: Joi.string().valid('IN', 'OUT', 'ADJUSTMENT').required(),
    reference_number: Joi.string().max(100).optional(),
    notes: Joi.string().optional()
  })
};

// Requisition validation schemas
const requisitionSchemas = {
  create: Joi.object({
    facility_id: Joi.number().integer().positive().required(),
    department: Joi.string().max(100).required(),
    duration: Joi.number().integer().positive().optional(),
    duration_unit: Joi.string().valid('days', 'weeks', 'months').optional(),
    notes: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        inventory_id: Joi.number().integer().positive().required(),
        requested_quantity: Joi.number().integer().positive().required(),
        notes: Joi.string().optional()
      })
    ).min(1).required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('Pending', 'Approved', 'Partially Approved', 'Rejected', 'Dispatched', 'Completed').required(),
    admin_notes: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        requisition_item_id: Joi.number().integer().positive().required(),
        approved_quantity: Joi.number().integer().min(0).required(),
        notes: Joi.string().optional()
      })
    ).optional()
  })
};

// Asset validation schemas
const assetSchemas = {
  create: Joi.object({
    asset_code: Joi.string().max(50).required(),
    name: Joi.string().max(200).required(),
    category: Joi.string().max(100).required(),
    description: Joi.string().optional(),
    serial_number: Joi.string().max(100).optional(),
    facility_id: Joi.number().integer().positive().required(),
    department: Joi.string().max(100).required(),
    location: Joi.string().max(200).optional(),
    purchase_date: Joi.date().optional(),
    purchase_cost: Joi.number().precision(2).min(0).optional(),
    vendor: Joi.string().max(200).optional(),
    warranty_end_date: Joi.date().optional(),
    condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair').required(),
    status: Joi.string().valid('Available', 'In Use', 'Under Maintenance', 'Retired').required()
  }),

  maintenance: Joi.object({
    maintenance_date: Joi.date().required(),
    maintenance_type: Joi.string().valid('Routine', 'Preventive', 'Corrective', 'Emergency').required(),
    description: Joi.string().required(),
    technician: Joi.string().max(100).required(),
    cost: Joi.number().precision(2).min(0).optional(),
    estimated_duration: Joi.number().integer().min(1).optional(),
    notes: Joi.string().optional()
  })
};

// Facility validation schemas
const facilitySchemas = {
  create: Joi.object({
    name: Joi.string().max(200).required(),
    type: Joi.string().max(100).required(),
    address: Joi.string().max(500).optional(),
    phone: Joi.string().max(20).optional(),
    email: Joi.string().email().optional(),
    description: Joi.string().optional(),
    capacity: Joi.string().max(100).optional(),
    services: Joi.string().optional()
  })
};

// Dispatch validation schemas
const dispatchSchemas = {
  create: Joi.object({
    requisition_id: Joi.number().integer().positive().required(),
    facility_id: Joi.number().integer().positive().required(),
    estimated_delivery_date: Joi.date().optional(),
    notes: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        inventory_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        batch_number: Joi.string().max(50).optional()
      })
    ).min(1).required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('Processing', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled').required(),
    tracking_number: Joi.string().max(100).optional(),
    delivery_date: Joi.date().optional(),
    received_by: Joi.string().max(100).optional(),
    notes: Joi.string().optional()
  })
};

module.exports = {
  validate,
  userSchemas,
  inventorySchemas,
  requisitionSchemas,
  assetSchemas,
  facilitySchemas,
  dispatchSchemas
};