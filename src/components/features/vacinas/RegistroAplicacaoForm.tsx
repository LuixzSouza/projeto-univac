'use client'

import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Loader2, Check, Syringe } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react' 
import { logAction } from '@/lib/logger' 

// Interfaces locais
interface FuncionarioSimples { id: number; nome: string; status: boolean }
interface VacinaSimples { id: number; nome: string }

export interface RegistroInitialData {
  funcionarioId: string
  vacinaId: string
  agendamentoId?: number
}

interface RegistroAplicacaoFormProps {
  funcionarios: FuncionarioSimples[]
  vacinas: VacinaSimples[]
  onRegister?: () => void
  initialData?: RegistroInitialData | null
}

export function RegistroAplicacaoForm({ funcionarios, vacinas, onRegister, initialData }: RegistroAplicacaoFormProps) {
  const { data: session } = useSession() // <--- Pegamos quem está aplicando
  
  const [formData, setFormData] = useState({
    funcionarioId: '',
    responsavel: '', 
    dataAplicacao: new Date().toISOString().split('T')[0],
    vacinaId: '',
    lote: '', 
  })
  
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData) {
        setFormData(prev => ({
            ...prev,
            funcionarioId: initialData.funcionarioId,
            vacinaId: initialData.vacinaId
        }))
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const promise = new Promise(async (resolve, reject) => {
        try {
            const resApp = await fetch('/api/aplicacoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    funcionarioId: Number(formData.funcionarioId),
                    vacinaId: Number(formData.vacinaId),
                    dataAplicacao: new Date(formData.dataAplicacao),
                    lote: formData.lote,
                })
            })

            if (!resApp.ok) throw new Error('Erro ao registrar aplicação')

            if (initialData?.agendamentoId) {
                await fetch(`/api/agendamentos/${initialData.agendamentoId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'Concluído' })
                })
            }
            
            // Achar os nomes para o log ficar legível
            const nomeFunc = funcionarios.find(f => f.id === Number(formData.funcionarioId))?.nome || `ID ${formData.funcionarioId}`
            const nomeVac = vacinas.find(v => v.id === Number(formData.vacinaId))?.nome || `ID ${formData.vacinaId}`

            // Registrar ação
            await logAction(
                "APLICACAO", 
                "Vacina", 
                `Registrou aplicação de ${nomeVac} em ${nomeFunc}. Lote: ${formData.lote || 'N/A'}`, 
                session?.user?.email || "Sistema"
            );
            
            resolve(true)
        } catch (error) {
            reject(error)
        }
    });

    toast.promise(promise, {
        loading: 'Processando...',
        success: () => {
            setFormData(prev => ({ ...prev, funcionarioId: '', vacinaId: '', lote: '' }));
            if (onRegister) onRegister();
            return initialData?.agendamentoId 
                ? 'Check-in realizado! Agendamento concluído.' 
                : 'Vacina registrada com sucesso!';
        },
        error: (err: any) => `Erro: ${err.message}`,
    });

    promise.finally(() => setIsLoading(false));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-sm border border-border">
      <h2 className="text-xl font-semibold mb-4 text-text-base flex items-center gap-2">
        <Syringe className="text-primary" size={20} /> 
        {initialData ? 'Confirmar Check-in de Vacina' : 'Registro de Vacina'}
      </h2>
      
      <Select 
        id="funcionarioId" 
        label="Funcionário Vacinado" 
        value={formData.funcionarioId} 
        onChange={handleChange} 
        required 
        disabled={isLoading || !!initialData} 
      >
        <option value="" disabled>Selecione o Funcionário</option>
        {funcionarios.filter(f => f.status).map((func) => (
            <option key={func.id} value={func.id}>{func.nome}</option>
        ))}
      </Select>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            id="dataAplicacao" 
            label="Data da Aplicação" 
            type="date" 
            value={formData.dataAplicacao} 
            onChange={handleChange} 
            required 
            disabled={isLoading} 
          />
          
          <Input 
            id="responsavel" 
            label="Responsável" 
            value={formData.responsavel} 
            onChange={handleChange} 
            placeholder="Quem aplicou?"
            required 
            disabled={isLoading} 
          />
      </div>

      <Select 
        id="vacinaId" 
        label="Vacina Aplicada" 
        value={formData.vacinaId} 
        onChange={handleChange} 
        required 
        disabled={isLoading || !!initialData} 
      >
        <option value="" disabled>Selecione a Vacina</option>
        {vacinas.map((vac) => (
            <option key={vac.id} value={vac.id}>{vac.nome}</option>
        ))}
      </Select>

      <Input 
        id="lote" 
        label="Lote (Opcional)" 
        value={formData.lote} 
        onChange={handleChange} 
        disabled={isLoading} 
        placeholder="Ex: AB-123"
      />

      <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2 mt-4" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check size={18} />}
        {isLoading ? 'Processando...' : initialData ? 'Confirmar Aplicação & Concluir Agenda' : 'Registrar Aplicação'}
      </Button>
    </form>
  )
}