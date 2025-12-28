import { usePlayer } from "../context/PlayerContext";

export default function MiniPlayer({ onExpand }) {
  const { track, isPlaying } = usePlayer();

  if (!track) return null;

  return (
    <div
      className="
      fixed bottom-16 left-0 right-0 sm:hidden
      bg-[#181818] border-t border-white/10
      h-14 flex items-center px-3 gap-3
      z-999
      "
      onClick={onExpand}
    >
      <img
        src={track.album_image || "/music.png"}
        className="w-10 h-10 rounded"
      />

      <div className="flex-1">
        <div className="text-white text-sm truncate">{track.name}</div>
        <div className="text-gray-400 text-xs truncate">{track.artist_name}</div>
      </div>

      {isPlaying ? "⏸️" : "▶️"}
    </div>
  );
}