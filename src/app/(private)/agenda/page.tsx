'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Calendario } from '@/components/features/agenda/Calendario'
import { Modal } from '@/components/ui/Modal'
import { AgendamentoForm } from '@/components/features/agenda/AgendamentoForm'
// Importamos o RegistroForm e a Interface para passar dados
import { RegistroAplicacaoForm, RegistroInitialData } from '@/components/features/vacinas/RegistroAplicacaoForm'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, History, Filter as FilterIcon, Search } from 'lucide-react'
import { HistoricoAplicacoesTable } from '@/components/features/vacinas/HistoricoAplicacoesTable'
import { PaginationControls } from '@/components/ui/PaginationControls'
import { View, Views } from 'react-big-calendar'

export default function AgendaPage() {
  // Estados dos Modais
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal Agendamento
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false) // Modal Registro (Check-in)
  
  // Dados selecionados
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState<any | null>(null)
  const [dataSelecionadaSlot, setDataSelecionadaSlot] = useState<{ start: Date, end: Date } | null>(null)
  const [registroInitialData, setRegistroInitialData] = useState<RegistroInitialData | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  
  // Dados Reais do Banco
  const [eventosCalendario, setEventosCalendario] = useState<any[]>([])
  const [funcionarios, setFuncionarios] = useState<any[]>([])
  const [vacinas, setVacinas] = useState<any[]>([])
  
  // Configurações do Calendário
  const [currentView, setCurrentView] = useState<View>(Views.MONTH)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Filtros da Tabela
  const [filtroHistorico, setFiltroHistorico] = useState('')
  const [currentPageHistorico, setCurrentPageHistorico] = useState(1);
  const [itemsPerPage] = useState(5);

  // --- 1. BUSCAR DADOS DA API ---
  const carregarDados = useCallback(async () => {
    try {
      const [resAgend, resFunc, resVac] = await Promise.all([
        fetch('/api/agendamentos'),
        fetch('/api/funcionarios'),
        fetch('/api/vacinas')
      ])

      const dataAgend = await resAgend.json()
      const dataFunc = await resFunc.json()
      const dataVac = await resVac.json()

      setFuncionarios(dataFunc)
      setVacinas(dataVac)

      // Transformar agendamentos do Banco para o formato do Calendário
      const eventosFormatados = dataAgend.map((ag: any) => ({
        ...ag, 
        id: ag.id,
        title: `${ag.vacina.nome} - ${ag.funcionario.nome}`,
        start: new Date(ag.dataAgendamento),
        end: new Date(new Date(ag.dataAgendamento).getTime() + 30 * 60000), // Duração fictícia de 30min
        resource: ag // Guarda o objeto original para edição
      }))

      setEventosCalendario(eventosFormatados)
    } catch (error) {
      console.error("Erro ao carregar dados", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  // --- 2. LÓGICA DA TABELA INFERIOR ---
  const listaHistorico = useMemo(() => {
    return eventosCalendario.map(ev => ({
        id: ev.id,
        tipoVacina: ev.resource.vacina.nome,
        dataAplicacao: ev.start,
        funcionarioNome: ev.resource.funcionario.nome,
        responsavel: 'Sistema',
        lote: 'N/A'
    })).sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime())
  }, [eventosCalendario])

  const historicoFiltrado = useMemo(() => {
    if (!filtroHistorico) return listaHistorico;
    const lowerFilter = filtroHistorico.toLowerCase();
    return listaHistorico.filter(app =>
      app.funcionarioNome.toLowerCase().includes(lowerFilter) ||
      app.tipoVacina.toLowerCase().includes(lowerFilter)
    );
  }, [listaHistorico, filtroHistorico]);

  const historicoPaginado = useMemo(() => {
    const firstItemIndex = (currentPageHistorico - 1) * itemsPerPage;
    return historicoFiltrado.slice(firstItemIndex, firstItemIndex + itemsPerPage);
  }, [historicoFiltrado, currentPageHistorico, itemsPerPage]);
  
  const totalPagesHistorico = Math.ceil(historicoFiltrado.length / itemsPerPage);

  // --- HANDLERS ---
  const handleSelectEvent = (evento: any) => { 
      setDataSelecionadaSlot(null); 
      setAgendamentoSelecionado(evento); 
      setIsModalOpen(true); 
  }
  
  const handleSelectSlot = (slotInfo: { start: Date, end: Date }) => { 
      setAgendamentoSelecionado(null); 
      setDataSelecionadaSlot(slotInfo); 
      setIsModalOpen(true); 
  }
  
  const handleOpenAddModal = () => { 
      setAgendamentoSelecionado(null); 
      setDataSelecionadaSlot(null); 
      setIsModalOpen(true); 
  }
  
  const handleSaveSuccess = () => {
      carregarDados(); 
      setIsModalOpen(false);
  }

  // --- HANDLER DO CHECK-IN (Fluxo Novo) ---
  const handleStartCheckIn = (agendamento: any) => {
      setIsModalOpen(false) // Fecha agenda
      
      // Prepara dados para o registro
      setRegistroInitialData({
          funcionarioId: String(agendamento.resource.funcionarioId),
          vacinaId: String(agendamento.resource.vacinaId),
          agendamentoId: agendamento.id
      })

      setIsRegistroModalOpen(true) // Abre registro
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
        <Calendario 
            eventos={eventosCalendario} 
            onSelectEvento={handleSelectEvent} 
            onSelectSlot={handleSelectSlot} 
            view={currentView} 
            onView={setCurrentView} 
            date={currentDate} 
            onNavigate={setCurrentDate} 
        />
      </motion.div>

      {/* Secção Histórico (Lista de Agendamentos) */}
      <motion.div variants={itemVariants} className="space-y-4 rounded-lg bg-bg-surface p-6 shadow-md border border-border">
         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b pb-4 border-border">
           <h2 className="text-xl font-semibold text-text-base flex items-center gap-2"> <History size={20}/> Lista de Agendamentos </h2>
           <div className='relative flex-grow md:max-w-xs'>
             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"> <Search size={16} className='text-text-muted'/> </div>
             <input type="text" placeholder="Filtrar..." value={filtroHistorico} onChange={(e) => setFiltroHistorico(e.target.value)} className="w-full rounded border border-border bg-bg-base py-2 pl-9 pr-3 text-sm text-text-base placeholder-text-muted" />
           </div>
         </div>
         {historicoFiltrado.length > 0 ? (
           <>
             <HistoricoAplicacoesTable aplicacoes={historicoPaginado} />
             <PaginationControls currentPage={currentPageHistorico} totalPages={totalPagesHistorico} onPageChange={setCurrentPageHistorico} itemsPerPage={itemsPerPage} totalItems={historicoFiltrado.length} />
           </>
         ) : (
           <div className="text-center py-10 text-text-muted flex flex-col items-center">
             <FilterIcon size={32} className="mb-2 opacity-50"/>
             <span>Nenhum registro encontrado{filtroHistorico ? ` para "${filtroHistorico}"` : ''}.</span>
           </div>
         )}
      </motion.div>

      {/* --- Modal Agendamento --- */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={agendamentoSelecionado ? 'Editar Agendamento' : 'Novo Agendamento'}>
            <AgendamentoForm 
                onClose={() => setIsModalOpen(false)} 
                agendamentoParaEditar={agendamentoSelecionado} 
                slotSelecionado={dataSelecionadaSlot} 
                funcionarios={funcionarios} 
                vacinas={vacinas} 
                onSaveSuccess={handleSaveSuccess} 
                onCheckIn={handleStartCheckIn} // 🔌 Conecta o fluxo de Check-in
            />
          </Modal>
        )}
      </AnimatePresence>

      {/* --- Modal Registro (Check-in) --- */}
      <AnimatePresence>
        {isRegistroModalOpen && (
            <Modal isOpen={isRegistroModalOpen} onClose={() => setIsRegistroModalOpen(false)} title="Confirmar Aplicação"> 
                <RegistroAplicacaoForm 
                    funcionarios={funcionarios} 
                    vacinas={vacinas} 
                    initialData={registroInitialData} // 🔌 Passa os dados do agendamento
                    onRegister={() => {
                        handleSaveSuccess(); // Atualiza tudo após registrar
                        setIsRegistroModalOpen(false);
                    }}
                /> 
            </Modal>
        )}
      </AnimatePresence>

    </motion.div>
  )
}