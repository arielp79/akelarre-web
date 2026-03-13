"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function BarDetailsMaster({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        fetch(`/api/games?barSlug=${slug}`).then(res => res.json()).then(setGames);
    }, [slug]);

    return (
        <main className="p-8 max-w-4xl mx-auto font-sans">
            <header className="flex justify-between items-end mb-8 border-b pb-6">
                <div>
                    <Link href="/admin-master" className="text-indigo-600 text-sm font-bold uppercase mb-2 block">← Volver al Master</Link>
                    <h1 className="text-4xl font-black uppercase italic">Juegos de {slug}</h1>
                </div>
                {/* BOTÓN AGREGAR JUEGO (Contextual al Bar) */}
                <Link href={`/admin-master/bars/${slug}/new-game`} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold">
                    + Nuevo Juego
                </Link>
            </header>

            {/* LISTA QUE VERÁ EL ADMIN DE BAR */}
            <div className="grid gap-2">
                {games.map(game => (
                    <div key={game._id} className="p-4 bg-zinc-50 border rounded-2xl flex justify-between items-center group hover:bg-white transition-colors">
                        <div>
                            <p className="font-bold text-lg">{game.name}</p>
                            <p className="text-xs text-zinc-400 font-mono">ID: {game.internalId || game._id.slice(-6)}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-[10px] bg-zinc-200 px-2 py-1 rounded-md font-black uppercase">{game.category}</span>
                            <button className="text-zinc-300 group-hover:text-red-500 transition-colors">🗑️</button>
                        </div>
                    </div>
                ))}
                {games.length === 0 && <p className="text-center py-20 text-zinc-400 italic">Este bar aún no tiene juegos cargados.</p>}
            </div>
        </main>
    );
}