'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Loader2, CheckCircle, Trash2, AlertTriangle } from 'lucide-react' // Novos ícones
import { toast } from 'sonner'

interface IFuncionario { id: number; nome: string; status: boolean }
interface IVacina { id: number; nome: string }

interface AgendamentoFormProps {
  onClose: () => void
  agendamentoParaEditar: any | null 
  slotSelecionado: { start: Date, end: Date } | null
  funcionarios: IFuncionario[]
  vacinas: IVacina[]
  onSaveSuccess: () => void 
  onCheckIn?: (agendamento: any) => void 
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
  onCheckIn,
}: AgendamentoFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // Estado para exclusão
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

  // CANCELAR AGENDAMENTO
  const handleDelete = async () => {
      if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return;
      
      setIsDeleting(true);
      try {
          const res = await fetch(`/api/agendamentos/${agendamentoParaEditar.id}`, {
              method: 'DELETE'
          });

          if (!res.ok) throw new Error("Erro ao excluir");

          toast.success("Agendamento cancelado com sucesso.");
          onSaveSuccess(); // Atualiza a agenda
          onClose();
      } catch (error) {
          toast.error("Não foi possível cancelar o agendamento.");
      } finally {
          setIsDeleting(false);
      }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select id="funcionarioId" label="Funcionário" value={formData.funcionarioId} onChange={handleChange} required disabled={isLoading || isDeleting}>
        <option value="" disabled>Selecione</option>
        {funcionarios.filter(f => f.status).map((func) => <option key={func.id} value={func.id}>{func.nome}</option>)}
      </Select>

      <Select id="vacinaId" label="Vacina" value={formData.vacinaId} onChange={handleChange} required disabled={isLoading || isDeleting}>
        <option value="" disabled>Selecione</option>
        {vacinas.map((vac) => <option key={vac.id} value={vac.id}>{vac.nome}</option>)}
      </Select>

      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 pt-2 border-border md:grid-cols-2">
         <legend className="px-2 text-sm font-medium text-text-muted">Data e Hora</legend>
        <Input id="dataInicio" label="Data" type="date" value={formData.dataInicio} onChange={handleChange} required disabled={isLoading || isDeleting}/>
        <Input id="horaInicio" label="Hora" type="time" value={formData.horaInicio} onChange={handleChange} required disabled={isLoading || isDeleting}/>
      </fieldset>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-border mt-6 gap-4">
        
        <div className="flex gap-2 w-full sm:w-auto">
            {/* Botão de Check-in */}
            {modoEdicao && agendamentoParaEditar?.status !== 'Concluído' && onCheckIn && (
                <Button 
                    type="button" 
                    onClick={() => onCheckIn(agendamentoParaEditar)}
                    className="bg-green-600 hover:bg-green-700 text-white border-none shadow-sm flex-grow sm:flex-grow-0"
                    title="Confirmar vacinação"
                    disabled={isLoading || isDeleting}
                >
                    <CheckCircle size={16} className="mr-2" /> Check-in
                </Button>
            )}
            
            {/* Botão de Excluir */}
            {modoEdicao && (
                <Button
                    type="button"
                    variant="danger" 
                    onClick={handleDelete}
                    disabled={isLoading || isDeleting}
                    className="flex items-center justify-center"
                    title="Cancelar agendamento"
                >
                    {isDeleting ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                </Button>
            )}
        </div>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading || isDeleting}> Cancelar </Button>
            <Button type="submit" variant="primary" disabled={isLoading || isDeleting} className="flex items-center gap-2">
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : (modoEdicao ? 'Salvar' : 'Agendar')}
            </Button>
        </div>
      </div>
    </form>
  )
}