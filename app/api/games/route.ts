import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Games";

export async function GET(request: Request) {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const barSlug = searchParams.get("barSlug");
    const games = await Game.find({ barSlug });
    return NextResponse.json(games);
}

export async function POST(request: Request) {
    await connectDB();
    const data = await request.json();
    const newGame = await Game.create(data);
    return NextResponse.json(newGame);
}