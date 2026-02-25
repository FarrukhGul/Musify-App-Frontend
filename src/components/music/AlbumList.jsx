import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ALBUM_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='%23282828'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E";

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getAlbums();
      console.log('Fetched albums:', data);
      setAlbums(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Fetch albums error:', err);
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

  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-spotify-gray mb-4">No albums available</p>
        {user?.role === 'artist' && (
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
      <h1 className="text-3xl font-bold mb-8">Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {albums.map((album) => (
          <Link
            key={album._id}
            to={`/albums/${album._id}`}
            className="bg-spotify-dark p-4 rounded-lg hover:bg-spotify-light transition group"
          >
            <img
              src={album.coverImage || ALBUM_PLACEHOLDER}
              alt={album.title}
              className="w-full aspect-square object-cover rounded-md mb-4"
              onError={(e) => {
                e.target.src = ALBUM_PLACEHOLDER;
              }}
            />
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-spotify-gray truncate">
              {typeof album.artist === 'object'
                ? (album.artist?.username || 'Unknown Artist')
                : (album.artist || 'Unknown Artist')
              }
            </p>
            <p className="text-xs text-spotify-gray mt-2">
              {album.musics?.length || 0} tracks
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;