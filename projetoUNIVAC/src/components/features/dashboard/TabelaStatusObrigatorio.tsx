'use client'
import { IFuncionario, IVacina } from '@/lib/mock-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface TabelaStatusObrigatorioProps {
  funcionarios: IFuncionario[]
  vacinasObrigatorias: IVacina[] 
}

function verificarStatusObrigatorio(func: IFuncionario, vacinasObrigatorias: IVacina[]): { emDia: boolean; pendentes: string[] } {
  if (func.statusVacinacao === 'completo') {
    return { emDia: true, pendentes: [] };
  }
  if (func.statusVacinacao === 'parcial') {
      return { emDia: false, pendentes: [vacinasObrigatorias[0]?.nome || 'Vacina Obrigatória'] };
  }
    return { emDia: false, pendentes: vacinasObrigatorias.map(v => v.nome) };
}


export function TabelaStatusObrigatorio({ funcionarios, vacinasObrigatorias }: TabelaStatusObrigatorioProps) {
  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-text-base">
          Status Vacinas Obrigatórias
        </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Status Geral</TableHead>
            <TableHead>Vacinas Pendentes (Obrigatórias)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {funcionarios.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-text-muted py-6">Nenhum funcionário encontrado.</TableCell>
            </TableRow>
          )}
          {funcionarios.map((func) => {
            const status = verificarStatusObrigatorio(func, vacinasObrigatorias);
            return (
              <TableRow key={func.id}>
                <TableCell className="font-medium">{func.nome}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      status.emDia
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}
                  >
                    {status.emDia ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    {status.emDia ? 'Em Dia' : 'Pendente'}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-text-muted">
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