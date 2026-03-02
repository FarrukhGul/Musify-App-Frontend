import React, { useState, useEffect } from 'react';
import { musicAPI } from '../../services/api';
import { usePlayer } from '../../hooks/usePlayer';
import { GradientCover } from '../../utils/gradients.jsx';
import { FiPlay, FiPause, FiHeart } from 'react-icons/fi';
import BackButton from '../layout/BackButton';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      const data = await musicAPI.getLikedSongs();
      setLikedSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch liked songs:', err);
    } finally {
      setLoading(false);
    }
  };

  const unlikeSong = async (e, trackId) => {
    e.stopPropagation();
    try {
      await musicAPI.unlikeMusic(trackId);
      setLikedSongs(prev => prev.filter(s => s._id !== trackId));
    } catch (err) {
      console.error('Unlike failed:', err);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track, likedSongs);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <BackButton />

      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-spotify-green to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-spotify-green/30">
          <FiHeart size={28} className="text-black fill-black" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Liked Songs</h1>
          <p className="text-gray-400 text-sm">{likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {likedSongs.length === 0 ? (
        <div className="text-center py-16">
          <FiHeart size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No liked songs yet</p>
          <p className="text-sm text-gray-500 mt-1">Press ❤️ on any song to save it here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {likedSongs.map((track) => (
            <div
              key={track._id}
              className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer hover:shadow-xl hover:shadow-black/30"
              onClick={() => handlePlayTrack(track)}
            >
              <div className="relative">
                {track.coverImage ? (
                  <img src={track.coverImage} alt={track.title}
                    className="w-full aspect-square object-cover rounded-xl mb-4" />
                ) : (
                  <GradientCover title={track.title} />
                )}

                {/* Unlike button */}
                <button
                  onClick={(e) => unlikeSong(e, track._id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                >
                  <FiHeart size={15} className="text-spotify-green fill-spotify-green" />
                </button>

                {/* Play button */}
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
      )}
    </div>
  );
};

export default LikedSongs;