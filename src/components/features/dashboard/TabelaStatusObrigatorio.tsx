'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { AlertTriangle, CheckCircle } from 'lucide-react'

// Interfaces locais para independência do mock
interface VacinaSimples {
  id: number
  nome: string
  obrigatoriedade: boolean
}

interface FuncionarioComAplicacoes {
  id: number
  nome: string
  aplicacoes: { vacinaId: number }[]
}

interface TabelaStatusObrigatorioProps {
  funcionarios: FuncionarioComAplicacoes[]
  vacinasObrigatorias: VacinaSimples[] 
}

function verificarStatusObrigatorio(func: FuncionarioComAplicacoes, vacinasObrigatorias: VacinaSimples[]): { emDia: boolean; pendentes: string[] } {
  if (vacinasObrigatorias.length === 0) return { emDia: true, pendentes: [] };

  const idsVacinasTomadas = func.aplicacoes.map(app => app.vacinaId);
  
  // Filtra quais vacinas obrigatórias NÃO estão na lista de tomadas
  const vacinasFaltantes = vacinasObrigatorias.filter(obrigatoria => !idsVacinasTomadas.includes(obrigatoria.id));
  
  const emDia = vacinasFaltantes.length === 0;
  
  return { 
      emDia, 
      pendentes: vacinasFaltantes.map(v => v.nome) 
  };
}

export function TabelaStatusObrigatorio({ funcionarios, vacinasObrigatorias }: TabelaStatusObrigatorioProps) {
  // Pegamos apenas os primeiros 5 para não lotar o dashboard
  const listaExibicao = funcionarios.slice(0, 5);

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
        <h3 className="text-lg font-semibold mb-4 text-text-base flex items-center gap-2">
           Status Vacinas Obrigatórias (Top 5)
        </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Status Geral</TableHead>
            <TableHead>Vacinas Pendentes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listaExibicao.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-text-muted py-6">Nenhum funcionário encontrado.</TableCell>
            </TableRow>
          )}
          {listaExibicao.map((func) => {
            const status = verificarStatusObrigatorio(func, vacinasObrigatorias);
            return (
              <TableRow key={func.id}>
                <TableCell className="font-medium text-text-base">{func.nome}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                      status.emDia
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                    }`}
                  >
                    {status.emDia ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {status.emDia ? 'Em Dia' : 'Pendente'}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-text-muted max-w-[150px] truncate">
                  {status.pendentes.length > 0 ? status.pendentes.join(', ') : '-'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}