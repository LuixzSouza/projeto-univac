"use client";

import { Edit, Trash2, Syringe } from "lucide-react";

interface IVacina {
  id: number;
  nome: string;
  descricao: string;
  obrigatoriedade: boolean;
}

interface VacinaTableProps {
  data: IVacina[];
  onEdit: (vacina: IVacina) => void;
  onDelete: (vacina: IVacina) => void;
}

export default function VacinaTable({ data, onEdit, onDelete }: VacinaTableProps) {
  return (
    // Usa bg-bg-surface para respeitar o tema dark/light definido no seu CSS
    <div className="bg-bg-surface shadow-md rounded-lg overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-bg-base text-text-muted font-medium uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nome da Vacina</th>
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3 text-center">Tipo</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((vacina) => (
              <tr 
                key={vacina.id} 
                className="hover:bg-bg-base/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-text-base flex items-center gap-3">
                  {/* Usa a cor Primary (Verde) do seu tema */}
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
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
                        ? "bg-red-500/10 text-red-600 border-red-500/20"
                        : "bg-green-500/10 text-green-600 border-green-500/20"
                    }`}
                  >
                    {vacina.obrigatoriedade ? "Obrigatória" : "Opcional"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(vacina)}
                    className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(vacina)}
                    className="text-red-500 hover:text-red-700 p-1 hover:bg-red-500/10 rounded transition"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}