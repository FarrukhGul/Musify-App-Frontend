import React, { useState, useEffect } from 'react';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { GradientCover } from '../../utils/gradients.jsx';
import { FiPlay, FiSearch, FiUpload, FiX, FiHeart, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import BackButton from '../layout/BackButton';
import { MdDelete } from "react-icons/md";


//  Toast - top center  slide down
const LikeToast = ({ song, visible }) => (
  <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
    <div className="flex items-center space-x-3 bg-black/70 border border-spotify-green/40 px-5 py-3 rounded-2xl shadow-2xl shadow-spotify-green/20 backdrop-blur-xl">
      <div className="w-8 h-8 bg-spotify-green/20 rounded-full flex items-center justify-center animate-pulse">
        <FiHeart size={16} className="text-spotify-green fill-spotify-green" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold truncate max-w-[180px]">{song}</p>
        <p className="text-spotify-green text-xs">Added to Liked Songs ✓</p>
      </div>
    </div>
  </div>
);

// Heart Flash
const HeartFlash = ({ visible }) => (
  <div className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
    <div className={`relative transition-all duration-500 ${visible ? 'scale-100' : 'scale-50'}`}>
      <FiHeart size={80} className="text-spotify-green fill-spotify-green drop-shadow-[0_0_30px_rgba(30,215,96,0.9)]" />
    </div>
  </div>
);

// Download Toast
const DownloadToast = ({ visible, title, progress }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-72 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
    <div className="bg-black/80 border border-white/20 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <FiDownload size={14} className="text-white animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{title}</p>
          <p className="text-gray-400 text-xs">
            {progress < 100 ? `Downloading... ${progress}%` : '✓ Download Complete!'}
          </p>
        </div>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: progress < 100
              ? 'linear-gradient(90deg, #1ed760, #1db954)'
              : 'linear-gradient(90deg, #1ed760, #22d3ee)',
            boxShadow: '0 0 8px rgba(30,215,96,0.6)'
          }}
        />
      </div>
    </div>
  </div>
);

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [likedSongs, setLikedSongs] = useState([]);
  const [toast, setToast] = useState({ visible: false, song: '' });
  const [heartFlash, setHeartFlash] = useState(false);
  const [downloading, setDownloading] = useState({ id: null, progress: 0 });

  // ✅ Delete state — confirmId for two-step, deletingId for animation
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteMusic = async (id) => {
    // First click → confirm state
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
      return;
    }

    // Second click → delete
    try {
      setDeletingId(id);
      setConfirmId(null);
      await musicAPI.deleteMusic(id);
      setTimeout(() => {
        setMusic(prev => prev.filter(track => track._id !== id));
        setDeletingId(null);
      }, 400);
    } catch (e) {
      console.log(e);
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      musicAPI.getLikedSongs().then(data => {
        setLikedSongs(data.map(s => s._id));
      }).catch(() => { });
    }
  }, [user]);

  const toggleLike = async (e, track) => {
    e.stopPropagation();
    const isLiked = likedSongs.includes(track._id);

    if (isLiked) {
      setLikedSongs(prev => prev.filter(id => id !== track._id));
    } else {
      setLikedSongs(prev => [...prev, track._id]);
      setHeartFlash(true);
      setTimeout(() => setHeartFlash(false), 700);
      setToast({ visible: true, song: track.title });
      setTimeout(() => setToast({ visible: false, song: '' }), 2500);
    }

    try {
      if (isLiked) {
        await musicAPI.unlikeMusic(track._id);
      } else {
        await musicAPI.likeMusic(track._id);
      }
    } catch (err) {
      console.error('Like failed:', err);
      if (isLiked) {
        setLikedSongs(prev => [...prev, track._id]);
      } else {
        setLikedSongs(prev => prev.filter(id => id !== track._id));
      }
    }
  };

  const handleDownload = async (e, track) => {
    e.stopPropagation();
    if (downloading.id) return;
    try {
      setDownloading({ id: track._id, progress: 10 });

      const interval = setInterval(() => {
        setDownloading(prev => ({
          ...prev,
          progress: prev.progress < 85 ? prev.progress + 15 : prev.progress
        }));
      }, 300);

      const response = await musicAPI.downloadMusic(track._id);

      clearInterval(interval);
      setDownloading({ id: track._id, progress: 100 });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);

      const disposition = response.headers?.['content-disposition'] || '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `${track.title}.mp3`;

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      setTimeout(() => setDownloading({ id: null, progress: 0 }), 1500);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloading({ id: null, progress: 0 });
    }
  };

  useEffect(() => {
    if (user?.role === 'user') fetchMusic();
    else if (user?.role === 'artist') fetchMyMusic();
    else setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await musicAPI.searchMusic(searchTerm);
        setSearchResults(results);
      } catch (err) {
        console.log(err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 500);
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
      console.log(err);
      setError('Failed to load your music');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayMusic = () => {
    if (searchTerm && searchResults !== null) return searchResults;
    return music;
  };

  const handlePlayTrack = (track) => {
    playTrack(track, getDisplayMusic());
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  const displayMusic = getDisplayMusic();

  if (loading) return (
    <div className="flex justify-center items-center min-h-100">
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
    <div className="space-y-6">
      <style>{`
        @keyframes trackFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes trackFadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.92); }
        }
        @keyframes deleteShake {
          0%,100% { transform: translateX(0) rotate(0deg); }
          20%     { transform: translateX(-3px) rotate(-8deg); }
          40%     { transform: translateX(3px) rotate(8deg); }
          60%     { transform: translateX(-2px) rotate(-5deg); }
          80%     { transform: translateX(2px) rotate(5deg); }
        }
        @keyframes confirmPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%     { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes spinDelete {
          from { transform: rotate(0deg) scale(1.2); }
          to   { transform: rotate(360deg) scale(0); }
        }
        .track-card {
          animation: trackFadeIn 0.35s ease forwards;
        }
        .track-card-deleting {
          animation: trackFadeOut 0.4s ease forwards;
          pointer-events: none;
        }
        .delete-btn {
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .delete-btn:hover .delete-icon {
          animation: deleteShake 0.4s ease;
        }
        .delete-btn-confirm {
          animation: confirmPulse 0.8s ease infinite;
        }
        .delete-btn-deleting .delete-icon {
          animation: spinDelete 0.4s ease forwards;
        }
      `}</style>

      {/* Toast + Flash */}
      <LikeToast visible={toast.visible} song={toast.song} />
      <HeartFlash visible={heartFlash} />
      <DownloadToast
        visible={downloading.id !== null}
        title={displayMusic.find(t => t._id === downloading.id)?.title || ''}
        progress={downloading.progress}
      />

      <BackButton />

      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold">
          {user?.role === 'artist' ? 'My Tracks' : 'Your Musics'}
        </h1>
        <div className="relative w-full sm:w-80">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {searching ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <FiSearch size={16} />
            )}
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition text-sm"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && searchResults && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "<span className="text-white">{searchTerm}</span>"
          </p>
          <button onClick={clearSearch} className="text-xs text-spotify-green hover:underline">Clear search</button>
        </div>
      )}

      {/* No Search Results */}
      {searchTerm && searchResults && searchResults.length === 0 && !searching && (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-2">No results found for "{searchTerm}"</p>
          <p className="text-sm text-gray-500">Try different keywords or check your spelling</p>
        </div>
      )}

      {/* Music Grid */}
      {displayMusic.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {displayMusic.map((track, index) => (
            // ✅ Fix 1: outer div with relative, not the card itself
            <div
              key={track._id || track.id}
              className={`relative group ${deletingId === track._id ? 'track-card-deleting' : 'track-card'}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* ✅ Fix 2: Delete button OUTSIDE the clickable card, only for artists */}
              {user?.role === 'artist' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMusic(track._id);
                    }}
                    title={confirmId === track._id ? "Click again to confirm" : "Delete track"}
                    className={`
                      delete-btn absolute top-2 left-2 z-10
                      w-8 h-8 rounded-full flex items-center justify-center
                      opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                      ${confirmId === track._id
                        ? 'delete-btn-confirm bg-red-500 text-white scale-110'
                        : 'bg-black/60 text-red-400 hover:bg-red-500 hover:text-white hover:scale-110'
                      }
                      ${deletingId === track._id ? 'delete-btn-deleting' : ''}
                    `}
                  >
                    <span className="delete-icon flex items-center justify-center">
                      {confirmId === track._id ? '?' : <MdDelete size={16} />}
                    </span>
                  </button>

                  {/* Confirm tooltip */}
                  {confirmId === track._id && (
                    <div className="absolute top-11 left-2 z-20 bg-red-500 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap shadow-lg">
                      Click again to delete
                      <div className="absolute -top-1 left-3 w-2 h-2 bg-red-500 rotate-45" />
                    </div>
                  )}
                </>
              )}

              {/* ✅ Fix 3: Card content is the clickable area */}
              <div
                className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-black/30"
                onClick={() => handlePlayTrack(track)}
              >
                <div className="relative">
                  {track.coverImage ? (
                    <img src={track.coverImage} alt={track.title} className="w-full aspect-square object-cover rounded-xl mb-4" />
                  ) : (
                    <GradientCover title={track.title} />
                  )}

                  {/* Heart button */}
                  <button
                    onClick={(e) => toggleLike(e, track)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                  >
                    <FiHeart
                      size={15}
                      className={`transition-all duration-300 ${likedSongs.includes(track._id) ? 'text-spotify-green fill-spotify-green' : 'text-white'}`}
                    />
                  </button>

                  {/* Download button — only for users */}
                  {user?.role === 'user' && (
                    <button
                      onClick={(e) => handleDownload(e, track)}
                      className="absolute top-2 left-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 hover:bg-white/20"
                    >
                      {downloading.id === track._id ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-spotify-green" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <FiDownload size={15} className="text-white" />
                      )}
                    </button>
                  )}

                  {/* Play button */}
                  <button className="absolute bottom-6 right-2 w-11 h-11 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-spotify-green/40 hover:scale-110 hover:bg-emerald-400">
                    <FiPlay size={18} className="text-black ml-0.5" />
                  </button>
                </div>

                <h3 className="font-semibold truncate text-white">{track.title}</h3>
                <p className="text-sm text-gray-400 truncate mt-0.5">
                  {typeof track.artist === 'object'
                    ? (track.artist?.username || track.artist?.email || 'Unknown Artist')
                    : (track.artist || 'Unknown Artist')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MusicList;