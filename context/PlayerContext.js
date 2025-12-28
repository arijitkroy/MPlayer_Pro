import { createContext, useContext, useRef, useState } from "react";

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(null);

  const [track, setTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const playTrack = (songList, index = 0) => {
    setQueue(songList);
    setCurrentIndex(index);
    setTrack(songList[index]);
    setIsPlaying(true);
};

    const nextTrack = () => {
        if (shuffle) {
            const randomIndex = Math.floor(Math.random() * queue.length);
            setCurrentIndex(randomIndex);
            setTrack(queue[randomIndex]);
            return;
        }

        if (currentIndex + 1 >= queue.length) {
            if (repeat) {
            setCurrentIndex(0);
            setTrack(queue[0]);
            }
            return;
        }

        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        setTrack(queue[newIndex]);
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

  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(
      (audioRef.current.currentTime / audioRef.current.duration) * 100
    );
  };

  const seek = (e) => {
    if (!audioRef.current) return;

    const percent = e.target.value;
    audioRef.current.currentTime =
      (audioRef.current.duration * percent) / 100;

    setProgress(percent);
  };

  return (
    <PlayerContext.Provider
      value={{
        track,
        isPlaying,
        progress,
        playTrack,
        togglePlay,
        seek,
        audioRef,
        onTimeUpdate, 
        nextTrack,
        prevTrack, 
        shuffle, setShuffle,
        repeat, setRepeat
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);