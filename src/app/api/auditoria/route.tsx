import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// LISTAR LOGS
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Apenas Admin vê logs
    if (session?.user?.role !== 'ADMIN') {
        return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const logs = await prisma.auditLog.findMany({
      orderBy: { data: 'desc' },
      take: 50 // Pega os últimos 50 eventos
    });

    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar logs" }, { status: 500 });
  }
}

// REGISTRAR LOG (Chamado internamente pelo front ou outras APIs)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { acao, recurso, detalhe, autor } = body;

    await prisma.auditLog.create({
      data: { acao, recurso, detalhe, autor }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao gravar log" }, { status: 500 });
  }
}