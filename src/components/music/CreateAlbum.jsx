import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const MUSIC_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='%23282828'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const CreateAlbum = () => {
  const [formData, setFormData] = useState({
    title: '',
    musics: [],
  });
  const [availableTracks, setAvailableTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'artist') {
      fetchMyMusic();
    }
  }, [user]);

  const fetchMyMusic = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getMyMusic();
      setAvailableTracks(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Fetch my music error:', err);
      setError('Failed to load your music');
      setAvailableTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSelection = (trackId) => {
    setFormData(prev => {
      const newMusics = prev.musics.includes(trackId)
        ? prev.musics.filter(id => id !== trackId)
        : [...prev.musics, trackId];
      return { ...prev, musics: newMusics };
    });
  };

  const handleSelectAll = () => {
    if (filteredTracks.length === formData.musics.length) {
      setFormData({ ...formData, musics: [] });
    } else {
      setFormData({ ...formData, musics: filteredTracks.map(t => t._id) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await musicAPI.createAlbum(formData);
      setSuccess('Album created successfully!');
      setTimeout(() => navigate('/albums'), 2000);
    } catch (err) {
      console.error('Create album error:', err);
      setError(err.response?.data?.message || 'Failed to create album');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTracks = availableTracks.filter(track =>
    track.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Create New Album</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}
        
        <div className="bg-spotify-dark rounded-lg p-4 sm:p-6">
          <label htmlFor="title" className="block text-sm font-medium text-spotify-gray mb-2">
            Album Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-3 bg-spotify-light border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
            placeholder="e.g., My Greatest Hits"
          />
        </div>

        <div className="bg-spotify-dark rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold">Select Tracks</h2>
            {availableTracks.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm text-spotify-green hover:text-spotify-green/80 transition"
              >
                {filteredTracks.length === formData.musics.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>
          
          {availableTracks.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your tracks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-spotify-light border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-spotify-green"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-spotify-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}
          
          {availableTracks.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-spotify-light rounded-lg">
              <p className="text-spotify-gray mb-4">You haven't uploaded any tracks yet.</p>
              <a
                href="/upload"
                className="inline-block px-6 py-2 bg-spotify-green text-white rounded-lg hover:bg-spotify-green/80 transition"
              >
                Upload Your First Track
              </a>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-8 bg-spotify-light rounded-lg">
              <p className="text-spotify-gray">No tracks match your search.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {filteredTracks.map((track) => (
                  <div key={track._id} className="relative">
                    <input
                      type="checkbox"
                      id={`track-${track._id}`}
                      checked={formData.musics.includes(track._id)}
                      onChange={() => handleTrackSelection(track._id)}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`track-${track._id}`}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                        formData.musics.includes(track._id) 
                          ? 'bg-spotify-green/20 border border-spotify-green' 
                          : 'bg-spotify-light hover:bg-spotify-light/80'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 transition ${
                        formData.musics.includes(track._id)
                          ? 'bg-spotify-green border-spotify-green'
                          : 'border-spotify-gray bg-transparent'
                      }`}>
                        {formData.musics.includes(track._id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        )}
                      </div>
                      <img
                        src={track.coverImage || MUSIC_PLACEHOLDER}
                        alt={track.title}
                        className="w-10 h-10 object-cover rounded mr-3"
                        onError={(e) => {
                          e.target.src = MUSIC_PLACEHOLDER;
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm sm:text-base">{track.title}</p>
                        <p className="text-xs text-spotify-gray">
                          {typeof track.artist === 'object' 
                            ? (track.artist?.username || 'You')
                            : (track.artist || 'You')
                          }
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-spotify-gray">
                  {formData.musics.length} of {availableTracks.length} track{availableTracks.length !== 1 ? 's' : ''} selected
                </span>
                {formData.musics.length > 0 && (
                  <span className="text-spotify-green">
                    ✓ Ready to create
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || formData.musics.length === 0 || !formData.title}
          className="w-full py-3 sm:py-4 px-4 bg-spotify-green text-white rounded-lg font-semibold hover:bg-spotify-green/80 focus:outline-none focus:ring-2 focus:ring-spotify-green disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting ? 'Creating Album...' : `Create Album with ${formData.musics.length} Track${formData.musics.length !== 1 ? 's' : ''}`}
        </button>
      </form>
    </div>
  );
};

export default CreateAlbum;