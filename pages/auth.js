import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Auth() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogle = async () => {
    await loginWithGoogle();
    router.push("/");
  };

  const handleGithubRedirect = () => {
    window.open("https://github.com/arijitkroy/MPlayer_Pro", "_blank");
  };

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-[#111] p-8 rounded-xl border border-gray-700 w-100 text-center space-y-4">
        <h2 className="text-2xl font-bold mb-6">Sign in to MPlayer Pro</h2>

        <button
          className="w-full bg-green-500 p-3 rounded text-black font-semibold hover:bg-green-400 transition"
          onClick={handleGoogle}
        >
          Continue with Google
        </button>

        <button
          onClick={handleGithubRedirect}
          className="w-full bg-gray-800 p-3 rounded border border-gray-600 hover:bg-gray-700 transition"
        >
          View Project on GitHub
        </button>
      </div>
    </div>
  );
}