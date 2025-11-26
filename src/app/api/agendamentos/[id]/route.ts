import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ATUALIZAR (Status ou Data)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const id = parseInt(params.id);
    const body = await request.json();
    const { status, dataAgendamento } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (dataAgendamento) updateData.dataAgendamento = new Date(dataAgendamento);

    const agendamento = await prisma.agendamento.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(agendamento);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// DELETAR
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const id = parseInt(params.id);

    await prisma.agendamento.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Agendamento cancelado" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao cancelar" }, { status: 500 });
  }
}