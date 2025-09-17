import React, { useState } from 'react';
import { FaEdit, FaPlusCircle, FaPills, FaEye } from 'react-icons/fa';

const SuperAdminInventory = () => {
  // Sample inventory data (unchanged)
  const initialInventoryItems = [
    {
      id: 'DRG-0421',
      name: 'Paracetamol 500mg',
      category: 'Pharmaceutical',
      stock: 8,
      unit: 'Tablets',
      minLevel: 20,
      standardCost: 2.50,
      movingAvgCost: 2.60,
      lastPOCost: 2.45,
      batchNo: 'B2023-087',
      expiryDate: '2025-12-01',
      abcClass: 'A',
      facilityTransferPrice: 3.00,
      batches: [
        { batchNo: 'B2023-087', expiry: '2025-12-01', quantity: 8, cost: 2.50 },
        { batchNo: 'B2023-045', expiry: '2025-08-15', quantity: 0, cost: 2.40 },
      ]
    },
    {
      id: 'MS-0876',
      name: 'Surgical Gloves (Large)',
      category: 'Medical Supply',
      stock: 0,
      unit: 'Pairs',
      minLevel: 50,
      standardCost: 1.20,
      movingAvgCost: 1.25,
      lastPOCost: 1.18,
      batchNo: 'B2023-102',
      expiryDate: '2026-03-22',
      abcClass: 'B',
      facilityTransferPrice: 1.50,
      batches: [
        { batchNo: 'B2023-102', expiry: '2026-03-22', quantity: 0, cost: 1.20 },
      ]
    },
    {
      id: 'CON-1543',
      name: 'Syringe 5ml',
      category: 'Consumable',
      stock: 142,
      unit: 'Pieces',
      minLevel: 30,
      standardCost: 0.80,
      movingAvgCost: 0.82,
      lastPOCost: 0.79,
      batchNo: 'B2023-066',
      expiryDate: '2025-10-30',
      abcClass: 'C',
      facilityTransferPrice: 1.00,
      batches: [
        { batchNo: 'B2023-066', expiry: '2025-10-30', quantity: 100, cost: 0.80 },
        { batchNo: 'B2023-021', expiry: '2025-07-12', quantity: 42, cost: 0.78 },
      ]
    },
    {
      id: 'DRG-2087',
      name: 'Amoxicillin 250mg',
      category: 'Pharmaceutical',
      stock: 45,
      unit: 'Capsules',
      minLevel: 25,
      standardCost: 4.00,
      movingAvgCost: 4.10,
      lastPOCost: 3.95,
      batchNo: 'B2023-118',
      expiryDate: '2025-11-05',
      abcClass: 'A',
      facilityTransferPrice: 4.50,
      batches: [
        { batchNo: 'B2023-118', expiry: '2025-11-05', quantity: 45, cost: 4.00 },
      ]
    },
  ];

  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Pharmaceutical',
    stock: 0,
    unit: '',
    minLevel: 0,
    standardCost: 0,
    movingAvgCost: 0,
    lastPOCost: 0,
    batchNo: '',
    expiryDate: '',
    abcClass: 'A',
    facilityTransferPrice: 0,
    batches: [],
  });

  const [showViewModal, setShowViewModal] = useState(false);
const [viewItem, setViewItem] = useState(null);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Calculate status
  const calculateStatus = (item) => {
    if (item.stock === 0) return 'out';
    if (item.stock < item.minLevel) return 'low';
    return 'in';
  };

  const openBatchModal = (item) => {
    setSelectedItem(item);
    setShowBatchModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'low':
        return <span className="badge bg-warning text-dark rounded-pill px-3 py-2">Low Stock</span>;
      case 'out':
        return <span className="badge bg-danger rounded-pill px-3 py-2">Out of Stock</span>;
      case 'in':
        return <span className="badge bg-success rounded-pill px-3 py-2">In Stock</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-2">Unknown</span>;
    }
  };

  const getRowClass = (status) => {
    switch (status) {
      case 'low':
        return 'table-warning';
      case 'out':
        return 'table-danger';
      default:
        return '';
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      category: 'Pharmaceutical',
      stock: 0,
      unit: '',
      minLevel: 0,
      standardCost: 0,
      movingAvgCost: 0,
      lastPOCost: 0,
      batchNo: '',
      expiryDate: '',
      abcClass: 'A',
      facilityTransferPrice: 0,
      batches: [],
    });
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setFormData({
      id: item.id,
      name: item.name,
      category: item.category,
      stock: item.stock,
      unit: item.unit,
      minLevel: item.minLevel,
      standardCost: item.standardCost,
      movingAvgCost: item.movingAvgCost,
      lastPOCost: item.lastPOCost,
      batchNo: item.batchNo,
      expiryDate: item.expiryDate,
      abcClass: item.abcClass,
      facilityTransferPrice: item.facilityTransferPrice,
      batches: item.batches,
    });
    setShowEditModal(true);
  };

  const openRestockModal = (item) => {
    setCurrentItem(item);
    setShowRestockModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['stock', 'minLevel', 'standardCost', 'movingAvgCost', 'lastPOCost', 'facilityTransferPrice'].includes(name)
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleAddItem = () => {
    if (!formData.id || !formData.name || !formData.unit) {
      alert('Please fill required fields: ID, Name, Unit.');
      return;
    }
    setInventoryItems([...inventoryItems, { ...formData }]);
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === currentItem.id ? { ...formData } : item
      )
    );
    setShowEditModal(false);
  };

  const handleRestock = () => {
    const amount = parseInt(document.getElementById('restockAmount').value) || 0;
    if (amount <= 0) {
      alert('Enter valid restock amount.');
      return;
    }
    setInventoryItems(
      inventoryItems.map((item) =>
        item.id === currentItem.id
          ? { ...item, stock: item.stock + amount }
          : item
      )
    );
    setShowRestockModal(false);
  };

  const closeModalOnBackdrop = (e) => {
    if (e.target.classList.contains('modal')) {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowRestockModal(false);
      setShowBatchModal(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-black mb-0">Inventory Management</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={openAddModal}>
          <FaPlusCircle className="me-2" /> Add New Item
        </button>
      </div>

      {/* Table Card */}
      <div className="card border-0 ">
        <div className="card-header bg-light">
          <h5 className="mb-0 text-muted">All Inventory Items</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="px-4 py-3">Item ID</th>
                  <th scope="col" className="px-4 py-3">Name</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Stock</th>
                  <th scope="col" className="px-4 py-3">Unit</th>
                  <th scope="col" className="px-4 py-3">Std Cost</th>
                  <th scope="col" className="px-4 py-3">Moving Avg</th>
                  <th scope="col" className="px-4 py-3">Last PO</th>
                  <th scope="col" className="px-4 py-3">Batch/Lot</th>
                  <th scope="col" className="px-4 py-3">Expiry</th>
                  <th scope="col" className="px-4 py-3">ABC Class</th>
                  <th scope="col" className="px-4 py-3">Transfer Price</th>
                  <th scope="col" className="px-4 py-3">Min Level</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => {
                  const status = calculateStatus(item);
                  return (
                    <tr key={item.id} className={getRowClass(status)}>
                      <td className="px-4 py-3 align-middle">{item.id}</td>
                      <td className="px-4 py-3 align-middle">{item.name}</td>
                      <td className="px-4 py-3 align-middle">{item.category}</td>
                      <td className="px-4 py-3 align-middle fw-bold">{item.stock}</td>
                      <td className="px-4 py-3 align-middle">{item.unit}</td>
                      <td className="px-4 py-3 align-middle">₵{item.standardCost?.toFixed(2)}</td>
                      <td className="px-4 py-3 align-middle">₵{item.movingAvgCost?.toFixed(2)}</td>
                      <td className="px-4 py-3 align-middle">₵{item.lastPOCost?.toFixed(2)}</td>
                      <td className="px-4 py-3 align-middle">{item.batchNo}</td>
                      <td className="px-4 py-3 align-middle">{item.expiryDate?.split('-').reverse().join('/')}</td>
                      <td className="px-4 py-3 align-middle">
                        <span className={`badge bg-${item.abcClass === 'A' ? 'success' : item.abcClass === 'B' ? 'warning' : 'info'} text-dark rounded-pill`}>
                          {item.abcClass}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-middle">₵{item.facilityTransferPrice?.toFixed(2)}</td>
                      <td className="px-4 py-3 align-middle">{item.minLevel}</td>
                      <td className="px-4 py-3 align-middle">{getStatusBadge(status)}</td>
                      <td className="px-4 py-3 align-middle">
  <div className="d-flex gap-2">
    {/* ✅ NEW: View Button */}
    <button
      className="btn btn-sm btn-outline-secondary"
      onClick={() => {
        setViewItem(item);
        setShowViewModal(true);
      }}
      title="View Details"
    >
      View
    </button>

    <button
      className="btn btn-sm btn-outline-primary"
      onClick={() => openEditModal(item)}
      title="Edit"
    >
      <FaEdit />
    </button>

    <button
      className="btn btn-sm btn-outline-success"
      onClick={() => openRestockModal(item)}
      title="Restock"
    >
      <FaPlusCircle />
    </button>

    <button
      className="btn btn-sm bg-primary text-white"
      onClick={() => openBatchModal(item)}
      title="View Batches"
    >
      Batches
    </button>
  </div>
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== MODALS ========== */}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Add New Inventory Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item ID <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g. DRG-0421"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Paracetamol"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select form-select-lg"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Stock</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="e.g. Tablets, Boxes"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Minimum Stock Level</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="minLevel"
                    value={formData.minLevel}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                {/* ✅ NEW FIELDS IN ADD MODAL */}
                <div className="mb-3">
                  <label className="form-label">Standard Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="standardCost"
                    value={formData.standardCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Moving Avg Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="movingAvgCost"
                    value={formData.movingAvgCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last PO Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="lastPOCost"
                    value={formData.lastPOCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Batch/Lot No</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleInputChange}
                    placeholder="e.g. B2023-087"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ABC Class</label>
                  <select
                    className="form-select form-select-lg"
                    name="abcClass"
                    value={formData.abcClass}
                    onChange={handleInputChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Facility Transfer Price</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="facilityTransferPrice"
                    value={formData.facilityTransferPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                {/* ✅ END NEW FIELDS */}
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal (unchanged except formData includes new fields) */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Edit Inventory Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Item ID</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select form-select-lg"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Stock</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Minimum Stock Level</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="minLevel"
                    value={formData.minLevel}
                    onChange={handleInputChange}
                    min="0"
                    step="1"
                  />
                </div>
                {/* ✅ NEW FIELDS IN EDIT MODAL */}
                <div className="mb-3">
                  <label className="form-label">Standard Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="standardCost"
                    value={formData.standardCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Moving Avg Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="movingAvgCost"
                    value={formData.movingAvgCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Last PO Cost</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="lastPOCost"
                    value={formData.lastPOCost}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Batch/Lot No</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="batchNo"
                    value={formData.batchNo}
                    onChange={handleInputChange}
                    placeholder="e.g. B2023-087"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">ABC Class</label>
                  <select
                    className="form-select form-select-lg"
                    name="abcClass"
                    value={formData.abcClass}
                    onChange={handleInputChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Facility Transfer Price</label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    name="facilityTransferPrice"
                    value={formData.facilityTransferPrice}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                  />
                </div>
                {/* ✅ END NEW FIELDS */}
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditItem}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restock Modal (unchanged) */}
      {showRestockModal && currentItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Restock Item</h5>
                <button type="button" className="btn-close" onClick={() => setShowRestockModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <h5 className="mb-1">{currentItem.name}</h5>
                <p className="text-muted">
                  Current Stock: <strong>{currentItem.stock} {currentItem.unit}</strong>
                </p>
                <div className="mb-3">
                  <label className="form-label">Amount to Add</label>
                  <input
                    type="number"
                    className="form-control form-control-lg text-center"
                    id="restockAmount"
                    min="1"
                    defaultValue="1"
                  />
                </div>
              </div>
              <div className="modal-footer border-top-0 justify-content-center">
                <button type="button" className="btn btn-secondary me-2" onClick={() => setShowRestockModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleRestock}>
                  Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Details Modal (unchanged) */}
      {showBatchModal && selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title">Batch Details: {selectedItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowBatchModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-sm table-bordered mb-0">
                    <thead>
                      <tr>
                        <th>Batch No</th>
                        <th>Expiry</th>
                        <th>Quantity</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedItem.batches?.map((batch, idx) => (
                        <tr key={idx}>
                          <td>{batch.batchNo}</td>
                          <td>{batch.expiry.split('-').reverse().join('/')}</td>
                          <td>{batch.quantity} {selectedItem.unit}</td>
                          <td>₵{batch.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBatchModal(false)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowBatchModal(false);
                    openEditModal(selectedItem);
                  }}
                >
                  Add New Batch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
{/* View Item Modal */}
{showViewModal && viewItem && (
  <div className="modal fade show d-block" tabIndex="-1" onClick={closeModalOnBackdrop}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header border-bottom-0">
          <h5 className="modal-title">Item Details: {viewItem.name}</h5>
          <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="row mb-3">
            <div className="col-6 fw-bold">Item ID:</div>
            <div className="col-6">{viewItem.id}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Name:</div>
            <div className="col-6">{viewItem.name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Category:</div>
            <div className="col-6">{viewItem.category}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Stock:</div>
            <div className="col-6">{viewItem.stock} {viewItem.unit}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Unit:</div>
            <div className="col-6">{viewItem.unit}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Min Level:</div>
            <div className="col-6">{viewItem.minLevel}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Standard Cost:</div>
            <div className="col-6">₵{viewItem.standardCost?.toFixed(2)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Moving Avg Cost:</div>
            <div className="col-6">₵{viewItem.movingAvgCost?.toFixed(2)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Last PO Cost:</div>
            <div className="col-6">₵{viewItem.lastPOCost?.toFixed(2)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Batch/Lot No:</div>
            <div className="col-6">{viewItem.batchNo || '—'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Expiry Date:</div>
            <div className="col-6">{viewItem.expiryDate ? viewItem.expiryDate.split('-').reverse().join('/') : '—'}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">ABC Class:</div>
            <div className="col-6">
              <span className={`badge bg-${viewItem.abcClass === 'A' ? 'success' : viewItem.abcClass === 'B' ? 'warning' : 'info'} text-dark`}>
                {viewItem.abcClass}
              </span>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Transfer Price:</div>
            <div className="col-6">₵{viewItem.facilityTransferPrice?.toFixed(2)}</div>
          </div>
          <div className="row mb-3">
            <div className="col-6 fw-bold">Status:</div>
            <div className="col-6">{getStatusBadge(calculateStatus(viewItem))}</div>
          </div>
        </div>
        <div className="modal-footer border-top-0">
          <button type="button" className="btn btn-secondary" onClick={() => setShowViewModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}
     {(showAddModal || showEditModal || showRestockModal || showBatchModal || showViewModal) && (
  <div className="modal-backdrop fade show"></div>
)}
    </div>
  );
};

export default SuperAdminInventory;