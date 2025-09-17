import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaBox, FaCalendarAlt, FaMapMarkerAlt, FaClipboardList, FaHistory } from 'react-icons/fa';

const ReturnsRecalls = () => {
  // State for form inputs
  const [reason, setReason] = useState('');
  const [items, setItems] = useState([{ id: 1, name: '', quantity: '', batchNumber: '' }]);
  const [quarantineLocation, setQuarantineLocation] = useState('');
  
  // State for return requests
  const [returnRequests, setReturnRequests] = useState([
    {
      id: 1,
      reason: 'Near expiry',
      items: [
        { name: 'Antibiotics', quantity: '50', batchNumber: 'B12345' },
        { name: 'Painkillers', quantity: '30', batchNumber: 'B67890' }
      ],
      quarantineLocation: 'Warehouse A',
      status: 'Pending QA',
      date: '2023-05-15',
      auditTrail: [
        { action: 'Return request created', user: 'John Doe', timestamp: '2023-05-15 09:30' },
        { action: 'Items moved to Quarantine Zone', user: 'System', timestamp: '2023-05-15 10:15' }
      ]
    },
    {
      id: 2,
      reason: 'Recall',
      items: [
        { name: 'Vitamin C', quantity: '100', batchNumber: 'C54321' }
      ],
      quarantineLocation: 'Warehouse B',
      status: 'Approved',
      date: '2023-05-10',
      auditTrail: [
        { action: 'Return request created', user: 'Jane Smith', timestamp: '2023-05-10 14:20' },
        { action: 'Items moved to Quarantine Zone', user: 'System', timestamp: '2023-05-10 15:45' },
        { action: 'QA review completed - Approved', user: 'Dr. James', timestamp: '2023-05-12 11:30' }
      ]
    }
  ]);

  // Add new item row
  const addItemRow = () => {
    setItems([...items, { id: items.length + 1, name: '', quantity: '', batchNumber: '' }]);
  };

  // Remove item row
  const removeItemRow = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  // Handle item input change
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Submit new return request
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newRequest = {
      id: returnRequests.length + 1,
      reason,
      items,
      quarantineLocation,
      status: 'Pending QA',
      date: new Date().toISOString().split('T')[0],
      auditTrail: [
        { action: 'Return request created', user: 'Current User', timestamp: new Date().toLocaleString() }
      ]
    };
    
    setReturnRequests([newRequest, ...returnRequests]);
    
    // Reset form
    setReason('');
    setItems([{ id: 1, name: '', quantity: '', batchNumber: '' }]);
    setQuarantineLocation('');
  };

  // Handle QA action
  const handleQAAction = (id, action) => {
    const updatedRequests = returnRequests.map(request => {
      if (request.id === id) {
        const newStatus = action === 'Accept' ? 'Approved' : action === 'Reject' ? 'Rejected' : 'Destroyed';
        const newAuditTrail = [
          ...request.auditTrail,
          { 
            action: `QA review completed - ${action}`, 
            user: 'QA Officer', 
            timestamp: new Date().toLocaleString() 
          }
        ];
        
        return {
          ...request,
          status: newStatus,
          auditTrail: newAuditTrail
        };
      }
      return request;
    });
    
    setReturnRequests(updatedRequests);
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending QA': return 'bg-warning';
      case 'Approved': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      case 'Destroyed': return 'bg-dark';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0"><FaClipboardList className="me-2" /> Returns & Recalls</h2>
      </div>
      
      <div className="row">
        {/* Create Return Request Form */}
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header text-black">
              <h5 className="mb-0"><FaPlus className="me-2" /> Create Return Request</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Return Reason</label>
                  <select 
                    className="form-select" 
                    value={reason} 
                    onChange={(e) => setReason(e.target.value)}
                    required
                  >
                    <option value="">Select reason</option>
                    <option value="Galat item">Galat item</option>
                    <option value="Near expiry">Near expiry</option>
                    <option value="Recall">Recall</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Items</label>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Batch #</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.name}
                                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <input 
                                type="text" 
                                className="form-control form-control-sm" 
                                value={item.batchNumber}
                                onChange={(e) => handleItemChange(item.id, 'batchNumber', e.target.value)}
                                required
                              />
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className="btn btn-sm btn-danger"
                                onClick={() => removeItemRow(item.id)}
                                disabled={items.length === 1}
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={addItemRow}
                  >
                    <FaPlus className="me-1" /> Add Item
                  </button>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Quarantine Location</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={quarantineLocation}
                    onChange={(e) => setQuarantineLocation(e.target.value)}
                    placeholder="e.g., Warehouse A, Section B"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary w-100">
                  Submit Return Request
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Return Requests List */}
        <div className="col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header text-black">
              <h5 className="mb-0"><FaHistory className="me-2" /> Return Requests</h5>
            </div>
            <div className="card-body">
              {returnRequests.length === 0 ? (
                <p className="text-center text-muted">No return requests found</p>
              ) : (
                <div className="accordion" id="returnRequestsAccordion">
                  {returnRequests.map((request) => (
                    <div className="accordion-item mb-3" key={request.id}>
                      <h2 className="accordion-header" id={`heading${request.id}`}>
                        <button 
                          className="accordion-button collapsed" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#collapse${request.id}`}
                        >
                          <div className="d-flex w-100 justify-content-between align-items-center">
                            <span>
                              <strong>Request #{request.id}</strong> - {request.reason}
                            </span>
                            <span className={`badge ${getStatusClass(request.status)}`}>
                              {request.status}
                            </span>
                          </div>
                        </button>
                      </h2>
                      <div 
                        id={`collapse${request.id}`} 
                        className="accordion-collapse collapse" 
                        data-bs-parent="#returnRequestsAccordion"
                      >
                        <div className="accordion-body">
                          <div className="row mb-3">
                            <div className="col-md-6">
                              <h6><FaCalendarAlt className="me-2" /> Date: {request.date}</h6>
                              <h6><FaMapMarkerAlt className="me-2" /> Quarantine: {request.quarantineLocation}</h6>
                            </div>
                            <div className="col-md-6 text-end">
                              {request.status === 'Pending QA' && (
                                <>
                                  <button 
                                    className="btn btn-success btn-sm me-2"
                                    onClick={() => handleQAAction(request.id, 'Accept')}
                                  >
                                    <FaCheck className="me-1" /> Accept
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleQAAction(request.id, 'Reject')}
                                  >
                                    <FaTimes className="me-1" /> Reject
                                  </button>
                                  <button 
                                    className="btn btn-dark btn-sm"
                                    onClick={() => handleQAAction(request.id, 'Destroy')}
                                  >
                                    <FaTrash className="me-1" /> Destroy
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <h6><FaBox className="me-2" /> Items</h6>
                          <div className="table-responsive mb-4">
                            <table className="table table-sm table-bordered">
                              <thead className="table-light">
                                <tr>
                                  <th>Item Name</th>
                                  <th>Quantity</th>
                                  <th>Batch #</th>
                                </tr>
                              </thead>
                              <tbody>
                                {request.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.batchNumber}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <h6><FaHistory className="me-2" /> Audit Trail</h6>
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead className="table-light">
                                <tr>
                                  <th>Action</th>
                                  <th>User</th>
                                  <th>Timestamp</th>
                                </tr>
                              </thead>
                              <tbody>
                                {request.auditTrail.map((log, index) => (
                                  <tr key={index}>
                                    <td>{log.action}</td>
                                    <td>{log.user}</td>
                                    <td>{log.timestamp}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsRecalls;