import React, { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userAPI } from '../../services/api';
import { FiUser, FiEdit2, FiCheckCircle, FiAlertCircle, FiCamera } from 'react-icons/fi';

const EditProfile = ({ onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(user?.profilePic || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      setError('Image too large. Max 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setProfilePicFile(file);
    setError('');

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setProfilePicPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('bio', formData.bio);
      if (profilePicFile) {
        data.append('profilePic', profilePicFile);
      }

      const updated = await userAPI.updateProfile(data);
      updateUser(updated);
      setSuccess('Profile updated!');
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl p-6 z-10">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <FiEdit2 size={20} className="text-spotify-green" />
          <span>Edit Profile</span>
        </h2>

        {/* Profile Pic Upload */}
        <div className="flex justify-center mb-6">
          <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {profilePicPreview ? (
              <img src={profilePicPreview} alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-spotify-green shadow-lg shadow-spotify-green/20" />
            ) : (
              <div className="w-24 h-24 bg-spotify-green rounded-full flex items-center justify-center text-black font-bold text-3xl shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Camera overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300">
              <FiCamera size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
              <FiCamera size={13} className="text-black" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-center text-xs text-gray-500 -mt-3 mb-5">Click to upload photo — Max 5MB</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              <FiAlertCircle size={16} /><span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm">
              <FiCheckCircle size={16} /><span>{success}</span>
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUser size={16} /></span>
              <input type="text" value={formData.username} required
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition text-sm"
                placeholder="Your username" />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
            <textarea value={formData.bio} rows={3}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition text-sm resize-none"
              placeholder="Tell us about yourself..." />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-xl hover:bg-white/10 transition text-sm">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-spotify-green text-black font-semibold rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all duration-300 text-sm">
              {saving ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Saving...</span>
                </span>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;