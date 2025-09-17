import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  FaDownload, FaChartLine, FaSearch, FaCalendarAlt, FaBuilding,
  FaTable, FaFilePdf, FaFileExcel, FaTimes
} from 'react-icons/fa';

const SuperAdminReports = () => {
  // State for form inputs
  const [reportType, setReportType] = useState('Inventory Report');
  const [facility, setFacility] = useState('All Facilities');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // State for modals
  const [showMonthlyModal, setShowMonthlyModal] = useState(false);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  
  // State for generated report data
  const [generatedReport, setGeneratedReport] = useState(null);
  
  // Chart data and options
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
  
  // Mock data for different report types
  const monthlyInventoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Inventory Value',
        data: [120, 150, 180, 90, 160, 200],
        backgroundColor: '#4e73df',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  const facilityUsageData = {
    labels: ['Main Warehouse', 'Kumasi Hospital', 'Accra Hospital', 'Takoradi Clinic', 'Cape Coast Hospital'],
    datasets: [
      {
        label: 'Usage %',
        data: [85, 65, 75, 45, 60],
        backgroundColor: '#1cc88a',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  const expiryData = {
    labels: ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024'],
    datasets: [
      {
        label: 'Items Expiring',
        data: [12, 19, 8, 15, 10],
        backgroundColor: '#f6c23e',
        borderRadius: 8,
        barThickness: 30
      }
    ]
  };
  
  // Mock report data for table view
  const reportTableData = [
    { id: 'DRG-001', name: 'Paracetamol 500mg', category: 'Pharmaceutical', stock: 150, value: 7500 },
    { id: 'DRG-002', name: 'Amoxicillin 250mg', category: 'Pharmaceutical', stock: 80, value: 4000 },
    { id: 'SUP-001', name: 'Surgical Gloves', category: 'Medical Supply', stock: 200, value: 6000 },
    { id: 'CON-001', name: 'Syringe 5ml', category: 'Consumable', stock: 500, value: 2500 }
  ];
  
  // Modal handlers
  const openMonthlyModal = () => {
    setShowMonthlyModal(true);
  };
  
  const openFacilityModal = () => {
    setShowFacilityModal(true);
  };
  
  const openExpiryModal = () => {
    setShowExpiryModal(true);
  };
  
  const openCustomModal = () => {
    setShowCustomModal(true);
  };
  
  const handleGenerateReport = (e) => {
    e.preventDefault();
    // In a real app, this would generate the report based on form inputs
    setGeneratedReport({
      type: reportType,
      facility: facility,
      dateFrom: dateFrom,
      dateTo: dateTo,
      data: reportTableData
    });
    setShowGeneratedModal(true);
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Reports & Analytics</h2>
        <button className="btn btn-primary d-flex align-items-center">
          <FaDownload className="me-2" /> Export Report
        </button>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Generate Custom Report</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleGenerateReport}>
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
                    <input 
                      type="date" 
                      className="form-control" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <span className="input-group-text">to</span>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
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
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Report Preview</h5>
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <Bar data={reportChartData} options={reportChartOptions} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Reports */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Quick Reports</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaCalendarAlt className="text-primary fa-2x" />
                  </div>
                  <h6 className="fw-bold">Monthly Inventory</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openMonthlyModal}>Generate</button>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaBuilding className="text-success fa-2x" />
                  </div>
                  <h6 className="fw-bold">Facility Usage</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openFacilityModal}>Generate</button>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaDownload className="text-warning fa-2x" />
                  </div>
                  <h6 className="fw-bold">Expiry Report</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openExpiryModal}>Generate</button>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaSearch className="text-info fa-2x" />
                  </div>
                  <h6 className="fw-bold">Custom Report</h6>
                  <button className="btn btn-sm btn-outline-primary mt-2" onClick={openCustomModal}>Generate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Inventory Modal */}
      {showMonthlyModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Monthly Inventory Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowMonthlyModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar data={monthlyInventoryData} options={{
                    ...reportChartOptions,
                    plugins: {
                      ...reportChartOptions.plugins,
                      title: {
                        ...reportChartOptions.plugins.title,
                        text: 'Monthly Inventory Value'
                      }
                    }
                  }} />
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>Summary</h6>
                    <p>Total Inventory Value: <span className="fw-bold">$48,500</span></p>
                    <p>Average Monthly Value: <span className="fw-bold">$8,083</span></p>
                  </div>
                  <div className="d-flex align-items-end">
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Facility Usage Modal */}
      {showFacilityModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Facility Usage Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowFacilityModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar data={facilityUsageData} options={{
                    ...reportChartOptions,
                    plugins: {
                      ...reportChartOptions.plugins,
                      title: {
                        ...reportChartOptions.plugins.title,
                        text: 'Facility Usage Percentage'
                      }
                    }
                  }} />
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Facility</th>
                        <th>Usage %</th>
                        <th>Items Consumed</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Main Warehouse</td>
                        <td>85%</td>
                        <td>1,250</td>
                        <td>$12,500</td>
                      </tr>
                      <tr>
                        <td>Kumasi Hospital</td>
                        <td>65%</td>
                        <td>850</td>
                        <td>$8,500</td>
                      </tr>
                      <tr>
                        <td>Accra Hospital</td>
                        <td>75%</td>
                        <td>950</td>
                        <td>$9,500</td>
                      </tr>
                      <tr>
                        <td>Takoradi Clinic</td>
                        <td>45%</td>
                        <td>420</td>
                        <td>$4,200</td>
                      </tr>
                      <tr>
                        <td>Cape Coast Hospital</td>
                        <td>60%</td>
                        <td>680</td>
                        <td>$6,800</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-primary me-2">
                    <FaFilePdf className="me-2" /> Export PDF
                  </button>
                  <button className="btn btn-success">
                    <FaFileExcel className="me-2" /> Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expiry Report Modal */}
      {showExpiryModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Expiry Report</h5>
                <button type="button" className="btn-close" onClick={() => setShowExpiryModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <Bar data={expiryData} options={{
                    ...reportChartOptions,
                    plugins: {
                      ...reportChartOptions.plugins,
                      title: {
                        ...reportChartOptions.plugins.title,
                        text: 'Items Expiring by Month'
                      }
                    }
                  }} />
                </div>
                <div className="alert alert-warning">
                  <strong>Attention:</strong> 64 items are expiring within the next 3 months. Please take necessary action.
                </div>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Expiry Date</th>
                        <th>Quantity</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>DRG-0421</td>
                        <td>Paracetamol 500mg</td>
                        <td>Pharmaceutical</td>
                        <td>15 Jan 2024</td>
                        <td>120</td>
                        <td>$600</td>
                      </tr>
                      <tr>
                        <td>DRG-2087</td>
                        <td>Amoxicillin 250mg</td>
                        <td>Pharmaceutical</td>
                        <td>28 Feb 2024</td>
                        <td>80</td>
                        <td>$400</td>
                      </tr>
                      <tr>
                        <td>CON-1543</td>
                        <td>Syringe 5ml</td>
                        <td>Consumable</td>
                        <td>10 Mar 2024</td>
                        <td>200</td>
                        <td>$1,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-end mt-3">
                  <button className="btn btn-primary me-2">
                    <FaFilePdf className="me-2" /> Export PDF
                  </button>
                  <button className="btn btn-success">
                    <FaFileExcel className="me-2" /> Export Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Report Modal */}
      {showCustomModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Custom Report Builder</h5>
                <button type="button" className="btn-close" onClick={() => setShowCustomModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Report Type</label>
                      <select className="form-select">
                        <option>Inventory Report</option>
                        <option>Consumption Report</option>
                        <option>Requisition Report</option>
                        <option>Dispatch Report</option>
                        <option>Expiry Report</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Facility</label>
                      <select className="form-select">
                        <option>All Facilities</option>
                        <option>Main Warehouse</option>
                        <option>Kumasi Branch Hospital</option>
                        <option>Accra Central Hospital</option>
                        <option>Takoradi Clinic</option>
                        <option>Cape Coast Hospital</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Date From</label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date To</label>
                      <input type="date" className="form-control" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Report Columns</label>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="col1" defaultChecked />
                      <label className="form-check-label" htmlFor="col1">
                        Item ID
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="col2" defaultChecked />
                      <label className="form-check-label" htmlFor="col2">
                        Item Name
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="col3" defaultChecked />
                      <label className="form-check-label" htmlFor="col3">
                        Category
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="col4" />
                      <label className="form-check-label" htmlFor="col4">
                        Stock Quantity
                      </label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="col5" />
                      <label className="form-check-label" htmlFor="col5">
                        Value
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Chart Type</label>
                    <select className="form-select">
                      <option>Bar Chart</option>
                      <option>Line Chart</option>
                      <option>Pie Chart</option>
                      <option>No Chart</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowCustomModal(false)}>
                      Cancel
                    </button>
                    <button type="button" className="btn btn-primary">
                      Generate Report
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Report Modal */}
      {showGeneratedModal && generatedReport && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{generatedReport.type} - {generatedReport.facility}</h5>
                <button type="button" className="btn-close" onClick={() => setShowGeneratedModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <p><strong>Date Range:</strong> {generatedReport.dateFrom} to {generatedReport.dateTo}</p>
                    <p><strong>Generated On:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <button className="btn btn-primary me-2">
                      <FaFilePdf className="me-2" /> Export PDF
                    </button>
                    <button className="btn btn-success">
                      <FaFileExcel className="me-2" /> Export Excel
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Bar data={reportChartData} options={{
                    ...reportChartOptions,
                    plugins: {
                      ...reportChartOptions.plugins,
                      title: {
                        ...reportChartOptions.plugins.title,
                        text: generatedReport.type
                      }
                    }
                  }} />
                </div>
                
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item ID</th>
                        <th>Item Name</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedReport.data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>{item.stock}</td>
                          <td>${item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 p-3 bg-light rounded">
                  <h6>Report Summary</h6>
                  <p>Total Items: <span className="fw-bold">{generatedReport.data.length}</span></p>
                  <p>Total Stock Value: <span className="fw-bold">${generatedReport.data.reduce((sum, item) => sum + item.value, 0)}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showMonthlyModal || showFacilityModal || showExpiryModal || showCustomModal || showGeneratedModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminReports;