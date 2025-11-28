'use client'

import { formatDistanceToNow } from 'date-fns' 
import { ptBR } from 'date-fns/locale'
import { Syringe, Activity } from 'lucide-react'

interface AtividadeRecente {
  id: number
  dataAplicacao: string 
  lote: string
  funcionario: { nome: string }
  vacina: { nome: string }
}

interface RecentActivityFeedProps {
  atividades: AtividadeRecente[] 
}

export function RecentActivityFeed({ atividades }: RecentActivityFeedProps) {
  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
      <h3 className="text-lg font-semibold mb-4 text-text-base flex items-center gap-2 border-b pb-2 border-border">
        <Activity size={18}/> Atividade Recente
      </h3>
      
      {atividades.length === 0 ? (
          <p className="text-sm text-text-muted flex-grow flex items-center justify-center opacity-50">
            Nenhuma atividade recente.
          </p>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[250px] flex-grow pr-2 custom-scrollbar"> 
          {atividades.map((app) => (
            <li key={app.id} className="flex items-start gap-3 border-b pb-3 border-border last:border-b-0 last:pb-0">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                <Syringe size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-base">
                  <span className="font-semibold">{app.funcionario.nome}</span> recebeu <span className="font-semibold text-primary">{app.vacina.nome}</span>
                </p>
                <p className="text-xs text-text-muted mt-0.5" title={new Date(app.dataAplicacao).toLocaleString('pt-BR')}>
                  {formatDistanceToNow(new Date(app.dataAplicacao), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}