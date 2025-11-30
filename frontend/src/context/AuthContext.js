import React, { createContext, useState, useEffect } from 'react';
import { authAPI, getToken, setToken, removeToken } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const response = await authAPI.verify();
          if (response.user) {
            setUser(response.user);
          } else {
            removeToken();
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (upiId, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.registerOrLogin(upiId, password);
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authAPI.logout();
      setUser(null);
      removeToken();
      return { success: true };
    } catch (err) {
      console.error('Logout failed:', err);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
