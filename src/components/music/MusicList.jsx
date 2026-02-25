import React, { useState, useEffect } from 'react';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';

const MUSIC_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='%23282828'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const MusicList = () => {
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    if (user?.role === 'user') {
      fetchMusic();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getAllMusic();
      setMusic(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Fetch music error:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to view music');
      } else {
        setError('Failed to load music');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (track) => {
    console.log('Play track:', track);
    playTrack(track, music);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  if (user?.role === 'artist') {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome Artist!</h1>
        <p className="text-spotify-gray mb-8">
          This is the artist view. Regular users can see music here, but as an artist you can upload and manage your music.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <a
            href="/upload"
            className="bg-spotify-dark p-6 rounded-lg hover:bg-spotify-light transition"
          >
            <h2 className="text-xl font-semibold mb-2">Upload Music</h2>
            <p className="text-spotify-gray">Share your tracks with the world</p>
          </a>
          <a
            href="/create-album"
            className="bg-spotify-dark p-6 rounded-lg hover:bg-spotify-light transition"
          >
            <h2 className="text-xl font-semibold mb-2">Create Album</h2>
            <p className="text-spotify-gray">Organize your tracks into albums</p>
          </a>
        </div>
      </div>
    );
  }

  if (music.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-spotify-gray">No music available</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Music</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {music.map((track) => (
          <div
            key={track._id || track.id}
            className="bg-spotify-dark p-4 rounded-lg hover:bg-spotify-light transition group cursor-pointer"
            onClick={() => handlePlay(track)}
          >
            <div className="relative">
              <img
                src={track.coverImage || MUSIC_PLACEHOLDER}
                alt={track.title}
                className="w-full aspect-square object-cover rounded-md mb-4"
                onError={(e) => {
                  e.target.src = MUSIC_PLACEHOLDER;
                }}
              />
              <button className="absolute bottom-4 right-4 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg hover:scale-105">
                {currentTrack?._id === track._id && isPlaying ? (
                  <span className="text-white text-xl">⏸️</span>
                ) : (
                  <span className="text-white text-xl">▶</span>
                )}
              </button>
            </div>
            <h3 className="font-semibold truncate">{track.title}</h3>
            <p className="text-sm text-spotify-gray truncate">
              {/* Fix: Check if artist is an object or string */}
              {typeof track.artist === 'object' 
                ? (track.artist?.username || track.artist?.email || 'Unknown Artist')
                : (track.artist || 'Unknown Artist')
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicList;