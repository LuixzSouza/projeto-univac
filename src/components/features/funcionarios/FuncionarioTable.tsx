'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Interface alinhada com o Prisma
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
  userRole: string // ✨ Papel do usuário logado (para RBAC)
}

// ✨ NOVO HELPER: Simula o status online/offline de forma consistente
const getPresenceStatus = (id: number) => {
    // Usa o ID para simular um status consistente (determinístico)
    const status = id % 5; 
    if (status === 0) return { label: 'Ocupado', color: 'bg-red-500' };
    if (status === 1) return { label: 'Ausente', color: 'bg-yellow-500' };
    if (status === 2) return { label: 'Offline', color: 'bg-gray-500' };
    return { label: 'Online', color: 'bg-green-500' };
};


export function FuncionarioTable({ data, onEdit, onDelete, userRole }: FuncionarioTableProps) {
  const router = useRouter()
  const isAdmin = userRole === 'ADMIN';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Nº Registro</TableHead>
          <TableHead>Status</TableHead>
          {isAdmin && <TableHead className="text-center">Ações</TableHead>} {/* ✨ RBAC: Esconde coluna Ações */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((funcionario) => {
          const presence = getPresenceStatus(funcionario.id);
          
          return (
            <TableRow key={funcionario.id} className="hover:bg-bg-base/50 transition-colors">
              <TableCell
                onClick={() => router.push(`/funcionarios/${funcionario.id}`)}
                className="font-medium cursor-pointer hover:underline text-text-base flex items-center gap-3"
              >
                {/* ✨ Indicador de Presença */}
                <div className={`h-2.5 w-2.5 rounded-full ${presence.color} shrink-0`} title={presence.label}></div>
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
              
              {/* Status Ativo/Inativo (Mantido) */}
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
                  {funcionario.status ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              
              {/* ✨ Coluna de Ações: SÓ APARECE PARA ADMIN */}
              {isAdmin && (
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
              )}
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}