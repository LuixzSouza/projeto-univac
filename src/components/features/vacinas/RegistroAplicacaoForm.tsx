'use client'
import { useState } from 'react'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { IFuncionario, IVacina } from '@/lib/mock-data'
import { Loader2, Check } from 'lucide-react'

interface RegistroAplicacaoFormProps {
  funcionarios: IFuncionario[]
  vacinas: IVacina[]
  onRegister: (data: any) => Promise<void> 
}

export function RegistroAplicacaoForm({ funcionarios, vacinas, onRegister }: RegistroAplicacaoFormProps) {
  const [formData, setFormData] = useState({
    funcionarioId: '',
    responsavel: '',
    dataAplicacao: '',
    vacinaId: '',
    lote: '', 
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    setSuccess(false); 
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)
    console.log("Registando aplicação (Mock):", formData)
    await onRegister(formData); 
    setIsLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000); 
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-text-base">
        Registro de Aplicação de Vacina
      </h2>
      <Select id="funcionarioId" label="Funcionário Vacinado" value={formData.funcionarioId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione o Funcionário</option>
        {funcionarios.filter(f => f.status).map((func) => <option key={func.id} value={func.id}>{func.nome}</option>)} {/* Só funcionários ativos */}
      </Select>
      <Input id="responsavel" label="Funcionário Responsável" value={formData.responsavel} onChange={handleChange} required disabled={isLoading} />
      <Input id="dataAplicacao" label="Data de Aplicação" type="date" value={formData.dataAplicacao} onChange={handleChange} required disabled={isLoading} />
      <Select id="vacinaId" label="Tipo de Vacina" value={formData.vacinaId} onChange={handleChange} required disabled={isLoading}>
        <option value="" disabled>Selecione a Vacina</option>
        {vacinas.map((vac) => <option key={vac.id} value={vac.id}>{vac.nome}</option>)}
      </Select>
      <Input id="lote" label="Lote (Opcional)" value={formData.lote} onChange={handleChange} disabled={isLoading} />

      <Button type="submit" variant="primary" className="w-full flex items-center justify-center gap-2" disabled={isLoading}>
        {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</> :
         success ? <><Check size={18} /> Registado!</> : 'Registar Vacina'}
      </Button>
    </form>
  )
}