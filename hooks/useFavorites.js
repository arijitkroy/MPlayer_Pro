import { db } from "../firebaseConfig";
import { doc, setDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function useFavorites() {
  const { user } = useAuth();

  const addFavorite = async (track) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "favorites", track.id), track);
  };

  const removeFavorite = async (trackId) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "favorites", trackId));
  };

  const getFavorites = async () => {
    if (!user) return [];
    const snap = await getDocs(collection(db, "users", user.uid, "favorites"));
    return snap.docs.map(d => d.data());
  };

  return { addFavorite, removeFavorite, getFavorites };
}