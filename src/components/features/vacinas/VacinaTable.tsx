'use client'

import { IVacina } from '@/lib/mock-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { Pencil, Trash2 } from 'lucide-react' 

interface VacinaTableProps {
  data: IVacina[]
  onEdit: (vacina: IVacina) => void
  onDelete: (vacina: IVacina) => void
}

export function VacinaTable({ data, onEdit, onDelete }: VacinaTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome da Vacina</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Obrigatoriedade</TableHead>
          <TableHead className="text-right">Total Aplicações</TableHead>
          <TableHead className="text-center">Ações</TableHead> 
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((vacina) => (
          <TableRow key={vacina.id}>
            <TableCell className="font-medium">{vacina.nome}</TableCell>

            <TableCell className="max-w-xs truncate text-text-muted" title={vacina.descricao}>
              {vacina.descricao}
            </TableCell>

            <TableCell>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold
                  ${vacina.obrigatoriedade
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : 'bg-border text-text-muted' 
                  }
                `}
              >
                {vacina.obrigatoriedade ? 'Obrigatória' : 'Opcional'}
              </span>
            </TableCell>

            <TableCell className="text-right font-medium text-text-base">
              {vacina.totalAplicacoes?.toLocaleString('pt-BR') ?? '-'} 
            </TableCell>

            <TableCell className="text-center">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => onEdit(vacina)}
                  className="text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  title="Editar Vacina" 
                >
                  <Pencil size={18} />
                  <span className="sr-only">Editar</span>
                </button>

                <button
                  onClick={() => onDelete(vacina)}
                  className="text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Excluir Vacina" 
                >
                  <Trash2 size={18} />
                  <span className="sr-only">Excluir</span>
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}

        {data.length === 0 && (
          <TableRow>
             <TableCell colSpan={5} className="text-center text-text-muted py-6">
               Nenhum tipo de vacina encontrado.
             </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}