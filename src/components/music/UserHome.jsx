import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { usePlayer } from '../../hooks/usePlayer';
import { FiMusic, FiDisc, FiPlay, FiPause, FiTrendingUp, FiClock, FiUsers, FiHeadphones, FiHeart, FiDownload } from 'react-icons/fi';

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

// ✅ Toast
const LikeToast = ({ song, visible }) => (
  <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
    <div className="flex items-center space-x-3 bg-black/70 border border-spotify-green/40 px-5 py-3 rounded-2xl shadow-2xl shadow-spotify-green/20 backdrop-blur-xl">
      <div className="w-8 h-8 bg-spotify-green/20 rounded-full flex items-center justify-center animate-pulse">
        <FiHeart size={16} className="text-spotify-green fill-spotify-green" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold truncate max-w-[180px]">{song}</p>
        <p className="text-spotify-green text-xs">Added to Liked Songs ✓</p>
      </div>
    </div>
  </div>
);

// ✅ Heart Flash
const HeartFlash = ({ visible }) => (
  <div className={`fixed inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
    <div className={`relative transition-all duration-500 ${visible ? 'scale-100' : 'scale-50'}`}>
      <FiHeart size={80} className="text-spotify-green fill-spotify-green drop-shadow-[0_0_30px_rgba(30,215,96,0.9)]" />
    </div>
  </div>
);

// ✅ Download Toast
const DownloadToast = ({ visible, title, progress }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-72 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
    <div className="bg-black/80 border border-white/20 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
          <FiDownload size={14} className="text-white animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{title}</p>
          <p className="text-gray-400 text-xs">
            {progress < 100 ? `Downloading... ${progress}%` : '✓ Download Complete!'}
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: progress < 100
              ? 'linear-gradient(90deg, #1ed760, #1db954)'
              : 'linear-gradient(90deg, #1ed760, #22d3ee)',
            boxShadow: '0 0 8px rgba(30,215,96,0.6)'
          }}
        />
      </div>
    </div>
  </div>
);

const UserHome = () => {
  const { user } = useAuth();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const [recentMusic, setRecentMusic] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [stats, setStats] = useState({ totalTracks: 0, totalAlbums: 0, totalArtists: 0 });
  const [likedSongs, setLikedSongs] = useState([]);
  const [toast, setToast] = useState({ visible: false, song: '' });
  const [heartFlash, setHeartFlash] = useState(false);
  const [downloading, setDownloading] = useState({ id: null, progress: 0 });

  useEffect(() => {
    fetchUserData();
    loadRecentlyPlayed();
  }, []);

  useEffect(() => {
    if (currentTrack) addToRecentlyPlayed(currentTrack);
  }, [currentTrack]);

  useEffect(() => {
    if (user) {
      musicAPI.getLikedSongs().then(data => {
        setLikedSongs(data.map(s => s._id));
      }).catch(() => { });
    }
  }, [user]);

  const toggleLike = async (e, track) => {
    e.stopPropagation();
    const isLiked = likedSongs.includes(track._id);

    // ✅ Optimistic update — pehle UI update, phir API
    if (isLiked) {
      setLikedSongs(prev => prev.filter(id => id !== track._id));
    } else {
      setLikedSongs(prev => [...prev, track._id]);
      setHeartFlash(true);
      setTimeout(() => setHeartFlash(false), 700);
      setToast({ visible: true, song: track.title });
      setTimeout(() => setToast({ visible: false, song: '' }), 2500);
    }

    try {
      if (isLiked) {
        await musicAPI.unlikeMusic(track._id);
      } else {
        await musicAPI.likeMusic(track._id);
      }
    } catch (err) {
      // API fail ho toh revert karo
      console.error('Like failed:', err);
      if (isLiked) {
        setLikedSongs(prev => [...prev, track._id]);
      } else {
        setLikedSongs(prev => prev.filter(id => id !== track._id));
      }
    }
  };

  const handleDownload = async (e, track) => {
    e.stopPropagation();
    if (downloading.id) return;
    try {
      setDownloading({ id: track._id, progress: 10 });

      const interval = setInterval(() => {
        setDownloading(prev => ({
          ...prev,
          progress: prev.progress < 85 ? prev.progress + 15 : prev.progress
        }));
      }, 300);

      const response = await musicAPI.downloadMusic(track._id);

      clearInterval(interval);
      setDownloading({ id: track._id, progress: 100 });

      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${track.title}.mp3`;
      document.body.appendChild(a); // Android ke liye zaroori
      a.click();
      document.body.removeChild(a);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);

      setTimeout(() => setDownloading({ id: null, progress: 0 }), 1500);
    } catch (err) {
      console.error('Download failed:', err);
      setDownloading({ id: null, progress: 0 });
    }
  };

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

      {/* Toast + Flash */}
      <LikeToast visible={toast.visible} song={toast.song} />
      <HeartFlash visible={heartFlash} />
      <DownloadToast
        visible={downloading.id !== null}
        title={recentMusic.find(t => t._id === downloading.id)?.title || ''}
        progress={downloading.progress}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-spotify-green/20 to-blue-600/10 border border-spotify-green/20 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center space-x-4">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-spotify-green shadow-lg flex-shrink-0" />
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
                    <img src={track.coverImage} alt={track.title} className="w-full aspect-square object-cover rounded-lg mb-2" />
                  ) : (
                    <CoverPlaceholder title={track.title} />
                  )}

                  {/* ✅ Heart button */}
                  <button
                    onClick={(e) => toggleLike(e, track)}
                    className="absolute top-1 right-1 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                  >
                    <FiHeart
                      size={12}
                      className={`transition-all duration-300 ${likedSongs.includes(track._id) ? 'text-spotify-green fill-spotify-green' : 'text-white'}`}
                    />
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={(e) => handleDownload(e, track)}
                    className="absolute top-2 left-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 hover:bg-white/20"
                  >
                    {downloading.id === track._id ? (
                      <svg className="animate-spin h-3.5 w-3.5 text-spotify-green" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <FiDownload size={15} className="text-white" />
                    )}
                  </button>

                  {/* Play button */}
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
                  <img src={album.coverImage} alt={album.title} className="w-full aspect-square object-cover rounded-lg mb-2" />
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
                    <img src={track.coverImage} alt={track.title} className="w-8 h-8 rounded object-cover flex-shrink-0" />
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