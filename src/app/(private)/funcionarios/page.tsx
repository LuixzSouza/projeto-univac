'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react' // <--- Importe de Sessão
import { FuncionarioTable, IFuncionario } from '@/components/features/funcionarios/FuncionarioTable'
import { FuncionarioForm } from '@/components/features/funcionarios/FuncionarioForm'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Users, Search, Filter as FilterIcon } from 'lucide-react'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { toast } from 'sonner'
import { logAction } from '@/lib/logger' // <--- Importe do Logger

export default function FuncionariosPage() {
  const { data: session } = useSession() // <--- Pegamos quem está logado
  const [filtroFuncionarios, setFiltroFuncionarios] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<IFuncionario | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<IFuncionario | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])

  // --- CARREGA DO BANCO DE DADOS ---
  const carregarFuncionarios = useCallback(async () => {
    try {
      if (funcionarios.length === 0) setIsLoading(true)
      
      const res = await fetch('/api/funcionarios', { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao buscar')
      
      const dados = await res.json()
      setFuncionarios(dados)
    } catch (e) {
      console.error("Erro ao carregar funcionários:", e)
      toast.error("Erro ao carregar lista.")
    } finally {
      setIsLoading(false)
    }
  }, [funcionarios.length])

  useEffect(() => {
    carregarFuncionarios()
  }, [carregarFuncionarios])

  // --- FILTROS E PAGINAÇÃO ---
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

  // --- MODAIS ---
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

  // --- AÇÕES DE API ---
  const handleSuccessSave = async () => {
    await carregarFuncionarios()
  }

  const handleConfirmDelete = async () => {
    if (!funcionarioParaExcluir) return

    try {
      // Mostra loading
      const toastId = toast.loading("Excluindo funcionário...")

      const res = await fetch(`/api/funcionarios/${funcionarioParaExcluir.id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
         const erro = await res.json()
         toast.dismiss(toastId)
         toast.error(erro.error || "Erro ao excluir")
         return
      }

      // ✅ AUDITORIA: Registra quem apagou quem
      await logAction(
        "EXCLUSAO", 
        "Funcionário", 
        `Excluiu o funcionário: ${funcionarioParaExcluir.nome} (Reg: ${funcionarioParaExcluir.numeroRegistro})`, 
        session?.user?.email || "Admin"
      );

      // Sucesso
      toast.dismiss(toastId)
      toast.success(`Funcionário "${funcionarioParaExcluir.nome}" excluído!`)
      
      await carregarFuncionarios() 
    } catch (erro) {
      console.error("Erro ao excluir:", erro)
      toast.error("Erro de conexão ao tentar excluir.")
    }

    handleCloseDeleteModal()
  }

  if (isLoading && funcionarios.length === 0) return (
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

      <motion.div className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md border border-border">
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
              className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
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
              onClose={handleCloseFormModal}
              onSuccess={handleSuccessSave}
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