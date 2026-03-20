"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";

export default function BarDetailsMaster({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [games, setGames] = useState<any[]>([]);
    const [editingGame, setEditingGame] = useState<any>(null); // Estado para el juego que se está editando

    const fetchGames = () => {
        fetch(`/api/games?barSlug=${slug}`).then(res => res.json()).then(setGames);
    };

    useEffect(() => {
        fetchGames();
    }, [slug]);

    // FUNCIÓN PARA BORRAR JUEGO
    const deleteGame = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de borrar el juego "${name}"?`)) return;

        const res = await fetch(`/api/games?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            // Actualizamos la lista localmente para que desaparezca rápido
            setGames(prev => prev.filter(g => g._id !== id));
        } else {
            alert("Error al borrar el juego");
        }
    };

    // FUNCIÓN PARA GUARDAR EDICIÓN
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/games", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingGame),
        });

        if (res.ok) {
            setEditingGame(null); // Cerramos el modal
            fetchGames(); // Recargamos la lista
        } else {
            alert("Error al actualizar el juego");
        }
    };

    return (
        <main className="p-8 max-w-4xl mx-auto font-sans bg-zinc-50 min-h-screen">
            <header className="flex justify-between items-end mb-8 border-b pb-6">
                <div>
                    <Link href="/admin-master" className="text-indigo-600 text-sm font-bold uppercase mb-2 block">← Volver al Master</Link>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Juegos de <span className="text-zinc-400">{slug}</span></h1>
                </div>
                <Link href={`/admin-master/bars/${slug}/new-game`} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-md">
                    + Nuevo Juego
                </Link>
            </header>

            <div className="grid gap-3">
                {games.map(game => (
                    <div key={game._id} className="p-5 bg-white border border-zinc-200 rounded-3xl flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
                        <div>
                            <p className="font-black text-xl text-zinc-900 uppercase italic tracking-tighter">{game.name}</p>
                            <div className="flex gap-2 items-center mt-1">
                                <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-md font-black uppercase text-zinc-500">{game.category}</span>
                                <p className="text-[10px] text-zinc-400 font-mono font-bold italic">ID: {game.internalId || game._id.slice(-6)}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {/* BOTÓN EDITAR */}
                            <button
                                onClick={() => setEditingGame(game)}
                                className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                ✏️
                            </button>
                            {/* BOTÓN BORRAR */}
                            <button
                                onClick={() => deleteGame(game._id, game.name)}
                                className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-300 group-hover:text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
                {games.length === 0 && <p className="text-center py-20 text-zinc-400 italic font-medium leading-relaxed">Este bar aún no tiene juegos cargados.</p>}
            </div>

            {/* MODAL DE EDICIÓN DE JUEGO */}
            {editingGame && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-black mb-6 uppercase italic tracking-tighter text-zinc-900">Editar Juego</h2>
                        <div className="flex flex-col gap-4">
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Nombre del Juego</label>
                            <input
                                className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-indigo-500 text-zinc-900"
                                value={editingGame.name}
                                onChange={e => setEditingGame({ ...editingGame, name: e.target.value })}
                                required
                            />
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">Categoría</label>
                            <input
                                className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-indigo-500 text-zinc-900"
                                value={editingGame.category}
                                onChange={e => setEditingGame({ ...editingGame, category: e.target.value })}
                                required
                            />
                            <label className="text-[10px] font-black uppercase text-zinc-400 ml-2">ID Interno</label>
                            <input
                                className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-indigo-500 text-zinc-900"
                                value={editingGame.internalId || ""}
                                onChange={e => setEditingGame({ ...editingGame, internalId: e.target.value })}
                            />
                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest active:scale-95 transition-all">Guardar</button>
                                <button type="button" onClick={() => setEditingGame(null)} className="flex-1 bg-zinc-200 text-zinc-600 py-4 rounded-2xl font-bold active:scale-95 transition-all">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}