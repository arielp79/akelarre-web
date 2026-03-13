"use client";
import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function GameLoanDetail({ params }: { params: Promise<{ barSlug: string, gameId: string }> }) {
    const { barSlug, gameId } = use(params);
    const router = useRouter();
    const [loan, setLoan] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Buscamos el préstamo activo para este juego específico
        fetch(`/api/loans?gameId=${gameId}`)
            .then(res => res.json())
            .then(data => {
                // Filtramos el préstamo que coincida con el juego
                setLoan(data[0] || null);
                setLoading(false);
            });
    }, [gameId]);

    const handleReturn = async () => {
        if (!confirm("¿El juego volvió a la estantería?")) return;
        const res = await fetch(`/api/loans/${loan._id}`, { method: "DELETE" });
        if (res.ok) router.push(`/admin/${barSlug}`);
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Cargando datos del cliente...</div>;

    if (!loan) return (
        <div className="p-10 text-center font-sans">
            <h1 className="text-zinc-400">Este juego no tiene préstamos activos.</h1>
            <Link href={`/admin/${barSlug}`} className="text-indigo-600 font-bold mt-4 block underline">Volver al panel</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-zinc-950 p-6 font-sans text-white">
            <div className="max-w-md mx-auto">
                <Link href={`/admin/${barSlug}`} className="text-zinc-500 font-bold mb-8 block text-sm uppercase">← Volver</Link>

                <header className="mb-10">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        Detalle del <br /> <span className="text-indigo-500">Préstamo</span>
                    </h1>
                </header>

                {/* FICHA DEL CLIENTE */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                    {/* FOTO DNI */}
                    <div className="relative h-64 bg-black">
                        <img
                            src={loan.dniImageUrl}
                            alt="DNI del cliente"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Foto DNI Registrada</p>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="mb-6">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Juego Prestado</p>
                            <h2 className="text-2xl font-bold leading-tight">{loan.gameName}</h2>
                        </div>

                        {/* FICHA DEL CLIENTE ACTUALIZADA */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cliente</p>
                                <p className="font-bold">{loan.fullName}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Mesa</p>
                                <p className="font-bold text-xl text-indigo-400">{loan.tableNumber}</p>
                            </div>

                            {/* NUEVO CAMPO: TELÉFONO */}
                            <div className="col-span-2 py-3 border-y border-zinc-800/50">
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">WhatsApp / Teléfono</p>
                                <a
                                    href={`https://wa.me/${loan.phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    className="font-bold text-lg text-green-500 flex items-center gap-2 hover:underline"
                                >
                                    <span>📱</span> {loan.phone}
                                </a>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Fecha</p>
                                <p className="font-medium text-sm text-zinc-300">{new Date(loan.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Hora Inicio</p>
                                <p className="font-medium text-sm text-zinc-300">{new Date(loan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</p>
                            </div>
                        </div>

                        {/* ACCIÓN DE DEVOLUCIÓN */}
                        <button
                            onClick={handleReturn}
                            className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                        >
                            Confirmar Devolución
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}