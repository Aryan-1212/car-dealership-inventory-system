import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  const [purchaseLoading, setPurchaseLoading] = useState(null);

  const fetchVehicles = async (params = {}) => {
    setLoading(true);
    try {
      // Filter out empty params so we don't send minPrice="" 
      const activeParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== '')
      );
      
      const endpoint = Object.keys(activeParams).length > 0 ? '/vehicles/search' : '/vehicles';
      const response = await client.get(endpoint, { params: activeParams });
      
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles(searchParams);
  };

  const handleClearSearch = () => {
    const cleared = { make: '', model: '', category: '', minPrice: '', maxPrice: '' };
    setSearchParams(cleared);
    fetchVehicles({});
  };

  const handlePurchase = async (id) => {
    setPurchaseLoading(id);

    try {
      const response = await client.post(`/vehicles/${id}/purchase`);
      const updatedVehicle = response.data.vehicle;
      
      // Update quantity live without refetching the list
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v.id === id ? updatedVehicle : v))
      );
      toast.success(`Purchased ${updatedVehicle.make} ${updatedVehicle.model}`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to purchase';
      toast.error(errorMsg);
    } finally {
      setPurchaseLoading(null);
    }
  };

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div className="min-h-screen bg-chalk font-sans p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-warehouse-slate/20">
        <div>
          <h1 className="text-4xl font-display font-bold text-showroom-navy uppercase tracking-tight">Vehicle Inventory</h1>
          <p className="text-warehouse-slate mt-1">Browse and purchase vehicles</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-4 md:mt-0">
          <span className="text-showroom-navy font-medium">Hello, {user?.name || 'User'}</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {user?.role === 'admin' && (
              <button 
                onClick={() => navigate('/admin')}
                className="flex-1 sm:flex-none px-4 py-2 bg-showroom-navy text-chalk rounded-sm font-display font-bold uppercase tracking-wide hover:bg-warehouse-slate transition-colors whitespace-nowrap"
              >
                Admin Panel
              </button>
            )}
            <button 
              onClick={logout}
              className="flex-1 sm:flex-none px-4 py-2 bg-warehouse-slate/10 text-showroom-navy rounded-sm font-display font-bold uppercase tracking-wide hover:bg-warehouse-slate/20 transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <section className="bg-warehouse-slate p-6 rounded-sm shadow-xl border-t-4 border-dealer-brass mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs font-mono font-medium text-chalk/80 uppercase tracking-wider mb-1">Make</label>
            <input type="text" name="make" value={searchParams.make} onChange={handleSearchChange} className="w-full px-3 py-2 bg-showroom-navy border border-showroom-navy text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass outline-none transition" placeholder="e.g. Toyota" />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-chalk/80 uppercase tracking-wider mb-1">Model</label>
            <input type="text" name="model" value={searchParams.model} onChange={handleSearchChange} className="w-full px-3 py-2 bg-showroom-navy border border-showroom-navy text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass outline-none transition" placeholder="e.g. Corolla" />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-chalk/80 uppercase tracking-wider mb-1">Category</label>
            <input type="text" name="category" value={searchParams.category} onChange={handleSearchChange} className="w-full px-3 py-2 bg-showroom-navy border border-showroom-navy text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass outline-none transition" placeholder="e.g. SUV" />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-chalk/80 uppercase tracking-wider mb-1">Min Price</label>
            <input type="number" name="minPrice" value={searchParams.minPrice} onChange={handleSearchChange} className="w-full px-3 py-2 bg-showroom-navy border border-showroom-navy text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass outline-none transition" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-mono font-medium text-chalk/80 uppercase tracking-wider mb-1">Max Price</label>
            <input type="number" name="maxPrice" value={searchParams.maxPrice} onChange={handleSearchChange} className="w-full px-3 py-2 bg-showroom-navy border border-showroom-navy text-chalk font-mono rounded-sm focus:ring-2 focus:ring-dealer-brass outline-none transition" placeholder="100000" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-dealer-brass text-showroom-navy py-2 px-4 rounded-sm font-display font-bold uppercase tracking-wide hover:brightness-110 transition">Search</button>
            <button type="button" onClick={handleClearSearch} className="flex-1 bg-showroom-navy text-chalk py-2 px-4 rounded-sm font-display font-bold uppercase tracking-wide hover:bg-opacity-80 transition border border-chalk/10">Clear</button>
          </div>
        </form>
      </section>

      {/* Grid */}
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No vehicles found</h3>
            <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => {
              const isOutOfStock = vehicle.quantity <= 0;
              const isPurchasing = purchaseLoading === vehicle.id;
              
              return (
                <div key={vehicle.id} className="relative bg-white rounded-sm shadow-lg border-2 border-chalk overflow-hidden hover:shadow-2xl hover:border-warehouse-slate/20 transition-all flex flex-col">
                  {isOutOfStock && (
                    <div className="absolute top-5 -right-12 bg-sold-red text-white text-xs font-display font-bold px-12 py-1.5 rotate-45 shadow-md uppercase tracking-widest z-10 border-y border-white/20">
                      Sold Out
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-warehouse-slate bg-chalk px-2.5 py-1 rounded-sm border border-warehouse-slate/10">
                        {vehicle.category}
                      </span>
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-sm border ${isOutOfStock ? 'bg-sold-red/10 text-sold-red border-sold-red/20' : 'bg-stock-green/10 text-stock-green border-stock-green/20'}`}>
                        {vehicle.quantity} in stock
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-showroom-navy uppercase mt-4 leading-tight">{vehicle.make} {vehicle.model}</h3>
                    
                    <div className="mt-5">
                      <span className="inline-block bg-dealer-brass/20 text-showroom-navy font-mono font-bold text-xl px-3 py-1 border-l-4 border-dealer-brass shadow-sm">
                        {formatPrice(vehicle.price)}
                      </span>
                    </div>
                  </div>
                  
                  {!isOutOfStock && (
                    <div className="p-6 pt-0 mt-auto">
                      <button
                        onClick={() => handlePurchase(vehicle.id)}
                        disabled={isPurchasing}
                        className={`w-full py-3 rounded-sm border-2 border-showroom-navy font-display font-bold uppercase tracking-widest transition-all ${
                          isPurchasing 
                            ? 'bg-warehouse-slate text-white opacity-75 cursor-wait' 
                            : 'bg-showroom-navy text-chalk hover:bg-dealer-brass hover:text-showroom-navy hover:border-dealer-brass active:transform active:scale-[0.98]'
                        }`}
                      >
                        {isPurchasing ? 'Processing...' : 'Purchase'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
