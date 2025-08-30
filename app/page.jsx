'use client';
import { useAccount } from 'wagmi';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to TipMe
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          A decentralized platform for creators to receive support and gratitude from their community through crypto donations.
        </p>
      </div>
    </div>
  );
}