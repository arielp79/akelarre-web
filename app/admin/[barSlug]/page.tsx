"use client";
import AdminNav from "@/components/AdminNav";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";

export default function BarAdminPage({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const [games, setGames] = useState([]); // Cambiamos préstamos por juegos
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputKey, setInputKey] = useState("");

    useEffect(() => {
        const savedKey = localStorage.getItem("admin_key");
        if (savedKey) {
            verifyKey(savedKey);
        } else {
            setLoading(false);
        }
    }, []);

    const verifyKey = async (key: string) => {
        try {
            const res = await fetch("/api/auth/check", {
                method: "POST",
                body: JSON.stringify({ key }),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                localStorage.setItem("admin_key", key);
                setIsAuthenticated(true);
                fetchGames(); // Al autenticar, traemos la ludoteca
            } else {
                alert("Clave incorrecta");
                localStorage.removeItem("admin_key");
            }
        } catch (error) {
            console.error("Error de autenticación", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        setLoading(true);
        try {
            // Traemos todos los juegos filtrados por este bar
            const res = await fetch(`/api/games?barSlug=${barSlug}`);
            const data = await res.json();
            setGames(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando juegos", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isAuthenticated) return <div className="p-10 text-center animate-pulse font-sans">Verificando credenciales...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm shadow-2xl">
                    <h1 className="text-white text-2xl font-black mb-2 text-center tracking-tighter uppercase italic">
                        {barSlug} <span className="text-indigo-500">Admin</span>
                    </h1>
                    <p className="text-zinc-500 text-sm mb-6 text-center">Introduce la Master Key</p>
                    <input
                        type="password"
                        placeholder="Clave Maestra"
                        className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white mb-4 focus:border-indigo-500 outline-none transition-all"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && verifyKey(inputKey)}
                    />
                    <button
                        onClick={() => verifyKey(inputKey)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all active:scale-95"
                    >
                        Acceder al Inventario
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <AdminNav barSlug={barSlug} />

                <header className="mb-8">
                    <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic">
                        {barSlug}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-widest">
                        Panel de Control de Ludoteca
                    </p>
                </header>

                <div className="grid gap-3">
                    {games.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-400 font-medium">No hay juegos registrados en este bar.</p>
                        </div>
                    ) : (
                        games.map((game: any) => (
                            <div
                                key={game._id}
                                className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-900 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Indicador de Estado */}
                                    <div
                                        className={`w-3 h-3 rounded-full ${game.isBorrowed ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                                        title={game.isBorrowed ? "Prestado" : "Disponible"}
                                    />

                                    <div>
                                        <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight">
                                            {game.name}
                                        </h2>
                                        <div className="flex gap-2 items-center mt-1">
                                            <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                                                ID: {game.internalId || game._id.slice(-6)}
                                            </span>
                                            <span className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">
                                                {game.category || "General"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`hidden sm:block text-[10px] font-black uppercase px-2 py-1 rounded-md ${game.isBorrowed ? 'text-red-500' : 'text-green-500'}`}>
                                        {game.isBorrowed ? 'En Mesa' : 'Disponible'}
                                    </span>

                                    <Link
                                        href={`/admin/${barSlug}/games/${game._id}`}
                                        className="h-10 w-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all group"
                                    >
                                        <span className="text-lg group-hover:translate-x-0.5 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}