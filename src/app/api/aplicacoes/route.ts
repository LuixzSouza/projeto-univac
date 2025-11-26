import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Registrar nova aplicação de vacina
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    const { funcionarioId, vacinaId, dataAplicacao, lote } = body;

    if (!funcionarioId || !vacinaId || !dataAplicacao) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Cria o registro no histórico
    const novaAplicacao = await prisma.aplicacoesVacina.create({
      data: {
        funcionarioId: Number(funcionarioId),
        vacinaId: Number(vacinaId),
        dataAplicacao: new Date(dataAplicacao),
        lote: lote || "N/A"
      }
    });

    return NextResponse.json(novaAplicacao, { status: 201 });

  } catch (error) {
    console.error("Erro ao registrar aplicação:", error);
    return NextResponse.json({ error: "Erro ao salvar registro" }, { status: 500 });
  }
}