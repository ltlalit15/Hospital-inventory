import React, { useState } from 'react';
import { FaPlus, FaSearch, FaEye, FaFilePdf } from 'react-icons/fa';

const WarehouseRequisitions = () => {
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // State for current requisition
  const [currentRequisition, setCurrentRequisition] = useState(null);
  const [rejectingRequisition, setRejectingRequisition] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // State for new requisition form
  const [newRequisition, setNewRequisition] = useState({
    facility: '',
    department: '',
    requestedBy: '',
    items: '',
    priority: 'Medium',
    reason: ''
  });
  
  // Mock data for requisitions (admin can create, view, approve, reject)
  const [requisitions, setRequisitions] = useState([
    { 
      id: '#REQ-0042', 
      facility: 'Kumasi Branch Hospital', 
      department: 'Emergency', 
      requestedBy: 'Dr. Amoah', 
      date: '24 Oct 2023', 
      items: '12 items', 
      priority: 'High', 
      status: 'Pending Review',
      details: [
        { name: 'Paracetamol 500mg', quantity: 100, unit: 'Tablets' },
        { name: 'Surgical Gloves', quantity: 50, unit: 'Pairs' },
        { name: 'Syringe 5ml', quantity: 200, unit: 'Pieces' }
      ],
      approvedBy: null,
      approvedDate: null,
      rejectedBy: null,
      rejectedDate: null,
      rejectionReason: null
    },
    { 
      id: '#REQ-0040', 
      facility: 'Takoradi Clinic', 
      department: 'Pharmacy', 
      requestedBy: 'Dr. Mensah', 
      date: '22 Oct 2023', 
      items: '5 items', 
      priority: 'Medium', 
      status: 'Submitted',
      details: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ],
      approvedBy: null,
      approvedDate: null,
      rejectedBy: null,
      rejectedDate: null,
      rejectionReason: null
    },
    { 
      id: '#REQ-0038', 
      facility: 'Accra Central Hospital', 
      department: 'Laboratory', 
      requestedBy: 'Lab Tech. Ama', 
      date: '20 Oct 2023', 
      items: '7 items', 
      priority: 'Low', 
      status: 'Approved',
      details: [
        { name: 'Test Tubes', quantity: 100, unit: 'Pieces' },
        { name: 'Gloves', quantity: 20, unit: 'Pairs' }
      ],
      approvedBy: 'Admin User',
      approvedDate: '26 Oct 2023',
      rejectedBy: null,
      rejectedDate: null,
      rejectionReason: null,
      documents: {
        pickList: true,
        packingList: true,
        gdn: true
      }
    },
    { 
      id: '#REQ-0037', 
      facility: 'Cape Coast Clinic', 
      department: 'OPD', 
      requestedBy: 'Nurse Kofi', 
      date: '19 Oct 2023', 
      items: '3 items', 
      priority: 'High', 
      status: 'Rejected',
      details: [
        { name: 'Thermometers', quantity: 10, unit: 'Pieces' }
      ],
      approvedBy: null,
      approvedDate: null,
      rejectedBy: 'Admin User',
      rejectedDate: '25 Oct 2023',
      rejectionReason: 'Insufficient budget allocation this quarter.',
      documents: null
    }
  ]);
  
  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const priorityColors = {
      'High': 'bg-danger',
      'Medium': 'bg-warning',
      'Low': 'bg-success'
    };
    
    return (
      <span className={`badge ${priorityColors[priority] || 'bg-secondary'} text-dark`}>
        {priority}
      </span>
    );
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Submitted': 'bg-info',
      'Pending Review': 'bg-warning',
      'Approved': 'bg-success',
      'Rejected': 'bg-danger'
    };
    
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'} text-dark`}>
        {status}
      </span>
    );
  };
  
  // Modal handlers
  const openCreateModal = () => {
    setNewRequisition({
      facility: '',
      department: '',
      requestedBy: '',
      items: '',
      priority: 'Medium',
      reason: ''
    });
    setShowCreateModal(true);
  };
  
  const openViewModal = (requisition) => {
    setCurrentRequisition(requisition);
    setShowViewModal(true);
  };

  const openRejectModal = (requisition) => {
    setRejectingRequisition(requisition);
    setRejectionReason('');
    setShowRejectModal(true);
  };
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition({
      ...newRequisition,
      [name]: value
    });
  };
  
  // Action handlers
  const handleCreateRequisition = () => {
    if (!newRequisition.facility || !newRequisition.department || !newRequisition.requestedBy) {
      alert('Please fill Facility, Department, and Requested By fields.');
      return;
    }

    const newItem = {
      id: `#REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newRequisition.facility,
      department: newRequisition.department,
      requestedBy: newRequisition.requestedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: newRequisition.items || 'Not specified',
      priority: newRequisition.priority,
      status: 'Submitted',
      details: [],
      approvedBy: null,
      approvedDate: null,
      rejectedBy: null,
      rejectedDate: null,
      rejectionReason: null
    };
    
    setRequisitions([newItem, ...requisitions]);
    setShowCreateModal(false);
  };

  const handleApprove = (reqId) => {
    const now = new Date().toLocaleDateString('en-GB');

    setRequisitions(
      requisitions.map(req =>
        req.id === reqId
          ? {
              ...req,
              status: 'Approved',
              approvedBy: 'Admin User',
              approvedDate: now,
              documents: {
                pickList: true,
                packingList: true,
                gdn: true
              }
            }
          : req
      )
    );

    alert(`Requisition ${reqId} approved. Documents generated.`);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    setRequisitions(
      requisitions.map(req =>
        req.id === rejectingRequisition.id
          ? {
              ...req,
              status: 'Rejected',
              rejectedBy: 'Admin User',
              rejectedDate: new Date().toLocaleDateString('en-GB'),
              rejectionReason: rejectionReason
            }
          : req
      )
    );

    setShowRejectModal(false);
  };

  const downloadPDF = (docType, req) => {
    alert(`${docType} for ${req.id} is being generated...`);
    // Simulated download
    const element = document.createElement('a');
    element.href = '#';
    element.download = `${docType.replace(' ', '_')}_${req.id}.pdf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter requisitions by search term
  const filteredRequisitions = requisitions.filter(req =>
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.facility.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.requestedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">All Requisitions (Admin)</h2>
        <div className="d-flex align-items-center">
          <div className="input-group me-3" style={{ maxWidth: '300px' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="Search requisitions..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="button">
              <FaSearch />
            </button>
          </div>
          <button 
            className="btn btn-primary d-flex align-items-center text-nowrap" 
            onClick={openCreateModal}
          >
            <FaPlus className="me-2" /> Create Requisition
          </button>
        </div>
      </div>
      
      {/* Stats Cards — 4 COLUMN LAYOUT LIKE DASHBOARD */}
      <div className="row row-cols-1 row-cols-md-4 mb-4 g-3">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-primary bg-opacity-10 p-4">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-25 rounded-circle p-3 me-3">
                  <FaEye size={24} className="text-primary" />
                </div>
                <div>
                  <h5 className="card-title text-primary fw-bold mb-0">{requisitions.length}</h5>
                  <p className="card-text text-muted">Total Requests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-warning bg-opacity-10 p-4">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-25 rounded-circle p-3 me-3">
                  <FaEye size={24} className="text-warning" />
                </div>
                <div>
                  <h5 className="card-title text-warning fw-bold mb-0">
                    {requisitions.filter(r => r.status === 'Submitted' || r.status === 'Pending Review').length}
                  </h5>
                  <p className="card-text text-muted">Awaiting Action</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-success bg-opacity-10 p-4">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 rounded-circle p-3 me-3">
                  <FaEye size={24} className="text-success" />
                </div>
                <div>
                  <h5 className="card-title text-success fw-bold mb-0">
                    {requisitions.filter(r => r.status === 'Approved').length}
                  </h5>
                  <p className="card-text text-muted">Approved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-danger bg-opacity-10 p-4">
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-25 rounded-circle p-3 me-3">
                  <FaEye size={24} className="text-danger" />
                </div>
                <div>
                  <h5 className="card-title text-danger fw-bold mb-0">
                    {requisitions.filter(r => r.status === 'Rejected').length}
                  </h5>
                  <p className="card-text text-muted">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button className="nav-link active">All Requisitions</button>
            </li>
          </ul>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table  mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Requisition ID</th>
                  <th>Facility</th>
                  <th>Department</th>
                  <th>Requested By</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequisitions.map((req, index) => (
                  <tr key={index}>
                    <td><span className="fw-bold">{req.id}</span></td>
                    <td>{req.facility}</td>
                    <td>{req.department}</td>
                    <td>{req.requestedBy}</td>
                    <td>{req.date}</td>
                    <td>{req.items}</td>
                    <td><PriorityBadge priority={req.priority} /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      <div className="d-flex gap-1">
                        <button 
                          className="btn btn-sm btn-outline-primary" 
                          onClick={() => openViewModal(req)}
                        >
                          <FaEye />
                        </button>

                        {/* APPROVE BUTTON */}
                        {['Submitted', 'Pending Review'].includes(req.status) && (
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(req.id)}
                            title="Approve Requisition"
                          >
                            Approve
                          </button>
                        )}

                        {/* REJECT BUTTON */}
                        {['Submitted', 'Pending Review'].includes(req.status) && (
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => openRejectModal(req)}
                            title="Reject Requisition"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequisitions.length === 0 && (
            <div className="p-4 text-center text-muted">
              No requisitions found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Create Requisition Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowCreateModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Create New Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Facility <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg"
                        name="facility"
                        value={newRequisition.facility}
                        onChange={handleInputChange}
                        placeholder="e.g. Kumasi Branch Hospital"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Department <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg"
                        name="department"
                        value={newRequisition.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Emergency, Pharmacy"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Requested By <span className="text-danger">*</span></label>
                      <input 
                        type="text" 
                        className="form-control form-control-lg"
                        name="requestedBy"
                        value={newRequisition.requestedBy}
                        onChange={handleInputChange}
                        placeholder="Your Name / Role"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Priority</label>
                      <select 
                        className="form-select form-select-lg"
                        name="priority"
                        value={newRequisition.priority}
                        onChange={handleInputChange}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Items Required</label>
                    <textarea 
                      className="form-control form-control-lg"
                      name="items"
                      value={newRequisition.items}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="List items and quantities (e.g. Paracetamol 500mg - 100 tablets)"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Reason for Requisition</label>
                    <textarea 
                      className="form-control form-control-lg"
                      name="reason"
                      value={newRequisition.reason}
                      onChange={handleInputChange}
                      rows="2"
                      placeholder="Why are these items needed?"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={handleCreateRequisition}>
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Requisition Modal */}
      {showViewModal && currentRequisition && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowViewModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Requisition Details: {currentRequisition.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>Facility:</strong> {currentRequisition.facility}</p>
                    <p><strong>Department:</strong> {currentRequisition.department}</p>
                    <p><strong>Requested By:</strong> {currentRequisition.requestedBy}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Date Submitted:</strong> {currentRequisition.date}</p>
                    <p><strong>Priority:</strong> <PriorityBadge priority={currentRequisition.priority} /></p>
                    <p><strong>Status:</strong> <StatusBadge status={currentRequisition.status} /></p>
                  </div>
                </div>
                
                <h6 className="border-bottom pb-2 mb-3">Items Requested:</h6>
                {currentRequisition.details.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRequisition.details.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted fst-italic">No detailed items listed.</p>
                )}

                {/* Approval Info */}
                {currentRequisition.status === 'Approved' && (
                  <div className="alert alert-success mt-4">
                    <strong>Approved by:</strong> {currentRequisition.approvedBy} on {currentRequisition.approvedDate}
                  </div>
                )}

                {currentRequisition.status === 'Rejected' && (
                  <div className="alert alert-danger mt-4">
                    <strong>Rejected by:</strong> {currentRequisition.rejectedBy} on {currentRequisition.rejectedDate}
                    <br />
                    <strong>Reason:</strong> {currentRequisition.rejectionReason}
                  </div>
                )}

                {/* PDF Download Buttons */}
                {currentRequisition.status === 'Approved' && currentRequisition.documents && (
                  <div className="mt-4">
                    <h6 className="border-bottom pb-2 mb-3">Generated Documents:</h6>
                    <div className="d-grid gap-2 d-md-flex">
                      <button 
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center" 
                        onClick={() => downloadPDF('Pick List', currentRequisition)}
                      >
                        <FaFilePdf className="me-2" /> Download Pick List
                      </button>
                      <button 
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center" 
                        onClick={() => downloadPDF('Packing List', currentRequisition)}
                      >
                        <FaFilePdf className="me-2" /> Download Packing List
                      </button>
                      <button 
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center" 
                        onClick={() => downloadPDF('GDN', currentRequisition)}
                      >
                        <FaFilePdf className="me-2" /> Download GDN
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Requisition Modal */}
      {showRejectModal && rejectingRequisition && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowRejectModal(false);
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Reject Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <p><strong>Requisition ID:</strong> {rejectingRequisition.id}</p>
                <p><strong>Facility:</strong> {rejectingRequisition.facility}</p>
                <div className="mb-3">
                  <label className="form-label fw-medium">Reason for Rejection <span className="text-danger">*</span></label>
                  <textarea 
                    className="form-control"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="3"
                    placeholder="Please provide a detailed reason..."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger px-4" onClick={handleReject}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showCreateModal || showViewModal || showRejectModal) && (
        <div className="modal-backdrop fade show"></div>
      )}

      {/* HOVER EFFECT CSS — SAME AS WAREHOUSE DASHBOARD */}
      <style jsx>{`
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default WarehouseRequisitions;