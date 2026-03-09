import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";

// Actualizamos la firma para que acepte Promise en params
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        // DEBEMOS esperar a los params antes de usar el ID
        const { id } = await context.params;

        const deletedLoan = await Loan.findByIdAndDelete(id);

        if (!deletedLoan) {
            return NextResponse.json({ error: "Préstamo no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Préstamo devuelto correctamente" });
    } catch (error) {
        console.error("Error en DELETE /api/loans/[id]:", error);
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}