import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaCamera, FaPaperclip, FaClock, FaBox, FaTruck, FaCalendarAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AcknowledgementOfReceipts = () => {
  // State for dispatched items
  const [dispatchedItems, setDispatchedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  
  // Simulate fetching data
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData = [
      {
        id: 1,
        itemName: 'Paracetamol 500mg',
        batch: 'B789',
        lot: 'L456',
        expiryDate: '2024-06-15',
        quantity: 100,
        dispatchDate: '2023-10-25',
        dispatchTime: '10:30 AM',
        status: 'Pending',
        warehouse: 'Main Warehouse',
        condition: '',
        receiptDate: '',
        receiptTime: '',
        notes: '',
        attachment: null,
        confirmed: false
      },
      {
        id: 2,
        itemName: 'Amoxicillin 500mg',
        batch: 'B234',
        lot: 'L789',
        expiryDate: '2024-05-20',
        quantity: 150,
        dispatchDate: '2023-10-24',
        dispatchTime: '02:15 PM',
        status: 'Pending',
        warehouse: 'Main Warehouse',
        condition: '',
        receiptDate: '',
        receiptTime: '',
        notes: '',
        attachment: null,
        confirmed: false
      },
      {
        id: 3,
        itemName: 'Surgical Gloves',
        batch: 'B567',
        lot: 'L123',
        expiryDate: '2025-01-10',
        quantity: 200,
        dispatchDate: '2023-10-23',
        dispatchTime: '11:45 AM',
        status: 'Pending',
        warehouse: 'Main Warehouse',
        condition: '',
        receiptDate: '',
        receiptTime: '',
        notes: '',
        attachment: null,
        confirmed: false
      }
    ];
    
    // Simulate API delay
    setTimeout(() => {
      setDispatchedItems(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = (id) => {
    setDispatchedItems(items => 
      items.map(item => 
        item.id === id 
          ? { 
              ...item, 
              confirmed: !item.confirmed,
              receiptDate: !item.confirmed ? new Date().toISOString().split('T')[0] : '',
              receiptTime: !item.confirmed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
            } 
          : item
      )
    );
  };

  // Handle condition change
  const handleConditionChange = (id, condition) => {
    setDispatchedItems(items => 
      items.map(item => 
        item.id === id ? { ...item, condition } : item
      )
    );
  };

  // Handle notes change
  const handleNotesChange = (id, notes) => {
    setDispatchedItems(items => 
      items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    );
  };

  // Handle file attachment
  const handleFileAttachment = (id, file) => {
    setDispatchedItems(items => 
      items.map(item => 
        item.id === id ? { ...item, attachment: file } : item
      )
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least one item is confirmed
    const confirmedItems = dispatchedItems.filter(item => item.confirmed);
    if (confirmedItems.length === 0) {
      alert('Please confirm at least one item');
      return;
    }
    
    // Check if all confirmed items have condition specified
    const incompleteItems = confirmedItems.filter(item => !item.condition);
    if (incompleteItems.length > 0) {
      alert('Please specify condition for all confirmed items');
      return;
    }
    
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        // In a real app, we would refresh the data or redirect
      }, 3000);
    }, 1500);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="mb-1">Acknowledgement of Receipts</h2>
          <p className="text-muted mb-0">Confirm receipt of items dispatched from warehouse</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="bg-light rounded-circle p-2 flex-shrink-0">
            <FaTruck size={24} className="text-primary" />
          </div>
        </div>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Your receipt acknowledgement has been submitted.
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      {/* Main Card - Responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading dispatched items...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th width="50">Confirm</th>
                      <th>Item Details</th>
                      <th className="d-none d-md-table-cell">Batch/Lot</th>
                      <th>Expiry Date</th>
                      <th>Quantity</th>
                      <th className="d-none d-lg-table-cell">Dispatch Info</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dispatchedItems.map((item) => (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td>
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                checked={item.confirmed}
                                onChange={() => handleCheckboxChange(item.id)}
                                id={`confirm-${item.id}`}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="me-2">
                                <FaBox className="text-muted" />
                              </div>
                              <div>
                                <div>{item.itemName}</div>
                                <small className="text-muted">ID: {item.id}</small>
                              </div>
                            </div>
                          </td>
                          <td className="d-none d-md-table-cell">
                            <div>
                              <div>Batch: {item.batch}</div>
                              <div className="text-muted">Lot: {item.lot}</div>
                            </div>
                          </td>
                          <td>{formatDate(item.expiryDate)}</td>
                          <td>{item.quantity} units</td>
                          <td className="d-none d-lg-table-cell">
                            <div>
                              <div>{formatDate(item.dispatchDate)}</div>
                              <div className="text-muted">{item.dispatchTime}</div>
                              <div className="text-muted">{item.warehouse}</div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${item.confirmed ? 'bg-success' : 'bg-secondary'}`}>
                              {item.confirmed ? 'Confirmed' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                        {item.confirmed && (
                          <tr>
                            <td colSpan="7" className="p-0">
                              <div className="bg-light p-3 border-start border-4 border-primary">
                                <div className="row">
                                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                                    <h6 className="text-muted mb-2">Receipt Details</h6>
                                    <div className="row g-2">
                                      <div className="col-6">
                                        <label className="form-label small">Date</label>
                                        <input 
                                          type="date" 
                                          className="form-control form-control-sm" 
                                          value={item.receiptDate}
                                          onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                        />
                                      </div>
                                      <div className="col-6">
                                        <label className="form-label small">Time</label>
                                        <input 
                                          type="time" 
                                          className="form-control form-control-sm" 
                                          value={item.receiptTime}
                                          onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6">
                                    <h6 className="text-muted mb-2">Condition</h6>
                                    <select 
                                      className="form-select form-select-sm mb-3" 
                                      value={item.condition}
                                      onChange={(e) => handleConditionChange(item.id, e.target.value)}
                                    >
                                      <option value="">Select condition...</option>
                                      <option value="Good">Good</option>
                                      <option value="Damaged">Damaged</option>
                                      <option value="Partially Damaged">Partially Damaged</option>
                                      <option value="Expired">Expired</option>
                                      <option value="Wrong Item">Wrong Item</option>
                                    </select>
                                  </div>
                                </div>
                                
                                <div className="row mt-3">
                                  <div className="col-12 col-md-6 mb-3 mb-md-0">
                                    <h6 className="text-muted mb-2">Notes</h6>
                                    <textarea 
                                      className="form-control form-control-sm" 
                                      rows="2" 
                                      placeholder="Add any additional notes..."
                                      value={item.notes}
                                      onChange={(e) => handleNotesChange(item.id, e.target.value)}
                                    ></textarea>
                                  </div>
                                  <div className="col-12 col-md-6">
                                    <h6 className="text-muted mb-2">Attachment</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                      <label className="btn btn-outline-primary btn-sm">
                                        <FaCamera className="me-1" /> Photo
                                        <input 
                                          type="file" 
                                          className="d-none" 
                                          accept="image/*"
                                          onChange={(e) => handleFileAttachment(item.id, e.target.files[0])}
                                        />
                                      </label>
                                      <label className="btn btn-outline-secondary btn-sm">
                                        <FaPaperclip className="me-1" /> Document
                                        <input 
                                          type="file" 
                                          className="d-none" 
                                          accept=".pdf,.doc,.docx"
                                          onChange={(e) => handleFileAttachment(item.id, e.target.files[0])}
                                        />
                                      </label>
                                    </div>
                                    {item.attachment && (
                                      <div className="mt-2">
                                        <span className="badge bg-success">
                                          <FaCheckCircle className="me-1" /> {item.attachment.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {dispatchedItems.length === 0 && (
                <div className="text-center py-4">
                  <div className="text-muted">
                    <FaTruck size={24} className="mb-2" />
                    <p>No dispatched items found.</p>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : 'Submit Acknowledgement'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Information Section - Responsive */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title mb-3">About Receipt Acknowledgement</h5>
          <div className="row g-4">
            {/* Confirmation Process Card */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0" style={{ backgroundColor: '#e1f5fe' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 flex-shrink-0">
                      <FaCheck size={24} className="text-primary" />
                    </div>
                    <h5 className="card-title mb-0">Confirmation Process</h5>
                  </div>
                  <p className="card-text">
                    When items are dispatched from the warehouse, you need to confirm receipt by checking the confirmation box. This helps maintain accurate inventory records and ensures timely processing of deliveries.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Important Notes Card */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0" style={{ backgroundColor: '#fff8e1' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 flex-shrink-0">
                      <FaExclamationTriangle size={24} className="text-warning" />
                    </div>
                    <h5 className="card-title mb-0">Important Notes</h5>
                  </div>
                  <p className="card-text">
                    Please inspect all items carefully upon receipt. Report any discrepancies, damages, or issues immediately through the condition field and notes section. Attach photos or documents as evidence when necessary.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgementOfReceipts;