import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { key } = await request.json();

    if (key === process.env.ADMIN_KEY) {
        return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
}