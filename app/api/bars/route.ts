import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bar from "@/models/Bars";
import Game from "@/models/Games"; // Asegúrate de que el nombre coincida con tu modelo

// 1. OBTENER BARES (GET)
export async function GET() {
    try {
        await connectDB();
        const bars = await Bar.find({});
        return NextResponse.json(bars);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener bares" }, { status: 500 });
    }
}

// 2. CREAR BAR (POST)
export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        // Generar slug automático
        const slug = data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const newBar = await Bar.create({
            name: data.name,
            location: data.location,
            phone: data.phone, // Importante para WhatsApp
            slug: slug,
        });

        return NextResponse.json(newBar, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 3. EDITAR BAR (PUT)
export async function PUT(request: Request) {
    try {
        await connectDB();
        const { id, ...updates } = await request.json();
        const updatedBar = await Bar.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json(updatedBar);
    } catch (error) {
        return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
    }
}

// 4. BORRAR BAR (DELETE)
export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400 });

        // Borrado en cascada: eliminamos juegos de ese bar primero
        await Game.deleteMany({ barSlug: slug });
        // Eliminamos el bar
        await Bar.findOneAndDelete({ slug });

        return NextResponse.json({ message: "Bar y juegos eliminados correctamente" });
    } catch (error) {
        return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
    }
}