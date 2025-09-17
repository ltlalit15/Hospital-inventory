import React, { useState } from 'react';
import { 
  FaUserShield, FaWarehouse, FaHospital, FaUser, FaPlus, FaEdit, FaSave, FaTimes, FaCheck,
  FaTachometerAlt, FaBoxes, FaClipboardList, FaTruck, FaChartBar, FaTools, FaBuilding, FaUsersCog, FaCog
} from 'react-icons/fa';

const SuperAdminRoles = () => {
  // State for roles
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Super Admin', 
      description: 'Full system access with all permissions',
      icon: <FaUserShield className="text-danger" />,
      permissions: {
        dashboard: true,
        inventory: true,
        requisitions: true,
        dispatches: true,
        reports: true,
        assets: true,
        facilities: true,
        users: true,
        settings: true
      }
    },
    { 
      id: 2, 
      name: 'Main Warehouse Admin', 
      description: 'Manages warehouse operations and inventory',
      icon: <FaWarehouse className="text-primary" />,
      permissions: {
        dashboard: true,
        inventory: true,
        requisitions: true,
        dispatches: true,
        reports: true,
        assets: true,
        facilities: false,
        users: true,
        settings: false
      }
    },
    { 
      id: 3, 
      name: 'Facility Admin', 
      description: 'Manages facility-specific operations',
      icon: <FaHospital className="text-info" />,
      permissions: {
        dashboard: true,
        inventory: true,
        requisitions: true,
        dispatches: false,
        reports: true,
        assets: true,
        facilities: true,
        users: true,
        settings: false
      }
    },
    { 
      id: 4, 
      name: 'Facility User', 
      description: 'Limited access to facility operations',
      icon: <FaUser className="text-success" />,
      permissions: {
        dashboard: true,
        inventory: true,
        requisitions: true,
        dispatches: false,
        reports: true,
        assets: false,
        facilities: false,
        users: false,
        settings: false
      }
    }
  ]);
  
  // State for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // State for current role
  const [currentRole, setCurrentRole] = useState(null);
  
  // State for new role form
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: {
      dashboard: true,
      inventory: true,
      requisitions: true,
      dispatches: false,
      reports: true,
      assets: false,
      facilities: false,
      users: false,
      settings: false
    }
  });
  
  // State for permission form
  const [permissionForm, setPermissionForm] = useState({
    dashboard: false,
    inventory: false,
    requisitions: false,
    dispatches: false,
    reports: false,
    assets: false,
    facilities: false,
    users: false,
    settings: false
  });
  
  // Permission modules
  const permissionModules = [
    { id: 'dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'inventory', name: 'Inventory Management', icon: <FaBoxes /> },
    { id: 'requisitions', name: 'Requisitions', icon: <FaClipboardList /> },
    { id: 'dispatches', name: 'Dispatches', icon: <FaTruck /> },
    { id: 'reports', name: 'Reports', icon: <FaChartBar /> },
    { id: 'assets', name: 'Assets', icon: <FaTools /> },
    { id: 'facilities', name: 'Facilities', icon: <FaBuilding /> },
    { id: 'users', name: 'Users', icon: <FaUsersCog /> },
    { id: 'settings', name: 'Settings', icon: <FaCog /> }
  ];
  
  // Modal handlers
  const openEditModal = (role) => {
    setCurrentRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: { ...role.permissions }
    });
    setShowEditModal(true);
  };
  
  const openAddModal = () => {
    setNewRole({
      name: '',
      description: '',
      permissions: {
        dashboard: true,
        inventory: true,
        requisitions: true,
        dispatches: false,
        reports: true,
        assets: false,
        facilities: false,
        users: false,
        settings: false
      }
    });
    setShowAddModal(true);
  };
  
  const openPermissionModal = (role) => {
    setCurrentRole(role);
    setPermissionForm({ ...role.permissions });
    setShowPermissionModal(true);
  };
  
  // Form handlers
  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setNewRole({
      ...newRole,
      [name]: value
    });
  };
  
  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissionForm({
      ...permissionForm,
      [name]: checked
    });
  };
  
  const handleNewRolePermissionChange = (e) => {
    const { name, checked } = e.target;
    setNewRole({
      ...newRole,
      permissions: {
        ...newRole.permissions,
        [name]: checked
      }
    });
  };
  
  // Action handlers
  const handleEditRole = () => {
    const updatedRoles = roles.map(role => 
      role.id === currentRole.id 
        ? { 
            ...role, 
            name: newRole.name,
            description: newRole.description,
            permissions: newRole.permissions
          } 
        : role
    );
    
    setRoles(updatedRoles);
    setShowEditModal(false);
  };
  
  const handleAddRole = () => {
    const newItem = {
      id: roles.length + 1,
      name: newRole.name,
      description: newRole.description,
      icon: <FaUser className="text-secondary" />,
      permissions: newRole.permissions
    };
    
    setRoles([...roles, newItem]);
    setShowAddModal(false);
  };
  
  const handleSavePermissions = () => {
    const updatedRoles = roles.map(role => 
      role.id === currentRole.id 
        ? { ...role, permissions: permissionForm } 
        : role
    );
    
    setRoles(updatedRoles);
    setShowPermissionModal(false);
  };
  
  // Permission badge component
  const PermissionBadge = ({ hasPermission }) => {
    return (
      <span className={`badge ${hasPermission ? 'bg-success' : 'bg-secondary'} rounded-circle p-2`}>
        {hasPermission ? <FaCheck /> : <FaTimes />}
      </span>
    );
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Roles & Permissions</h2>
        <button className="btn btn-primary d-flex align-items-center" onClick={openAddModal}>
          <FaPlus className="me-2" /> Add New Role
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUserShield className="text-primary fa-2x" />
              </div>
              <div className="number text-primary fw-bold">{roles.length}</div>
              <div className="label text-muted">Total Roles</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaWarehouse className="text-success fa-2x" />
              </div>
              <div className="number text-success fw-bold">1</div>
              <div className="label text-muted">Warehouse Admins</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaHospital className="text-info fa-2x" />
              </div>
              <div className="number text-info fw-bold">1</div>
              <div className="label text-muted">Facility Admins</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100 stat-card">
            <div className="card-body text-center p-4">
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                <FaUser className="text-warning fa-2x" />
              </div>
              <div className="number text-warning fw-bold">1</div>
              <div className="label text-muted">Facility Users</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role Matrix */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Role Permission Matrix</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Permission</th>
                  {roles.map((role) => (
                    <th key={role.id} className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        {React.cloneElement(role.icon, { className: `${role.icon.props.className} fa-lg mb-1` })}
                        {role.name}
                      </div>
                    </th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {permissionModules.map((module) => (
                  <tr key={module.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="me-2">{module.icon}</span>
                        {module.name}
                      </div>
                    </td>
                    {roles.map((role) => (
                      <td key={role.id} className="text-center">
                        <PermissionBadge hasPermission={role.permissions[module.id]} />
                      </td>
                    ))}
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-primary">
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Role Cards */}
      <div className="row">
        {roles.map((role) => (
          <div className="col-md-4 mb-4" key={role.id}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-4">
                <div className="d-flex align-items-center">
                  {React.cloneElement(role.icon, { className: `${role.icon.props.className} fa-2x me-2` })}
                  <div>
                    <h5 className="mb-0 fw-bold">{role.name}</h5>
                    <p className="text-muted mb-0">{role.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <h6 className="mb-3">Permissions:</h6>
                <div className="row">
                  {permissionModules.map((module) => (
                    <div key={module.id} className="col-6 mb-2">
                      <div className="d-flex align-items-center">
                        <PermissionBadge hasPermission={role.permissions[module.id]} />
                        <span className="ms-2 small">{module.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-outline-primary" onClick={() => openPermissionModal(role)}>
                    <FaEdit className="me-2" /> Edit Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Role Modal */}
      {showEditModal && currentRole && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Role: {currentRole.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={newRole.name}
                      onChange={handleRoleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea 
                      className="form-control" 
                      name="description"
                      value={newRole.description}
                      onChange={handleRoleChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Permissions</label>
                    <div className="row">
                      {permissionModules.map((module) => (
                        <div key={module.id} className="col-6 mb-2">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              name={module.id}
                              checked={newRole.permissions[module.id]}
                              onChange={handleNewRolePermissionChange}
                              id={`permission-${module.id}`}
                            />
                            <label className="form-check-label" htmlFor={`permission-${module.id}`}>
                              {module.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleEditRole}>
                  <FaSave className="me-2" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Role Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Role</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Role Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="name"
                      value={newRole.name}
                      onChange={handleRoleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Description</label>
                    <textarea 
                      className="form-control" 
                      name="description"
                      value={newRole.description}
                      onChange={handleRoleChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Permissions</label>
                    <div className="row">
                      {permissionModules.map((module) => (
                        <div key={module.id} className="col-6 mb-2">
                          <div className="form-check">
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              name={module.id}
                              checked={newRole.permissions[module.id]}
                              onChange={handleNewRolePermissionChange}
                              id={`new-permission-${module.id}`}
                            />
                            <label className="form-check-label" htmlFor={`new-permission-${module.id}`}>
                              {module.name}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddRole}>
                  <FaSave className="me-2" /> Add Role
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Permission Modal */}
      {showPermissionModal && currentRole && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Permissions: {currentRole.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowPermissionModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h6 className="mb-1">{currentRole.name}</h6>
                    <p className="text-muted mb-0">{currentRole.description}</p>
                  </div>
                </div>
                
                <form>
                  <div className="row">
                    {permissionModules.map((module) => (
                      <div key={module.id} className="col-6 mb-3">
                        <div className="card border h-100">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-2">
                              <span className="me-2">{module.icon}</span>
                              <h6 className="mb-0">{module.name}</h6>
                            </div>
                            <div className="form-check form-switch">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                name={module.id}
                                checked={permissionForm[module.id]}
                                onChange={handlePermissionChange}
                                id={`perm-${module.id}`}
                              />
                              <label className="form-check-label" htmlFor={`perm-${module.id}`}>
                                {permissionForm[module.id] ? 'Enabled' : 'Disabled'}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPermissionModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSavePermissions}>
                  <FaSave className="me-2" /> Save Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Backdrop */}
      {(showEditModal || showAddModal || showPermissionModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminRoles;