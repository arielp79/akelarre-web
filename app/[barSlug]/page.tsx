"use client";

import React, { use } from "react";
import Link from "next/link";

type Game = {
  id: number;
  name: string;
  imageUrl?: string;
  minPlayers: number;
  maxPlayers: number;
  playTimeMinutes: number;
  category: string;
  availableCopies: number;
};

const mockGames: Game[] = [
  {
    id: 1,
    name: "Catan",
    imageUrl: "https://via.placeholder.com/400x200?text=Catan",
    minPlayers: 3,
    maxPlayers: 4,
    playTimeMinutes: 90,
    category: "Estrategia",
    availableCopies: 2,
  },
  {
    id: 2,
    name: "Dobble",
    imageUrl: "https://via.placeholder.com/400x200?text=Dobble",
    minPlayers: 2,
    maxPlayers: 8,
    playTimeMinutes: 15,
    category: "Party",
    availableCopies: 0,
  },
];

type PageProps = {
  params: Promise<{ // Correcto: Defines params como Promise
    barSlug: string;
  }>;
};

export default function BarGamesPage({ params }: PageProps) {
  const { barSlug } = use(params); // Correcto: "desenvuelves" la promesa
  const barName = barSlug.replace("-", " ");
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 font-sans dark:bg-black sm:px-6 md:px-8">
      <div className="mx-auto flex h-full max-w-5xl flex-col">
        <header className="mb-6 space-y-1 sm:mb-8">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Juegos disponibles en {barName}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 sm:text-base">
            Escoge un juego para empezar a jugar.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockGames.map((game) => {
            const isAvailable = game.availableCopies > 0;

            return (
              <article
                key={game.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    className="h-40 w-full rounded-lg object-cover"
                  />
                )}

                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
                  {game.name}
                </h2>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
                  {game.minPlayers}–{game.maxPlayers} jugadores ·{" "}
                  {game.playTimeMinutes} min · {game.category}
                </p>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${isAvailable
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800"
                    : "bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
                    }`}
                >
                  {isAvailable
                    ? `${game.availableCopies} disponibles`
                    : "No disponible"}
                </span>

                <Link
                  href={`/${barSlug}/games/${game.id}`}
                  className="mt-auto no-underline"
                >
                  <button
                    disabled={!isAvailable}
                    className={`inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 ${isAvailable
                      ? "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 focus-visible:ring-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                      : "bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                      }`}
                  >
                    {isAvailable ? "Pedir juego" : "No disponible"}
                  </button>
                </Link>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}