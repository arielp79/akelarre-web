import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Loan from "@/models/Loans";

// Configuramos Cloudinary con las variables que pusiste en Netlify
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        // Subimos la imagen base64 a Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(data.dniImage, {
            folder: "akelarre_dnis",
        });

        // Guardamos en MongoDB con la URL real de la foto
        const newLoan = await Loan.create({
            gameId: data.gameId,
            gameName: data.gameName,
            barSlug: data.barSlug,
            fullName: data.fullName,
            phone: data.phone,
            tableNumber: data.tableNumber,
            dniImageUrl: uploadResponse.secure_url, // URL de Cloudinary
        });

        return NextResponse.json({ message: "Éxito", id: newLoan._id }, { status: 201 });
    } catch (error) {
        console.error("Error detallado:", error);
        return NextResponse.json({ error: "Fallo en el servidor" }, { status: 500 });
    }
}