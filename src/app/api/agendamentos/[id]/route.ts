import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

// GET - Buscar um agendamento
export async function GET(request: Request, { params }: Params) {
  try {
    console.log(`📌 GET /api/agendamentos/${params.id}`);

    const agendamento = await prisma.agendamento.findUnique({
      where: { id: Number(params.id) },
      include: {
        funcionario: true,
        vacina: true,
      },
    });

    if (!agendamento) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(agendamento, { status: 200 });

  } catch (error) {
    console.error(`❌ Erro ao buscar agendamento ${params.id}:`, error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar agendamento
export async function PUT(request: Request, { params }: Params) {
  try {
    const data = await request.json();
    const { funcionarioId, vacinaId, start, end, status } = data;

    console.log(`✏ Atualizando agendamento ${params.id}`, data);

    const updateData: any = {
      funcionarioId: Number(funcionarioId),
      vacinaId: Number(vacinaId),
      start: new Date(start),
      end: new Date(end),
      status,
    };

    // Verifica conflito de horário
    const conflito = await prisma.agendamento.findFirst({
      where: {
        funcionarioId: Number(funcionarioId),
        id: { not: Number(params.id) },
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
        { error: "O funcionário já possui um agendamento nesse horário" },
        { status: 409 }
      );
    }

    const atualizado = await prisma.agendamento.update({
      where: { id: Number(params.id) },
      data: updateData,
    });

    return NextResponse.json(atualizado, { status: 200 });

  } catch (error) {
    console.error("❌ Erro ao atualizar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar agendamento" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir agendamento
export async function DELETE(request: Request, { params }: Params) {
  try {
    console.log(`🗑 Excluindo agendamento ${params.id}`);

    await prisma.agendamento.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json(
      { message: "Agendamento excluído com sucesso" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Erro ao excluir agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao excluir agendamento" },
      { status: 500 }
    );
  }
}
