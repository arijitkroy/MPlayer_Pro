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
import Head from "next/head"

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const PUBLIC_ROUTES = ["/auth"];

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex items-center justify-center">
        Restoring session...
      </div>
    );
  }

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
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-192x192.png" />
      </Head>
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
    </>
  );
}