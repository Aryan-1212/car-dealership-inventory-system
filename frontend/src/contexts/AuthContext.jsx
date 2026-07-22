import React, { createContext, useContext, useState, useMemo } from 'react';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Strictly in-memory React state, no persistence to localStorage
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken); // Update Axios interceptor
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null); // Clear Axios interceptor
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token,
      isAdmin: user?.role === 'admin',
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
