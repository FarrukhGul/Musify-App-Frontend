import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
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
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative flex items-center justify-center">
                  <div className="flex items-end space-x-0.5">
                    <div className="w-0.5 h-2 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}></div>
                    <div className="w-0.5 h-3 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-0.5 h-1.5 bg-spotify-green rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
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
      <NavLink to="/" end className={({ isActive }) =>
        `text-sm font-medium transition ${isActive ? 'text-white border-b-2 border-spotify-green pb-0.5' : 'text-gray-400 hover:text-white'}`
      }>Home</NavLink>

      <NavLink to="/music" className={({ isActive }) =>
        `text-sm font-medium transition ${isActive ? 'text-white border-b-2 border-spotify-green pb-0.5' : 'text-gray-400 hover:text-white'}`
      }>Music</NavLink>

      <NavLink to="/albums" className={({ isActive }) =>
        `text-sm font-medium transition ${isActive ? 'text-white border-b-2 border-spotify-green pb-0.5' : 'text-gray-400 hover:text-white'}`
      }>Albums</NavLink>

      {user.role === 'artist' && (
        <>
          <NavLink to="/upload" className={({ isActive }) =>
            `text-sm font-medium transition ${isActive ? 'text-white border-b-2 border-spotify-green pb-0.5' : 'text-gray-400 hover:text-white'}`
          }>Upload</NavLink>

          <NavLink to="/create-album" className={({ isActive }) =>
            `text-sm font-medium transition ${isActive ? 'text-white border-b-2 border-spotify-green pb-0.5' : 'text-gray-400 hover:text-white'}`
          }>Create Album</NavLink>
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
                    <span className="text-sm text-spotify-gray max-w-[150px] truncate">{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-spotify-green rounded-lg hover:bg-spotify-green/80 transition transform hover:scale-105"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-spotify-green rounded-lg hover:bg-spotify-green/80 transition">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center justify-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-spotify-light transition-all duration-300"
              >
                <span className={`block w-5 h-[2px] bg-spotify-green rounded-full transition-all duration-500 ease-in-out origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-[7px]' : 'mb-[5px]'}`}></span>
                <span className={`block h-[2px] bg-spotify-green rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'w-0 opacity-0' : 'w-5 mb-[5px]'}`}></span>
                <span className={`block w-5 h-[2px] bg-spotify-green rounded-full transition-all duration-500 ease-in-out origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
              </button>
            </div>

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