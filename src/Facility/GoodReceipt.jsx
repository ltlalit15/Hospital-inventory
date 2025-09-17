import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { FaTruck, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const GoodsReceipt = () => {
  // Sample data for dispatched items (GRN)
  const [receipts, setReceipts] = useState([
    {
      id: 'GRN-2023-001',
      date: '2023-11-15',
      warehouse: 'Central Warehouse',
      status: 'Completed',
      items: [
        {
          itemCode: 'MED-001',
          itemName: 'Paracetamol 500mg',
          dispatchedQty: 100,
          receivedQty: 100,
          shortQty: 0,
          damagedQty: 0,
          reason: '',
          status: 'Received'
        },
        {
          itemCode: 'MED-002',
          itemName: 'Amoxicillin 250mg',
          dispatchedQty: 50,
          receivedQty: 50,
          shortQty: 0,
          damagedQty: 0,
          reason: '',
          status: 'Received'
        }
      ]
    },
    {
      id: 'GRN-2023-002',
      date: '2023-11-16',
      warehouse: 'Central Warehouse',
      status: 'Partial',
      items: [
        {
          itemCode: 'SUP-003',
          itemName: 'Surgical Gloves (L)',
          dispatchedQty: 200,
          receivedQty: 150,
          shortQty: 50,
          damagedQty: 5,
          reason: 'Shortage in shipment',
          status: 'Partial'
        },
        {
          itemCode: 'MED-004',
          itemName: 'Ibuprofen 400mg',
          dispatchedQty: 80,
          receivedQty: 80,
          shortQty: 0,
          damagedQty: 0,
          reason: '',
          status: 'Received'
        },
        {
          itemCode: 'SUP-005',
          itemName: 'Face Masks (N95)',
          dispatchedQty: 100,
          receivedQty: 75,
          shortQty: 25,
          damagedQty: 0,
          reason: 'Backordered',
          status: 'Partial'
        }
      ]
    },
    {
      id: 'GRN-2023-003',
      date: '2023-11-17',
      warehouse: 'Regional Warehouse',
      status: 'Pending',
      items: [
        {
          itemCode: 'MED-005',
          itemName: 'Ceftriaxone 1g',
          dispatchedQty: 30,
          receivedQty: 0,
          shortQty: 30,
          damagedQty: 0,
          reason: '',
          status: 'Pending'
        },
        {
          itemCode: 'SUP-006',
          itemName: 'Syringes 5ml',
          dispatchedQty: 500,
          receivedQty: 0,
          shortQty: 500,
          damagedQty: 0,
          reason: '',
          status: 'Pending'
        }
      ]
    }
  ]);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterWarehouse, setFilterWarehouse] = useState('All');

  // Get unique warehouses for filter
  const warehouses = [...new Set(receipts.map(r => r.warehouse))];

  // State management
  const [showModal, setShowModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get status class for GRN
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-success';
      case 'Partial':
        return 'bg-warning';
      case 'Pending':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Get status class for item
  const getItemStatusClass = (status) => {
    switch(status) {
      case 'Received':
        return 'bg-success';
      case 'Partial':
        return 'bg-warning';
      case 'Pending':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Open receipt detail modal
  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setShowDetailModal(true);
  };

  // Close receipt detail modal
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedReceipt(null);
  };

  // Handle quantity change
  const handleQuantityChange = (receiptId, itemIndex, field, value) => {
    const updatedReceipts = [...receipts];
    const receiptIndex = updatedReceipts.findIndex(r => r.id === receiptId);
    
    if (receiptIndex !== -1) {
      const updatedItem = { ...updatedReceipts[receiptIndex].items[itemIndex] };
      updatedItem[field] = parseInt(value) || 0;
      
      // Auto-calculate short quantity
      if (field === 'receivedQty') {
        updatedItem.shortQty = updatedItem.dispatchedQty - updatedItem.receivedQty;
      }
      
      // Update item status based on quantities
      if (updatedItem.receivedQty === 0) {
        updatedItem.status = 'Pending';
      } else if (updatedItem.receivedQty < updatedItem.dispatchedQty) {
        updatedItem.status = 'Partial';
      } else {
        updatedItem.status = 'Received';
      }
      
      updatedReceipts[receiptIndex].items[itemIndex] = updatedItem;
      
      // Update receipt status
      const allReceived = updatedReceipts[receiptIndex].items.every(item => item.status === 'Received');
      const anyPartial = updatedReceipts[receiptIndex].items.some(item => item.status === 'Partial');
      
      if (allReceived) {
        updatedReceipts[receiptIndex].status = 'Completed';
      } else if (anyPartial) {
        updatedReceipts[receiptIndex].status = 'Partial';
      }
      
      setReceipts(updatedReceipts);
    }
  };

  // Handle reason change
  const handleReasonChange = (receiptId, itemIndex, value) => {
    const updatedReceipts = [...receipts];
    const receiptIndex = updatedReceipts.findIndex(r => r.id === receiptId);
    
    if (receiptIndex !== -1) {
      updatedReceipts[receiptIndex].items[itemIndex].reason = value;
      setReceipts(updatedReceipts);
    }
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    alert('Changes saved successfully!');
    handleCloseDetailModal();
  };

  // Filter receipts based on selected filters
  const filteredReceipts = receipts.filter(receipt => {
    const statusMatch = filterStatus === 'All' || receipt.status === filterStatus;
    const warehouseMatch = filterWarehouse === 'All' || receipt.warehouse === filterWarehouse;
    return statusMatch && warehouseMatch;
  });

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="mb-0">Goods Receipt</h1>
          <p className="text-muted mb-0">Acknowledge dispatched items from warehouse</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Filter by Status</label>
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="Partial">Partial</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Filter by Warehouse</label>
              <select 
                className="form-select"
                value={filterWarehouse}
                onChange={(e) => setFilterWarehouse(e.target.value)}
              >
                <option value="All">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse} value={warehouse}>{warehouse}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilterStatus('All');
                  setFilterWarehouse('All');
                }}
              >
                <i className="bi bi-funnel me-1"></i> Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pb-0">
          <h5 className="mb-0 fs-4">Goods Receipt Notes (GRN)</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">GRN ID</th>
                  <th scope="col">Date</th>
                  <th scope="col">Warehouse</th>
                  <th scope="col">Status</th>
                  <th scope="col">Items</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt) => (
                  <tr key={receipt.id}>
                    <td className="fw-medium">{receipt.id}</td>
                    <td>{receipt.date}</td>
                    <td>{receipt.warehouse}</td>
                    <td>
                      <span className={`badge ${getStatusClass(receipt.status)} text-white`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td>{receipt.items.length} items</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewReceipt(receipt)}
                        title="View Details"
                      >
                        <i className="bi bi-eye mx-2"></i> 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredReceipts.length === 0 && (
            <div className="text-center py-4 text-muted">
              No records found matching the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Receipt Detail Modal */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="xl" centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Goods Receipt Note - {selectedReceipt?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReceipt && (
            <>
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="mb-2">
                    <strong>GRN ID:</strong> {selectedReceipt.id}
                  </div>
                  <div className="mb-2">
                    <strong>Date:</strong> {selectedReceipt.date}
                  </div>
                  <div className="mb-2">
                    <strong>Warehouse:</strong> {selectedReceipt.warehouse}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-2">
                    <strong>Status:</strong> 
                    <span className={`badge ${getStatusClass(selectedReceipt.status)} text-white ms-2`}>
                      {selectedReceipt.status}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong>Total Items:</strong> {selectedReceipt.items.length}
                  </div>
                </div>
              </div>
              
              <h5 className="mb-3">Items Received</h5>
              
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Dispatched Qty</th>
                      <th>Received Qty</th>
                      <th>Short Qty</th>
                      <th>Damaged Qty</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.items.map((item, index) => (
                      <tr key={index}>
                        <td className="fw-medium">{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.dispatchedQty}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.receivedQty}
                            onChange={(e) => handleQuantityChange(selectedReceipt.id, index, 'receivedQty', e.target.value)}
                            min="0"
                            max={item.dispatchedQty}
                          />
                        </td>
                        <td className="fw-medium">{item.shortQty}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={item.damagedQty}
                            onChange={(e) => handleQuantityChange(selectedReceipt.id, index, 'damagedQty', e.target.value)}
                            min="0"
                            max={item.receivedQty}
                          />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={item.reason}
                            onChange={(e) => handleReasonChange(selectedReceipt.id, index, e.target.value)}
                          >
                            <option value="">Select Reason</option>
                            <option value="Shortage in shipment">Shortage in shipment</option>
                            <option value="Damaged in transit">Damaged in transit</option>
                            <option value="Backordered">Backordered</option>
                            <option value="Quality issues">Quality issues</option>
                            <option value="Wrong item shipped">Wrong item shipped</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td>
                          <span className={`badge ${getItemStatusClass(item.status)} text-white`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="alert alert-info mt-4">
                <div className="d-flex align-items-start">
                  <FaTruck className="me-2 mt-1" />
                  <div>
                    <strong>Partial Receipts Support:</strong>
                    <ul className="mb-0 mt-2">
                      <li>If not all items are received, the GRN status will be "Partial"</li>
                      <li>When all items are fully received, the status will update to "Completed"</li>
                      <li>Short Quantity is automatically calculated as: Dispatched Qty - Received Qty</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GoodsReceipt;