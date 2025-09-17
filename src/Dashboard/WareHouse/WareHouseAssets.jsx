import React, { useState } from 'react';
import { 
  FaPlus, FaSearch, FaEye, FaTools, FaCheck, FaWarehouse, FaTruckLoading 
} from 'react-icons/fa';

const WarehouseAssets = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock warehouse assets
  const [assets, setAssets] = useState([
    { id: 'AST-2001', name: 'Ventilator', category: 'Medical Equipment', location: 'Central Warehouse', status: 'Available', condition: 'Good', lastTransfer: '01 Aug 2023' },
    { id: 'AST-2002', name: 'X-Ray Machine', category: 'Diagnostic', location: 'Facility A', status: 'Transferred', condition: 'Fair', lastTransfer: '20 Jul 2023' },
    { id: 'AST-2003', name: 'ECG Monitor', category: 'Medical Equipment', location: 'Central Warehouse', status: 'Reserved', condition: 'Needs Repair', lastTransfer: 'N/A' }
  ]);

  // Status badge
  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Available': 'bg-success',
      'Transferred': 'bg-primary',
      'Reserved': 'bg-warning',
      'Retired': 'bg-secondary'
    };
    return <span className={`badge ${statusColors[status] || 'bg-secondary'}`}>{status}</span>;
  };

  // Condition badge
  const ConditionBadge = ({ condition }) => {
    const conditionColors = {
      'Good': 'bg-success',
      'Fair': 'bg-warning',
      'Needs Repair': 'bg-danger',
      'Excellent': 'bg-info'
    };
    return <span className={`badge ${conditionColors[condition] || 'bg-secondary'}`}>{condition}</span>;
  };

  return (
    <div className="fade-in py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Warehouse Assets (Global Registry)</h2>
        <div className="d-flex align-items-center">
    
          <button className="btn btn-primary d-flex align-items-center">
           Add New Asset
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaWarehouse className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold">250</div>
              <div className="label text-muted">Global Assets</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTruckLoading className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold">120</div>
              <div className="label text-muted">Transferred</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaTools className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold">25</div>
              <div className="label text-muted">Reserved</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaCheck className="text-info fa-2x" />
              </div>
              <div className="number text-info fw-bold">15</div>
              <div className="label text-muted">Need Attention</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Warehouse Asset Registry</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Current Location</th>
                  <th>Status</th>
                  <th>Condition</th>
                  <th>Last Transfer</th>
                  <th>Next Transfer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index}>
                    <td><span className="fw-bold">{asset.id}</span></td>
                    <td>{asset.name}</td>
                    <td>{asset.category}</td>
                    <td>{asset.location}</td>
                    <td><StatusBadge status={asset.status} /></td>
                    <td><ConditionBadge condition={asset.condition} /></td>
                    <td>{asset.lastTransfer}</td>
                    <td>{asset.status === 'Available' ? '15 Oct 2023' : 'N/A'}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button className="btn btn-sm btn-outline-primary">
                          <FaEye />
                        </button>
                        {asset.status === 'Transferred' ? (
                          <button className="btn btn-sm btn-outline-success">
                            <FaCheck />
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-outline-info">
                            <FaTruckLoading />
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
      </div>
    </div>
  );
};

export default WarehouseAssets;
