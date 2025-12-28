import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function usePlaylists() {
  const { user } = useAuth();

  const createPlaylist = async (name) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "playlists", name), {
      name,
      tracks: []
    });
  };

  const addToPlaylist = async (name, track) => {
    const ref = doc(db, "users", user.uid, "playlists", name);
    const snap = await getDoc(ref);
    const data = snap.data();

    await setDoc(ref, {
      ...data,
      tracks: [...data.tracks, track]
    });
  };

  return { createPlaylist, addToPlaylist };
}