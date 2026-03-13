"use client";

import React, { useState, use, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type PageProps = {
  params: Promise<{
    barSlug: string;
    gameId: string;
  }>;
};

export default function RequestGamePage({ params }: PageProps) {
  const { barSlug, gameId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const mesaDelQR = searchParams.get("mesa");

  // --- ESTADOS ---
  const [game, setGame] = useState<{ _id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- BUSCAR DATOS DEL JUEGO ---
  useEffect(() => {
    fetch(`/api/games/${gameId}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    if (mesaDelQR) {
      setTableNumber(mesaDelQR);
    }
  }, [gameId, mesaDelQR]);

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
    if (!game || !dniFile) return;

    setSubmitting(true);

    const reader = new FileReader();
    reader.readAsDataURL(dniFile);

    reader.onloadend = async () => {
      const base64Image = reader.result;

      const loanData = {
        gameId: game._id, // Usamos _id de MongoDB
        gameName: game.name,
        barSlug: barSlug,
        fullName: fullName,
        phone: phone,
        tableNumber: tableNumber,
        dniImage: base64Image, // El backend debe procesar este base64 hacia Cloudinary
      };

      try {
        const response = await fetch("/api/loans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loanData),
        });

        if (response.ok) {
          setIsSuccess(true);
        } else {
          alert("Error al procesar el pedido.");
        }
      } catch (error) {
        alert("Error de conexión.");
      } finally {
        setSubmitting(false);
      }
    };
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Cargando juego...</div>;
  if (!game) return <div className="p-10 text-center">Juego no encontrado</div>;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center p-6 text-white text-center font-sans">
        <div className="bg-white/20 p-6 rounded-full mb-6 animate-bounce">
          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-5xl font-black mb-2 italic tracking-tighter">¡LISTO!</h1>
        <p className="text-xl font-medium opacity-90">Mostrale esta pantalla al mozo para retirar tu juego.</p>
        <button
          onClick={() => router.push(`/${barSlug}`)}
          className="mt-10 px-8 py-3 bg-white text-emerald-600 rounded-2xl font-bold uppercase text-sm shadow-xl active:scale-95 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <div className="mx-auto max-w-xl">
        <header className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase italic leading-none">
            Pedir <br /> <span className="text-indigo-600">{game.name}</span>
          </h1>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-2">Bar: {barSlug.replace("-", " ")}</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">

          <div className="space-y-4">
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nombre Completo</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Tu nombre"
                className="rounded-2xl border-none bg-zinc-100 p-4 font-bold dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-zinc-400 ml-1">Mesa</span>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  required
                  placeholder="Ej: 5"
                  className="rounded-2xl border-none bg-zinc-100 p-4 font-bold dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-zinc-400 ml-1">WhatsApp</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="299..."
                  className="rounded-2xl border-none bg-zinc-100 p-4 font-bold dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-zinc-400 ml-1">Identidad</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              required
              className="hidden"
              id="dni-upload"
            />
            <label
              htmlFor="dni-upload"
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed p-8 transition-all ${dniFile ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700'
                }`}
            >
              <span className="text-3xl">📷</span>
              <span className="text-xs font-bold uppercase tracking-tight text-zinc-500">
                {dniFile ? "Foto Capturada ✓" : "Tocar para sacar foto al DNI"}
              </span>
            </label>
          </div>

          {previewUrl && (
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
              <img
                src={previewUrl}
                alt="DNI Preview"
                className="h-auto w-full max-h-48 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !dniFile}
            className="mt-4 w-full rounded-2xl bg-zinc-900 py-5 text-sm font-black uppercase tracking-[0.2em] text-white disabled:opacity-30 dark:bg-zinc-50 dark:text-zinc-900 active:scale-95 transition-all shadow-lg"
          >
            {submitting ? "Procesando..." : "Confirmar Pedido"}
          </button>
        </form>
      </div>
    </main>
  );
}