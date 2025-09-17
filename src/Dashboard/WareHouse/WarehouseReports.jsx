import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  FaDownload, FaChartLine, FaWarehouse, FaExchangeAlt, FaClock, FaListAlt, FaBuilding,
  FaFilePdf, FaFileExcel, FaExclamationTriangle, FaCalendarAlt, FaUndo, FaBox, FaEye, FaTimes
} from 'react-icons/fa';

const WarehouseReports = () => {
  // State
  const [reportType, setReportType] = useState('Stock Valuation');
  const [facility, setFacility] = useState('All Facilities');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [valuationMethod, setValuationMethod] = useState('FIFO');
  const [currency, setCurrency] = useState('GHS');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  
  // Chart data
  const reportChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: reportType,
        data: [120, 90, 150, 100, 130],
        backgroundColor: '#3498db',
        borderRadius: 6,
        barThickness: 40
      }
    ]
  };
  
  const reportChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${reportType} Report`,
        font: { size: 16, weight: 'bold' },
        padding: { top: 10, bottom: 20 }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } }
    }
  };

  // Mock data for reports
  const mockReports = {
    'Stock Valuation': [
      { id: 1, item: 'Paracetamol Tablets', batch: 'B123', quantity: 100, unitPrice: 5.00, totalValue: 500.00, valuationMethod: 'FIFO' },
      { id: 2, item: 'Ibuprofen Tablets', batch: 'B456', quantity: 75, unitPrice: 7.50, totalValue: 562.50, valuationMethod: 'FIFO' },
      { id: 3, item: 'Antiseptic Solution', batch: 'B789', quantity: 50, unitPrice: 12.00, totalValue: 600.00, valuationMethod: 'FIFO' },
      { id: 4, item: 'Surgical Gloves', batch: 'B321', quantity: 200, unitPrice: 2.50, totalValue: 500.00, valuationMethod: 'FIFO' },
      { id: 5, item: 'Face Masks', batch: 'B654', quantity: 300, unitPrice: 1.00, totalValue: 300.00, valuationMethod: 'FIFO' }
    ],
    'Stock Movement': [
      { id: 1, item: 'Paracetamol Tablets', batch: 'B123', movementType: 'In', quantity: 100, date: '2023-10-01', facility: 'Main Warehouse' },
      { id: 2, item: 'Paracetamol Tablets', batch: 'B123', movementType: 'Out', quantity: 20, date: '2023-10-05', facility: 'North Branch' },
      { id: 3, item: 'Ibuprofen Tablets', batch: 'B456', movementType: 'In', quantity: 75, date: '2023-10-02', facility: 'Main Warehouse' },
      { id: 4, item: 'Ibuprofen Tablets', batch: 'B456', movementType: 'Out', quantity: 15, date: '2023-10-06', facility: 'South Branch' }
    ],
    'Stock Ageing': [
      { id: 1, item: 'Paracetamol Tablets', batch: 'B123', quantity: 80, daysInStock: 120, value: 400.00 },
      { id: 2, item: 'Ibuprofen Tablets', batch: 'B456', quantity: 60, daysInStock: 90, value: 450.00 },
      { id: 3, item: 'Antiseptic Solution', batch: 'B789', quantity: 30, daysInStock: 200, value: 360.00 },
      { id: 4, item: 'Surgical Gloves', batch: 'B321', quantity: 150, daysInStock: 45, value: 375.00 }
    ],
    'Item Ledger': [
      { id: 1, item: 'Paracetamol Tablets', batch: 'B123', transactionType: 'Receipt', quantity: 100, date: '2023-10-01', reference: 'PO-001' },
      { id: 2, item: 'Paracetamol Tablets', batch: 'B123', transactionType: 'Issue', quantity: 20, date: '2023-10-05', reference: 'DI-001' },
      { id: 3, item: 'Ibuprofen Tablets', batch: 'B456', transactionType: 'Receipt', quantity: 75, date: '2023-10-02', reference: 'PO-002' },
      { id: 4, item: 'Ibuprofen Tablets', batch: 'B456', transactionType: 'Issue', quantity: 15, date: '2023-10-06', reference: 'DI-002' }
    ],
    'Facility Stock View': [
      { id: 1, facility: 'Main Warehouse', totalItems: 15, totalValue: 2500.00, itemCount: 725 },
      { id: 2, facility: 'North Branch', totalItems: 10, totalValue: 1200.00, itemCount: 320 },
      { id: 3, facility: 'South Branch', totalItems: 8, totalValue: 950.00, itemCount: 210 },
      { id: 4, facility: 'East Branch', totalItems: 12, totalValue: 1800.00, itemCount: 450 }
    ],
    'Expired Items Report': [
      { id: 1, item: 'Amoxicillin Capsules', batch: 'B111', quantity: 50, expiryDate: '2023-08-15', value: 250.00 },
      { id: 2, item: 'Vitamin C Tablets', batch: 'B222', quantity: 30, expiryDate: '2023-09-20', value: 90.00 },
      { id: 3, item: 'Cough Syrup', batch: 'B333', quantity: 25, expiryDate: '2023-07-10', value: 125.00 }
    ],
    'Near Expiry Report': [
      { id: 1, item: 'Antibiotic Ointment', batch: 'B444', quantity: 40, expiryDate: '2023-11-30', daysLeft: 45, value: 200.00 },
      { id: 2, item: 'Pain Relief Gel', batch: 'B555', quantity: 60, expiryDate: '2023-12-15', daysLeft: 60, value: 300.00 },
      { id: 3, item: 'Allergy Tablets', batch: 'B666', quantity: 35, expiryDate: '2024-01-10', daysLeft: 86, value: 175.00 }
    ],
    'Return/Recall Summary': [
      { id: 1, item: 'Blood Pressure Monitor', batch: 'B777', quantity: 5, reason: 'Defective', date: '2023-10-01', status: 'Processed' },
      { id: 2, item: 'Digital Thermometer', batch: 'B888', quantity: 3, reason: 'Recall', date: '2023-10-03', status: 'Pending' },
      { id: 3, item: 'Glucose Test Strips', batch: 'B999', quantity: 20, reason: 'Expired', date: '2023-10-05', status: 'Processed' }
    ],
    'Batch-wise Stock Movement': [
      { id: 1, batch: 'B123', item: 'Paracetamol Tablets', openingStock: 100, receipts: 0, issues: 20, closingStock: 80, movementDate: '2023-10-05' },
      { id: 2, batch: 'B456', item: 'Ibuprofen Tablets', openingStock: 75, receipts: 0, issues: 15, closingStock: 60, movementDate: '2023-10-06' },
      { id: 3, batch: 'B789', item: 'Antiseptic Solution', openingStock: 50, receipts: 25, issues: 10, closingStock: 65, movementDate: '2023-10-07' }
    ],
    'Facility-wise Stock Value': [
      { id: 1, facility: 'Main Warehouse', totalValue: 2500.00, currency: 'GHS', percentage: 45.5 },
      { id: 2, facility: 'North Branch', totalValue: 1200.00, currency: 'GHS', percentage: 21.8 },
      { id: 3, facility: 'South Branch', totalValue: 950.00, currency: 'GHS', percentage: 17.3 },
      { id: 4, facility: 'East Branch', totalValue: 1800.00, currency: 'GHS', percentage: 32.7 }
    ]
  };

  // Handle export
  const handleExport = (format) => {
    setExportFormat(format);
    alert(`Exporting report as ${format.toUpperCase()} with filters: 
           Report Type: ${reportType}, 
           Facility: ${facility}, 
           Date Range: ${dateFrom} to ${dateTo}
           ${reportType === 'Stock Valuation' ? `Valuation Method: ${valuationMethod}, Currency: ${currency}` : ''}`);
  };

  // Generate report
  const handleGenerateReport = (e, type = null) => {
    if (e) e.preventDefault();
    
    // Use provided type or current state
    const selectedType = type || reportType;
    
    // Create report object
    const report = {
      type: selectedType,
      title: `${selectedType} Report`,
      filters: {
        facility: facility,
        dateFrom: dateFrom,
        dateTo: dateTo,
        ...(selectedType === 'Stock Valuation' && { valuationMethod, currency })
      },
      data: mockReports[selectedType] || [],
      generatedAt: new Date().toLocaleString()
    };
    
    setGeneratedReport(report);
    setShowReportModal(true);
  };

  // Render report table based on type
  const renderReportTable = () => {
    if (!generatedReport) return null;
    
    const { data } = generatedReport;
    
    switch(generatedReport.type) {
      case 'Stock Valuation':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Unit Price ({currency})</th>
                  <th>Total Value ({currency})</th>
                  <th>Valuation Method</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toFixed(2)}</td>
                    <td>{item.totalValue.toFixed(2)}</td>
                    <td>{item.valuationMethod}</td>
                  </tr>
                ))}
                <tr className="table-primary fw-bold">
                  <td colSpan="4">TOTAL</td>
                  <td>{data.reduce((sum, item) => sum + item.totalValue, 0).toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        );
        
      case 'Stock Movement':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Movement Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Facility</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td><span className={`badge ${item.movementType === 'In' ? 'bg-success' : 'bg-danger'}`}>{item.movementType}</span></td>
                    <td>{item.quantity}</td>
                    <td>{item.date}</td>
                    <td>{item.facility}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Stock Ageing':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Days in Stock</th>
                  <th>Value ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td>{item.quantity}</td>
                    <td>{item.daysInStock}</td>
                    <td>{item.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Item Ledger':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Transaction Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td><span className={`badge ${item.transactionType === 'Receipt' ? 'bg-success' : 'bg-danger'}`}>{item.transactionType}</span></td>
                    <td>{item.quantity}</td>
                    <td>{item.date}</td>
                    <td>{item.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Facility Stock View':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Facility</th>
                  <th>Total Items</th>
                  <th>Item Count</th>
                  <th>Total Value ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.facility}</td>
                    <td>{item.totalItems}</td>
                    <td>{item.itemCount}</td>
                    <td>{item.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Expired Items Report':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Value ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="table-danger">
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td>{item.quantity}</td>
                    <td>{item.expiryDate}</td>
                    <td>{item.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Near Expiry Report':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Value ({currency})</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="table-warning">
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td>{item.quantity}</td>
                    <td>{item.expiryDate}</td>
                    <td>{item.daysLeft}</td>
                    <td>{item.value.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Return/Recall Summary':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Item</th>
                  <th>Batch</th>
                  <th>Quantity</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.item}</td>
                    <td>{item.batch}</td>
                    <td>{item.quantity}</td>
                    <td>{item.reason}</td>
                    <td>{item.date}</td>
                    <td><span className={`badge ${item.status === 'Processed' ? 'bg-success' : 'bg-warning'}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Batch-wise Stock Movement':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Batch</th>
                  <th>Item</th>
                  <th>Opening Stock</th>
                  <th>Receipts</th>
                  <th>Issues</th>
                  <th>Closing Stock</th>
                  <th>Movement Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.batch}</td>
                    <td>{item.item}</td>
                    <td>{item.openingStock}</td>
                    <td>{item.receipts}</td>
                    <td>{item.issues}</td>
                    <td>{item.closingStock}</td>
                    <td>{item.movementDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'Facility-wise Stock Value':
        return (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Facility</th>
                  <th>Total Value ({currency})</th>
                  <th>Percentage of Total</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.facility}</td>
                    <td>{item.totalValue.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{item.percentage}%</span>
                        <div className="progress flex-grow-1" style={{ height: '10px' }}>
                          <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${item.percentage}%` }}
                            aria-valuenow={item.percentage} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      default:
        return <p>No report data available</p>;
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="fw-bold mb-2">Warehouse Reports & Analytics</h2>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown">
            <FaDownload className="me-2" /> Export Report
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#" onClick={() => handleExport('pdf')}><FaFilePdf className="me-2" /> PDF</a></li>
            <li><a className="dropdown-item" href="#" onClick={() => handleExport('excel')}><FaFileExcel className="me-2" /> Excel</a></li>
          </ul>
        </div>
      </div>
      
      <div className="row">
        {/* Generate Custom Report */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold">Generate Custom Report</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleGenerateReport}>
                {/* Report Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Report Type</label>
                  <select 
                    className="form-select"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>Stock Valuation</option>
                    <option>Stock Movement</option>
                    <option>Stock Ageing</option>
                    <option>Item Ledger</option>
                    <option>Facility Stock View</option>
                    <option>Expired Items Report</option>
                    <option>Near Expiry Report</option>
                    <option>Return/Recall Summary</option>
                    <option>Batch-wise Stock Movement</option>
                    <option>Facility-wise Stock Value</option>
                  </select>
                </div>
                
                {/* Valuation Method - Only for Stock Valuation */}
                {reportType === 'Stock Valuation' && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Valuation Method</label>
                    <select 
                      className="form-select"
                      value={valuationMethod}
                      onChange={(e) => setValuationMethod(e.target.value)}
                    >
                      <option value="FIFO">FIFO</option>
                      <option value="Moving Average">Moving Average</option>
                    </select>
                  </div>
                )}
                
                {/* Currency - Only for Stock Valuation */}
                {reportType === 'Stock Valuation' && (
                  <div className="mb-3">
                    <label className="form-label fw-bold">Currency</label>
                    <select 
                      className="form-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="GHS">GHS (Ghanaian Cedi)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="GBP">GBP (British Pound)</option>
                    </select>
                  </div>
                )}
                
                {/* Date Range */}
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
                
                {/* Facility */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Facility</label>
                  <select 
                    className="form-select"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                  >
                    <option>All Facilities</option>
                    <option>Main Warehouse</option>
                    <option>North Branch</option>
                    <option>South Branch</option>
                    <option>East Branch</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                  <FaChartLine className="me-2" /> Generate Report
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Chart Preview */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Report Preview</h5>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  <FaDownload className="me-1" /> Export
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#" onClick={() => handleExport('pdf')}><FaFilePdf className="me-2" /> PDF</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleExport('excel')}><FaFileExcel className="me-2" /> Excel</a></li>
                </ul>
              </div>
            </div>
            <div className="card-body" style={{ height: '320px' }}>
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
            {/* Stock Valuation */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaWarehouse className="text-primary fa-2x" />
                  </div>
                  <h6 className="fw-bold">Stock Valuation</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Stock Valuation')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stock Movement */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaExchangeAlt className="text-success fa-2x" />
                  </div>
                  <h6 className="fw-bold">Stock Movement</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Stock Movement')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Stock Ageing */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaClock className="text-warning fa-2x" />
                  </div>
                  <h6 className="fw-bold">Stock Ageing</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Stock Ageing')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Item Ledger */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaListAlt className="text-danger fa-2x" />
                  </div>
                  <h6 className="fw-bold">Item Ledger</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Item Ledger')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Facility Stock View */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaBuilding className="text-info fa-2x" />
                  </div>
                  <h6 className="fw-bold">Facility Stock View</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Facility Stock View')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Expired Items Report */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaExclamationTriangle className="text-danger fa-2x" />
                  </div>
                  <h6 className="fw-bold">Expired Items</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Expired Items Report')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Near Expiry Report */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaCalendarAlt className="text-warning fa-2x" />
                  </div>
                  <h6 className="fw-bold">Near Expiry</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Near Expiry Report')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Return/Recall Summary */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-secondary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaUndo className="text-secondary fa-2x" />
                  </div>
                  <h6 className="fw-bold">Return/Recall</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Return/Recall Summary')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Batch-wise Stock Movement */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaBox className="text-primary fa-2x" />
                  </div>
                  <h6 className="fw-bold">Batch Movement</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Batch-wise Stock Movement')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
            
            {/* Facility-wise Stock Value */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-3">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaBuilding className="text-success fa-2x" />
                  </div>
                  <h6 className="fw-bold">Facility Value</h6>
                  <button 
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() => handleGenerateReport(null, 'Facility-wise Stock Value')}
                  >
                    <FaChartLine className="me-2" /> Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      {showReportModal && generatedReport && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowReportModal(false);
        }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">{generatedReport.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {generatedReport.filters.facility}</p>
                    <p><strong>Date Range:</strong> {generatedReport.filters.dateFrom || 'Not specified'} to {generatedReport.filters.dateTo || 'Not specified'}</p>
                    {generatedReport.filters.valuationMethod && (
                      <p><strong>Valuation Method:</strong> {generatedReport.filters.valuationMethod}</p>
                    )}
                    {generatedReport.filters.currency && (
                      <p><strong>Currency:</strong> {generatedReport.filters.currency}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p><strong>Generated At:</strong> {generatedReport.generatedAt}</p>
                    <p><strong>Total Records:</strong> {generatedReport.data.length}</p>
                  </div>
                </div>
                
                {renderReportTable()}
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowReportModal(false)}>
                  <FaTimes className="me-2" /> Close
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={() => handleExport('pdf')}>
                  <FaFilePdf className="me-2" /> Export PDF
                </button>
                <button type="button" className="btn btn-success px-4" onClick={() => handleExport('excel')}>
                  <FaFileExcel className="me-2" /> Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {showReportModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseReports;