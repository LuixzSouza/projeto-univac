// app/api/vacinas/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// LISTAR VACINAS (GET)
export async function GET() {
  try {
    // Busca todas as vacinas no banco
    const vacinas = await prisma.tipoVacina.findMany({
      orderBy: { nome: 'asc' } // Ordena por ordem alfabética
    });

    return NextResponse.json(vacinas);
  } catch (error) {
    console.error("Erro ao buscar vacinas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar vacinas" },
      { status: 500 }
    );
  }
}

// CRIAR NOVA VACINA (POST)
export async function POST(request: Request) {
  try {
    // Segurança: Verifica se o usuário está logado
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Recebe os dados do corpo da requisição
    const body = await request.json();
    const { nome, descricao, obrigatoriedade } = body;

    // Validação simples
    if (!nome || !descricao) {
      return NextResponse.json(
        { error: "Nome e descrição são obrigatórios" },
        { status: 400 }
      );
    }

    // Verifica se já existe vacina com esse nome
    const vacinaExistente = await prisma.tipoVacina.findUnique({
      where: { nome }
    });

    if (vacinaExistente) {
      return NextResponse.json(
        { error: "Já existe uma vacina com este nome" },
        { status: 409 }
      );
    }

    // Cria no banco (Neon)
    const novaVacina = await prisma.tipoVacina.create({
      data: {
        nome,
        descricao,
        obrigatoriedade: obrigatoriedade || false
      }
    });

    return NextResponse.json(novaVacina, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar vacina:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar vacina" },
      { status: 500 }
    );
  }
}