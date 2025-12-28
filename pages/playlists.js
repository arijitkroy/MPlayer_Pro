import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { usePlayer } from "../context/PlayerContext";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const [loading, setLoading] = useState(true);

  const loadPlaylists = async () => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setPlaylists(snap.data().list || []);
    }

    setLoading(false);
  };

  const createPlaylist = async () => {
    if (!user || !name.trim()) return;

    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    const data = snap.exists() ? snap.data().list : [];
    const updated = [...data, { name, tracks: [] }];

    await setDoc(ref, { list: updated });

    setName("");
    loadPlaylists();
    toast.success("Playlist created 🎵");
  };

  const deletePlaylist = async (playlist) => {
    if (!confirm(`Delete playlist "${playlist.name}"?`)) return;

    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    const updated = snap.data().list.filter(
      (p) => p.name !== playlist.name
    );

    await setDoc(ref, { list: updated });

    loadPlaylists();
    toast("Playlist deleted ❌");
  };

  useEffect(() => {
    loadPlaylists();
  }, [user]);


  return (
    <Layout>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Your Playlists</h2>
        <p className="text-gray-400 mt-1">
          Organize your favorite songs — create, play & manage 🎧
        </p>
      </div>

      {/* Create Playlist UI */}
      <div className="flex gap-3 mb-6">
        <input
          className="bg-[#1f1f1f] px-3 py-2 rounded outline-none border border-white/10 text-white w-full sm:w-72"
          placeholder="Playlist name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-green-500 hover:bg-green-400 px-5 rounded transition"
          onClick={createPlaylist}
        >
          Create
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-[#1b1b1b]/70 border border-white/10 rounded-xl p-4">
              <div className="bg-[#2d2d2d] h-40 rounded mb-3"></div>
              <div className="h-4 bg-[#2d2d2d] rounded mb-2"></div>
              <div className="h-3 bg-[#2d2d2d] rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && playlists.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
          <div className="text-6xl mb-3">📂</div>
          <p className="text-lg">No playlists yet</p>
          <div className="mt-2 text-gray-500 text-sm">
            Create one now
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.name}
            className="relative rounded-xl bg-[#181818]/70 backdrop-blur-md border border-white/10
            p-4 transition-all duration-300 group hover:bg-[#222]/80 hover:scale-[1.02]"
          >
            <Link href={`/playlist/${playlist.name}`}>
              <div>
                {/* Playlist Cover */}
                <div className="h-40 w-full rounded bg-gradient-to-br from-green-600 to-green-900 flex items-center justify-center text-4xl">
                  🎵
                </div>

                <div className="mt-3 font-semibold truncate text-white">
                  {playlist.name}
                </div>

                <div className="text-gray-400 text-sm">
                  {playlist.tracks?.length || 0} songs
                </div>
              </div>
            </Link>

            {/* Hover Play Button */}
            {playlist.tracks?.length > 0 && (
              <button
                onClick={() => playTrack(playlist.tracks, 0)}
                className="absolute bottom-6 right-6 bg-green-500 text-black rounded-full 
                h-10 w-10 hidden group-hover:flex items-center justify-center 
                transition-all duration-300 shadow-lg hover:scale-105"
              >
                ▶
              </button>
            )}

            {/* Delete Button */}
            <button
              onClick={() => deletePlaylist(playlist)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400 text-lg"
            >
              ✖
            </button>

            <button
                onClick={async (e) => {
                    e.stopPropagation();

                    const { v4: uuidv4 } = await import("uuid");

                    const shareId = uuidv4();
                    const ref = doc(db, "sharedPlaylists", shareId);

                    await setDoc(ref, {
                    name: playlist.name,
                    tracks: playlist.tracks || [],
                    owner: user.uid,
                    createdAt: Date.now(),
                    });

                    const link = `${window.location.origin}/share/${shareId}`;
                    navigator.clipboard.writeText(link);

                    toast.success("Playlist link copied!");
                }}
                className="relative text-gray-300 hover:text-blue-400 text-sm"
                >
                🔗 Share
                </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}