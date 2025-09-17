import React, { useState } from 'react';
import { 
  FaUser, FaUserShield, FaPlus, FaKey, FaLock, FaUnlock, 
  FaSearch, FaFilter, FaEdit, FaTrash, FaUserTag, FaUserCog
} from 'react-icons/fa';

const FacilityUsersRoles = () => {
  // State for modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showLockUnlockModal, setShowLockUnlockModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  
  // Sample data for users
  const users = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@facility.com', 
      role: 'Administrator', 
      department: 'IT', 
      status: 'Active', 
      lastLogin: '2023-07-15' 
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@facility.com', 
      role: 'Pharmacist', 
      department: 'Pharmacy', 
      status: 'Active', 
      lastLogin: '2023-07-14' 
    },
    { 
      id: 3, 
      name: 'Michael Brown', 
      email: 'michael.brown@facility.com', 
      role: 'Ward Manager', 
      department: 'General Ward', 
      status: 'Locked', 
      lastLogin: '2023-07-10' 
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      email: 'emily.davis@facility.com', 
      role: 'Nurse', 
      department: 'ICU', 
      status: 'Active', 
      lastLogin: '2023-07-15' 
    },
    { 
      id: 5, 
      name: 'David Wilson', 
      email: 'david.wilson@facility.com', 
      role: 'Doctor', 
      department: 'Emergency', 
      status: 'Active', 
      lastLogin: '2023-07-13' 
    },
  ];
  
  // Sample data for roles
  const roles = [
    { id: 1, name: 'Administrator', description: 'Full system access', userCount: 2 },
    { id: 2, name: 'Pharmacist', description: 'Medication management', userCount: 3 },
    { id: 3, name: 'Ward Manager', description: 'Ward operations management', userCount: 1 },
    { id: 4, name: 'Nurse', description: 'Patient care', userCount: 5 },
    { id: 5, name: 'Doctor', description: 'Medical treatment', userCount: 4 },
  ];
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3">Users & Roles</h1>
            <button className="btn btn-primary" onClick={() => setShowAddUserModal(true)}>
              <FaPlus className="me-2" /> Add User
            </button>
          </div>
          
          <div className="card mb-4">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Facility Users</h5>
              <div className="d-flex gap-2">
                <div className="input-group input-group-sm">
                  <span className="input-group-text"><FaSearch /></span>
                  <input type="text" className="form-control" placeholder="Search users..." />
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
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.department}</td>
                        <td>
                          <span className={`badge ${user.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowEditUserModal(true)}>
                              <FaEdit />
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={() => setShowResetPasswordModal(true)}>
                              <FaKey />
                            </button>
                            <button 
                              className={`btn btn-sm ${user.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'}`} 
                              onClick={() => setShowLockUnlockModal(true)}
                            >
                              {user.status === 'Active' ? <FaLock /> : <FaUnlock />}
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
          
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="mb-0">User Roles</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th>Users Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map(role => (
                      <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                        <td>{role.description}</td>
                        <td>{role.userCount}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary">
                              <FaUserCog />
                            </button>
                            <button className="btn btn-sm btn-outline-secondary">
                              <FaUserTag />
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
        </div>
      </div>
      
      {/* Modals */}
      {/* Add User Modal */}
      <div className={`modal fade ${showAddUserModal ? 'show' : ''}`} style={{ display: showAddUserModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddUserModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" placeholder="Enter full name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" placeholder="Enter email address" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" placeholder="Enter password" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" placeholder="Confirm password" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select">
                    <option value="">Select role</option>
                    <option value="admin">Administrator</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="ward_manager">Ward Manager</option>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select className="form-select">
                    <option value="">Select department</option>
                    <option value="it">IT</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="general_ward">General Ward</option>
                    <option value="icu">ICU</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Add User</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit User Modal */}
      <div className={`modal fade ${showEditUserModal ? 'show' : ''}`} style={{ display: showEditUserModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit User</h5>
              <button type="button" className="btn-close" onClick={() => setShowEditUserModal(false)}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" defaultValue="John Smith" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" defaultValue="john.smith@facility.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" defaultValue="admin">
                    <option value="admin">Administrator</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="ward_manager">Ward Manager</option>
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Department</label>
                  <select className="form-select" defaultValue="it">
                    <option value="it">IT</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="general_ward">General Ward</option>
                    <option value="icu">ICU</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" defaultValue="active">
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowEditUserModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary">Update User</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset Password Modal */}
      <div className={`modal fade ${showResetPasswordModal ? 'show' : ''}`} style={{ display: showResetPasswordModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Reset Password</h5>
              <button type="button" className="btn-close" onClick={() => setShowResetPasswordModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to reset the password for <strong>John Smith</strong>?</p>
              <p className="text-muted">A temporary password will be generated and sent to the user's email address.</p>
              <form>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <input type="password" className="form-control" defaultValue="tempPass123!" readOnly />
                    <button className="btn btn-outline-secondary" type="button">Copy</button>
                  </div>
                  <div className="form-text">This is a temporary password. User will be required to change it on first login.</div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowResetPasswordModal(false)}>Cancel</button>
              <button type="button" className="btn btn-warning">Reset Password</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lock/Unlock User Modal */}
      <div className={`modal fade ${showLockUnlockModal ? 'show' : ''}`} style={{ display: showLockUnlockModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Lock User Account</h5>
              <button type="button" className="btn-close" onClick={() => setShowLockUnlockModal(false)}></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to <strong>lock</strong> the account for <strong>John Smith</strong>?</p>
              <p className="text-muted">The user will not be able to log in until the account is unlocked.</p>
              <div className="mb-3">
                <label className="form-label">Reason (Optional)</label>
                <textarea className="form-control" rows="3" placeholder="Enter reason for locking account"></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowLockUnlockModal(false)}>Cancel</button>
              <button type="button" className="btn btn-danger">Lock Account</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {(showAddUserModal || showEditUserModal || showResetPasswordModal || showLockUnlockModal) && 
        <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUsersRoles;