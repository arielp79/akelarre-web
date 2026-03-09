"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";

export default function GameCatalog({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/games?barSlug=${barSlug}`)
            .then((res) => res.json())
            .then((data) => {
                setGames(data);
                setLoading(false);
            });
    }, [barSlug]);

    if (loading) return <p className="p-10 text-center animate-pulse text-zinc-500">Abriendo ludoteca...</p>;

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-black p-6 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-black italic tracking-tighter">AKELARRE</h1>
                <p className="text-zinc-500 uppercase text-xs font-bold tracking-widest">{barSlug}</p>
            </header>

            <div className="grid gap-4">
                {games.length === 0 ? (
                    <p className="text-center text-zinc-400 py-10">No hay juegos cargados aún.</p>
                ) : (
                    games.map((game: any) => (
                        <Link
                            key={game._id}
                            href={`/${barSlug}/games/${game._id}`}
                            className="bg-white dark:bg-zinc-900 p-5 rounded-2xl shadow-sm border dark:border-zinc-800 flex justify-between items-center active:scale-95 transition-transform"
                        >
                            <div>
                                <h2 className="text-xl font-bold">{game.name}</h2>
                                <p className="text-xs text-zinc-400">{game.players} jug. • {game.time}</p>
                            </div>
                            <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-tighter">Pedir</span>
                        </Link>
                    ))
                )}
            </div>
        </main>
    );
}