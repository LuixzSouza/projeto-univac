import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Executa todas as queries em paralelo para ser rápido
    const [
      funcionarios,
      vacinas,
      agendamentos,
      aplicacoesRecentes
    ] = await Promise.all([
      // Busca funcionários e SUAS APLICAÇÕES (necessário para o cálculo de conformidade)
      prisma.funcionarioUsuario.findMany({
        where: { role: { not: 'ADMIN' } }, // Ignora admins nos gráficos
        select: {
          id: true,
          nome: true,
          status: true,
          aplicacoes: {
            select: { vacinaId: true }
          }
        }
      }),

      // Busca todas as vacinas
      prisma.tipoVacina.findMany(),

      // Próximos Agendamentos (apenas futuros)
      prisma.agendamento.findMany({
        where: {
          dataAgendamento: { gte: new Date() }, // gte = maior ou igual a hoje
          status: { not: 'Cancelado' }
        },
        include: {
          funcionario: { select: { nome: true } },
          vacina: { select: { nome: true } }
        },
        orderBy: { dataAgendamento: 'asc' },
        take: 5 
      }),

      // Aplicações Recentes (Feed)
      prisma.aplicacoesVacina.findMany({
        include: {
          funcionario: { select: { nome: true } },
          vacina: { select: { nome: true } }
        },
        orderBy: { dataAplicacao: 'desc' },
        take: 5
      })
    ]);

    return NextResponse.json({
      funcionarios,
      vacinas,
      agendamentos,
      aplicacoes: aplicacoesRecentes
    });

  } catch (error) {
    console.error("Erro no Dashboard API:", error);
    return NextResponse.json({ error: "Erro ao carregar dados" }, { status: 500 });
  }
}