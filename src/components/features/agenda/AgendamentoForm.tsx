'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

// Interfaces Locais
interface IFuncionario { id: number; nome: string; status: boolean }
interface IVacina { id: number; nome: string }

interface AgendamentoFormProps {
  onClose: () => void
  agendamentoParaEditar: any | null 
  slotSelecionado: { start: Date, end: Date } | null
  funcionarios: IFuncionario[]
  vacinas: IVacina[]
  onSaveSuccess: () => void 
  onCheckIn?: (agendamento: any) => void // ✨ Nova prop para o fluxo de check-in
}

const estadoInicial = {
  funcionarioId: '',
  vacinaId: '',
  dataInicio: '',
  horaInicio: '',
}

export function AgendamentoForm({
  onClose,
  agendamentoParaEditar,
  slotSelecionado,
  funcionarios,
  vacinas,
  onSaveSuccess,
  onCheckIn, // Recebendo a função
}: AgendamentoFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const [isLoading, setIsLoading] = useState(false)
  const modoEdicao = !!agendamentoParaEditar

  const formatDate = (date: Date) => date.toISOString().split('T')[0]
  const formatTime = (date: Date) => date.toTimeString().slice(0, 5)

  useEffect(() => {
    if (modoEdicao && agendamentoParaEditar) {
      const start = new Date(agendamentoParaEditar.start)
      setFormData({
        funcionarioId: String(agendamentoParaEditar.resource.funcionarioId),
        vacinaId: String(agendamentoParaEditar.resource.vacinaId),
        dataInicio: formatDate(start),
        horaInicio: formatTime(start),
      })
    } else if (slotSelecionado) {
      setFormData({
        ...estadoInicial,
        dataInicio: formatDate(slotSelecionado.start),
        horaInicio: formatTime(slotSelecionado.start),
      })
    } else {
      setFormData(estadoInicial)
    }
  }, [agendamentoParaEditar, modoEdicao, slotSelecionado])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dataCombinada = new Date(`${formData.dataInicio}T${formData.horaInicio}:00`)

      const payload = {
        dataAgendamento: dataCombinada,
        funcionarioId: Number(formData.funcionarioId),
        vacinaId: Number(formData.vacinaId),
        status: 'Agendado'
      }

      const url = modoEdicao 
        ? `/api/agendamentos/${agendamentoParaEditar.id}` 
        : '/api/agendamentos'
      
      const method = modoEdicao ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Erro ao salvar agendamento")

      toast.success(`Agendamento confirmado para ${formData.dataInicio} às ${formData.horaInicio}!`)
      onSaveSuccess()
      onClose()

    } catch (error: any) {
        console.error("Erro:", error);
        toast.error("Erro ao agendar. Verifique se o horário está disponível.")
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select id="funcionarioId" label="Funcionário" value={formData.funcionarioId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione</option>
        {funcionarios.filter(f => f.status).map((func) => <option key={func.id} value={func.id}>{func.nome}</option>)}
      </Select>

      <Select id="vacinaId" label="Vacina" value={formData.vacinaId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione</option>
        {vacinas.map((vac) => <option key={vac.id} value={vac.id}>{vac.nome}</option>)}
      </Select>

      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 pt-2 border-border md:grid-cols-2">
         <legend className="px-2 text-sm font-medium text-text-muted">Data e Hora</legend>
        <Input id="dataInicio" label="Data" type="date" value={formData.dataInicio} onChange={handleChange} required disabled={isLoading}/>
        <Input id="horaInicio" label="Hora" type="time" value={formData.horaInicio} onChange={handleChange} required disabled={isLoading}/>
      </fieldset>

      {/* Botões */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-center pt-4 border-t border-border mt-6 gap-4">
        
        {/* ✨ Botão de Check-in (Só aparece se estiver editando e não estiver concluído) */}
        {modoEdicao && agendamentoParaEditar?.status !== 'Concluído' && onCheckIn ? (
            <Button 
                type="button" 
                onClick={() => onCheckIn(agendamentoParaEditar)}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-none shadow-sm"
                title="Confirmar que a vacina foi aplicada"
            >
                <CheckCircle size={16} className="mr-2" /> Realizar Check-in
            </Button>
        ) : (
            <div className="hidden sm:block"></div> // Espaçador
        )}

        <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}> Cancelar </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="flex items-center gap-2">
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : (modoEdicao ? 'Salvar' : 'Agendar')}
            </Button>
        </div>
      </div>
    </form>
  )
}