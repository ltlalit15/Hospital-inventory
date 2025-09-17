import React, { useState } from 'react';
import {
  FaPlus, FaSearch, FaEye, FaTruckLoading, FaCheck, FaTimes, FaMapMarkerAlt, FaCalendarAlt, FaUser
} from 'react-icons/fa';

const SuperAdminDispatches = () => {
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Current item
  const [currentDispatch, setCurrentDispatch] = useState(null);

  // New dispatch
  const [newDispatch, setNewDispatch] = useState({
    facility: '',
    items: '',
    dispatchedBy: '',
    estimatedDelivery: '',
    notes: ''
  });

  // Mock data
  const [dispatches, setDispatches] = useState([
    {
      id: '#DSP-0102',
      facility: 'Kumasi Branch Hospital',
      itemsCount: '15 items',
      dispatchedBy: 'Warehouse Admin',
      date: '23 Oct 2023',
      status: 'Delivered',
      estimatedDelivery: '24 Oct 2023',
      items: [
        { name: 'Paracetamol 500mg', quantity: 100, unit: 'Tablets' },
        { name: 'Surgical Gloves', quantity: 50, unit: 'Pairs' },
        { name: 'Syringe 5ml', quantity: 200, unit: 'Pieces' }
      ],
      deliveryAddress: '123 Hospital Road, Kumasi',
      trackingNumber: 'TRK-2023-0015',
      notes: 'Urgent delivery for emergency ward'
    },
    {
      id: '#DSP-0101',
      facility: 'Accra Central Hospital',
      itemsCount: '8 items',
      dispatchedBy: 'Warehouse Admin',
      date: '22 Oct 2023',
      status: 'Delivered',
      estimatedDelivery: '23 Oct 2023',
      items: [
        { name: 'Amoxicillin 250mg', quantity: 50, unit: 'Capsules' },
        { name: 'Bandages', quantity: 30, unit: 'Pieces' }
      ],
      deliveryAddress: '456 Main Street, Accra',
      trackingNumber: 'TRK-2023-0014',
      notes: 'Routine supply for pharmacy department'
    },
  
  ]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const map = {
      Delivered: 'bg-success',
      'In Transit': 'bg-warning text-dark',
      Processing: 'bg-info text-dark',
      Cancelled: 'bg-danger'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // Handlers
  const openCreateModal = () => {
    setNewDispatch({ facility: '', items: '', dispatchedBy: '', estimatedDelivery: '', notes: '' });
    setShowCreateModal(true);
  };
  const openViewModal = (d) => { setCurrentDispatch(d); setShowViewModal(true); };
  const openTrackModal = (d) => { setCurrentDispatch(d); setShowTrackModal(true); };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDispatch(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDispatch = () => {
    const newItem = {
      id: `#DSP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      facility: newDispatch.facility,
      itemsCount: newDispatch.items,
      dispatchedBy: newDispatch.dispatchedBy,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Processing',
      estimatedDelivery: newDispatch.estimatedDelivery,
      items: [],
      deliveryAddress: '',
      trackingNumber: `TRK-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      notes: newDispatch.notes
    };
    setDispatches([newItem, ...dispatches]);
    setShowCreateModal(false);
  };

  // Search filter (mobile + desktop)
  const filtered = dispatches.filter(d => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      d.id.toLowerCase().includes(q) ||
      d.facility.toLowerCase().includes(q) ||
      d.dispatchedBy.toLowerCase().includes(q) ||
      d.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid py-3">
      {/* ================================
           Toolbar
           - xs (320–480): stacked
           - md (≥768): inline
         ================================ */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">Dispatches Management</h2>

        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2 w-100 w-md-auto">
          {/* Compact search: form-control-sm + btn-sm (height reduced) */}
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
               style={{height: "40px"}}
              placeholder="Search dispatches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search dispatches"
            />
            <button className="btn btn-outline-secondary btn-sm"  style={{height: "40px"}} type="button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          {/* Compact primary button */}
          <button
            className="btn btn-primary btn-sm d-inline-flex align-items-center py-1 px-2"
            style={{height: "40px", width: "150px"}}
            onClick={openCreateModal}
          >
            <FaPlus className="me-2" /> New Dispatch
          </button>
        </div>
      </div>

      {/* ================================
           Stats (cards)
           - xs: 1 col
           - md: 4 cols
         ================================ */}
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-success fs-3" />
              </div>
              <div className="fw-bold text-success fs-4">24</div>
              <div className="text-muted small">Delivered This Month</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTruckLoading className="text-warning fs-3" />
              </div>
              <div className="fw-bold text-warning fs-4">5</div>
              <div className="text-muted small">In Transit</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTimes className="text-info fs-3" />
              </div>
              <div className="fw-bold text-info fs-4">2</div>
              <div className="text-muted small">Delayed</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaPlus className="text-primary fs-3" />
              </div>
              <div className="fw-bold text-primary fs-4">3</div>
              <div className="text-muted small">Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================
           Recent Dispatches
           - xs: card list (d-block d-md-none)
           - md+: table (d-none d-md-block)
         ================================ */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Recent Dispatches</h5>
        </div>

        {/* TABLE (md and up) */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Dispatch ID</th>
                  <th>To Facility</th>
                  <th>Items Count</th>
                  <th>Dispatched By</th>
                  <th>Date</th>
                  <th>Estimated Delivery</th>
                  <th>Status</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((dispatch, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{dispatch.id}</td>
                    <td>{dispatch.facility}</td>
                    <td>{dispatch.itemsCount}</td>
                    <td>{dispatch.dispatchedBy}</td>
                    <td>{dispatch.date}</td>
                    <td>{dispatch.estimatedDelivery}</td>
                    <td><StatusBadge status={dispatch.status} /></td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          dispatch.status === 'In Transit' ? openTrackModal(dispatch) : openViewModal(dispatch)
                        }
                      >
                        {dispatch.status === 'In Transit' ? <FaTruckLoading /> : <FaEye />}
                        <span className="ms-1">{dispatch.status === 'In Transit' ? 'Track' : 'View'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CARD LIST (below md) */}
        <div className="card-body d-block d-md-none">
          <div className="row g-2">
            {filtered.map((d, i) => (
              <div className="col-12" key={i}>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">{d.id}</span>
                      <StatusBadge status={d.status} />
                    </div>

                    <div className="row g-2 small">
                      <div className="col-6">
                        <div className="text-muted">Facility</div>
                        <div>{d.facility}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Items</div>
                        <div>{d.itemsCount}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Dispatched By</div>
                        <div>{d.dispatchedBy}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Date</div>
                        <div>{d.date}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">ETA</div>
                        <div>{d.estimatedDelivery}</div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button
                        className="btn btn-outline-primary w-100 btn-sm"
                        onClick={() => (d.status === 'In Transit' ? openTrackModal(d) : openViewModal(d))}
                      >
                        {d.status === 'In Transit' ? <FaTruckLoading className="me-1" /> : <FaEye className="me-1" />}
                        {d.status === 'In Transit' ? 'Track' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border text-center mb-0">No dispatches found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================
           Create Dispatch Modal
           - Fullscreen on small devices
         ================================ */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Dispatch</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* xs: stacked | md+: 2 columns */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">To Facility</label>
                      <input
                        type="text"
                        className="form-control"
                        name="facility"
                        value={newDispatch.facility}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Dispatched By</label>
                      <input
                        type="text"
                        className="form-control"
                        name="dispatchedBy"
                        value={newDispatch.dispatchedBy}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Estimated Delivery Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="estimatedDelivery"
                        value={newDispatch.estimatedDelivery}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Items</label>
                      <input
                        type="text"
                        className="form-control"
                        name="items"
                        value={newDispatch.items}
                        onChange={handleInputChange}
                        placeholder="e.g. 15 items"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        value={newDispatch.notes}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Additional notes about this dispatch"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateDispatch}>
                  Create Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================
           View Modal
         ================================ */}
      {showViewModal && currentDispatch && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Dispatch Details: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <p className="mb-0"><strong>Dispatched By:</strong> {currentDispatch.dispatchedBy}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaCalendarAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p className="mb-1"><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                    <p className="mb-1"><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="mb-2">Delivery Address:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.deliveryAddress}
                    </div>
                  </div>
                </div>

                <h6 className="mt-4 mb-2">Items Dispatched:</h6>
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
                      {currentDispatch.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================
           Track Modal
           - Timeline built with Bootstrap utilities (no custom CSS)
         ================================ */}
      {showTrackModal && currentDispatch && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Track Dispatch: {currentDispatch.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowTrackModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>To Facility:</strong> {currentDispatch.facility}</p>
                    <p className="mb-1"><strong>Dispatch Date:</strong> {currentDispatch.date}</p>
                    <p className="mb-1"><strong>Estimated Delivery:</strong> {currentDispatch.estimatedDelivery}</p>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Tracking Number:</strong> {currentDispatch.trackingNumber}</p>
                    <p className="mb-1"><strong>Status:</strong> <StatusBadge status={currentDispatch.status} /></p>
                    <p className="mb-1"><strong>Current Location:</strong> {currentDispatch.currentLocation}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <h6 className="mb-2">Delivery Progress</h6>
                  <div className="progress" style={{ height: '1.25rem' }}>
                    <div
                      className="progress-bar bg-warning text-dark"
                      role="progressbar"
                      style={{ width: `${currentDispatch.progress}%` }}
                      aria-valuenow={currentDispatch.progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {currentDispatch.progress}%
                    </div>
                  </div>
                  <p className="text-muted small mt-2">Your dispatch is {currentDispatch.progress}% complete</p>
                </div>

                {/* Timeline using border-start + badges */}
                <h6 className="mb-2">Tracking Timeline</h6>
                <div className="ps-3 border-start">
                  <div className="d-flex align-items-start gap-2 mb-3">
                    <span className="badge bg-success mt-1">✓</span>
                    <div>
                      <div className="fw-semibold">Order Processed</div>
                      <div className="text-muted small">{currentDispatch.date} — Warehouse</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2 mb-3">
                    <span className="badge bg-warning text-dark mt-1">→</span>
                    <div>
                      <div className="fw-semibold">In Transit</div>
                      <div className="text-muted small">Current Location: {currentDispatch.currentLocation}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2 mb-3">
                    <span className="badge bg-secondary mt-1">•</span>
                    <div>
                      <div className="fw-semibold">Out for Delivery</div>
                      <div className="text-muted small">Expected: {currentDispatch.estimatedDelivery}</div>
                    </div>
                  </div>

                  <div className="d-flex align-items-start gap-2">
                    <span className="badge bg-secondary mt-1">•</span>
                    <div>
                      <div className="fw-semibold">Delivered</div>
                      <div className="text-muted small">Pending</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentDispatch.notes}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowTrackModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Print Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showCreateModal || showViewModal || showTrackModal) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SuperAdminDispatches;
