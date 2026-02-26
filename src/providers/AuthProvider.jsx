
import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);



  const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    const { user: userData, token } = response.data;
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);  // ← store token
    
    setUser(userData);
    return { success: true, user: userData };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};

const logout = async () => {
  try { await authAPI.logout(); } catch (e) {
    console.error('Logout error:', e);
  }
  setUser(null);
  localStorage.removeItem('user');
  localStorage.removeItem('token');  // ← clear token
};

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.log('Registration response:', response);
      
      // Store the role temporarily for use after login
      if (userData.role) {
        localStorage.setItem('pendingRole', userData.role);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};