import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Games";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const game = await Game.findById(params.id);
        if (!game) return NextResponse.json({ error: "Juego no encontrado" }, { status: 404 });
        return NextResponse.json(game);
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}