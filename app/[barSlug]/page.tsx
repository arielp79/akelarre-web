"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function BarGamesList({ params }: { params: Promise<{ barSlug: string }> }) {
  const { barSlug } = use(params);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Traemos los juegos que NO están prestados (isBorrowed: false)
    fetch(`/api/games?barSlug=${barSlug}&available=true`)
      .then(res => res.json())
      .then(data => {
        setGames(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [barSlug]);

  if (loading) return <div className="p-10 text-center animate-pulse font-sans">Buscando juegos disponibles...</div>;

  return (
    <main className="min-h-screen bg-white p-6 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-black uppercase italic leading-none tracking-tighter">
          {barSlug} <br /> <span className="text-indigo-600">JUEGOS</span>
        </h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Seleccioná un juego para tu mesa</p>
      </header>

      <div className="grid gap-4">
        {games.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
            <p className="text-zinc-400 italic">No hay juegos disponibles en este momento. <br /> ¡Consultá en la barra!</p>
          </div>
        ) : (
          games.map((game) => (
            <Link
              key={game._id}
              href={`/${barSlug}/loans/${game._id}`}
              className="group bg-zinc-50 p-6 rounded-3xl border border-zinc-100 flex justify-between items-center active:scale-95 transition-all"
            >
              <div>
                <h2 className="font-bold text-xl text-zinc-900 group-hover:text-indigo-600 transition-colors">
                  {game.name}
                </h2>
                <p className="text-sm text-zinc-500 font-medium">{game.category}</p>
              </div>
              <div className="bg-white px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest text-indigo-600 shadow-sm border border-zinc-100">
                Pedir
              </div>
            </Link>
          ))
        )}
      </div>

      <footer className="mt-12 text-center">
        <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em]">Akelarre System</p>
      </footer>
    </main>
  );
}