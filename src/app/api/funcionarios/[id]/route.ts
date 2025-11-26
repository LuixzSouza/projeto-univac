import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const funcionario = await prisma.funcionarioUsuario.findUnique({
      where: { id },
      include: {
        aplicacoes: {
          include: {
            vacina: true // Traz o nome da vacina junto
          },
          orderBy: {
            dataAplicacao: 'desc' // Ordena do mais recente para o mais antigo
          }
        }
      }
    });

    if (!funcionario) {
      return NextResponse.json({ error: "Funcionário não encontrado" }, { status: 404 });
    }

    // Removemos a senha por segurança
    const { senha, ...funcionarioSeguro } = funcionario;

    return NextResponse.json(funcionarioSeguro);
  } catch (error) {
    console.error("Erro ao buscar funcionário:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// ATUALIZAR
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Apenas admins podem editar usuários" }, { status: 403 });
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const { nome, email, cpf, numeroRegistro, role, status, senha } = body;

    // Prepara o objeto de atualização
    const dadosAtualizar: any = {
      nome,
      email,
      cpf,
      numeroRegistro: Number(numeroRegistro),
      role,
      status
    };

    // Se o usuário mandou uma nova senha, criptografa. Se veio em branco, não mexe.
    if (senha && senha.trim() !== "") {
      dadosAtualizar.senha = await bcrypt.hash(senha, 10);
    }

    const funcionarioAtualizado = await prisma.funcionarioUsuario.update({
      where: { id },
      data: dadosAtualizar
    });

    return NextResponse.json(funcionarioAtualizado);
  } catch (error) {
    console.error("Erro update:", error);
    return NextResponse.json({ error: "Erro ao atualizar funcionário" }, { status: 500 });
  }
}

// DELETAR
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica se é admin
    if (session?.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Apenas admins podem deletar" }, { status: 403 });
    }

    const id = parseInt(params.id);

    // CORREÇÃO AQUI: Usamos (session.user as any).id para o TS não reclamar
    const usuarioLogadoId = (session.user as any).id;

    // Impede deletar a si mesmo (segurança básica)
    if (usuarioLogadoId === String(id)) {
        return NextResponse.json({ error: "Você não pode excluir sua própria conta" }, { status: 400 });
    }

    await prisma.funcionarioUsuario.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Funcionário removido com sucesso" });
  } catch (error) {
    // É comum dar erro se o funcionário já aplicou vacinas (chave estrangeira)
    return NextResponse.json({ error: "Erro ao deletar (o funcionário possui registros vinculados)" }, { status: 500 });
  }
}