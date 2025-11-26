// app/api/vacinas/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ATUALIZAR (PUT/PATCH)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const id = parseInt(params.id);
    const body = await request.json();
    const { nome, descricao, obrigatoriedade } = body;

    const vacinaAtualizada = await prisma.tipoVacina.update({
      where: { id },
      data: { nome, descricao, obrigatoriedade }
    });

    return NextResponse.json(vacinaAtualizada);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}

// DELETAR (DELETE)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // Opcional: Só ADMIN pode deletar?
    if (session?.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Apenas admins podem deletar" }, { status: 403 });
    }

    const id = parseInt(params.id);

    await prisma.tipoVacina.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Vacina deletada com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar (verifique se não há aplicações vinculadas)" }, { status: 500 });
  }
}