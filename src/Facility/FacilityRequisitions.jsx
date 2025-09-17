// src/App.jsx
import { useState } from 'react';
function FacilityRequisitions() {
  // Admin's facility (hardcoded for this example)
  const adminFacility = 'Kumasi Branch Hospital';
  
  // Expanded initial requisitions data with item-level details
  const initialRequisitions = [
    {
      id: '#REQ - 0042',
      facility: 'Kumasi Branch Hospital',
      department: 'Emergency',
      requester: 'Dr. Amoah',
      date: '24 Oct 2023',
      items: [
        { itemCode: 'MED-001', itemName: 'Paracetamol 500mg', quantity: 10, approvedQuantity: null, status: 'Pending' },
        { itemCode: 'SUP-003', itemName: 'Surgical Gloves (L)', quantity: 2, approvedQuantity: null, status: 'Pending' }
      ],
      priority: 'High',
      status: 'Pending Review'
    },
    {
      id: '#REQ - 0040',
      facility: 'Takoradi Clinic',
      department: 'Pharmacy',
      requester: 'Dr. Mensah',
      date: '22 Oct 2023',
      items: [
        { itemCode: 'MED-002', itemName: 'Amoxicillin 250mg', quantity: 5, approvedQuantity: 5, status: 'Approved' },
        { itemCode: 'SUP-005', itemName: 'Face Masks (N95)', quantity: 3, approvedQuantity: null, status: 'Pending' }
      ],
      priority: 'Medium',
      status: 'Partially Approved'
    },
    {
      id: '#REQ - 0038',
      facility: 'Accra Central Hospital',
      department: 'Laboratory',
      requester: 'Lab Tech. Ama',
      date: '20 Oct 2023',
      items: [
        { itemCode: 'MED-004', itemName: 'Ibuprofen 400mg', quantity: 7, approvedQuantity: null, status: 'Pending' }
      ],
      priority: 'Low',
      status: 'Pending Review'
    },
    // Additional requisitions for Kumasi Branch Hospital (admin's facility)
    {
      id: '#REQ - 0045',
      facility: 'Kumasi Branch Hospital',
      department: 'Pediatrics',
      requester: 'Dr. Boateng',
      date: '25 Oct 2023',
      items: [
        { itemCode: 'MED-006', itemName: 'Children\'s Paracetamol', quantity: 15, approvedQuantity: 15, status: 'Approved' },
        { itemCode: 'MED-007', itemName: 'Vitamin C Drops', quantity: 8, approvedQuantity: 8, status: 'Approved' }
      ],
      priority: 'Medium',
      status: 'Approved'
    },
    {
      id: '#REQ - 0046',
      facility: 'Kumasi Branch Hospital',
      department: 'Surgery',
      requester: 'Dr. Osei',
      date: '26 Oct 2023',
      items: [
        { itemCode: 'SUP-001', itemName: 'Surgical Masks', quantity: 50, approvedQuantity: 0, status: 'Rejected' },
        { itemCode: 'SUP-002', itemName: 'Sterile Gauze', quantity: 20, approvedQuantity: 0, status: 'Rejected' },
        { itemCode: 'SUP-008', itemName: 'Surgical Blades', quantity: 10, approvedQuantity: null, status: 'Pending' }
      ],
      priority: 'High',
      status: 'Partially Approved'
    },
    {
      id: '#REQ - 0047',
      facility: 'Kumasi Branch Hospital',
      department: 'Pharmacy',
      requester: 'Pharmacist Adwoa',
      date: '27 Oct 2023',
      items: [
        { itemCode: 'MED-008', itemName: 'Cough Syrup', quantity: 12, approvedQuantity: null, status: 'Pending' },
        { itemCode: 'MED-009', itemName: 'Antihistamine Tablets', quantity: 8, approvedQuantity: null, status: 'Pending' }
      ],
      priority: 'Medium',
      status: 'Pending Review'
    },
    {
      id: '#REQ - 0048',
      facility: 'Kumasi Branch Hospital',
      department: 'Radiology',
      requester: 'Dr. Kwarteng',
      date: '28 Oct 2023',
      items: [
        { itemCode: 'SUP-010', itemName: 'X-Ray Films', quantity: 30, approvedQuantity: 30, status: 'Approved' }
      ],
      priority: 'Low',
      status: 'Approved'
    },
    {
      id: '#REQ - 0049',
      facility: 'Kumasi Branch Hospital',
      department: 'Maternity',
      requester: 'Nurse Akua',
      date: '29 Oct 2023',
      items: [
        { itemCode: 'SUP-011', itemName: 'Sanitary Pads', quantity: 40, approvedQuantity: 0, status: 'Rejected' },
        { itemCode: 'SUP-012', itemName: 'Baby Diapers', quantity: 25, approvedQuantity: 0, status: 'Rejected' }
      ],
      priority: 'Medium',
      status: 'Rejected'
    }
  ];
  
  // Expanded Low Stock Items (for bulk requisition)
  const lowStockItems = [
    { itemCode: 'MED-001', itemName: 'Paracetamol 500mg', currentStock: 5, uom: 'Strip', packSize: 10, avgDailyUsage: 2 },
    { itemCode: 'MED-002', itemName: 'Amoxicillin 250mg', currentStock: 0, uom: 'Bottle', packSize: 1, avgDailyUsage: 1 },
    { itemCode: 'SUP-003', itemName: 'Surgical Gloves (L)', currentStock: 3, uom: 'Box', packSize: 100, avgDailyUsage: 5 },
    { itemCode: 'MED-005', itemName: 'Cetrizine 10mg', currentStock: 2, uom: 'Strip', packSize: 10, avgDailyUsage: 1 },
    { itemCode: 'SUP-004', itemName: 'Alcohol Swabs', currentStock: 1, uom: 'Box', packSize: 100, avgDailyUsage: 10 },
    { itemCode: 'MED-006', itemName: 'Children\'s Paracetamol', currentStock: 0, uom: 'Bottle', packSize: 1, avgDailyUsage: 3 },
    { itemCode: 'SUP-007', itemName: 'Thermometer', currentStock: 2, uom: 'Piece', packSize: 1, avgDailyUsage: 1 }
  ];
  
  // Expanded all items list
  const allItems = [
    ...lowStockItems,
    { itemCode: 'MED-004', itemName: 'Ibuprofen 400mg', currentStock: 50, uom: 'Strip', packSize: 10, avgDailyUsage: 3 },
    { itemCode: 'SUP-005', itemName: 'Face Masks (N95)', currentStock: 10, uom: 'Pack', packSize: 50, avgDailyUsage: 8 },
    { itemCode: 'MED-007', itemName: 'Vitamin C Drops', currentStock: 25, uom: 'Bottle', packSize: 1, avgDailyUsage: 2 },
    { itemCode: 'SUP-001', itemName: 'Surgical Masks', currentStock: 100, uom: 'Box', packSize: 50, avgDailyUsage: 15 },
    { itemCode: 'SUP-002', itemName: 'Sterile Gauze', currentStock: 40, uom: 'Pack', packSize: 10, avgDailyUsage: 4 },
    { itemCode: 'SUP-008', itemName: 'Surgical Blades', currentStock: 15, uom: 'Box', packSize: 10, avgDailyUsage: 2 },
    { itemCode: 'MED-008', itemName: 'Cough Syrup', currentStock: 30, uom: 'Bottle', packSize: 1, avgDailyUsage: 3 },
    { itemCode: 'MED-009', itemName: 'Antihistamine Tablets', currentStock: 20, uom: 'Strip', packSize: 10, avgDailyUsage: 2 },
    { itemCode: 'SUP-010', itemName: 'X-Ray Films', currentStock: 45, uom: 'Box', packSize: 10, avgDailyUsage: 3 },
    { itemCode: 'SUP-011', itemName: 'Sanitary Pads', currentStock: 60, uom: 'Pack', packSize: 20, avgDailyUsage: 5 },
    { itemCode: 'SUP-012', itemName: 'Baby Diapers', currentStock: 35, uom: 'Pack', packSize: 10, avgDailyUsage: 4 },
    { itemCode: 'MED-010', itemName: 'Antacid Tablets', currentStock: 40, uom: 'Strip', packSize: 15, avgDailyUsage: 2 },
    { itemCode: 'SUP-013', itemName: 'Blood Pressure Cuff', currentStock: 8, uom: 'Piece', packSize: 1, avgDailyUsage: 1 },
    { itemCode: 'MED-011', itemName: 'Pain Relief Gel', currentStock: 12, uom: 'Tube', packSize: 1, avgDailyUsage: 1 },
    { itemCode: 'SUP-014', itemName: 'Stethoscope', currentStock: 5, uom: 'Piece', packSize: 1, avgDailyUsage: 1 }
  ];
  
  // State management
  const [activeTab, setActiveTab] = useState('pending');
  const [requisitions, setRequisitions] = useState(initialRequisitions);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showBulkItemViewModal, setShowBulkItemViewModal] = useState(false);
  const [viewRequisition, setViewRequisition] = useState(null);
  const [currentViewItem, setCurrentViewItem] = useState(null);
  const [newRequisition, setNewRequisition] = useState({
    department: '',
    requester: '',
    itemCount: '',
    priority: 'Medium'
  });
  const [newRequisitionItems, setNewRequisitionItems] = useState([]);
  const [bulkItems, setBulkItems] = useState(lowStockItems.map(item => ({
    ...item,
    requiredQty: '',
    remarks: ''
  })));
  const [csvError, setCsvError] = useState('');
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [approvedQuantities, setApprovedQuantities] = useState({});
  
  // Helper function to compute requisition status based on item statuses
  const computeRequisitionStatus = (items) => {
    if (items.length === 0) return 'Pending Review';
    
    const statuses = items.map(item => item.status);
    if (statuses.every(s => s === 'Pending')) return 'Pending Review';
    if (statuses.every(s => s === 'Approved')) return 'Approved';
    if (statuses.every(s => s === 'Rejected')) return 'Rejected';
    return 'Partially Approved';
  };
  
  // Filter requisitions based on admin's facility and active tab
  const filteredRequisitions = requisitions.filter(req => {
    // Only show requisitions from admin's facility
    if (req.facility !== adminFacility) return false;
    
    if (activeTab === 'pending') {
      return req.status === 'Pending Review' || req.status === 'Partially Approved';
    } else if (activeTab === 'approved') {
      return req.status === 'Approved';
    } else if (activeTab === 'rejected') {
      return req.status === 'Rejected';
    }
    return true;
  });
  
  // Handle item approval within a requisition
  const handleItemApprove = (reqId, itemIndex) => {
    const approvedQty = approvedQuantities[`${reqId}-${itemIndex}`];
    
    if (!approvedQty || approvedQty <= 0) {
      alert("Please enter a valid approved quantity");
      return;
    }
    
    setRequisitions(requisitions.map(req => {
      if (req.id === reqId) {
        const updatedItems = [...req.items];
        updatedItems[itemIndex] = { 
          ...updatedItems[itemIndex], 
          status: 'Approved',
          approvedQuantity: parseInt(approvedQty)
        };
        
        return {
          ...req,
          items: updatedItems,
          status: computeRequisitionStatus(updatedItems)
        };
      }
      return req;
    }));
    
    // Clear the approved quantity for this item
    const newApprovedQuantities = { ...approvedQuantities };
    delete newApprovedQuantities[`${reqId}-${itemIndex}`];
    setApprovedQuantities(newApprovedQuantities);
  };
  
  // Handle item rejection within a requisition
  const handleItemReject = (reqId, itemIndex) => {
    setRequisitions(requisitions.map(req => {
      if (req.id === reqId) {
        const updatedItems = [...req.items];
        updatedItems[itemIndex] = { 
          ...updatedItems[itemIndex], 
          status: 'Rejected',
          approvedQuantity: 0
        };
        
        return {
          ...req,
          items: updatedItems,
          status: computeRequisitionStatus(updatedItems)
        };
      }
      return req;
    }));
    
    // Clear the approved quantity for this item
    const newApprovedQuantities = { ...approvedQuantities };
    delete newApprovedQuantities[`${reqId}-${itemIndex}`];
    setApprovedQuantities(newApprovedQuantities);
  };
  
  // Handle bulk approval of all items in a requisition
  const handleBulkApprove = (reqId) => {
    // Check if all pending items have approved quantities
    const req = requisitions.find(r => r.id === reqId);
    const pendingItems = req.items.filter(item => item.status === 'Pending');
    
    for (let i = 0; i < pendingItems.length; i++) {
      const itemIndex = req.items.findIndex(item => item.itemCode === pendingItems[i].itemCode);
      const approvedQty = approvedQuantities[`${reqId}-${itemIndex}`];
      
      if (!approvedQty || approvedQty <= 0) {
        alert(`Please enter a valid approved quantity for ${pendingItems[i].itemName}`);
        return;
      }
    }
    
    setRequisitions(requisitions.map(req => {
      if (req.id === reqId) {
        const updatedItems = req.items.map(item => {
          if (item.status === 'Pending') {
            const itemIndex = req.items.findIndex(i => i.itemCode === item.itemCode);
            const approvedQty = approvedQuantities[`${reqId}-${itemIndex}`];
            return { 
              ...item, 
              status: 'Approved',
              approvedQuantity: parseInt(approvedQty)
            };
          }
          return item;
        });
        
        return {
          ...req,
          items: updatedItems,
          status: computeRequisitionStatus(updatedItems)
        };
      }
      return req;
    }));
    
    // Clear all approved quantities for this requisition
    const newApprovedQuantities = { ...approvedQuantities };
    Object.keys(newApprovedQuantities).forEach(key => {
      if (key.startsWith(`${reqId}-`)) {
        delete newApprovedQuantities[key];
      }
    });
    setApprovedQuantities(newApprovedQuantities);
  };
  
  // Handle approved quantity change
  const handleApprovedQuantityChange = (reqId, itemIndex, value) => {
    setApprovedQuantities({
      ...approvedQuantities,
      [`${reqId}-${itemIndex}`]: value
    });
  };
  
  // Handle view action
  const handleView = (requisition) => {
    setViewRequisition(requisition);
    setShowViewModal(true);
  };
  
  // Handle view bulk item action
  const viewBulkItem = (index) => {
    setCurrentViewItem(bulkItems[index]);
    setShowBulkItemViewModal(true);
  };
  
  // Handle create modal open
  const handleCreateModalOpen = () => {
    setShowCreateModal(true);
  };
  
  // Handle bulk modal open
  const handleBulkModalOpen = () => {
    setShowBulkModal(true);
  };
  
  // Handle create modal close
  const handleCreateModalClose = () => {
    setShowCreateModal(false);
    setNewRequisition({
      department: '',
      requester: '',
      itemCount: '',
      priority: 'Medium'
    });
    setNewRequisitionItems([]);
  };
  
  // Handle bulk modal close
  const handleBulkModalClose = () => {
    setShowBulkModal(false);
    setCsvError('');
    setBulkItems(lowStockItems.map(item => ({
      ...item,
      requiredQty: '',
      remarks: ''
    })));
  };
  
  // Handle view modal close
  const handleViewModalClose = () => {
    setShowViewModal(false);
    setViewRequisition(null);
    setApprovedQuantities({});
  };
  
  // Handle bulk item view modal close
  const handleBulkItemViewModalClose = () => {
    setShowBulkItemViewModal(false);
    setCurrentViewItem(null);
  };
  
  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequisition({ ...newRequisition, [name]: value });
  };
  
  // Handle item change in create requisition
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newRequisitionItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-fill item details if itemCode is selected
    if (field === 'itemCode' && value) {
      const selectedItem = allItems.find(item => item.itemCode === value);
      if (selectedItem) {
        updatedItems[index] = {
          ...updatedItems[index],
          itemName: selectedItem.itemName,
          uom: selectedItem.uom
        };
      }
    }
    
    setNewRequisitionItems(updatedItems);
  };
  
  // Add new item row in create requisition
  const addNewItemRow = () => {
    setNewRequisitionItems([
      ...newRequisitionItems,
      { itemCode: '', itemName: '', quantity: '', remarks: '' }
    ]);
  };
  
  // Remove item row in create requisition
  const removeItemRow = (index) => {
    setNewRequisitionItems(newRequisitionItems.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate new ID
    const newId = `#REQ - ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create new requisition object with items
    const requisitionToAdd = {
      id: newId,
      facility: adminFacility, // Set to admin's facility
      department: newRequisition.department,
      requester: newRequisition.requester,
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' '),
      items: newRequisitionItems.map(item => ({
        ...item,
        status: 'Pending',
        approvedQuantity: null
      })),
      priority: newRequisition.priority,
      status: computeRequisitionStatus(newRequisitionItems.map(() => 'Pending'))
    };
    
    // Add to requisitions list
    setRequisitions([...requisitions, requisitionToAdd]);
    
    // Close modal and reset form
    handleCreateModalClose();
  };
  
  // Bulk Requisition Handlers
  const addNewItemRowBulk = () => {
    setBulkItems([...bulkItems, {
      itemCode: '',
      itemName: '',
      currentStock: 0,
      uom: '',
      packSize: 0,
      avgDailyUsage: 0,
      requiredQty: '',
      remarks: ''
    }]);
  };
  
  const updateBulkItem = (index, field, value) => {
    const newItems = [...bulkItems];
    newItems[index][field] = value;
    // Auto-fill item details if itemCode is selected
    if (field === 'itemCode' && value) {
      const selectedItem = allItems.find(item => item.itemCode === value);
      if (selectedItem) {
        newItems[index] = {
          ...newItems[index],
          itemName: selectedItem.itemName,
          currentStock: selectedItem.currentStock,
          uom: selectedItem.uom,
          packSize: selectedItem.packSize,
          avgDailyUsage: selectedItem.avgDailyUsage
        };
      }
    }
    setBulkItems(newItems);
  };
  
  const removeBulkItem = (index) => {
    setBulkItems(bulkItems.filter((_, i) => i !== index));
  };
  
  const handlePlanFor30Days = () => {
    setBulkItems(bulkItems.map(item => ({
      ...item,
      requiredQty: item.avgDailyUsage > 0 ? item.avgDailyUsage * 30 : item.requiredQty
    })));
  };
  
  const handleCSVImport = () => {
    setShowCsvModal(true);
  };
  
  const handleCsvFileChange = (e) => {
    setCsvFile(e.target.files[0]);
    setCsvError('');
  };
  
  const processCSVFile = () => {
    if (!csvFile) {
      setCsvError('Please select a CSV file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      const newBulkItems = [];
      const errors = [];
      
      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i].trim();
        if (!line) continue; // Skip empty lines
        
        const values = line.split(',').map(val => val.trim());
        
        if (values.length < 4) {
          errors.push(`Row ${i + 2}: Invalid format. Expected 4 columns.`);
          continue;
        }
        
        const [itemCode, uom, packSizeStr, requiredQtyStr] = values;
        const packSize = parseInt(packSizeStr);
        const requiredQty = parseInt(requiredQtyStr);
        
        // Validate item code
        const item = allItems.find(it => it.itemCode === itemCode);
        if (!item) {
          errors.push(`Row ${i + 2}: Item code "${itemCode}" not found.`);
          continue;
        }
        
        // Validate required quantity
        if (isNaN(requiredQty) || requiredQty <= 0) {
          errors.push(`Row ${i + 2}: Required quantity must be a positive number.`);
          continue;
        }
        
        // Add to bulk items
        newBulkItems.push({
          ...item,
          requiredQty: requiredQty,
          remarks: ''
        });
      }
      
      if (errors.length > 0) {
        setCsvError(errors.join('\n'));
      } else {
        setBulkItems(newBulkItems);
        setShowCsvModal(false);
        setCsvFile(null);
      }
    };
    
    reader.onerror = () => {
      setCsvError('Error reading file');
    };
    
    reader.readAsText(csvFile);
  };
  
  const submitBulkRequisition = () => {
    // Validate required quantities
    const invalidItems = bulkItems.filter(item => !item.requiredQty || item.requiredQty <= 0);
    if (invalidItems.length > 0) {
      alert("Please enter valid required quantities for all items.");
      return;
    }
    // Generate new ID
    const newId = `#REQ - ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    // Create new requisition object
    const requisitionToAdd = {
      id: newId,
      facility: adminFacility, // Set to admin's facility
      department: 'Inventory',
      requester: 'System Generated',
      date: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }).replace(/ /g, ' '),
      items: bulkItems.map(item => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        quantity: parseInt(item.requiredQty),
        approvedQuantity: null,
        status: 'Pending'
      })),
      priority: 'High',
      status: computeRequisitionStatus(bulkItems.map(() => 'Pending'))
    };
    
    // Add to requisitions list
    setRequisitions([...requisitions, requisitionToAdd]);
    alert("Bulk Requisition Submitted Successfully!");
    handleBulkModalClose();
  };
  
  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Header with Create Buttons */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Requisitions Management</h1>
          <p className="text-muted mb-0">Manage requisitions for {adminFacility}</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-outline-primary" onClick={handleCreateModalOpen}>
            Create Requisition
          </button>
          <button className="btn btn-primary" onClick={handleBulkModalOpen}>
            Create Bulk Requisition
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </li>
      </ul>
      
      {/* Requisitions Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th>Requisition ID</th>
                <th>Department</th>
                <th>Requester</th>
                <th>Date</th>
                <th>Item Count</th>
                <th>Priority</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    No requisitions found for {adminFacility}.
                  </td>
                </tr>
              ) : (
                filteredRequisitions.map((req) => (
                  <tr key={req.id}>
                    <td className="fw-medium">{req.id}</td>
                    <td>{req.department}</td>
                    <td>{req.requester}</td>
                    <td>{req.date}</td>
                    <td>{req.items.length} items</td>
                    <td>
                      <span className={`badge rounded-pill ${
                        req.priority === 'High' ? 'bg-danger-subtle text-danger-emphasis' : 
                        req.priority === 'Medium' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-info-subtle text-info-emphasis'
                      } px-3 py-1`}>
                        {req.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill ${
                        req.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' : 
                        req.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' : 
                        req.status === 'Partially Approved' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'
                      } px-3 py-1`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button 
                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                        onClick={() => handleView(req)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Create Requisition Modal */}
      {showCreateModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleCreateModalClose}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Create New Requisition</h5>
                <button type="button" className="btn-close" onClick={handleCreateModalClose}></button>
              </div>
              <div className="modal-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Department</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="department"
                        value={newRequisition.department}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Requester</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="requester"
                        value={newRequisition.requester}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select" 
                      name="priority"
                      value={newRequisition.priority}
                      onChange={handleInputChange}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">Items</h6>
                    <button type="button" className="btn btn-sm btn-outline-success" onClick={addNewItemRow}>
                      <i className="fas fa-plus me-1"></i> Add Item
                    </button>
                  </div>
                  
                  <div className="table-responsive mb-3">
                    <table className="table table-bordered align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Quantity</th>
                          <th>Remarks</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newRequisitionItems.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-3">
                              No items added yet. Click "Add Item" to add items.
                            </td>
                          </tr>
                        ) : (
                          newRequisitionItems.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <select 
                                  className="form-select form-select-sm"
                                  value={item.itemCode}
                                  onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                                  required
                                >
                                  <option value="">Select Item</option>
                                  {allItems.map(opt => (
                                    <option key={opt.itemCode} value={opt.itemCode}>{opt.itemCode}</option>
                                  ))}
                                </select>
                              </td>
                              <td>{item.itemName}</td>
                              <td>
                                <input 
                                  type="number" 
                                  className="form-control form-control-sm"
                                  value={item.quantity}
                                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                  min="1"
                                  required
                                />
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm"
                                  value={item.remarks}
                                  onChange={(e) => handleItemChange(index, 'remarks', e.target.value)}
                                  placeholder="Optional"
                                />
                              </td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => removeItemRow(index)}
                                  disabled={newRequisitionItems.length <= 1}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={handleCreateModalClose}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4" disabled={newRequisitionItems.length === 0}>
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bulk Requisition Modal */}
      {showBulkModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleBulkModalClose}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Create Bulk Requisition to Warehouse</h5>
                <button type="button" className="btn-close" onClick={handleBulkModalClose}></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button className="btn btn-outline-secondary" onClick={handleCSVImport}>
                    <i className="fas fa-file-import me-1"></i> Import CSV
                  </button>
                  <button className="btn btn-outline-primary" onClick={handlePlanFor30Days} title="Auto-fill quantities based on 30 days of average usage">
                    <i className="fas fa-calendar-alt me-1"></i> Plan for 30 Days
                  </button>
                  <button className="btn btn-outline-success" onClick={addNewItemRowBulk}>
                    <i className="fas fa-plus me-1"></i> Add Item
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Current Stock</th>
                        <th>Required Qty</th>
                        <th>UoM</th>
                        <th>Pack Size</th>
                        <th>Remarks</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={item.itemCode}
                              onChange={(e) => updateBulkItem(index, 'itemCode', e.target.value)}
                            >
                              <option value="">Select Item</option>
                              {allItems.map(opt => (
                                <option key={opt.itemCode} value={opt.itemCode}>{opt.itemCode}</option>
                              ))}
                            </select>
                          </td>
                          <td>{item.itemName}</td>
                          <td>{item.currentStock}</td>
                          <td>
                            <input 
                              type="number" 
                              className="form-control form-control-sm"
                              value={item.requiredQty}
                              onChange={(e) => updateBulkItem(index, 'requiredQty', e.target.value)}
                              min="1"
                              required
                            />
                          </td>
                          <td>{item.uom}</td>
                          <td>{item.packSize}</td>
                          <td>
                            <input 
                              type="text" 
                              className="form-control form-control-sm"
                              value={item.remarks}
                              onChange={(e) => updateBulkItem(index, 'remarks', e.target.value)}
                              placeholder="Optional"
                            />
                          </td>
                          <td>
                            <div className="d-flex flex-row gap-2">
                              <button 
                                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                                onClick={() => removeBulkItem(index)}
                                disabled={bulkItems.length <= 1}
                                title="Remove Item"
                                style={{ width: '36px', height: '36px' }}
                              >
                                <i className="bi bi-x-lg"></i>
                              </button>
                              <button 
                                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                                onClick={() => viewBulkItem(index)}
                                title="View Item Details"
                                style={{ width: '36px', height: '36px' }}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="alert alert-info small mt-3">
                  <i className="fas fa-info-circle me-2"></i>
                  <strong>Tip:</strong> Use "Plan for 30 Days" to auto-fill quantities based on average daily usage.
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={handleBulkModalClose}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary w-100" onClick={submitBulkRequisition}>
                    Submit Bulk Requisition
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSV Import Modal */}
      {showCsvModal && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowCsvModal(false)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Import CSV File</h5>
                <button type="button" className="btn-close" onClick={() => setShowCsvModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info">
                  <h6>CSV Template Format:</h6>
                  <p>Item Code, UoM, Pack Size, Required Qty</p>
                  <p>Example: MED-001, Strip, 10, 50</p>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="csvFile" className="form-label">Select CSV File</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    id="csvFile" 
                    accept=".csv" 
                    onChange={handleCsvFileChange}
                  />
                </div>
                
                {csvError && (
                  <div className="alert alert-danger">
                    <h6>Import Errors:</h6>
                    <pre className="mb-0">{csvError}</pre>
                  </div>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <div className="d-flex flex-column flex-sm-row gap-2 w-100">
                  <button type="button" className="btn btn-outline-secondary w-100" onClick={() => setShowCsvModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary w-100" onClick={processCSVFile}>
                    Import CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* View Requisition Modal */}
      {showViewModal && viewRequisition && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleViewModalClose}>
          <div className="modal-dialog modal-xl modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Requisition Details</h5>
                <button type="button" className="btn-close" onClick={handleViewModalClose}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Requisition ID:</div>
                      <div className="col-7">{viewRequisition.id}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Facility:</div>
                      <div className="col-7">{viewRequisition.facility}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Department:</div>
                      <div className="col-7">{viewRequisition.department}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Requester:</div>
                      <div className="col-7">{viewRequisition.requester}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Date:</div>
                      <div className="col-7">{viewRequisition.date}</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Item Count:</div>
                      <div className="col-7">{viewRequisition.items.length} items</div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Priority:</div>
                      <div className="col-7">
                        <span className={`badge rounded-pill ${
                          viewRequisition.priority === 'High' ? 'bg-danger-subtle text-danger-emphasis' : 
                          viewRequisition.priority === 'Medium' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-info-subtle text-info-emphasis'
                        } px-3 py-1`}>
                          {viewRequisition.priority}
                        </span>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-5 fw-bold text-muted">Status:</div>
                      <div className="col-7">
                        <span className={`badge rounded-pill ${
                          viewRequisition.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' : 
                          viewRequisition.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' : 
                          viewRequisition.status === 'Partially Approved' ? 'bg-warning-subtle text-warning-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'
                        } px-3 py-1`}>
                          {viewRequisition.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Items</h6>
                  <button 
                    className="btn btn-sm btn-success"
                    onClick={() => handleBulkApprove(viewRequisition.id)}
                    disabled={!viewRequisition.items.some(item => item.status === 'Pending')}
                  >
                    <i className="fas fa-check-circle me-1"></i> Approve All Pending
                  </button>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>Requested Qty</th>
                        <th>Approved Qty</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewRequisition.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.itemCode}</td>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {item.status === 'Pending' ? (
                              <input 
                                type="number" 
                                className="form-control form-control-sm"
                                value={approvedQuantities[`${viewRequisition.id}-${index}`] || ''}
                                onChange={(e) => handleApprovedQuantityChange(viewRequisition.id, index, e.target.value)}
                                min="1"
                                placeholder="Enter qty"
                              />
                            ) : (
                              item.approvedQuantity || (item.status === 'Rejected' ? '0' : '-')
                            )}
                          </td>
                          <td>
                            <span className={`badge rounded-pill ${
                              item.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' : 
                              item.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' : 'bg-secondary-subtle text-secondary-emphasis'
                            } px-3 py-1`}>
                              {item.status}
                            </span>
                          </td>
                          <td>
                            {item.status === 'Pending' && (
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleItemApprove(viewRequisition.id, index)}
                                  title="Approve Item"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleItemReject(viewRequisition.id, index)}
                                  title="Reject Item"
                                >
                                  <i className="bi bi-x-lg"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-outline-secondary px-4" onClick={handleViewModalClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bulk Item View Modal */}
      {showBulkItemViewModal && currentViewItem && (
        <div className="modal fade show" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={handleBulkItemViewModalClose}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Item Details</h5>
                <button type="button" className="btn-close" onClick={handleBulkItemViewModalClose}></button>
              </div>
              <div className="modal-body p-4">
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Item Code:</div>
                  <div className="col-12 col-md-8">{currentViewItem.itemCode}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Item Name:</div>
                  <div className="col-12 col-md-8">{currentViewItem.itemName}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Current Stock:</div>
                  <div className="col-12 col-md-8">{currentViewItem.currentStock}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Required Quantity:</div>
                  <div className="col-12 col-md-8">{currentViewItem.requiredQty}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Unit of Measure:</div>
                  <div className="col-12 col-md-8">{currentViewItem.uom}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Pack Size:</div>
                  <div className="col-12 col-md-8">{currentViewItem.packSize}</div>
                </div>
                <div className="row mb-3">
                  <div className="col-12 col-md-4 fw-bold text-muted">Remarks:</div>
                  <div className="col-12 col-md-8">{currentViewItem.remarks || 'N/A'}</div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-outline-secondary w-100" onClick={handleBulkItemViewModalClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default FacilityRequisitions;