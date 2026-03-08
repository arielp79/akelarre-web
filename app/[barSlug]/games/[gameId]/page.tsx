"use client";

import React, { useState, use } from "react";

// Simulamos la base de datos de juegos (esto debería estar en un archivo aparte luego)
const GAMES = [
  { id: "1", name: "Catan" },
  { id: "2", name: "Dixit" },
  { id: "3", name: "Dobble" },
];

type PageProps = {
  params: Promise<{
    barSlug: string;
    gameId: string;
  }>;
};

export default function RequestGamePage({ params }: PageProps) {
  const { barSlug, gameId } = use(params);

  // 1. Buscamos el juego para que la variable 'game' exista
  const game = GAMES.find((g) => g.id === gameId);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDniFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !dniFile) return; // No enviamos si no hay juego o no sacó la foto

    setSubmitting(true);

    // 1. Convertimos la foto a un formato que el servidor entienda (Base64)
    const reader = new FileReader();
    reader.readAsDataURL(dniFile);

    reader.onloadend = async () => {
      const base64Image = reader.result;

      const loanData = {
        gameId: game.id,
        gameName: game.name,
        barSlug: barSlug,
        fullName: fullName,
        phone: phone,
        tableNumber: tableNumber,
        dniImage: base64Image, // Enviamos la FOTO REAL, no el texto provisorio
      };

      try {
        const response = await fetch("/api/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loanData),
        });

        if (response.ok) {
          setMessage("¡Pedido confirmado! Acércate a la ludoteca por tu juego.");
          setFullName("");
          setPhone("");
          setTableNumber("");
          setDniFile(null);
          setPreviewUrl(null);
        } else {
          setMessage("Error al procesar el pedido.");
        }
      } catch (error) {
        setMessage("Error de conexión con el servidor.");
      } finally {
        setSubmitting(false);
      }
    };
  };

  // Si el ID del juego no existe en nuestra lista
  if (!game) {
    return <div className="p-10 text-center">Juego no encontrado</div>;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 font-sans dark:bg-black">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Pedir {game.name} en {barSlug.replace("-", " ")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          <label className="flex flex-col gap-1.5 text-sm">
            <span>Nombre Completo *</span>
            <input
              type="text"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-lg border p-2 dark:bg-zinc-950"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span>Número de Mesa *</span>
            <input
              type="text"
              name="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
              className="rounded-lg border p-2 dark:bg-zinc-950"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span>Teléfono (WhatsApp) *</span>
            <input
              type="tel"
              name="phone"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: 2991234567"
              required
              className="rounded-lg border p-2 dark:bg-zinc-950"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span>Foto del DNI *</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              required
              className="hidden" // Lo ocultamos para usar un botón más lindo
              id="dni-upload"
            />
            <label
              htmlFor="dni-upload"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 p-8 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700"
            >
              <span className="text-sm font-medium">📷 Tocar para sacar foto al DNI</span>
            </label>
          </label>

          {previewUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border-2 border-zinc-200 dark:border-zinc-700">
              <p className="bg-zinc-100 p-1 text-center text-xs text-zinc-500 dark:bg-zinc-800">Vista previa del documento</p>
              <img
                src={previewUrl}
                alt="DNI Preview"
                className="h-auto w-full max-h-64 object-contain"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-full bg-zinc-900 py-3 font-bold text-white disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {submitting ? "Procesando..." : "Confirmar Pedido"}
          </button>

          {message && <p className="mt-4 text-center text-sm font-medium text-emerald-500">{message}</p>}
        </form>
      </div>
    </main>
  );
}