"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GameAdminDetailPage({ params }: { params: Promise<{ barSlug: string, gameId: string }> }) {
    const { barSlug, gameId } = use(params);
    const [loan, setLoan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Buscamos el préstamo activo para este gameId
        fetch(`/api/loans?gameId=${gameId}`)
            .then(res => res.json())
            .then(data => {
                // Tu API devuelve un array, tomamos el primero (el actual)
                setLoan(data[0] || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [gameId]);

    const handleReturn = async () => {
        if (!loan) return;
        if (!confirm("¿Confirmás que devolvieron el juego?")) return;

        const res = await fetch(`/api/loans/${loan._id}`, { method: "DELETE" });
        if (res.ok) {
            router.push(`/admin/${barSlug}`);
            router.refresh();
        }
    };

    if (loading) return <div className="p-10 text-center text-white font-sans">Cargando...</div>;

    return (
        <main className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
            <div className="max-w-md mx-auto">
                <Link href={`/admin/${barSlug}`} className="text-zinc-500 text-xs font-bold uppercase mb-8 block underline">
                    ← Volver al Panel
                </Link>

                {!loan ? (
                    <div className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 text-center">
                        <p className="text-emerald-500 font-black italic uppercase text-2xl">Disponible</p>
                        <p className="text-zinc-500 mt-2">Nadie tiene este juego prestado actualmente.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-widest mb-4">Préstamo Activo</p>
                            <h2 className="text-3xl font-bold mb-1">{loan.fullName}</h2>
                            <p className="text-xl text-white font-black italic">MESA {loan.tableNumber}</p>
                            <p className="text-zinc-400 mt-4">WhatsApp: {loan.phone}</p>

                            {loan.dniImageUrl && (
                                <img
                                    src={loan.dniImageUrl}
                                    className="mt-6 rounded-2xl w-full h-48 object-cover border border-zinc-700"
                                    alt="DNI"
                                />
                            )}
                        </div>

                        <button
                            onClick={handleReturn}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-3xl font-black uppercase tracking-widest transition-all shadow-xl"
                        >
                            Confirmar Devolución
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}