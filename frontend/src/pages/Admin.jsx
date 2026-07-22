import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">Admin Panel</h1>
        <button 
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-indigo-500">
        <p className="text-slate-600">Admin Content Placeholder (e.g. Restock, Delete Vehicle)</p>
      </div>
    </div>
  );
};

export default Admin;
