# Hospital Inventory Management System API

A comprehensive RESTful API for managing hospital inventory, requisitions, assets, and facilities with role-based access control.

## 🏥 Features

- **Multi-facility Support**: Manage multiple hospitals and warehouses
- **Role-based Access Control**: Super Admin, Warehouse Admin, Facility Admin, Facility User
- **Inventory Management**: Real-time stock tracking with batch and expiry management
- **Requisition System**: Complete workflow from request to delivery
- **Asset Management**: Track medical equipment with maintenance schedules
- **Dispatch Management**: Handle shipments between facilities
- **Comprehensive Reporting**: Analytics and reports for all operations
- **File Upload**: Cloudinary integration for document and image storage
- **Security**: JWT authentication, input validation, rate limiting

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Cloudinary account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hospital-inventory-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database**
```bash
# Create MySQL database
mysql -u root -p < database/schema.sql
```

5. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

## 📊 Database Schema

The system uses MySQL with the following main tables:

- **facilities**: Hospital facilities and warehouses
- **users**: System users with role-based access
- **inventory**: Inventory items and stock levels
- **stock_movements**: All stock transactions
- **requisitions**: Requests for inventory items
- **dispatches**: Shipments to facilities
- **assets**: Hospital assets and equipment

## 🔐 Authentication

### Default Users

The system comes with pre-configured users for testing:

| Username | Password | Role | Access |
|----------|----------|------|---------|
| superadmin | admin123 | Super Admin | Full system access |
| warehouse | warehouse123 | Warehouse Admin | Warehouse operations |
| facility | facility123 | Facility Admin | Facility management |
| user | user123 | Facility User | Basic operations |

### JWT Authentication

All API endpoints (except login/register) require JWT authentication:

```bash
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Inventory Management
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Create inventory item
- `GET /api/inventory/:id` - Get single item
- `PUT /api/inventory/:id` - Update item
- `POST /api/inventory/:id/stock` - Update stock
- `GET /api/inventory/stats` - Get statistics

### Requisitions
- `GET /api/requisitions` - Get requisitions
- `POST /api/requisitions` - Create requisition
- `GET /api/requisitions/:id` - Get single requisition
- `PUT /api/requisitions/:id/status` - Update status
- `GET /api/requisitions/stats` - Get statistics

### Assets
- `GET /api/assets` - Get assets
- `POST /api/assets` - Create asset
- `GET /api/assets/:id` - Get single asset
- `PUT /api/assets/:id` - Update asset
- `POST /api/assets/:id/maintenance` - Add maintenance record
- `POST /api/assets/:id/movement` - Add movement record

### Facilities
- `GET /api/facilities` - Get facilities
- `POST /api/facilities` - Create facility (Super Admin only)
- `GET /api/facilities/:id` - Get single facility
- `PUT /api/facilities/:id` - Update facility
- `DELETE /api/facilities/:id` - Delete facility

### Dispatches
- `GET /api/dispatches` - Get dispatches
- `POST /api/dispatches` - Create dispatch
- `GET /api/dispatches/:id` - Get single dispatch
- `PUT /api/dispatches/:id/status` - Update status
- `GET /api/dispatches/stats` - Get statistics

### User Management
- `GET /api/users` - Get users (Admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/reset-password` - Reset password
- `PUT /api/users/:id/toggle-status` - Toggle user status

### Reports
- `GET /api/reports/dashboard-stats` - Dashboard statistics
- `GET /api/reports/inventory` - Inventory report
- `GET /api/reports/consumption` - Consumption report
- `GET /api/reports/expiry` - Expiry report
- `GET /api/reports/stock-movements` - Stock movement report

## 🧪 Testing

### Using Postman

1. Import the Postman collection: `postman/Hospital_Inventory_API.postman_collection.json`
2. Set the base URL variable: `http://localhost:5000/api`
3. Login to get authentication token
4. Token will be automatically set for subsequent requests

### API Testing Flow

1. **Login** with default credentials
2. **Get inventory items** to see available stock
3. **Create a requisition** for needed items
4. **Approve the requisition** (as admin)
5. **Create a dispatch** for approved requisition
6. **Track dispatch** until delivery
7. **Confirm receipt** at facility

## 📁 Project Structure

```
hospital-inventory-api/
├── config/
│   ├── database.js          # MySQL connection and queries
│   └── cloudinary.js        # Cloudinary configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── inventoryController.js # Inventory management
│   ├── requisitionController.js # Requisition handling
│   ├── assetController.js   # Asset management
│   ├── facilityController.js # Facility operations
│   ├── dispatchController.js # Dispatch management
│   ├── userController.js    # User management
│   └── reportController.js  # Reports and analytics
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling
│   └── validation.js       # Input validation
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── inventory.js       # Inventory routes
│   ├── requisitions.js    # Requisition routes
│   ├── assets.js          # Asset routes
│   ├── facilities.js      # Facility routes
│   ├── dispatches.js      # Dispatch routes
│   ├── users.js           # User routes
│   └── reports.js         # Report routes
├── database/
│   └── schema.sql         # Database schema
├── docs/
│   ├── API_Documentation.md
│   └── Software_Flow_Document.md
├── postman/
│   └── Hospital_Inventory_API.postman_collection.json
├── .env                   # Environment variables
├── .gitignore            # Git ignore rules
├── index.js              # Main application file
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_inventory
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dkqcqrrbp
CLOUDINARY_API_KEY=418838712271323
CLOUDINARY_API_SECRET=p12EKWICdyHWx8LcihuWYqIruWQ

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE hospital_inventory;
```

2. Run the schema file:
```bash
mysql -u root -p hospital_inventory < database/schema.sql
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions by user role
- **Input Validation**: Comprehensive validation using Joi
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Parameterized queries

## 📈 Performance Features

- **Connection Pooling**: Efficient database connections
- **Pagination**: Large dataset handling
- **Indexing**: Optimized database queries
- **Compression**: Response compression
- **Caching**: Strategic caching implementation
- **Error Handling**: Comprehensive error management

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Detailed error information"
}
```

## 📝 Development Guidelines

### Code Standards
- Use async/await for asynchronous operations
- Implement proper error handling
- Follow RESTful API conventions
- Use descriptive variable and function names
- Add comments for complex logic

### Database Guidelines
- Use transactions for multi-table operations
- Implement proper foreign key constraints
- Add indexes for frequently queried columns
- Use prepared statements to prevent SQL injection

### Security Guidelines
- Validate all input data
- Implement proper authentication checks
- Use HTTPS in production
- Regular security audits
- Keep dependencies updated

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**
```bash
NODE_ENV=production
```

2. **Database Configuration**
- Use production MySQL instance
- Enable SSL connections
- Set up regular backups

3. **Security Configuration**
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up monitoring

4. **Performance Optimization**
- Enable compression
- Configure caching
- Set up load balancing
- Monitor performance metrics

## 📞 Support

For technical support or questions:
- Email: support@francisfosu.com
- Documentation: See `/docs` folder
- API Testing: Use provided Postman collection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📋 Changelog

### Version 1.0.0
- Initial release
- Complete API implementation
- Role-based access control
- Cloudinary integration
- Comprehensive documentation