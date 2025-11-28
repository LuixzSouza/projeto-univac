'use client'

import { AlertTriangle, CheckCircle } from 'lucide-react'

interface VacinaSimples {
  id: number
  obrigatoriedade: boolean
}

interface FuncionarioComAplicacoes {
  id: number
  nome: string
  aplicacoes: { vacinaId: number }[] 
}

interface ComplianceSummaryCardProps {
  funcionarios: FuncionarioComAplicacoes[]
  vacinasObrigatorias: VacinaSimples[]
}

// Lógica Real: Verifica se o funcionário tomou TODAS as vacinas obrigatórias
function verificarStatusObrigatorio(func: FuncionarioComAplicacoes, vacinasObrigatorias: VacinaSimples[]): boolean {
    if (vacinasObrigatorias.length === 0) return true; // Se não tem obrigatória, todos estão ok

    const idsVacinasTomadas = func.aplicacoes.map(app => app.vacinaId);
    
    // Verifica se TODOS os IDs obrigatórios estão na lista de tomadas
    return vacinasObrigatorias.every(obrigatoria => idsVacinasTomadas.includes(obrigatoria.id));
}

export function ComplianceSummaryCard({ funcionarios, vacinasObrigatorias }: ComplianceSummaryCardProps) {
    const totalFuncionarios = funcionarios.length;

    // Se não houver dados ainda, não explode o layout
    if (totalFuncionarios === 0) {
       return (
         <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex items-center justify-center">
            <p className="text-text-muted text-sm">Aguardando dados...</p>
         </div>
       )
    }

    const funcionariosEmDia = funcionarios.filter(func => verificarStatusObrigatorio(func, vacinasObrigatorias)).length;
    const percentagemConformidade = Math.round((funcionariosEmDia / totalFuncionarios) * 100);
    const pendentes = totalFuncionarios - funcionariosEmDia;

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col items-center justify-center text-center border border-border">
      <h3 className="text-md font-medium mb-2 text-text-muted flex items-center gap-2">
        <CheckCircle size={16} className="text-primary"/> Conformidade (Obrigatórias)
      </h3>
      
      <div className={`text-5xl font-bold mb-2 ${percentagemConformidade >= 80 ? 'text-primary' : 'text-yellow-500'}`}>
        {percentagemConformidade}%
      </div>
      
      <p className="text-sm text-text-base">
        <span className="font-semibold text-text-base">{funcionariosEmDia}</span> de <span className="font-semibold text-text-base">{totalFuncionarios}</span> funcionários em dia.
      </p>
      
      {percentagemConformidade < 100 && (
        <div className="mt-4 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                <AlertTriangle size={14} /> {pendentes} {pendentes === 1 ? 'pendente' : 'pendentes'} de regularização
            </p>
        </div>
      )}
    </div>
  )
}