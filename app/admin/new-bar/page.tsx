"use client";
import React, { useState } from "react";

export default function NewBarPage() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch("/api/bars", {
            method: "POST",
            body: JSON.stringify({ name, location }),
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert("Bar creado con éxito");
            setName("");
            setLocation("");
        }
    };

    return (
        <main className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Registrar Nuevo Bar</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    placeholder="Nombre del Bar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded dark:bg-zinc-900"
                    required
                />
                <input
                    placeholder="Ubicación (Neuquén, Cipolletti, etc.)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="p-2 border rounded dark:bg-zinc-900"
                />
                <button className="bg-blue-600 text-white p-2 rounded font-bold">Crear Bar</button>
            </form>
        </main>
    );
}