import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";
import Game from "@/models/Games";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        // 1. Buscamos el préstamo para saber qué juego liberar
        const loan = await Loan.findById(id);
        if (!loan) return NextResponse.json({ error: "Préstamo no encontrado" }, { status: 404 });

        // 2. Liberamos el juego (isBorrowed: false)
        await Game.findByIdAndUpdate(loan.gameId, { available: true });

        // 3. Borramos el préstamo
        await Loan.findByIdAndDelete(id);

        return NextResponse.json({ message: "Juego devuelto y liberado" });
    } catch (error) {
        return NextResponse.json({ error: "Error al procesar devolución" }, { status: 500 });
    }
}