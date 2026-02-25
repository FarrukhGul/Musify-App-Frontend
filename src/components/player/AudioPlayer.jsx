import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';

const MUSIC_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='%23282828'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E";

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrevious,
    setVolume,
    volume,
  } = usePlayer(); // queue hata diya
  
  const { user } = useAuth();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);

  // Reset states when track changes - using useRef to prevent warning
  const prevTrackRef = useRef(null);
  
  useEffect(() => {
    if (currentTrack && currentTrack._id !== prevTrackRef.current?._id) {
      // Reset using a microtask to avoid the warning
      Promise.resolve().then(() => {
        setCurrentTime(0);
        setDuration(0);
        setError('');
        setIsReady(false);
      });
      
      if (audioRef.current) {
        audioRef.current.load();
      }
      prevTrackRef.current = currentTrack;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current && isReady) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error('Playback error:', e);
          setError('Failed to play audio');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
    setIsReady(true);
    setError('');
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    playNext();
  };

  // Agar user nahi ya currentTrack nahi to kuch mat dikhao
  if (!user || !currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-spotify-dark to-spotify-black border-t border-spotify-light px-4 py-3 z-50">
      <audio
        ref={audioRef}
        src={currentTrack.uri || currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={() => setError('Failed to load audio')}
        preload="auto"
      />
      
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="text-center text-red-500 text-sm mb-2">
            {error}
          </div>
        )}
        
        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <img
                src={currentTrack.coverImage || MUSIC_PLACEHOLDER}
                alt={currentTrack.title}
                className="w-12 h-12 object-cover rounded-md"
                onError={(e) => {
                  e.target.src = MUSIC_PLACEHOLDER;
                }}
              />
              <div>
                <h4 className="font-medium text-sm text-white line-clamp-1">{currentTrack.title}</h4>
                <p className="text-xs text-spotify-gray line-clamp-1">
                  {typeof currentTrack.artist === 'object'
                    ? (currentTrack.artist?.username || 'Unknown Artist')
                    : (currentTrack.artist || 'Unknown Artist')
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={playPrevious} className="text-spotify-gray hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-spotify-black hover:scale-105 transition"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button onClick={playNext} className="text-spotify-gray hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-spotify-gray w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-spotify-light rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-xs text-spotify-gray w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-4 w-1/4">
            <img
              src={currentTrack.coverImage || MUSIC_PLACEHOLDER}
              alt={currentTrack.title}
              className="w-12 h-12 object-cover rounded-md"
              onError={(e) => {
                e.target.src = MUSIC_PLACEHOLDER;
              }}
            />
            <div>
              <h4 className="font-medium text-sm">{currentTrack.title}</h4>
              <p className="text-xs text-spotify-gray">
                {typeof currentTrack.artist === 'object'
                  ? (currentTrack.artist?.username || 'Unknown Artist')
                  : (currentTrack.artist || 'Unknown Artist')
                }
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-center space-x-6 mb-2">
              <button onClick={playPrevious} className="text-spotify-gray hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-spotify-black hover:scale-105 transition"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6zm8 0h4v16h-4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button onClick={playNext} className="text-spotify-gray hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-spotify-gray w-10">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 bg-spotify-light rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
              <span className="text-xs text-spotify-gray w-10">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="w-1/4 flex justify-end">
            <div className="relative">
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="text-spotify-gray hover:text-white"
              >
                {volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>
              {showVolume && (
                <div className="absolute bottom-full mb-2 right-0 bg-spotify-light p-3 rounded-lg shadow-xl">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-spotify-gray rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;