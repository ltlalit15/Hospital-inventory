import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap'; // ✅ Import required components

const FacilityUser = () => {
  const [users, setUsers] = useState([
    {
      id: 'USR-001',
      name: 'John Mensah',
      role: 'Super Admin',
      facility: 'Headquarters',
      department: 'Administration',
      status: 'Active',
      lastLogin: '15 Oct 2023 10:30 AM'
    },
    {
      id: 'USR-002',
      name: 'Alice Ofori',
      role: 'Warehouse Admin',
      facility: 'Warehouse A',
      department: 'Logistics',
      status: 'Active',
      lastLogin: '14 Oct 2023 03:45 PM'
    },
    {
      id: 'USR-003',
      name: 'Dr. Kwame Asare',
      role: 'Facility Admin',
      facility: 'Main Hospital',
      department: 'Medical',
      status: 'Active',
      lastLogin: '13 Oct 2023 09:15 AM'
    },
    {
      id: 'USR-004',
      name: 'Nurse Ama Serwaa',
      role: 'Facility User',
      facility: 'Emergency Wing',
      department: 'Nursing',
      status: 'Inactive',
      lastLogin: '10 Oct 2023 11:20 AM'
    }
  ]);

  const handleAction = (userId, action) => {
    alert(`Action: ${action} for User ID: ${userId}`);
    
    if (action === 'Deactivate' || action === 'Activate') {
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: user.status === 'Active' ? 'Inactive' : 'Active'
          };
        }
        return user;
      }));
    }
  };

  const getStatusClass = (status) => {
    return status === 'Active' ? 'bg-success' : 'bg-secondary';
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Super Admin':
        return 'bg-danger';
      case 'Warehouse Admin':
        return 'bg-primary';
      case 'Facility Admin':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Form state
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Facility User',
    facility: '',
    department: '',
    status: 'Active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.facility || !newUser.department) {
      alert('Please fill all required fields');
      return;
    }

    const newUserEntry = {
      ...newUser,
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      lastLogin: 'Never'
    };

    setUsers([...users, newUserEntry]);
    setNewUser({
      name: '',
      role: 'Facility User',
      facility: '',
      department: '',
      status: 'Active'
    });
    handleCloseModal();
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header with H1 and Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="mb-3 mb-md-0">Facility User Management</h1>
        <button className="btn btn-primary" onClick={handleShowModal}>
          <i className="bi bi-plus me-1"></i> Add New User
        </button>
      </div>
      
      <div className="card shadow-sm">
        <div className="card-header fs-3 text-dark ">
          <h5 className="mb-0">System Users</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                  <th scope="col">Facility</th>
                  <th scope="col">Department</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last Login</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.facility}</td>
                    <td>{user.department}</td>
                    <td>
                      <span className={`badge ${getStatusClass(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleAction(user.id, 'Edit')}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            user.status === 'Active' 
                              ? 'btn-outline-warning' 
                              : 'btn-outline-success'
                          }`}
                          onClick={() => handleAction(user.id, user.status === 'Active' ? 'Deactivate' : 'Activate')}
                        >
                          {user.status === 'Active' ? (
                            <>
                              <i className="bi bi-person-x"></i>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-check"></i>
                            </>
                          )}
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
      
      {/* Stats Cards for Mobile View */}
      <div className="d-md-none mt-4">
        <div className="row">
          {users.map((user) => (
            <div key={user.id} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title">{user.name}</h5>
                    <span className={`badge ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <p className="card-text">
                    <strong>ID:</strong> {user.id}<br />
                    <strong>Role:</strong> <span className={`badge ${getRoleBadgeClass(user.role)}`}>{user.role}</span><br />
                    <strong>Facility:</strong> {user.facility}<br />
                    <strong>Department:</strong> {user.department}<br />
                    <strong>Last Login:</strong> {user.lastLogin}
                  </p>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAction(user.id, 'Edit')}
                    >
                      <i className="bi bi-pencil"></i> Edit
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        user.status === 'Active' 
                          ? 'btn-outline-warning' 
                          : 'btn-outline-success'
                      }`}
                      onClick={() => handleAction(user.id, user.status === 'Active' ? 'Deactivate' : 'Activate')}
                    >
                      {user.status === 'Active' ? (
                        <>
                          <i className="bi bi-person-x"></i> Deactivate
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check"></i> Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New User Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., John Mensah"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role *</Form.Label>
                  <Form.Select
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Warehouse Admin">Warehouse Admin</option>
                    <option value="Facility Admin">Facility Admin</option>
                    <option value="Facility User">Facility User</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Facility *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Main Hospital"
                    name="facility"
                    value={newUser.facility}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Department *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Emergency"
                    name="department"
                    value={newUser.department}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={newUser.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacilityUser;