import React, { useState } from 'react';
import { 
  FaPlus, FaSearch, FaEye, FaTruckLoading, FaCheck, FaTimes, FaFilePdf, FaEnvelope, FaSms, FaBoxOpen
} from 'react-icons/fa';

const WarehouseDispatches = () => {
  // State for search
  const [searchTerm, setSearchTerm] = useState('');
  // State for modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  // State for current dispatch
  const [currentDispatch, setCurrentDispatch] = useState(null);
  // State for new dispatch form
  const [newDispatch, setNewDispatch] = useState({
    facility: '',
    items: '',
    dispatchedBy: '',
    estimatedDelivery: '',
    notes: '',
    batchNumbers: ''
  });
  // State for current document type
  const [currentDocumentType, setCurrentDocumentType] = useState('');
  // State for notification
  const [notificationMethod, setNotificationMethod] = useState('email');
  
  // Mock data for dispatches
  const [dispatches, setDispatches] = useState([
    { 
      id: '#DSP-0102', 
      facility: 'Kumasi Branch Hospital', 
      itemsCount: '15 items', 
      dispatchedBy: 'Warehouse Admin', 
      date: '23 Oct 2023', 
      status: 'Received',
      estimatedDelivery: '24 Oct 2023',
      trackingNumber: 'TRK-2023-0015',
      notes: 'Urgent delivery for emergency ward',
      batchNumbers: 'B123, B456',
      notificationSent: true
    },
    { 
      id: '#DSP-0101', 
      facility: 'Accra Central Hospital', 
      itemsCount: '8 items', 
      dispatchedBy: 'Warehouse Admin', 
      date: '22 Oct 2023', 
      status: 'Delivered',
      estimatedDelivery: '23 Oct 2023',
      trackingNumber: 'TRK-2023-0014',
      notes: 'Routine supply for pharmacy department',
      batchNumbers: 'B789',
      notificationSent: false
    },
    { 
      id: '#DSP-0100', 
      facility: 'Takoradi Clinic', 
      itemsCount: '12 items', 
      dispatchedBy: 'Warehouse Admin', 
      date: '21 Oct 2023', 
      status: 'In Transit',
      estimatedDelivery: '25 Oct 2023',
      trackingNumber: 'TRK-2023-0013',
      notes: 'Laboratory supplies',
      currentLocation: 'Cape Town Distribution Center',
      progress: 65,
      batchNumbers: 'B321, B654',
      notificationSent: false
    }
  ]);

  // Mock data for stock inventory
  const [stockInventory, setStockInventory] = useState([
    { id: 1, itemName: 'Paracetamol Tablets', batchNumber: 'B123', quantity: 100 },
    { id: 2, itemName: 'Ibuprofen Tablets', batchNumber: 'B456', quantity: 75 },
    { id: 3, itemName: 'Antiseptic Solution', batchNumber: 'B789', quantity: 50 },
    { id: 4, itemName: 'Surgical Gloves', batchNumber: 'B321', quantity: 200 },
    { id: 5, itemName: 'Face Masks', batchNumber: 'B654', quantity: 300 }
  ]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Delivered': 'bg-success text-white',
      'In Transit': 'bg-warning text-dark',
      'Processing': 'bg-info text-white',
      'Cancelled': 'bg-danger text-white',
      'Received': 'bg-primary text-white'
    };
    return (
      <span className={`badge ${statusColors[status] || 'bg-secondary'} rounded-pill px-3 py-1 fw-medium`}>
        {status}
      </span>
    );
  };

  // Modal handlers
  const openCreateModal = () => {
    setNewDispatch({
      facility: '',
      items: '',
      dispatchedBy: '',
      estimatedDelivery: '',
      notes: '',
      batchNumbers: ''
    });
    setShowCreateModal(true);
  };

  const openViewModal = (dispatch) => {
    setCurrentDispatch(dispatch);
    setShowViewModal(true);
  };

  const openTrackModal = (dispatch) => {
    setCurrentDispatch(dispatch);
    setShowTrackModal(true);
  };

  const openDocumentModal = (dispatch, documentType) => {
    setCurrentDispatch(dispatch);
    setCurrentDocumentType(documentType);
    setShowDocumentModal(true);
  };

  const openNotificationModal = (dispatch) => {
    setCurrentDispatch(dispatch);
    setShowNotificationModal(true);
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispatch({
      ...newDispatch,
      [name]: value
    });
  };

  // Action handlers
  const handleCreateDispatch = () => {
    if (!newDispatch.facility || !newDispatch.dispatchedBy) {
      alert('Please fill Facility and Dispatched By fields.');
      return;
    }

    // Update stock inventory based on batch numbers
    if (newDispatch.batchNumbers) {
      const batchNumbersArray = newDispatch.batchNumbers.split(',').map(batch => batch.trim());
      const updatedInventory = [...stockInventory];
      
      batchNumbersArray.forEach(batchNum => {
        const batchIndex = updatedInventory.findIndex(item => item.batchNumber === batchNum);
        if (batchIndex !== -1) {
          // Reduce quantity by 10 for each batch (simplified for example)
          updatedInventory[batchIndex] = {
            ...updatedInventory[batchIndex],
            quantity: updatedInventory[batchIndex].quantity - 10
          };
        }
      });
      
      setStockInventory(updatedInventory);
    }

    const newItem = {
      id: `#DSP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newDispatch.facility,
      itemsCount: newDispatch.items || 'Not specified',
      dispatchedBy: newDispatch.dispatchedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      estimatedDelivery: newDispatch.estimatedDelivery,
      trackingNumber: `TRK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      notes: newDispatch.notes,
      batchNumbers: newDispatch.batchNumbers || 'Not specified',
      notificationSent: false
    };
    setDispatches([newItem, ...dispatches]);
    setShowCreateModal(false);
  };

  const handleSendNotification = () => {
    if (!currentDispatch) return;
    
    // Update dispatch status to "Received"
    const updatedDispatches = dispatches.map(dispatch => {
      if (dispatch.id === currentDispatch.id) {
        return {
          ...dispatch,
          status: 'Received',
          notificationSent: true
        };
      }
      return dispatch;
    });
    
    setDispatches(updatedDispatches);
    setCurrentDispatch({
      ...currentDispatch,
      status: 'Received',
      notificationSent: true
    });
    
    // Show success message
    alert(`${notificationMethod === 'email' ? 'Email' : 'SMS'} notification sent successfully to ${currentDispatch.facility}!`);
    setShowNotificationModal(false);
  };

  // Filter dispatches by search term
  const filteredDispatches = dispatches.filter(dispatch =>
    dispatch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispatch.facility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render document content based on type
  const renderDocumentContent = () => {
    if (!currentDispatch) return null;
    
    switch(currentDocumentType) {
      case 'pickList':
        return (
          <div>
            <h5 className="mb-3">Pick List</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Batch Number</th>
                    <th>Quantity</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Paracetamol Tablets</td>
                    <td>B123</td>
                    <td>10</td>
                    <td>Aisle 3, Shelf B</td>
                  </tr>
                  <tr>
                    <td>Ibuprofen Tablets</td>
                    <td>B456</td>
                    <td>5</td>
                    <td>Aisle 3, Shelf C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'packingList':
        return (
          <div>
            <h5 className="mb-3">Packing List</h5>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Batch Number</th>
                    <th>Quantity</th>
                    <th>Package</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Paracetamol Tablets</td>
                    <td>B123</td>
                    <td>10</td>
                    <td>Box 1</td>
                  </tr>
                  <tr>
                    <td>Ibuprofen Tablets</td>
                    <td>B456</td>
                    <td>5</td>
                    <td>Box 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'gdn':
        return (
          <div>
            <h5 className="mb-3">Goods Dispatch Note (GDN)</h5>
            <div className="mb-3">
              <p><strong>Dispatch ID:</strong> {currentDispatch.id}</p>
              <p><strong>Facility:</strong> {currentDispatch.facility}</p>
              <p><strong>Delivery Date:</strong> {currentDispatch.estimatedDelivery}</p>
              <p><strong>Dispatched By:</strong> {currentDispatch.dispatchedBy}</p>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Batch Number</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Paracetamol Tablets</td>
                    <td>B123</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Ibuprofen Tablets</td>
                    <td>B456</td>
                    <td>5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-3">
              <p><strong>Notes:</strong> {currentDispatch.notes}</p>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dispatches Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={openCreateModal}>
          <FaPlus className="me-2" /> New Dispatch
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold">24</div>
              <div className="label text-muted">Delivered This Month</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTruckLoading className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold">5</div>
              <div className="label text-muted">In Transit</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTimes className="text-info fa-2x" />
              </div>
              <div className="number text-info fw-bold">2</div>
              <div className="label text-muted">Delayed</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaPlus className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold">3</div>
              <div className="label text-muted">Pending</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stock Inventory Section */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3 pb-0">
          <h5 className="mb-0 fw-bold">Current Stock Inventory</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Item Name</th>
                  <th>Batch Number</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {stockInventory.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemName}</td>
                    <td>{item.batchNumber}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Dispatches Table */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-3 pb-0">
          <h5 className="mb-0 fw-bold">Recent Dispatches</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Dispatch ID</th>
                  <th>To Facility</th>
                  <th>Items Count</th>
                  <th>Dispatched By</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDispatches.map((dispatch, index) => (
                  <tr key={index}>
                    <td><span className="fw-bold">{dispatch.id}</span></td>
                    <td>{dispatch.facility}</td>
                    <td>{dispatch.itemsCount}</td>
                    <td>{dispatch.dispatchedBy}</td>
                    <td>{dispatch.date}</td>
                    <td><StatusBadge status={dispatch.status} /></td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => dispatch.status === 'In Transit' ? openTrackModal(dispatch) : openViewModal(dispatch)}
                        title={dispatch.status === 'In Transit' ? 'Track Delivery' : 'View Details'}
                      >
                        {dispatch.status === 'In Transit' ? (
                          <>
                            <FaTruckLoading className="me-1" />
                            Track
                          </>
                        ) : (
                          <>
                            <FaEye className="me-1" />
                            View
                          </>
                        )}
                      </button>
                      {dispatch.status === 'Delivered' && !dispatch.notificationSent && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => openNotificationModal(dispatch)}
                          title="Send Notification"
                        >
                          <FaEnvelope className="me-1" />
                          Notify
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDispatches.length === 0 && (
            <div className="p-4 text-center text-muted">
              No dispatches found matching your search.
            </div>
          )}
        </div>
      </div>
      
      {/* ========== MODALS ========== */}
      {/* Create Dispatch Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowCreateModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Create New Dispatch</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <form>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">To Facility <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="facility"
                        value={newDispatch.facility}
                        onChange={handleInputChange}
                        placeholder="e.g. Kumasi Branch Hospital"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Dispatched By <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="dispatchedBy"
                        value={newDispatch.dispatchedBy}
                        onChange={handleInputChange}
                        placeholder="e.g. Warehouse Admin"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Estimated Delivery Date</label>
                      <input
                        type="date"
                        className="form-control form-control-lg"
                        name="estimatedDelivery"
                        value={newDispatch.estimatedDelivery}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Items</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="items"
                        value={newDispatch.items}
                        onChange={handleInputChange}
                        placeholder="e.g. 15 items"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Batch Numbers</label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        name="batchNumbers"
                        value={newDispatch.batchNumbers}
                        onChange={handleInputChange}
                        placeholder="e.g. B123, B456"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium">Notes</label>
                      <textarea
                        className="form-control form-control-lg"
                        name="notes"
                        value={newDispatch.notes}
                        onChange={handleInputChange}
                        rows="1"
                        placeholder="Additional notes"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={handleCreateDispatch}>
                  Create Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Dispatch Modal */}
      {showViewModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowViewModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Dispatch Details: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    <p><strong>Dispatched By:</strong> {currentDispatch.dispatchedBy}</p>
                    <p><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    <p><strong>Batch Numbers:</strong> {currentDispatch.batchNumbers}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                    <p><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                    <p><strong>Notification Sent:</strong> {currentDispatch.notificationSent ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <h6 className="mb-3">Generate Documents:</h6>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => openDocumentModal(currentDispatch, 'pickList')}
                    >
                      <FaBoxOpen className="me-2" /> Pick List
                    </button>
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => openDocumentModal(currentDispatch, 'packingList')}
                    >
                      <FaBoxOpen className="me-2" /> Packing List
                    </button>
                    <button 
                      className="btn btn-outline-primary d-flex align-items-center"
                      onClick={() => openDocumentModal(currentDispatch, 'gdn')}
                    >
                      <FaFilePdf className="me-2" /> GDN
                    </button>
                  </div>
                </div>
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
      
      {/* Track Dispatch Modal */}
      {showTrackModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowTrackModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Track Dispatch: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowTrackModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    <p><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    <p><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                    <p><strong>Current Location:</strong> {currentDispatch.currentLocation}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h6 className="mb-3">Delivery Progress</h6>
                  <div className="progress mb-2" style={{ height: '20px' }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${currentDispatch.progress}%` }}
                      aria-valuenow={currentDispatch.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {currentDispatch.progress}%
                    </div>
                  </div>
                  <p className="text-muted small">Your dispatch is {currentDispatch.progress}% complete</p>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">Tracking Timeline</h6>
                  <div className="timeline">
                    <div className="timeline-item">
                      <div className="timeline-marker bg-success"></div>
                      <div className="timeline-content">
                        <h6>Order Processed</h6>
                        <p className="text-muted small">{currentDispatch.date} - Warehouse</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker bg-warning"></div>
                      <div className="timeline-content">
                        <h6>In Transit</h6>
                        <p className="text-muted small">Current Location: {currentDispatch.currentLocation}</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker bg-secondary"></div>
                      <div className="timeline-content">
                        <h6>Out for Delivery</h6>
                        <p className="text-muted small">Expected: {currentDispatch.estimatedDelivery}</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-marker bg-secondary"></div>
                      <div className="timeline-content">
                        <h6>Delivered</h6>
                        <p className="text-muted small">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowTrackModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary px-4">
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Document Modal */}
      {showDocumentModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowDocumentModal(false);
        }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {currentDocumentType === 'pickList' && 'Pick List'}
                  {currentDocumentType === 'packingList' && 'Packing List'}
                  {currentDocumentType === 'gdn' && 'Goods Dispatch Note (GDN)'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDocumentModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                {renderDocumentContent()}
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowDocumentModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary px-4">
                  <FaFilePdf className="me-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification Modal */}
      {showNotificationModal && currentDispatch && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={(e) => {
          if (e.target.classList.contains('modal')) setShowNotificationModal(false);
        }}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold">Send Notification</h5>
                <button type="button" className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
              </div>
              <div className="modal-body py-4">
                <p>Send notification to <strong>{currentDispatch.facility}</strong> for dispatch <strong>{currentDispatch.id}</strong>.</p>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Notification Method</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="notificationMethod" 
                        id="emailMethod" 
                        value="email" 
                        checked={notificationMethod === 'email'}
                        onChange={() => setNotificationMethod('email')}
                      />
                      <label className="form-check-label" htmlFor="emailMethod">
                        <FaEnvelope className="me-2" /> Email
                      </label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="notificationMethod" 
                        id="smsMethod" 
                        value="sms" 
                        checked={notificationMethod === 'sms'}
                        onChange={() => setNotificationMethod('sms')}
                      />
                      <label className="form-check-label" htmlFor="smsMethod">
                        <FaSms className="me-2" /> SMS
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-medium">Message</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={`Your dispatch ${currentDispatch.id} has been delivered. Please confirm receipt and update your inventory accordingly. Tracking number: ${currentDispatch.trackingNumber}`}
                    readOnly
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowNotificationModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary px-4" onClick={handleSendNotification}>
                  Send {notificationMethod === 'email' ? 'Email' : 'SMS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Backdrop */}
      {(showCreateModal || showViewModal || showTrackModal || showDocumentModal || showNotificationModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default WarehouseDispatches;