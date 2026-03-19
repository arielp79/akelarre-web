"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBarForm() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState(""); // Estado para el teléfono
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Limpiamos el número por si ponen espacios o guiones para WhatsApp
        const cleanPhone = phone.replace(/\D/g, "");

        const res = await fetch("/api/bars", {
            method: "POST",
            body: JSON.stringify({ name, location, phone: cleanPhone }),
            headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
            router.push("/admin-master");
            router.refresh();
        }
    };

    return (
        <main className="p-8 max-w-md mx-auto bg-zinc-950 min-h-screen text-white font-sans">
            <Link href="/admin-master" className="text-zinc-500 text-xs font-bold uppercase mb-8 block">← Volver</Link>

            <h1 className="text-3xl font-black uppercase italic mb-8">Registrar <span className="text-indigo-500">Nuevo Bar</span></h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Nombre del Bar</span>
                    <input
                        placeholder="Ej: Akelarre LCB"
                        className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 outline-none focus:border-indigo-500"
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Teléfono WhatsApp (Con código de país)</span>
                    <input
                        type="tel"
                        placeholder="Ej: 5492991234567"
                        className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 outline-none focus:border-indigo-500"
                        onChange={e => setPhone(e.target.value)}
                        required
                    />
                </label>

                <label className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-500 ml-1">Ubicación</span>
                    <input
                        placeholder="Ciudad, Calle..."
                        className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 outline-none focus:border-indigo-500"
                        onChange={e => setLocation(e.target.value)}
                    />
                </label>

                <button className="bg-indigo-600 p-5 rounded-2xl font-black uppercase tracking-widest mt-4 hover:bg-indigo-500 transition-all">
                    Crear Establecimiento
                </button>
            </form>
        </main>
    );
}