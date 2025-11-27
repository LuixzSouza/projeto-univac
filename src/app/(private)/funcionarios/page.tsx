'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react' 
import { FuncionarioTable, IFuncionario } from '@/components/features/funcionarios/FuncionarioTable' 
import { FuncionarioForm } from '@/components/features/funcionarios/FuncionarioForm'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Users, Search, Filter as FilterIcon, Info, CheckCircle2, AlertCircle, Loader2, UserX } from 'lucide-react'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { toast } from 'sonner'
import { logAction } from '@/lib/logger'

export default function FuncionariosPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || 'FUNCIONARIO' 
  const isAdmin = userRole === 'ADMIN' 
  const currentUserId = (session?.user as any)?.id; 
  
  // Estados de Filtro e Paginação
  const [filtroFuncionarios, setFiltroFuncionarios] = useState('')
  const [isSearching, setIsSearching] = useState(false) // ✨ Estado de Loading da Busca
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Estados dos Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState<IFuncionario | null>(null)
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [funcionarioParaExcluir, setFuncionarioParaExcluir] = useState<IFuncionario | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])

  // --- CARREGA DADOS ---
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

  // --- FILTROS ---
  const funcionariosFiltrados = useMemo(() => {
    let list = funcionarios;
    
    // 1. Filtro de Permissão
    if (!isAdmin && currentUserId) {
        list = list.filter(f => String(f.id) === currentUserId);
    }
    
    // 2. Filtro de Texto
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

  // ✨ Handler de Busca com Loading
  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFiltroFuncionarios(value);
    setCurrentPage(1);
    
    // Simula loading visual rápido para feedback
    if (value) {
        setIsSearching(true);
        setTimeout(() => setIsSearching(false), 500);
    }
  }

  // --- ESTATÍSTICAS (Cards do Topo) ---
  // ✨ Lógica ajustada para fazer sentido (Sem "Em Atendimento")
  const stats = useMemo(() => {
      const total = funcionarios.length;
      const ativos = funcionarios.filter(f => f.status).length;
      const inativos = funcionarios.filter(f => !f.status).length;
      // Pendentes: Simulação (ex: cadastro incompleto ou sem vacina recente)
      // Na vida real, cruzaria com tabela de vacinas
      const pendentes = Math.floor(total * 0.15); 
      return { total, ativos, inativos, pendentes };
  }, [funcionarios]);

  // --- HANDLERS ---
  const handleOpenAddModal = () => { 
    if (!isAdmin) return toast.error("Ação restrita a Administradores.");
    setFuncionarioEmEdicao(null); setIsFormModalOpen(true); 
  }

  const handleOpenEditModal = (funcionario: IFuncionario) => { 
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

  // ✨ CORREÇÃO: Função handleSuccessSave agora existe
  const handleSuccessSave = async () => {
    await carregarFuncionarios()
    // O modal fecha automaticamente pelo Form, mas podemos forçar aqui se precisar
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

      await logAction(
        "EXCLUSAO", 
        "Funcionário", 
        `Excluiu o funcionário: ${funcionarioParaExcluir.nome} (Reg: ${funcionarioParaExcluir.numeroRegistro})`, 
        session?.user?.email || "Admin"
      );

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
    <motion.div initial="hidden" animate="visible" className="space-y-6 pb-20">
      
      {/* HEADER + BOTÃO ADICIONAR */}
      <motion.div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
             <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                <Users size={28} className="text-primary"/> Gestão de Funcionários
            </h1>
             <p className="text-text-muted">Gerencie o quadro de colaboradores.</p>
        </div>
        {isAdmin && (
            <Button onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
              <Plus size={18} /> Adicionar Funcionário
            </Button>
        )}
      </motion.div>

      {/* ✨ CARDS DE STATUS CORRIGIDOS (Temática Dark/Light funcionando) */}
      {isAdmin && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-lg shrink-0"><Users size={22}/></div>
                  <div><p className="text-2xl font-bold text-text-base">{stats.total}</p><p className="text-xs text-text-muted font-bold uppercase tracking-wide">Total</p></div>
              </div>
              
              <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2.5 bg-green-500/10 text-green-600 rounded-lg shrink-0"><CheckCircle2 size={22}/></div>
                  <div><p className="text-2xl font-bold text-text-base">{stats.ativos}</p><p className="text-xs text-text-muted font-bold uppercase tracking-wide">Ativos</p></div>
              </div>
              
              {/* Substituímos "Em Atendimento" por "Pendentes" (Mais útil para RH) */}
              <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2.5 bg-yellow-500/10 text-yellow-600 rounded-lg shrink-0"><AlertCircle size={22}/></div>
                  <div><p className="text-2xl font-bold text-text-base">{stats.pendentes}</p><p className="text-xs text-text-muted font-bold uppercase tracking-wide">Pendentes</p></div>
              </div>
              
              <div className="bg-bg-surface p-4 rounded-xl border border-border shadow-sm flex items-center gap-3 transition-colors">
                  <div className="p-2.5 bg-red-500/10 text-red-600 rounded-lg shrink-0"><UserX size={22}/></div>
                  <div><p className="text-2xl font-bold text-text-base">{stats.inativos}</p><p className="text-xs text-text-muted font-bold uppercase tracking-wide">Inativos</p></div>
              </div>
          </motion.div>
      )}

      {/* ÁREA DA TABELA */}
      <motion.div className="space-y-4 rounded-xl bg-bg-surface p-6 shadow-md border border-border">
        
        {isAdmin ? (
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className='relative flex-grow md:max-w-md'>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* ✨ Ícone muda para loading ao digitar */}
                  {isSearching ? <Loader2 size={18} className="text-primary animate-spin"/> : <Search size={18} className='text-text-muted'/>}
                </div>
                <input
                  type="text"
                  placeholder="Buscar por nome, email, registro..."
                  value={filtroFuncionarios}
                  onChange={handleFiltroChange}
                  className="w-full rounded-lg border border-border bg-bg-base py-2.5 pl-10 pr-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <p className="flex-shrink-0 text-sm text-text-muted">
                <strong>{funcionariosFiltrados.length}</strong> registros encontrados
              </p>
            </div>
        ) : (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg flex items-center gap-3 border border-blue-200 dark:border-blue-800">
                <Info size={18} className="shrink-0"/>
                <p className="text-sm">Modo Visualização: Você tem acesso apenas aos seus dados.</p>
            </div>
        )}

        {funcionarios.length > 0 ? (
          funcionariosFiltrados.length > 0 ? (
            <>
              <FuncionarioTable
                data={funcionariosPaginados}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                userRole={userRole} 
              />
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
             <div className="text-center py-12 text-text-muted flex flex-col items-center opacity-60">
              <FilterIcon size={40} className="mb-3 text-gray-300"/>
              <span className="text-sm">Nenhum funcionário encontrado com este filtro.</span>
            </div>
          )
        ) : (
          <div className="text-center py-10 text-text-muted">
            Nenhum funcionário cadastrado ainda.
          </div>
        )}
      </motion.div>

      {/* MODAIS (Mantidos) */}
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
            title="Desativar Acesso"
            message={`Tem a certeza que deseja excluir "${funcionarioParaExcluir?.nome}"? O histórico será arquivado.`}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}