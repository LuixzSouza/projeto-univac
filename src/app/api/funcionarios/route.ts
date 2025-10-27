// # POST (Cadastrar), GET (Listar)

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ message: "API Funcionários: Lista de funcionários (placeholder)." }, { status: 200 });
}

export async function POST(request: Request) {
    return NextResponse.json({ message: "API Funcionários: Criação de novo funcionário (placeholder)." }, { status: 501 });
}
