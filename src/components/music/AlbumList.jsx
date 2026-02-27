import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { musicAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { GradientCover } from '../../utils/gradients.jsx';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user]);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getAlbums();
      const allAlbums = Array.isArray(data) ? data : [];
      
      console.log('📀 All albums:', allAlbums);
      console.log('👤 Current user:', user);

      // ✅ FIXED: Proper filtering for artist
      if (user?.role === 'artist') {
        // Get user ID (could be _id or id)
        const currentUserId = user?._id || user?.id;
        console.log('🎯 Current user ID:', currentUserId);
        
        if (!currentUserId) {
          console.error('❌ No user ID found!');
          setAlbums([]);
          return;
        }

        const filtered = allAlbums.filter(album => {
          // Get artist ID properly
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
        
        console.log('✅ Filtered albums:', filtered);
        setAlbums(filtered);
      } else {
        // For regular users, show all albums
        setAlbums(allAlbums);
      }
      
      setError('');
    } catch (err) {
      console.error('❌ Fetch albums error:', err);
      setError('Failed to load albums');
      setAlbums([]);
    } finally {
      setLoading(false);
    }
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

  // ✅ Different empty states for user and artist
  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">
          {user?.role === 'artist' 
            ? "You haven't created any albums yet" 
            : "No albums available"}
        </p>
        {user?.role === "artist" && (
          <Link 
            to="/create-album" 
            className="inline-block px-6 py-2 bg-spotify-green text-white rounded-md hover:bg-spotify-green/80"
          >
            Create Your First Album
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        {user?.role === 'artist' ? 'My Albums' : 'Albums'}
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {albums.map((album) => (
          <Link
            key={album._id}
            to={`/albums/${album._id}`}
           className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
          >
            {album.coverImage ? (
              <img 
                src={album.coverImage} 
                alt={album.title} 
                className="w-full aspect-square object-cover rounded-xl mb-4"
              />
            ) : (
              <GradientCover title={album.title} />
            )}
            <h3 className="font-semibold truncate text-white">{album.title}</h3>
            <p className="text-sm text-gray-400 truncate">
              {typeof album.artist === "object"
                ? album.artist?.username || "Unknown Artist"
                : album.artist || "Unknown Artist"}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {album.musics?.length || 0} tracks
            </p>
            
            {/* Show "Your Album" badge for artist's own albums */}
            {user?.role === 'artist' && (
              <span className="inline-block mt-2 px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full">
                Your Album
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;