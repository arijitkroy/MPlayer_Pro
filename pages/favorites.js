import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { usePlayer } from "../context/PlayerContext";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import  TrackCard from "../components/TrackCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const { playTrack } = usePlayer();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.uid, "favorites");

    const unsub = onSnapshot(ref, (snap) => {
      setFavorites(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, [user]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Your Favorites ❤️</h2>

      {favorites.length === 0 && (
        <div className="text-gray-400">No favorites yet</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {favorites.map((track, i) => (
            <TrackCard
            key={track.id}
            track={track}
            tracks={favorites}
            index={i}
            />
        ))}
      </div>
    </Layout>
  );
}