import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiHome, FiMusic, FiDisc, FiUpload, FiPlusCircle, FiLogOut, FiLogIn, FiX, FiEdit2 } from 'react-icons/fi';
import EditProfile from '../auth/EditProfile';

const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] z-[60] flex flex-col md:hidden shadow-2xl overflow-y-auto transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center space-x-3" onClick={onClose}>
              <div>
                <span className="text-xl font-bold">
                  <span className="text-white">Musi</span>
                  <span className="text-spotify-green">fy</span>
                </span>
                <p className="text-xs text-gray-400">Listen to music</p>
              </div>
            </NavLink>
            <button onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-300">
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-5 border-b border-white/10 bg-white/5">
            <div className="flex items-center space-x-3">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-spotify-green shadow-lg" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-spotify-green to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-spotify-green/30">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="font-medium text-white truncate text-sm">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full border border-spotify-green/30">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => { setShowEditProfile(true); onClose(); }}
              className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 bg-white/5 border border-white/10 hover:bg-spotify-green/10 hover:border-spotify-green/30 text-gray-400 hover:text-spotify-green rounded-xl transition-all duration-300 text-sm font-medium"
            >
              <FiEdit2 size={15} />
              <span>Edit Profile</span>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {user ? (
              <>
                <li>
                  <NavLink to="/" end onClick={onClose} className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green border border-spotify-green/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    <FiHome size={18} /><span className="font-medium text-sm">Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/music" onClick={onClose} className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green border border-spotify-green/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    <FiMusic size={18} /><span className="font-medium text-sm">Music</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/albums" onClick={onClose} className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green border border-spotify-green/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                    <FiDisc size={18} /><span className="font-medium text-sm">Albums</span>
                  </NavLink>
                </li>
                {user.role === 'artist' && (
                  <>
                    <li className="pt-3">
                      <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Artist</p>
                    </li>
                    <li>
                      <NavLink to="/upload" onClick={onClose} className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green border border-spotify-green/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                        <FiUpload size={18} /><span className="font-medium text-sm">Upload Music</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/create-album" onClick={onClose} className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green border border-spotify-green/20' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                        <FiPlusCircle size={18} /><span className="font-medium text-sm">Create Album</span>
                      </NavLink>
                    </li>
                  </>
                )}
                <li className="pt-4">
                  <button onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                    <FiLogOut size={18} /><span className="font-medium text-sm">Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <NavLink to="/login" onClick={onClose} className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-spotify-green/10 text-spotify-green' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
                  <FiLogIn size={18} /><span className="font-medium text-sm">Login</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-6 text-center border-t border-white/10">
          <p className="text-xs text-gray-500">created by <span className="text-spotify-green font-semibold">Farrukh Gul</span></p>
          <p className="text-xs text-gray-600 mt-1">© 2026 Musify</p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} />}
    </>
  );
};

export default MobileSidebar;