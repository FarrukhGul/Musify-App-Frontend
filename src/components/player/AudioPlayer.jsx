import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../hooks/usePlayer';
import { useAuth } from '../../hooks/useAuth';

import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiVolume1 } from 'react-icons/fi';

const TrackCover = ({ track, isPlaying, size = 'md' }) => {
  const cls = size === 'sm' ? 'w-10 h-10' : 'w-12 h-12';
  if (!track) return null;

  return (
    <>
      <style>{`
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes coverFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%     { transform: translateY(-2px) scale(1.04); }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 8px rgba(30,215,96,0.3), 0 0 0 2px rgba(30,215,96,0.15); }
          50%     { box-shadow: 0 0 22px rgba(30,215,96,0.65), 0 0 0 3px rgba(30,215,96,0.4); }
        }
        @keyframes orbPulse {
          0%,100% { opacity: 0.5; transform: scale(1); }
          50%     { opacity: 1; transform: scale(1.15); }
        }
        @keyframes barBounce1 { 0%,100%{height:3px}  50%{height:13px} }
        @keyframes barBounce2 { 0%,100%{height:10px} 50%{height:4px}  }
        @keyframes barBounce3 { 0%,100%{height:6px}  50%{height:15px} }
        @keyframes barBounce4 { 0%,100%{height:13px} 50%{height:4px}  }

        .tc-float  { animation: coverFloat 2.5s ease-in-out infinite, glowPulse 2s ease-in-out infinite; }
        .tc-vinyl  { animation: vinylSpin 3s linear infinite; }
        .tc-orb    { animation: orbPulse 2s ease-in-out infinite; }
        .tc-orb2   { animation: orbPulse 2s ease-in-out infinite 1s; }
        .tc-bar1   { animation: barBounce1 0.70s ease-in-out infinite; }
        .tc-bar2   { animation: barBounce2 0.60s ease-in-out infinite 0.10s; }
        .tc-bar3   { animation: barBounce3 0.80s ease-in-out infinite 0.05s; }
        .tc-bar4   { animation: barBounce4 0.65s ease-in-out infinite 0.15s; }
      `}</style>

      <div className={`relative flex-shrink-0 ${cls}`}>
        {/* Spinning vinyl ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-500 ${isPlaying ? 'tc-vinyl border-spotify-green/50 opacity-100' : 'border-transparent opacity-0'}`}
          style={{ inset: '-5px' }}
        />
        {/* Second slower ring */}
        <div
          className={`absolute rounded-full border border-spotify-green/20 transition-all duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
          style={{ inset: '-10px', animation: isPlaying ? 'vinylSpin 6s linear infinite reverse' : 'none' }}
        />

        {/* Cover */}
        <div className={`${cls} rounded-lg overflow-hidden relative transition-all duration-500 ${isPlaying ? 'tc-float' : ''}`}>
          {track.coverImage ? (
            <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            // ✅ Modern dark fallback — animated orbs, no external library
            <div
              className="w-full h-full flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #12122a 100%)' }}
            >
              {/* Green glow orb — top left */}
              <div
                className={`absolute rounded-full ${isPlaying ? 'tc-orb' : ''}`}
                style={{
                  width: '80%', height: '80%',
                  top: '-15%', left: '-15%',
                  background: 'radial-gradient(circle, rgba(30,215,96,0.25) 0%, transparent 70%)',
                }}
              />
              {/* Purple glow orb — bottom right */}
              <div
                className={`absolute rounded-full ${isPlaying ? 'tc-orb2' : ''}`}
                style={{
                  width: '70%', height: '70%',
                  bottom: '-15%', right: '-10%',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                }}
              />
              {/* Music note icon */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="relative z-10 text-white/40"
                style={{ width: size === 'sm' ? '14px' : '18px', height: size === 'sm' ? '14px' : '18px' }}
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          )}

          {/* Equalizer overlay when playing */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/45 rounded-lg flex items-end justify-center pb-1.5 gap-px">
              <div className="tc-bar1 w-1 bg-spotify-green rounded-sm" />
              <div className="tc-bar2 w-1 bg-emerald-400 rounded-sm" />
              <div className="tc-bar3 w-1 bg-spotify-green rounded-sm" />
              <div className="tc-bar4 w-1 bg-emerald-400 rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </>
  );
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
              <TrackCover track={currentTrack} isPlaying={isPlaying} />
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
            <TrackCover track={currentTrack} isPlaying={isPlaying} />
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