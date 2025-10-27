'use client'
import { IAplicacao } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns' // Para "há X minutos"
import { ptBR } from 'date-fns/locale'
import { Syringe } from 'lucide-react'

interface RecentActivityFeedProps {
  atividades: IAplicacao[] 
}

export function RecentActivityFeed({ atividades }: RecentActivityFeedProps) {
  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-text-base">Atividade Recente</h3>
      {atividades.length === 0 ? (
          <p className="text-sm text-text-muted flex-grow flex items-center justify-center">Nenhuma atividade recente.</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto max-h-[250px] flex-grow pr-2"> {/* Scroll e altura max */}
          {atividades.map((app) => (
            <li key={app.id} className="flex items-start gap-3 border-b pb-2 border-border last:border-b-0">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Syringe size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-base">
                  <span className="font-semibold">{app.funcionarioNome}</span> recebeu <span className="font-semibold">{app.tipoVacina}</span>
                </p>
                <p className="text-xs text-text-muted" title={app.dataAplicacao.toLocaleString('pt-BR')}>
                  {formatDistanceToNow(app.dataAplicacao, { addSuffix: true, locale: ptBR })}
                   {` por ${app.responsavel}`} 
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
