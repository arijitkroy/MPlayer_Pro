import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import TrackCard from "../../components/TrackCard";
import { usePlayer } from "../../context/PlayerContext";

export default function PlaylistView() {
  const router = useRouter();
  const { name } = router.query;

  const { user } = useAuth();
  const { playTrack } = usePlayer();

  const [playlist, setPlaylist] = useState(null);

  const loadPlaylist = async () => {
    if (!user || !name) return;

    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const list = snap.data().list || [];
    const found = list.find(p => p.name === name);

    setPlaylist(found || null);
  };

  const removeTrack = async (trackId) => {
    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);
    const list = snap.data().list;

    const updated = list.map(p =>
      p.name === name
        ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
        : p
    );

    await setDoc(ref, { list: updated });
    loadPlaylist();
  };

  useEffect(() => { loadPlaylist(); }, [user, name]);

  if (!playlist)
    return (
      <Layout>
        <div className="text-gray-400">Loading playlist...</div>
      </Layout>
    );

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-3">{playlist.name}</h2>

      <button
        onClick={() => playTrack(playlist.tracks, 0)}
        className="bg-green-500 px-4 py-2 rounded mb-4"
        disabled={!playlist.tracks?.length}
      >
        Play Playlist ▶
      </button>

      {!playlist.tracks?.length && (
        <div className="text-gray-400">No songs yet</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {playlist.tracks?.map((track, i) => (
          <div key={track.id} className="relative">
            <TrackCard track={track} tracks={playlist.tracks} index={i} />

            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-2 rounded text-sm"
              onClick={() => removeTrack(track.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}