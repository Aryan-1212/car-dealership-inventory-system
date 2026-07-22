import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import client from '../api/client';

const Dashboard = () => {
  const { user, logout } = useAuth();
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
  const [purchaseErrors, setPurchaseErrors] = useState({});

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
    setPurchaseErrors((prev) => ({ ...prev, [id]: null }));

    try {
      const response = await client.post(`/vehicles/${id}/purchase`);
      const updatedVehicle = response.data.vehicle;
      
      // Update quantity live without refetching the list
      setVehicles((prevVehicles) =>
        prevVehicles.map((v) => (v.id === id ? updatedVehicle : v))
      );
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to purchase';
      setPurchaseErrors((prev) => ({ ...prev, [id]: errorMsg }));
    } finally {
      setPurchaseLoading(null);
    }
  };

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Vehicle Inventory</h1>
          <p className="text-slate-500 mt-1">Browse and purchase vehicles</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-slate-600 font-medium">Hello, {user?.name || 'User'}</span>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg font-medium hover:bg-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Make</label>
            <input type="text" name="make" value={searchParams.make} onChange={handleSearchChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Toyota" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Model</label>
            <input type="text" name="model" value={searchParams.model} onChange={handleSearchChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Corolla" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</label>
            <input type="text" name="category" value={searchParams.category} onChange={handleSearchChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. SUV" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Min Price</label>
            <input type="number" name="minPrice" value={searchParams.minPrice} onChange={handleSearchChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Max Price</label>
            <input type="number" name="maxPrice" value={searchParams.maxPrice} onChange={handleSearchChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="100000" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition">Search</button>
            <button type="button" onClick={handleClearSearch} className="flex-1 bg-slate-100 text-slate-600 py-2 px-4 rounded-lg font-medium hover:bg-slate-200 transition">Clear</button>
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
                <div key={vehicle.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                        {vehicle.category}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {vehicle.quantity} in stock
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{vehicle.make} {vehicle.model}</h3>
                    <p className="text-2xl font-semibold text-slate-800 mt-2">{formatPrice(vehicle.price)}</p>
                    
                    {purchaseErrors[vehicle.id] && (
                      <div className="mt-4 text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        {purchaseErrors[vehicle.id]}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 pt-0 mt-auto">
                    <button
                      onClick={() => handlePurchase(vehicle.id)}
                      disabled={isOutOfStock || isPurchasing}
                      className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                        isOutOfStock 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 active:transform active:scale-95'
                      } ${isPurchasing ? 'opacity-75 cursor-wait' : ''}`}
                    >
                      {isPurchasing ? 'Purchasing...' : isOutOfStock ? 'Out of Stock' : 'Purchase'}
                    </button>
                  </div>
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
