import React, { useState } from 'react';
import {
  FaPlus, FaSearch, FaEye, FaTools, FaCheck, FaLaptopMedical, FaHospitalAlt,
  FaCalendarAlt, FaUser, FaMapMarkerAlt
} from 'react-icons/fa';

const SuperAdminAssets = () => {
  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showRepairModal, setShowRepairModal] = useState(false);

  // Current asset
  const [currentAsset, setCurrentAsset] = useState(null);

  // New asset form
  const [newAsset, setNewAsset] = useState({
    id: '',
    name: '',
    category: 'Medical Equipment',
    department: '',
    status: 'Available',
    condition: 'Good',
    purchaseDate: '',
    warrantyExpiry: '',
    location: '',
    assignedTo: '',
    lastMaintenance: '',
    nextMaintenance: '',
    notes: ''
  });

  // Maintenance form
  const [maintenanceForm, setMaintenanceForm] = useState({
    maintenanceDate: '',
    maintenanceType: 'Routine',
    description: '',
    technician: '',
    estimatedCost: '',
    estimatedDuration: ''
  });

  // Repair form
  const [repairForm, setRepairForm] = useState({
    repairDate: '',
    repairDescription: '',
    technician: '',
    partsReplaced: '',
    cost: '',
    notes: ''
  });

  // Mock data
  const [assets, setAssets] = useState([
    {
      id: 'AST-1001',
      name: 'Ventilator',
      category: 'Medical Equipment',
      department: 'ICU',
      status: 'In Use',
      condition: 'Good',
      lastMaintenance: '15 Oct 2023',
      purchaseDate: '15 Jan 2022',
      warrantyExpiry: '15 Jan 2025',
      location: 'ICU Room 3',
      assignedTo: 'Dr. Amoah',
      nextMaintenance: '15 Nov 2023',
      notes: 'Critical equipment for patient care'
    },
    {
      id: 'AST-1002',
      name: 'Ultrasound Machine',
      category: 'Diagnostic',
      department: 'Radiology',
      status: 'In Use',
      condition: 'Fair',
      lastMaintenance: '20 Sep 2023',
      purchaseDate: '10 Mar 2021',
      warrantyExpiry: '10 Mar 2024',
      location: 'Radiology Lab 1',
      assignedTo: 'Dr. Mensah',
      nextMaintenance: '20 Dec 2023',
      notes: 'Requires calibration every 6 months'
    },
    {
      id: 'AST-1003',
      name: 'Patient Monitor',
      category: 'Medical Equipment',
      department: 'Emergency',
      status: 'Under Maintenance',
      condition: 'Needs Repair',
      lastMaintenance: '05 Oct 2023',
      purchaseDate: '20 May 2020',
      warrantyExpiry: '20 May 2023',
      location: 'Maintenance Workshop',
      assignedTo: 'Maintenance Team',
      nextMaintenance: 'N/A',
      notes: 'Display malfunction, requires replacement part'
    }
  ]);

  // Badges (Bootstrap only)
  const StatusBadge = ({ status }) => {
    const map = {
      'In Use': 'bg-success',
      'Under Maintenance': 'bg-danger',
      'Available': 'bg-info text-dark',
      'Retired': 'bg-secondary'
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  const ConditionBadge = ({ condition }) => {
    const map = {
      'Excellent': 'bg-primary',
      'Good': 'bg-success',
      'Fair': 'bg-warning text-dark',
      'Needs Repair': 'bg-danger'
    };
    return <span className={`badge ${map[condition] || 'bg-secondary'}`}>{condition}</span>;
  };

  // Openers
  const openAddModal = () => {
    setNewAsset({
      id: '',
      name: '',
      category: 'Medical Equipment',
      department: '',
      status: 'Available',
      condition: 'Good',
      purchaseDate: '',
      warrantyExpiry: '',
      location: '',
      assignedTo: '',
      lastMaintenance: '',
      nextMaintenance: '',
      notes: ''
    });
    setShowAddModal(true);
  };
  const openViewModal = (asset) => { setCurrentAsset(asset); setShowViewModal(true); };
  const openMaintenanceModal = (asset) => {
    setCurrentAsset(asset);
    setMaintenanceForm({
      maintenanceDate: '',
      maintenanceType: 'Routine',
      description: '',
      technician: '',
      estimatedCost: '',
      estimatedDuration: ''
    });
    setShowMaintenanceModal(true);
  };
  const openRepairModal = (asset) => {
    setCurrentAsset(asset);
    setRepairForm({
      repairDate: '',
      repairDescription: '',
      technician: '',
      partsReplaced: '',
      cost: '',
      notes: ''
    });
    setShowRepairModal(true);
  };

  // Handlers
  const handleAddAssetChange = (e) => {
    const { name, value } = e.target;
    setNewAsset(prev => ({ ...prev, [name]: value }));
  };
  const handleMaintenanceChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({ ...prev, [name]: value }));
  };
  const handleRepairChange = (e) => {
    const { name, value } = e.target;
    setRepairForm(prev => ({ ...prev, [name]: value }));
  };

  // Actions
  const handleAddAsset = () => {
    const newItem = { ...newAsset, id: `AST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` };
    setAssets([newItem, ...assets]);
    setShowAddModal(false);
  };
  const handleScheduleMaintenance = () => {
    setAssets(prev => prev.map(a =>
      a.id === currentAsset.id
        ? { ...a, status: 'Under Maintenance', condition: 'Needs Repair', nextMaintenance: maintenanceForm.maintenanceDate }
        : a
    ));
    setShowMaintenanceModal(false);
  };
  const handleCompleteRepair = () => {
    setAssets(prev => prev.map(a =>
      a.id === currentAsset.id
        ? {
            ...a,
            status: 'Available',
            condition: 'Good',
            lastMaintenance: repairForm.repairDate,
            nextMaintenance: new Date(new Date(repairForm.repairDate).setMonth(new Date(repairForm.repairDate).getMonth() + 3))
              .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          }
        : a
    ));
    setShowRepairModal(false);
  };

  // Search filter (for both table & card list)
  const filtered = assets.filter(a => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      a.id.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.department.toLowerCase().includes(q) ||
      a.status.toLowerCase().includes(q) ||
      a.condition.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid py-3">
      {/* ============================================
          Toolbar
          xs (320–480): stacked
          md (≥768): inline, compact controls
          ============================================ */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-2 mb-4">
        <h2 className="fw-bold mb-0">Assets Management</h2>

        <div className="d-flex flex-column flex-sm-row align-items-stretch gap-2 w-90 w-md-auto">
          {/* Compact search and button */}
          <div className="input-group">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{height: "40px"}} 
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search assets"
            />
            <button className="btn btn-outline-secondary btn-sm" style={{height: "40px"}}  type="button" aria-label="Search">
              <FaSearch />
            </button>
          </div>

          <button className="btn btn-primary btn-sm d-inline-flex align-items-center py-2 px-2" style={{height: "40px", width: "160px"}} onClick={openAddModal}>
            <FaPlus className="me-2" /> Add New Asset
          </button>
        </div>
      </div>

      {/* ============================================
          Stats
          xs: 1 col | md: 4 cols
          ============================================ */}
      <div className="row row-cols-1 row-cols-md-4 g-3 mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaHospitalAlt className="text-success fs-3" />
              </div>
              <div className="text-success fw-bold fs-4">187</div>
              <div className="text-muted small">Total Assets</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaLaptopMedical className="text-primary fs-3" />
              </div>
              <div className="text-primary fw-bold fs-4">142</div>
              <div className="text-muted small">In Use</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTools className="text-warning fs-3" />
              </div>
              <div className="text-warning fw-bold fs-4">12</div>
              <div className="text-muted small">Under Maintenance</div>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-info fs-3" />
              </div>
              <div className="text-info fw-bold fs-4">8</div>
              <div className="text-muted small">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          Assets
          xs: Card List (d-block d-md-none)
          md+: Table    (d-none d-md-block)
          ============================================ */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Hospital Assets</h5>
        </div>

        {/* TABLE (md and up) */}
        <div className="card-body p-0 d-none d-md-block">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Condition</th>
                  <th>Last Maintenance</th>
                  <th>Next Maintenance</th>
                  <th className="text-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset, index) => (
                  <tr key={index}>
                    <td className="fw-bold">{asset.id}</td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.department}</td>
                    <td><StatusBadge status={asset.status} /></td>
                    <td><ConditionBadge condition={asset.condition} /></td>
                    <td>{asset.lastMaintenance}</td>
                    <td>{asset.nextMaintenance}</td>
                    <td>
                      <div className="btn-group" role="group" aria-label="Row actions">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => openViewModal(asset)}>
                          <FaEye />
                        </button>
                        {asset.status === 'Under Maintenance' ? (
                          <button className="btn btn-sm btn-outline-success" onClick={() => openRepairModal(asset)}>
                            <FaCheck />
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-info" onClick={() => openMaintenanceModal(asset)}>
                            <FaTools />
                          </button>
                        )}
                      </div>
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
            {filtered.map((a, i) => (
              <div className="col-12" key={i}>
                <div className="card">
                  <div className="card-body">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="fw-bold">{a.id}</span>
                      <StatusBadge status={a.status} />
                    </div>

                    {/* Meta grid */}
                    <div className="row g-2 small">
                      <div className="col-6">
                        <div className="text-muted">Name</div>
                        <div>{a.name}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Category</div>
                        <div>{a.category}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Department</div>
                        <div>{a.department}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Condition</div>
                        <div><ConditionBadge condition={a.condition} /></div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Last Maint.</div>
                        <div>{a.lastMaintenance}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-muted">Next Maint.</div>
                        <div>{a.nextMaintenance}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-outline-primary w-100 btn-sm" onClick={() => openViewModal(a)}>
                        <FaEye className="me-1" /> View
                      </button>
                      {a.status === 'Under Maintenance' ? (
                        <button className="btn btn-outline-success w-100 btn-sm" onClick={() => openRepairModal(a)}>
                          <FaCheck className="me-1" /> Repair
                        </button>
                      ) : (
                        <button className="btn btn-outline-info w-100 btn-sm" onClick={() => openMaintenanceModal(a)}>
                          <FaTools className="me-1" /> Maintain
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="col-12">
                <div className="alert alert-light border text-center mb-0">No assets found.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================
          Add Asset Modal
          Full-screen on small devices
          ============================================ */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Asset</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  {/* xs: stacked | md+: 2 columns */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Asset Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={newAsset.name}
                        onChange={handleAddAssetChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        name="category"
                        value={newAsset.category}
                        onChange={handleAddAssetChange}
                      >
                        <option value="Medical Equipment">Medical Equipment</option>
                        <option value="Diagnostic">Diagnostic</option>
                        <option value="Furniture">Furniture</option>
                        <option value="IT Equipment">IT Equipment</option>
                        <option value="Vehicle">Vehicle</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        name="department"
                        value={newAsset.department}
                        onChange={handleAddAssetChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={newAsset.status}
                        onChange={handleAddAssetChange}
                      >
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Under Maintenance">Under Maintenance</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Condition</label>
                      <select
                        className="form-select"
                        name="condition"
                        value={newAsset.condition}
                        onChange={handleAddAssetChange}
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Needs Repair">Needs Repair</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={newAsset.location}
                        onChange={handleAddAssetChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Purchase Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="purchaseDate"
                        value={newAsset.purchaseDate}
                        onChange={handleAddAssetChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Warranty Expiry</label>
                      <input
                        type="date"
                        className="form-control"
                        name="warrantyExpiry"
                        value={newAsset.warrantyExpiry}
                        onChange={handleAddAssetChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Assigned To</label>
                      <input
                        type="text"
                        className="form-control"
                        name="assignedTo"
                        value={newAsset.assignedTo}
                        onChange={handleAddAssetChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Next Maintenance</label>
                      <input
                        type="date"
                        className="form-control"
                        name="nextMaintenance"
                        value={newAsset.nextMaintenance}
                        onChange={handleAddAssetChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        value={newAsset.notes}
                        onChange={handleAddAssetChange}
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddAsset}>
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          View Asset Modal
          ============================================ */}
      {showViewModal && currentAsset && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asset Details: {currentAsset.id}</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <FaHospitalAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Name:</strong> {currentAsset.name}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <p className="mb-0"><strong>Department:</strong> {currentAsset.department}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Location:</strong> {currentAsset.location}</p>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-primary me-2" />
                      <p className="mb-0"><strong>Assigned To:</strong> {currentAsset.assignedTo}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1"><strong>Category:</strong> {currentAsset.category}</p>
                    <p className="mb-1"><strong>Status:</strong> <StatusBadge status={currentAsset.status} /></p>
                    <p className="mb-1"><strong>Condition:</strong> <ConditionBadge condition={currentAsset.condition} /></p>
                    <p className="mb-1"><strong>Purchase Date:</strong> {currentAsset.purchaseDate}</p>
                    <p className="mb-1"><strong>Warranty Expiry:</strong> {currentAsset.warrantyExpiry}</p>
                  </div>
                </div>

                <div className="row g-3 mb-2">
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Last Maintenance:</strong> {currentAsset.lastMaintenance}</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="d-flex align-items-center">
                      <FaCalendarAlt className="text-primary me-2" />
                      <p className="mb-0"><strong>Next Maintenance:</strong> {currentAsset.nextMaintenance}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <h6 className="mb-2">Notes:</h6>
                  <div className="card bg-light">
                    <div className="card-body">
                      {currentAsset.notes}
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

      {/* ============================================
          Maintenance Modal
          ============================================ */}
      {showMaintenanceModal && currentAsset && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule Maintenance: {currentAsset.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowMaintenanceModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <p className="mb-1"><strong>Asset ID:</strong> {currentAsset.id}</p>
                    <p className="mb-1"><strong>Current Status:</strong> <StatusBadge status={currentAsset.status} /></p>
                    <p className="mb-1"><strong>Current Condition:</strong> <ConditionBadge condition={currentAsset.condition} /></p>
                    <p className="mb-0"><strong>Last Maintenance:</strong> {currentAsset.lastMaintenance}</p>
                  </div>
                </div>

                <form>
                  {/* xs: stacked | md+: 2 columns */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Maintenance Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="maintenanceDate"
                        value={maintenanceForm.maintenanceDate}
                        onChange={handleMaintenanceChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Maintenance Type</label>
                      <select
                        className="form-select"
                        name="maintenanceType"
                        value={maintenanceForm.maintenanceType}
                        onChange={handleMaintenanceChange}
                      >
                        <option value="Routine">Routine</option>
                        <option value="Preventive">Preventive</option>
                        <option value="Corrective">Corrective</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Technician</label>
                      <input
                        type="text"
                        className="form-control"
                        name="technician"
                        value={maintenanceForm.technician}
                        onChange={handleMaintenanceChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Estimated Duration (days)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="estimatedDuration"
                        value={maintenanceForm.estimatedDuration}
                        onChange={handleMaintenanceChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Estimated Cost ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="estimatedCost"
                        value={maintenanceForm.estimatedCost}
                        onChange={handleMaintenanceChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={maintenanceForm.description}
                        onChange={handleMaintenanceChange}
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMaintenanceModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleScheduleMaintenance}>
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          Repair Modal
          ============================================ */}
      {showRepairModal && currentAsset && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Complete Repair: {currentAsset.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowRepairModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <p className="mb-1"><strong>Asset ID:</strong> {currentAsset.id}</p>
                    <p className="mb-1"><strong>Current Status:</strong> <StatusBadge status={currentAsset.status} /></p>
                    <p className="mb-1"><strong>Current Condition:</strong> <ConditionBadge condition={currentAsset.condition} /></p>
                    <p className="mb-0"><strong>Last Maintenance:</strong> {currentAsset.lastMaintenance}</p>
                  </div>
                </div>

                <form>
                  {/* xs: stacked | md+: 2 columns */}
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">Repair Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="repairDate"
                        value={repairForm.repairDate}
                        onChange={handleRepairChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Technician</label>
                      <input
                        type="text"
                        className="form-control"
                        name="technician"
                        value={repairForm.technician}
                        onChange={handleRepairChange}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">Repair Cost ($)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="cost"
                        value={repairForm.cost}
                        onChange={handleRepairChange}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Parts Replaced</label>
                      <input
                        type="text"
                        className="form-control"
                        name="partsReplaced"
                        value={repairForm.partsReplaced}
                        onChange={handleRepairChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Repair Description</label>
                      <textarea
                        className="form-control"
                        name="repairDescription"
                        value={repairForm.repairDescription}
                        onChange={handleRepairChange}
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        className="form-control"
                        name="notes"
                        value={repairForm.notes}
                        onChange={handleRepairChange}
                        rows="2"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer d-flex gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRepairModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleCompleteRepair}>
                  Complete Repair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {(showAddModal || showViewModal || showMaintenanceModal || showRepairModal) && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default SuperAdminAssets;
