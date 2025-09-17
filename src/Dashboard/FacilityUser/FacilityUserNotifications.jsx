import React, { useState } from 'react';
import { 
  FaBell, FaCheck, FaExclamationTriangle, FaInfoCircle, FaSearch, 
  FaFilter, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaClock, 
  FaCheckCircle, FaTimesCircle, FaClipboardList
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacilityUserNotifications = () => {
  // State for notifications and filters
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'approval', 
      title: 'Request Approved', 
      message: 'Your medical supplies request has been approved', 
      timestamp: '2023-07-15 10:30 AM', 
      read: false,
      details: {
        requestId: 'REQ-001',
        approvedBy: 'Dr. Smith',
        approvedDate: '2023-07-15',
        items: [
          { name: 'Medical Gloves', quantity: 50, unit: 'boxes' },
          { name: 'Face Masks', quantity: 200, unit: 'pieces' }
        ],
        pickupInfo: {
          location: 'Pharmacy - Building B, Ground Floor',
          date: '2023-07-16',
          time: '9:00 AM - 5:00 PM'
        }
      }
    },
    { 
      id: 2, 
      type: 'partial_approval', 
      title: 'Request Partially Approved', 
      message: 'Your surgical equipment request has been partially approved', 
      timestamp: '2023-07-14 3:45 PM', 
      read: false,
      details: {
        requestId: 'REQ-002',
        approvedBy: 'Dr. Johnson',
        approvedDate: '2023-07-14',
        notes: 'Scalpel sets approved. Forceps are out of stock and will be ordered.',
        approvedItems: [
          { name: 'Scalpel Set', quantity: 5, unit: 'sets' }
        ],
        rejectedItems: [
          { name: 'Forceps', quantity: 10, unit: 'pieces', reason: 'Out of stock' }
        ],
        pickupInfo: {
          location: 'Central Supply - Building C, Floor 1',
          date: '2023-07-17',
          time: '10:00 AM - 4:00 PM'
        }
      }
    },
    { 
      id: 3, 
      type: 'rejection', 
      title: 'Request Rejected', 
      message: 'Your pharmaceutical items request has been rejected', 
      timestamp: '2023-07-13 11:20 AM', 
      read: true,
      details: {
        requestId: 'REQ-003',
        rejectedBy: 'Dr. Williams',
        rejectedDate: '2023-07-13',
        notes: 'Request rejected due to budget constraints. Please resubmit next quarter.',
        items: [
          { name: 'Antibiotics', quantity: 30, unit: 'bottles' },
          { name: 'Painkillers', quantity: 50, unit: 'strips' }
        ]
      }
    },
    { 
      id: 4, 
      type: 'pickup_info', 
      title: 'Items Ready for Pickup', 
      message: 'Your requested items are ready for pickup', 
      timestamp: '2023-07-12 2:15 PM', 
      read: true,
      details: {
        requestId: 'REQ-004',
        items: [
          { name: 'Bandages', quantity: 20, unit: 'rolls' },
          { name: 'Gauze Pads', quantity: 100, unit: 'pieces' }
        ],
        pickupInfo: {
          location: 'Pharmacy - Building B, Ground Floor',
          date: '2023-07-13',
          time: '9:00 AM - 5:00 PM',
          referenceNumber: 'PU-2023-07-001'
        }
      }
    }
  ]);
  
  // State for filters and modal
  const [filterType, setFilterType] = useState('all');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // State for search term
  const [searchTerm, setSearchTerm] = useState('');
  
  // Helper functions - MOVED HERE BEFORE THEY ARE USED
  // Function to get notification icon
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'approval':
        return <FaCheckCircle className="text-success" />;
      case 'partial_approval':
        return <FaExclamationTriangle className="text-warning" />;
      case 'rejection':
        return <FaTimesCircle className="text-danger" />;
      case 'pickup_info':
        return <FaInfoCircle className="text-info" />;
      default:
        return <FaBell className="text-secondary" />;
    }
  };
  
  // Function to get notification badge class
  const getNotificationBadgeClass = (type) => {
    switch(type) {
      case 'approval':
        return 'bg-success';
      case 'partial_approval':
        return 'bg-warning text-dark';
      case 'rejection':
        return 'bg-danger';
      case 'pickup_info':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary';
    }
  };
  
  // Function to get notification type label
  const getNotificationTypeLabel = (type) => {
    switch(type) {
      case 'approval':
        return 'Approved';
      case 'partial_approval':
        return 'Partially Approved';
      case 'rejection':
        return 'Rejected';
      case 'pickup_info':
        return 'Pickup Info';
      default:
        return 'Notification';
    }
  };
  
  // Filter notifications based on selected type and search term
  const filteredNotifications = notifications.filter(notification => {
    // First apply type filter
    const typeMatch = filterType === 'all' || notification.type === filterType;
    
    // Then apply search filter if search term is not empty
    const searchMatch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getNotificationTypeLabel(notification.type).toLowerCase().includes(searchTerm.toLowerCase());
    
    return typeMatch && searchMatch;
  });
  
  // Function to open notification details modal
  const openNotificationDetails = (notification) => {
    // Mark notification as read
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header Section - Responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h3 mb-1">Notifications</h1>
          <p className="text-muted mb-0">Stay updated with your request status</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="text-end me-3">
            <div className="text-muted small">Department: Pharmacy</div>
            <div>User: Dr. Sharma</div>
          </div>
          <div className="position-relative">
            <FaBell className="fs-4" />
            {unreadCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Filter Card - Responsive */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 p-3 p-md-4">
          <div className="flex-column flex-md-row d-flex justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0">Filter Notifications</h5>
            <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
              <div className="input-group input-group-sm">
                <span className="input-group-text"><FaSearch /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Search notifications..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="form-select form-select-sm" 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="approval">Approvals</option>
                <option value="partial_approval">Partial Approvals</option>
                <option value="rejection">Rejections</option>
                <option value="pickup_info">Pickup Info</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell className="text-muted mb-3" size={48} />
              <h4>No notifications found</h4>
              <p className="text-muted">Try adjusting your filter criteria</p>
            </div>
          ) : (
            <div className="list-group">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''}`}
                  onClick={() => openNotificationDetails(notification)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex flex-column flex-md-row w-100 justify-content-between align-items-md-start">
                    <div className="d-flex align-items-start mb-2 mb-md-0">
                      <div className="me-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {notification.title}
                          {!notification.read && (
                            <span className="badge bg-primary ms-2">New</span>
                          )}
                        </h6>
                        <p className="mb-1 d-none d-md-block">{notification.message}</p>
                        <small className="text-muted d-flex align-items-center">
                          <FaClock className="me-1 flex-shrink-0" />
                          <span>{notification.timestamp}</span>
                        </small>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className={`badge ${getNotificationBadgeClass(notification.type)} me-3 flex-shrink-0`}>
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                      <FaEye className="text-muted flex-shrink-0" />
                    </div>
                  </div>
                  {/* Mobile-only message display */}
                  <p className="mb-0 d-md-none text-muted small mt-2">{notification.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Notification Details Modal - Responsive */}
      <div className={`modal fade ${showNotificationModal ? 'show' : ''}`} style={{ display: showNotificationModal ? 'block' : 'none' }} tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Notification Details</h5>
              <button type="button" className="btn-close" onClick={() => setShowNotificationModal(false)}></button>
            </div>
            <div className="modal-body">
              {selectedNotification && (
                <>
                  <div className="row mb-4">
                    <div className="col-12 col-md-8 mb-3 mb-md-0">
                      <h4 className="mb-2">{selectedNotification.title}</h4>
                      <p className="text-muted">{selectedNotification.message}</p>
                      <div className="d-flex align-items-center text-muted">
                        <FaClock className="me-2 flex-shrink-0" />
                        <span>{selectedNotification.timestamp}</span>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 text-md-end">
                      <span className={`badge ${getNotificationBadgeClass(selectedNotification.type)} fs-6`}>
                        {getNotificationIcon(selectedNotification.type)} {getNotificationTypeLabel(selectedNotification.type)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card mb-4">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Request Information</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-12 col-md-6">
                          <p className="mb-2"><strong>Request ID:</strong> {selectedNotification.details.requestId}</p>
                          {(selectedNotification.type === 'approval' || selectedNotification.type === 'partial_approval') && (
                            <p className="mb-2"><strong>Approved By:</strong> {selectedNotification.details.approvedBy}</p>
                          )}
                          {selectedNotification.type === 'rejection' && (
                            <p className="mb-2"><strong>Rejected By:</strong> {selectedNotification.details.rejectedBy}</p>
                          )}
                          {(selectedNotification.type === 'approval' || selectedNotification.type === 'partial_approval') && (
                            <p className="mb-2"><strong>Approved Date:</strong> {selectedNotification.details.approvedDate}</p>
                          )}
                          {selectedNotification.type === 'rejection' && (
                            <p className="mb-2"><strong>Rejected Date:</strong> {selectedNotification.details.rejectedDate}</p>
                          )}
                        </div>
                        <div className="col-12 col-md-6">
                          {selectedNotification.details.pickupInfo && (
                            <>
                              <p className="mb-2"><strong>Pickup Location:</strong> {selectedNotification.details.pickupInfo.location}</p>
                              <p className="mb-2"><strong>Pickup Date:</strong> {selectedNotification.details.pickupInfo.date}</p>
                              <p className="mb-2"><strong>Pickup Time:</strong> {selectedNotification.details.pickupInfo.time}</p>
                              {selectedNotification.details.pickupInfo.referenceNumber && (
                                <p className="mb-2"><strong>Reference Number:</strong> {selectedNotification.details.pickupInfo.referenceNumber}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(selectedNotification.type === 'partial_approval' || selectedNotification.type === 'rejection') && selectedNotification.details.notes && (
                    <div className="card mb-4">
                      <div className="card-header bg-white">
                        <h5 className="mb-0">Notes</h5>
                      </div>
                      <div className="card-body">
                        <p className="mb-0">{selectedNotification.details.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="card">
                    <div className="card-header bg-white">
                      <h5 className="mb-0">Items</h5>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              {selectedNotification.type === 'partial_approval' && <th>Status</th>}
                              {selectedNotification.type === 'partial_approval' && <th>Reason</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedNotification.details.items && selectedNotification.details.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                {selectedNotification.type === 'partial_approval' && (
                                  <>
                                    <td><span className="badge bg-success">Approved</span></td>
                                    <td>-</td>
                                  </>
                                )}
                              </tr>
                            ))}
                            {selectedNotification.details.approvedItems && selectedNotification.details.approvedItems.map((item, index) => (
                              <tr key={`approved-${index}`}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td><span className="badge bg-success">Approved</span></td>
                                <td>-</td>
                              </tr>
                            ))}
                            {selectedNotification.details.rejectedItems && selectedNotification.details.rejectedItems.map((item, index) => (
                              <tr key={`rejected-${index}`}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.unit}</td>
                                <td><span className="badge bg-danger">Rejected</span></td>
                                <td>{item.reason}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-100 w-md-auto" onClick={() => setShowNotificationModal(false)}>Close</button>
              {selectedNotification && selectedNotification.details.pickupInfo && (
                <button type="button" className="btn btn-primary w-100 w-md-auto">
                  <FaClipboardList className="me-2" /> View Pickup Details
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal Backdrop */}
      {showNotificationModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default FacilityUserNotifications;