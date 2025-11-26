'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Loader2 } from 'lucide-react' // Adicionei o ícone de loading
import { toast } from 'sonner'
import { formatTitleCase } from '@/lib/formatters' // <--- Importação da formatação

interface IVacina {
  id?: number
  nome: string
  descricao: string
  obrigatoriedade: boolean
}

interface VacinaFormProps {
  onClose: () => void
  vacinaParaEditar: IVacina | null
  onSuccess: () => void 
}

const estadoInicial = {
  nome: '',
  descricao: '',
  obrigatoriedade: false,
}

export function VacinaForm({
  onClose,
  vacinaParaEditar,
  onSuccess
}: VacinaFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const [loading, setLoading] = useState(false)

  const modoEdicao = !!vacinaParaEditar

  useEffect(() => {
    if (modoEdicao && vacinaParaEditar) {
      setFormData({
        nome: vacinaParaEditar.nome,
        descricao: vacinaParaEditar.descricao,
        obrigatoriedade: vacinaParaEditar.obrigatoriedade,
      })
    } else {
      setFormData(estadoInicial)
    }
  }, [vacinaParaEditar, modoEdicao])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target
    
    // Aplica formatação visual
    if (id === 'nome') {
        // Força Primeira Letra Maiúscula (Estética)
        setFormData((prev) => ({ ...prev, [id]: formatTitleCase(value) }))
    }
    else if (id === 'obrigatoriedade') {
      setFormData((prev) => ({ ...prev, obrigatoriedade: value === 'true' }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = modoEdicao 
        ? `/api/vacinas/${vacinaParaEditar.id}` 
        : '/api/vacinas' 
      
      const method = modoEdicao ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar')
      }

      toast.success(modoEdicao ? 'Vacina atualizada!' : 'Vacina criada com sucesso!')
      onSuccess() 
      onClose()   

    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar vacina')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="nome"
        label="Nome da Vacina"
        type="text"
        value={formData.nome}
        onChange={handleChange}
        required
        placeholder="Ex: Gripe H1N1"
      />
      <div className="mt-4">
        <Input
          id="descricao"
          label="Descrição"
          type="text"
          value={formData.descricao}
          onChange={handleChange}
          required
          placeholder="Breve descrição..."
        />
      </div>

      <div className="mt-4">
        <Select
          id="obrigatoriedade"
          label="Obrigatoriedade"
          value={String(formData.obrigatoriedade)}
          onChange={handleChange}
        >
          <option value="true">Obrigatória</option>
          <option value="false">Não Obrigatória</option>
        </Select>
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onClose}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Salvando...' : (modoEdicao ? 'Salvar Alterações' : 'Salvar')}
        </Button>
      </div>
    </form>
  )
}