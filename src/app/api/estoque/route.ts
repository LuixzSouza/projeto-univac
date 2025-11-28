import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// LISTAR TUDO (Vacinas + Lotes somados)
export async function GET() {
  try {
    const vacinas = await prisma.tipoVacina.findMany({
      include: {
        lotes: {
          orderBy: { validade: 'asc' } // Lotes que vencem primeiro aparecem antes
        }
      }
    });
    return NextResponse.json(vacinas);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar estoque" }, { status: 500 });
  }
}

// CRIAR NOVO LOTE
export async function POST(request: Request) {
    try {
    const body = await request.json();
    const { vacinaId, codigo, quantidade, validade } = body;

    const novoLote = await prisma.lote.create({
      data: {
        vacinaId: Number(vacinaId),
        codigo,
        quantidade: Number(quantidade),
        validade: new Date(validade) 
      }
    });

    return NextResponse.json(novoLote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar lote" }, { status: 500 });
  }
}