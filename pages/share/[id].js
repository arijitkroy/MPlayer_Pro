import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { db } from "../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import TrackCard from "../../components/TrackCard";
import toast from "react-hot-toast";

export default function ShareView() {
  const router = useRouter();
  const { id } = router.query;

  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPlaylist = async () => {
    if (!id) return;

    const ref = doc(db, "sharedPlaylists", id);
    const snap = await getDoc(ref);

    if (snap.exists()) setPlaylist(snap.data());
    setLoading(false);
  };

  const saveToMyLibrary = async () => {
    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    const list = snap.exists() ? snap.data().list : [];
    const exists = list.find(p => p.name === playlist.name);

    let updated;

    if (exists) {
      toast.error("You already have a playlist with same name");
      return;
    }

    updated = [...list, playlist];

    await setDoc(ref, { list: updated });
    toast.success("Playlist saved to your library 🎧");
    router.push("/playlists");
  };

  useEffect(() => {
    loadPlaylist();
  }, [id]);

  return (
    <Layout>
      {loading && <div className="text-gray-400">Loading…</div>}

      {!loading && !playlist && (
        <div className="text-gray-400">Playlist not found</div>
      )}

      {playlist && (
        <>
          <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>
          <p className="text-gray-400 mb-4">
            Shared Playlist — {playlist.tracks?.length || 0} songs
          </p>

          <button
            onClick={saveToMyLibrary}
            className="bg-green-500 px-6 py-2 rounded mb-6"
          >
            Save to My Playlists
          </button>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {playlist.tracks?.map((track, i) => (
              <TrackCard
                key={track.id}
                track={track}
                tracks={playlist.tracks}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}