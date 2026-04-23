import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllItems, addItem, updateItem, deleteItem, searchItems } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form data for add/edit
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: ''
  });

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If parsing fails, redirect to login
        navigate('/login');
      }
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await getAllItems();
      if (response.data.success) {
        setItems(response.data.items);
        setFilteredItems(response.data.items);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setMessage({ 
        type: 'warning', 
        text: 'Could not load items. Please refresh the page.' 
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await addItem(formData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Item added successfully!' });
        setFormData({
          itemName: '',
          description: '',
          type: 'Lost',
          location: '',
          date: '',
          contactInfo: ''
        });
        setShowAddForm(false);
        fetchItems();
      }
    } catch (err) {
      console.error('Add item error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to add item' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      contactInfo: item.contactInfo
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await updateItem(editingItem._id, formData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Item updated successfully!' });
        setFormData({
          itemName: '',
          description: '',
          type: 'Lost',
          location: '',
          date: '',
          contactInfo: ''
        });
        setShowAddForm(false);
        setEditingItem(null);
        fetchItems();
      }
    } catch (err) {
      console.error('Update item error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update item' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    setMessage({ type: '', text: '' });

    try {
      const response = await deleteItem(id);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Item deleted successfully!' });
        fetchItems();
      }
    } catch (err) {
      console.error('Delete item error:', err);
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to delete item' 
      });
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredItems(items);
      return;
    }

    try {
      const response = await searchItems(query);
      if (response.data.success) {
        setFilteredItems(response.data.items);
      }
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to local filtering
      const filtered = items.filter(item =>
        item.itemName.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setShowAddForm(false);
    setFormData({
      itemName: '',
      description: '',
      type: 'Lost',
      location: '',
      date: '',
      contactInfo: ''
    });
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>Lost & Found Dashboard</h1>
              <p>Welcome back, {user.name}!</p>
            </div>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className={`btn ${showAddForm ? 'btn-secondary' : 'btn-primary'}`}
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Item'}
          </button>
          <input
            type="text"
            className="form-control search-input"
            placeholder="🔍 Search items by name or description..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Add/Edit Item Form */}
        {showAddForm && (
          <div className="form-section">
            <h3>{editingItem ? '✏️ Edit Item' : '➕ Add New Item'}</h3>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="itemName" className="form-label">Item Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="itemName"
                    name="itemName"
                    value={formData.itemName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Blue Backpack"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="type" className="form-label">Type *</label>
                  <select
                    className="form-control"
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe the item in detail..."
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="location" className="form-label">Location *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Library, Cafeteria"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="date" className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="contactInfo" className="form-label">Contact Info *</label>
                <input
                  type="text"
                  className="form-control"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  required
                  placeholder="Phone number or email"
                />
              </div>

              <div className="d-flex gap-2">
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
                {editingItem && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Items List */}
        <div className="items-container">
          <h3>📦 All Items ({filteredItems.length})</h3>
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No items found. {searchQuery ? 'Try a different search.' : 'Add your first item to get started!'}</p>
            </div>
          ) : (
            <div className="row">
              {filteredItems.map((item) => (
                <div key={item._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="card-title">
                        <span>{item.itemName}</span>
                        <span className={`badge ${item.type === 'Lost' ? 'bg-danger' : 'bg-success'}`}>
                          {item.type === 'Lost' ? '🔍 Lost' : '✓ Found'}
                        </span>
                      </div>
                      <p className="card-text">{item.description}</p>
                      
                      <div className="card-info">
                        <div className="card-info-item">
                          <strong>📍 Location:</strong>
                          <span>{item.location}</span>
                        </div>
                        <div className="card-info-item">
                          <strong>📅 Date:</strong>
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <div className="card-info-item">
                          <strong>📞 Contact:</strong>
                          <span>{item.contactInfo}</span>
                        </div>
                      </div>
                      
                      <div className="card-footer">
                        <div className="card-author">
                          Posted by: {item.userId?.name || 'Unknown'}
                        </div>
                        {user && user.id === item.userId?._id && (
                          <div className="d-flex gap-2">
                            <button 
                              onClick={() => handleEditItem(item)}
                              className="btn btn-sm btn-primary"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item._id)}
                              className="btn btn-sm btn-danger"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
