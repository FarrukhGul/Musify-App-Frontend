import React, { useState, useEffect } from 'react';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { GradientCover } from '../../utils/gradients.jsx';
import { FiPlay, FiPause, FiUpload, FiPlusCircle } from 'react-icons/fi';

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (user?.role === 'user') fetchMusic();
    else setLoading(false);
  }, [user]);

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

  if (user?.role === 'artist') return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Welcome Artist!</h1>
      <p className="text-gray-400 mb-8">Upload your music and create albums to share with the world.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <a href="/upload" className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
          <FiUpload size={28} className="text-spotify-green mb-3 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-1">Upload Music</h2>
          <p className="text-gray-400 text-sm">Share your tracks with the world</p>
        </a>
        <a href="/create-album" className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 group">
          <FiPlusCircle size={28} className="text-spotify-green mb-3 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-1">Create Album</h2>
          <p className="text-gray-400 text-sm">Organize your tracks into albums</p>
        </a>
      </div>
    </div>
  );

  if (music.length === 0) return (
    <div className="text-center py-12">
      <p className="text-gray-400">No music available</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Music</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {music.map((track) => (
          <div
            key={track._id || track.id}
            className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer hover:shadow-xl hover:shadow-black/30"
            onClick={() => playTrack(track, music)}
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