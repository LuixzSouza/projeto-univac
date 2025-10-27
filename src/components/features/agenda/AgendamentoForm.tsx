'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { IAgendamento, IFuncionario, IVacina } from '@/lib/mock-data'
import {
  dateToDateString,
  dateToTimeString,
  combineDateTime,
} from '@/lib/date-utils'
import { Loader2 } from 'lucide-react'

// Interface das Props
interface AgendamentoFormProps {
  onClose: () => void
  agendamentoParaEditar: IAgendamento | null
  slotSelecionado: { start: Date, end: Date } | null
  funcionarios: IFuncionario[]
  vacinas: IVacina[]
  onSaveSuccess: (agendamento: IAgendamento, isEdit: boolean) => void
}

// Estado Inicial
const estadoInicial = {
  funcionarioId: '',
  vacinaId: '',
  dataInicio: '',
  horaInicio: '',
  dataFim: '',
  horaFim: '',
}

export function AgendamentoForm({
  onClose,
  agendamentoParaEditar,
  slotSelecionado,
  funcionarios,
  vacinas,
  onSaveSuccess,
}: AgendamentoFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const [isLoading, setIsLoading] = useState(false)
  const modoEdicao = !!agendamentoParaEditar

  // Efeito para preencher o formulário (sem alterações)
  useEffect(() => {
    if (modoEdicao && agendamentoParaEditar) {
      setFormData({
        funcionarioId: String(agendamentoParaEditar.funcionarioId),
        vacinaId: String(agendamentoParaEditar.vacinaId),
        dataInicio: dateToDateString(agendamentoParaEditar.start),
        horaInicio: dateToTimeString(agendamentoParaEditar.start),
        dataFim: dateToDateString(agendamentoParaEditar.end),
        horaFim: dateToTimeString(agendamentoParaEditar.end),
      })
    } else if (slotSelecionado) {
      setFormData({
        ...estadoInicial,
        dataInicio: dateToDateString(slotSelecionado.start),
        horaInicio: dateToTimeString(slotSelecionado.start),
        dataFim: dateToDateString(slotSelecionado.end),
        horaFim: dateToTimeString(slotSelecionado.end),
      })
    }
     else {
      setFormData(estadoInicial)
    }
  }, [agendamentoParaEditar, modoEdicao, slotSelecionado])

  // Handler para mudança nos inputs/selects (sem alterações)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  // Handler para submeter o formulário (sem alterações)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500)); // Simula API

    try {
      const inicio = combineDateTime(formData.dataInicio, formData.horaInicio)
      const fim = combineDateTime(formData.dataFim, formData.horaFim)

      if (fim < inicio) { throw new Error("Data final anterior à inicial."); }

      const func = funcionarios.find(f => f.id === Number(formData.funcionarioId))
      const vac = vacinas.find(v => v.id === Number(formData.vacinaId))
      const title = `${func?.nome || '?'} - ${vac?.nome || '?'}`

      const dadosAgendamento = { title, start: inicio, end: fim, funcionarioId: Number(formData.funcionarioId), vacinaId: Number(formData.vacinaId) }

      const agendamentoFinal: IAgendamento = modoEdicao
          ? { ...agendamentoParaEditar!, ...dadosAgendamento }
          : { id: Date.now(), ...dadosAgendamento };

      if (modoEdicao) console.log('--- AGENDAMENTO ATUALIZADO (MOCK) ---', agendamentoFinal)
      else console.log('--- NOVO AGENDAMENTO (MOCK) ---', agendamentoFinal)

      setIsLoading(false)
      onSaveSuccess(agendamentoFinal, modoEdicao) // Chama callback

    } catch (error: any) {
        console.error("Erro:", error);
        alert(`Erro: ${error.message || 'Não foi possível salvar.'}`);
        setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Dropdown Funcionários */}
      <Select id="funcionarioId" label="Funcionário" value={formData.funcionarioId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione</option>
        {funcionarios.filter(f => f.status).map((func) => <option key={func.id} value={func.id}>{func.nome}</option>)}
      </Select>
      {/* Dropdown Vacinas */}
      <Select id="vacinaId" label="Vacina" value={formData.vacinaId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione</option>
        {vacinas.map((vac) => <option key={vac.id} value={vac.id}>{vac.nome}</option>)}
      </Select>
      {/* Inputs Data/Hora */}
      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 pt-2 border-border md:grid-cols-2">
         <legend className="px-2 text-sm font-medium text-text-muted">Início</legend>
        <Input id="dataInicio" label="Data" type="date" value={formData.dataInicio} onChange={handleChange} required disabled={isLoading}/>
        <Input id="horaInicio" label="Hora" type="time" value={formData.horaInicio} onChange={handleChange} required disabled={isLoading} step={1800}/>
      </fieldset>
      <fieldset className="grid grid-cols-1 gap-4 rounded border p-4 pt-2 border-border md:grid-cols-2">
         <legend className="px-2 text-sm font-medium text-text-muted">Fim</legend>
        <Input id="dataFim" label="Data" type="date" value={formData.dataFim} onChange={handleChange} required disabled={isLoading}/>
        <Input id="horaFim" label="Hora" type="time" value={formData.horaFim} onChange={handleChange} required disabled={isLoading} step={1800}/>
      </fieldset>
      {/* Botões */}
      <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-border">
        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}> Cancelar </Button>
        <Button type="submit" variant="primary" disabled={isLoading} className="flex min-w-[110px] items-center justify-center gap-2">
          {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</> : (modoEdicao ? 'Salvar Alterações' : 'Salvar')}
        </Button>
      </div>
    </form>
  )
}