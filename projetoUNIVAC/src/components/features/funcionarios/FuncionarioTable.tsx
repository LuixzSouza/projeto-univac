'use client'

import { IFuncionario } from '@/lib/mock-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FuncionarioTableProps {
  data: IFuncionario[]
  onEdit: (funcionario: IFuncionario) => void
  onDelete: (funcionario: IFuncionario) => void
}

export function FuncionarioTable({ data, onEdit, onDelete }: FuncionarioTableProps) {
  const router = useRouter()

  const handleRowClick = (id: string) => {
    router.push(`/funcionarios/${id}`)
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Nº Registro</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((funcionario) => (
          <TableRow key={funcionario.id}>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id.toString()}`)}
              className="font-medium cursor-pointer hover:underline"
            >
              {funcionario.nome}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id.toString()}`)}
              className="text-text-muted cursor-pointer hover:underline"
            >
              {funcionario.email}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id.toString()}`)}
              className="text-text-muted cursor-pointer hover:underline"
            >
              {funcionario.numeroRegistro}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id.toString()}`)}
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
                  ${funcionario.role === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-border text-text-muted'
                  }
                `}
              >
                {funcionario.role === 'ADMIN' ? 'Admin' : 'Funcionário'}
              </span>
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id.toString()}`)}
            >
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                  ${funcionario.status
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  }
                `}
              >
                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${funcionario.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {funcionario.status ? 'Ativo' : 'Inativo'}
              </span>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex justify-center space-x-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(funcionario) }}
                  className="text-primary transition-colors hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(funcionario) }}
                  className="text-red-600 transition-colors hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Excluir"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
