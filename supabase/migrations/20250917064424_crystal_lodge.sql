-- Hospital Inventory Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_inventory;
USE hospital_inventory;

-- Facilities table
CREATE TABLE facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL UNIQUE,
  type VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  description TEXT,
  capacity VARCHAR(100),
  services TEXT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Super Admin', 'Warehouse Admin', 'Facility Admin', 'Facility User') NOT NULL,
  facility_id INT NOT NULL,
  department VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT
);

-- Inventory table
CREATE TABLE inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  item_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  current_stock INT DEFAULT 0,
  min_level INT DEFAULT 0,
  max_level INT DEFAULT 0,
  standard_cost DECIMAL(10,2) DEFAULT 0.00,
  moving_avg_cost DECIMAL(10,2) DEFAULT 0.00,
  last_po_cost DECIMAL(10,2) DEFAULT 0.00,
  facility_transfer_price DECIMAL(10,2) DEFAULT 0.00,
  abc_class ENUM('A', 'B', 'C') DEFAULT 'C',
  facility_id INT NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_item_code (item_code),
  INDEX idx_category (category),
  INDEX idx_facility (facility_id)
);

-- Stock movements table
CREATE TABLE stock_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  inventory_id INT NOT NULL,
  transaction_type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
  quantity INT NOT NULL,
  batch_number VARCHAR(50),
  expiry_date DATE,
  reference_number VARCHAR(100),
  notes TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_inventory (inventory_id),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_created_at (created_at)
);

-- Requisitions table
CREATE TABLE requisitions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facility_id INT NOT NULL,
  department VARCHAR(100) NOT NULL,
  duration INT,
  duration_unit ENUM('days', 'weeks', 'months'),
  notes TEXT,
  status ENUM('Pending', 'Approved', 'Partially Approved', 'Rejected', 'Dispatched', 'Completed') DEFAULT 'Pending',
  admin_notes TEXT,
  requested_by INT NOT NULL,
  approved_by INT,
  approved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_facility (facility_id),
  INDEX idx_status (status),
  INDEX idx_requested_by (requested_by)
);

-- Requisition items table
CREATE TABLE requisition_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requisition_id INT NOT NULL,
  inventory_id INT NOT NULL,
  requested_quantity INT NOT NULL,
  approved_quantity INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE CASCADE,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE RESTRICT,
  INDEX idx_requisition (requisition_id),
  INDEX idx_inventory (inventory_id)
);

-- Dispatches table
CREATE TABLE dispatches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  requisition_id INT NOT NULL,
  facility_id INT NOT NULL,
  tracking_number VARCHAR(100) UNIQUE,
  estimated_delivery_date DATE,
  delivery_date DATE,
  status ENUM('Processing', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled') DEFAULT 'Processing',
  received_by VARCHAR(100),
  notes TEXT,
  dispatched_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requisition_id) REFERENCES requisitions(id) ON DELETE RESTRICT,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (dispatched_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_facility (facility_id),
  INDEX idx_status (status),
  INDEX idx_tracking (tracking_number)
);

-- Dispatch items table
CREATE TABLE dispatch_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dispatch_id INT NOT NULL,
  inventory_id INT NOT NULL,
  quantity INT NOT NULL,
  batch_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dispatch_id) REFERENCES dispatches(id) ON DELETE CASCADE,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE RESTRICT,
  INDEX idx_dispatch (dispatch_id),
  INDEX idx_inventory (inventory_id)
);

-- Assets table
CREATE TABLE assets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  serial_number VARCHAR(100),
  facility_id INT NOT NULL,
  department VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  purchase_date DATE,
  purchase_cost DECIMAL(10,2),
  vendor VARCHAR(200),
  warranty_end_date DATE,
  condition ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Needs Repair') DEFAULT 'Good',
  status ENUM('Available', 'In Use', 'Under Maintenance', 'Retired') DEFAULT 'Available',
  attachments JSON,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE RESTRICT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_asset_code (asset_code),
  INDEX idx_facility (facility_id),
  INDEX idx_status (status)
);

-- Asset maintenance table
CREATE TABLE asset_maintenance (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id INT NOT NULL,
  maintenance_date DATE NOT NULL,
  maintenance_type ENUM('Routine', 'Preventive', 'Corrective', 'Emergency') NOT NULL,
  description TEXT NOT NULL,
  technician VARCHAR(100) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0.00,
  estimated_duration INT, -- in days
  notes TEXT,
  attachment JSON,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_asset (asset_id),
  INDEX idx_maintenance_date (maintenance_date)
);

-- Asset movements table
CREATE TABLE asset_movements (
  id INT PRIMARY KEY AUTO_INCREMENT,
  asset_id INT NOT NULL,
  movement_date DATE NOT NULL,
  from_location VARCHAR(200),
  to_location VARCHAR(200) NOT NULL,
  reason TEXT,
  handled_by VARCHAR(100) NOT NULL,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_asset (asset_id),
  INDEX idx_movement_date (movement_date)
);

-- Insert default facilities
INSERT INTO facilities (name, type, address, phone, email, description, capacity, services) VALUES
('Main Warehouse', 'Central Storage Facility', '123 Industrial Area, Accra', '+233 30 123 4567', 'warehouse@francisfosu.com', 'Central storage facility for all medical supplies and equipment', '10,000 sq meters', 'Storage, Distribution, Inventory Management'),
('Kumasi Branch Hospital', 'Regional Facility', '456 Hospital Road, Kumasi', '+233 32 234 5678', 'kumasi@francisfosu.com', 'Regional hospital serving the Ashanti region', '300 beds', 'Emergency, Surgery, Maternity, Pediatrics, Pharmacy'),
('Accra Central Hospital', 'Metropolitan Facility', '789 Central Avenue, Accra', '+233 30 345 6789', 'accra@francisfosu.com', 'Main hospital in Accra providing specialized healthcare services', '500 beds', 'Cardiology, Oncology, Neurology, Radiology, Laboratory'),
('Takoradi Clinic', 'Community Health Center', '101 Health Street, Takoradi', '+233 31 456 7890', 'takoradi@francisfosu.com', 'Community health center providing primary care services', '50 beds', 'General Practice, Maternity, Immunization, Laboratory'),
('Cape Coast Hospital', 'Coastal Regional Facility', '202 Coastal Road, Cape Coast', '+233 33 567 8901', 'capecoast@francisfosu.com', 'Regional hospital serving the Central region', '250 beds', 'Emergency, Surgery, Maternity, Pediatrics, Pharmacy');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role, facility_id, department, first_name, last_name) VALUES
('superadmin', 'admin@francisfosu.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGzBqxflO', 'Super Admin', 1, 'Administration', 'System', 'Administrator'),
('warehouse', 'warehouse@francisfosu.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGzBqxflO', 'Warehouse Admin', 1, 'Inventory', 'Warehouse', 'Admin'),
('facility', 'facility@francisfosu.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGzBqxflO', 'Facility Admin', 2, 'Medical', 'Facility', 'Admin'),
('user', 'user@francisfosu.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hGzBqxflO', 'Facility User', 2, 'Pharmacy', 'Facility', 'User');

-- Insert sample inventory items
INSERT INTO inventory (item_code, name, category, description, unit, current_stock, min_level, max_level, standard_cost, moving_avg_cost, last_po_cost, facility_transfer_price, abc_class, facility_id, created_by) VALUES
('DRG-0421', 'Paracetamol 500mg', 'Pharmaceutical', 'Pain relief medication', 'Tablets', 150, 20, 500, 2.50, 2.60, 2.45, 3.00, 'A', 1, 1),
('MS-0876', 'Surgical Gloves (Large)', 'Medical Supply', 'Sterile surgical gloves', 'Pairs', 200, 50, 1000, 1.20, 1.25, 1.18, 1.50, 'B', 1, 1),
('CON-1543', 'Syringe 5ml', 'Consumable', 'Disposable syringes', 'Pieces', 500, 100, 2000, 0.80, 0.82, 0.79, 1.00, 'C', 1, 1),
('DRG-2087', 'Amoxicillin 250mg', 'Pharmaceutical', 'Antibiotic medication', 'Capsules', 80, 25, 300, 4.00, 4.10, 3.95, 4.50, 'A', 1, 1),
('EQ-3456', 'Digital Thermometer', 'Equipment', 'Non-contact infrared thermometer', 'Units', 25, 10, 50, 45.00, 47.50, 44.00, 55.00, 'B', 2, 1);

-- Insert sample stock movements
INSERT INTO stock_movements (inventory_id, transaction_type, quantity, batch_number, expiry_date, reference_number, notes, created_by) VALUES
(1, 'IN', 200, 'B2023-087', '2025-12-01', 'PO-2023-001', 'Initial stock receipt', 1),
(1, 'OUT', 50, 'B2023-087', '2025-12-01', 'REQ-001', 'Issued to Kumasi Hospital', 1),
(2, 'IN', 300, 'B2023-102', '2026-03-22', 'PO-2023-002', 'Bulk purchase', 1),
(2, 'OUT', 100, 'B2023-102', '2026-03-22', 'REQ-002', 'Emergency department request', 1),
(3, 'IN', 1000, 'B2023-066', '2025-10-30', 'PO-2023-003', 'Monthly supply', 1),
(3, 'OUT', 500, 'B2023-066', '2025-10-30', 'REQ-003', 'Multiple department requests', 1);

-- Insert sample assets
INSERT INTO assets (asset_code, name, category, description, serial_number, facility_id, department, location, purchase_date, purchase_cost, vendor, warranty_end_date, condition, status, created_by) VALUES
('AST-1001', 'Ventilator', 'Medical Equipment', 'High-end ICU ventilator with advanced monitoring', 'VT-2023-001', 2, 'ICU', 'ICU Ward 1', '2022-01-15', 25000.00, 'MedTech Solutions', '2025-01-15', 'Good', 'In Use', 1),
('AST-1002', 'Ultrasound Machine', 'Diagnostic', 'Portable ultrasound machine for radiology department', 'US-2023-002', 2, 'Radiology', 'Radiology Dept', '2021-03-10', 18000.00, 'Diagnostic Pro', '2024-03-10', 'Fair', 'Available', 1),
('AST-1003', 'Patient Monitor', 'Medical Equipment', 'Multi-parameter patient monitor with ECG capabilities', 'PM-2023-003', 3, 'Emergency', 'Emergency Room', '2020-05-20', 8500.00, 'HealthCare Devices Inc', '2023-05-20', 'Needs Repair', 'Under Maintenance', 1);

-- Create indexes for better performance
CREATE INDEX idx_users_facility ON users(facility_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_inventory_facility ON inventory(facility_id);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_requisitions_facility ON requisitions(facility_id);
CREATE INDEX idx_requisitions_status ON requisitions(status);
CREATE INDEX idx_dispatches_facility ON dispatches(facility_id);
CREATE INDEX idx_dispatches_status ON dispatches(status);
CREATE INDEX idx_assets_facility ON assets(facility_id);
CREATE INDEX idx_assets_status ON assets(status);