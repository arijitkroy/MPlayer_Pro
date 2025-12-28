import { usePlayer } from "../context/PlayerContext";

export default function MobileNowPlaying({ open, onClose }) {
  const { track, nextTrack, prevTrack, isPlaying, togglePlay } = usePlayer();

  if (!open || !track) return null;

  return (
    <div className="
      fixed inset-0 bg-black z-[9999]
      flex flex-col
    ">
      <div className="p-4 flex justify-between">
        <span></span>
        <button onClick={onClose} className="text-gray-400 text-xl">✖</button>
      </div>

      <div className="flex justify-center mt-6">
        <img
          src={track.album_image || "/music.png"}
          className="w-64 h-64 rounded-xl shadow-lg"
        />
      </div>

      <div className="mt-6 text-center px-6">
        <h2 className="text-white text-xl font-bold truncate">{track.name}</h2>
        <p className="text-gray-400">{track.artist_name}</p>
      </div>

      <div className="flex justify-center gap-8 text-3xl mt-10">
        <button onClick={prevTrack}>⏮️</button>
        <button onClick={togglePlay}>
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        <button onClick={nextTrack}>⏭️</button>
      </div>
    </div>
  );
}