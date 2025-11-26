'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
// Importamos a interface localmente para evitar erros de mock
import { IFuncionario } from './FuncionarioTable' 
import { toast } from 'sonner'
import { formatCPF, formatRegistro, formatTitleCase } from '@/lib/formatters'

interface FuncionarioFormProps {
  onClose: () => void
  funcionarioParaEditar: IFuncionario | null
  onSuccess: () => void // Adicionado callback de sucesso
}

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
  onSuccess
}: FuncionarioFormProps) {
  const [formData, setFormData] = useState(estadoInicial)
  const [loading, setLoading] = useState(false) // Estado de carregamento
  const modoEdicao = !!funcionarioParaEditar

  useEffect(() => {
    if (modoEdicao && funcionarioParaEditar) {
      setFormData({
        nome: funcionarioParaEditar.nome,
        email: funcionarioParaEditar.email,
        numeroRegistro: String(funcionarioParaEditar.numeroRegistro),
        cpf: funcionarioParaEditar.cpf,
        senha: '', // Senha sempre começa vazia na edição
        role: funcionarioParaEditar.role,
        status: funcionarioParaEditar.status,
      })
    } else {
      setFormData(estadoInicial)
    }
  }, [funcionarioParaEditar, modoEdicao])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    
    // ... seus outros ifs (cpf, status) ...

    if (id === 'cpf') {
        setFormData((prev) => ({ ...prev, [id]: formatCPF(value) }))
    }
    else if (id === 'nome') {
        setFormData((prev) => ({ ...prev, [id]: formatTitleCase(value) }))
    }

    else if (id === 'numeroRegistro') {
        setFormData((prev) => ({ ...prev, [id]: formatRegistro(value) }))
    }
    else if (id === 'status') {
        setFormData((prev) => ({ ...prev, status: value === 'true' }))
    } 
    else {
        setFormData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = modoEdicao && funcionarioParaEditar
          ? `/api/funcionarios/${funcionarioParaEditar.id}`
          : '/api/funcionarios'

      const method = modoEdicao ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao salvar')
      }

      // Sucesso!
      toast.success(modoEdicao ? 'Funcionário atualizado!' : 'Funcionário cadastrado!')
      
      onSuccess() // Chama a função para atualizar a tabela na página pai
      onClose()   // Fecha o modal

    } catch (error: any) {
      console.error(error)
      alert(error.message || 'Erro inesperado.')
    } finally {
      setLoading(false)
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
      <div className="mt-4">
        <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
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
      </div>

      <div className="mt-4">
        <Input
            id="senha"
            label="Senha"
            type="password"
            value={formData.senha}
            onChange={handleChange}
            placeholder={modoEdicao ? '(Deixe em branco para não alterar)' : 'Crie uma senha forte'}
            required={!modoEdicao} // Senha é obrigatória apenas ao criar
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
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
      </div>

      <div className="mt-6 flex justify-end gap-3">
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
        >
          {loading ? 'Salvando...' : (modoEdicao ? 'Salvar Alterações' : 'Salvar')}
        </Button>
      </div>
    </form>
  )
}