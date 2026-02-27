import React, { useState } from 'react';  // useEffect hata do
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';

// ← Component se BAHAR
const BAR_HEIGHTS = [12, 24, 16, 28, 14, 22, 18, 26];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.log('Error parsing user from localStorage:', e);
      localStorage.removeItem('user');
      return null;
    }
  });
  const [loading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { user: userData, token } = response.data;
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    try { await authAPI.logout(); } catch (e) {
      console.log('Error during logout:', e);
    }
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setLoggingOut(false);
    }, 1500);
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      if (userData.role) localStorage.setItem('pendingRole', userData.role);
      console.log('Registration successful:', response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}

      {loggingOut && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center shadow-2xl shadow-spotify-green/40 animate-pulse">
              <svg className="w-10 h-10 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-spotify-green/40 animate-ping"></div>
            <div className="absolute -inset-3 rounded-full border border-spotify-green/20 animate-ping" style={{ animationDelay: '0.3s' }}></div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Musi<span className="text-spotify-green">fy</span>
          </h2>
          <p className="text-gray-400 text-sm mb-8">See you next time 👋</p>

          <div className="flex items-end space-x-1">
            {BAR_HEIGHTS.map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-spotify-green rounded-full animate-pulse"
                style={{
                  height: `${height}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};