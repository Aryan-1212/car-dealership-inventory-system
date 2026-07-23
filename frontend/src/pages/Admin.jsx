import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';

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

  const [delLoading, setDelLoading] = useState(false);

  const [restockAmount, setRestockAmount] = useState('');
  const [restockLoading, setRestockLoading] = useState(false);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...editForm,
      price: Number(editForm.price),
      quantity: Number(editForm.quantity),
    };
    onUpdate(vehicle.id, payload, setUpdateLoading, () => setIsEditing(false));
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockAmount || Number(restockAmount) <= 0) return;
    
    if (!window.confirm(`Are you sure you want to add ${restockAmount} unit(s) to the current stock?`)) {
      return;
    }
    
    onRestock(vehicle.id, restockAmount, setRestockLoading, () => setRestockAmount(''));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({ ...vehicle });
  };

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  if (isEditing) {
    return (
      <div className="bg-warehouse-slate border border-dealer-brass p-5 flex flex-col rounded-none shadow-xl">
        <h3 className="text-lg font-mono font-bold text-dealer-brass mb-3 uppercase">Edit Vehicle</h3>
        <form onSubmit={handleEditSubmit} className="space-y-3 flex-1 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Make" value={editForm.make} onChange={e => setEditForm({...editForm, make: e.target.value})} className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none" required />
            <input type="text" placeholder="Model" value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none" required />
            <input type="text" placeholder="Category" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none" required />
            <input type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none" required min="0.01" step="0.01" />
            <input type="number" placeholder="Quantity" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none" required min="0" />
          </div>
          <div className="flex gap-2 mt-auto pt-4">
            <button type="button" onClick={handleCancelEdit} disabled={updateLoading} className="flex-1 py-1.5 px-3 bg-showroom-navy border border-slate-600 text-chalk text-sm font-mono font-bold uppercase tracking-wider rounded-sm hover:bg-slate-700 transition">Cancel</button>
            <button type="submit" disabled={updateLoading} className="flex-1 py-1.5 px-3 bg-dealer-brass text-showroom-navy text-sm font-mono font-bold uppercase tracking-wider rounded-sm hover:brightness-110 transition">
              {updateLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-warehouse-slate border border-slate-600 rounded-none overflow-hidden hover:border-slate-500 transition-colors flex flex-col">
      <div className="p-4 flex-1 border-b border-slate-700">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-chalk bg-showroom-navy border border-slate-600 px-2.5 py-1 rounded-sm">
            {vehicle.category}
          </span>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-sm border ${vehicle.quantity <= 0 ? 'bg-sold-red/10 text-sold-red border-sold-red/20' : 'bg-stock-green/10 text-stock-green border-stock-green/20'}`}>
            {vehicle.quantity} in stock
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-chalk mt-3">{vehicle.make} {vehicle.model}</h3>
        <p className="text-lg font-mono text-dealer-brass mt-1">{formatPrice(vehicle.price)}</p>
      </div>

      <div className="bg-showroom-navy/50 p-4">
        {/* Restock Form */}
        <form onSubmit={handleRestockSubmit} className="flex gap-2 mb-3">
          <input 
            type="number" 
            placeholder="Amount" 
            value={restockAmount} 
            onChange={(e) => setRestockAmount(e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-mono bg-showroom-navy border border-slate-600 text-chalk rounded-sm focus:ring-1 focus:ring-dealer-brass outline-none"
            min="1"
            required
            disabled={restockLoading || delLoading}
          />
          <button 
            type="submit" 
            disabled={restockLoading || delLoading}
            className="whitespace-nowrap px-3 py-1.5 bg-warehouse-slate border border-slate-600 text-chalk text-sm font-mono font-bold uppercase tracking-wider rounded-sm hover:bg-slate-700 transition disabled:opacity-70"
          >
            {restockLoading ? '...' : 'Restock'}
          </button>
        </form>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(true)}
            disabled={delLoading || restockLoading}
            className="flex-1 py-1.5 px-3 border border-slate-600 bg-showroom-navy text-chalk text-sm font-mono font-bold uppercase tracking-wider rounded-sm hover:bg-warehouse-slate transition"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(vehicle.id, setDelLoading)}
            disabled={delLoading || restockLoading}
            className="flex-1 py-1.5 px-3 bg-sold-red/10 text-sold-red border border-sold-red/20 text-sm font-mono font-bold uppercase tracking-wider rounded-sm hover:bg-sold-red/20 transition disabled:opacity-70"
          >
            {delLoading ? 'Del...' : 'Delete'}
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
    setAddLoading(true);

    try {
      const payload = {
        ...newVehicle,
        price: Number(newVehicle.price),
        quantity: Number(newVehicle.quantity)
      };
      const res = await client.post('/vehicles', payload);
      setVehicles([...vehicles, res.data.vehicle]);
      setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' });
      toast.success('Vehicle added successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (id, setDelLoading) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    
    setDelLoading(true);
    try {
      await client.delete(`/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.id !== id));
      toast.success('Vehicle deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete vehicle');
      setDelLoading(false);
    }
  };

  const handleUpdate = async (id, payload, setUpdateLoading, exitEdit) => {
    setUpdateLoading(true);
    try {
      const res = await client.put(`/vehicles/${id}`, payload);
      setVehicles(prev => prev.map(v => v.id === id ? res.data.vehicle : v));
      toast.success('Vehicle updated successfully');
      exitEdit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRestock = async (id, amount, setRestockLoading, resetAmount) => {
    setRestockLoading(true);
    try {
      const res = await client.post(`/vehicles/${id}/restock`, { amount: Number(amount) });
      setVehicles(prev => prev.map(v => v.id === id ? res.data.vehicle : v));
      toast.success(`Restocked ${amount} unit(s)`);
      resetAmount();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to restock vehicle');
    } finally {
      setRestockLoading(false);
    }
  };

  // Calculate Summary
  const totalModels = vehicles.length;
  const totalUnits = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const totalValue = vehicles.reduce((sum, v) => sum + ((v.price || 0) * (v.quantity || 0)), 0);
  const outOfStock = vehicles.filter(v => v.quantity === 0).length;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (!isAdmin) return null; // Avoid flicker while redirecting

  return (
    <div className="min-h-screen bg-showroom-navy text-chalk font-sans p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-warehouse-slate">
        <div>
          <h1 className="text-3xl font-display font-bold text-chalk uppercase tracking-wide">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage inventory, stock, and vehicle details</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-4 md:mt-0">
          <span className="text-dealer-brass font-mono">Hello, {user?.name}</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/')}
              className="flex-1 sm:flex-none px-4 py-2 bg-warehouse-slate border border-slate-600 text-chalk rounded-sm font-mono font-bold uppercase tracking-wide hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              View Store
            </button>
            <button 
              onClick={logout}
              className="flex-1 sm:flex-none px-4 py-2 bg-showroom-navy border border-slate-700 text-slate-300 rounded-sm font-mono font-bold uppercase tracking-wide hover:text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Inventory Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-warehouse-slate/30 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left transition-colors hover:border-dealer-brass/50 hover:bg-warehouse-slate/50">
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 hidden sm:block">
              <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd" />
            </svg>
            Total Models
          </span>
          <span className="text-2xl sm:text-3xl font-display font-bold text-chalk">{totalModels}</span>
        </div>
        <div className="bg-warehouse-slate/30 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left transition-colors hover:border-dealer-brass/50 hover:bg-warehouse-slate/50">
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 hidden sm:block">
              <path d="M11.983 1.907a.75.75 0 00-1.292-.656l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.656l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
            </svg>
            Total Units
          </span>
          <span className="text-2xl sm:text-3xl font-display font-bold text-chalk">{totalUnits}</span>
        </div>
        <div className="bg-warehouse-slate/30 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left transition-colors hover:border-dealer-brass/50 hover:bg-warehouse-slate/50">
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 hidden sm:block">
              <path fillRule="evenodd" d="M1 4.25A2.25 2.25 0 013.25 2h13.5A2.25 2.25 0 0119 4.25v11.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75V4.25zM3.25 3.5c-.414 0-.75.336-.75.75v11.5c0 .414.336.75.75.75h13.5c.414 0 .75-.336.75-.75V4.25c0-.414-.336-.75-.75-.75H3.25z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M9 7.5A1.5 1.5 0 0110.5 6h1a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 019 10.5v-3zM10.5 7.5v3h1v-3h-1z" clipRule="evenodd" />
              <path d="M7.25 10.5a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1a.75.75 0 01.75.75zM14.5 10.5a.75.75 0 01-.75.75h-1a.75.75 0 010-1.5h1a.75.75 0 01.75.75z" />
            </svg>
            Total Value
          </span>
          <span className="text-xl sm:text-3xl font-display font-bold text-dealer-brass">{formatCurrency(totalValue)}</span>
        </div>
        <div className="bg-warehouse-slate/30 border border-slate-700/50 p-4 rounded-lg flex flex-col items-center sm:items-start text-center sm:text-left transition-colors hover:border-dealer-brass/50 hover:bg-warehouse-slate/50">
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 hidden sm:block">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            Out of Stock
          </span>
          <span className={`text-2xl sm:text-3xl font-display font-bold ${outOfStock > 0 ? 'text-sold-red' : 'text-chalk'}`}>{outOfStock}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Add Vehicle Form */}
        <div className="lg:col-span-1">
          <div className="bg-warehouse-slate p-6 rounded-none border border-slate-600 shadow-xl sticky top-6">
            <h2 className="text-xl font-mono font-bold text-dealer-brass mb-4 uppercase">Add New Vehicle</h2>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-medium text-chalk/70 uppercase tracking-wider mb-1">Make</label>
                <input type="text" name="make" value={newVehicle.make} onChange={handleAddChange} required className="w-full px-3 py-2 bg-showroom-navy border border-slate-600 text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-chalk/70 uppercase tracking-wider mb-1">Model</label>
                <input type="text" name="model" value={newVehicle.model} onChange={handleAddChange} required className="w-full px-3 py-2 bg-showroom-navy border border-slate-600 text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-chalk/70 uppercase tracking-wider mb-1">Category</label>
                <input type="text" name="category" value={newVehicle.category} onChange={handleAddChange} required className="w-full px-3 py-2 bg-showroom-navy border border-slate-600 text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass outline-none transition" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-medium text-chalk/70 uppercase tracking-wider mb-1">Price</label>
                  <input type="number" name="price" value={newVehicle.price} onChange={handleAddChange} required min="0.01" step="0.01" className="w-full px-3 py-2 bg-showroom-navy border border-slate-600 text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass outline-none transition" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-medium text-chalk/70 uppercase tracking-wider mb-1">Quantity</label>
                  <input type="number" name="quantity" value={newVehicle.quantity} onChange={handleAddChange} required min="0" className="w-full px-3 py-2 bg-showroom-navy border border-slate-600 text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass focus:border-dealer-brass outline-none transition" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={addLoading}
                className={`w-full py-2.5 mt-2 bg-dealer-brass text-showroom-navy rounded-sm font-mono font-bold uppercase tracking-wide hover:brightness-110 transition ${addLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-dealer-brass"></div>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="bg-warehouse-slate rounded-none border border-slate-700 p-12 text-center">
              <h3 className="text-xl font-mono font-bold text-chalk mb-2">Inventory is empty</h3>
              <p className="text-slate-400">Add a vehicle using the form to get started.</p>
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
