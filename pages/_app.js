import "../styles/globals.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { PlayerProvider } from "../context/PlayerContext";
import PlayerBar from "../components/PlayerBar";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import MobileNav from "../components/MobileNav";
import MiniPlayer from "../components/MiniPlayer";
import MobileNowPlaying from "../components/MobileNowPlaying";
import { useState } from "react";

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const PUBLIC_ROUTES = ["/auth"];   // only page allowed without login

  // Wait while Firebase restores session
  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Restoring session...
      </div>
    );
  }

  // If not logged in → send to auth page
  if (!user && !PUBLIC_ROUTES.includes(router.pathname)) {
    router.push("/auth");
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Redirecting to login...
      </div>
    );
  }

  return children;
}

export default function MyApp({ Component, pageProps }) {
  const [showPlayer, setShowPlayer] = useState(false);
  return (
    <AuthProvider>
      <AuthGate>
        <PlayerProvider>
          <Component {...pageProps} />
          <MiniPlayer onExpand={() => setShowPlayer(true)} />
          <MobileNowPlaying open={showPlayer} onClose={() => setShowPlayer(false)} />
          <MobileNav />
          <PlayerBar />
          <Toaster position="bottom-right" />
        </PlayerProvider>
      </AuthGate>
    </AuthProvider>
  );
}