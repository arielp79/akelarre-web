"use client";

import React, { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";

type PageProps = {
  params: Promise<{
    barSlug: string;
    gameId: string;
  }>;
};

export default function RequestGamePage({ params }: PageProps) {
  const { barSlug, gameId } = use(params);
  const router = useRouter();

  const [game, setGame] = useState<{ _id: string; name: string } | null>(null);
  const [barPhone, setBarPhone] = useState(""); // <--- Estado para el teléfono real
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. BUSCAR DATOS DEL JUEGO Y DEL BAR
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscamos el juego
        const gameRes = await fetch(`/api/games/${gameId}`);
        const gameData = await gameRes.json();
        setGame(gameData);

        // Buscamos el bar para obtener su teléfono REAL
        const barRes = await fetch(`/api/bars/detail?slug=${barSlug}`);
        const barData = await barRes.json();
        if (barData && barData.phone) {
          setBarPhone(barData.phone);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameId, barSlug]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || isSubmitting || !barPhone) {
      alert("Faltan datos del bar o el juego.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. REGISTRAMOS EL PRÉSTAMO
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: game._id,
          gameName: game.name,
          barSlug: barSlug,
          fullName: fullName,
          address: address,
          city: city
        }),
      });

      if (response.ok) {
        // 2. ABRIMOS WHATSAPP con el teléfono dinámico
        const message = `¡Hola! Soy *${fullName}* de *${city}* (${address}). Me gustaría pedir el juego: *${game.name}*.`;

        // El link ahora usa barPhone de la base de datos
        const whatsappUrl = `https://wa.me/${barPhone}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
        router.push(`/${barSlug}/success`);
      } else {
        alert("Hubo un error al procesar el pedido.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-zinc-500 font-sans uppercase font-black">Cargando datos...</div>;
  if (!game) return <div className="p-10 text-center font-sans">Juego no encontrado</div>;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-10 font-sans text-white">
      <div className="mx-auto max-w-xl">
        <header className="mb-10 text-center">
          <span className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 block">Akelarre Delivery</span>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-tight">
            Estás pidiendo: <br />
            <span className="text-indigo-600 text-5xl not-italic tracking-normal">{game.name}</span>
          </h1>
        </header>

        <form onSubmit={handleOrder} className="flex flex-col gap-6 rounded-[2.5rem] bg-zinc-900 p-8 border border-zinc-800 shadow-2xl">
          <div className="space-y-5">
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Nombre Completo</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="rounded-2xl border-none bg-black p-4 font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Dirección de entrega</span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="rounded-2xl border-none bg-black p-4 font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase text-zinc-500 ml-2 tracking-widest">Ciudad</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="rounded-2xl border-none bg-black p-4 font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !barPhone}
            className="mt-6 w-full rounded-3xl bg-emerald-600 py-6 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
          >
            {!barPhone ? "Cargando Teléfono..." : (isSubmitting ? "Procesando..." : "Pedir por WhatsApp 📱")}
          </button>
        </form>
      </div>
    </main>
  );
}