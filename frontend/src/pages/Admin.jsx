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

  if (!isAdmin) return null; // Avoid flicker while redirecting

  return (
    <div className="min-h-screen bg-showroom-navy text-chalk font-sans p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-warehouse-slate">
        <div>
          <h1 className="text-3xl font-display font-bold text-chalk uppercase tracking-wide">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage inventory, stock, and vehicle details</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-4 md:mt-0">
          <span className="text-dealer-brass font-mono">Hello, Admin {user?.name}</span>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-warehouse-slate border border-slate-600 text-chalk rounded-sm font-mono font-bold uppercase tracking-wide hover:bg-slate-700 transition-colors"
          >
            View Store
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-showroom-navy border border-slate-700 text-slate-300 rounded-sm font-mono font-bold uppercase tracking-wide hover:text-white hover:bg-slate-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

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
