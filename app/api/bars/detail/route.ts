import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bar from "@/models/Bars"; // Basado en tu archivo 4.txt [cite: 50, 67]

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        if (!slug) return NextResponse.json({ error: "Falta el slug" }, { status: 400 });

        const bar = await Bar.findOne({ slug });

        if (!bar) return NextResponse.json({ error: "Bar no encontrado" }, { status: 404 });

        return NextResponse.json(bar);
    } catch (error) {
        return NextResponse.json({ error: "Error en el servidor" }, { status: 500 });
    }
}