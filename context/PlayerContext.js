import { createContext, useContext, useRef, useState, useEffect } from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Real playback states (seconds)
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Queue
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Features
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Scrub lock (prevents jitter while dragging)
  const [isScrubbing, setIsScrubbing] = useState(false);

  // ---------------- LISTENERS ----------------
  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const updateProgress = () => {
      if (!isScrubbing) setProgress(audio.currentTime);
    };

    const loadMeta = () => setDuration(audio.duration || 0);

    const onEnded = () => nextTrack();

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", loadMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", loadMeta);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioRef, queue, currentIndex, repeat, shuffle, isScrubbing]);


  // ---------------- CONTROLS ----------------
  const playTrack = (songList, index = 0) => {
    if (!songList || !songList.length) return;

    setQueue(songList);
    setCurrentIndex(index);
    setTrack(songList[index]);
    setIsPlaying(true);

    setTimeout(() => {
      if (audioRef.current) audioRef.current.play();
    }, 100);
  };

  const nextTrack = () => {
    if (!queue.length) return;

    if (shuffle) {
      const r = Math.floor(Math.random() * queue.length);
      setCurrentIndex(r);
      setTrack(queue[r]);
      setIsPlaying(true);
      return;
    }

    // last song
    if (currentIndex + 1 >= queue.length) {
      if (repeat) {
        setCurrentIndex(0);
        setTrack(queue[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    setTrack(queue[newIndex]);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (currentIndex === 0) return;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    setTrack(queue[newIndex]);
    setIsPlaying(true);
  };


  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };


  // ---------------- SEEKING ----------------
  const seek = (input) => {
    if (!audioRef.current || !duration) return;

    let seconds;

    // Desktop range sends event
    if (input?.target) {
      const value = Number(input.target.value);
      const max = Number(input.target.max || 100);

      // Percent based slider
      if (max === 100) {
        seconds = (duration * value) / 100;
      }
      // Direct seconds range
      else {
        seconds = value;
      }
    }

    // Mobile sends number directly
    else {
      seconds = Number(input);
    }

    if (!isFinite(seconds) || isNaN(seconds)) return;

    seconds = Math.max(0, Math.min(duration, seconds));

    audioRef.current.currentTime = seconds;
    setProgress(seconds);
  };

  // Desktop helper
  const progressPercent = duration ? (progress / duration) * 100 : 0;


  return (
    <PlayerContext.Provider
      value={{
        track,
        audioRef,

        isPlaying,
        togglePlay,

        playTrack,
        nextTrack,
        prevTrack,
        queue,
        currentIndex,

        progress,
        duration,
        seek,
        progressPercent,

        shuffle, setShuffle,
        repeat, setRepeat,

        isScrubbing,
        setIsScrubbing
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);