import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Busca paralela para ser rápido
    const [funcionarios, vacinas] = await Promise.all([
      // Procura em Funcionários (Nome, Email, CPF)
      prisma.funcionarioUsuario.findMany({
        where: {
          OR: [
            { nome: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { cpf: { contains: query } }
          ],
          role: { not: 'ADMIN' } 
        },
        select: { id: true, nome: true, email: true },
        take: 3 // Limita resultados
      }),

      // Procura em Vacinas (Nome, Descrição)
      prisma.tipoVacina.findMany({
        where: {
          OR: [
            { nome: { contains: query, mode: 'insensitive' } },
            { descricao: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: { id: true, nome: true },
        take: 3
      })
    ]);

    // Formata para o frontend saber o tipo
    const resultados = [
      ...funcionarios.map(f => ({ type: 'funcionario', id: f.id, title: f.nome, subtitle: f.email, url: `/funcionarios/${f.id}` })),
      ...vacinas.map(v => ({ type: 'vacina', id: v.id, title: v.nome, subtitle: 'Tipo de Vacina', url: '/vacinas' })) // Vacinas manda para a lista pois não temos detalhes ainda
    ];

    return NextResponse.json(resultados);

  } catch (error) {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}