"use client";
import AdminNav from "@/components/AdminNav";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Importamos para navegar programáticamente

interface Game {
    _id: string;
    name: string;
    category?: string;
    available: boolean;
    internalId?: string;
}

export default function BarAdminPage({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const router = useRouter();

    const [games, setGames] = useState<Game[]>([]);
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
                fetchGames();
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
        try {
            const res = await fetch(`/api/games?barSlug=${barSlug}`);
            const data = await res.json();
            setGames(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando juegos", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isAuthenticated) return <div className="p-10 text-center animate-pulse font-sans">Verificando...</div>;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm shadow-2xl">
                    <h1 className="text-white text-2xl font-black mb-2 text-center tracking-tighter uppercase italic">
                        {barSlug} <span className="text-indigo-500">Admin</span>
                    </h1>
                    <input
                        type="password"
                        placeholder="Clave Maestra"
                        className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white mb-4 outline-none"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && verifyKey(inputKey)}
                    />
                    <button
                        onClick={() => verifyKey(inputKey)}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
                    >
                        Acceder
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 font-sans text-zinc-900 dark:text-zinc-50">
            <div className="max-w-4xl mx-auto">
                <AdminNav barSlug={barSlug} />

                <header className="mb-8 mt-4">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                        {barSlug.replace("-", " ")}
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Panel de Control</p>
                </header>

                <div className="grid gap-3">
                    {games.map((game) => (
                        <div
                            key={game._id}
                            className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${!game.available ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                <div>
                                    <h2 className={`font-bold text-lg leading-tight ${!game.available ? 'text-zinc-400' : ''}`}>
                                        {game.name}
                                    </h2>
                                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-tighter">
                                        {game.available ? 'Disponible' : 'En Mesa'}
                                    </span>
                                </div>
                            </div>

                            {/* EL LINK CORREGIDO SEGÚN TU ESTRUCTURA */}
                            <Link
                                href={`/admin/${barSlug}/games/${game._id}`}
                                className="h-12 w-12 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm"
                            >
                                <span className="text-xl">→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}