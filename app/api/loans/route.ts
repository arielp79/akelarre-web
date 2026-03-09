import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";

// Configuramos Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!, // Agregué el ! por consistencia
});

// --- FUNCIÓN PARA GUARDAR (POST) ---
export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        const uploadResponse = await cloudinary.uploader.upload(data.dniImage, {
            folder: "akelarre_dnis",
        });

        const newLoan = await Loan.create({
            gameId: data.gameId,
            gameName: data.gameName,
            barSlug: data.barSlug,
            fullName: data.fullName,
            phone: data.phone,
            tableNumber: data.tableNumber,
            dniImageUrl: uploadResponse.secure_url,
        });

        return NextResponse.json({ message: "Éxito", id: newLoan._id }, { status: 201 });
    } catch (error) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Fallo en el servidor" }, { status: 500 });
    }
}

// --- NUEVA FUNCIÓN PARA CONSULTAR (GET) ---
export async function GET(request: Request) {
    try {
        await connectDB();

        // Obtenemos el barSlug de la URL (ej: /api/loans?barSlug=lcb)
        const { searchParams } = new URL(request.url);
        const barSlug = searchParams.get("barSlug");

        // Si el admin pide un bar específico, filtramos. Si no, trae todos.
        const query = barSlug ? { barSlug } : {};

        const loans = await Loan.find(query).sort({ createdAt: -1 });

        return NextResponse.json(loans);
    } catch (error) {
        console.error("Error al obtener préstamos:", error);
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}