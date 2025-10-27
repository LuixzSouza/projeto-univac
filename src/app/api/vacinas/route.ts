// # POST (Cadastrar), GET (Listar)

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: "API Tipos de Vacina: Lista de tipos (placeholder)." }, { status: 200 });
}

export async function POST(request: Request) {
    return NextResponse.json({ message: "API Tipos de Vacina: Criação de novo tipo (placeholder)." }, { status: 501 });
}
