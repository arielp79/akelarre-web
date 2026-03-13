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

        // 1. Subir DNI a Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(data.dniImage, {
            folder: `akelarre/${data.barSlug}/dnis`, // Organizado por bar
        });

        // 2. Crear el Préstamo
        const newLoan = await Loan.create({
            gameId: data.gameId,
            gameName: data.gameName,
            barSlug: data.barSlug,
            fullName: data.fullName,
            phone: data.phone,
            tableNumber: data.tableNumber,
            dniImageUrl: uploadResponse.secure_url,
        });

        // 3. ACTUALIZACIÓN CRÍTICA: Marcar el juego como PRESTADO
        // Esto hace que desaparezca automáticamente de la lista del cliente
        await Game.findByIdAndUpdate(data.gameId, { available: false });

        return NextResponse.json({ message: "Éxito", id: newLoan._id }, { status: 201 });
    } catch (error) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Fallo en el servidor" }, { status: 500 });
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