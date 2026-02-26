import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { FiUpload, FiMusic, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const UploadMusic = () => {
  const [formData, setFormData] = useState({ title: '', file: null });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Smooth animation for progress bar
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(uploadProgress), 50);
    return () => clearTimeout(timer);
  }, [uploadProgress]);

  // Fake progress animation while uploading (since ImageKit doesn't report real progress)
  useEffect(() => {
    let interval;
    if (uploading) {
      setUploadProgress(5);
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) { clearInterval(interval); return 85; }
          return prev + Math.random() * 8;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [uploading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      e.target.value = '';
      return;
    }
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a', 'audio/x-m4a'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload MP3, WAV, or M4A files');
      e.target.value = '';
      return;
    }
    setFormData({ ...formData, file });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);
    setAnimatedProgress(0);

    if (!formData.file) return setError('Please select a file to upload');
    if (!formData.title.trim()) return setError('Please enter a track title');

    setUploading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('music', formData.file);

    try {
      await musicAPI.uploadMusic(data);
      setUploadProgress(100);
      setSuccess('Track uploaded successfully!');
      setFormData({ title: '', file: null });
      e.target.reset();
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      if (err.code === 'ERR_NETWORK') setError('Network error. Please check your connection.');
      else if (err.response?.status === 413) setError('File too large. Maximum size is 50MB.');
      else if (err.response?.status === 415) setError('Unsupported file type.');
      else if (err.response?.status === 500) setError('Server error. Please try again later.');
      else setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
      setAnimatedProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-2">Upload Music</h1>
      <p className="text-gray-400 mb-8 text-sm">Share your tracks with the world</p>

      {/* Artist Badge */}
      {user && (
        <div className="mb-6 p-3 bg-white/5 border border-white/10 rounded-xl text-sm flex items-center space-x-2">
          <div className="w-7 h-7 bg-spotify-green/20 rounded-full flex items-center justify-center text-spotify-green font-bold text-xs">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-400">Uploading as <span className="text-white font-medium">{user.email}</span></span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Error */}
        {error && (
          <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
            <FiAlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl">
            <FiCheckCircle size={18} className="flex-shrink-0" />
            <p className="text-sm">{success}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Track Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={uploading}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent disabled:opacity-50 transition"
            placeholder="Enter track title..."
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Audio File</label>
          <label
            htmlFor="file"
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
              formData.file
                ? 'border-spotify-green/50 bg-spotify-green/5'
                : 'border-white/10 bg-white/5 hover:border-spotify-green/30 hover:bg-white/10'
            } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col items-center space-y-3">
              {formData.file ? (
                <>
                  <div className="w-12 h-12 bg-spotify-green/20 rounded-full flex items-center justify-center">
                    <FiMusic size={22} className="text-spotify-green" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium text-sm truncate max-w-[250px]">{formData.file.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{(formData.file.size / (1024*1024)).toFixed(2)} MB</p>
                  </div>
                  <p className="text-spotify-green text-xs">✓ File selected — click to change</p>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                    <FiUpload size={22} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white text-sm font-medium">Click to upload audio</p>
                    <p className="text-gray-500 text-xs mt-1">MP3, WAV, M4A — max 50MB</p>
                  </div>
                </>
              )}
            </div>
            <input
              id="file"
              type="file"
              accept="audio/*"
              className="sr-only"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-spotify-green rounded-full animate-ping"></span>
                <span>Uploading track...</span>
              </span>
              <span className="text-spotify-green font-medium">{Math.round(animatedProgress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-spotify-green to-emerald-400 transition-all duration-500 ease-out relative"
                style={{ width: `${animatedProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading || !formData.file || !formData.title.trim()}
          className="w-full py-3 px-4 bg-spotify-green text-black font-semibold rounded-xl hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-spotify-green disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-spotify-green/20"
        >
          {uploading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>Uploading...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <FiUpload size={16} />
              <span>Upload Track</span>
            </span>
          )}
        </button>

        {/* Tips */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <h3 className="text-sm font-semibold text-white mb-3">Upload Tips</h3>
          <ul className="text-xs text-gray-400 space-y-1.5">
            <li className="flex items-center space-x-2"><span className="text-spotify-green">•</span><span>MP3, WAV, or M4A format only</span></li>
            <li className="flex items-center space-x-2"><span className="text-spotify-green">•</span><span>Maximum file size is 50MB</span></li>
            <li className="flex items-center space-x-2"><span className="text-spotify-green">•</span><span>Use high-quality audio for best results</span></li>
            <li className="flex items-center space-x-2"><span className="text-spotify-green">•</span><span>Add a descriptive title for your track</span></li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default UploadMusic;