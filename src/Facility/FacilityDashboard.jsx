import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Table, Dropdown, Modal, Form } from 'react-bootstrap';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import { FaPlus, FaTimes } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const FacilityDashboard = () => {
  // State for inventory type
  const [inventoryType, setInventoryType] = useState('pharmaceuticals');

  // State for inventory data
  const [inventoryData, setInventoryData] = useState([
    { id: 1, name: 'Paracetamol', category: 'Pharmaceuticals', quantity: 120, status: 'In Stock', expiry: '2024-12-31' },
    { id: 2, name: 'Bandages', category: 'Medical Supplies', quantity: 45, status: 'Low Stock', expiry: '2025-06-30' },
    { id: 3, name: 'Syringes', category: 'Consumables', quantity: 200, status: 'In Stock', expiry: '2025-03-15' },
    { id: 4, name: 'MRI Machine', category: 'Equipment', quantity: 2, status: 'In Stock', expiry: 'N/A' },
    { id: 5, name: 'Ibuprofen', category: 'Pharmaceuticals', quantity: 0, status: 'Out of Stock', expiry: '2024-11-30' },
    { id: 6, name: 'Gloves', category: 'Consumables', quantity: 30, status: 'Low Stock', expiry: '2024-10-15' },
  ]);

  // Data for charts
  const consumptionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Medical Supplies',
        data: [65, 59, 80, 81, 56, 55, 40, 65, 75, 85, 70, 90],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Pharmaceuticals',
        data: [28, 48, 40, 19, 86, 27, 90, 65, 45, 70, 60, 80],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Consumables',
        data: [45, 25, 60, 41, 66, 47, 30, 55, 65, 75, 80, 70],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const stockData = {
    labels: ['Pharmaceuticals', 'Medical Supplies', 'Consumables', 'Equipment'],
    datasets: [
      {
        label: 'Inventory by Category',
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const quarterlyData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Inventory Value',
        data: [65, 75, 70, 85],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Consumption Patterns',
      },
    },
  };

  const stockOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory by Category',
      },
    },
  };

  const quarterlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Quarterly Inventory Value',
      },
    },
  };

  // Recent requisitions data
  const requisitions = [
    { id: 'REQ-001', facility: 'Kumasi Branch Hospital', requestedBy: 'Dr. John Smith', date: '2023-05-15', items: 12, status: 'Pending' },
    { id: 'REQ-002', facility: 'Accra Medical Center', requestedBy: 'Nurse Jane Doe', date: '2023-05-14', items: 8, status: 'Dispatched' },
    { id: 'REQ-003', facility: 'Tamale General Hospital', requestedBy: 'Dr. Kwame Appiah', date: '2023-05-13', items: 15, status: 'Partially Approved' },
    { id: 'REQ-004', facility: 'Cape Coast Clinic', requestedBy: 'Pharmacist Ama Osei', date: '2023-05-12', items: 5, status: 'Completed' },
  ];

  // Status badge colors
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'Dispatched':
        return <span className="badge bg-info">Dispatched</span>;
      case 'Partially Approved':
        return <span className="badge bg-primary">Partially Approved</span>;
      case 'Completed':
        return <span className="badge bg-success">Completed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // Function to handle inventory type change
  const handleInventoryTypeChange = (type) => {
    setInventoryType(type);
    
    if (type === 'pharmaceuticals') {
      setInventoryData([
        { id: 1, name: 'Paracetamol', category: 'Pharmaceuticals', quantity: 120, status: 'In Stock', expiry: '2024-12-31' },
        { id: 2, name: 'Ibuprofen', category: 'Pharmaceuticals', quantity: 0, status: 'Out of Stock', expiry: '2024-11-30' },
        { id: 3, name: 'Amoxicillin', category: 'Pharmaceuticals', quantity: 75, status: 'In Stock', expiry: '2025-02-28' },
        { id: 4, name: 'Omeprazole', category: 'Pharmaceuticals', quantity: 40, status: 'Low Stock', expiry: '2024-09-30' },
        { id: 5, name: 'Lisinopril', category: 'Pharmaceuticals', quantity: 60, status: 'In Stock', expiry: '2025-01-15' },
        { id: 6, name: 'Metformin', category: 'Pharmaceuticals', quantity: 0, status: 'Out of Stock', expiry: '2024-08-31' },
      ]);
    } else if (type === 'medical_supplies') {
      setInventoryData([
        { id: 1, name: 'Bandages', category: 'Medical Supplies', quantity: 45, status: 'Low Stock', expiry: '2025-06-30' },
        { id: 2, name: 'Gauze Pads', category: 'Medical Supplies', quantity: 120, status: 'In Stock', expiry: '2025-05-15' },
        { id: 3, name: 'Tape', category: 'Medical Supplies', quantity: 80, status: 'In Stock', expiry: '2025-04-30' },
        { id: 4, name: 'Cotton Balls', category: 'Medical Supplies', quantity: 200, status: 'In Stock', expiry: '2025-07-15' },
        { id: 5, name: 'Surgical Masks', category: 'Medical Supplies', quantity: 30, status: 'Low Stock', expiry: '2024-10-15' },
        { id: 6, name: 'Gloves', category: 'Medical Supplies', quantity: 0, status: 'Out of Stock', expiry: '2024-09-30' },
      ]);
    }
  };

  // Function to export inventory data as CSV
  const exportInventory = () => {
    const csvContent = [
      ['ID', 'Name', 'Category', 'Quantity', 'Status', 'Expiry Date'],
      ...inventoryData.map(item => [
        item.id,
        item.name,
        item.category,
        item.quantity,
        item.status,
        item.expiry
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_${inventoryType}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Container fluid className="p-4">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Facility Dashboard</h1>
        </Col>
        
      </Row>

      {/* Alerts */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Alert variant="danger">
            <Alert.Heading>Out of Stock</Alert.Heading>
            <p>8 items need immediate attention</p>
          </Alert>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Alert variant="warning">
            <Alert.Heading>Low Stock</Alert.Heading>
            <p>23 items below minimum levels</p>
          </Alert>
        </Col>
        <Col md={4}>
          <Alert variant="info">
            <Alert.Heading>Near Expiry</Alert.Heading>
            <p>15 items expiring in 30 days</p>
          </Alert>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Total Inventory Items</Card.Title>
              <Card.Text className="display-6">1,248</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Pending Requisitions</Card.Title>
              <Card.Text className="display-6">42</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={3} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Facilities Served</Card.Title>
              <Card.Text className="display-6">6</Card.Text>
            </Card.Body>
          </Card>
        </Col> */}
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Assets Tracked</Card.Title>
              <Card.Text className="display-6">187</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inventory Type Selector */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Inventory Type</Card.Title>
              <div className="d-flex justify-content-center mt-3">
                <div 
                  className={`inventory-type-card ${inventoryType === 'pharmaceuticals' ? 'active' : ''}`}
                  onClick={() => handleInventoryTypeChange('pharmaceuticals')}
                >
                  <div className="inventory-type-image">
                    <div className="pharmaceuticals-image"></div>
                  </div>
                  <div className="inventory-type-label">Pharmaceuticals</div>
                </div>
                <div 
                  className={`inventory-type-card ${inventoryType === 'medical_supplies' ? 'active' : ''}`}
                  onClick={() => handleInventoryTypeChange('medical_supplies')}
                >
                  <div className="inventory-type-image">
                    <div className="medical-supplies-image"></div>
                  </div>
                  <div className="inventory-type-label">Medical Supplies</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6} className="mb-4 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Consumption Trends</Card.Title>
              <div style={{ height: '300px' }}>
                <Line data={consumptionData} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Stock Distribution</Card.Title>
              <div style={{ height: '300px' }}>
                <Doughnut data={stockData} options={stockOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inventory List */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Inventory List - {inventoryType === 'pharmaceuticals' ? 'Pharmaceuticals' : 'Medical Supplies'}</Card.Title>
              <Button variant="outline-primary" onClick={exportInventory}>Export to CSV</Button>
            </Card.Header>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>
                        {item.status === 'In Stock' ? (
                          <span className="badge bg-success">In Stock</span>
                        ) : item.status === 'Low Stock' ? (
                          <span className="badge bg-warning text-dark">Low Stock</span>
                        ) : (
                          <span className="badge bg-danger">Out of Stock</span>
                        )}
                      </td>
                      <td>{item.expiry}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports & Analytics */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Reports & Analytics</Card.Title>
              <Row className="mt-4">
                <Col md={6}>
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Generate Custom Report</Card.Title>
                      <div className="mb-3">
                        <label className="form-label">Report Type</label>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="dropdown-report-type">
                            Inventory Report
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Inventory Report</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Consumption Report</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Requisition Report</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">Dispatch Report</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">Expiry Report</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Date Range</label>
                        <input type="text" className="form-control" placeholder="Select date range" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Facility</label>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" id="dropdown-facility">
                            All Facilities
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">All Facilities</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Kumasi Branch Hospital</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Accra Medical Center</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">Tamale General Hospital</Dropdown.Item>
                            <Dropdown.Item href="#/action-5">Cape Coast Clinic</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <Button variant="primary">Generate Report</Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Body>
                      <Card.Title>Report Preview</Card.Title>
                      <div style={{ height: '300px' }}>
                        <Bar data={quarterlyData} options={quarterlyOptions} />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

     
    </Container>
  );
};

export default FacilityDashboard;