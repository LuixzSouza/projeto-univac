import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Listar todos os agendamentos
export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        funcionario: true,
        vacina: true,
      },
      orderBy: { start: "asc" },
    });

    return NextResponse.json(agendamentos, { status: 200 });

  } catch (error: any) {
    console.error("Erro no GET /api/agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao listar agendamentos" },
      { status: 500 }
    );
  }
}

// POST - Criar agendamento
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { funcionarioId, vacinaId, start, end } = body;

    // Validação básica
    if (!funcionarioId || !vacinaId || !start || !end) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    // Verifica sobreposição de horário
    const conflito = await prisma.agendamento.findFirst({
      where: {
        funcionarioId: Number(funcionarioId),
        OR: [
          {
            start: { lte: new Date(end) },
            end: { gte: new Date(start) },
          },
        ],
      },
    });

    if (conflito) {
      return NextResponse.json(
        { error: "O funcionário já possui um agendamento nesse intervalo" },
        { status: 409 }
      );
    }

    const novoAgendamento = await prisma.agendamento.create({
      data: {
        funcionarioId: Number(funcionarioId),
        vacinaId: Number(vacinaId),
        start: new Date(start),
        end: new Date(end),
        status: "Agendado",
      },
    });

    return NextResponse.json(novoAgendamento, { status: 201 });

  } catch (error: any) {
    console.error("Erro no POST /api/agendamentos:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
