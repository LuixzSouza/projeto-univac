'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link' // Import necessário para o Card de Detalhes
import { useSession } from 'next-auth/react' // Para RBAC
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Syringe, Plus, CheckSquare, History, Filter as FilterIcon, Search, X, Package, Loader2 } from 'lucide-react'

import VacinaTable from '@/components/features/vacinas/VacinaTable'
import { VacinaForm } from '@/components/features/vacinas/VacinaForm'
import { HistoricoAplicacoesTable, IAplicacaoHist } from '@/components/features/vacinas/HistoricoAplicacoesTable'
import { RegistroAplicacaoForm } from '@/components/features/vacinas/RegistroAplicacaoForm'
import { PaginationControls } from '@/components/ui/PaginationControls' 

import { toast } from 'sonner'
import { logAction } from '@/lib/logger' // Auditoria

export interface IVacina {
  id: number
  nome: string
  descricao: string
  obrigatoriedade: boolean
}

interface IFuncionarioSimples {
  id: number;
  nome: string;
  status: boolean;
}

type Tab = 'tipos' | 'historico'; 

export default function VacinasPage() {
  const { data: session } = useSession()
  const userRole = (session?.user as any)?.role || 'FUNCIONARIO'
  const isAdmin = userRole === 'ADMIN'

  const [activeTab, setActiveTab] = useState<Tab>('tipos')
  
  const [filtroTipos, setFiltroTipos] = useState('')
  const [isSearching, setIsSearching] = useState(false) // Loading da busca
  const [filtroHistorico, setFiltroHistorico] = useState('')

  const [currentPageTipos, setCurrentPageTipos] = useState(1);
  const [itemsPerPage] = useState(10); 
  const [currentPageHistorico, setCurrentPageHistorico] = useState(1);

  // Estados Modais
  const [isTipoFormModalOpen, setIsTipoFormModalOpen] = useState(false)
  const [tipoVacinaEmEdicao, setTipoVacinaEmEdicao] = useState<IVacina | null>(null)
  const [isTipoDeleteModalOpen, setIsTipoDeleteModalOpen] = useState(false)
  const [tipoVacinaParaExcluir, setTipoVacinaParaExcluir] = useState<IVacina | null>(null)
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  
  // Dados
  const [tiposVacinas, setTiposVacinas] = useState<IVacina[]>([])
  const [funcionarios, setFuncionarios] = useState<IFuncionarioSimples[]>([])
  const [aplicacoes, setAplicacoes] = useState<IAplicacaoHist[]>([]) 

  // --- BUSCAR DADOS ---
  const fetchData = useCallback(async () => {
    try {
      if (tiposVacinas.length === 0) setIsLoading(true)
      
      const [resVacinas, resFunc, resApps] = await Promise.all([
        fetch('/api/vacinas'),
        fetch('/api/funcionarios'),
        fetch('/api/dashboard')
      ])

      if (resVacinas.ok) setTiposVacinas(await resVacinas.json())
      if (resFunc.ok) setFuncionarios(await resFunc.json())
      
      if (resApps.ok) {
           const dashData = await resApps.json()
           const appsFormatadas = dashData.aplicacoes.map((app: any) => ({
              id: app.id,
              funcionarioNome: app.funcionario.nome,
              tipoVacina: app.vacina.nome,
              dataAplicacao: app.dataAplicacao,
              lote: app.lote,
              responsavel: 'Sistema'
           }))
           setAplicacoes(appsFormatadas)
       }

    } catch (error) {
      console.error("Erro de conexão", error)
      toast.error("Erro ao carregar dados.")
    } finally {
      setIsLoading(false)
    }
  }, [tiposVacinas.length])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // --- FILTROS E BUSCA ---
  const handleFiltroTiposChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFiltroTipos(val);
      setCurrentPageTipos(1);
      
      if(val) {
          setIsSearching(true);
          setTimeout(() => setIsSearching(false), 500);
      }
  }

  const tiposVacinasFiltrados = useMemo(() => {
    if (!filtroTipos) return tiposVacinas;
    const lowerFilter = filtroTipos.toLowerCase();
    return tiposVacinas.filter(vacina =>
      vacina.nome.toLowerCase().includes(lowerFilter) ||
      vacina.descricao.toLowerCase().includes(lowerFilter)
    );
  }, [tiposVacinas, filtroTipos]);

  const aplicacoesFiltradas = useMemo(() => {
    if (!filtroHistorico) return aplicacoes;
    const lowerFilter = filtroHistorico.toLowerCase();
    return aplicacoes.filter(app =>
      app.funcionarioNome.toLowerCase().includes(lowerFilter) ||
      app.tipoVacina.toLowerCase().includes(lowerFilter)
    );
  }, [aplicacoes, filtroHistorico]);

  // --- PAGINAÇÃO ---
  const tiposPaginados = useMemo(() => {
    const firstItemIndex = (currentPageTipos - 1) * itemsPerPage;
    return tiposVacinasFiltrados.slice(firstItemIndex, firstItemIndex + itemsPerPage);
  }, [tiposVacinasFiltrados, currentPageTipos, itemsPerPage]);
  
  const aplicacoesPaginadas = useMemo(() => {
    const firstItemIndex = (currentPageHistorico - 1) * itemsPerPage;
    return aplicacoesFiltradas.slice(firstItemIndex, firstItemIndex + itemsPerPage);
  }, [aplicacoesFiltradas, currentPageHistorico, itemsPerPage]);

  // --- HANDLERS ---
  const handleOpenAddTipoModal = () => { 
      if (!isAdmin) return toast.error("Ação restrita a Administradores.");
      setTipoVacinaEmEdicao(null); setIsTipoFormModalOpen(true); 
  };
  
  const handleOpenEditTipoModal = (vacina: IVacina) => { 
      if (!isAdmin) return toast.error("Ação restrita a Administradores.");
      setTipoVacinaEmEdicao(vacina); setIsTipoFormModalOpen(true); 
  };
  
  const handleOpenDeleteTipoModal = (vacina: IVacina) => { 
      if (!isAdmin) return toast.error("Ação restrita a Administradores.");
      setTipoVacinaParaExcluir(vacina); setIsTipoDeleteModalOpen(true); 
  };

  const handleCloseTipoFormModal = () => { setIsTipoFormModalOpen(false); setTimeout(() => setTipoVacinaEmEdicao(null), 300); };
  const handleCloseDeleteTipoModal = () => { setIsTipoDeleteModalOpen(false); setTimeout(() => setTipoVacinaParaExcluir(null), 300); };
  
  const handleSuccessForm = async () => { await fetchData(); }

  const handleConfirmDeleteTipo = async () => {
    if (!tipoVacinaParaExcluir || !tipoVacinaParaExcluir.id) return;

    try {
      const toastId = toast.loading("Excluindo vacina...")
      const res = await fetch(`/api/vacinas/${tipoVacinaParaExcluir.id}`, { method: 'DELETE' })
      
      if (!res.ok) {
          toast.dismiss(toastId);
          toast.error("Não é possível excluir esta vacina pois ela possui histórico de uso.");
          return;
      }

      // ✅ Auditoria
      await logAction(
          "EXCLUSAO", 
          "Catálogo Vacina", 
          `Excluiu o tipo de vacina: ${tipoVacinaParaExcluir.nome}`, 
          session?.user?.email || "Admin"
      );

      toast.dismiss(toastId)
      toast.success(`Vacina "${tipoVacinaParaExcluir.nome}" excluída!`)
      await fetchData();
      handleCloseDeleteTipoModal();
    } catch (error) {
      toast.error("Erro de conexão.")
    }
  };

  const handleRegisterSuccess = async () => {
      await fetchData(); 
      setIsRegistroModalOpen(false);
  }

  if (isLoading && tiposVacinas.length === 0) {
    return <div className="flex h-full min-h-[50vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>
  }

  const tabContentVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-20">

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-text-base">Centro de Vacinação</h1>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Button onClick={() => setIsRegistroModalOpen(true)} variant="secondary" className="flex items-center justify-center gap-2 md:justify-start">
            <CheckSquare size={18} /> Registrar Aplicação
          </Button>
          
          {/* Botão apenas para Admin */}
          {isAdmin && (
              <Button onClick={handleOpenAddTipoModal} className="flex items-center justify-center gap-2 md:justify-start">
                <Plus size={18} /> Adicionar Tipo de Vacina
              </Button>
          )}
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('tipos')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${ activeTab === 'tipos' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base hover:border-border' }`} >
            <Syringe size={16} /> <span className="hidden sm:inline">Catálogo</span>
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === 'tipos' ? 'bg-primary/10 text-primary' : 'bg-border text-text-muted'}`}> {tiposVacinas.length} </span>
          </button>

          <button onClick={() => setActiveTab('historico')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${ activeTab === 'historico' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base hover:border-border' }`} >
            <History size={16} /> <span className="hidden sm:inline">Histórico</span>
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === 'historico' ? 'bg-primary/10 text-primary' : 'bg-border text-text-muted'}`}> {aplicacoes.length} </span>
          </button>
        </nav>
      </div>

      <div className="rounded-lg bg-bg-surface p-6 shadow-md border border-border min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* --- CONTEÚDO ABA: TIPOS --- */}
          {activeTab === 'tipos' && (
            <motion.div key="tipos" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className='relative flex-grow md:max-w-xs'>
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> 
                     {isSearching ? <Loader2 size={16} className="text-primary animate-spin"/> : <Search size={16} className='text-text-muted'/>}
                  </div>
                  <input 
                    type="text" placeholder="Filtrar tipos..." value={filtroTipos} onChange={handleFiltroTiposChange} 
                    className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="flex items-center gap-4">
                  {filtroTipos && (
                    <Button variant="ghost" onClick={() => setFiltroTipos('')} className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-transparent shadow-none bg-transparent">
                      <X size={14} className="mr-1" /> Limpar
                    </Button>
                  )}
                  <p className="flex-shrink-0 text-sm text-text-muted">{tiposVacinasFiltrados.length} tipos</p>
                </div>
              </div>

              {filtroTipos && tiposVacinasFiltrados.length === 1 && <VacinaDetailCard vacina={tiposVacinasFiltrados[0]} />}

              {tiposVacinasFiltrados.length > 0 ? (
                <>
                  <VacinaTable 
                    data={tiposPaginados} 
                    onEdit={handleOpenEditTipoModal} 
                    onDelete={handleOpenDeleteTipoModal} 
                    userRole={userRole} // ✨ Passando o role
                  />
                  <PaginationControls currentPage={currentPageTipos} totalPages={Math.ceil(tiposVacinasFiltrados.length / itemsPerPage)} onPageChange={setCurrentPageTipos} itemsPerPage={itemsPerPage} totalItems={tiposVacinasFiltrados.length} />
                </>
              ) : (
                <div className="text-center py-10 text-text-muted flex flex-col items-center"><FilterIcon size={32} className="mb-2 opacity-50"/><span>Nenhum tipo encontrado.</span></div>
              )}
            </motion.div>
          )}

          {/* --- CONTEÚDO ABA: HISTÓRICO --- */}
          {activeTab === 'historico' && (
            <motion.div key="historico" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className='relative flex-grow md:max-w-xs'>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <Search size={16} className='text-text-muted'/> </div>
                    <input type="text" placeholder="Filtrar histórico..." value={filtroHistorico} onChange={(e) => setFiltroHistorico(e.target.value)} className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                {aplicacoesFiltradas.length > 0 ? (
                  <>
                    <HistoricoAplicacoesTable aplicacoes={aplicacoesPaginadas} />
                    <PaginationControls currentPage={currentPageHistorico} totalPages={Math.ceil(aplicacoesFiltradas.length / itemsPerPage)} onPageChange={setCurrentPageHistorico} itemsPerPage={itemsPerPage} totalItems={aplicacoesFiltradas.length} />
                  </>
                ) : (
                  <div className="text-center py-10 text-text-muted flex flex-col items-center"><FilterIcon size={32} className="mb-2 opacity-50"/><span>Nenhum registro encontrado.</span></div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isTipoFormModalOpen && ( <Modal isOpen={isTipoFormModalOpen} onClose={handleCloseTipoFormModal} title={tipoVacinaEmEdicao ? 'Editar Vacina' : 'Nova Vacina'}> <VacinaForm onClose={handleCloseTipoFormModal} vacinaParaEditar={tipoVacinaEmEdicao} onSuccess={handleSuccessForm} /> </Modal> )}
        {isTipoDeleteModalOpen && ( <ConfirmationModal isOpen={isTipoDeleteModalOpen} onClose={handleCloseDeleteTipoModal} onConfirm={handleConfirmDeleteTipo} title="Excluir Tipo" message={`Deseja excluir "${tipoVacinaParaExcluir?.nome}"?`} /> )}
        {isRegistroModalOpen && ( <Modal isOpen={isRegistroModalOpen} onClose={() => setIsRegistroModalOpen(false)} title="Registrar Aplicação"> <RegistroAplicacaoForm funcionarios={funcionarios} vacinas={tiposVacinas} onRegister={handleRegisterSuccess} /> </Modal> )}
      </AnimatePresence>

    </motion.div>
  )
}

// Sub-componente Card Detalhes
function VacinaDetailCard({ vacina }: { vacina: IVacina }) {
    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 rounded-lg border border-primary/30 bg-primary/5 p-4 shadow-sm flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0"><Syringe size={20} /></div>
                <div>
                    <h3 className="text-lg font-bold text-text-base flex items-center gap-2">
                        {vacina.nome}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${vacina.obrigatoriedade ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{vacina.obrigatoriedade ? 'Obrigatória' : 'Opcional'}</span>
                    </h3>
                    <p className="text-sm text-text-muted">{vacina.descricao}</p>
                </div>
            </div>
            <Link href="/estoque">
                <Button variant="secondary" size="sm" className="flex items-center gap-2"><Package size={16}/> Ver Estoque</Button>
            </Link>
        </motion.div>
    );
}