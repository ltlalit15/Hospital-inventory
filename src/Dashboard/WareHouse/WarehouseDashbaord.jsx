import React, { useState } from 'react';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  FaPills, FaExclamationTriangle, FaExclamationCircle, FaClock, FaFileImport, FaTruckLoading,
  FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaMoneyBillWave, FaFilter
} from 'react-icons/fa';

// Mock Data
const consumptionData = [
  { month: 'Jan', Medical: 65, Pharma: 28, Consumables: 45 },
  { month: 'Feb', Medical: 59, Pharma: 48, Consumables: 35 },
  { month: 'Mar', Medical: 80, Pharma: 40, Consumables: 50 },
  { month: 'Apr', Medical: 81, Pharma: 45, Consumables: 55 },
  { month: 'May', Medical: 56, Pharma: 56, Consumables: 45 },
  { month: 'Jun', Medical: 55, Pharma: 65, Consumables: 35 },
  { month: 'Jul', Medical: 72, Pharma: 52, Consumables: 40 },
  { month: 'Aug', Medical: 68, Pharma: 59, Consumables: 48 },
  { month: 'Sep', Medical: 75, Pharma: 66, Consumables: 52 },
  { month: 'Oct', Medical: 70, Pharma: 71, Consumables: 58 },
];

const stockData = [
  { name: 'Pharmaceuticals', value: 45, color: '#3498db' },
  { name: 'Medical Supplies', value: 25, color: '#2ecc71' },
  { name: 'Consumables', value: 20, color: '#f39c12' },
  { name: 'Equipment', value: 10, color: '#9b59b6' },
];

const quarterlyData = [
  { quarter: 'Q1', value: 65 },
  { quarter: 'Q2', value: 59 },
  { quarter: 'Q3', value: 80 },
  { quarter: 'Q4', value: 81 },
];

const recentRequisitions = [
  { id: '#REQ-0042', facility: 'Kumasi Branch', requestedBy: 'Dr. Amoah', date: '24 Oct 2023', items: '12 items', status: 'Pending' },
  { id: '#REQ-0041', facility: 'Accra Central', requestedBy: 'Nurse Adwoa', date: '23 Oct 2023', items: '8 items', status: 'Dispatched' },
  { id: '#REQ-0040', facility: 'Takoradi Clinic', requestedBy: 'Dr. Mensah', date: '22 Oct 2023', items: '5 items', status: 'Partially Approved' },
  { id: '#REQ-0039', facility: 'Cape Coast', requestedBy: 'Pharm. Kofi', date: '21 Oct 2023', items: '15 items', status: 'Completed' },
];

// Status Badge Component
const StatusBadge = ({ status }) => {
  const colors = {
    Pending: 'bg-warning',
    Dispatched: 'bg-success',
    'Partially Approved': 'bg-info',
    Completed: 'bg-success',
  };
  return <span className={`badge ${colors[status] || 'bg-secondary'} rounded-pill`}>{status}</span>;
};

const WarehouseDashboard = () => {
  const [reportType, setReportType] = useState('Inventory Report');
  const [facility, setFacility] = useState('All Facilities');

  // ✅ NEW: Filter States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedABC, setSelectedABC] = useState('All');
  const [selectedExpiry, setSelectedExpiry] = useState('All');

  // ✅ NEW: Total Net Value (Mock - You can replace with API)
  const totalNetValue = 345678.00; // in GHS
  const valuationMethod = "FIFO"; // or "Moving Avg"

  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-primary">Warehouse Dashboard</h2>
          <p className="text-muted">Real-time inventory and dispatch analytics</p>
        </div>
      </div>

      {/* ✅ NEW: FILTER BAR */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <div className="d-flex align-items-center">
              <FaFilter className="me-2 text-muted" />
              <strong className="me-2">Filters:</strong>
            </div>
            <select 
              className="form-select form-select-sm w-auto" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Pharma">Pharmaceuticals</option>
              <option value="Medical">Medical Supplies</option>
              <option value="Consumables">Consumables</option>
              <option value="Equipment">Equipment</option>
            </select>
            <select 
              className="form-select form-select-sm w-auto" 
              value={selectedABC} 
              onChange={(e) => setSelectedABC(e.target.value)}
            >
              <option value="All">All ABC Classes</option>
              <option value="A">Class A</option>
              <option value="B">Class B</option>
              <option value="C">Class C</option>
            </select>
            <select 
              className="form-select form-select-sm w-auto" 
              value={selectedExpiry} 
              onChange={(e) => setSelectedExpiry(e.target.value)}
            >
              <option value="All">All Expiry Horizons</option>
              <option value="3m">Expiring in 3 Months</option>
              <option value="6m">Expiring in 6 Months</option>
              <option value="12m">Expiring in 12 Months</option>
            </select>
          </div>
        </div>
      </div>
{/* ✅ KPI CARDS - 3 PER ROW WITH HOVER */}
<div className="row g-4 mb-4">
  {[
    { icon: <FaPills className="text-primary" size={18} />, label: 'Total Stock', value: '1,248', bg: 'primary', color: 'text-primary' },
    { icon: <FaExclamationTriangle className="text-warning" size={18} />, label: 'Low Stock', value: '23', bg: 'warning', color: 'text-warning' },
    { icon: <FaExclamationCircle className="text-danger" size={18} />, label: 'Out of Stock', value: '8', bg: 'danger', color: 'text-danger' },
    { icon: <FaClock className="text-info" size={18} />, label: 'Near Expiry', value: '15', bg: 'info', color: 'text-info' },
    { icon: <FaFileImport className="text-secondary" size={18} />, label: 'Pending Reqs', value: '42', bg: 'secondary', color: 'text-secondary' },
    { icon: <FaTruckLoading className="text-success" size={18} />, label: 'Dispatches Today', value: '17', bg: 'success', color: 'text-success' },

    // ✅ NEW CARD: Total Net Value
    { 
      icon: <FaMoneyBillWave className="text-dark" size={18} />, 
      label: `Total Net Value (${valuationMethod})`, 
      value: `₵ ${totalNetValue.toLocaleString()}`, 
      bg: 'dark', 
      color: 'text-dark' 
    },
  ].map((item, idx) => (
    <div className="col-12 col-md-4" key={idx}>
      {/* Custom Card with Ellipse Background */}
      <div 
        className="card border-0 shadow-sm text-center bg-light rounded-4 transition-all"
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }}
      >
        {/* Top Ellipse Section */}
        <div 
          className={`bg-${item.bg} bg-opacity-10 p-3 d-flex justify-content-center align-items-center`}
          style={{
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            height: '60px',
            backgroundColor: item.bg === 'dark' ? '#f8f9fa' : `var(--bs-${item.bg}-rgb)`,
            background: item.bg === 'dark' ? '#f8f9fa' : `rgba(var(--bs-${item.bg}-rgb), 0.1)`,
          }}
        >
          {/* Icon inside a small circle */}
          <div 
            className={`d-flex align-items-center justify-content-center rounded-circle ${item.color}`}
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: item.bg === 'dark' ? '#e9ecef' : `var(--bs-${item.bg}-rgb)`,
              opacity: 0.9,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            {item.icon}
          </div>
        </div>

        {/* Bottom Content */}
        <div className="p-4">
          <h4 className={`fw-bold ${item.color} mb-1`}>{item.value}</h4>
          <small className="text-muted">{item.label}</small>
        </div>
      </div>
    </div>
  ))}
</div>

      {/* Charts Row */}
      <div className="row g-4 mb-4 mt-2">
        {/* Consumption Trends */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 fw-bold">Consumption Trends (Last 10 Months)</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="Medical" stroke="#3498db" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Pharma" stroke="#2ecc71" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Consumables" stroke="#f39c12" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stock Distribution - PieChart */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 fw-bold">Stock by Category</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requisitions */}
      <div className="row mb-4 mt-2 bg-light">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Recent Requisitions</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>ID</th>
                      <th>Facility</th>
                      <th>Requested By</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequisitions.map((req, idx) => (
                      <tr key={idx}>
                        <td className="fw-bold">{req.id}</td>
                        <td>{req.facility}</td>
                        <td>{req.requestedBy}</td>
                        <td>{req.date}</td>
                        <td>{req.items}</td>
                        <td><StatusBadge status={req.status} /></td>
                        <td>
                          <button className="btn btn-sm btn-outline-secondary me-1">
                            <FaEye size={12} />
                          </button>
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <FaEdit size={12} />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <FaTrash size={12} />
                          </button>
                        </td>
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
      <div className="row g-4 bg-light">
        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 fw-bold">Generate Report</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-bold">Report Type</label>
                  <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                    <option>Inventory Report</option>
                    <option>Consumption Report</option>
                    <option>Requisition Report</option>
                    <option>Expiry Report</option>
                    {/* ✅ NEW OPTION */}
                    <option>Stock Valuation Report (FIFO/Moving Avg)</option>
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
                  <select className="form-select" value={facility} onChange={(e) => setFacility(e.target.value)}>
                    <option>All Facilities</option>
                    <option>Main Warehouse</option>
                    <option>Kumasi Branch</option>
                    <option>Accra Central</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  <FaTruckLoading className="me-2" /> Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 fw-bold">Quarterly Inventory Value</h5>
            </div>
            <div className="card-body" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="value" fill="#3498db" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;