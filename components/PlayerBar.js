import { usePlayer } from "../context/PlayerContext";
import { useEffect } from "react";
import { FaBackward, FaForward, FaPlay, FaPause, FaRandom, FaRedo } from "react-icons/fa";

export default function PlayerBar() {
  const {
    track,
    isPlaying,
    progress,
    togglePlay,
    seek,
    audioRef,
    onTimeUpdate,
    nextTrack,
    prevTrack, 
    shuffle, setShuffle,
    repeat, setRepeat
  } = usePlayer();

  useEffect(() => {
    if (audioRef.current && track) {
      audioRef.current.src = track.audio;
      audioRef.current.play();
    }
  }, [track]);

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-6 py-3 flex items-center gap-4 border-t border-gray-700">
      
      {/* Track Info */}
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{track.name}</span>
        <span className="text-gray-400 text-xs">{track.artist_name}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-3 ml-4">
            <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-green-400" : ""}>
                <FaRandom />
            </button>

            <button onClick={prevTrack}><FaBackward /></button>

            <button onClick={togglePlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button onClick={nextTrack}><FaForward /></button>

            <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-green-400" : ""}>
            <FaRedo />
            </button>
      </div>


      {/* Progress Bar */}
      <input
        type="range"
        value={progress}
        onChange={seek}
        className="w-full accent-green-500 mx-4"
      />

      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={nextTrack}
      />
    </div>
  );
}