import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth'; // Add this import

const UploadMusic = () => {
  const [formData, setFormData] = useState({
    title: '',
    file: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth(); // Add this to use user info

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size exceeds 50MB limit');
        e.target.value = '';
        return;
      }
      
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/m4a'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload MP3, WAV, or M4A files');
        e.target.value = '';
        return;
      }
      
      setFormData({
        ...formData,
        file: file,
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploadProgress(0);
    
    if (!formData.file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!formData.title.trim()) {
      setError('Please enter a track title');
      return;
    }

    setUploading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('music', formData.file);

    try {
      const response = await musicAPI.uploadMusic(data);
      setSuccess(`Music uploaded successfully! ${response.data?.message || ''}`);
      setFormData({ title: '', file: null });
      
      // Reset file input
      e.target.reset();
      
      // Navigate after a short delay
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      
      // Handle different error types
      if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 413) {
        setError('File too large. Maximum size is 50MB.');
      } else if (err.response?.status === 415) {
        setError('Unsupported file type. Please upload MP3, WAV, or M4A files.');
      } else if (err.response?.status === 500) {
        setError('Server error. The file upload service might be unavailable. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upload Music</h1>
      
      {/* Show artist info if available */}
      {user && (
        <div className="mb-4 p-3 bg-spotify-dark rounded-lg text-sm text-spotify-gray">
          Uploading as: <span className="text-white font-medium">{user.email}</span> ({user.role})
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded">
            <div className="font-medium">Error</div>
            <div className="text-sm mt-1">{error}</div>
            {error.includes('upload.imagekit.io') && (
              <div className="text-sm mt-2 bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-2 rounded">
                ⚠️ The upload service is currently unavailable. This is a backend issue. Please try again later or contact support.
              </div>
            )}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-spotify-gray mb-2">
            Track Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 bg-spotify-light border border-transparent rounded-md text-white focus:outline-none focus:ring-2 focus:ring-spotify-green disabled:opacity-50"
            placeholder="Enter track title"
            disabled={uploading}
          />
        </div>
        
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-spotify-gray mb-2">
            Audio File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-spotify-light border-dashed rounded-md hover:border-spotify-green transition">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-spotify-gray"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-spotify-gray">
                <label
                  htmlFor="file"
                  className="relative cursor-pointer rounded-md font-medium text-spotify-green hover:text-spotify-green/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-spotify-green"
                >
                  <span>Upload a file</span>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-spotify-gray">
                {formData.file ? formData.file.name : 'MP3, WAV, M4A up to 50MB'}
              </p>
            </div>
          </div>
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-spotify-gray">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-spotify-light rounded-full h-2">
              <div
                className="bg-spotify-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={uploading || !formData.file || !formData.title.trim()}
          className="w-full py-3 px-4 bg-spotify-green text-white rounded-md font-semibold hover:bg-spotify-green/80 focus:outline-none focus:ring-2 focus:ring-spotify-green disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {uploading ? 'Uploading...' : 'Upload Music'}
        </button>

        {/* Help section for artists */}
        <div className="mt-8 p-4 bg-spotify-dark rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Upload Tips:</h3>
          <ul className="text-sm text-spotify-gray space-y-1 list-disc list-inside">
            <li>Make sure your file is in MP3, WAV, or M4A format</li>
            <li>Maximum file size is 50MB</li>
            <li>Use high-quality audio for best results</li>
            <li>Add a descriptive title for your track</li>
          </ul>
          {error && error.includes('upload.imagekit.io') && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded">
              <p className="text-yellow-500 text-sm">
                🔧 The upload service is currently experiencing issues. This is a backend problem with ImageKit.
                Please try again later or contact the system administrator.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UploadMusic;