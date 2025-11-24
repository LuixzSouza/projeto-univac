'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { mockFuncionarios, mockVacinas, mockAgendamentos, mockAplicacoes, IFuncionario, IVacina, IAgendamento, IAplicacao } from '@/lib/mock-data'

import { FuncionariosVacinacaoChart } from '@/components/features/dashboard/FuncionariosVacinacaoChart'
import { StatusVacinaChart } from '@/components/features/dashboard/StatusVacinaChart'
import { TabelaStatusObrigatorio } from '@/components/features/dashboard/TabelaStatusObrigatorio'
import { MiniCalendar } from '@/components/features/dashboard/MiniCalendar'
import { AcessarButton } from '@/components/ui/AcessarButton'
import { QuickActionsCard } from '@/components/features/dashboard/QuickActionsCard'
import { RecentActivityFeed } from '@/components/features/dashboard/RecentActivityFeed'
import { ComplianceSummaryCard } from '@/components/features/dashboard/ComplianceSummaryCard'

import { CalendarDays, Users } from 'lucide-react'
import { format } from 'date-fns' 
import { ptBR } from 'date-fns/locale/pt-BR'

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 300); 
    return () => clearTimeout(timer);
  }, []);

  const funcionarios = mockFuncionarios;
  const vacinas = mockVacinas;
  const agendamentos = mockAgendamentos;
  const aplicacoes = mockAplicacoes;

  const vacinasObrigatorias = vacinas.filter(v => v.obrigatoriedade);
  const proximosAgendamentosLista = agendamentos
    .filter(ag => ag.start >= new Date(new Date().setHours(0,0,0,0))) 
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5); 
  const aplicacoesRecentes = aplicacoes
      .sort((a,b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime())
      .slice(0, 5); 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary"></div> 
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8" 
    >
      {/* --- Saudação --- */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-text-base">Painel UniVac</h1>
        <p className="text-text-muted">Visão geral e ações rápidas do sistema de vacinação.</p>
      </motion.div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        {/* Coluna 1: Gráfico Status Vacinas (Tipos) */}
        <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-1 h-full">
            <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-2 text-text-base text-center">Tipos de Vacina</h3>
              <div className="flex-grow flex items-center justify-center min-h-[200px]"> {/* Altura mínima */}
                <StatusVacinaChart vacinas={vacinas} />
              </div>
            </div>
        </motion.div>

        {/* Coluna 2: Gráfico Funcionários Vacinados */}
        <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-1 h-full">
            <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
              <div className="flex-grow flex items-center justify-center min-h-[200px]"> 
                <FuncionariosVacinacaoChart funcionarios={funcionarios} />
              </div>
            </div>
        </motion.div>

        {/* Coluna 3: Card Sumário de Conformidade */}
        <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-1 h-full">
            <ComplianceSummaryCard funcionarios={funcionarios} vacinasObrigatorias={vacinasObrigatorias} />
        </motion.div>

        {/* Coluna 4: Card Ações Rápidas */}
        <motion.div variants={itemVariants} className="lg:col-span-1 md:col-span-1 h-full">
            <QuickActionsCard />
        </motion.div>

      </div>

       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"> 

         <motion.div variants={itemVariants} className="lg:col-span-1">
            <TabelaStatusObrigatorio
              funcionarios={funcionarios}
              vacinasObrigatorias={vacinasObrigatorias} 
            />
         </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
             <RecentActivityFeed atividades={aplicacoesRecentes} />
          </motion.div>
       </div>

        <motion.div variants={itemVariants} className="h-full">
           <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col">
             <h3 className="text-lg font-semibold text-text-base mb-4 flex items-center gap-2 border-b pb-2 border-border">
                <CalendarDays size={18}/> Próximos Agendamentos
             </h3>

             {proximosAgendamentosLista.length > 0 ? (
               <div className="flex flex-col flex-grow space-y-4">
                 <div className="flex-grow overflow-y-auto max-h-[160px] pr-2 space-y-2"> 
                   {proximosAgendamentosLista.map((ag, index) => (
                      <div key={ag.id} className={`p-2 rounded ${index === 0 ? 'bg-primary/10' : ''}`}> 
                         <p className='text-sm font-medium text-text-base truncate'>{ag.title}</p>
                         <p className='text-xs text-text-muted'>{format(ag.start, 'EEEE, dd/MM \'às\' HH:mm', { locale: ptBR })}</p> {/* Formato mais completo */}
                      </div>
                   ))}
                 </div>

                 <MiniCalendar />
               </div>
             ) : (
                <div className='text-sm text-center text-text-muted flex-grow flex flex-col items-center justify-center my-4'>
                   <CalendarDays size={32} className="mb-2 opacity-50"/>
                   <span>Nenhum agendamento futuro encontrado.</span>
                </div>
             )}

             <div className="mt-4"> 
               <AcessarButton href="/agenda" label="Ver Agenda Completa"/>
             </div>
           </div>
       </motion.div>

    </motion.div> 
  )
}
