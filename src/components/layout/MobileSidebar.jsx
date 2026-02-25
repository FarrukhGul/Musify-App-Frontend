import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-spotify-dark to-spotify-black z-50 transform transition-transform duration-300 md:hidden shadow-2xl">
        {/* Header with Logo */}
        <div className="p-6 border-b border-spotify-light">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3" onClick={onClose}>
              {/* Icon */}
              <div className="relative">
                {/* Small sound wave */}
                <div className="absolute -top-1 -right-1 flex space-x-0.5">
                  <div className="w-1 h-2 bg-spotify-green rounded-full animate-pulse"></div>
                  <div className="w-1 h-3 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              {/* Text */}
              <div>
                <span className="text-xl font-bold">
                  <span className="text-white">Musi</span>
                  <span className="text-spotify-green">fy</span>
                </span>
                <p className="text-xs text-spotify-gray">Listen to music</p>
              </div>
            </Link>
            <button onClick={onClose} className="text-spotify-gray hover:text-white p-2 hover:bg-spotify-light rounded-lg transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-spotify-light bg-spotify-light/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm text-spotify-gray">Logged in as</p>
                <p className="font-medium text-white">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {user ? (
              <>
                <li>
                  <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 text-spotify-gray hover:text-white hover:bg-spotify-light rounded-lg transition group"
                  >
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/music"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 text-spotify-gray hover:text-white hover:bg-spotify-light rounded-lg transition group"
                  >
                    <span className="text-xl">🎵</span>
                    <span className="font-medium">Music</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/albums"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-4 py-3 text-spotify-gray hover:text-white hover:bg-spotify-light rounded-lg transition group"
                  >
                    <span className="text-xl">💿</span>
                    <span className="font-medium">Albums</span>
                  </Link>
                </li>
                {user.role === 'artist' && (
                  <>
                    <li className="pt-2">
                      <p className="px-4 text-xs font-semibold text-spotify-gray uppercase tracking-wider">Artist</p>
                    </li>
                    <li>
                      <Link
                        to="/upload"
                        onClick={onClose}
                        className="flex items-center space-x-3 px-4 py-3 text-spotify-gray hover:text-white hover:bg-spotify-light rounded-lg transition group"
                      >
                        <span className="text-xl">⬆️</span>
                        <span className="font-medium">Upload Music</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/create-album"
                        onClick={onClose}
                        className="flex items-center space-x-3 px-4 py-3 text-spotify-gray hover:text-white hover:bg-spotify-light rounded-lg transition group"
                      >
                        <span className="text-xl">📀</span>
                        <span className="font-medium">Create Album</span>
                      </Link>
                    </li>
                  </>
                )}
                <li className="pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:text-red-400 hover:bg-spotify-light rounded-lg transition group"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center space-x-3 px-4 py-3 text-spotify-green hover:text-white hover:bg-spotify-light rounded-lg transition group"
                >
                  <span className="text-xl">🔐</span>
                  <span className="font-medium">Login</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center border-t border-spotify-light">
          <p className="text-xs text-spotify-gray">
            created by <span className="text-spotify-green font-semibold">Farrukh Gul</span>
          </p>
          <p className="text-xs text-spotify-gray mt-1">© 2024 MusicApp</p>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;