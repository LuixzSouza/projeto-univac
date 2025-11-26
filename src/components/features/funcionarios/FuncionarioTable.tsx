'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Interface alinhada com o Prisma (ID é number)
export interface IFuncionario {
  id: number
  nome: string
  email: string
  numeroRegistro: number
  cpf: string
  role: string
  status: boolean
}

interface FuncionarioTableProps {
  data: IFuncionario[]
  onEdit: (funcionario: IFuncionario) => void
  onDelete: (funcionario: IFuncionario) => void
}

export function FuncionarioTable({ data, onEdit, onDelete }: FuncionarioTableProps) {
  const router = useRouter()

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
          <TableRow key={funcionario.id} className="hover:bg-bg-base/50 transition-colors">
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
              className="font-medium cursor-pointer hover:underline text-text-base"
            >
              {funcionario.nome}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
              className="text-text-muted cursor-pointer hover:underline"
            >
              {funcionario.email}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
              className="text-text-muted cursor-pointer hover:underline"
            >
              {funcionario.numeroRegistro}
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold
                  ${funcionario.role === 'ADMIN'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                {funcionario.role === 'ADMIN' ? 'Admin' : 'Funcionário'}
              </span>
            </TableCell>
            <TableCell
              onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
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
                  className="text-primary transition-colors hover:text-primary/80 p-1 hover:bg-primary/10 rounded"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(funcionario) }}
                  className="text-red-600 transition-colors hover:text-red-800 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
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