import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans"; // El modelo que definimos antes

export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        // Creamos el registro en la base de datos
        const newLoan = await Loan.create(data);

        return NextResponse.json({ message: "Préstamo registrado", id: newLoan._id }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error al guardar el préstamo" }, { status: 500 });
    }
}