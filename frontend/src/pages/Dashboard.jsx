import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Vehicle Inventory</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.name || 'User'}!</span>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-slate-600">Dashboard Content Placeholder</p>
      </div>
    </div>
  );
};

export default Dashboard;
