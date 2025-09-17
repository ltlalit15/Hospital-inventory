import React, { useState } from "react";
import {
  FaCog,
  FaSave,
  FaBell,
  FaGlobe,
  FaCalendarAlt,
  FaWarehouse,
  FaHospital,
  FaBoxOpen,
  FaFileAlt,
  FaLock,
  FaMoneyBillWave,
  FaChartLine,
  FaTags,
  FaExclamationTriangle,
} from "react-icons/fa";

const SuperAdminSettings = () => {
  // ----------- General -----------
  const [systemName, setSystemName] = useState(
    "Hospital Warehouse Management System"
  );
  const [language, setLanguage] = useState("English");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12-hour");
  const [notifications, setNotifications] = useState(true);
  // ----------- Inventory -----------
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [expiryWarningDays, setExpiryWarningDays] = useState(30);
  const [autoReorder, setAutoReorder] = useState(true);
  const [defaultReorderQuantity, setDefaultReorderQuantity] = useState(50);
  const [facilitySettings, setFacilitySettings] = useState(true);
  // ----------- Warehouse -----------
  const [uom, setUom] = useState("Pieces");
  const [warehouseThreshold, setWarehouseThreshold] = useState(20);
  const [categories, setCategories] = useState([
    "Medicines",
    "Equipment",
    "Consumables",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [printTemplate, setPrintTemplate] = useState("");
  // ----------- New Settings -----------
  const [currency, setCurrency] = useState("GHS");
  const [valuationMethod, setValuationMethod] = useState("FIFO");
  const [abcRules, setAbcRules] = useState({
    aThreshold: 100,
    bThreshold: 10,
    cThreshold: 0,
  });
  const [expiryAlertDays, setExpiryAlertDays] = useState(30);
  // ----------- Security -----------
  const [passwordPolicy, setPasswordPolicy] = useState("Medium");
  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");
  const [twoFactor, setTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState("5 attempts");

  const handleAddCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (cat) =>
    setCategories(categories.filter((c) => c !== cat));

  // ----------- Submit -----------
  const handleSave = (e) => {
    e.preventDefault();
    const settings = {
      general: { systemName, language, dateFormat, timeFormat, notifications },
      inventory: {
        lowStockThreshold,
        expiryWarningDays,
        autoReorder,
        defaultReorderQuantity,
        facilitySettings,
      },
      warehouse: { uom, warehouseThreshold, categories, printTemplate },
      financial: { currency, valuationMethod, abcRules, expiryAlertDays },
      security: { passwordPolicy, sessionTimeout, twoFactor, loginAttempts },
    };
    console.log("All Settings ✅", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="fade-in container py-4">
      <h2 className="fw-bold mb-4">System Settings</h2>
      <form onSubmit={handleSave}>
        <div className="row">
          {/* ---------------- General ---------------- */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h5 className="fw-bold d-flex align-items-center">
                  <FaCog className="me-2" /> General Settings
                </h5>
              </div>
              <div className="card-body">
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
                  <label className="form-label fw-bold">
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
                  <label className="form-label fw-bold">
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
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <label className="form-check-label">
                    <FaBell className="me-2" /> Enable email notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* ---------------- Financial Settings ---------------- */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h5 className="fw-bold d-flex align-items-center">
                  <FaMoneyBillWave className="me-2" /> Financial Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Default Currency</label>
                  <select
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="GHS">GHS (Ghanaian Cedi)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaChartLine className="me-2" /> Valuation Method
                  </label>
                  <select
                    className="form-select"
                    value={valuationMethod}
                    onChange={(e) => setValuationMethod(e.target.value)}
                  >
                    <option value="FIFO">FIFO (First In, First Out)</option>
                    <option value="Moving Average">Moving Average</option>
                    <option value="Last PO Cost">Last PO Cost</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaTags className="me-2" /> ABC Classification Rules
                  </label>
                  <div className="row">
                    <div className="col-4">
                      <label className="form-label text-muted small">A Class (≥)</label>
                      <div className="input-group">
                        <span className="input-group-text">{currency}</span>
                        <input
                          type="number"
                          className="form-control"
                          value={abcRules.aThreshold}
                          onChange={(e) =>
                            setAbcRules({
                              ...abcRules,
                              aThreshold: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <label className="form-label text-muted small">B Class (≥)</label>
                      <div className="input-group">
                        <span className="input-group-text">{currency}</span>
                        <input
                          type="number"
                          className="form-control"
                          value={abcRules.bThreshold}
                          onChange={(e) =>
                            setAbcRules({
                              ...abcRules,
                              bThreshold: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <label className="form-label text-muted small">C Class (&lt;)</label>
                      <div className="input-group">
                        <span className="input-group-text">{currency}</span>
                        <input
                          type="number"
                          className="form-control"
                          value={abcRules.cThreshold}
                          onChange={(e) =>
                            setAbcRules({
                              ...abcRules,
                              cThreshold: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-text">
                    Items with value ≥ {currency} {abcRules.aThreshold} = A Class,
                    {currency} {abcRules.bThreshold}-{abcRules.aThreshold} = B Class,
                    &lt; {currency} {abcRules.bThreshold} = C Class
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    <FaExclamationTriangle className="me-2" /> Expiry Alert Days
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={expiryAlertDays}
                    onChange={(e) => setExpiryAlertDays(parseInt(e.target.value) || 0)}
                  />
                  <div className="form-text">
                    Send alert this many days before items expire
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ---------------- Inventory ---------------- */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-3">
            <h5 className="fw-bold d-flex align-items-center">
              <FaWarehouse className="me-2" /> Inventory Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Low Stock Threshold</label>
                <input
                  type="number"
                  className="form-control"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Expiry Warning Days</label>
                <input
                  type="number"
                  className="form-control"
                  value={expiryWarningDays}
                  onChange={(e) => setExpiryWarningDays(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={autoReorder}
                    onChange={(e) => setAutoReorder(e.target.checked)}
                  />
                  <label className="form-check-label">Enable automatic reordering</label>
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={facilitySettings}
                    onChange={(e) => setFacilitySettings(e.target.checked)}
                  />
                  <label className="form-check-label">
                    <FaHospital className="me-2" /> Enable facility-specific settings
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Default Reorder Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={defaultReorderQuantity}
                  onChange={(e) => setDefaultReorderQuantity(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ---------------- Warehouse ---------------- */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-3">
            <h5 className="fw-bold d-flex align-items-center">
              <FaBoxOpen className="me-2" /> Warehouse Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Unit of Measurement</label>
                <select
                  className="form-select"
                  value={uom}
                  onChange={(e) => setUom(e.target.value)}
                >
                  <option>Pieces</option>
                  <option>Boxes</option>
                  <option>Kilograms</option>
                  <option>Litres</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Alert Threshold</label>
                <input
                  type="number"
                  className="form-control"
                  value={warehouseThreshold}
                  onChange={(e) => setWarehouseThreshold(e.target.value)}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Categories</label>
              <div className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
              </div>
              <ul className="list-group">
                {categories.map((cat, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {cat}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveCategory(cat)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold d-flex align-items-center">
                <FaFileAlt className="me-2" /> Print Templates
              </label>
              <input
                type="file"
                className="form-control"
                onChange={(e) =>
                  setPrintTemplate(e.target.files[0]?.name || "")
                }
              />
              {printTemplate && (
                <div className="form-text">
                  Selected: {printTemplate}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ---------------- Security ---------------- */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 pt-3">
            <h5 className="fw-bold d-flex align-items-center">
              <FaLock className="me-2" /> Security Settings
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Password Policy</label>
                <select
                  className="form-select"
                  value={passwordPolicy}
                  onChange={(e) => setPasswordPolicy(e.target.value)}
                >
                  <option>Medium</option>
                  <option>Strong</option>
                  <option>Very Strong</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Session Timeout</label>
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
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
              />
              <label className="form-check-label">
                Enable two-factor authentication
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Login Attempts</label>
              <select
                className="form-select"
                value={loginAttempts}
                onChange={(e) => setLoginAttempts(e.target.value)}
              >
                <option>3 attempts</option>
                <option>5 attempts</option>
                <option>10 attempts</option>
              </select>
            </div>
          </div>
        </div>
        {/* Save All */}
        <button
          type="submit"
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
        >
          <FaSave className="me-2" /> Save All Settings
        </button>
      </form>
    </div>
  );
};

export default SuperAdminSettings;