'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  mockAgendamentos, IAgendamento, mockFuncionarios, mockVacinas, mockAplicacoes, IAplicacao
} from '@/lib/mock-data'
import { Button } from '@/components/ui/Button'
import { Calendario } from '@/components/features/agenda/Calendario'
import { Modal } from '@/components/ui/Modal'
import { AgendamentoForm } from '@/components/features/agenda/AgendamentoForm'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, History, Filter as FilterIcon, Search } from 'lucide-react'
import { HistoricoAplicacoesTable } from '@/components/features/vacinas/HistoricoAplicacoesTable'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { View, Views, Event as BigCalendarEvent } from 'react-big-calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'


export default function AgendaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<IAgendamento | null>(null)
  const [dataSelecionadaSlot, setDataSelecionadaSlot] = useState<{ start: Date, end: Date } | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [agendamentos, setAgendamentos] = useState<IAgendamento[]>([])
  const [aplicacoes, setAplicacoes] = useState<IAplicacao[]>([])

  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())

  const [filtroHistorico, setFiltroHistorico] = useState('')
  const [currentPageHistorico, setCurrentPageHistorico] = useState(1);
  const [itemsPerPage] = useState(5);

  const funcionarios = mockFuncionarios
  const vacinas = mockVacinas

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgendamentos(mockAgendamentos.sort((a, b) => a.start.getTime() - b.start.getTime()));
      setAplicacoes(mockAplicacoes.sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime()));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [])

  const aplicacoesFiltradas = useMemo(() => {
    if (!filtroHistorico) return aplicacoes;
    const lowerFilter = filtroHistorico.toLowerCase();
    return aplicacoes.filter(app =>
      app.funcionarioNome.toLowerCase().includes(lowerFilter) ||
      app.tipoVacina.toLowerCase().includes(lowerFilter) ||
      (app.responsavel && app.responsavel.toLowerCase().includes(lowerFilter)) ||
      (app.lote && app.lote.toLowerCase().includes(lowerFilter))
    );
  }, [aplicacoes, filtroHistorico]);

  const aplicacoesPaginadas = useMemo(() => {
    const firstItemIndex = (currentPageHistorico - 1) * itemsPerPage;
    const lastItemIndex = firstItemIndex + itemsPerPage;
    return aplicacoesFiltradas.slice(firstItemIndex, lastItemIndex);
  }, [aplicacoesFiltradas, currentPageHistorico, itemsPerPage]);
  const totalPagesHistorico = Math.ceil(aplicacoesFiltradas.length / itemsPerPage);

  const handleFiltroHistoricoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltroHistorico(e.target.value);
    setCurrentPageHistorico(1);
  }

  const handleSelectEvent = (agendamento: IAgendamento) => { setDataSelecionadaSlot(null); setAgendamentoSelecionado(agendamento); setIsModalOpen(true); }
  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => { setAgendamentoSelecionado(null); setDataSelecionadaSlot(slotInfo); setIsModalOpen(true); }
  const handleOpenAddModal = () => { setAgendamentoSelecionado(null); setDataSelecionadaSlot(null); setIsModalOpen(true); }
  const handleCloseModal = () => { setIsModalOpen(false); setTimeout(() => { setAgendamentoSelecionado(null); setDataSelecionadaSlot(null); }, 300); }

  const handleAgendamentoSalvo = (agendamentoAtualizadoOuNovo: IAgendamento, isEdit: boolean) => {
      if (isEdit) {
          setAgendamentos(prev => prev.map(a => a.id === agendamentoAtualizadoOuNovo.id ? agendamentoAtualizadoOuNovo : a));
          setAplicacoes(prev => prev.map(app => app.id === agendamentoAtualizadoOuNovo.id
              ? { ...app, tipoVacina: vacinas.find(v => v.id === agendamentoAtualizadoOuNovo.vacinaId)?.nome || app.tipoVacina, dataAplicacao: agendamentoAtualizadoOuNovo.start, funcionarioNome: funcionarios.find(f => f.id === agendamentoAtualizadoOuNovo.funcionarioId)?.nome || app.funcionarioNome, }
              : app
            ).sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime()));
      } else {
          setAgendamentos(prev => [...prev, agendamentoAtualizadoOuNovo].sort((a, b) => a.start.getTime() - b.start.getTime()));
          const funcNome = funcionarios.find(f => f.id === agendamentoAtualizadoOuNovo.funcionarioId)?.nome || '?';
          const vacNome = vacinas.find(v => v.id === agendamentoAtualizadoOuNovo.vacinaId)?.nome || '?';
          const novaAplicacao : IAplicacao = { id: agendamentoAtualizadoOuNovo.id, dataAplicacao: agendamentoAtualizadoOuNovo.start, funcionarioNome: funcNome, lote: 'LOTE-MOCK', responsavel: 'Sistema', tipoVacina: vacNome };
          setAplicacoes(prev => [novaAplicacao, ...prev].sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime()));
      }
      handleCloseModal();
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (isLoading) { return ( <div className="flex h-full min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div> ) }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

      {/* Cabeçalho */}
      <motion.div variants={itemVariants} className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-text-base"> Agenda de Vacinação </h1>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2"> <CalendarPlus size={18} /> Novo Agendamento </Button>
      </motion.div>

      {/* Calendário Interativo */}
      <motion.div variants={itemVariants}>
        <Calendario eventos={agendamentos} onSelectEvento={handleSelectEvent} onSelectSlot={handleSelectSlot} view={currentView} onView={setCurrentView} date={currentDate} onNavigate={setCurrentDate} />
      </motion.div>

      {/* Secção Histórico */}
      <motion.div variants={itemVariants} className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 border-border">
           <h2 className="text-xl font-semibold text-text-base flex items-center gap-2"> <History size={20}/> Histórico Recente </h2>
           <div className='relative flex-grow md:max-w-xs'>
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <Search size={16} className='text-text-muted'/> </div>
             <input type="text" placeholder="Filtrar histórico..." value={filtroHistorico} onChange={handleFiltroHistoricoChange} className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder-text-muted" />
           </div>
         </div>
         {aplicacoesFiltradas.length > 0 ? (
           <>
             <HistoricoAplicacoesTable aplicacoes={aplicacoesPaginadas} />
             <PaginationControls currentPage={currentPageHistorico} totalPages={totalPagesHistorico} onPageChange={setCurrentPageHistorico} itemsPerPage={itemsPerPage} totalItems={aplicacoesFiltradas.length} />
           </>
         ) : (
           <div className="text-center py-10 text-text-muted flex flex-col items-center">
             <FilterIcon size={32} className="mb-2 opacity-50"/>
             <span>Nenhum registro encontrado{filtroHistorico ? ` para "${filtroHistorico}"` : ''}.</span>
           </div>
         )}
      </motion.div>

      {/* --- Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={agendamentoSelecionado ? 'Editar Agendamento' : 'Novo Agendamento'}>
            <AgendamentoForm onClose={handleCloseModal} agendamentoParaEditar={agendamentoSelecionado} slotSelecionado={dataSelecionadaSlot} funcionarios={funcionarios} vacinas={vacinas} onSaveSuccess={handleAgendamentoSalvo} />
          </Modal>
        )}
      </AnimatePresence>
    </motion.div>
  )
}