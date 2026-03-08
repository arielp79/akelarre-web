"use client";
import React, { useEffect, useState } from "react";

export default function BarAdminPage({ params }: { params: { barSlug: string } }) {
    const [loans, setLoans] = useState([]);

    useEffect(() => {
        // Aquí haremos un fetch a /api/loans?barSlug=...
        fetch(`/api/loans?barSlug=${params.barSlug}`)
            .then((res) => res.json())
            .then((data) => setLoans(data));
    }, [params.barSlug]);

    return (
        <div className="p-6 bg-zinc-50 min-h-screen dark:bg-black text-zinc-900 dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Administración: {params.barSlug}</h1>

            <div className="grid gap-4">
                {loans.map((loan: any) => (
                    <div key={loan._id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border dark:border-zinc-800 flex justify-between items-center">
                        <div>
                            <p className="font-bold">{loan.gameName}</p>
                            <p className="text-sm text-zinc-500">{loan.fullName} - Mesa {loan.tableNumber}</p>
                        </div>
                        <a
                            href={loan.dniImageUrl}
                            target="_blank"
                            className="text-blue-500 text-sm underline"
                        >
                            Ver DNI
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}