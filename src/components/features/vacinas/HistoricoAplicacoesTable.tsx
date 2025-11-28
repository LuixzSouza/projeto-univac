'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface IAplicacaoHist {
  id: number
  funcionarioNome: string
  tipoVacina: string
  dataAplicacao: Date | string 
  responsavel?: string
  lote?: string
}

interface HistoricoAplicacoesTableProps {
  aplicacoes: IAplicacaoHist[]
}

export function HistoricoAplicacoesTable({ aplicacoes }: HistoricoAplicacoesTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-surface shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário Vacinado</TableHead>
            <TableHead>Tipo de Vacina</TableHead>
            <TableHead>Data de Aplicação</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Lote</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aplicacoes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-text-muted py-8">
                Nenhum registro de aplicação encontrado.
              </TableCell>
            </TableRow>
          )}
          {aplicacoes.map((app) => (
            <TableRow key={app.id} className="hover:bg-bg-base/50 transition-colors">
              <TableCell className="font-medium text-text-base">
                {app.funcionarioNome}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {app.tipoVacina}
                </span>
              </TableCell>
              <TableCell className="text-text-muted">
                {format(new Date(app.dataAplicacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-text-muted">
                {app.responsavel || '-'}
              </TableCell>
              <TableCell className="text-text-muted font-mono text-xs">
                {app.lote || 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}