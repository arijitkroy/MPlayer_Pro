import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { FaBackward, FaForward, FaPlay, FaPause, FaRandom, FaRedo, FaVolumeUp } from "react-icons/fa";

export default function MobileNowPlaying({ open, onClose }) {
  const {
    track,
    nextTrack,
    prevTrack,
    isPlaying,
    togglePlay,
    progress,
    duration,
    seek,
    setIsScrubbing,
    shuffle, setShuffle,
    repeat, setRepeat,
    audioRef
  } = usePlayer();

  const [volume, setVolume] = useState(80);

  if (!open || !track) return null;

  const format = (sec = 0) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // volume sync
  if (audioRef?.current) {
    audioRef.current.volume = volume / 100;
  }

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">

      {/* ---------- TOP BAR ---------- */}
      <div className="p-4 flex justify-between items-center">
        <span className="text-gray-400 text-sm">Now Playing</span>
        <button onClick={onClose} className="text-gray-400 text-xl">✖</button>
      </div>

      {/* ---------- ARTWORK ---------- */}
      <div className="flex justify-center mt-6">
        <img
          src={track.album_image || "/music.png"}
          className="w-64 h-64 rounded-xl shadow-lg"
        />
      </div>

      {/* ---------- SONG INFO ---------- */}
      <div className="mt-6 text-center px-6">
        <h2 className="text-white text-xl font-bold truncate">{track.name}</h2>
        <p className="text-gray-400">{track.artist_name}</p>
      </div>


      {/* ---------- SEEK BAR FULL WIDTH ---------- */}
      <div className="px-6 mt-6">
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onTouchStart={() => setIsScrubbing(true)}
          onTouchEnd={() => setIsScrubbing(false)}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-green-500"
        />

        <div className="flex justify-between text-gray-400 text-sm mt-1">
          <span>{format(progress)}</span>
          <span>{format(duration)}</span>
        </div>
      </div>


      {/* ---------- CONTROLS ---------- */}
      <div className="mt-8 flex justify-center gap-8 text-3xl">
        <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-green-400" : "text-white"}>
          <FaRandom />
        </button>

        <button onClick={prevTrack}>
          <FaBackward />
        </button>

        <button
          onClick={togglePlay}
          className="bg-white text-black rounded-full h-14 w-14 flex items-center justify-center"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button onClick={nextTrack}>
          <FaForward />
        </button>

        <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-green-400" : "text-white"}>
          <FaRedo />
        </button>
      </div>


      {/* ---------- VOLUME ---------- */}
      <div className="mt-8 px-10 flex items-center justify-center gap-4 text-white">
        <FaVolumeUp />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          className="w-40 accent-green-500"
        />
      </div>
    </div>
  );
}