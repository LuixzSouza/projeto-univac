import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// LISTAR AGENDAMENTOS
export async function GET() {
  try {
    const agendamentos = await prisma.agendamento.findMany({
      include: {
        funcionario: { select: { nome: true } }, // Traz o nome do funcionário
        vacina: { select: { nome: true } }       // Traz o nome da vacina
      },
      orderBy: { dataAgendamento: 'asc' }
    });

    return NextResponse.json(agendamentos);
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json({ error: "Erro ao buscar agendamentos" }, { status: 500 });
  }
}

// CRIAR AGENDAMENTO
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const body = await request.json();
    const { dataAgendamento, funcionarioId, vacinaId, status } = body;

    if (!dataAgendamento || !funcionarioId || !vacinaId) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Cria o agendamento
    const novoAgendamento = await prisma.agendamento.create({
      data: {
        dataAgendamento: new Date(dataAgendamento), // Garante que é data válida
        funcionarioId: Number(funcionarioId),
        vacinaId: Number(vacinaId),
        status: status || "Agendado"
      }
    });

    return NextResponse.json(novoAgendamento, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 });
  }
}