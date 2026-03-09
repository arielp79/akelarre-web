"use client";
import AdminNav from "@/components/AdminNav";
import React, { useEffect, useState, use } from "react";

export default function BarAdminPage({ params }: { params: Promise<{ barSlug: string }> }) {
    const { barSlug } = use(params);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputKey, setInputKey] = useState("");

    // 1. Verificamos si ya tiene la clave guardada al entrar
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
                fetchLoans();
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

    const fetchLoans = async () => {
        const res = await fetch(`/api/loans?barSlug=${barSlug}`);
        const data = await res.json();
        setLoans(data);
        setLoading(false);
    };

    const handleReturn = async (id: string) => {
        if (!confirm("¿Confirmas que el juego fue devuelto?")) return;
        const res = await fetch(`/api/loans/${id}`, { method: "DELETE" });
        if (res.ok) fetchLoans();
    };

    // PANTALLA A: Cargando
    if (loading && !isAuthenticated) return <div className="p-10 text-center animate-pulse">Cargando seguridad...</div>;

    // PANTALLA B: Bloqueo (Si no está autenticado)
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans">
                <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 w-full max-w-sm shadow-2xl">
                    <h1 className="text-white text-2xl font-black mb-2 text-center tracking-tighter">AKELARRE <span className="text-indigo-500">ADMIN</span></h1>
                    <p className="text-zinc-500 text-sm mb-6 text-center">Introduce la Master Key para gestionar {barSlug}</p>
                    <input
                        type="password"
                        placeholder="Master Key"
                        className="w-full p-3 rounded-xl bg-black border border-zinc-700 text-white mb-4 focus:border-indigo-500 outline-none transition-all"
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && verifyKey(inputKey)}
                    />
                    <button
                        onClick={() => verifyKey(inputKey)}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all active:scale-95"
                    >
                        Entrar al Panel
                    </button>
                </div>
            </div>
        );
    }

    // PANTALLA C: Tu panel original (Solo se ve si isAuthenticated es true)
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <AdminNav barSlug={barSlug} />
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">
                            {barSlug.toUpperCase()} <span className="text-indigo-600">ADMIN</span>
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Gestión de préstamos activos</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 px-4 py-2 rounded-2xl shadow-sm">
                        <span className="text-2xl font-bold text-indigo-600">{loans.length}</span>
                        <span className="ml-2 text-xs font-bold uppercase tracking-widest text-zinc-400">En uso</span>
                    </div>
                </header>

                <div className="grid gap-4">
                    {loans.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-400">No hay juegos prestados en este momento.</p>
                        </div>
                    ) : (
                        loans.map((loan: any) => (
                            <div key={loan._id} className="group bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{loan.gameName}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded-full">
                                                Mesa {loan.tableNumber}
                                            </span>
                                            <span className="text-zinc-400 text-xs">{new Date(loan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs</span>
                                        </div>
                                    </div>
                                    <a
                                        href={loan.dniImageUrl}
                                        target="_blank"
                                        className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                                        title="Ver DNI"
                                    >
                                        🪪
                                    </a>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t dark:border-zinc-800">
                                    <div className="w-full sm:w-auto text-sm">
                                        <p className="font-semibold dark:text-zinc-300">{loan.fullName}</p>
                                        <p className="text-zinc-500 dark:text-zinc-500">{loan.phone}</p>
                                    </div>
                                    <button
                                        onClick={() => handleReturn(loan._id)}
                                        className="w-full sm:w-auto px-6 py-2.5 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
                                    >
                                        Confirmar Devolución
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}