"use client";

import React, { useState, use } from "react"; // Importamos 'use'

type PageProps = {
  params: Promise<{ // Definimos params como una Promesa
    barSlug: string;
    gameId: string;
  }>;
};

export default function RequestGamePage({ params }: PageProps) {
  // 1. Resolvemos los parámetros (Soluciona tu error de la captura)
  const { barSlug, gameId } = use(params);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Estado para la foto
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Manejador de cambio de archivo (DNI)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setDniFile(file);

    if (file) {
      // Creamos una URL temporal para mostrar la imagen en el celu
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniFile) {
      setMessage("Por favor, saca una foto de tu DNI.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    // Simulación de envío
    setTimeout(() => {
      setSubmitting(false);
      setMessage("Pedido enviado correctamente (simulado).");
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 font-sans dark:bg-black">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Pedir juego #{gameId} en {barSlug.replace("-", " ")}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900">
          {/* ... (campos de nombre y email iguales) ... */}

          <label className="flex flex-col gap-1.5 text-sm">
            <span>Teléfono (WhatsApp) *</span>
            <input
              type="tel"
              inputMode="tel" // Forzamos teclado numérico en el móvil
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
              capture="environment" // Sugiere abrir la cámara trasera directamente
              onChange={handleFileChange}
              required
              className="text-xs"
            />
          </label>

          {/* Previsualización Responsive */}
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

          {message && <p className="text-center text-sm text-emerald-500">{message}</p>}
        </form>
      </div>
    </main>
  );
}