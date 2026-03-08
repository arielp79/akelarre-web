import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Bar from "@/models/Bars";

export async function POST(request: Request) {
    try {
        await connectDB();
        const data = await request.json();

        // El slug se crea a partir del nombre (ej: "Aquelarre LCB" -> "aquelarre-lcb")
        const slug = data.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const newBar = await Bar.create({
            name: data.name,
            location: data.location,
            slug: slug,
        });

        return NextResponse.json(newBar, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Error al crear el bar" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
        const bars = await Bar.find({});
        return NextResponse.json(bars);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener bares" }, { status: 500 });
    }
}