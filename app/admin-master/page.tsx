"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode"; // Importamos la librería

export default function AkelarreMaster() {
    const [bars, setBars] = useState<any[]>([]);
    const [editingBar, setEditingBar] = useState<any>(null);
    const [qrUrl, setQrUrl] = useState<string | null>(null); // Estado para el QR

    const fetchBars = async () => {
        const res = await fetch("/api/bars");
        const data = await res.json();
        setBars(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        fetchBars();
    }, []);

    // FUNCIÓN PARA GENERAR EL QR
    const generateQR = async (slug: string) => {
        // La URL apunta a la raíz del bar donde el cliente ve los juegos
        const url = `${window.location.origin}/${slug}`;
        try {
            const qrDataUrl = await QRCode.toDataURL(url, {
                width: 400,
                margin: 2,
                color: {
                    dark: "#4f46e5", // Color Índigo acorde a tu diseño
                    light: "#ffffff",
                },
            });
            setQrUrl(qrDataUrl);
        } catch (err) {
            console.error("Error generando QR:", err);
        }
    };

    const deleteBar = async (slug: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar "${name}"? Se borrarán también todos sus juegos.`)) return;

        const res = await fetch(`/api/bars?slug=${slug}`, { method: "DELETE" });
        if (res.ok) {
            setBars(prev => prev.filter(b => b.slug !== slug));
        } else {
            alert("Error al eliminar el bar");
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/bars", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editingBar._id,
                name: editingBar.name,
                phone: editingBar.phone,
                location: editingBar.location
            }),
        });

        if (res.ok) {
            setEditingBar(null);
            fetchBars();
        }
    };

    return (
        <main className="p-8 max-w-5xl mx-auto font-sans bg-zinc-50 min-h-screen">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">A</div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">AKELARRE <span className="text-zinc-400">MASTER</span></h1>
                </div>
                <Link href="/admin-master/new-bar" className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all">
                    + Agregar Bar
                </Link>
            </header>

            <div className="grid gap-4">
                {bars.map(bar => (
                    <div key={bar.slug} className="bg-white border p-6 rounded-3xl flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900">{bar.name}</h2>
                            <p className="text-zinc-500 font-mono text-xs italic">{bar.slug}</p>
                            <p className="text-indigo-600 text-xs font-bold mt-1">{bar.phone || "Sin teléfono"}</p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* BOTÓN QR */}
                            <button
                                onClick={() => generateQR(bar.slug)}
                                className="p-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-700 transition-all"
                                title="Generar QR"
                            >
                                📱
                            </button>

                            <Link href={`/admin-master/bars/${bar.slug}`} className="bg-zinc-100 px-4 py-2 rounded-xl font-bold text-sm text-zinc-600 hover:bg-zinc-200">
                                Juegos
                            </Link>

                            <button
                                onClick={() => setEditingBar(bar)}
                                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                            >
                                ✏️
                            </button>

                            <button
                                onClick={() => deleteBar(bar.slug, bar.name)}
                                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE QR */}
            {qrUrl && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl">
                        <h2 className="text-2xl font-black uppercase italic mb-2">Código QR</h2>
                        <p className="text-zinc-500 text-[10px] mb-6 font-black uppercase tracking-widest">Escaneá para pedir juegos</p>

                        <div className="bg-zinc-50 p-4 rounded-3xl mb-6 inline-block border-4 border-zinc-100">
                            <img src={qrUrl} alt="QR Code" className="w-64 h-64 mx-auto" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={qrUrl}
                                download="akelarre-qr.png"
                                className="bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all text-sm"
                            >
                                Descargar QR
                            </a>
                            <button
                                onClick={() => setQrUrl(null)}
                                className="text-zinc-400 font-bold py-2 hover:text-zinc-900 transition-colors uppercase text-xs tracking-widest"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE EDICIÓN */}
            {editingBar && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <form onSubmit={handleUpdate} className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-black mb-6 uppercase italic tracking-tighter">Editar Bar</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-indigo-500"
                                value={editingBar.name}
                                onChange={e => setEditingBar({ ...editingBar, name: e.target.value })}
                                placeholder="Nombre"
                            />
                            <input
                                className="p-4 bg-zinc-100 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-indigo-500"
                                value={editingBar.phone || ""}
                                onChange={e => setEditingBar({ ...editingBar, phone: e.target.value })}
                                placeholder="WhatsApp (549...)"
                            />
                            <div className="flex gap-2 mt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase">Guardar</button>
                                <button type="button" onClick={() => setEditingBar(null)} className="flex-1 bg-zinc-200 py-4 rounded-2xl font-bold">Cancelar</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}