"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tighter text-emerald-500">
          Akelarre
        </h1>
        <p className="text-zinc-400 text-lg max-w-md">
          La plataforma inteligente para la gestión de juegos de mesa en bares.
        </p>
        <div className="pt-8">
          <span className="px-4 py-2 border border-zinc-800 rounded-full text-sm text-zinc-500">
            Escanea el QR de tu mesa para comenzar
          </span>
        </div>
      </div>
    </main>
  );
}