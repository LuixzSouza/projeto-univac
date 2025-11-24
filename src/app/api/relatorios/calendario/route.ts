// # GET (Gera dados p/ "Visualizar calendário de aplicações")

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        message: "API Relatórios/Calendário: Placeholder rodando.", 
        data: {
            events: [],
            summary: "Nenhum dado de relatório disponível."
        }
    }, { status: 200 });
}
