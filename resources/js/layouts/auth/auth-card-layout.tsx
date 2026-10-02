import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative p-6 overflow-hidden">

      {/* 1. Gambar Background Utama dari Storage */}
      <div
        className="absolute inset-0 z-0 bg-[url('/storage/background/login-bg.png')] bg-cover bg-center bg-no-repeat"
      />

      {/* 2. Overlay Warna Krem Transparan & Blur */}
      <div className="absolute inset-0 z-0 bg-[#e4d5c1]/60 backdrop-blur-[2px]" />

      {/* 3. Glow Cahaya Keemasan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Container Utama (Form Card) */}
      <div className="w-full max-w-md z-10">
        {children}
      </div>

    </div>
  );
}
