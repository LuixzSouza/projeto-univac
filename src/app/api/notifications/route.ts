import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addDays, isBefore, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  try {
    const notifications = [];
    const hoje = new Date();

    // VERIFICAR ESTOQUE BAIXO E VALIDADE
    const vacinas = await prisma.tipoVacina.findMany({
      include: { lotes: true }
    });

    vacinas.forEach(vacina => {
      const totalEstoque = vacina.lotes.reduce((acc, l) => acc + l.quantidade, 0);
      
      // Regra: Estoque abaixo de 50 unidades
      if (totalEstoque < 50 && totalEstoque > 0) {
        notifications.push({
          id: `stock-low-${vacina.id}`,
          type: 'warning',
          title: 'Estoque Baixo',
          message: `A vacina ${vacina.nome} tem apenas ${totalEstoque} doses.`,
          link: '/estoque'
        });
      }

      // Regra: Estoque Zero
      if (totalEstoque === 0) {
        notifications.push({
          id: `stock-out-${vacina.id}`,
          type: 'critical',
          title: 'Estoque Esgotado',
          message: `A vacina ${vacina.nome} acabou! Reponha urgentemente.`,
          link: '/estoque'
        });
      }

      // Regra: Validade (Lotes vencendo em 30 dias)
      vacina.lotes.forEach(lote => {
        const dataVencimento = new Date(lote.validade);
        if (isBefore(dataVencimento, addDays(hoje, 30)) && isBefore(hoje, dataVencimento)) {
           notifications.push({
            id: `lote-exp-${lote.id}`,
            type: 'warning',
            title: 'Lote Vencendo',
            message: `Lote ${lote.codigo} (${vacina.nome}) vence em breve.`,
            link: '/estoque'
           });
        }
      });
    });

    // VERIFICAR AGENDA DE HOJE
    const agendamentosHoje = await prisma.agendamento.count({
      where: {
        dataAgendamento: {
          gte: startOfDay(hoje),
          lte: endOfDay(hoje)
        },
        status: 'Agendado'
      }
    });

    if (agendamentosHoje > 0) {
      notifications.push({
        id: 'agenda-today',
        type: 'info',
        title: 'Agenda do Dia',
        message: `Existem ${agendamentosHoje} vacinações agendadas para hoje.`,
        link: '/agenda'
      });
    }

    // VERIFICAR PENDÊNCIAS CRÍTICAS (Funcionários atrasados)

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
  }
}