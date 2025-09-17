import React, { useState } from 'react';
import { 
  FaCog, FaSave, FaBell, FaLock, FaGlobe, FaCalendarAlt, FaWarehouse, FaHospital, 
  FaEdit, FaTimes, FaCheck, FaInfoCircle, FaKey, FaUserShield, FaHistory
} from 'react-icons/fa';

const SuperAdminSettings = () => {
  // State for form inputs
  const [systemName, setSystemName] = useState('Hospital Warehouse Management System');
  const [language, setLanguage] = useState('English');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12-hour');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [expiryWarningDays, setExpiryWarningDays] = useState(30);
  const [autoReorder, setAutoReorder] = useState(true);
  const [defaultReorderQuantity, setDefaultReorderQuantity] = useState(50);
  const [passwordPolicy, setPasswordPolicy] = useState('Medium (8 characters, letters and numbers)');
  const [sessionTimeout, setSessionTimeout] = useState('30 minutes');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState('3 attempts before lockout');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [facilitySettings, setFacilitySettings] = useState(true);
  
  // State for modals
  const [showGeneralModal, setShowGeneralModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentSetting, setCurrentSetting] = useState('');
  
  // Modal handlers
  const openGeneralModal = () => {
    setShowGeneralModal(true);
  };
  
  const openInventoryModal = () => {
    setShowInventoryModal(true);
  };
  
  const openSecurityModal = () => {
    setShowSecurityModal(true);
  };
  
  const openConfirmationModal = (setting) => {
    setCurrentSetting(setting);
    setShowConfirmationModal(true);
  };
  
  // Form handlers
  const handleSaveGeneralSettings = (e) => {
    e.preventDefault();
    setShowGeneralModal(false);
    openConfirmationModal('General');
  };
  
  const handleSaveInventorySettings = (e) => {
    e.preventDefault();
    setShowInventoryModal(false);
    openConfirmationModal('Inventory');
  };
  
  const handleSaveSecuritySettings = (e) => {
    e.preventDefault();
    setShowSecurityModal(false);
    openConfirmationModal('Security');
  };
  
  const handleConfirmSettings = () => {
    setShowConfirmationModal(false);
    // In a real app, this would save the settings to the backend
  };
  
  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">System Settings</h2>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaCog className="me-2" /> General Settings
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p className="mb-1"><strong>System Name:</strong> {systemName}</p>
                <p className="mb-1"><strong>Language:</strong> {language}</p>
                <p className="mb-1"><strong>Date Format:</strong> {dateFormat}</p>
                <p className="mb-1"><strong>Time Format:</strong> {timeFormat}</p>
                <p className="mb-0"><strong>Email Notifications:</strong> {emailNotifications ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button className="btn btn-outline-primary w-100" onClick={openGeneralModal}>
                <FaEdit className="me-2" /> Edit General Settings
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaWarehouse className="me-2" /> Inventory Settings
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p className="mb-1"><strong>Low Stock Threshold:</strong> {lowStockThreshold} units</p>
                <p className="mb-1"><strong>Expiry Warning Days:</strong> {expiryWarningDays} days</p>
                <p className="mb-1"><strong>Auto-Reorder:</strong> {autoReorder ? 'Enabled' : 'Disabled'}</p>
                <p className="mb-1"><strong>Default Reorder Quantity:</strong> {defaultReorderQuantity} units</p>
                <p className="mb-0"><strong>Facility Settings:</strong> {facilitySettings ? 'Enabled' : 'Disabled'}</p>
              </div>
              <button className="btn btn-outline-primary w-100" onClick={openInventoryModal}>
                <FaEdit className="me-2" /> Edit Inventory Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Settings Card */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0 pt-4">
          <h5 className="mb-0 fw-bold">Security Settings</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-1"><strong>Password Policy:</strong> {passwordPolicy}</p>
              <p className="mb-1"><strong>Session Timeout:</strong> {sessionTimeout}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="mb-1"><strong>Two-Factor Authentication:</strong> {twoFactorAuth ? 'Enabled' : 'Disabled'}</p>
              <p className="mb-1"><strong>Login Attempts:</strong> {loginAttempts}</p>
            </div>
          </div>
          <button className="btn btn-outline-primary" onClick={openSecurityModal}>
            <FaEdit className="me-2" /> Edit Security Settings
          </button>
        </div>
      </div>

      {/* General Settings Modal */}
      {showGeneralModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaCog className="me-2" /> General Settings
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowGeneralModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveGeneralSettings}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">System Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={systemName}
                      onChange={(e) => setSystemName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <FaGlobe className="me-2" /> Default Language
                    </label>
                    <select 
                      className="form-select" 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Date Format
                    </label>
                    <select 
                      className="form-select"
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Time Format</label>
                    <select 
                      className="form-select"
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                    >
                      <option>12-hour</option>
                      <option>24-hour</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <FaBell className="me-2" /> Notification Settings
                    </label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="notificationSwitch" 
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="notificationSwitch">
                        Enable email notifications
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowGeneralModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                      <FaSave className="me-2" /> Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Settings Modal */}
      {showInventoryModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaWarehouse className="me-2" /> Inventory Settings
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowInventoryModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveInventorySettings}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Low Stock Threshold</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={lowStockThreshold}
                      onChange={(e) => setLowStockThreshold(e.target.value)}
                    />
                    <div className="form-text">Number of units at which an item is considered low stock</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Expiry Warning Days</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={expiryWarningDays}
                      onChange={(e) => setExpiryWarningDays(e.target.value)}
                    />
                    <div className="form-text">Number of days before expiry to show warnings</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Auto-Reorder Point</label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="autoReorderSwitch" 
                        checked={autoReorder}
                        onChange={(e) => setAutoReorder(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="autoReorderSwitch">
                        Enable automatic reordering
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Default Reorder Quantity</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={defaultReorderQuantity}
                      onChange={(e) => setDefaultReorderQuantity(e.target.value)}
                    />
                    <div className="form-text">Default quantity to reorder when stock is low</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <FaHospital className="me-2" /> Facility Settings
                    </label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="facilitySettingsSwitch" 
                        checked={facilitySettings}
                        onChange={(e) => setFacilitySettings(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="facilitySettingsSwitch">
                        Enable facility-specific settings
                      </label>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowInventoryModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                      <FaSave className="me-2" /> Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Modal */}
      {showSecurityModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title d-flex align-items-center">
                  <FaLock className="me-2" /> Security Settings
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowSecurityModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSaveSecuritySettings}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold d-flex align-items-center">
                        <FaKey className="me-2" /> Password Policy
                      </label>
                      <select 
                        className="form-select" 
                        value={passwordPolicy}
                        onChange={(e) => setPasswordPolicy(e.target.value)}
                      >
                        <option>Medium (8 characters, letters and numbers)</option>
                        <option>Strong (12 characters, letters, numbers and symbols)</option>
                        <option>Very Strong (16 characters, letters, numbers, symbols and uppercase)</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold d-flex align-items-center">
                        <FaHistory className="me-2" /> Session Timeout
                      </label>
                      <select 
                        className="form-select"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                      >
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                        <option>8 hours</option>
                        <option>24 hours</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold d-flex align-items-center">
                      <FaUserShield className="me-2" /> Two-Factor Authentication
                    </label>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id="twoFactorSwitch" 
                        checked={twoFactorAuth}
                        onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="twoFactorSwitch">
                        Enable two-factor authentication for administrators
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Login Attempts</label>
                    <select 
                      className="form-select"
                      value={loginAttempts}
                      onChange={(e) => setLoginAttempts(e.target.value)}
                    >
                      <option>3 attempts before lockout</option>
                      <option>5 attempts before lockout</option>
                      <option>10 attempts before lockout</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-secondary me-2" onClick={() => setShowSecurityModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary d-flex align-items-center">
                      <FaSave className="me-2" /> Save Settings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Settings Saved</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmationModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mb-3">
                    <FaCheck className="text-success fa-2x" />
                  </div>
                  <h4 className="fw-bold">Settings Saved Successfully!</h4>
                  <p className="text-muted">
                    Your {currentSetting} settings have been updated and saved.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleConfirmSettings}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {(showGeneralModal || showInventoryModal || showSecurityModal || showConfirmationModal) && (
        <div className="modal-backdrop show"></div>
      )}
    </div>
  );
};

export default SuperAdminSettings;