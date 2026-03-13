"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewGameForm({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        category: "", // "Tipo" de juego
        internalId: "",
        barSlug: slug // Ya viene pre-cargado de la URL
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/games", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                // Volver a la lista de juegos del bar tras crear uno
                router.push(`/admin-master/bars/${slug}`);
                router.refresh();
            } else {
                alert("Error al guardar el juego");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-6 max-w-lg mx-auto font-sans min-h-screen flex flex-col justify-center">
            <Link href={`/admin-master/bars/${slug}`} className="text-indigo-600 font-bold mb-4 inline-block text-sm uppercase">
                ← Volver al inventario de {slug}
            </Link>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <h1 className="text-3xl font-black uppercase italic mb-6 leading-none">
                    Nuevo Juego <br />
                    <span className="text-indigo-600 text-lg">para {slug}</span>
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* NOMBRE DEL JUEGO */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 ml-1">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ej: Catan, T.E.G, Ajedrez"
                            className="w-full p-4 bg-zinc-100 dark:bg-black rounded-2xl border-none outline-indigo-500 text-lg font-bold"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    {/* CATEGORÍA */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 ml-1">Categoría</label>
                        <input
                            type="text"
                            placeholder="Ej: Estrategia, Cartas, Familiar"
                            className="w-full p-4 bg-zinc-100 dark:bg-black rounded-2xl border-none outline-indigo-500 font-medium"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                    </div>

                    {/* ID INTERNO */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-zinc-400 mb-2 ml-1">ID del Juego (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ej: CAT-01"
                            className="w-full p-4 bg-zinc-100 dark:bg-black rounded-2xl border-none outline-indigo-500 font-mono text-sm"
                            value={formData.internalId}
                            onChange={(e) => setFormData({ ...formData, internalId: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-4 py-4 rounded-2xl font-black uppercase tracking-widest text-white transition-all ${loading ? 'bg-zinc-400' : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
                            }`}
                    >
                        {loading ? "Guardando..." : "Registrar Juego"}
                    </button>
                </form>
            </div>
        </main>
    );
}