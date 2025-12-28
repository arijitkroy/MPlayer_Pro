import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  // Google Provider
  const provider = new GoogleAuthProvider();

  // Login
  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Listen for auth state
  useEffect(() => {
    return onAuthStateChanged(auth,(u)=>{
      setUser(u || null);
      setLoading(false);
    });
  },[]);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = ()=>useContext(AuthContext);