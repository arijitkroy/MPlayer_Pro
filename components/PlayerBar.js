import { usePlayer } from "../context/PlayerContext";
import { useEffect, useState } from "react";
import { FaBackward, FaForward, FaPlay, FaPause, FaRandom, FaRedo, FaVolumeUp } from "react-icons/fa";

export default function PlayerBar() {
  const {
    track,
    isPlaying,
    togglePlay,
    seek,
    progress, 
    duration,
    audioRef,
    nextTrack,
    prevTrack,
    shuffle, setShuffle,
    repeat, setRepeat,
    setIsScrubbing,
    progressPercent
  } = usePlayer();

  const [volume, setVolume] = useState(80);

  const format = (sec = 0) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (audioRef.current && track) {
      audioRef.current.src = track.audio;
      audioRef.current.volume = volume / 100;
      audioRef.current.play();
    }
  }, [track]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white border-t border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 w-[30%]">
          <img
            src={track.album_image || "/music.png"}
            className="w-12 h-12 rounded object-cover"
          />

          <div className="truncate">
            <div className="font-semibold text-sm truncate">{track.name}</div>
            <div className="text-gray-400 text-xs truncate">{track.artist_name}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 justify-center w-[40%] text-lg">
          <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-green-400" : ""}>
            <FaRandom />
          </button>

          <button onClick={prevTrack}>
            <FaBackward />
          </button>

          <button
            onClick={togglePlay}
            className="bg-white text-black rounded-full h-9 w-9 flex items-center justify-center"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>

          <button onClick={nextTrack}>
            <FaForward />
          </button>

          <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-green-400" : ""}>
            <FaRedo />
          </button>
        </div>

        <div className="flex items-center gap-2 w-[30%] justify-end">
          <FaVolumeUp />
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-32 accent-green-500"
          />
        </div>
      </div>

      <div className="mt-1 px-2">
        <div className="flex justify-between gap-2 text-gray-400 text-sm mt-1">
          <span>{format(progress)}</span>
            <input
                type="range"
                min={0}
                max={100}
                value={progressPercent}
                onMouseDown={() => setIsScrubbing(true)}
                onMouseUp={(e) => {
                    setIsScrubbing(false);
                    seek(e);
                }}
                onChange={seek}
                className="w-full accent-green-500"
            />
          <span>{format(duration)}</span>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}