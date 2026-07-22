import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  // Ensure Axios interceptor has the token on initial mount if restoring session
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken); // Update Axios interceptor
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null); // Clear Axios interceptor
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
