import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AudioPlayer from '../player/AudioPlayer';
import { usePlayer } from '../../hooks/usePlayer';

const Layout = ({ children }) => {
  const { currentTrack } = usePlayer();

  return (
    <div className="min-h-screen bg-spotify-black flex flex-col">
      <Navbar />
      <main className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 ${currentTrack ? 'pb-28' : 'pb-8'}`}>
        {children}
      </main>
      <Footer />
      <AudioPlayer />
    </div>
  );
};

export default Layout;