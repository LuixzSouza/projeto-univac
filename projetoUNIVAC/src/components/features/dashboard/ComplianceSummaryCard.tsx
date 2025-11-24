'use client'
import { IFuncionario, IVacina } from '@/lib/mock-data'
import { CheckCircle, AlertTriangle } from 'lucide-react'

interface ComplianceSummaryCardProps {
  funcionarios: IFuncionario[]
  vacinasObrigatorias: IVacina[]
}

function verificarStatusObrigatorio(func: IFuncionario, vacinasObrigatorias: IVacina[]): boolean {
    return func.statusVacinacao === 'completo';
}

export function ComplianceSummaryCard({ funcionarios, vacinasObrigatorias }: ComplianceSummaryCardProps) {
    const totalFuncionarios = funcionarios.length;
    if (totalFuncionarios === 0) return null; 

    const funcionariosEmDia = funcionarios.filter(func => verificarStatusObrigatorio(func, vacinasObrigatorias)).length;
    const percentagemConformidade = Math.round((funcionariosEmDia / totalFuncionarios) * 100);

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col items-center justify-center text-center">
      <h3 className="text-md font-medium mb-2 text-text-muted">Conformidade (Obrigatórias)</h3>
      
      <div className={`text-6xl font-bold mb-2 ${percentagemConformidade >= 80 ? 'text-primary' : 'text-yellow-500'}`}>
        {percentagemConformidade}%
      </div>
      
      <p className="text-sm text-text-base">
        {funcionariosEmDia} de {totalFuncionarios} funcionários estão em dia.
      </p>
      
      {percentagemConformidade < 100 && (
        <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
            <AlertTriangle size={14} /> {totalFuncionarios - funcionariosEmDia} pendentes
        </p>
      )}
    </div>
  )
}