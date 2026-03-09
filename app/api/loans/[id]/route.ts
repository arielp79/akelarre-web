import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

        const deletedLoan = await Loan.findByIdAndDelete(id);

        if (!deletedLoan) {
            return NextResponse.json({ error: "Préstamo no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Juego devuelto con éxito" });
    } catch (error) {
        return NextResponse.json({ error: "Error al procesar devolución" }, { status: 500 });
    }
}