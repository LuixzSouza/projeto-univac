import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Busca vacinas obrigatórias
    const vacinasObrigatorias = await prisma.tipoVacina.findMany({
      where: { obrigatoriedade: true }
    });

    // Busca funcionários e suas aplicações
    const funcionarios = await prisma.funcionarioUsuario.findMany({
      where: { role: { not: 'ADMIN' }, status: true },
      include: {
        aplicacoes: { select: { vacinaId: true } }
      }
    });

    // Monta o CSV manualmente (cabeçalho)
    let csv = "Nome,Email,Registro,Status,Vacinas Pendentes\n";

    funcionarios.forEach(func => {
      const idsTomadas = func.aplicacoes.map(a => a.vacinaId);
      
      // Filtra o que falta
      const pendencias = vacinasObrigatorias
        .filter(v => !idsTomadas.includes(v.id))
        .map(v => v.nome);

      // Só adiciona no relatório se tiver pendência
      if (pendencias.length > 0) {
        // Formata para CSV (aspas para evitar quebra se tiver vírgula no nome)
        const linha = [
          `"${func.nome}"`,
          `"${func.email}"`,
          `"${func.numeroRegistro}"`,
          "Pendente",
          `"${pendencias.join(', ')}"`
        ].join(",");
        
        csv += linha + "\n";
      }
    });

    // Retorna o arquivo
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="relatorio_pendencias.csv"',
      },
    });

  } catch (error) {
    return NextResponse.json({ error: "Erro ao gerar relatório" }, { status: 500 });
  }
}