# Hospital Inventory Management System - Software Flow Documentation

## System Overview

The Hospital Inventory Management System is a comprehensive solution designed to manage medical inventory, assets, requisitions, and dispatches across multiple hospital facilities. The system supports role-based access control with four distinct user types.

## User Roles and Access Levels

### 1. Super Admin
**Responsibilities:**
- Complete system oversight and management
- Global inventory and asset management
- User and facility management
- System configuration and settings
- All reports and analytics access

**Key Features:**
- Dashboard with system-wide statistics
- Global inventory management with cost tracking
- Requisition approval/rejection workflow
- Dispatch creation and tracking
- Comprehensive reporting suite
- Asset management across all facilities
- Facility management (CRUD operations)
- User management with role assignment
- System settings and configuration

### 2. Warehouse Admin
**Responsibilities:**
- Warehouse operations management
- Inventory stock management
- Dispatch processing
- Requisition fulfillment

**Key Features:**
- Warehouse-focused dashboard
- Inventory management with batch tracking
- Stock movement recording (IN/OUT/ADJUSTMENT)
- Requisition review and approval
- Dispatch creation and management
- Returns and recalls processing
- Warehouse-specific reporting
- Asset tracking within warehouse

### 3. Facility Admin
**Responsibilities:**
- Facility-level operations management
- Local inventory oversight
- User management within facility
- Departmental coordination

**Key Features:**
- Facility dashboard with local statistics
- Facility inventory management
- Requisition creation and tracking
- Asset management for facility
- Goods receipt acknowledgment
- Department and category management
- Facility user management
- Local reporting and analytics

### 4. Facility User
**Responsibilities:**
- Basic inventory operations
- Requisition creation
- Personal request tracking

**Key Features:**
- Personal dashboard
- View facility inventory
- Create requisitions
- Track personal requests
- Acknowledge receipt of goods
- View notifications
- Limited reporting access

## Core System Workflows

### 1. Inventory Management Flow

```
Stock Receipt → Inventory Update → Stock Movement Record → Automatic Reorder (if enabled)
```

**Process:**
1. **Stock Receipt**: Items received from suppliers
2. **Inventory Update**: Current stock levels updated
3. **Movement Recording**: All transactions logged with batch/expiry tracking
4. **Alert Generation**: Low stock and expiry alerts generated
5. **Reporting**: Real-time inventory reports available

### 2. Requisition Workflow

```
Request Creation → Admin Review → Approval/Rejection → Dispatch → Delivery → Receipt Confirmation
```

**Detailed Process:**

#### Step 1: Request Creation (Facility User/Admin)
- User identifies need for inventory items
- Creates requisition with:
  - Item details and quantities
  - Duration requirement
  - Justification notes
  - Priority level

#### Step 2: Admin Review (Facility Admin/Warehouse Admin)
- Review requisition details
- Check inventory availability
- Verify budget constraints
- Make approval decision

#### Step 3: Approval/Rejection
- **If Approved**: Move to dispatch queue
- **If Partially Approved**: Specify approved quantities
- **If Rejected**: Provide rejection reason

#### Step 4: Dispatch Creation (Warehouse Admin)
- Create dispatch from approved requisitions
- Generate tracking number
- Update inventory stock levels
- Create dispatch documentation (Pick List, Packing List, GDN)

#### Step 5: Delivery Tracking
- Track dispatch status (Processing → Dispatched → In Transit → Delivered)
- Update delivery information
- Send notifications to facility

#### Step 6: Receipt Confirmation (Facility User)
- Acknowledge receipt of items
- Report any discrepancies
- Update facility inventory
- Complete requisition cycle

### 3. Asset Management Flow

```
Asset Registration → Location Tracking → Maintenance Scheduling → Movement Logging → Lifecycle Management
```

**Process:**
1. **Asset Registration**: New assets added to system
2. **Location Assignment**: Assets assigned to departments/locations
3. **Maintenance Scheduling**: Preventive and corrective maintenance
4. **Movement Tracking**: Location changes logged
5. **Condition Monitoring**: Asset condition tracked over time
6. **Lifecycle Management**: From acquisition to retirement

### 4. Dispatch Management Flow

```
Requisition Approval → Dispatch Creation → Stock Allocation → Documentation → Shipment → Delivery → Confirmation
```

**Detailed Process:**

#### Step 1: Dispatch Creation
- Based on approved requisitions
- Stock availability verification
- Batch number assignment
- Tracking number generation

#### Step 2: Documentation Generation
- **Pick List**: Items to be collected from warehouse
- **Packing List**: Items packed for shipment
- **Goods Dispatch Note (GDN)**: Official dispatch document

#### Step 3: Stock Updates
- Reduce warehouse inventory
- Record stock movements
- Update batch tracking

#### Step 4: Shipment Tracking
- Real-time status updates
- Estimated delivery dates
- Current location tracking

#### Step 5: Delivery Confirmation
- Facility confirms receipt
- Update dispatch status
- Complete transaction cycle

## Data Flow Architecture

### 1. Authentication Flow
```
Login Request → Credential Validation → JWT Token Generation → Role-Based Access Control
```

### 2. Inventory Data Flow
```
Stock Transaction → Database Update → Movement Log → Alert Check → Report Update
```

### 3. Requisition Data Flow
```
User Request → Validation → Admin Queue → Approval Process → Dispatch Queue → Fulfillment
```

### 4. Asset Data Flow
```
Asset Creation → Location Assignment → Maintenance Tracking → Movement History → Status Updates
```

## Integration Points

### 1. Cloudinary Integration
- **Purpose**: File and image storage
- **Usage**: Asset photos, maintenance receipts, user avatars
- **Configuration**: Automatic upload with organized folder structure
- **Features**: Image optimization, secure URLs, backup storage

### 2. MySQL Database Integration
- **Purpose**: Primary data storage
- **Features**: ACID compliance, referential integrity, indexing
- **Backup**: Regular automated backups
- **Performance**: Optimized queries with proper indexing

### 3. Email Notifications (Future Enhancement)
- Requisition status updates
- Low stock alerts
- Expiry warnings
- Dispatch notifications

## Security Implementation

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session management

### 2. Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

### 3. API Security
- Rate limiting
- Helmet.js security headers
- Request size limits
- Error handling without data exposure

## Reporting and Analytics

### 1. Dashboard Analytics
- Real-time inventory statistics
- Requisition status tracking
- Asset utilization metrics
- Financial summaries

### 2. Operational Reports
- **Inventory Reports**: Stock levels, valuations, movements
- **Consumption Reports**: Usage patterns, trends
- **Expiry Reports**: Items nearing expiration
- **Asset Reports**: Maintenance schedules, movements

### 3. Financial Reports
- Stock valuation (FIFO/Moving Average)
- Cost analysis by category
- Budget tracking
- ROI calculations

## System Scalability

### 1. Database Optimization
- Proper indexing strategy
- Query optimization
- Connection pooling
- Transaction management

### 2. API Performance
- Response caching
- Pagination implementation
- Compression middleware
- Rate limiting

### 3. File Management
- Cloud storage integration
- Automatic image optimization
- CDN delivery
- Backup redundancy

## Monitoring and Maintenance

### 1. System Monitoring
- Health check endpoints
- Error logging
- Performance metrics
- Uptime monitoring

### 2. Data Backup
- Regular database backups
- File storage redundancy
- Disaster recovery procedures
- Data retention policies

### 3. System Updates
- Version control
- Deployment procedures
- Testing protocols
- Rollback capabilities

## Future Enhancements

### 1. Mobile Application
- React Native mobile app
- Offline capability
- Barcode scanning
- Push notifications

### 2. Advanced Analytics
- Machine learning predictions
- Demand forecasting
- Optimization algorithms
- Business intelligence dashboards

### 3. Integration Capabilities
- ERP system integration
- Supplier API connections
- Government reporting systems
- Third-party logistics providers

## Conclusion

This Hospital Inventory Management System provides a robust, scalable solution for healthcare inventory management with comprehensive tracking, reporting, and management capabilities across multiple facilities and user roles.