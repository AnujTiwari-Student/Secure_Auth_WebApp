import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
        <Image
          src="https://static-00.iconduck.com/assets.00/user-login-icon-1948x2048-nocsasoq.png" 
          alt="Auth Illustration"
          width={200}
          height={200}
          className="mx-auto mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to AuthApp
        </h1>
        <p className="text-gray-500 mb-6">
          Secure and Simple Authentication System
        </p>
        <Link href="/login">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
}
