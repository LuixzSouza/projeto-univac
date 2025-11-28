'use client'

import { Edit, Trash2, Syringe, AlertCircle } from "lucide-react"

export interface IVacina {
  id: number
  nome: string
  descricao: string
  obrigatoriedade: boolean
}

interface VacinaTableProps {
  data: IVacina[]
  onEdit: (vacina: IVacina) => void
  onDelete: (vacina: IVacina) => void
  userRole: string 
}

export default function VacinaTable({ data, onEdit, onDelete, userRole }: VacinaTableProps) {
  const isAdmin = userRole === 'ADMIN'

  return (
    <div className="bg-bg-surface shadow-sm rounded-lg overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg-base text-text-muted font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nome da Vacina</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-center">Tipo</th>
              {/* Só mostra cabeçalho de ações se for Admin */}
              {isAdmin && <th className="px-6 py-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((vacina) => (
              <tr 
                key={vacina.id} 
                className="hover:bg-bg-base/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-text-base flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                    <Syringe size={16} />
                  </div>
                  {vacina.nome}
                </td>
                <td className="px-6 py-4 text-text-muted max-w-xs truncate">
                  {vacina.descricao}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      vacina.obrigatoriedade
                        ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                        : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    }`}
                  >
                    {vacina.obrigatoriedade ? "Obrigatória" : "Opcional"}
                  </span>
                </td>
                
                {/* Só mostra botões se for Admin */}
                {isAdmin && (
                    <td className="px-6 py-4 text-right space-x-2">
                    <button
                        onClick={() => onEdit(vacina)}
                        className="text-primary hover:text-primary-dark p-1 hover:bg-primary/10 rounded transition"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(vacina)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                        title="Excluir"
                    >
                        <Trash2 size={18} />
                    </button>
                    </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}