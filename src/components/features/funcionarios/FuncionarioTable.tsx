'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Pencil, Trash2, Clock, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export interface IFuncionario {
  id: number
  nome: string
  email: string
  numeroRegistro: number
  cpf: string
  role: string
  status: boolean
  ultimoAcesso?: string 
}

interface FuncionarioTableProps {
  data: IFuncionario[]
  onEdit: (funcionario: IFuncionario) => void
  onDelete: (funcionario: IFuncionario) => void
  userRole: string
}

// Helper para definir o status visual e textual
const getStatusConfig = (func: IFuncionario) => {
  // Se estiver inativo no cadastro, é o status principal
  if (!func.status) return { label: 'Inativo', color: 'bg-red-500', text: 'text-red-600', border: 'border-red-200', bg: 'bg-red-50' };

  const randomState = func.id % 3; 

  if (randomState === 0) return { label: 'Em Atendimento', color: 'bg-yellow-500', text: 'text-yellow-700', border: 'border-yellow-200', bg: 'bg-yellow-50' };
  if (randomState === 1) return { label: 'Disponível', color: 'bg-green-500', text: 'text-green-700', border: 'border-green-200', bg: 'bg-green-50' };
  
  return { label: 'Offline', color: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', bg: 'bg-slate-50' };
}

export function FuncionarioTable({ data, onEdit, onDelete, userRole }: FuncionarioTableProps) {
  const router = useRouter()
  const isAdmin = userRole === 'ADMIN';

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colaborador</TableHead>
            <TableHead>Contato & Registro</TableHead>
            <TableHead>Status Atual</TableHead>
            {isAdmin && <TableHead>Último Acesso</TableHead>}
            {isAdmin && <TableHead className="text-center">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((funcionario) => {
            const statusConfig = getStatusConfig(funcionario);
            
            // Simula uma data de último acesso aleatória recente
            const lastOnline = new Date(Date.now() - Math.floor(Math.random() * 10000000));

            return (
              <TableRow key={funcionario.id} className="hover:bg-bg-base/50 transition-colors group cursor-pointer" onClick={() => router.push(`/funcionarios/${funcionario.id}`)}>
                
                {/* Coluna Nome + Avatar */}
                <TableCell className="font-medium text-text-base">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${statusConfig.color.replace('bg-', 'bg-opacity-80 bg-')}`}>
                        {funcionario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold">{funcionario.nome}</p>
                        <p className="text-xs text-text-muted capitalize">{funcionario.role.toLowerCase()}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Coluna Contato */}
                <TableCell>
                   <div className="flex flex-col text-sm">
                      <span className="text-text-base">{funcionario.email}</span>
                      <span className="text-xs text-text-muted font-mono">Reg: {funcionario.numeroRegistro}</span>
                   </div>
                </TableCell>

                {/* Coluna Status  */}
                <TableCell>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}>
                    <span className={`h-2 w-2 rounded-full ${statusConfig.color} animate-pulse`}></span>
                    <span className={`text-xs font-bold ${statusConfig.text}`}>
                        {statusConfig.label}
                    </span>
                  </div>
                </TableCell>
                
                {/* Coluna Último Acesso (Só Admin) */}
                {isAdmin && (
                    <TableCell className="text-text-muted text-xs">
                        <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDistanceToNow(lastOnline, { addSuffix: true, locale: ptBR })}
                        </div>
                    </TableCell>
                )}
                
                {/* Coluna Ações (Só Admin) */}
                {isAdmin && (
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onEdit(funcionario) }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Editar Dados"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDelete(funcionario) }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Excluir Registro"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}