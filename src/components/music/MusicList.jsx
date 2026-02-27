import React, { useState, useEffect } from 'react';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { GradientCover } from '../../utils/gradients.jsx';
import { FiPlay, FiPause, FiSearch, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (user?.role === 'user') fetchMusic();
    else if (user?.role === 'artist') fetchMyMusic();
    else setLoading(false);
  }, [user]);

  // Debounced backend search
  useEffect(() => {
    if (!searchTerm.trim()) { setSearchResults(null); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await musicAPI.searchMusic(searchTerm);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getAllMusic();
      setMusic(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.response?.status === 403 ? 'No permission' : 'Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyMusic = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getMyMusic();
      setMusic(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.log(err)
      setError('Failed to load your music');
    } finally {
      setLoading(false);
    }
  };

  const displayMusic = searchResults !== null ? searchResults : music;

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg inline-block">{error}</div>
    </div>
  );

  if (music.length === 0) return (
    <div className="text-center py-12 space-y-4">
      <p className="text-gray-400">
        {user?.role === 'artist' ? "You haven't uploaded any tracks yet" : "No music available"}
      </p>
      {user?.role === 'artist' && (
        <Link to="/upload" className="inline-flex items-center space-x-2 px-5 py-2.5 bg-spotify-green text-black font-semibold rounded-xl hover:bg-emerald-400 transition">
          <FiUpload size={16} />
          <span>Upload your first track</span>
        </Link>
      )}
    </div>
  );

  return (
    <div>
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">
          {user?.role === 'artist' ? 'My Tracks' : 'Your Music'}
        </h1>
        <div className="relative w-full sm:w-72">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {searching
              ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              : <FiSearch size={16} />
            }
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition text-sm"
          />
        </div>
      </div>

      {/* No results */}
      {displayMusic.length === 0 && searchTerm && !searching && (
        <div className="text-center py-16 text-gray-400">
          No results for "<span className="text-white">{searchTerm}</span>"
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayMusic.map((track) => (
          <div
            key={track._id || track.id}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer hover:shadow-xl hover:shadow-black/30"
            onClick={() => playTrack(track, displayMusic)}
          >
            <div className="relative">
              {track.coverImage
                ? <img src={track.coverImage} alt={track.title} className="w-full aspect-square object-cover rounded-xl mb-4"/>
                : <GradientCover title={track.title} />
              }
              <button className="absolute bottom-6 right-2 w-11 h-11 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-spotify-green/40 hover:scale-110 hover:bg-emerald-400">
                {currentTrack?._id === track._id && isPlaying
                  ? <FiPause size={18} className="text-black" />
                  : <FiPlay size={18} className="text-black ml-0.5" />
                }
              </button>
            </div>
            <h3 className="font-semibold truncate text-white">{track.title}</h3>
            <p className="text-sm text-gray-400 truncate mt-0.5">
              {typeof track.artist === 'object'
                ? (track.artist?.username || track.artist?.email || 'Unknown Artist')
                : (track.artist || 'Unknown Artist')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;