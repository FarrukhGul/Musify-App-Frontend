import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MobileSidebar from './MobileSidebar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-spotify-dark border-b border-spotify-light sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo with Icon and Text */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                {/* Icon Container - Fixed size for perfect alignment */}
                <div className="relative flex items-center justify-center">
                  {/* Main Icon Circle */}
          
                  
                  {/* Blinking Music Effect - Perfectly Aligned to Top Right */}
                  <div className="absolute -top-1 -right-1 flex items-end space-x-0.5">
                    {/* Bar 1 */}
                    <div className="w-0.5 h-2 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0s' }}>
                    </div>
                    {/* Bar 2 - Taller */}
                    <div className="w-0.5 h-3 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.2s' }}>
                    </div>
                    {/* Bar 3 - Short */}
                    <div className="w-0.5 h-1.5 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" 
                         style={{ animationDelay: '0.4s' }}>
                    </div>
                  </div>
                </div>
                
                {/* Text Logo */}
                <span className="text-xl font-bold">
                  <span className="text-white">Musi</span>
                  <span className="text-spotify-green">fy</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {user && (
                <>
                  <Link to="/" className="text-spotify-gray hover:text-white transition text-sm font-medium">
                    Home
                  </Link>
                  <Link to="/music" className="text-spotify-gray hover:text-white transition text-sm font-medium">
                    Music
                  </Link>
                  <Link to="/albums" className="text-spotify-gray hover:text-white transition text-sm font-medium">
                    Albums
                  </Link>
                  {user.role === 'artist' && (
                    <>
                      <Link to="/upload" className="text-spotify-gray hover:text-white transition text-sm font-medium">
                        Upload
                      </Link>
                      <Link to="/create-album" className="text-spotify-gray hover:text-white transition text-sm font-medium">
                        Create Album
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-spotify-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-spotify-green">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-spotify-gray max-w-[150px] truncate">
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-spotify-green rounded-lg hover:bg-spotify-green/80 transition transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-spotify-green rounded-lg hover:bg-spotify-green/80 transition transform hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-spotify-gray hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;