'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { IVacina } from '@/lib/mock-data'

interface VacinaFormProps {
  onClose: () => void
  vacinaParaEditar: IVacina | null
}

const estadoInicial = {
  nome: '',
  descricao: '',
  obrigatoriedade: false,
}

export function VacinaForm({
  onClose,
  vacinaParaEditar,
}: VacinaFormProps) {
  const [formData, setFormData] = useState(estadoInicial)

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
    if (id === 'obrigatoriedade') {
      setFormData((prev) => ({ ...prev, obrigatoriedade: value === 'true' }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (modoEdicao && vacinaParaEditar) {
      console.log('--- VACINA ATUALIZADA (MOCK) ---')
      console.log({ id: vacinaParaEditar.id, ...formData })
      alert('Vacina atualizada com sucesso! (Ver console)')
    } else {
      console.log('--- NOVA VACINA (MOCK) ---')
      console.log(formData)
      alert('Vacina adicionada com sucesso! (Ver console)')
    }
    onClose() 
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
      />
      <Input
        id="descricao"
        label="Descrição"
        type="text"
        value={formData.descricao}
        onChange={handleChange}
        required
      />

      <Select
        id="obrigatoriedade"
        label="Obrigatoriedade"
        value={String(formData.obrigatoriedade)} 
        onChange={handleChange}
      >
        <option value="true">Obrigatória</option>
        <option value="false">Não Obrigatória</option>
      </Select>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {modoEdicao ? 'Salvar Alterações' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}