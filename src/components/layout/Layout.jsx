import React from 'react';
import Navbar from './Navbar';
import AudioPlayer from '../player/AudioPlayer'; 
import { usePlayer } from '../../hooks/usePlayer'; 

const Layout = ({ children }) => {
  console.log('Layout rendering with children:', children);
  const { currentTrack } = usePlayer();
  
  return (
    <div className="min-h-screen bg-spotify-black">
      <Navbar />
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        {children}
      </main>
      <AudioPlayer />
    </div>
  );
};

export default Layout;