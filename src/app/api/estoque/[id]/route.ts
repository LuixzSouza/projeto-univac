import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// --- PUT: EDITAR UM LOTE EXISTENTE ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { codigo, quantidade, validade } = body;

    // Validação básica
    if (!codigo || quantidade === undefined || !validade) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const loteAtualizado = await prisma.lote.update({
      where: { id },
      data: {
        codigo,
        quantidade: Number(quantidade),
        validade: new Date(validade) 
      }
    });

    return NextResponse.json(loteAtualizado);
  } catch (error) {
    console.error("Erro ao editar lote:", error);
    return NextResponse.json({ error: "Erro ao atualizar lote" }, { status: 500 });
  }
}

// --- DELETE: REMOVER UM LOTE ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.lote.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Lote removido com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar lote:", error);
    return NextResponse.json({ error: "Erro ao deletar (verifique se existem dependências)" }, { status: 500 });
  }
}