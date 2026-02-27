import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { GradientCover } from '../../utils/gradients.jsx';
import { FiUpload, FiPlusCircle, FiMusic, FiDisc, FiPlay, FiPause } from 'react-icons/fi';

const ArtistHome = () => {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [myMusic, setMyMusic] = useState([]);
  const [myAlbums, setMyAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log('👤 User object:', user); // Debug log
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [music, albums] = await Promise.all([
        musicAPI.getMyMusic(),
        musicAPI.getAlbums()
      ]);
      
      setMyMusic(Array.isArray(music) ? music : []);
      
      // ✅ FIXED: Get user ID properly (could be _id or id)
      const allAlbums = Array.isArray(albums) ? albums : [];
      console.log('📀 All albums:', allAlbums);
      
      // Try both _id and id
      const currentUserId = user?._id || user?.id;
      console.log('🆔 Current user ID:', currentUserId);
      
      if (!currentUserId) {
        console.error('❌ No user ID found!');
        setMyAlbums([]);
        return;
      }
      
      const myAlbumsFiltered = allAlbums.filter(album => {
        // Get artist ID properly (could be nested or direct)
        let albumArtistId;
        if (typeof album.artist === 'object') {
          albumArtistId = album.artist?._id || album.artist?.id;
        } else {
          albumArtistId = album.artist;
        }
        
        // Convert to string for comparison
        const match = albumArtistId?.toString() === currentUserId?.toString();
        console.log(`🎵 Album "${album.title}" - Artist: ${albumArtistId}, Match: ${match}`);
        
        return match;
      });
      
      console.log('✅ Filtered albums:', myAlbumsFiltered);
      setMyAlbums(myAlbumsFiltered);
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-spotify-green/20 to-emerald-600/10 border border-spotify-green/20 rounded-2xl p-6">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <p className="text-gray-400 text-sm">Welcome back,</p>
            <h1 className="text-2xl font-bold text-white">{user?.username || user?.email}</h1>
            <span className="inline-block px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full border border-spotify-green/30 mt-1">
              Artist
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-spotify-green">{myMusic.length}</p>
            <p className="text-gray-400 text-sm mt-1">Tracks Uploaded</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-spotify-green">{myAlbums.length}</p>
            <p className="text-gray-400 text-sm mt-1">Albums Created</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/upload" className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-spotify-green/30 transition-all duration-300 group">
            <FiUpload size={24} className="text-spotify-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white">Upload Music</h3>
            <p className="text-gray-400 text-xs mt-1">Share a new track</p>
          </Link>
          <Link to="/create-album" className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-spotify-green/30 transition-all duration-300 group">
            <FiPlusCircle size={24} className="text-spotify-green mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white">Create Album</h3>
            <p className="text-gray-400 text-xs mt-1">Organize your tracks</p>
          </Link>
        </div>
      </div>

      {/* My Recent Tracks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FiMusic size={20} className="text-spotify-green" />
            <span>My Tracks</span>
          </h2>
          <Link to="/music" className="text-sm text-spotify-green hover:text-emerald-400 transition">View all →</Link>
        </div>

        {myMusic.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FiMusic size={32} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No tracks yet</p>
            <Link to="/upload" className="text-spotify-green text-sm hover:underline mt-2 inline-block">Upload your first track →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
            {myMusic.slice(0, 4).map((track) => (
              <div key={track._id}
                className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group cursor-pointer"

                onClick={() => playTrack(track, myMusic)}
              >
                <div className="relative">
                  {track.coverImage
                    ? <img src={track.coverImage} alt={track.title} className="w-full aspect-square object-cover rounded-xl mb-3"/>
                    : <GradientCover title={track.title} />
                  }
                  <button className="absolute bottom-5 right-2 w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-spotify-green/40">
                    {currentTrack?._id === track._id && isPlaying
                      ? <FiPause size={16} className="text-black" />
                      : <FiPlay size={16} className="text-black ml-0.5" />
                    }
                  </button>
                </div>
                <h3 className="font-semibold truncate text-white text-sm">{track.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Albums */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FiDisc size={20} className="text-spotify-green" />
            <span>My Albums</span>
          </h2>
          <Link to="/albums" className="text-sm text-spotify-green hover:text-emerald-400 transition">View all →</Link>
        </div>

        {myAlbums.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FiDisc size={32} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No albums yet</p>
            <Link to="/create-album" className="text-spotify-green text-sm hover:underline mt-2 inline-block">Create your first album →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myAlbums.slice(0, 4).map((album) => (
              <Link key={album._id} to={`/albums/${album._id}`}
                className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
              >
                <GradientCover title={album.title} />
                <h3 className="font-semibold truncate text-white text-sm mt-1">{album.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{album.musics?.length || 0} tracks</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistHome;