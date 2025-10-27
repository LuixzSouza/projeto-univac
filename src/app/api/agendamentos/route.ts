// # POST (Agendar), GET (Listar agendamentos)

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: "API route placeholder is running", data: [] }, { status: 200 });
}

export async function POST(request: Request) {
    return NextResponse.json({ message: "API POST: Rota ainda não implementada." }, { status: 501 });
}
