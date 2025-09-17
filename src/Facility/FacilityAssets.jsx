
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button, Nav, Tab, Alert } from 'react-bootstrap';
import { FaFileUpload, FaHistory, FaTools, FaArrowRight } from 'react-icons/fa';

const FacilityAssets = () => {
  // Sample data for assets
  const [assets, setAssets] = useState([
    {
      id: 'AST-1001',
      name: 'Ventilator',
      category: 'Medical Equipment',
      description: 'High-end ICU ventilator with advanced monitoring',
      serialNumber: 'VT-2023-001',
      location: 'ICU Ward 1',
      department: 'ICU',
      cost: 25000,
      vendor: 'MedTech Solutions',
      warrantyEndDate: '2025-12-31',
      maintenanceSchedule: '2024-06-15',
      condition: 'Good',
      lastMaintenance: '2023-10-15',
      attachments: []
    },
    {
      id: 'AST-1002',
      name: 'Ultrasound Machine',
      category: 'Diagnostic',
      description: 'Portable ultrasound machine for radiology department',
      serialNumber: 'US-2023-002',
      location: 'Radiology Dept',
      department: 'Radiology',
      cost: 18000,
      vendor: 'Diagnostic Pro',
      warrantyEndDate: '2025-08-20',
      maintenanceSchedule: '2024-03-20',
      condition: 'Fair',
      lastMaintenance: '2023-09-20',
      attachments: []
    },
    {
      id: 'AST-1003',
      name: 'Patient Monitor',
      category: 'Medical Equipment',
      description: 'Multi-parameter patient monitor with ECG capabilities',
      serialNumber: 'PM-2023-003',
      location: 'Emergency Room',
      department: 'Emergency',
      cost: 8500,
      vendor: 'HealthCare Devices Inc',
      warrantyEndDate: '2024-10-05',
      maintenanceSchedule: '2024-04-05',
      condition: 'Needs Repair',
      lastMaintenance: '2023-10-05',
      attachments: []
    }
  ]);

  // Sample data for movement logs
  const [movementLogs, setMovementLogs] = useState([
    {
      id: 1,
      assetId: 'AST-1001',
      date: '2023-11-02',
      fromLocation: 'Storage Room',
      toLocation: 'ICU Ward 1',
      reason: 'New equipment deployment',
      handledBy: 'Dr. Agyemang'
    },
    {
      id: 2,
      assetId: 'AST-1003',
      date: '2023-10-28',
      fromLocation: 'Maintenance Lab',
      toLocation: 'Emergency Room',
      reason: 'Completed maintenance and reassignment',
      handledBy: 'Tech. Kwame'
    }
  ]);

  // Sample data for maintenance logs
  const [maintenanceLogs, setMaintenanceLogs] = useState([
    {
      id: 1,
      assetId: 'AST-1001',
      date: '2023-10-15',
      technician: 'Tech. Mensah',
      cost: 250,
      notes: 'Routine maintenance and calibration',
      attachment: null
    },
    {
      id: 2,
      assetId: 'AST-1002',
      date: '2023-09-20',
      technician: 'Tech. Ama',
      cost: 180,
      notes: 'Software update and probe calibration',
      attachment: null
    },
    {
      id: 3,
      assetId: 'AST-1003',
      date: '2023-10-05',
      technician: 'Tech. Kwame',
      cost: 420,
      notes: 'Repair of ECG module, replaced faulty components',
      attachment: 'repair_receipt.pdf'
    }
  ]);

  // State management
  const [showModal, setShowModal] = useState(false);
  const [showMovementLogModal, setShowMovementLogModal] = useState(false);
  const [showAssetDetailModal, setShowAssetDetailModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // Maintenance Record Modal State
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [newMaintenanceRecord, setNewMaintenanceRecord] = useState({
    date: '',
    technician: '',
    cost: '',
    notes: '',
    attachment: null
  });

  // Movement Record Modal State
  const [showAddMovementModal, setShowAddMovementModal] = useState(false);
  const [newMovementRecord, setNewMovementRecord] = useState({
    date: '',
    fromLocation: '',
    toLocation: '',
    reason: '',
    handledBy: ''
  });

  // Form state for new asset
  const [newAsset, setNewAsset] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    serialNumber: '',
    location: '',
    department: '',
    cost: '',
    vendor: '',
    warrantyEndDate: '',
    maintenanceSchedule: '',
    condition: 'Good'
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Submit new asset
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.category || !newAsset.department) {
      alert('Please fill in required fields');
      return;
    }
    
    // Generate new asset ID if not provided
    const assetId = newAsset.id || `AST-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // Create new asset object
    const assetToAdd = {
      ...newAsset,
      id: assetId,
      lastMaintenance: new Date().toISOString().split('T')[0],
      attachments: file ? [file.name] : []
    };
    
    // Add to assets list
    setAssets([...assets, assetToAdd]);
    
    // Reset form
    setNewAsset({
      id: '',
      name: '',
      category: '',
      description: '',
      serialNumber: '',
      location: '',
      department: '',
      cost: '',
      vendor: '',
      warrantyEndDate: '',
      maintenanceSchedule: '',
      condition: 'Good'
    });
    
    setFile(null);
    setFileName('');
    setShowModal(false);
  };

  // Open add asset modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Close add asset modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewAsset({
      id: '',
      name: '',
      category: '',
      description: '',
      serialNumber: '',
      location: '',
      department: '',
      cost: '',
      vendor: '',
      warrantyEndDate: '',
      maintenanceSchedule: '',
      condition: 'Good'
    });
    setFile(null);
    setFileName('');
  };

  // View asset details
  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setShowAssetDetailModal(true);
    setActiveTab('details');
  };

  // View movement log
  const handleViewMovementLog = (asset) => {
    setSelectedAsset(asset);
    setShowMovementLogModal(true);
  };

  // Close movement log modal
  const handleCloseMovementLogModal = () => {
    setShowMovementLogModal(false);
    setSelectedAsset(null);
  };

  // Close asset detail modal
  const handleCloseAssetDetailModal = () => {
    setShowAssetDetailModal(false);
    setSelectedAsset(null);
  };

  // Get status class for condition
  const getConditionClass = (condition) => {
    switch(condition) {
      case 'Good':
        return 'bg-success';
      case 'Fair':
        return 'bg-warning';
      case 'Poor':
      case 'Needs Repair':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Handle Maintenance Record Form Change
  const handleMaintenanceInputChange = (e) => {
    const { name, value } = e.target;
    setNewMaintenanceRecord(prev => ({ ...prev, [name]: value }));
  };

  // Handle Movement Record Form Change
  const handleMovementInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovementRecord(prev => ({ ...prev, [name]: value }));
  };

  // Submit Maintenance Record
  const handleAddMaintenanceRecord = (e) => {
    e.preventDefault();
    
    if (!newMaintenanceRecord.date || !newMaintenanceRecord.technician) {
      alert('Please fill in required fields');
      return;
    }
    
    // Create new maintenance record
    const maintenanceRecordToAdd = {
      id: Math.floor(1000 + Math.random() * 9000),
      assetId: selectedAsset.id,
      ...newMaintenanceRecord,
      cost: newMaintenanceRecord.cost || 0
    };
    
    // Add to maintenance logs
    setMaintenanceLogs([...maintenanceLogs, maintenanceRecordToAdd]);
    
    // Update asset's last maintenance date
    setAssets(assets.map(asset => 
      asset.id === selectedAsset.id 
        ? { ...asset, lastMaintenance: newMaintenanceRecord.date }
        : asset
    ));
    
    // Reset form and close modal
    setNewMaintenanceRecord({
      date: '',
      technician: '',
      cost: '',
      notes: '',
      attachment: null
    });
    
    setShowAddMaintenanceModal(false);
  };

  // Submit Movement Record
  const handleAddMovementRecord = (e) => {
    e.preventDefault();
    
    if (!newMovementRecord.date || !newMovementRecord.fromLocation || !newMovementRecord.toLocation || !newMovementRecord.handledBy) {
      alert('Please fill in required fields');
      return;
    }
    
    // Create new movement record
    const movementRecordToAdd = {
      id: Math.floor(1000 + Math.random() * 9000),
      assetId: selectedAsset.id,
      ...newMovementRecord
    };
    
    // Add to movement logs
    setMovementLogs([...movementLogs, movementRecordToAdd]);
    
    // Update asset's location and department
    setAssets(assets.map(asset => 
      asset.id === selectedAsset.id 
        ? { 
            ...asset, 
            location: newMovementRecord.toLocation,
            department: getDepartmentFromLocation(newMovementRecord.toLocation)
          }
        : asset
    ));
    
    // Reset form and close modal
    setNewMovementRecord({
      date: '',
      fromLocation: '',
      toLocation: '',
      reason: '',
      handledBy: ''
    });
    
    setShowAddMovementModal(false);
  };

  // Helper function to get department from location
  const getDepartmentFromLocation = (location) => {
    const locationToDeptMap = {
      'ICU Ward 1': 'ICU',
      'ICU Ward 2': 'ICU',
      'Emergency Room': 'Emergency',
      'Radiology Dept': 'Radiology',
      'Surgery Room 1': 'Surgery',
      'Surgery Room 2': 'Surgery',
      'Pharmacy': 'Pharmacy',
      'Storage Room': 'Administration',
      'Maintenance Lab': 'Administration'
    };
    
    return locationToDeptMap[location] || 'Administration';
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with H1 and Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="mb-0">Assets Management</h1>
          <p className="text-muted mb-0">Manage facility assets, maintenance, and movement logs</p>
        </div>
        <button className="btn btn-primary d-flex align-items-center" onClick={handleShowModal}>
          <i className="bi bi-plus me-1"></i> Add New Asset
        </button>
      </div>
      
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pb-0">
          <h5 className="mb-0 fs-4">Hospital Assets</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Asset ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Location</th>
                  <th scope="col">Department</th>
                  <th scope="col">Condition</th>
                  <th scope="col">Warranty End</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td className="fw-medium">{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.location}</td>
                    <td>{asset.department}</td>
                    <td>
                      <span className={`badge ${getConditionClass(asset.condition)} text-white`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td>{asset.warrantyEndDate}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary d-flex align-items-center"
                          onClick={() => handleViewAsset(asset)}
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info d-flex align-items-center"
                          onClick={() => handleViewMovementLog(asset)}
                          title="View Movement Log"
                        >
                          <FaHistory size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Asset Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Add New Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Asset ID <span className="text-muted">(Optional)</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., AST-1004"
                    name="id"
                    value={newAsset.id}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., X-Ray Machine"
                    name="name"
                    value={newAsset.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="category"
                    value={newAsset.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Medical Equipment">Medical Equipment</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Furniture">Furniture</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Laboratory">Laboratory</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Serial/IMEI Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., XYZ-123456"
                    name="serialNumber"
                    value={newAsset.serialNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter asset description"
                    name="description"
                    value={newAsset.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    name="location"
                    value={newAsset.location}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Location</option>
                    <option value="ICU Ward 1">ICU Ward 1</option>
                    <option value="ICU Ward 2">ICU Ward 2</option>
                    <option value="Emergency Room">Emergency Room</option>
                    <option value="Radiology Dept">Radiology Dept</option>
                    <option value="Surgery Room 1">Surgery Room 1</option>
                    <option value="Surgery Room 2">Surgery Room 2</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Storage Room">Storage Room</option>
                    <option value="Maintenance Lab">Maintenance Lab</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assigned Department <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="department"
                    value={newAsset.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="ICU">ICU</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Administration">Administration</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cost ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 25000"
                    name="cost"
                    value={newAsset.cost}
                    onChange={handleInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Vendor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., MedTech Solutions"
                    name="vendor"
                    value={newAsset.vendor}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Warranty End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="warrantyEndDate"
                    value={newAsset.warrantyEndDate}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Maintenance Schedule</Form.Label>
                  <Form.Control
                    type="date"
                    name="maintenanceSchedule"
                    value={newAsset.maintenanceSchedule}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Condition</Form.Label>
                  <Form.Select
                    name="condition"
                    value={newAsset.condition}
                    onChange={handleInputChange}
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                    <option value="Needs Repair">Needs Repair</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Attachments</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="No file chosen"
                      value={fileName}
                      readOnly
                    />
                    <label className="input-group-text">
                      <FaFileUpload />
                      <input 
                        type="file" 
                        className="d-none" 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                  </div>
                  <Form.Text className="text-muted">
                    Upload PDF, Images, or Documents (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add Asset
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Asset Detail Modal with Tabs */}
      <Modal show={showAssetDetailModal} onHide={handleCloseAssetDetailModal} size="lg" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Asset Details - {selectedAsset?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsset && (
            <Tab.Container id="asset-tabs" defaultActiveKey="details">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="details">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="maintenance">Maintenance Log</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="movement">Movement Log</Nav.Link>
                </Nav.Item>
              </Nav>
              
              <Tab.Content>
                <Tab.Pane eventKey="details">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>Asset ID:</strong> {selectedAsset.id}
                      </div>
                      <div className="mb-3">
                        <strong>Name:</strong> {selectedAsset.name}
                      </div>
                      <div className="mb-3">
                        <strong>Category:</strong> {selectedAsset.category}
                      </div>
                      <div className="mb-3">
                        <strong>Description:</strong> {selectedAsset.description || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Serial/IMEI:</strong> {selectedAsset.serialNumber || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Location:</strong> {selectedAsset.location || 'N/A'}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <strong>Department:</strong> {selectedAsset.department}
                      </div>
                      <div className="mb-3">
                        <strong>Cost:</strong> ${selectedAsset.cost || '0'}
                      </div>
                      <div className="mb-3">
                        <strong>Vendor:</strong> {selectedAsset.vendor || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Warranty End:</strong> {selectedAsset.warrantyEndDate || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Maintenance Schedule:</strong> {selectedAsset.maintenanceSchedule || 'N/A'}
                      </div>
                      <div className="mb-3">
                        <strong>Condition:</strong> 
                        <span className={`badge ${getConditionClass(selectedAsset.condition)} text-white ms-2`}>
                          {selectedAsset.condition}
                        </span>
                      </div>
                      <div className="mb-3">
                        <strong>Last Maintenance:</strong> {selectedAsset.lastMaintenance || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  {selectedAsset.attachments && selectedAsset.attachments.length > 0 && (
                    <div className="mt-4">
                      <h6>Attachments</h6>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedAsset.attachments.map((attachment, index) => (
                          <div key={index} className="border p-2 rounded">
                            <i className="bi bi-file-earmark me-1"></i>
                            {attachment}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Tab.Pane>
                
                <Tab.Pane eventKey="maintenance">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Maintenance History</h6>
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => setShowAddMaintenanceModal(true)}
                    >
                      <i className="bi bi-plus"></i> Add Record
                    </button>
                  </div>
                  
                  {maintenanceLogs.filter(log => log.assetId === selectedAsset.id).length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Technician</th>
                            <th>Cost ($)</th>
                            <th>Notes</th>
                            <th>Attachment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maintenanceLogs
                            .filter(log => log.assetId === selectedAsset.id)
                            .map((log) => (
                              <tr key={log.id}>
                                <td>{log.date}</td>
                                <td>{log.technician}</td>
                                <td>{log.cost}</td>
                                <td>{log.notes}</td>
                                <td>
                                  {log.attachment ? (
                                    <a href="#" className="text-primary">
                                      <i className="bi bi-file-earmark me-1"></i>
                                      {log.attachment}
                                    </a>
                                  ) : 'N/A'}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No maintenance records found.</p>
                    </div>
                  )}
                </Tab.Pane>
                
                <Tab.Pane eventKey="movement">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Movement History</h6>
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => setShowAddMovementModal(true)}
                    >
                      <i className="bi bi-plus"></i> Add Record
                    </button>
                  </div>
                  
                  {movementLogs.filter(log => log.assetId === selectedAsset.id).length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                            <th>Handled By</th>
                          </tr>
                        </thead>
                        <tbody>
                          {movementLogs
                            .filter(log => log.assetId === selectedAsset.id)
                            .map((log) => (
                              <tr key={log.id}>
                                <td>{log.date}</td>
                                <td>{log.fromLocation}</td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <FaArrowRight className="me-2" size={12} />
                                    {log.toLocation}
                                  </div>
                                </td>
                                <td>{log.reason}</td>
                                <td>{log.handledBy}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">No movement records found.</p>
                    </div>
                  )}
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAssetDetailModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Movement Log Modal (Alternative view) */}
      <Modal show={showMovementLogModal} onHide={handleCloseMovementLogModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Movement Log - {selectedAsset?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAsset && (
            <>
              <h5 className="mb-3">{selectedAsset.name}</h5>
              
              {movementLogs.filter(log => log.assetId === selectedAsset.id).length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>From Location</th>
                        <th>To Location</th>
                        <th>Reason</th>
                        <th>Handled By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movementLogs
                        .filter(log => log.assetId === selectedAsset.id)
                        .map((log) => (
                          <tr key={log.id}>
                            <td>{log.date}</td>
                            <td>{log.fromLocation}</td>
                            <td>{log.toLocation}</td>
                            <td>{log.reason}</td>
                            <td>{log.handledBy}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Alert variant="info">
                  No movement records found for this asset.
                </Alert>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseMovementLogModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Maintenance Record Modal */}
      <Modal show={showAddMaintenanceModal} onHide={() => setShowAddMaintenanceModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Maintenance Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMaintenanceRecord}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newMaintenanceRecord.date}
                    onChange={handleMaintenanceInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Technician <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Tech. Mensah"
                    name="technician"
                    value={newMaintenanceRecord.technician}
                    onChange={handleMaintenanceInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cost ($)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 250"
                    name="cost"
                    value={newMaintenanceRecord.cost}
                    onChange={handleMaintenanceInputChange}
                    min="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNewMaintenanceRecord(prev => ({ 
                          ...prev, 
                          attachment: e.target.files[0].name 
                        }));
                      }
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter maintenance notes"
                    name="notes"
                    value={newMaintenanceRecord.notes}
                    onChange={handleMaintenanceInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMaintenanceModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMaintenanceRecord}>
            Save Record
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Movement Record Modal */}
      <Modal show={showAddMovementModal} onHide={() => setShowAddMovementModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Movement Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddMovementRecord}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newMovementRecord.date}
                    onChange={handleMovementInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Handled By <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Dr. Agyemang"
                    name="handledBy"
                    value={newMovementRecord.handledBy}
                    onChange={handleMovementInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>From Location <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="fromLocation"
                    value={newMovementRecord.fromLocation}
                    onChange={handleMovementInputChange}
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="ICU Ward 1">ICU Ward 1</option>
                    <option value="ICU Ward 2">ICU Ward 2</option>
                    <option value="Emergency Room">Emergency Room</option>
                    <option value="Radiology Dept">Radiology Dept</option>
                    <option value="Surgery Room 1">Surgery Room 1</option>
                    <option value="Surgery Room 2">Surgery Room 2</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Storage Room">Storage Room</option>
                    <option value="Maintenance Lab">Maintenance Lab</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>To Location <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="toLocation"
                    value={newMovementRecord.toLocation}
                    onChange={handleMovementInputChange}
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="ICU Ward 1">ICU Ward 1</option>
                    <option value="ICU Ward 2">ICU Ward 2</option>
                    <option value="Emergency Room">Emergency Room</option>
                    <option value="Radiology Dept">Radiology Dept</option>
                    <option value="Surgery Room 1">Surgery Room 1</option>
                    <option value="Surgery Room 2">Surgery Room 2</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Storage Room">Storage Room</option>
                    <option value="Maintenance Lab">Maintenance Lab</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Reason</Form.Label>
                  <Form.Select
                    name="reason"
                    value={newMovementRecord.reason}
                    onChange={handleMovementInputChange}
                  >
                    <option value="">Select Reason</option>
                    <option value="New equipment deployment">New equipment deployment</option>
                    <option value="Department transfer">Department transfer</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repair">Repair</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddMovementModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMovementRecord}>
            Save Record
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityAssets;