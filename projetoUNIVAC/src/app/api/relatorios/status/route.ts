// # GET (Gera dados p/ "Gráficos de status de vacina")

import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        message: "API Relatórios/Status: Placeholder rodando.", 
        data: {
            conformidade: "95%",
            pendencias: 5,
            vacinas: ["Gripe", "Hepatite B"]
        }
    }, { status: 200 });
}
