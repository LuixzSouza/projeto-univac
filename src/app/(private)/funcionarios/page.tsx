'use client'

import { useState, useEffect, useMemo } from 'react'
import { IFuncionario } from '@/lib/mock-data'
import { FuncionarioTable } from '@/components/features/funcionarios/FuncionarioTable'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { FuncionarioForm } from '@/components/features/funcionarios/FuncionarioForm'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Users, Search, Filter as FilterIcon } from 'lucide-react'
import { PaginationControls } from '@/components/ui/PaginationControls'

export default function FuncionariosPage() {
  const [filtroFuncionarios, setFiltroFuncionarios] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<IFuncionario | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<IFuncionario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])

  // =====================================================
  // 🚀 CARREGA DO BANCO DE DADOS (SEM MOCK)
  // =====================================================
  async function carregarFuncionarios() {
    try {
      const res = await fetch('/api/funcionarios', { cache: 'no-store' })
      const dados = await res.json()
      setFuncionarios(dados)
      setIsLoading(false)
    } catch (e) {
      console.error("Erro ao carregar funcionários:", e)
    }
  }

  useEffect(() => {
    carregarFuncionarios()
  }, [])

  // =====================================================
  // 🚀 RECEBE NOVOS FUNCIONÁRIOS AO SALVAR SEM RELOAD
  // =====================================================
  const handleAfterSave = async () => {
    await carregarFuncionarios()
    handleCloseFormModal()
  }

  const funcionariosFiltrados = useMemo(() => {
    if (!filtroFuncionarios) return funcionarios
    const lowerFilter = filtroFuncionarios.toLowerCase()
    return funcionarios.filter(func =>
      func.nome.toLowerCase().includes(lowerFilter) ||
      func.email.toLowerCase().includes(lowerFilter) ||
      String(func.numeroRegistro).includes(lowerFilter)
    )
  }, [funcionarios, filtroFuncionarios])

  const funcionariosPaginados = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage
    return funcionariosFiltrados.slice(firstItemIndex, firstItemIndex + itemsPerPage)
  }, [funcionariosFiltrados, currentPage, itemsPerPage])

  const totalPages = Math.ceil(funcionariosFiltrados.length / itemsPerPage)

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroFuncionarios(e.target.value)
    setCurrentPage(1)
  }

  const handleOpenAddModal = () => { 
    setFuncionarioEmEdicao(null) 
    setIsFormModalOpen(true) 
  }

  const handleOpenEditModal = (funcionario: IFuncionario) => { 
    setFuncionarioEmEdicao(funcionario) 
    setIsFormModalOpen(true) 
  }

  const handleCloseFormModal = () => { 
    setIsFormModalOpen(false) 
    setTimeout(() => setFuncionarioEmEdicao(null), 300) 
  }

  const handleOpenDeleteModal = (funcionario: IFuncionario) => { 
    setFuncionarioParaExcluir(funcionario) 
    setIsDeleteModalOpen(true) 
  }

  const handleCloseDeleteModal = () => { 
    setIsDeleteModalOpen(false) 
    setTimeout(() => setFuncionarioParaExcluir(null), 300) 
  }

  // =====================================================
  // 🚀 EXCLUI DINAMICAMENTE SEM RECARREGAR
  // =====================================================
  const handleConfirmDelete = async () => {
    if (!funcionarioParaExcluir) return

    try {
      await fetch(`/api/funcionarios/${funcionarioParaExcluir.id}`, {
        method: 'DELETE'
      })

      await carregarFuncionarios()

      alert(`Funcionário "${funcionarioParaExcluir.nome}" excluído com sucesso!`)
    } catch (erro) {
      console.error("Erro ao excluir:", erro)
    }

    handleCloseDeleteModal()
  }

  if (isLoading) return (
    <div className="flex h-full min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
    </div>
  )

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-6">
      <motion.div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
          <Users size={28}/> Gestão de Funcionários
        </h1>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2">
          <Plus size={18} /> Adicionar Funcionário
        </Button>
      </motion.div>

      <motion.div className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className='relative flex-grow md:max-w-xs'>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className='text-text-muted'/>
            </div>
            <input
              type="text"
              placeholder="Filtrar por nome, email, registro..."
              value={filtroFuncionarios}
              onChange={handleFiltroChange}
              className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted"
            />
          </div>
          <p className="flex-shrink-0 text-sm text-text-muted">
            {funcionariosFiltrados.length} {funcionariosFiltrados.length === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}
          </p>
        </div>

        {funcionarios.length > 0 ? (
          funcionariosFiltrados.length > 0 ? (
            <>
              <FuncionarioTable
                data={funcionariosPaginados}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
              />
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={funcionariosFiltrados.length}
              />
            </>
          ) : (
            <div className="text-center py-10 text-text-muted flex flex-col items-center">
              <FilterIcon size={32} className="mb-2 opacity-50"/>
              <span>Nenhum funcionário encontrado para "{filtroFuncionarios}".</span>
            </div>
          )
        ) : (
          <div className="text-center py-10 text-text-muted">
            Nenhum funcionário cadastrado ainda.
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isFormModalOpen && (
          <Modal
            isOpen={isFormModalOpen}
            onClose={handleCloseFormModal}
            title={funcionarioEmEdicao ? 'Editar Funcionário' : 'Novo Funcionário'}
          >
            <FuncionarioForm 
              onClose={handleAfterSave}
              funcionarioParaEditar={funcionarioEmEdicao}
            />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
            onConfirm={handleConfirmDelete}
            title="Excluir Funcionário"
            message={`Tem a certeza que deseja excluir "${funcionarioParaExcluir?.nome}"?`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
