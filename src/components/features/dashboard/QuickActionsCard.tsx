'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserPlus, 
  FileDown, 
  CalendarPlus, 
  LifeBuoy, 
  Settings, 
  Syringe,
  Loader2 
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'

export function QuickActionsCard() {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)

  // Função genérica de navegação para manter o código limpo
  const navigateTo = (path: string) => {
    router.push(path)
  }

  // Função robusta de exportação
  const handleExportClick = async () => {
    if (isExporting) return // Previne duplo clique
    setIsExporting(true)

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch('/api/relatorios/pendencias');
        
        if (!res.ok) throw new Error('Falha na conexão');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Nome do arquivo com data formatada: relatorio_2025-11-25.csv
        a.download = `relatorio_pendencias_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        resolve(true)
      } catch (e) {
        reject(e)
      }
    });

    toast.promise(promise, {
      loading: 'Gerando arquivo CSV...',
      success: 'Download iniciado com sucesso!',
      error: 'Erro ao gerar relatório. Tente novamente.',
    });

    // Libera o botão após a promessa resolver/rejeitar
    promise.finally(() => setIsExporting(false));
  }

  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-text-base">Ações Rápidas</h3>
        <span className="text-xs text-text-muted bg-bg-base px-2 py-1 rounded border border-border">
          Atalhos
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-3 flex-grow content-start">
        
        {/* Agendar Vacinação  */}
        <ActionBtn 
          icon={CalendarPlus}
          label="Novo Agendamento"
          desc="Marcar vacina na agenda"
          onClick={() => navigateTo('/agenda')}
          color="text-primary"
          bg="bg-primary/10 hover:bg-primary/20"
          border="border-primary/20"
        />

        {/* Adicionar Funcionário */}
        <ActionBtn 
          icon={UserPlus}
          label="Cadastrar Funcionário"
          desc="Novo colaborador no sistema"
          onClick={() => navigateTo('/funcionarios')}
          color="text-blue-600"
          bg="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30"
          border="border-blue-200 dark:border-blue-800"
        />

        {/* Exportar Relatório  */}
        <button 
            onClick={handleExportClick}
            disabled={isExporting}
            className={`
                group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left
                bg-bg-base hover:bg-bg-surface hover:shadow-sm border-border hover:border-text-muted/30
                disabled:opacity-70 disabled:cursor-not-allowed
            `}
        >
            <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-colors group-hover:bg-slate-200 dark:group-hover:bg-slate-700">
                {isExporting ? (
                    <Loader2 size={20} className="text-slate-600 animate-spin" />
                ) : (
                    <FileDown size={20} className="text-slate-600 dark:text-slate-400" />
                )}
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm text-text-base truncate">Exportar Pendências</p>
                <p className="text-xs text-text-muted truncate">
                    {isExporting ? "Gerando arquivo..." : "Baixar CSV para Excel"}
                </p>
            </div>
        </button>

        {/* Atalhos Secundários */}
        <div className="grid grid-cols-2 gap-3 mt-1">
             <SmallActionBtn 
                icon={LifeBuoy} 
                label="Ajuda" 
                onClick={() => navigateTo('/ajuda')} 
                color="text-purple-500"
             />
             <SmallActionBtn 
                icon={Settings} 
                label="Ajustes" 
                onClick={() => navigateTo('/configuracoes')} 
                color="text-text-muted"
             />
        </div>

      </div>
    </div>
  )
}

// --- SUB-COMPONENTES LOCAIS PARA ORGANIZAÇÃO ---
interface ActionBtnProps {
    icon: React.ElementType
    label: string
    desc: string
    onClick: () => void
    color: string
    bg: string
    border: string
}

function ActionBtn({ icon: Icon, label, desc, onClick, color, bg, border }: ActionBtnProps) {
    return (
        <button 
            onClick={onClick}
            className={`
                group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 text-left
                ${bg} ${border}
            `}
        >
            <div className={`h-10 w-10 rounded-lg bg-white/60 dark:bg-black/20 flex items-center justify-center shrink-0 backdrop-blur-sm`}>
                <Icon size={20} className={color} />
            </div>
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-sm text-text-base truncate group-hover:text-opacity-80">{label}</p>
                <p className="text-xs text-text-muted/80 truncate">{desc}</p>
            </div>
        </button>
    )
}

function SmallActionBtn({ icon: Icon, label, onClick, color }: any) {
    return (
        <button 
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-lg border border-border bg-bg-base hover:bg-bg-surface hover:border-primary/30 transition-all"
        >
            <Icon size={18} className={color} />
            <span className="text-xs font-medium text-text-muted">{label}</span>
        </button>
    )
}