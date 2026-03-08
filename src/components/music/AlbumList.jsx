import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { musicAPI } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { GradientCover } from '../../utils/gradients.jsx';
import BackButton from '../layout/BackButton';
import { MdDelete } from "react-icons/md";
import DeleteConfirmModal from './DeleteConfirmModal';
import { usePlayer } from '../../hooks/usePlayer';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

   const { clearTrack } = usePlayer();

  const { user } = useAuth();

  // ✅ Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: '' });

  const handleDeleteClick = (e, album) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteModal({ open: true, id: album._id, title: album.title });
  };

const handleDeleteConfirm = async () => {
    const id = deleteModal.id;
    const albumToDelete = albums.find(a => a._id === id); // ← album dhundo
    setDeleteModal({ open: false, id: null, title: '' });
    setDeletingId(id);
    try {
      await musicAPI.deleteAlbum(id);
      
      // ← album ke har track ko clear karo player se
      albumToDelete?.musics?.forEach(track => {
        clearTrack(track._id || track);
      });

      setTimeout(() => {
        setAlbums(prev => prev.filter(album => album._id !== id));
        setDeletingId(null);
      }, 400);
    } catch (e) {
      console.log(e);
      setDeletingId(null);
    }
};

  const handleDeleteCancel = () => {
    setDeleteModal({ open: false, id: null, title: '' });
  };

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

      if (user?.role === 'artist') {
        const currentUserId = user?._id || user?.id;

        if (!currentUserId) {
          setAlbums([]);
          return;
        }

        const filtered = allAlbums.filter(album => {
          let albumArtistId;
          if (typeof album.artist === 'object') {
            albumArtistId = album.artist?._id || album.artist?.id;
          } else {
            albumArtistId = album.artist;
          }
          return albumArtistId?.toString() === currentUserId?.toString();
        });

        setAlbums(filtered);
      } else {
        setAlbums(allAlbums);
      }

      setError('');
    } catch (err) {
      console.log(err);
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
      <style>{`
        @keyframes albumFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes albumFadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.88) translateY(10px); }
        }
        .album-card { animation: albumFadeIn 0.35s ease forwards; }
        .album-card-deleting {
          animation: albumFadeOut 0.4s ease forwards;
          pointer-events: none;
        }
      `}</style>

      {/* ✅ Delete Confirm Modal */}
      <DeleteConfirmModal
        key={deleteModal.id}
        open={deleteModal.open}
        title={deleteModal.title}
        type="album"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <BackButton />
      <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold mb-8">
        {user?.role === 'artist' ? 'My Albums' : 'Albums'}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {albums.map((album, index) => (
          <div
            key={album._id}
            className={`relative group ${deletingId === album._id ? 'album-card-deleting' : 'album-card'}`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {/* Delete button — outside Link, artists only */}
            {user?.role === 'artist' && (
              <button
                onClick={(e) => handleDeleteClick(e, album)}
                title="Delete album"
                className="absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-red-400 hover:bg-red-500 hover:text-white hover:scale-110 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
              >
                <MdDelete size={16} />
              </button>
            )}

            {/*  Link wraps only the card */}
            <Link
              to={`/albums/${album._id}`}
              className="bg-white/5 border border-white/10 p-2.5 sm:p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 block"
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
              {user?.role === 'artist' && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-spotify-green/20 text-spotify-green text-xs rounded-full">
                  Your Album
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumList;