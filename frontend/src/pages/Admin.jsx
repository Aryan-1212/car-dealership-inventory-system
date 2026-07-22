import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';

const AdminVehicleCard = ({ vehicle, onUpdate, onDelete, onRestock }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    make: vehicle.make,
    model: vehicle.model,
    category: vehicle.category,
    price: vehicle.price,
    quantity: vehicle.quantity,
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState(null);

  const [restockAmount, setRestockAmount] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);
  const [restockError, setRestockError] = useState(null);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...editForm,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
    };
    onUpdate(vehicle.id, payload, setUpdateLoading, setUpdateError, () => setIsEditing(false));
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockAmount || Number(restockAmount) <= 0) return;
    onRestock(vehicle.id, restockAmount, setRestockLoading, setRestockError, () => setRestockAmount(''));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...vehicle });
    setUpdateError(null);
  };

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-indigo-200 p-5 overflow-hidden flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-3">Edit Vehicle</h3>
        {updateError && (
          <div className="mb-3 text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {updateError}
          </div>
        )}
        <form onSubmit={handleEditSubmit} className="space-y-3 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-3">
            <input type="text" placeholder="Make" value={editForm.make} onChange={e => setEditForm({...editForm, make: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" required />
            <input type="text" placeholder="Model" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" required />
            <input type="text" placeholder="Category" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" required />
            <input type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" required min="0.01" step="0.01" />
            <input type="number" placeholder="Quantity" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none" required min="0" />
          </div>
          <div className="flex gap-2 mt-auto pt-4">
            <button type="button" onClick={handleCancelEdit} disabled={updateLoading} className="flex-1 py-1.5 px-3 bg-slate-100 text-slate-700 text-sm font-medium rounded hover:bg-slate-200 transition">Cancel</button>
            <button type="submit" disabled={updateLoading} className="flex-1 py-1.5 px-3 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition">
              {updateLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="p-5 flex-1 border-b border-slate-100">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {vehicle.category}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${vehicle.quantity <= 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {vehicle.quantity} in stock
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mt-2">{vehicle.make} {vehicle.model}</h3>
        <p className="text-xl font-semibold text-slate-800 mt-1">{formatPrice(vehicle.price)}</p>

        {delError && (
          <div className="mt-3 text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {delError}
          </div>
        )}
        {restockError && (
          <div className="mt-3 text-sm font-medium text-red-600 bg-red-50 p-2 rounded border border-red-100">
            {restockError}
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-4">
        {/* Restock Form */}
        <form onSubmit={handleRestockSubmit} className="flex gap-2 mb-3">
          <input 
            type="number" 
            placeholder="Amount" 
            value={restockAmount} 
            onChange={(e) => setRestockAmount(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 outline-none"
            min="1"
            required
            disabled={restockLoading || delLoading}
          />
          <button 
            type="submit" 
            disabled={restockLoading || delLoading}
            className="whitespace-nowrap px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded hover:bg-emerald-700 transition disabled:opacity-70"
          >
            {restockLoading ? '...' : 'Restock'}
          </button>
        </form>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(true)}
            disabled={delLoading || restockLoading}
            className="flex-1 py-1.5 px-3 border border-slate-300 text-slate-700 text-sm font-medium rounded hover:bg-slate-100 transition"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(vehicle.id, setDelLoading, setDelError)}
            disabled={delLoading || restockLoading}
            className="flex-1 py-1.5 px-3 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition disabled:opacity-70"
          >
            {delLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Form State
  const [newVehicle, setNewVehicle] = useState({
    make: '', model: '', category: '', price: '', quantity: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await client.get('/vehicles');
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVehicles();
    }
  }, [isAdmin]);

  const handleAddChange = (e) => {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(false);
    setAddLoading(true);

    try {
      const payload = {
        ...newVehicle,
        price: Number(newVehicle.price),
        quantity: Number(newVehicle.quantity)
      };
      const res = await client.post('/vehicles', payload);
      setVehicles([...vehicles, res.data.vehicle]);
      setAddSuccess(true);
      setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' });
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id, setDelLoading, setDelError) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    setDelLoading(true);
    setDelError(null);
    try {
      await client.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setDelError(err.response?.data?.message || 'Failed to delete vehicle');
      setDelLoading(false);
    }
  };

  const handleUpdate = async (id, payload, setUpdateLoading, setUpdateError, exitEdit) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      const res = await client.put(`/vehicles/${id}`, payload);
      setVehicles(prev => prev.map(v => v.id === id ? res.data.vehicle : v));
      exitEdit();
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRestock = async (id, amount, setRestockLoading, setRestockError, resetAmount) => {
    setRestockLoading(true);
    setRestockError(null);
    try {
      const res = await client.post(`/vehicles/${id}/restock`, { amount: Number(amount) });
      setVehicles(prev => prev.map(v => v.id === id ? res.data.vehicle : v));
      resetAmount();
    } catch (err) {
      setRestockError(err.response?.data?.message || 'Failed to restock vehicle');
    } finally {
      setRestockLoading(false);
    }
  };

  if (!isAdmin) return null; // Avoid flicker while redirecting

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage inventory, stock, and vehicle details</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-slate-600 font-medium">Hello, Admin {user?.name}</span>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            View Store
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Add Vehicle Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Vehicle</h2>
            
            {addSuccess && (
              <div className="mb-4 text-sm font-medium text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                Vehicle added successfully!
              </div>
            )}
            {addError && (
              <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Make</label>
                <input type="text" name="make" value={newVehicle.make} onChange={handleAddChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Model</label>
                <input type="text" name="model" value={newVehicle.model} onChange={handleAddChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</label>
                <input type="text" name="category" value={newVehicle.category} onChange={handleAddChange} required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Price</label>
                  <input type="number" name="price" value={newVehicle.price} onChange={handleAddChange} required min="0.01" step="0.01" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Quantity</label>
                  <input type="number" name="quantity" value={newVehicle.quantity} onChange={handleAddChange} required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={addLoading}
                className={`w-full py-2.5 mt-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition ${addLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {addLoading ? 'Adding...' : 'Add Vehicle'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Inventory List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Inventory is empty</h3>
              <p className="text-slate-500">Add a vehicle using the form to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <AdminVehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  onRestock={handleRestock}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;
