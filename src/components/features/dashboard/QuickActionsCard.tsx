'use client'
import { Button } from '@/components/ui/Button'
import { Plus, CheckSquare, UserPlus, FileDown } from 'lucide-react'
import { useRouter } from 'next/navigation' 

export function QuickActionsCard() {
  const router = useRouter()

  const handleRegisterClick = () => {
    alert('TODO: Abrir modal de Registrar Aplicação')
  }

  const handleAddFuncionarioClick = () => {
     router.push('/funcionarios?action=add'); 
   }

  const handleExportClick = () => {
     alert('TODO: Implementar exportação de relatório')
   }


  return (
    <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-text-base">Ações Rápidas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow content-start">
        <Button variant="secondary" onClick={handleRegisterClick} className="flex items-center justify-start gap-2 text-left p-3 h-auto">
          <CheckSquare size={18} className="text-primary shrink-0" />
          <span className="flex-grow">Registrar Aplicação</span>
        </Button>
        <Button variant="secondary" onClick={handleAddFuncionarioClick} className="flex items-center justify-start gap-2 text-left p-3 h-auto">
          <UserPlus size={18} className="text-blue-500 shrink-0" />
          <span className="flex-grow">Adicionar Funcionário</span>
        </Button>
        <Button variant="secondary" onClick={() => router.push('/vacinas?action=addTipo')} className="flex items-center justify-start gap-2 text-left p-3 h-auto">
          <Plus size={18} className="text-yellow-500 shrink-0" />
          <span className="flex-grow">Adicionar Tipo Vacina</span>
        </Button>
         <Button variant="secondary" onClick={handleExportClick} className="flex items-center justify-start gap-2 text-left p-3 h-auto">
          <FileDown size={18} className="text-text-muted shrink-0" />
          <span className="flex-grow">Exportar Pendências</span>
        </Button>
      </div>
    </div>
  )
}
