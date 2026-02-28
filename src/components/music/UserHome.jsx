import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { FiMusic, FiDisc, FiPlay, FiPause, FiTrendingUp, FiClock, FiUsers, FiHeadphones } from 'react-icons/fi';

const CoverPlaceholder = ({ title }) => {
  const colors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-orange-500',
    'from-pink-500 to-rose-500',
  ];
  const index = title ? title.charCodeAt(0) % colors.length : 0;
  return (
    <div className={`w-full aspect-square rounded-xl mb-2 bg-gradient-to-br ${colors[index]} flex items-center justify-center`}>
      <FiMusic size={24} className="text-white opacity-80" />
    </div>
  );
};

const UserHome = () => {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [recentMusic, setRecentMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [stats, setStats] = useState({ totalTracks: 0, totalAlbums: 0, totalArtists: 0 });

  useEffect(() => {
    fetchUserData();
    loadRecentlyPlayed();
  }, []);

  useEffect(() => {
    if (currentTrack) addToRecentlyPlayed(currentTrack);
  }, [currentTrack]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [musicData, albumsData] = await Promise.all([
        musicAPI.getAllMusic(),
        musicAPI.getAlbums()
      ]);
      const music = Array.isArray(musicData) ? musicData : [];
      const albumsList = Array.isArray(albumsData) ? albumsData : [];
      setRecentMusic(music.slice(0, 6));
      setAlbums(albumsList.slice(0, 4));
      const uniqueArtists = new Set();
      music.forEach(track => {
        const artistId = typeof track.artist === 'object' ? track.artist?._id : track.artist;
        if (artistId) uniqueArtists.add(artistId);
      });
      setStats({ totalTracks: music.length, totalAlbums: albumsList.length, totalArtists: uniqueArtists.size });
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentlyPlayed = () => {
    const saved = localStorage.getItem('recentlyPlayed');
    if (saved) {
      try { setRecentlyPlayed(JSON.parse(saved)); } catch (e) { console.log(e); }
    }
  };

  const addToRecentlyPlayed = (track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t._id !== track._id);
      const updated = [track, ...filtered].slice(0, 10);
      localStorage.setItem('recentlyPlayed', JSON.stringify(updated));
      return updated;
    });
  };

  const handlePlayTrack = (track, trackList) => playTrack(track, trackList);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 px-4 sm:px-0">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-spotify-green/20 to-blue-600/10 border border-spotify-green/20 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-4">
          {/* ✅ Profile Pic */}
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-spotify-green shadow-lg flex-shrink-0"
            />
          ) : (
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-spotify-green to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0">
              {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-gray-400 text-xs sm:text-sm">Welcome back,</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{user?.username || 'Music Lover'}!</h1>
            <div className="flex items-center gap-2 mt-1">
              <FiHeadphones size={12} className="text-spotify-green flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">Ready to discover new music?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/10 transition">
          <FiMusic size={16} className="text-spotify-green mx-auto mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalTracks}</p>
          <p className="text-gray-400 text-xs">Tracks</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/10 transition">
          <FiDisc size={16} className="text-spotify-green mx-auto mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalAlbums}</p>
          <p className="text-gray-400 text-xs">Albums</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-center hover:bg-white/10 transition">
          <FiUsers size={16} className="text-spotify-green mx-auto mb-1 sm:mb-2" />
          <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalArtists}</p>
          <p className="text-gray-400 text-xs">Artists</p>
        </div>
      </div>

      {/* Recent Tracks */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <FiTrendingUp size={16} className="text-spotify-green" />
            <span>Recent Tracks</span>
          </h2>
          <Link to="/music" className="text-xs sm:text-sm text-spotify-green hover:underline flex items-center gap-1">View all →</Link>
        </div>
        {recentMusic.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FiMusic size={32} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No music available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {recentMusic.map((track) => (
              <div key={track._id}
                className="bg-white/5 border border-white/10 p-2 sm:p-3 rounded-xl hover:bg-white/10 hover:border-spotify-green/30 transition-all duration-300 group cursor-pointer"
                onClick={() => handlePlayTrack(track, recentMusic)}
              >
                <div className="relative">
                  {track.coverImage ? (
                    <img src={track.coverImage} alt={track.title} className="w-full aspect-square object-cover rounded-lg mb-2"/>
                  ) : (
                    <CoverPlaceholder title={track.title} />
                  )}
                  <button className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 bg-spotify-green rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-spotify-green/40 hover:scale-110">
                    {currentTrack?._id === track._id && isPlaying
                      ? <FiPause size={12} className="text-black" />
                      : <FiPlay size={12} className="text-black ml-0.5" />
                    }
                  </button>
                </div>
                <h3 className="font-semibold text-xs sm:text-sm truncate text-white">{track.title}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {typeof track.artist === 'object' ? track.artist?.username : track.artist || 'Unknown Artist'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Albums */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold flex items-center space-x-2">
            <FiDisc size={16} className="text-spotify-green" />
            <span>Popular Albums</span>
          </h2>
          <Link to="/albums" className="text-xs sm:text-sm text-spotify-green hover:underline flex items-center gap-1">View all →</Link>
        </div>
        {albums.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <FiDisc size={32} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No albums available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {albums.map((album) => (
              <Link key={album._id} to={`/albums/${album._id}`}
                className="bg-white/5 border border-white/10 p-2 sm:p-3 rounded-xl hover:bg-white/10 hover:border-spotify-green/30 transition-all duration-300 group"
              >
                {album.coverImage ? (
                  <img src={album.coverImage} alt={album.title} className="w-full aspect-square object-cover rounded-lg mb-2"/>
                ) : (
                  <CoverPlaceholder title={album.title} />
                )}
                <h3 className="font-semibold text-xs sm:text-sm truncate text-white">{album.title}</h3>
                <p className="text-xs text-gray-400 truncate">
                  {typeof album.artist === 'object' ? album.artist?.username : album.artist || 'Unknown Artist'}
                </p>
                <p className="text-xs text-spotify-green mt-1">{album.musics?.length || 0} tracks</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recently Played */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FiClock size={16} className="text-spotify-green flex-shrink-0" />
          <h2 className="text-lg font-bold">Recently Played</h2>
        </div>
        {recentlyPlayed.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">Start listening to see your recently played tracks here!</p>
        ) : (
          <div className="space-y-2">
            {recentlyPlayed.slice(0, 5).map((track, index) => (
              <div key={`${track._id}-${index}`}
                onClick={() => handlePlayTrack(track, [track])}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <span className="text-xs text-gray-500 w-5 flex-shrink-0">{index + 1}</span>
                  {track.coverImage ? (
                    <img src={track.coverImage} alt={track.title} className="w-8 h-8 rounded object-cover flex-shrink-0"/>
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-spotify-green/30 to-blue-500/30 rounded flex-shrink-0 flex items-center justify-center">
                      <FiMusic size={12} className="text-spotify-green" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-white truncate">{track.title}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {typeof track.artist === 'object' ? track.artist?.username : track.artist}
                    </p>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 text-spotify-green">
                  <FiPlay size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;