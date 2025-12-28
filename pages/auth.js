import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Auth() {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleGoogle = async () => {
    await loginWithGoogle();
    router.push("/");
  };

  return (
    <div className="h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-[#111] p-8 rounded-xl border border-gray-700 w-100 text-center">
        <h2 className="text-2xl font-bold mb-6">Sign in to MPlayer Pro</h2>

        <button
          className="w-full bg-green-500 p-3 rounded text-black font-semibold hover:bg-green-400 transition"
          onClick={handleGoogle}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}