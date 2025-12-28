import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function PlaylistModal({ track, onClose }) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => setMounted(true), []);

  const loadPlaylists = async () => {
    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);
    if (snap.exists()) setPlaylists(snap.data().list || []);
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const addToPlaylist = async (playlistName) => {
    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);

    let list = snap.exists() ? snap.data().list : [];
    const p = list.find(p => p.name === playlistName);

    if (!p) return;

    // 🔥 Prevent duplicate track
    const alreadyExists = (p.tracks || []).some(t => t.id === track.id);
    if (alreadyExists) {
        toast.error("Track already in this playlist");
        return;
    }

    p.tracks = [...(p.tracks || []), track];
    list = [...list.filter(pl => pl.name !== playlistName), p];

    await setDoc(ref, { list });
    toast.success(`Added to ${playlistName}`);
    onClose();
  };

  const createPlaylist = async () => {
    if (!name.trim()) return;

    const ref = doc(db, "users", user.uid, "data", "playlists");
    const snap = await getDoc(ref);
    const list = snap.exists() ? snap.data().list : [];

    const exists = list.find(p => p.name === name);

    // If playlist exists and track already inside → stop
    if (exists) {
        const already = (exists.tracks || []).some(t => t.id === track.id);
        if (already) {
        toast.error("Track already exists in this playlist");
        return;
        }

        exists.tracks.push(track);
        await setDoc(ref, { list: [...list.filter(p => p.name !== name), exists] });
    } else {
        await setDoc(ref, {
        list: [...list, { name, tracks: [track] }]
        });
    }

    toast.success(`Added to ${name}`);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[9999]">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-[420px]">

        <h2 className="text-xl font-bold mb-3 text-white">
          Add to Playlist
        </h2>

        {/* Existing Playlists */}
        <div className="max-h-56 overflow-y-auto mb-4">
          {playlists.length === 0 && (
            <div className="text-gray-400 text-sm">
              No playlists yet — create one below
            </div>
          )}

          {playlists.map((p) => (
            <div
              key={p.name}
              className="p-3 text-white bg-[#1f1f1f] rounded-lg mb-2 cursor-pointer border border-transparent hover:border-green-500 transition flex justify-between"
              onClick={() => addToPlaylist(p.name)}
            >
              <span>{p.name}</span>
              <span className="text-gray-400">{p.tracks?.length || 0} songs</span>
            </div>
          ))}
        </div>

        {/* Create Playlist */}
        <div className="flex gap-2 mb-4">
          <input
            className="bg-[#1f1f1f] px-3 py-2 rounded w-full outline-none text-white"
            placeholder="New playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={createPlaylist}
            className="bg-green-500 px-4 rounded"
          >
            Create
          </button>
        </div>

        {/* Close */}
        <button
          className="w-full bg-red-500 py-2 rounded"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}