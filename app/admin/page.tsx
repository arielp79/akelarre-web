"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
    const [bars, setBars] = useState([]);

    useEffect(() => {
        fetch("/api/bars").then(res => res.json()).then(setBars);
    }, []);

    return (
        <main className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Mis Bares</h1>
                <Link href="/admin/new-bar" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                    + Nuevo Bar
                </Link>
            </div>

            <div className="grid gap-4">
                {bars.map((bar: any) => (
                    <div key={bar._id} className="p-6 bg-white dark:bg-zinc-900 border rounded-xl flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold">{bar.name}</h2>
                            <p className="text-zinc-500 text-sm">Ruta: /{bar.slug}</p>
                        </div>
                        <Link href={`/admin/${bar.slug}`} className="text-blue-500 font-medium">
                            Ver Préstamos →
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}