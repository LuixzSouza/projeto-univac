'use client'

import { forwardRef } from 'react'
import { Syringe, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Tipagem simplificada para exibição
interface CarteirinhaProps {
  funcionario: {
    nome: string
    cpf: string
    numeroRegistro: number
    role: string
  }
  aplicacoes: {
    id: number
    dataAplicacao: string
    lote: string
    vacina: { nome: string }
    responsavel?: string
  }[]
}

export const CarteirinhaVacina = forwardRef<HTMLDivElement, CarteirinhaProps>(
  ({ funcionario, aplicacoes }, ref) => {
    return (
      <div 
        ref={ref} 
        className="w-full bg-white text-black p-8 rounded-none sm:rounded-lg border border-gray-200 shadow-sm print:shadow-none print:border-none print:w-full"
        id="printable-card"
      >
        {/* Cabeçalho da Carteirinha */}
        <div className="flex items-center justify-between border-b-2 border-green-600 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-green-600 text-white flex items-center justify-center rounded-full print:bg-green-600 print:text-white print-color-adjust">
              <ShieldCheck size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide text-green-900">UniVac</h1>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Comprovante Oficial de Imunização</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Emissão</p>
            <p className="font-mono font-bold text-gray-700">{format(new Date(), 'dd/MM/yyyy')}</p>
          </div>
        </div>

        {/* Dados do Funcionário */}
        <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-6 print:bg-gray-100">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Nome do Colaborador</p>
                    <p className="text-lg font-semibold text-gray-900">{funcionario.nome}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Registro (Matrícula)</p>
                    <p className="text-lg font-mono text-gray-900">#{funcionario.numeroRegistro}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">CPF</p>
                    <p className="text-base font-mono text-gray-900">{funcionario.cpf}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Cargo/Função</p>
                    <p className="text-base text-gray-900 capitalize">{funcionario.role.toLowerCase()}</p>
                </div>
            </div>
        </div>

        {/* Tabela de Vacinas */}
        <div className="mb-8">
            <h3 className="text-sm font-bold uppercase text-gray-900 mb-3 flex items-center gap-2">
                <Syringe size={16} /> Histórico de Doses
            </h3>
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-600 uppercase text-xs print:bg-gray-200">
                        <th className="p-3 font-bold">Vacina / Imunizante</th>
                        <th className="p-3 font-bold">Data</th>
                        <th className="p-3 font-bold">Lote</th>
                        <th className="p-3 font-bold">Assinatura / Responsável</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {aplicacoes.length > 0 ? (
                        aplicacoes.map((app, idx) => (
                            <tr key={app.id} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-50'}`}>
                                <td className="p-3 font-semibold">{app.vacina.nome}</td>
                                <td className="p-3">{format(new Date(app.dataAplicacao), 'dd/MM/yyyy')}</td>
                                <td className="p-3 font-mono text-xs">{app.lote || 'N/A'}</td>
                                <td className="p-3 italic text-gray-500 text-xs">
                                    {app.responsavel ? `Aplicado por: ${app.responsavel}` : 'Validado pelo Sistema'}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-6 text-center text-gray-400 italic bg-gray-50 border-b border-gray-200">
                                Nenhuma dose registrada até o momento.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Rodapé / Assinatura */}
        <div className="mt-12 pt-8 border-t border-dashed border-gray-300 flex justify-between items-end text-xs text-gray-400">
            <div>
                <p>UNIVÁS - Universidade do Vale do Sapucaí</p>
                <p>Sistema de Gestão de Saúde Ocupacional</p>
            </div>
            <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-2"></div>
                <p>Assinatura do Responsável Técnico</p>
            </div>
        </div>
      </div>
    )
  }
)

CarteirinhaVacina.displayName = 'CarteirinhaVacina'