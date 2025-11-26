'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react' // Para Sessão e RBAC
import { FuncionarioTable, IFuncionario } from '@/components/features/funcionarios/FuncionarioTable' // Assume a interface IFuncionario vem daqui
import { FuncionarioForm } from '@/components/features/funcionarios/FuncionarioForm'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Users, Search, Filter as FilterIcon, Info } from 'lucide-react'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { toast } from 'sonner'
import { logAction } from '@/lib/logger' // Para Logs de Segurança

export default function FuncionariosPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || 'FUNCIONARIO' 
  const isAdmin = userRole === 'ADMIN' // Flag para controle de visibilidade
  const currentUserId = (session?.user as any)?.id; // ID do usuário logado (String)
  
  const [filtroFuncionarios, setFiltroFuncionarios] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<IFuncionario | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<IFuncionario | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])

  // --- CARREGA DADOS DO BANCO ---
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

  // --- FILTROS (Lógica RBAC e Texto) ---
  const funcionariosFiltrados = useMemo(() => {
    let list = funcionarios;
    
    // 1. RBAC FILTER: Se não é Admin, restringe a lista ao próprio usuário
    if (!isAdmin && currentUserId) {
        list = list.filter(f => String(f.id) === currentUserId);
    }
    
    // 2. TEXT FILTER: Aplica a busca de texto
    if (!filtroFuncionarios) return list;
    const lowerFilter = filtroFuncionarios.toLowerCase()
    
    return list.filter(func =>
      func.nome.toLowerCase().includes(lowerFilter) ||
      func.email.toLowerCase().includes(lowerFilter) ||
      String(func.numeroRegistro).includes(lowerFilter)
    )
  }, [funcionarios, filtroFuncionarios, isAdmin, currentUserId])

  const funcionariosPaginados = useMemo(() => {
    const firstItemIndex = (currentPage - 1) * itemsPerPage
    return funcionariosFiltrados.slice(firstItemIndex, firstItemIndex + itemsPerPage)
  }, [funcionariosFiltrados, currentPage, itemsPerPage])

  const totalPages = Math.ceil(funcionariosFiltrados.length / itemsPerPage)

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroFuncionarios(e.target.value)
    setCurrentPage(1)
  }

  // --- MODAIS E HANDLERS ---
  const handleOpenAddModal = () => { 
    if (!isAdmin) return toast.error("Ação restrita a Administradores.");
    setFuncionarioEmEdicao(null); setIsFormModalOpen(true); 
  }

  const handleOpenEditModal = (funcionario: IFuncionario) => { 
     // Permite edição se for Admin OU se for o próprio usuário
     if (!isAdmin && String(funcionario.id) !== currentUserId) {
         return toast.error("Você só pode visualizar seus próprios dados.");
     }
     setFuncionarioEmEdicao(funcionario); setIsFormModalOpen(true); 
  }

  const handleCloseFormModal = () => { 
    setIsFormModalOpen(false) 
    setTimeout(() => setFuncionarioEmEdicao(null), 300) 
  }

  const handleOpenDeleteModal = (funcionario: IFuncionario) => { 
     if (!isAdmin) return toast.error("Ação restrita a Administradores.");
     setFuncionarioParaExcluir(funcionario); setIsDeleteModalOpen(true); 
  }

  const handleCloseDeleteModal = () => { 
    setIsDeleteModalOpen(false) 
    setTimeout(() => setFuncionarioParaExcluir(null), 300) 
  }

  const handleSuccessSave = async () => {
    await carregarFuncionarios()
  }

  const handleConfirmDelete = async () => {
    if (!funcionarioParaExcluir) return

    try {
      const toastId = toast.loading("Excluindo funcionário...")
      const res = await fetch(`/api/funcionarios/${funcionarioParaExcluir.id}`, { method: 'DELETE' })

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
        {/* Botão ADICIONAR (Apenas Admin) */}
        {isAdmin && (
            <Button onClick={handleOpenAddModal} className="flex items-center gap-2">
              <Plus size={18} /> Adicionar Funcionário
            </Button>
        )}
      </motion.div>

      <motion.div className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md border border-border">
        
        {/* BARRA DE AÇÃO E FILTRO (Condicional) */}
        {isAdmin ? (
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
        ) : (
             /* MENSAGEM PARA FUNCIONÁRIO COMUM (Modo Leitura) */
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-center gap-3 border border-blue-200">
                <Info size={18} className="shrink-0"/>
                <p className="text-sm">Você está no modo de visualização. O acesso de gestão e busca é restrito a administradores.</p>
            </div>
        )}

        {/* TABELA */}
        {funcionarios.length > 0 ? (
          funcionariosFiltrados.length > 0 ? (
            <>
              <FuncionarioTable
                data={funcionariosPaginados}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                userRole={userRole} 
              />
              {/* Paginação só se houver mais de uma página (E se for Admin, ou se for o único item e não for Admin - complexo) */}
              {totalPages > 1 && isAdmin && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    totalItems={funcionariosFiltrados.length}
                  />
              )}
            </>
          ) : (
             <div className="text-center py-10 text-text-muted flex flex-col items-center">
              <FilterIcon size={32} className="mb-2 opacity-50"/>
              <span>Nenhum funcionário encontrado.</span>
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