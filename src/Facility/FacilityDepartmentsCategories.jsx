import React, { useState } from 'react';
import { 
  FaHospital, FaTags, FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaEye, FaProcedures, FaPills, FaBriefcaseMedical, FaSave
} from 'react-icons/fa';

const FacilityDepartmentsCategories = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('departments');
  
  // State for modals
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showUpdateDepartmentModal, setShowUpdateDepartmentModal] = useState(false);
  const [showRemoveDepartmentModal, setShowRemoveDepartmentModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
  const [showRemoveCategoryModal, setShowRemoveCategoryModal] = useState(false);
  
  // Sample data for departments
  const departments = [
    { id: 1, name: 'General Ward', type: 'Ward', location: 'Building A, Floor 1', head: 'Dr. Smith', capacity: 50 },
    { id: 2, name: 'ICU', type: 'Ward', location: 'Building A, Floor 2', head: 'Dr. Johnson', capacity: 20 },
    { id: 3, name: 'Pharmacy', type: 'Pharmacy', location: 'Building B, Ground Floor', head: 'Dr. Williams', capacity: 0 },
    { id: 4, name: 'Operating Theater 1', type: 'OT', location: 'Building C, Floor 3', head: 'Dr. Brown', capacity: 1 },
    { id: 5, name: 'Operating Theater 2', type: 'OT', location: 'Building C, Floor 3', head: 'Dr. Davis', capacity: 1 },
  ];
  
  // Sample data for categories
  const categories = [
    { id: 1, name: 'Medicines', description: 'All types of medicines and drugs', itemCount: 120 },
    { id: 2, name: 'Surgical Equipment', description: 'Instruments and tools used in surgery', itemCount: 85 },
    { id: 3, name: 'PPE', description: 'Personal protective equipment', itemCount: 45 },
    { id: 4, name: 'Diagnostic Tools', description: 'Equipment for diagnosis', itemCount: 32 },
    { id: 5, name: 'Consumables', description: 'Single-use medical supplies', itemCount: 210 },
  ];
  
  // Render the active tab content
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'departments':
        return (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Departments Setup</h2>
              <button className="btn btn-primary" onClick={() => setShowAddDepartmentModal(true)}>
                <FaPlus className="me-2" /> Add Department
              </button>
            </div>
            
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Departments</h5>
                <div className="d-flex gap-2">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text"><FaSearch /></span>
                    <input type="text" className="form-control" placeholder="Search departments..." />
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <FaFilter />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Head</th>
                        <th>Capacity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => (
                        <tr key={dept.id}>
                          <td>{dept.id}</td>
                          <td>{dept.name}</td>
                          <td>
                            <span className={`badge ${dept.type === 'Ward' ? 'bg-primary' : dept.type === 'Pharmacy' ? 'bg-success' : 'bg-info'}`}>
                              {dept.type}
                            </span>
                          </td>
                          <td>{dept.location}</td>
                          <td>{dept.head}</td>
                          <td>{dept.capacity}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => setShowUpdateDepartmentModal(true)}>
                                <FaEdit />
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowRemoveDepartmentModal(true)}>
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Department Types</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="card border-primary">
                      <div className="card-body text-center">
                        <FaProcedures className="text-primary mb-3" size={40} />
                        <h5>Wards</h5>
                        <p className="text-muted">Patient care areas including general wards, ICUs, etc.</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card border-success">
                      <div className="card-body text-center">
                        <FaPills className="text-success mb-3" size={40} />
                        <h5>Pharmacy</h5>
                        <p className="text-muted">Medication storage and dispensing areas</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="card border-info">
                      <div className="card-body text-center">
                        <FaBriefcaseMedical className="text-info mb-3" size={40} />
                        <h5>Operating Theaters</h5>
                        <p className="text-muted">Surgical and procedure rooms</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'categories':
        return (
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Item Categories</h2>
              <button className="btn btn-primary" onClick={() => setShowAddCategoryModal(true)}>
                <FaPlus className="me-2" /> Add Category
              </button>
            </div>
            
            <div className="card">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">All Categories</h5>
                <div className="d-flex gap-2">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text"><FaSearch /></span>
                    <input type="text" className="form-control" placeholder="Search categories..." />
                  </div>
                  <button className="btn btn-sm btn-outline-secondary">
                    <FaFilter />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Item Count</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category.id}>
                          <td>{category.id}</td>
                          <td>{category.name}</td>
                          <td>{category.description}</td>
                          <td>{category.itemCount}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-sm btn-outline-primary" onClick={() => setShowUpdateCategoryModal(true)}>
                                <FaEdit />
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => setShowRemoveCategoryModal(true)}>
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="card mt-4">
              <div className="card-header bg-white">
                <h5 className="mb-0">Category Statistics</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <div className="card border-primary">
                      <div className="card-body text-center">
                        <h3 className="text-primary">{categories.reduce((sum, cat) => sum + cat.itemCount, 0)}</h3>
                        <p className="mb-0">Total Items</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-success">
                      <div className="card-body text-center">
                        <h3 className="text-success">{categories.length}</h3>
                        <p className="mb-0">Categories</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-info">
                      <div className="card-body text-center">
                        <h3 className="text-info">{Math.max(...categories.map(cat => cat.itemCount))}</h3>
                        <p className="mb-0">Largest Category</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card border-warning">
                      <div className="card-body text-center">
                        <h3 className="text-warning">{Math.min(...categories.map(cat => cat.itemCount))}</h3>
                        <p className="mb-0">Smallest Category</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Departments & Categories</h1>
          </div>
          
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                <FaHospital className="me-2" />
                Departments
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <FaTags className="me-2" />
                Categories
              </button>
            </li>
          </ul>
          
          {renderActiveTab()}
        </div>
      </div>
      
      {/* Modals */}
      {/* Add Department Modal */}
      <div className={`modal fade ${showAddDepartmentModal ? 'show' : ''}`} style={{ display: showAddDepartmentModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Department</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddDepartmentModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Department Name</label>
                  <input type="text" className="form-control" placeholder="Enter department name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department Type</label>
                  <select className="form-select">
                    <option value="">Select type</option>
                    <option value="ward">Ward</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="ot">Operating Theater</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" placeholder="Enter location" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Head of Department</label>
                  <input type="text" className="form-control" placeholder="Enter head name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-control" placeholder="Enter capacity" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddDepartmentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Add Department</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Update Department Modal */}
      <div className={`modal fade ${showUpdateDepartmentModal ? 'show' : ''}`} style={{ display: showUpdateDepartmentModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Department</h5>
              <button type="button" className="btn-close" onClick={() => setShowUpdateDepartmentModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Department Name</label>
                  <input type="text" className="form-control" defaultValue="General Ward" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Department Type</label>
                  <select className="form-select" defaultValue="ward">
                    <option value="ward">Ward</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="ot">Operating Theater</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" defaultValue="Building A, Floor 1" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Head of Department</label>
                  <input type="text" className="form-control" defaultValue="Dr. Smith" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Capacity</label>
                  <input type="number" className="form-control" defaultValue="50" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateDepartmentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Update Department</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove Department Modal */}
      <div className={`modal fade ${showRemoveDepartmentModal ? 'show' : ''}`} style={{ display: showRemoveDepartmentModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Remove Department</h5>
              <button type="button" className="btn-close" onClick={() => setShowRemoveDepartmentModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>General Ward</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowRemoveDepartmentModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger">Remove Department</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Category Modal */}
      <div className={`modal fade ${showAddCategoryModal ? 'show' : ''}`} style={{ display: showAddCategoryModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Category</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddCategoryModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input type="text" className="form-control" placeholder="Enter category name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" placeholder="Enter category description"></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddCategoryModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Add Category</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Update Category Modal */}
      <div className={`modal fade ${showUpdateCategoryModal ? 'show' : ''}`} style={{ display: showUpdateCategoryModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Category</h5>
              <button type="button" className="btn-close" onClick={() => setShowUpdateCategoryModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Category Name</label>
                  <input type="text" className="form-control" defaultValue="Medicines" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" defaultValue="All types of medicines and drugs"></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateCategoryModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Update Category</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Remove Category Modal */}
      <div className={`modal fade ${showRemoveCategoryModal ? 'show' : ''}`} style={{ display: showRemoveCategoryModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Remove Category</h5>
              <button type="button" className="btn-close" onClick={() => setShowRemoveCategoryModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove <strong>Medicines</strong> category?</p>
              <p className="text-muted">This action cannot be undone and will affect all items in this category.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowRemoveCategoryModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger">Remove Category</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {(showAddDepartmentModal || showUpdateDepartmentModal || showRemoveDepartmentModal || 
        showAddCategoryModal || showUpdateCategoryModal || showRemoveCategoryModal) && 
        <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityDepartmentsCategories;