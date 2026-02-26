import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';
import { getGradient } from '../../utils/gradients.jsx';

import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiVolume1 } from 'react-icons/fi';

// ← AudioPlayer se BAHAR
const TrackCover = ({ track, size = 'md' }) => {
  const cls = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  if (!track) return null;
  return track.coverImage
    ? <img src={track.coverImage} alt={track.title} className={`${cls} object-cover rounded-lg flex-shrink-0`} />
    : <div className={`${cls} rounded-lg bg-gradient-to-br ${getGradient(track.title)} flex items-center justify-center flex-shrink-0`}>
        <FiPlay size={size === 'sm' ? 12 : 14} className="text-white opacity-80" />
      </div>;
};

const AudioPlayer = () => {
  const { currentTrack, isPlaying, togglePlay, playNext, playPrevious, setVolume, volume } = usePlayer();
  const { user } = useAuth();
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [error, setError] = useState('');
  const [isReady, setIsReady] = useState(false);
  const prevTrackRef = useRef(null);

  useEffect(() => {
    if (currentTrack && currentTrack._id !== prevTrackRef.current?._id) {
      Promise.resolve().then(() => {
        setCurrentTime(0);
        setDuration(0);
        setError('');
        setIsReady(false);
      });
      if (audioRef.current) audioRef.current.load();
      prevTrackRef.current = currentTrack;
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current && isReady) {
      if (isPlaying) audioRef.current.play().catch(() => setError('Failed to play audio'));
      else audioRef.current.pause();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    return `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
  };

  const artistName = typeof currentTrack?.artist === 'object'
    ? (currentTrack?.artist?.username || 'Unknown')
    : (currentTrack?.artist || 'Unknown');

  const VolumeIcon = volume === 0 ? FiVolumeX : volume < 0.5 ? FiVolume1 : FiVolume2;

  if (!user || !currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] border-t border-white/10 px-4 py-3 z-50 backdrop-blur-md">
      <audio
        ref={audioRef}
        src={currentTrack.uri || currentTrack.audioUrl}
        onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => { setDuration(audioRef.current.duration); setIsReady(true); setError(''); }}
        onEnded={playNext}
        onError={() => setError('Failed to load audio')}
        preload="auto"
      />

      {error && <div className="text-center text-red-400 text-xs mb-1">{error}</div>}

      <div className="max-w-7xl mx-auto">

        {/* Mobile */}
        <div className="block md:hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <TrackCover track={currentTrack} />
              <div className="min-w-0">
                <h4 className="font-semibold text-sm text-white truncate">{currentTrack.title}</h4>
                <p className="text-xs text-gray-400 truncate">{artistName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 ml-3">
              <button onClick={playPrevious} className="text-gray-400 hover:text-white transition-colors">
                <FiSkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-spotify-green/30">
                {isPlaying ? <FiPause size={18} className="text-black" /> : <FiPlay size={18} className="text-black ml-0.5" />}
              </button>
              <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors">
                <FiSkipForward size={20} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 w-9 text-right">{formatTime(currentTime)}</span>
            <input type="range" min="0" max={duration || 0} value={currentTime}
              onChange={(e) => { const t = parseFloat(e.target.value); setCurrentTime(t); audioRef.current.currentTime = t; }}
              className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-spotify-green"
            />
            <span className="text-xs text-gray-500 w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center justify-between">
          {/* Track Info */}
          <div className="flex items-center space-x-3 w-1/4">
            <TrackCover track={currentTrack} />
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-gray-400 truncate">{artistName}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center justify-center space-x-6 mb-2">
              <button onClick={playPrevious} className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                <FiSkipBack size={20} />
              </button>
              <button onClick={togglePlay} className="w-11 h-11 bg-spotify-green rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-spotify-green/30 hover:bg-emerald-400">
                {isPlaying ? <FiPause size={20} className="text-black" /> : <FiPlay size={20} className="text-black ml-0.5" />}
              </button>
              <button onClick={playNext} className="text-gray-400 hover:text-white transition-colors hover:scale-110">
                <FiSkipForward size={20} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 w-9 text-right">{formatTime(currentTime)}</span>
              <input type="range" min="0" max={duration || 0} value={currentTime}
                onChange={(e) => { const t = parseFloat(e.target.value); setCurrentTime(t); audioRef.current.currentTime = t; }}
                className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-spotify-green"
              />
              <span className="text-xs text-gray-500 w-9">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="w-1/4 flex justify-end">
            <div className="relative flex items-center space-x-2">
              <button onClick={() => setShowVolume(!showVolume)} className="text-gray-400 hover:text-white transition-colors">
                <VolumeIcon size={20} />
              </button>
              {showVolume && (
                <div className="absolute bottom-full mb-3 right-0 bg-[#1a1a2e] border border-white/10 p-3 rounded-xl shadow-2xl">
                  <input type="range" min="0" max="1" step="0.01" value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-spotify-green"
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