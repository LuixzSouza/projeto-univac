'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { IFuncionario } from '@/lib/mock-data'

interface FuncionarioFormProps {
  onClose: () => void
  funcionarioParaEditar: IFuncionario | null
}

// Estado inicial do formulário
const estadoInicial = {
  nome: '',
  email: '',
  numeroRegistro: '',
  cpf: '',
  senha: '',
  role: 'FUNCIONARIO',
  status: true,
}

export function FuncionarioForm({
  onClose,
  funcionarioParaEditar,
}: FuncionarioFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const modoEdicao = !!funcionarioParaEditar

  // Quando abre o form, se for edição, preenche com os dados do funcionário
  useEffect(() => {
    if (modoEdicao && funcionarioParaEditar) {
      setFormData({
        nome: funcionarioParaEditar.nome,
        email: funcionarioParaEditar.email,
        numeroRegistro: String(funcionarioParaEditar.numeroRegistro),
        cpf: funcionarioParaEditar.cpf,
        senha: '',
        role: funcionarioParaEditar.role,
        status: funcionarioParaEditar.status,
      })
    } else {
      setFormData(estadoInicial)
    }
  }, [funcionarioParaEditar, modoEdicao])

  // Atualiza o estado conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    if (id === 'status') {
      setFormData((prev) => ({ ...prev, status: value === 'true' }))
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  // Submete para API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url =
        modoEdicao && funcionarioParaEditar
          ? `/api/funcionarios/${funcionarioParaEditar.id}`
          : '/api/funcionarios'

      const method = modoEdicao ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const { error } = await response.json()
        alert(`Erro: ${error || 'Falha ao salvar funcionário'}`)
        return
      }

      const data = await response.json()
      alert(modoEdicao ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!')
      console.log(data)

      // 🔥 Atualiza a lista em tempo real (sem alterar nada no seu front)
      window.dispatchEvent(new Event("atualizar-funcionarios"))

      onClose()
    } catch (error) {
      console.error(error)
      alert('Erro inesperado ao salvar funcionário.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="nome"
        label="Nome Completo"
        type="text"
        value={formData.nome}
        onChange={handleChange}
        required
      />
      <Input
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        id="numeroRegistro"
        label="Nº de Registro"
        type="number"
        value={formData.numeroRegistro}
        onChange={handleChange}
        required
      />
      <Input
        id="cpf"
        label="CPF"
        type="text"
        value={formData.cpf}
        onChange={handleChange}
        required
      />
      <Input
        id="senha"
        label="Senha"
        type="password"
        value={formData.senha}
        onChange={handleChange}
        placeholder={modoEdicao ? '(Deixe em branco para não alterar)' : ''}
      />

      <Select
        id="role"
        label="Perfil"
        value={formData.role}
        onChange={handleChange}
      >
        <option value="FUNCIONARIO">Funcionário</option>
        <option value="ADMIN">Admin</option>
      </Select>

      <Select
        id="status"
        label="Status"
        value={String(formData.status)}
        onChange={handleChange}
      >
        <option value="true">Ativo</option>
        <option value="false">Inativo</option>
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
