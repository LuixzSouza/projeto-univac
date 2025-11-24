'use client'
import { IAplicacao } from '@/lib/mock-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { format } from 'date-fns'

interface HistoricoAplicacoesTableProps {
  aplicacoes: IAplicacao[]
}

export function HistoricoAplicacoesTable({ aplicacoes }: HistoricoAplicacoesTableProps) {
  return (
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
            <TableCell colSpan={5} className="text-center text-text-muted py-6">Nenhum registo de aplicação encontrado.</TableCell>
          </TableRow>
        )}
        {aplicacoes.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">{app.funcionarioNome}</TableCell>
            <TableCell>{app.tipoVacina}</TableCell>
            <TableCell>{format(app.dataAplicacao, 'dd/MM/yyyy')}</TableCell>
            <TableCell>{app.responsavel}</TableCell>
            <TableCell className="text-text-muted">{app.lote}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}