# Hospital Inventory Management System API Documentation

## Overview
This API provides comprehensive endpoints for managing hospital inventory, requisitions, assets, facilities, dispatches, and user management.

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles & Permissions

### Super Admin
- Full system access
- Can manage all facilities, users, inventory, and assets
- Can view all reports and analytics

### Warehouse Admin
- Manages warehouse operations and inventory
- Can create dispatches and manage stock movements
- Can approve/reject requisitions
- Limited facility management

### Facility Admin
- Manages facility-specific operations
- Can manage facility inventory and assets
- Can create and manage requisitions
- Can manage facility users

### Facility User
- Limited access to facility operations
- Can view inventory and create requisitions
- Can view personal request history

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user (Admin only in production)

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "role": "Facility User",
  "facility_id": 2,
  "department": "Pharmacy",
  "phone": "+233 20 123 4567",
  "first_name": "Test",
  "last_name": "User"
}
```

#### POST /auth/login
Authenticate user and get JWT token

**Request Body:**
```json
{
  "username": "superadmin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "superadmin",
      "email": "admin@francisfosu.com",
      "role": "Super Admin",
      "facility_name": "Main Warehouse"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Inventory Management

#### GET /inventory
Get all inventory items with filtering and pagination

**Query Parameters:**
- `facility_id` (optional): Filter by facility
- `category` (optional): Filter by category
- `status` (optional): Filter by stock status (In Stock, Low Stock, Out of Stock)
- `search` (optional): Search by name or item code
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

#### POST /inventory
Create new inventory item (Admin only)

**Request Body:**
```json
{
  "item_code": "DRG-9999",
  "name": "Test Medicine",
  "category": "Pharmaceutical",
  "description": "Test medicine for API testing",
  "unit": "Tablets",
  "standard_cost": 5.00,
  "moving_avg_cost": 5.20,
  "last_po_cost": 4.80,
  "facility_transfer_price": 6.00,
  "abc_class": "B",
  "min_level": 50,
  "max_level": 500
}
```

#### POST /inventory/:id/stock
Update stock quantity

**Request Body:**
```json
{
  "quantity": 100,
  "batch_number": "B2023-NEW",
  "expiry_date": "2025-12-31",
  "transaction_type": "IN",
  "reference_number": "PO-2023-TEST",
  "notes": "Stock replenishment"
}
```

### Requisitions

#### GET /requisitions
Get all requisitions with filtering

**Query Parameters:**
- `status` (optional): Filter by status
- `facility_id` (optional): Filter by facility
- `department` (optional): Filter by department
- `page` (optional): Page number
- `limit` (optional): Items per page

#### POST /requisitions
Create new requisition

**Request Body:**
```json
{
  "facility_id": 2,
  "department": "Emergency",
  "duration": 7,
  "duration_unit": "days",
  "notes": "Urgent requirement for emergency department",
  "items": [
    {
      "inventory_id": 1,
      "requested_quantity": 50,
      "notes": "For pain management"
    },
    {
      "inventory_id": 2,
      "requested_quantity": 100,
      "notes": "For surgical procedures"
    }
  ]
}
```

#### PUT /requisitions/:id/status
Update requisition status (Admin only)

**Request Body:**
```json
{
  "status": "Approved",
  "admin_notes": "All items approved as requested",
  "items": [
    {
      "requisition_item_id": 1,
      "approved_quantity": 50,
      "notes": "Approved full quantity"
    }
  ]
}
```

### Assets Management

#### GET /assets
Get all assets with filtering

#### POST /assets
Create new asset (Admin only)

**Request Body:**
```json
{
  "asset_code": "AST-TEST",
  "name": "Test Equipment",
  "category": "Medical Equipment",
  "description": "Test equipment for API testing",
  "serial_number": "TEST-001",
  "facility_id": 2,
  "department": "ICU",
  "location": "ICU Ward 2",
  "purchase_date": "2023-01-15",
  "purchase_cost": 15000.00,
  "vendor": "Test Vendor",
  "warranty_end_date": "2026-01-15",
  "condition": "Good",
  "status": "Available"
}
```

### Reports

#### GET /reports/dashboard-stats
Get dashboard statistics

#### GET /reports/inventory
Get inventory report

#### GET /reports/consumption
Get consumption report

#### GET /reports/expiry
Get expiry report

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:
- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` endpoints

## File Upload

File uploads are handled through Cloudinary integration:
- Maximum file size: 10MB
- Supported formats: JPEG, PNG, PDF, DOC, DOCX
- Files are automatically uploaded to Cloudinary cloud storage

## Database Schema

The system uses MySQL with the following main tables:
- `facilities` - Hospital facilities and warehouses
- `users` - System users with role-based access
- `inventory` - Inventory items and stock levels
- `stock_movements` - All stock transactions
- `requisitions` - Requests for inventory items
- `requisition_items` - Individual items in requisitions
- `dispatches` - Shipments to facilities
- `dispatch_items` - Items in dispatches
- `assets` - Hospital assets and equipment
- `asset_maintenance` - Maintenance records
- `asset_movements` - Asset location changes