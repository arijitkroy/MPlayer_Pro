import Link from "next/link";
import { useRouter } from "next/router";

export default function MobileNav() {
  const router = useRouter();

  const tab = (path, label, icon) => (
    <Link href={path}>
      <div className={`flex flex-col items-center text-xs ${
        router.pathname === path ? "text-white" : "text-gray-400"
      }`}>
        <span className="text-xl">{icon}</span>
        {label}
      </div>
    </Link>
  );

  return (
    <div className="
      fixed bottom-0 left-0 right-0
      bg-[#101010]/95 backdrop-blur-md
      border-t border-white/10
      h-16 flex justify-around items-center
      sm:hidden z-999
    ">
      {tab("/", "Home", "🏠")}
      {tab("/favorites", "Favorites", "❤️")}
      {tab("/playlists", "Playlists", "🎵")}
    </div>
  );
}