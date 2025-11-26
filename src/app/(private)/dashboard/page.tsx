'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns' 
import { ptBR } from 'date-fns/locale'
import { CalendarDays, RefreshCw, Users, Syringe, Activity, TrendingUp } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// Componentes
import { FuncionariosVacinacaoChart } from '@/components/features/dashboard/FuncionariosVacinacaoChart'
import { StatusVacinaChart } from '@/components/features/dashboard/StatusVacinaChart'
import { RegistroAplicacoesChart } from '@/components/features/dashboard/RegistroAplicacoesChart' // Importe o gráfico de linha
import { TabelaStatusObrigatorio } from '@/components/features/dashboard/TabelaStatusObrigatorio'
import { MiniCalendar } from '@/components/features/dashboard/MiniCalendar'
import { AcessarButton } from '@/components/ui/AcessarButton'
import { QuickActionsCard } from '@/components/features/dashboard/QuickActionsCard'
import { RecentActivityFeed } from '@/components/features/dashboard/RecentActivityFeed'
import { ComplianceSummaryCard } from '@/components/features/dashboard/ComplianceSummaryCard'
import { StatCard } from '@/components/ui/StatCard' // Importe o StatCard melhorado
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Estado inicial seguro
  const [data, setData] = useState<any>({
    funcionarios: [],
    vacinas: [],
    agendamentos: [],
    aplicacoes: []
  });

  // --- LÓGICA DE SAUDAÇÃO ---
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = session?.user?.nome?.split(' ')[0] || 'Gestor';

  // --- BUSCA DE DADOS ---
  const loadDashboard = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      
      const res = await fetch('/api/dashboard');
      if (!res.ok) throw new Error('Erro ao buscar dados');
      
      const json = await res.json();
      setData(json);
      
      if (showToast) toast.success("Dados atualizados!");
    } catch (error) {
      console.error("Falha ao carregar dashboard", error);
      if (showToast) toast.error("Não foi possível atualizar.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // --- PROCESSAMENTO DE DADOS (KPIs) ---
  const { funcionarios, vacinas, agendamentos, aplicacoes } = data;
  const vacinasObrigatorias = vacinas.filter((v: any) => v.obrigatoriedade);
  
  // KPIs Calculados
  const totalFuncionarios = funcionarios.length;
  const totalAplicacoes = aplicacoes.length; // Total histórico (ou limitado pela API)
  const totalAgendamentosFuturos = agendamentos.length;

  // Lista de Agendamentos Formatada
  const proximosAgendamentosLista = agendamentos.map((ag: any) => ({
      id: ag.id,
      title: `${ag.vacina.nome}`,
      subtitle: ag.funcionario.nome,
      start: new Date(ag.dataAgendamento)
  }));

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
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
      className="space-y-8 pb-10" 
    >
      {/* --- CABEÇALHO (Saudação + Data + Refresh) --- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-text-base">
                {greeting}, <span className="text-primary">{firstName}</span>! 👋
            </h1>
            <p className="text-text-muted mt-1 capitalize">
                {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
        </div>
        <Button 
            variant="secondary" 
            onClick={() => loadDashboard(true)} 
            disabled={isRefreshing}
            className="flex items-center gap-2 shadow-sm"
        >
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Atualizar Dados
        </Button>
      </motion.div>

      {/* --- LINHA 1: CARDS KPI (Indicadores) --- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={itemVariants}>
            <StatCard 
                title="Total Funcionários" 
                value={totalFuncionarios} 
                icon={Users} 
                variant="default"
                description="Cadastrados no sistema"
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
                title="Aplicações Realizadas" 
                value={totalAplicacoes} 
                icon={Syringe} 
                variant="success"
                description="Histórico recente"
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
                title="Agendamentos" 
                value={totalAgendamentosFuturos} 
                icon={CalendarDays} 
                variant="warning"
                description="Previstos para breve"
            />
        </motion.div>
        <motion.div variants={itemVariants}>
            <StatCard 
                title="Taxa de Atividade" 
                value="Active" 
                icon={Activity} 
                variant="danger" // Usando cores diferentes para variar
                description="Sistema operando"
            />
        </motion.div>
      </div>

      {/* --- LINHA 2: GRÁFICOS PRINCIPAIS & AÇÕES --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Gráfico de Linha (Tendência) - Ocupa 2 colunas */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
             <RegistroAplicacoesChart aplicacoes={aplicacoes} />
        </motion.div>

        {/* Ações Rápidas - Ocupa 1 coluna */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <QuickActionsCard />
        </motion.div>
      </div>

      {/* --- LINHA 3: ANÁLISE DETALHADA --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Card de Conformidade */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <ComplianceSummaryCard 
                funcionarios={funcionarios} 
                vacinasObrigatorias={vacinasObrigatorias} 
            />
        </motion.div>

        {/* Gráfico de Pizza (Status Funcionários) */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
               <h3 className="text-lg font-semibold mb-2 text-text-base text-center">Cobertura Vacinal</h3>
               <div className="flex-grow flex items-center justify-center min-h-[200px]"> 
                 <FuncionariosVacinacaoChart funcionarios={funcionarios} vacinas={vacinas} />
               </div>
            </div>
        </motion.div>

        {/* Gráfico de Rosca (Tipos de Vacina) */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
              <h3 className="text-lg font-semibold mb-2 text-text-base text-center">Catálogo</h3>
              <div className="flex-grow flex items-center justify-center min-h-[200px]"> 
                <StatusVacinaChart vacinas={vacinas} />
              </div>
            </div>
        </motion.div>
      </div>

      {/* --- LINHA 4: TABELAS E LISTAS --- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"> 
         
         {/* Tabela de Pendências - 2 Colunas */}
         <motion.div variants={itemVariants} className="lg:col-span-2">
            <TabelaStatusObrigatorio
              funcionarios={funcionarios}
              vacinasObrigatorias={vacinasObrigatorias} 
            />
         </motion.div>

         {/* Feed de Atividade - 1 Coluna */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
             <RecentActivityFeed atividades={aplicacoes} />
          </motion.div>
      </div>

      {/* --- LINHA 5: AGENDA RÁPIDA --- */}
      <motion.div variants={itemVariants}>
           <div className="rounded-lg bg-bg-surface p-6 shadow-md h-full flex flex-col border border-border">
             <h3 className="text-lg font-semibold text-text-base mb-4 flex items-center gap-2 border-b pb-2 border-border">
                <CalendarDays size={20} className="text-primary"/> Próximos Agendamentos
             </h3>

             {proximosAgendamentosLista.length > 0 ? (
               <div className="flex flex-col lg:flex-row gap-8">
                 {/* Lista com visual melhorado */}
                 <div className="flex-1 space-y-3">
                   {proximosAgendamentosLista.map((ag: any, index: number) => (
                      <div key={ag.id} className="group p-4 rounded-lg bg-bg-base border border-border flex items-center justify-between hover:border-primary/50 transition-colors"> 
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-bg-surface border border-border text-center shadow-sm">
                                <span className="text-xs font-bold text-primary uppercase">{format(ag.start, 'MMM', { locale: ptBR })}</span>
                                <span className="text-lg font-bold text-text-base">{format(ag.start, 'dd')}</span>
                            </div>
                            <div>
                                <p className='text-sm font-bold text-text-base'>{ag.title}</p>
                                <p className='text-xs text-text-muted mt-0.5 flex items-center gap-1'>
                                    <Users size={12}/> {ag.subtitle} • {format(ag.start, 'HH:mm')}
                                </p>
                            </div>
                          </div>
                          <div className="hidden sm:block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                             Agendado
                          </div>
                      </div>
                   ))}
                   <div className="pt-4"> 
                     <AcessarButton href="/agenda" label="Gerenciar Agenda Completa" variant="outline"/>
                   </div>
                 </div>

                 {/* Mini Calendário */}
                 <div className="flex-none flex justify-center lg:justify-end">
                    <MiniCalendar />
                 </div>
               </div>
             ) : (
                <div className='text-sm text-center text-text-muted flex-grow flex flex-col items-center justify-center my-10'>
                   <div className="h-16 w-16 rounded-full bg-bg-base flex items-center justify-center mb-4">
                        <CalendarDays size={32} className="opacity-30"/>
                   </div>
                   <span className="font-medium">Agenda livre!</span>
                   <span className="text-xs opacity-70">Nenhum compromisso previsto para os próximos dias.</span>
                   <div className="mt-4">
                     <AcessarButton href="/agenda" label="Ir para Agenda"/>
                   </div>
                </div>
             )}
           </div>
       </motion.div>

    </motion.div> 
  )
}