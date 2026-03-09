"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export default function AdminGamesPage({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const [games, setGames] = useState([]);

    useEffect(() => {
        fetch(`/api/games?barSlug=${barSlug}`).then(res => res.json()).then(setGames);
    }, [barSlug]);

    return (
        <main className="p-8 max-w-4xl mx-auto font-sans">
            <AdminNav barSlug={barSlug} />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-black italic text-zinc-900 dark:text-zinc-50 tracking-tighter">MI LUDOTECA</h1>
                <Link href={`/admin/${barSlug}/new-game`} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20">
                    + Agregar Juego
                </Link>
            </div>
            <div className="grid gap-3">
                {games.map((game: any) => (
                    <div key={game._id} className="p-4 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl flex justify-between items-center">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{game.name}</span>
                        <div className="flex gap-4 items-center">
                            <span className="text-xs text-zinc-500 font-medium">{game.players} jug. • {game.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}