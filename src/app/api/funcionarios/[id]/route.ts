// # GET (Visualizar), PUT (Atualizar), DELETE (Excluir)

import { NextResponse } from 'next/server';

interface DynamicSegment {
    params: {
        id: string;
    };
}

export async function GET(request: Request, { params }: DynamicSegment) {
    const id = params.id;
    return NextResponse.json({ message: `Buscar funcionário com ID: ${id}. Rota OK.` }, { status: 200 });
}

export async function PUT(request: Request, { params }: DynamicSegment) {
    const id = params.id;
    return NextResponse.json({ message: `PUT (Atualizar) funcionário ${id}: Rota OK.` }, { status: 501 });
}


export async function DELETE(request: Request, { params }: DynamicSegment) {
    const id = params.id;
    return NextResponse.json({ message: `DELETE (Excluir) funcionário ${id}: Rota OK.` }, { status: 501 });
}