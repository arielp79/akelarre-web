import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";
import Game from "@/models/Games"; // IMPORTANTE: Necesitamos el modelo Game

// Configuramos Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        // Creamos el registro en la base de datos
        const newLoan = await Loan.create({
            gameId: data.gameId,
            gameName: data.gameName,
            barSlug: data.barSlug,
            fullName: data.fullName,
            address: data.address, // <--- REVISAR QUE VENGA DEL FRONT
            city: data.city
        });

        // Marcamos el juego como NO disponible
        await Game.findByIdAndUpdate(data.gameId, { available: false });

        return NextResponse.json(newLoan, { status: 201 });
    } catch (error: any) {
        console.error("ERROR EN LOANS API:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const barSlug = searchParams.get("barSlug");
        const gameId = searchParams.get("gameId"); // Agregamos filtro por gameId para el detalle

        // Construimos la consulta dinámicamente
        const query: any = {};
        if (barSlug) query.barSlug = barSlug;
        if (gameId) query.gameId = gameId;

        const loans = await Loan.find(query).sort({ createdAt: -1 });
        return NextResponse.json(loans);
    } catch (error) {
        console.error("Error al obtener préstamos:", error);
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}