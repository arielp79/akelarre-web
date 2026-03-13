"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AkelarreMaster() {
    const [bars, setBars] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/bars").then(res => res.json()).then(setBars);
    }, []);

    return (
        <main className="p-8 max-w-5xl mx-auto font-sans">
            {/* 1. TÍTULO Y LOGO */}
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">A</div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">AKELARRE <span className="text-zinc-400">MASTER</span></h1>
                </div>
                {/* 2. BOTÓN AGREGAR BAR */}
                <Link href="/admin-master/new-bar" className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-zinc-800 transition-all">
                    + Agregar Bar
                </Link>
            </header>

            {/* LISTA DE BARES */}
            <div className="grid gap-4">
                {bars.map(bar => (
                    <div key={bar.slug} className="bg-white border p-6 rounded-3xl flex justify-between items-center shadow-sm">
                        <div>
                            <h2 className="text-2xl font-bold">{bar.name}</h2>
                            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase italic">{bar.slug}</p>
                        </div>
                        {/* BOTÓN DETALLE DE JUEGOS */}
                        <Link href={`/admin-master/bars/${bar.slug}`} className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all">
                            Ver Juegos →
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}