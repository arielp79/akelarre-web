import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Games";

// Actualizamos la firma de la función para aceptar Promise en params
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        // IMPORTANTE: Debemos esperar (await) a los params
        const { id } = await context.params;

        const game = await Game.findById(id);

        if (!game) {
            return NextResponse.json({ error: "Juego no encontrado" }, { status: 404 });
        }

        return NextResponse.json(game);
    } catch (error) {
        console.error("Error en GET /api/games/[id]:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}