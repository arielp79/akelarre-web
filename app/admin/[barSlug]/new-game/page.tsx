"use client";
import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default function NewGamePage({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const router = useRouter();
    const [name, setName] = useState("");
    const [players, setPlayers] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/games", {
            method: "POST",
            body: JSON.stringify({ name, players, time, barSlug }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            alert("Juego agregado con éxito");
            router.push(`/admin/${barSlug}`); // Volver al panel
        }
    };

    return (
        <main className="p-8 max-w-md mx-auto font-sans">
            <AdminNav barSlug={barSlug} />
            <h1 className="text-2xl font-bold mb-6">Nuevo Juego para {barSlug}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    placeholder="Nombre del Juego (ej: Catan)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 border rounded-xl dark:bg-zinc-900 outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
                <input
                    placeholder="Jugadores (ej: 2-4)"
                    value={players}
                    onChange={(e) => setPlayers(e.target.value)}
                    className="p-3 border rounded-xl dark:bg-zinc-900"
                />
                <input
                    placeholder="Duración (ej: 45 min)"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="p-3 border rounded-xl dark:bg-zinc-900"
                />
                <button className="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors">
                    Guardar Juego
                </button>
            </form>
        </main>
    );
}