import React, { useState } from 'react';
import { PlayerContext } from '../context/PlayerContext';

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

const playTrack = (track, tracks = []) => {
    // ✅ Same track hai toh sirf toggle karo
    if (currentTrack?._id === track._id) {
      setIsPlaying(prev => !prev);
      return;
    }

    // Baaki sab same
    setCurrentTrack(track);
    if (tracks.length > 0) {
      const currentIndex = tracks.findIndex(t => t._id === track._id);
      if (currentIndex !== -1) {
        const newQueue = [
          ...tracks.slice(currentIndex + 1),
          ...tracks.slice(0, currentIndex)
        ];
        setQueue(newQueue);
      } else {
        setQueue([]);
      }
    } else {
      setQueue([]);
    }
    setIsPlaying(true);
  };
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };


const clearTrack = (trackId) => {
    if (currentTrack?._id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
      setQueue([]);
    }
};

  const playNext = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue(queue.slice(1));
      setIsPlaying(true);
    } else {
      console.log('No more tracks in queue');
    }
  };

  const playPrevious = () => {
    // You could implement history tracking here
    console.log('Previous track - not implemented');
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      queue,
      isPlaying,
      volume,
      playTrack,
      togglePlay,
      playNext,
      playPrevious,
      clearTrack, 
      setVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};