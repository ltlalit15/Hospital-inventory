import React, { useState } from 'react';


const FacilitySettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'Hospital Warehouse Management System',
    defaultLanguage: 'French',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12-hour'
  });

  const [inventorySettings, setInventorySettings] = useState({
    lowStockThreshold: 10,
    expiryWarningDays: 30,
    autoReorderEnabled: true,
    defaultReorderQuantity: 50
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventorySettings(prev => ({ ...prev, [name]: parseInt(value) || value }));
  };

  const handleToggleChange = () => {
    setInventorySettings(prev => ({
      ...prev,
      autoReorderEnabled: !prev.autoReorderEnabled
    }));
  };

  const handleSaveGeneral = () => {
    alert('General settings saved!');
  };

  const handleSaveInventory = () => {
    alert('Inventory settings saved!');
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">System Settings</h2>

      <div className="row">
        {/* General Settings Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">General Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="systemName" className="form-label">System Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="systemName"
                  name="systemName"
                  value={generalSettings.systemName}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="defaultLanguage" className="form-label">Default Language</label>
                <select
                  className="form-select"
                  id="defaultLanguage"
                  name="defaultLanguage"
                  value={generalSettings.defaultLanguage}
                  onChange={handleGeneralChange}
                >
                  <option value="English">English</option>
                  <option value="French">French</option>
                  <option value="Spanish">Spanish</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="dateFormat" className="form-label">Date Format</label>
                <select
                  className="form-select"
                  id="dateFormat"
                  name="dateFormat"
                  value={generalSettings.dateFormat}
                  onChange={handleGeneralChange}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="timeFormat" className="form-label">Time Format</label>
                <select
                  className="form-select"
                  id="timeFormat"
                  name="timeFormat"
                  value={generalSettings.timeFormat}
                  onChange={handleGeneralChange}
                >
                  <option value="12-hour">12-hour</option>
                  <option value="24-hour">24-hour</option>
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveGeneral}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Settings Card */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Inventory Settings</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="lowStockThreshold" className="form-label">Low Stock Threshold</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    value={inventorySettings.lowStockThreshold}
                    onChange={handleInventoryChange}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
                <small className="text-muted mt-1 d-block">
                  Number of units at which an item is considered low stock
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="expiryWarningDays" className="form-label">Expiry Warning Days</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="expiryWarningDays"
                    name="expiryWarningDays"
                    value={inventorySettings.expiryWarningDays}
                    onChange={handleInventoryChange}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
                <small className="text-muted mt-1 d-block">
                  Number of days before expiry to show warnings
                </small>
              </div>

              <div className="mb-3 form-check">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    id="autoReorderEnabled"
                    checked={inventorySettings.autoReorderEnabled}
                    onChange={handleToggleChange}
                  />
                  <label htmlFor="autoReorderEnabled" className="form-check-label">
                    Enable automatic reordering
                  </label>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="defaultReorderQuantity" className="form-label">Default Reorder Quantity</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    id="defaultReorderQuantity"
                    name="defaultReorderQuantity"
                    value={inventorySettings.defaultReorderQuantity}
                    onChange={handleInventoryChange}
                  />
                  <span className="input-group-text">
                    <i className="bi bi-arrow-up"></i>
                  </span>
                </div>
                <small className="text-muted mt-1 d-block">
                  Default quantity to reorder when stock is low
                </small>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSaveInventory}
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitySettings;