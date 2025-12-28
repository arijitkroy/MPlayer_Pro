import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children, onSearch, onHomeClick }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path) =>
    router.pathname === path
      ? "text-white font-semibold"
      : "text-gray-400 hover:text-white";

  return (
    <div className="h-screen bg-black text-gray-200 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-gray-800 p-6 hidden sm:flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-white">MPlayer Pro</h1>

        <nav className="flex flex-col gap-4">
          <Link href="/" className={isActive("/favorites")}>
            Home
          </Link>

          <Link href="/favorites" className={isActive("/favorites")}>
            Favorites
          </Link>

          <Link href="/playlists" className={isActive("/playlists")}>
            Playlists
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">

        {/* Header */}
        <header className="p-4 bg-gradient-to-b from-[#121212] to-transparent border-b border-gray-800 flex justify-between items-center">
          <input
            placeholder="Search for songs…"
            className="bg-[#1f1f1f] text-white px-4 py-2 rounded-full outline-none w-1/2"
            onChange={(e) => onSearch?.(e.target.value)}
          />

          {user ? (
            <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded-full text-sm hover:bg-red-400 transition"
            >
                Logout ({user.displayName?.split(" ")[0]})
            </button>
            ) : (
            <Link
                href="/auth"
                className="bg-green-500 px-4 py-2 rounded-full text-sm hover:bg-green-400 transition"
            >
                Login with Google
            </Link>
            )}
        </header>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>

      </main>
    </div>
  );
}