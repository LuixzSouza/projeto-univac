'use client'

import { useState, useEffect, useMemo } from 'react'
import { mockVacinas, IVacina, mockFuncionarios, IFuncionario, mockAplicacoes, IAplicacao } from '@/lib/mock-data'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { AnimatePresence, motion } from 'framer-motion'
import { Syringe, Plus, CheckSquare, History, Filter as FilterIcon, List, Info, Search } from 'lucide-react'

import { VacinaTable } from '@/components/features/vacinas/VacinaTable'
import { VacinaForm } from '@/components/features/vacinas/VacinaForm'
import { HistoricoAplicacoesTable } from '@/components/features/vacinas/HistoricoAplicacoesTable'
import { RegistroAplicacaoForm } from '@/components/features/vacinas/RegistroAplicacaoForm'
import { PaginationControls } from '@/components/ui/PaginationControls' 

type Tab = 'tipos' | 'historico'; 

export default function VacinasPage() {
  const [activeTab, setActiveTab] = useState<Tab>('tipos')
  const [filtroTipos, setFiltroTipos] = useState('')
  const [filtroHistorico, setFiltroHistorico] = useState('')

  const [currentPageTipos, setCurrentPageTipos] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [currentPageHistorico, setCurrentPageHistorico] = useState(1);

  const [isTipoFormModalOpen, setIsTipoFormModalOpen] = useState(false)
  const [tipoVacinaEmEdicao, setTipoVacinaEmEdicao] = useState<IVacina | null>(null)
  const [isTipoDeleteModalOpen, setIsTipoDeleteModalOpen] = useState(false)
  const [tipoVacinaParaExcluir, setTipoVacinaParaExcluir] = useState<IVacina | null>(null)
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [tiposVacinas, setTiposVacinas] = useState<IVacina[]>([])
  const [aplicacoes, setAplicacoes] = useState<IAplicacao[]>([])

  const funcionarios = mockFuncionarios

  useEffect(() => {
    const timer = setTimeout(() => {
      setTiposVacinas(mockVacinas);
      setAplicacoes(mockAplicacoes);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [])

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
      app.tipoVacina.toLowerCase().includes(lowerFilter) ||
      app.responsavel.toLowerCase().includes(lowerFilter) ||
      app.lote.toLowerCase().includes(lowerFilter)
    );
  }, [aplicacoes, filtroHistorico]);

  const tiposPaginados = useMemo(() => {
    const firstItemIndex = (currentPageTipos - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return tiposVacinasFiltrados.slice(firstItemIndex, lastItemIndex);
  }, [tiposVacinasFiltrados, currentPageTipos, itemsPerPage]);
  const totalPagesTipos = Math.ceil(tiposVacinasFiltrados.length / itemsPerPage);

  const aplicacoesPaginadas = useMemo(() => {
    const firstItemIndex = (currentPageHistorico - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return aplicacoesFiltradas.slice(firstItemIndex, lastItemIndex);
  }, [aplicacoesFiltradas, currentPageHistorico, itemsPerPage]);
  const totalPagesHistorico = Math.ceil(aplicacoesFiltradas.length / itemsPerPage);

  const handleFiltroTiposChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroTipos(e.target.value);
    setCurrentPageTipos(1); 
  }
  const handleFiltroHistoricoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroHistorico(e.target.value);
    setCurrentPageHistorico(1); 
  }

  const handleOpenAddTipoModal = () => { setTipoVacinaEmEdicao(null); setIsTipoFormModalOpen(true); };
  const handleOpenEditTipoModal = (vacina: IVacina) => { setTipoVacinaEmEdicao(vacina); setIsTipoFormModalOpen(true); };
  const handleCloseTipoFormModal = () => { setIsTipoFormModalOpen(false); setTimeout(() => setTipoVacinaEmEdicao(null), 300); };
  const handleOpenDeleteTipoModal = (vacina: IVacina) => { setTipoVacinaParaExcluir(vacina); setIsTipoDeleteModalOpen(true); };
  const handleCloseDeleteTipoModal = () => { setIsTipoDeleteModalOpen(false); setTimeout(() => setTipoVacinaParaExcluir(null), 300); };
  const handleConfirmDeleteTipo = () => {
    if (!tipoVacinaParaExcluir) return;
    const novosTipos = tiposVacinas.filter(v => v.id !== tipoVacinaParaExcluir.id);
    setTiposVacinas(novosTipos);

    const novoTotalPaginas = Math.ceil((novosTipos.length - (filtroTipos ? 0 : 1)) / itemsPerPage) 
    if (currentPageTipos > novoTotalPaginas && novoTotalPaginas > 0) {
        setCurrentPageTipos(novoTotalPaginas);
    } else if (tiposPaginados.length === 1 && currentPageTipos > 1) { 
        setCurrentPageTipos(currentPageTipos - 1);
    }

    alert(`Tipo de Vacina "${tipoVacinaParaExcluir.nome}" excluído!`);
    handleCloseDeleteTipoModal();
  };

    const handleRegisterApplication = async (data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const novaAplicacao: IAplicacao = {
          id: Date.now(),
          tipoVacina: tiposVacinas.find(v => v.id === Number(data.vacinaId))?.nome || 'Desconhecida',
          dataAplicacao: new Date(data.dataAplicacao + 'T12:00:00'),
          responsavel: data.responsavel,
          lote: data.lote || 'N/A',
          funcionarioNome: funcionarios.find(f => f.id === Number(data.funcionarioId))?.nome || 'Desconhecido',
      };
      setAplicacoes(prev => [novaAplicacao, ...prev]);
      console.log("Aplicação registrada:", novaAplicacao);
      setIsRegistroModalOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      </div>
    )
  }

  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } };
  const tabContentVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
      exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-text-base">Centro de Vacinação</h1>
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
          <Button onClick={() => setIsRegistroModalOpen(true)} variant="secondary" className="flex items-center justify-center gap-2 md:justify-start">
            <CheckSquare size={18} /> Registrar Aplicação
          </Button>
          <Button onClick={handleOpenAddTipoModal} className="flex items-center justify-center gap-2 md:justify-start">
            <Plus size={18} /> Adicionar Tipo de Vacina
          </Button>
        </div>
      </div>

      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('tipos')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${ activeTab === 'tipos' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base hover:border-border' }`} >
            <Syringe size={16} /> Tipos de Vacina
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === 'tipos' ? 'bg-primary/10 text-primary' : 'bg-border text-text-muted'}`}> {tiposVacinas.length} </span>
          </button>
          <button onClick={() => setActiveTab('historico')} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors cursor-pointer ${ activeTab === 'historico' ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-base hover:border-border' }`} >
            <History size={16} /> Histórico de Aplicações
            <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${activeTab === 'historico' ? 'bg-primary/10 text-primary' : 'bg-border text-text-muted'}`}> {aplicacoes.length} </span>
          </button>
        </nav>
      </div>

      {/* Conteúdo das Abas */}
      <div className="rounded-lg bg-bg-surface p-6 shadow-md min-h-[450px]">
        <AnimatePresence mode="wait">
          {/* Aba "Tipos de Vacina" */}
          {activeTab === 'tipos' && (
            <motion.div key="tipos" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className='relative flex-grow md:max-w-xs'>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <Search size={16} className='text-text-muted'/> </div>
                    <input type="text" placeholder="Filtrar tipos..." value={filtroTipos} onChange={handleFiltroTiposChange} className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted"/>
                  </div>
                  <p className="flex-shrink-0 text-sm text-text-muted">
                    {tiposVacinasFiltrados.length} {tiposVacinasFiltrados.length === 1 ? 'tipo encontrado' : 'tipos encontrados'}
                  </p>
              </div>
              {tiposVacinasFiltrados.length > 0 ? (
                <>
                  <VacinaTable data={tiposPaginados} onEdit={handleOpenEditTipoModal} onDelete={handleOpenDeleteTipoModal} />
                  <PaginationControls
                    currentPage={currentPageTipos}
                    totalPages={totalPagesTipos}
                    onPageChange={setCurrentPageTipos}
                    itemsPerPage={itemsPerPage}
                    totalItems={tiposVacinasFiltrados.length}
                  />
                </>
              ) : (
                <div className="text-center py-10 text-text-muted flex flex-col items-center">
                  <FilterIcon size={32} className="mb-2 opacity-50"/>
                  <span>Nenhum tipo de vacina encontrado{filtroTipos ? ` para "${filtroTipos}"` : ''}.</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Aba "Histórico de Aplicações" */}
          {activeTab === 'historico' && (
            <motion.div key="historico" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className='relative flex-grow md:max-w-xs'>
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <Search size={16} className='text-text-muted'/> </div>
                    <input type="text" placeholder="Filtrar histórico..." value={filtroHistorico} onChange={handleFiltroHistoricoChange} className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder:text-text-muted"/>
                  </div>
                  <p className="flex-shrink-0 text-sm text-text-muted">
                    {aplicacoesFiltradas.length} {aplicacoesFiltradas.length === 1 ? 'aplicação encontrada' : 'aplicações encontradas'}
                  </p>
                </div>
                {aplicacoesFiltradas.length > 0 ? (
                  <>
                    <HistoricoAplicacoesTable aplicacoes={aplicacoesPaginadas} />
                    <PaginationControls
                      currentPage={currentPageHistorico}
                      totalPages={totalPagesHistorico}
                      onPageChange={setCurrentPageHistorico}
                      itemsPerPage={itemsPerPage}
                      totalItems={aplicacoesFiltradas.length}
                    />
                  </>
                ) : (
                  <div className="text-center py-10 text-text-muted flex flex-col items-center">
                    <FilterIcon size={32} className="mb-2 opacity-50"/>
                    <span>Nenhum registro encontrado{filtroHistorico ? ` para "${filtroHistorico}"` : ''}.</span>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Modais --- */}
      <AnimatePresence>{isTipoFormModalOpen && <Modal isOpen={isTipoFormModalOpen} onClose={handleCloseTipoFormModal} title={tipoVacinaEmEdicao ? 'Editar Tipo de Vacina' : 'Novo Tipo'}> <VacinaForm onClose={handleCloseTipoFormModal} vacinaParaEditar={tipoVacinaEmEdicao}/> </Modal>}</AnimatePresence>
      <AnimatePresence>{isTipoDeleteModalOpen && <ConfirmationModal isOpen={isTipoDeleteModalOpen} onClose={handleCloseDeleteTipoModal} onConfirm={handleConfirmDeleteTipo} title="Excluir Tipo" message={`Tem a certeza que deseja excluir "${tipoVacinaParaExcluir?.nome}"?`}/>}</AnimatePresence>
      <AnimatePresence>{isRegistroModalOpen && <Modal isOpen={isRegistroModalOpen} onClose={() => setIsRegistroModalOpen(false)} title="Registrar Aplicação de Vacina"> <RegistroAplicacaoForm funcionarios={funcionarios} vacinas={tiposVacinas} onRegister={handleRegisterApplication}/> </Modal>}</AnimatePresence>

    </motion.div>
  )
}
