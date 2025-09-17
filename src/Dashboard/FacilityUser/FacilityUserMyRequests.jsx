import React, { useState } from 'react';
import { 
  FaClipboardList, FaEye, FaSearch, FaFilter, FaPaperPlane, 
  FaCheck, FaTimes, FaExclamationTriangle, FaClock, FaCalendarAlt,
  FaPlus, FaTrash
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserMyRequests = () => {
  // State for modals
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestType, setRequestType] = useState('individual'); // 'individual' or 'bulk'
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for new request forms
  const [individualRequest, setIndividualRequest] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    description: ''
  });
  
  const [bulkRequest, setBulkRequest] = useState({
    description: '',
    items: [
      { name: '', quantity: '', unit: '' }
    ]
  });
  
  // Sample data for requests
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      title: 'Medical Supplies Request', 
      description: 'Request for additional medical gloves and face masks', 
      submittedDate: '2023-07-10', 
      status: 'Approved',
      approvedDate: '2023-07-12',
      items: [
        { name: 'Medical Gloves', quantity: 50, unit: 'boxes' },
        { name: 'Face Masks', quantity: 200, unit: 'pieces' }
      ],
      comments: 'Request approved. Items will be available for pickup from the pharmacy.'
    },
    { 
      id: 2, 
      title: 'Surgical Equipment', 
      description: 'Request for new surgical instruments for operating theater', 
      submittedDate: '2023-07-12', 
      status: 'Partially Approved',
      approvedDate: '2023-07-15',
      items: [
        { name: 'Scalpel Set', quantity: 5, unit: 'sets', approved: true },
        { name: 'Forceps', quantity: 10, unit: 'pieces', approved: false }
      ],
      comments: 'Scalpel sets approved. Forceps are out of stock and will be ordered.'
    },
    { 
      id: 3, 
      title: 'Pharmaceutical Items', 
      description: 'Request for various medicines for the ward', 
      submittedDate: '2023-07-14', 
      status: 'Rejected',
      rejectedDate: '2023-07-15',
      items: [
        { name: 'Antibiotics', quantity: 30, unit: 'bottles' },
        { name: 'Painkillers', quantity: 50, unit: 'strips' }
      ],
      comments: 'Request rejected due to budget constraints. Please resubmit next quarter.'
    },
    { 
      id: 4, 
      title: 'PPE Equipment', 
      description: 'Request for personal protective equipment', 
      submittedDate: '2023-07-15', 
      status: 'Pending',
      items: [
        { name: 'Gowns', quantity: 100, unit: 'pieces' },
        { name: 'Face Shields', quantity: 50, unit: 'pieces' }
      ],
      comments: ''
    }
  ]);
  
  // Filter requests based on search term
  const filteredRequests = requests.filter(request => {
    return (
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  // Function to open request details modal
  const openRequestDetails = (request) => {
    setSelectedRequest(request);
    setShowRequestDetailsModal(true);
  };
  
  // Function to get status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved':
        return <FaCheck className="text-success" />;
      case 'Partially Approved':
        return <FaExclamationTriangle className="text-warning" />;
      case 'Rejected':
        return <FaTimes className="text-danger" />;
      default:
        return <FaClock className="text-secondary" />;
    }
  };
  
  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'Approved':
        return 'bg-success';
      case 'Partially Approved':
        return 'bg-warning text-dark';
      case 'Rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };
  
  // Function to handle individual request form change
  const handleIndividualRequestChange = (e) => {
    const { name, value } = e.target;
    setIndividualRequest({
      ...individualRequest,
      [name]: value
    });
  };
  
  // Function to handle bulk request form change
  const handleBulkRequestChange = (e, index = null) => {
    const { name, value } = e.target;
    
    if (index !== null) {
      // Change for a specific item
      const newItems = [...bulkRequest.items];
      newItems[index] = {
        ...newItems[index],
        [name]: value
      };
      setBulkRequest({
        ...bulkRequest,
        items: newItems
      });
    } else {
      // Change for the description
      setBulkRequest({
        ...bulkRequest,
        [name]: value
      });
    }
  };
  
  // Function to add a new item to bulk request
  const addBulkItem = () => {
    setBulkRequest({
      ...bulkRequest,
      items: [...bulkRequest.items, { name: '', quantity: '', unit: '' }]
    });
  };
  
  // Function to remove an item from bulk request
  const removeBulkItem = (index) => {
    if (bulkRequest.items.length > 1) {
      const newItems = [...bulkRequest.items];
      newItems.splice(index, 1);
      setBulkRequest({
        ...bulkRequest,
        items: newItems
      });
    }
  };
  
  // Function to submit a new request
  const submitNewRequest = () => {
    const newRequest = {
      id: requests.length + 1,
      title: requestType === 'individual' ? individualRequest.itemName : 'Bulk Request',
      description: requestType === 'individual' ? individualRequest.description : bulkRequest.description,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      items: requestType === 'individual' 
        ? [{ 
            name: individualRequest.itemName, 
            quantity: individualRequest.quantity, 
            unit: individualRequest.unit 
          }]
        : bulkRequest.items.filter(item => item.name.trim() !== ''),
      comments: ''
    };
    
    setRequests([...requests, newRequest]);
    
    // Reset form
    if (requestType === 'individual') {
      setIndividualRequest({
        itemName: '',
        quantity: '',
        unit: '',
        description: ''
      });
    } else {
      setBulkRequest({
        description: '',
        items: [{ name: '', quantity: '', unit: '' }]
      });
    }
    
    setShowNewRequestModal(false);
  };
  
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h3 mb-1">My Requests</h1>
          <p className="text-muted mb-0">Track and manage your requisition requests</p>
        </div>
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-primary me-3"
            onClick={() => setShowNewRequestModal(true)}
          >
            <FaPlus className="me-2" /> New Request
          </button>
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="bg-light rounded-circle p-2 flex-shrink-0">
            <FaClipboardList size={24} className="text-primary" />
          </div>
        </div>
      </div>
      
      {/* Main Card - Responsive */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 p-3 p-md-4">
          <div className="flex-column flex-md-row d-flex justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0">Request Status Timeline</h5>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
              <div className="input-group input-group-sm">
                <span className="input-group-text"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="btn btn-sm btn-outline-secondary flex-shrink-0">
                <FaFilter />
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th className="d-none d-md-table-cell">Description</th>
                  <th>Submitted Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.title}</td>
                    <td className="d-none d-md-table-cell">{request.description}</td>
                    <td>{request.submittedDate}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                        {getStatusIcon(request.status)} {request.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => openRequestDetails(request)}>
                        <FaEye /> <span className="d-none d-md-inline-block ms-1">View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Request Details Modal - Responsive */}
      <div className={`modal fade ${showRequestDetailsModal ? 'show' : ''}`} style={{ display: showRequestDetailsModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Request Details</h5>
              <button type="button" className="btn-close" onClick={() => setShowRequestDetailsModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedRequest && (
                <>
                  <div className="row mb-4">
                    <div className="col-12 col-md-6">
                      <h4 className="mb-2">{selectedRequest.title}</h4>
                      <p className="text-muted">{selectedRequest.description}</p>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                      <span className={`badge ${getStatusBadgeClass(selectedRequest.status)} fs-6`}>
                        {getStatusIcon(selectedRequest.status)} {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-4 mb-md-0">
                      <h5>Requested Items</h5>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              {selectedRequest.status !== 'Pending' && <th>Status</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedRequest.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                {selectedRequest.status !== 'Pending' && (
                                  <td>
                                    {item.approved === undefined ? (
                                      <span className="badge bg-secondary">N/A</span>
                                    ) : item.approved ? (
                                      <span className="badge bg-success">Approved</span>
                                    ) : (
                                      <span className="badge bg-danger">Rejected</span>
                                    )}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <h5>Status Timeline</h5>
                      <div className="timeline">
                        {/* Submitted Step */}
                        <div className="d-flex align-items-start mb-4">
                          <div className="bg-primary rounded-circle p-2 me-3 flex-shrink-0">
                            <FaPaperPlane className="text-white" />
                          </div>
                          <div>
                            <h6>Submitted</h6>
                            <div className="d-flex align-items-center text-muted">
                              <FaCalendarAlt className="me-2 flex-shrink-0" />
                              <span>{selectedRequest.submittedDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Step */}
                        <div className="d-flex align-items-start">
                          <div className={`rounded-circle p-2 me-3 flex-shrink-0 ${
                            selectedRequest.status === 'Approved' ? 'bg-success' : 
                            selectedRequest.status === 'Partially Approved' ? 'bg-warning' : 
                            selectedRequest.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'
                          }`}>
                            {selectedRequest.status === 'Approved' && <FaCheck className="text-white" />}
                            {selectedRequest.status === 'Partially Approved' && <FaExclamationTriangle className="text-white" />}
                            {selectedRequest.status === 'Rejected' && <FaTimes className="text-white" />}
                            {selectedRequest.status === 'Pending' && <FaClock className="text-white" />}
                          </div>
                          <div>
                            <h6>{selectedRequest.status}</h6>
                            {selectedRequest.status !== 'Pending' && (
                              <div className="d-flex align-items-center text-muted">
                                <FaCalendarAlt className="me-2 flex-shrink-0" />
                                <span>
                                  {selectedRequest.status === 'Approved' && selectedRequest.approvedDate}
                                  {selectedRequest.status === 'Partially Approved' && selectedRequest.approvedDate}
                                  {selectedRequest.status === 'Rejected' && selectedRequest.rejectedDate}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedRequest.comments && (
                    <div className="mb-4">
                      <h5>Comments</h5>
                      <div className="card">
                        <div className="card-body">
                          <p className="mb-0">{selectedRequest.comments}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={() => setShowRequestDetailsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Request Modal */}
      <div className={`modal fade ${showNewRequestModal ? 'show' : ''}`} style={{ display: showNewRequestModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Request</h5>
              <button type="button" className="btn-close" onClick={() => setShowNewRequestModal(false)}></button>
            </div>
            <div className="modal-body">
              {/* Request Type Selection */}
              <div className="d-flex mb-4">
                <div className="form-check me-4">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="requestType" 
                    id="individualRequest" 
                    checked={requestType === 'individual'}
                    onChange={() => setRequestType('individual')}
                  />
                  <label className="form-check-label" htmlFor="individualRequest">
                    Individual Request
                  </label>
                </div>
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="requestType" 
                    id="bulkRequest" 
                    checked={requestType === 'bulk'}
                    onChange={() => setRequestType('bulk')}
                  />
                  <label className="form-check-label" htmlFor="bulkRequest">
                    Bulk Request
                  </label>
                </div>
              </div>
              
              {/* Individual Request Form */}
              {requestType === 'individual' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Item Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="itemName"
                      value={individualRequest.itemName}
                      onChange={handleIndividualRequestChange}
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Quantity</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        name="quantity"
                        value={individualRequest.quantity}
                        onChange={handleIndividualRequestChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Unit</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="unit"
                        value={individualRequest.unit}
                        onChange={handleIndividualRequestChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="description"
                      value={individualRequest.description}
                      onChange={handleIndividualRequestChange}
                    ></textarea>
                  </div>
                </div>
              )}
              
              {/* Bulk Request Form */}
              {requestType === 'bulk' && (
                <div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      name="description"
                      value={bulkRequest.description}
                      onChange={(e) => handleBulkRequestChange(e)}
                    ></textarea>
                  </div>
                  
                  <h5 className="mb-3">Items</h5>
                  {bulkRequest.items.map((item, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-md-5">
                        <label className="form-label">Item Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="name"
                          value={item.name}
                          onChange={(e) => handleBulkRequestChange(e, index)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Quantity</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          name="quantity"
                          value={item.quantity}
                          onChange={(e) => handleBulkRequestChange(e, index)}
                        />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Unit</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="unit"
                          value={item.unit}
                          onChange={(e) => handleBulkRequestChange(e, index)}
                        />
                      </div>
                      <div className="col-md-1 d-flex align-items-end">
                        {bulkRequest.items.length > 1 && (
                          <button 
                            type="button" 
                            className="btn btn-danger"
                            onClick={() => removeBulkItem(index)}
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-primary mb-3"
                    onClick={addBulkItem}
                  >
                    <FaPlus className="me-2" /> Add Item
                  </button>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowNewRequestModal(false)}>Cancel</button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={submitNewRequest}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrops */}
      {showRequestDetailsModal && <div className="modal-backdrop fade show"></div>}
      {showNewRequestModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUserMyRequests;