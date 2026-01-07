import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { usePlayer } from "../context/PlayerContext";
import useFavorites from "../hooks/useFavorites";
import TrackCard from "../components/TrackCard";

export default function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const { playTrack, track: current } = usePlayer();
  const { addFavorite, removeFavorite, getFavorites } = useFavorites();
  const [favoriteIds, setFavoriteIds] = useState([]);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs.map(f => f.id));
  };

  const searchMusic = async (query) => {
    if (!query.trim()) return setTracks([]);
    setLoading(true);

    const res = await fetch(`/api/music?q=${query}`);
    const data = await res.json();

    setTracks(data || []);
    setLoading(false);
  };

  const fetchRandomMusic = async (reset = true) => {
    if (reset) setLoading(true);

    const res = await fetch(
      `/api/music?q=random_home&page=${reset ? 0 : page}&t=${Date.now()}`
    );
    const data = await res.json();

    setTracks(reset ? (data || []) : [...tracks, ...data]);
    setLoading(false);
  };

  const loadMoreTracks = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRandomMusic(false);
  };

  useEffect(() => {
    fetchRandomMusic();
    loadFavorites();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 600
      ) {
        loadMoreTracks();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <Layout onSearch={searchMusic} onHomeClick={() => fetchRandomMusic(true)}>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">
          Recommended for you
        </h2>
        <p className="text-gray-400 mt-1">
          Fresh picks — handpicked vibes curated just for your mood 🎧
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-[#1b1b1b]/70 border border-white/10 rounded-xl p-4
              shadow-[0_0_20px_rgba(0,0,0,0.4)]"
            >
              <div className="bg-[#2d2d2d] h-44 rounded mb-3"></div>
              <div className="h-4 bg-[#2d2d2d] rounded mb-2"></div>
              <div className="h-3 bg-[#2d2d2d] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && tracks.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <div className="text-6xl mb-3">😶‍🌫️</div>
          <p className="text-lg">Nothing to show… Try searching something</p>

          <div className="mt-3 px-4 py-2 bg-[#222]/50 border border-white/10 rounded-full text-sm text-gray-300">
            Tip: Try “lofi”, “rock”, “anime”, “edm” 🎵
          </div>
        </div>
      )}

      <div
        className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))]
        gap-6 pb-10"
      >
        {!loading &&
          tracks.map((track, index) => (
            <TrackCard
              key={track.id}
              track={track}
              tracks={tracks}
              index={index}
            />
          ))}
      </div>
    </Layout>
  );
}