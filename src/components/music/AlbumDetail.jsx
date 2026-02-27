import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { musicAPI } from "../../services/api";
import { usePlayer } from "../../hooks/usePlayer";
import { getGradient } from "../../utils/gradients.jsx";
import BackButton from '../layout/BackButton';

const ALBUM_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 24 24' fill='%23282828'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z'/%3E%3C/svg%3E";

const AlbumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { playTrack } = usePlayer();

  const fetchAlbum = useCallback(async () => {
    try {
      setLoading(true);
      const data = await musicAPI.getAlbum(id);
      setAlbum(data);
      setError("");
    } catch (err) {
      console.error("Fetch album error:", err);
      if (err.response?.status === 404) {
        setError("Album not found");
      } else if (err.response?.status === 403) {
        setError("You do not have permission to view this album");
      } else {
        setError("Failed to load album");
      }
      setAlbum(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const handlePlayTrack = (track) => {
    if (album?.musics) {
      playTrack(track, album.musics);
    }
  };

  const handlePlayAll = () => {
    if (album?.musics?.length > 0) {
      handlePlayTrack(album.musics[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-6 py-4 rounded-lg inline-block mb-4">
          {error || "Album not found"}
        </div>
        <div>
          <button
            onClick={() => navigate("/albums")}
            className="text-spotify-green hover:underline"
          >
            ← Back to Albums
          </button>
        </div>
      </div>
    );
  }

  const tracks = album.musics || album.tracks || [];

  return (
    <div className="px-4 sm:px-6">

      <BackButton />
      {/* Album Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <img
          src={
            album.coverImage ? (
              <img
                src={album.coverImage}
                alt={album.title}
                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-2xl"
              />
            ) : (
              <div
                className={`w-32 h-32 sm:w-48 sm:h-48 rounded-lg shadow-2xl bg-gradient-to-br ${getGradient(album.title)} flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className="w-16 h-16 text-white opacity-80"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.49 0-4.5-2.01-4.5-4.5S9.51 7.5 12 7.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm0-5.5c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                </svg>
              </div>
            )
          }
          alt={album.title}
          className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-2xl"
          onError={(e) => {
            e.target.src = ALBUM_PLACEHOLDER;
          }}
        />
        <div>
          <p className="text-sm text-spotify-green uppercase font-semibold">
            Album
          </p>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 mb-4">
            {album.title}
          </h1>
          <p className="text-sm sm:text-base text-spotify-gray">
            {typeof album.artist === "object"
              ? album.artist?.username || "Unknown Artist"
              : album.artist || "Unknown Artist"}{" "}
            • {tracks.length} track{tracks.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Play Button */}
      {tracks.length > 0 && (
        <button
          onClick={handlePlayAll}
          className="mb-8 px-6 sm:px-8 py-2 sm:py-3 bg-spotify-green text-white rounded-full font-semibold hover:bg-spotify-green/80 transition text-sm sm:text-base"
        >
          Play All
        </button>
      )}

      {/* Track List */}
      {tracks.length > 0 ? (
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track._id || track.id || index}
              className="flex items-center p-2 sm:p-3 rounded-md hover:bg-spotify-light group cursor-pointer transition"
              onClick={() => handlePlayTrack(track)}
            >
              <span className="w-6 sm:w-8 text-xs sm:text-sm text-spotify-gray group-hover:text-white">
                {index + 1}
              </span>
              <div className="flex-1 ml-2">
                <p className="font-medium text-sm sm:text-base text-white">
                  {track.title}
                </p>
                <p className="text-xs text-spotify-gray sm:hidden">
                  {typeof track.artist === "object"
                    ? track.artist?.username || "Unknown Artist"
                    : track.artist || "Unknown Artist"}
                </p>
              </div>
              <button className="opacity-0 group-hover:opacity-100 text-spotify-gray hover:text-white">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-spotify-gray py-8">
          No tracks in this album
        </p>
      )}
    </div>
  );
};

export default AlbumDetail;
