import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  FaPills, FaFileImport, FaHospitalAlt, FaLaptopMedical, 
  FaExclamationCircle, FaExclamationTriangle, FaClock, 
  FaPlus, FaHospital, FaClinicMedical, FaFirstAid, FaUsersCog,
  FaChartLine, FaTruckLoading, FaCog, FaEdit, FaTrash, FaEye,
  FaCheck, FaTimes, FaSearch, FaUser, FaBuilding, FaCalendarAlt,
  FaBox, FaChartBar, FaClipboardList, FaWarehouse, FaUserMd,
  FaInbox, FaBell, FaUserCircle, FaBars, FaSignOutAlt, FaFilter
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const SuperAdminDashboard = () => {
  // Chart data and options (保持不变)
  const consumptionChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Medical Supplies',
        data: [65, 59, 80, 81, 56, 55, 72, 68, 75, 70],
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Pharmaceuticals',
        data: [28, 48, 40, 45, 56, 65, 52, 59, 66, 71],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Consumables',
        data: [45, 35, 50, 55, 45, 35, 40, 48, 52, 58],
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const consumptionChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          boxWidth: 8,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Consumption Patterns',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        title: {
          display: true,
          text: 'Units Consumed',
          font: {
            weight: 'bold'
          }
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const stockChartData = {
    labels: ['Pharmaceuticals', 'Medical Supplies', 'Consumables', 'Equipment'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#f39c12',
          '#9b59b6'
        ],
        borderWidth: 0,
        hoverOffset: 15
      }
    ]
  };

  const stockChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          boxWidth: 8,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Inventory by Category',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    cutout: '70%'
  };

  const reportChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Inventory Value',
        data: [65, 59, 80, 81],
        backgroundColor: '#3498db',
        borderRadius: 8,
        barThickness: 40
      }
    ]
  };

  const reportChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Quarterly Inventory Value',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  // Mock data for recent requisitions
  const recentRequisitions = [
    { id: '#REQ-0042', facility: 'Kumasi Branch Hospital', requestedBy: 'Dr. Amoah', date: '24 Oct 2023', items: '12 items', status: 'Pending', action: 'Review' },
    { id: '#REQ-0041', facility: 'Accra Central Hospital', requestedBy: 'Nurse Adwoa', date: '23 Oct 2023', items: '8 items', status: 'Dispatched', action: 'View' },
    { id: '#REQ-0040', facility: 'Takoradi Clinic', requestedBy: 'Dr. Mensah', date: '22 Oct 2023', items: '5 items', status: 'Partially Approved', action: 'Review' },
    { id: '#REQ-0039', facility: 'Cape Coast Hospital', requestedBy: 'Pharm. Kofi', date: '21 Oct 2023', items: '15 items', status: 'Completed', action: 'View' }
  ];

  // Mock data for facilities
  const facilities = [
    { id: 1, name: 'Main Warehouse', type: 'Central Storage Facility', icon: <FaWarehouse className="text-primary" /> },
    { id: 2, name: 'Kumasi Branch Hospital', type: 'Regional Facility', icon: <FaHospital className="text-success" /> },
    { id: 3, name: 'Accra Central Hospital', type: 'Metropolitan Facility', icon: <FaClinicMedical className="text-info" /> }
  ];

  // Mock data for users
  const users = [
    { id: 'USR-001', name: 'John Mensah', role: 'Super Admin', facility: 'Main Warehouse', department: 'Administration', status: 'Active', lastLogin: '25 Oct 2023' },
    { id: 'USR-002', name: 'Alice Ofori', role: 'Warehouse Admin', facility: 'Main Warehouse', department: 'Inventory', status: 'Active', lastLogin: '24 Oct 2023' },
    { id: 'USR-003', name: 'Dr. Kwame Asare', role: 'Facility Admin', facility: 'Kumasi Branch Hospital', department: 'Medical', status: 'Active', lastLogin: '24 Oct 2023' }
  ];

  // State for form inputs
  const [reportType, setReportType] = useState('Inventory Report');
  const [facility, setFacility] = useState('All Facilities');

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Pending': 'bg-warning',
      'Dispatched': 'bg-success',
      'Partially Approved': 'bg-info',
      'Completed': 'bg-success',
      'Active': 'bg-success',
      'Inactive': 'bg-secondary'
    };
    
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'}`}>
        {status}
      </span>
    );
  };

  // Role badge component
  const RoleBadge = ({ role }) => {
    const roleColors = {
      'Super Admin': 'bg-danger',
      'Warehouse Admin': 'bg-primary',
      'Facility Admin': 'bg-info',
      'Facility User': 'bg-secondary'
    };
    
    return (
      <span className={`badge ${roleColors[role] || 'bg-secondary'}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="container-fluid py-4 " style={{ minHeight: '100vh' }}>
      {/* Dashboard Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="fw-bold text-primary fs-3 fs-md-2">Warehouse Dashboard</h1>
          <p className="text-muted">Welcome back, Super Admin</p>
        </div>
        
      </div>

      {/* Alert Summary - 根据截图设计 */}
      <div className="row mb-4">
        <div className="col-12 col-md-4 mb-3">
          <div className="card border-1 shadow-sm h-100">
            <div className="card-body bg-danger bg-opacity-10 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <FaExclamationCircle className="text-danger me-2" size={24} />
                    <h5 className="card-title text-danger fw-bold mb-0">Out of Stock</h5>
                  </div>
                  <p className="card-text text-muted ms-4">8 items need immediate attention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="card border-1 shadow-sm h-100">
            <div className="card-body bg-warning bg-opacity-10 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <FaExclamationTriangle className="text-warning me-2" size={24} />
                    <h5 className="card-title text-warning fw-bold mb-0">Low Stock</h5>
                  </div>
                  <p className="card-text text-muted ms-4">23 items below minimum levels</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="card border-1 shadow-sm h-100">
            <div className="card-body bg-info bg-opacity-10 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <FaClock className="text-info me-2" size={24} />
                    <h5 className="card-title text-info fw-bold mb-0">Near Expiry</h5>
                  </div>
                  <p className="card-text text-muted ms-4">15 items expiring in 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-1 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-3 p-md-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaPills className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold fs-4">1,248</div>
              <div className="label text-muted small">Total Inventory Items</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-1 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-3 p-md-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaFileImport className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold fs-4">42</div>
              <div className="label text-muted small">Pending Requisitions</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-1 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-3 p-md-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaHospitalAlt className="text-info fa-2x" />
              </div>
              <div className="number text-info fw-bold fs-4">6</div>
              <div className="label text-muted small">Facilities Served</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-1 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-3 p-md-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaLaptopMedical className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold fs-4">187</div>
              <div className="label text-muted small">Assets Tracked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Requisitions */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 mb-3">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Consumption Trends</h5>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Line data={consumptionChartData} options={consumptionChartOptions} />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-3">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Stock Distribution</h5>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Doughnut data={stockChartData} options={stockChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requisitions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h5 className="mb-3 mb-md-0 fw-bold">Recent Requisitions</h5>
                <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center">
                  <div className="input-group me-0 me-sm-2 mb-2 mb-sm-0">
                    <input type="text" className="form-control form-control-sm" placeholder="Search..." />
                    <button className="btn btn-sm btn-outline-secondary" type="button">
                      <FaSearch />
                    </button>
                  </div>
             
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover requisition-table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Requisition ID</th>
                      <th>Facility</th>
                      <th className="d-none d-md-table-cell">Requested By</th>
                      <th className="d-none d-md-table-cell">Date</th>
                      <th>Items</th>
                      <th>Status</th>
     
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequisitions.map((req, index) => (
                      <tr key={index}>
                        <td><span className="fw-bold">{req.id}</span></td>
                        <td>{req.facility}</td>
                        <td className="d-none d-md-table-cell">{req.requestedBy}</td>
                        <td className="d-none d-md-table-cell">{req.date}</td>
                        <td>{req.items}</td>
                        <td><StatusBadge status={req.status} /></td>
              
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Generate Custom Report</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold">Report Type</label>
                  <select 
                    className="form-select" 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Inventory Report</option>
                    <option>Consumption Report</option>
                    <option>Requisition Report</option>
                    <option>Dispatch Report</option>
                    <option>Expiry Report</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Date Range</label>
                  <div className="input-group">
                    <input type="date" className="form-control" />
                    <span className="input-group-text">to</span>
                    <input type="date" className="form-control" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Facility</label>
                  <select 
                    className="form-select"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  >
                    <option>All Facilities</option>
                    <option>Main Warehouse</option>
                    <option>Kumasi Branch Hospital</option>
                    <option>Accra Central Hospital</option>
                    <option>Takoradi Clinic</option>
                    <option>Cape Coast Hospital</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                  <FaChartLine className="me-2" /> Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-3">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Report Preview</h5>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Bar data={reportChartData} options={reportChartOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center pt-4">
              <h5 className="mb-0 fw-bold">Facilities Overview</h5>
     
            </div>
            <div className="card-body">
              <div className="row">
                {facilities.map((facility) => (
                  <div className="col-12 col-md-4 mb-3" key={facility.id}>
                    <div className="card border-0 shadow-sm h-100 facility-card">
                      <div className="card-body text-center p-4">
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                          {React.cloneElement(facility.icon, { className: `${facility.icon.props.className} fa-3x` })}
                        </div>
                        <h5 className="fw-bold">{facility.name}</h5>
                        <p className="text-muted">{facility.type}</p>
                        <div className="d-grid gap-2">
                          <button className="btn btn-outline-primary">Manage</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-1 shadow-sm">
            <div className="card-header bg-white border-0 pt-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h5 className="mb-3 mb-md-0 fw-bold">System Users</h5>
                <div className="d-flex flex-column flex-sm-row align-items-stretch align-items-sm-center">
                  <div className="input-group me-0 me-sm-2 mb-2 mb-sm-0">
                    <input type="text" className="form-control form-control-sm" placeholder="Search users..." />
                    <button className="btn btn-sm btn-outline-secondary" type="button">
                      <FaSearch />
                    </button>
                  </div>
           
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th className="d-none d-md-table-cell">Role</th>
                      <th className="d-none d-lg-table-cell">Facility</th>
                      <th className="d-none d-lg-table-cell">Department</th>
                      <th>Status</th>
                      <th className="d-none d-md-table-cell">Last Login</th>

                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td><span className="fw-bold">{user.id}</span></td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-opacity-10 p-2 rounded-circle me-2">
                              <FaUser className="text-secondary" />
                            </div>
                            {user.name}
                          </div>
                        </td>
                        <td className="d-none d-md-table-cell"><RoleBadge role={user.role} /></td>
                        <td className="d-none d-lg-table-cell">{user.facility}</td>
                        <td className="d-none d-lg-table-cell">{user.department}</td>
                        <td><StatusBadge status={user.status} /></td>
                        <td className="d-none d-md-table-cell">{user.lastLogin}</td>
                     
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;