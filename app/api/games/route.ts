import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Games";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const barSlug = searchParams.get("barSlug");
        const available = searchParams.get("available"); // Capturamos el filtro

        if (!barSlug) {
            return NextResponse.json({ error: "barSlug es requerido" }, { status: 400 });
        }

        // Construimos el objeto de búsqueda
        const query: any = { barSlug };

        // Si en la URL viene ?available=true, filtramos los que están libres
        if (available === "true") {
            query.available = true;
        }

        const games = await Game.find(query).sort({ name: 1 }); // Ordenados por nombre
        return NextResponse.json(games);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener juegos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await connectDB();
    const data = await request.json();
    const newGame = await Game.create(data);
    return NextResponse.json(newGame);
}