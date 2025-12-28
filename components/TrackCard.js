import { usePlayer } from "../context/PlayerContext";
import useFavorites from "../hooks/useFavorites";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdPlaylistAdd } from "react-icons/md";
import toast from "react-hot-toast";
import PlaylistModal from "./PlaylistModal";

export default function TrackCard({ track, tracks, index }) {
  const { playTrack, track: current, isPlaying } = usePlayer();

  const { addFavorite, removeFavorite, getFavorites } = useFavorites();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favLoading, setFavLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    (async () => {
      const favs = await getFavorites();
      setFavoriteIds(favs.map(f => f.id));
    })();
  }, []);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (favLoading) return;

    setFavLoading(true);

    if (favoriteIds.includes(track.id)) {
      await removeFavorite(track.id);
      setFavoriteIds(prev => prev.filter(id => id !== track.id));
      toast("Removed from favorites ❌");
    } else {
      await addFavorite(track);
      setFavoriteIds(prev => [...prev, track.id]);
      toast.success("Added to favorites ❤️");
    }

    setFavLoading(false);
  };

  return (
    <div
      className="relative rounded-xl bg-[#181818]/70 backdrop-blur-md border border-white/10
      p-4 cursor-pointer transition-all duration-300 group 
      hover:bg-[#222222]/80 hover:shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:scale-[1.02]"
    >
      <div className="relative">
        <img
          src={track.album_image || track.image || "/music.png"}
          className="rounded w-full h-32 sm:h-40 md:h-44 object-cover"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            playTrack(tracks, index);
          }}
          className="
            absolute bottom-3 right-3 bg-green-500 text-black rounded-full 
            h-10 w-10 flex sm:hidden items-center justify-center
            transition-all duration-300 shadow-lg hover:scale-105
            "
        >
          ▶
        </button>
        <button
            onClick={(e) => {
                e.stopPropagation();
                playTrack(tracks, index);
            }}
            className="
            absolute bottom-3 right-3 bg-green-500 text-black rounded-full 
            h-10 w-10 hidden sm:group-hover:flex items-center justify-center
            transition-all duration-300 shadow-lg hover:scale-105
            "
            >
            ▶
        </button>

        {current?.id === track.id && isPlaying && (
          <div className="absolute bottom-3 left-3 flex gap-0.75">
            <span className="w-1 h-4 bg-green-500 animate-eq1"></span>
            <span className="w-1 h-6 bg-green-500 animate-eq2"></span>
            <span className="w-1 h-3 bg-green-500 animate-eq3"></span>
          </div>
        )}
      </div>

      <div className="mt-3 font-semibold truncate text-white">
        {track.name}
      </div>

      <div className="text-gray-400 text-sm truncate">
        {track.artist_name}
      </div>

        <div className="mt-3 flex justify-between items-center gap-4">
            <button
                onClick={toggleFavorite}
                className={`flex items-center gap-2 transition 
                ${favoriteIds.includes(track.id)
                    ? "text-green-400 drop-shadow-[0_0_6px_#22c55e]"
                    : "text-gray-400 hover:text-pink-500"}
                ${favLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                title={
                favoriteIds.includes(track.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"
                }
            >
                {favLoading ? (
                <span className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin"></span>
                ) : favoriteIds.includes(track.id) ? (
                <FaHeart className="animate-scale" />
                ) : (
                <FaRegHeart />
                )}
            </button>

            <button
                onClick={(e) => {
                e.stopPropagation();
                setShowPlaylistModal(true);
                }}
                className="inline-flex items-center gap-2 whitespace-nowrap 
                        text-gray-300 hover:text-green-400 hover:scale-105
                        transition duration-200"
            >
                <MdPlaylistAdd size={22} className="drop-shadow-sm" />
                <span className="text-sm">Add to Playlist</span>
            </button>

            </div>

        {showPlaylistModal && (
        <PlaylistModal
            track={track}
            onClose={() => setShowPlaylistModal(false)}
        />
        )}
    </div>
  );
}