import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import React, { useState } from 'react';
import {
  FaPlus, FaSearch, FaCheck, FaTimes, FaEye,
  FaExclamationTriangle, FaExclamationCircle
} from 'react-icons/fa';

const SuperAdminRequisitions = () => {
  // State for search
  const [searchTerm, setSearchTerm] = useState('');

  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // State for current requisition
  const [currentRequisition, setCurrentRequisition] = useState(null);

  // State for new requisition form
  const [newRequisition, setNewRequisition] = useState({
    facility: '',
    department: '',
    requestedBy: '',
    items: '',
    priority: 'Medium',
    reason: ''
  });

  // State for rejection reason
  const [rejectionReason, setRejectionReason] = useState('');

  // State for active tab
  const [activeTab, setActiveTab] = useState('Pending');

  // Mock data
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
      ]
    },
    {
      id: '#REQ-0040',
      facility: 'Takoradi Clinic',
      department: 'Pharmacy',
      requestedBy: 'Dr. Mensah',
      date: '22 Oct 2023',
      items: '5 items',
      priority: 'Medium',
      status: 'Partially Approved',
      details: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ]
    },
    {
      id: '#REQ-0038',
      facility: 'Accra Central Hospital',
      department: 'Laboratory',
      requestedBy: 'Lab Tech. Ama',
      date: '20 Oct 2023',
      items: '7 items',
      priority: 'Low',
      status: 'Pending Review',
      details: [
        { name: 'Test Tubes', quantity: 100, unit: 'Pieces' },
        { name: 'Gloves', quantity: 20, unit: 'Pairs' }
      ]
    },
    {
      id: '#REQ-0035',
      facility: 'Tamale General Hospital',
      department: 'Pediatrics',
      requestedBy: 'Dr. Kofi',
      date: '18 Oct 2023',
      items: '8 items',
      priority: 'High',
      status: 'Approved',
      details: [
        { name: 'Pediatric Syringes', quantity: 150, unit: 'Pieces' },
        { name: "Children's Masks", quantity: 100, unit: 'Pieces' }
      ]
    },
    {
      id: '#REQ-0032',
      facility: 'Cape Coast Hospital',
      department: 'Surgery',
      requestedBy: 'Dr. Yaa',
      date: '15 Oct 2023',
      items: '10 items',
      priority: 'Medium',
      status: 'Rejected',
      details: [
        { name: 'Surgical Blades', quantity: 50, unit: 'Pieces' },
        { name: 'Sterile Gauze', quantity: 200, unit: 'Pieces' }
      ],
      rejectionReason: 'Budget constraints for this quarter'
    }
  ]);

  // Filter by tab
  const filteredRequisitions = requisitions.filter(req => {
    if (activeTab === 'Pending') {
      return req.status === 'Pending Review' || req.status === 'Partially Approved';
    } else if (activeTab === 'Approved') {
      return req.status === 'Approved';
    } else if (activeTab === 'Rejected') {
      return req.status === 'Rejected';
    } else {
      return true;
    }
  });

  // Badges (Bootstrap only)
  const PriorityBadge = ({ priority }) => {
    const map = { High: 'bg-danger', Medium: 'bg-warning text-dark', Low: 'bg-success' };
    return <span className={`badge ${map[priority] || 'bg-secondary'}`}>{priority}</span>;
    // Note: warning badge is dark text for contrast
  };

  const StatusBadge = ({ status }) => {
    const map = {
      'Pending Review': 'bg-warning text-dark',
      'Partially Approved': 'bg-info text-dark',
      'Approved': 'bg-success',
      'Rejected': 'bg-danger'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
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
  const openViewModal = (req) => { setCurrentRequisition(req); setShowViewModal(true); };
  const openApproveModal = (req) => { setCurrentRequisition(req); setShowApproveModal(true); };
  const openRejectModal = (req) => { setCurrentRequisition(req); setRejectionReason(''); setShowRejectModal(true); };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition(prev => ({ ...prev, [name]: value }));
  };
  const handleRejectionReasonChange = (e) => setRejectionReason(e.target.value);

  // Actions
  const handleCreateRequisition = () => {
    const newItem = {
      id: `#REQ-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newRequisition.facility,
      department: newRequisition.department,
      requestedBy: newRequisition.requestedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: newRequisition.items,
      priority: newRequisition.priority,
      status: 'Pending Review',
      details: []
    };
    setRequisitions([newItem, ...requisitions]);
    setShowCreateModal(false);
  };
  const handleApproveRequisition = () => {
    setRequisitions(prev => prev.map(r => r.id === currentRequisition.id ? { ...r, status: 'Approved' } : r));
    setShowApproveModal(false);
  };
  const handleRejectRequisition = () => {
    setRequisitions(prev => prev.map(r => r.id === currentRequisition.id ? { ...r, status: 'Rejected', rejectionReason } : r));
    setShowRejectModal(false);
  };

  // Filtered for list rendering on mobile
  const filteredBySearch = filteredRequisitions.filter(r => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      r.id.toLowerCase().includes(q) ||
      r.facility.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.requestedBy.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid py-3">
      {/* ===== Top Toolbar ===== */}
      {/* Mobile-first: stack; md+ align horizontally */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">Requisitions Management</h2>

        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2 w-100 w-md-auto">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              style={{height: "40px"}}
              placeholder="Search requisitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search requisitions"
            />
            <button className="btn btn-outline-secondary" style={{height: "40px"}} type="button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          <button className="btn btn-primary btn-sm py-1 px-2" style={{height: "40px", width: "150px"}} onClick={openCreateModal}>
            <FaPlus className="me-2" /> Create New
          </button>
        </div>
      </div>

      {/* ===== Summary Cards ===== */}
      {/* row-cols-1 on mobile, 3 cols at md+ */}
      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-danger bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaExclamationCircle className="text-danger me-2" size={24} />
                <h5 className="card-title text-danger fw-bold mb-0">Urgent</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">3 requisitions need immediate attention</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-warning bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaExclamationTriangle className="text-warning me-2" size={24} />
                <h5 className="card-title text-warning fw-bold mb-0">Pending</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">5 requisitions awaiting approval</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body bg-info bg-opacity-10 p-4">
              <div className="d-flex align-items-center mb-2">
                <FaCheck className="text-info me-2" size={24} />
                <h5 className="card-title text-info fw-bold mb-0">Approved</h5>
              </div>
              <p className="card-text text-muted ms-4 mb-0">12 requisitions approved this week</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3">
          {/* Horizontal scroll if overflow on tiny screens (Bootstrap utilities) */}
          <div className="overflow-auto">
            <ul className="nav nav-tabs card-header-tabs flex-nowrap">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'Pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Pending')}
                >
                  Pending
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'Approved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Approved')}
                >
                  Approved
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'Rejected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Rejected')}
                >
                  Rejected
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveTab('All')}
                >
                  All Requisitions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== Data Views ===== */}
        <div className="card-body p-0">
          {/* (A) TABLE for md and up */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-hover mb-0 align-middle">
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
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBySearch.map((req, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{req.id}</td>
                    <td>{req.facility}</td>
                    <td>{req.department}</td>
                    <td>{req.requestedBy}</td>
                    <td>{req.date}</td>
                    <td>{req.items}</td>
                    <td><PriorityBadge priority={req.priority} /></td>
                    <td><StatusBadge status={req.status} /></td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Row actions">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => openApproveModal(req)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => openRejectModal(req)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openViewModal(req)}
                          title="View"
                        >
                          <FaEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* (B) CARD LIST for small screens */}
          {/* Visible only below md */}
          <div className="d-block d-md-none p-2">
            <div className="row g-2">
              {filteredBySearch.map((req, i) => (
                <div className="col-12" key={i}>
                  <div className="card">
                    <div className="card-body">
                      {/* Top line: ID + Status */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold">{req.id}</span>
                        <StatusBadge status={req.status} />
                      </div>

                      {/* Meta grid */}
                      <div className="row g-2 small">
                        <div className="col-6">
                          <div className="text-muted">Facility</div>
                          <div>{req.facility}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Department</div>
                          <div>{req.department}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Requested By</div>
                          <div>{req.requestedBy}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Date</div>
                          <div>{req.date}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Items</div>
                          <div>{req.items}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Priority</div>
                          <div><PriorityBadge priority={req.priority} /></div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-outline-success flex-fill"
                          onClick={() => openApproveModal(req)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                        >
                          <FaCheck className="me-1" /> Approve
                        </button>
                        <button
                          className="btn btn-outline-danger flex-fill"
                          onClick={() => openRejectModal(req)}
                          disabled={req.status === 'Approved' || req.status === 'Rejected'}
                        >
                          <FaTimes className="me-1" /> Reject
                        </button>
                        <button
                          className="btn btn-outline-primary flex-fill"
                          onClick={() => openViewModal(req)}
                        >
                          <FaEye className="me-1" /> View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredBySearch.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-light border text-center mb-0">
                    No requisitions found.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Create Modal ===== */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          {/* Full-screen on small devices */}
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* 320px+ → stacked; md+ → 2 columns */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Facility</label>
                      <input
                        type="text"
                        className="form-control"
                        name="facility"
                        value={newRequisition.facility}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={newRequisition.department}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Requested By</label>
                      <input
                        type="text"
                        className="form-control"
                        name="requestedBy"
                        value={newRequisition.requestedBy}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        name="priority"
                        value={newRequisition.priority}
                        onChange={handleInputChange}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Items Required</label>
                      <textarea
                        className="form-control"
                        name="items"
                        value={newRequisition.items}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="List items and quantities required"
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Reason for Requisition</label>
                      <textarea
                        className="form-control"
                        name="reason"
                        value={newRequisition.reason}
                        onChange={handleInputChange}
                        rows="2"
                        placeholder="Explain why these items are needed"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateRequisition}>
                  Submit Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== View Modal ===== */}
      {showViewModal && currentRequisition && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Requisition Details: {currentRequisition.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Facility:</strong> {currentRequisition.facility}</p>
                    <p className="mb-1"><strong>Department:</strong> {currentRequisition.department}</p>
                    <p className="mb-1"><strong>Requested By:</strong> {currentRequisition.requestedBy}</p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Date:</strong> {currentRequisition.date}</p>
                    <p className="mb-1"><strong>Priority:</strong> <PriorityBadge priority={currentRequisition.priority} /></p>
                    <p className="mb-1"><strong>Status:</strong> <StatusBadge status={currentRequisition.status} /></p>
                  </div>
                </div>

                <h6 className="mt-3">Items Requested</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
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

                {currentRequisition.rejectionReason && (
                  <div className="alert alert-danger mt-3">
                    <strong>Rejection Reason:</strong> {currentRequisition.rejectionReason}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Approve Modal ===== */}
      {showApproveModal && currentRequisition && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Approve Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowApproveModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve this requisition?</p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p className="mb-1"><strong>ID:</strong> {currentRequisition.id}</p>
                    <p className="mb-1"><strong>Facility:</strong> {currentRequisition.facility}</p>
                    <p className="mb-1"><strong>Department:</strong> {currentRequisition.department}</p>
                    <p className="mb-0"><strong>Items:</strong> {currentRequisition.items}</p>
                  </div>
                </div>
                <div className="alert alert-success mt-3">
                  Approving this requisition will initiate the procurement process for the requested items.
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApproveModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleApproveRequisition}>
                  Approve Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Reject Modal ===== */}
      {showRejectModal && currentRequisition && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Requisition</h5>
                <button type="button" className="btn-close" onClick={() => setShowRejectModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this requisition?</p>
                <div className="card bg-light">
                  <div className="card-body">
                    <p className="mb-1"><strong>ID:</strong> {currentRequisition.id}</p>
                    <p className="mb-1"><strong>Facility:</strong> {currentRequisition.facility}</p>
                    <p className="mb-1"><strong>Department:</strong> {currentRequisition.department}</p>
                    <p className="mb-0"><strong>Items:</strong> {currentRequisition.items}</p>
                  </div>
                </div>
                <div className="mb-3 mt-3">
                  <label className="form-label">Reason for Rejection</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={rejectionReason}
                    onChange={handleRejectionReasonChange}
                    placeholder="Please provide a reason for rejecting this requisition"
                  ></textarea>
                </div>
                <div className="alert alert-danger">
                  Rejecting this requisition will cancel the request. The requester will be notified of the rejection.
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleRejectRequisition}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Requisition
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showCreateModal || showViewModal || showApproveModal || showRejectModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminRequisitions;
