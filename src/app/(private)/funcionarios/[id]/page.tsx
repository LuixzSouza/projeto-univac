'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Mail, Shield, Syringe, CalendarDays, 
  CheckCircle, History as HistoryIcon, AlertCircle, FileBadge, Printer,
  AlertTriangle, BellRing, ThumbsUp, ExternalLink,
  ChevronRight
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSession } from 'next-auth/react'

// Componentes UI
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { CarteirinhaVacina } from '@/components/features/funcionarios/CarteirinhaVacina'
import { toast } from 'sonner' // ✨ Importando Toast

// --- Interfaces ---
interface IAplicacaoAPI {
  id: number
  dataAplicacao: string 
  lote: string
  responsavel?: string 
  vacina: { 
      id: number; 
      nome: string 
  }
}

interface IFuncionarioDetalhado {
  id: number
  nome: string
  email: string
  numeroRegistro: number
  cpf: string
  role: string
  status: boolean
  aplicacoes: IAplicacaoAPI[]
}

interface IVacinaSimples {
    id: number;
    nome: string;
    obrigatoriedade: boolean;
}

// --- Helpers ---
function getInitials(name: string) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function FuncionarioDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { data: session } = useSession()
  
  // Estados
  const [isLoading, setIsLoading] = useState(true)
  const [funcionario, setFuncionario] = useState<IFuncionarioDetalhado | null>(null)
  const [todasVacinas, setTodasVacinas] = useState<IVacinaSimples[]>([]) 
  const [isCarteirinhaOpen, setIsCarteirinhaOpen] = useState(false)
  const [isNotifying, setIsNotifying] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false) // ✨ Estado de loading para impressão
  
  const componentRef = useRef<HTMLDivElement>(null)
  
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const currentUserId = (session?.user as any)?.id;

  // Busca de Dados
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const [resFunc, resVac] = await Promise.all([
          fetch(`/api/funcionarios/${id}`),
          fetch(`/api/vacinas`)
      ])
      
      if (!resFunc.ok) {
        if (resFunc.status === 404) setFuncionario(null)
        else throw new Error('Erro ao buscar funcionário')
        return
      }

      const dataFunc = await resFunc.json()
      const dataVac = await resVac.json()

      setFuncionario(dataFunc)
      setTodasVacinas(dataVac)

    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar prontuário.")
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Função de Impressão OTIMIZADA (Com Toast)
  const handlePrint = () => {
    const content = componentRef.current
    if (!content) {
        toast.error("Erro: Documento não carregou corretamente.")
        return
    }

    setIsPrinting(true)
    const toastId = toast.loading("Preparando documento para impressão...")

    setTimeout(() => {
        const printWindow = window.open('', '', 'width=800,height=600')
        
        if (printWindow) {
            printWindow.document.write('<html><head><title>Carteirinha UniVac</title>')
            // CDN do Tailwind para garantir que o estilo saia na impressão
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>')
            printWindow.document.write('</head><body >')
            printWindow.document.write(content.outerHTML)
            printWindow.document.write('</body></html>')
            printWindow.document.close()
            
            // Espera renderizar
            setTimeout(() => {
                printWindow.focus()
                printWindow.print()
                printWindow.close()
                
                // Limpa o estado
                setIsPrinting(false)
                toast.dismiss(toastId)
                toast.success("Janela de impressão aberta.")
            }, 800)
        } else {
            setIsPrinting(false)
            toast.dismiss(toastId)
            toast.error("Pop-up bloqueado! Permita pop-ups para imprimir.")
        }
    }, 100)
  }

  // Simulação de Notificação
  const handleNotify = () => {
      setIsNotifying(true)
      // Toast Promessa (Carregando -> Sucesso)
      toast.promise(new Promise(resolve => setTimeout(resolve, 1500)), {
          loading: 'Enviando notificação...',
          success: `Lembrete enviado para ${funcionario?.email}!`,
          error: 'Erro ao enviar.',
      });
      setTimeout(() => setIsNotifying(false), 1500)
  }

  // --- LÓGICA DE PENDÊNCIAS ---
  const aplicacoesRecentes = funcionario?.aplicacoes || [];
  const vacinasTomadasIds = useMemo(() => aplicacoesRecentes.map(app => app.vacina.id), [aplicacoesRecentes]);
  const vacinasPendentes = useMemo(() => todasVacinas.filter(v => v.obrigatoriedade && !vacinasTomadasIds.includes(v.id)), [todasVacinas, vacinasTomadasIds]);
  
  const percentualConformidade = useMemo(() => {
      const totalObrigatorias = todasVacinas.filter(v => v.obrigatoriedade).length;
      if (totalObrigatorias === 0) return 100;
      const tomadasObrigatorias = todasVacinas.filter(v => v.obrigatoriedade && vacinasTomadasIds.includes(v.id)).length;
      return Math.round((tomadasObrigatorias / totalObrigatorias) * 100);
  }, [todasVacinas, vacinasTomadasIds]);

  const statusGeral = vacinasPendentes.length === 0 ? 'Em Dia' : 'Pendente';
  const statusColor = statusGeral === 'Em Dia' ? 'text-green-600' : 'text-red-600';

  const isViewingOwnProfile = String(funcionario?.id) === currentUserId;
  const canViewSensitiveData = isAdmin || isViewingOwnProfile;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (isLoading) return <div className="flex h-full min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>;

  if (!funcionario) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center bg-bg-surface rounded-xl shadow-lg border border-border mt-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500"><AlertCircle size={32} /></div>
        <h1 className="text-2xl font-bold text-text-base">Funcionário não encontrado</h1>
        <Button onClick={() => router.push('/funcionarios')} className="mt-6 w-full" variant="secondary"><ArrowLeft size={18} className="mr-2"/> Voltar</Button>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">

      {/* CABEÇALHO */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border pb-6 bg-bg-surface p-6 rounded-xl shadow-sm border">
         <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-600 text-2xl font-bold text-white shadow-md border-4 border-white dark:border-gray-800">
            {getInitials(funcionario.nome)}
         </div>
         <div className="flex-grow">
            <h1 className="text-3xl font-bold text-text-base tracking-tight">{funcionario.nome}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-base px-3 py-1 font-medium text-text-muted border border-border capitalize">
                    <User size={14} /> {funcionario.role.toLowerCase()}
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium border ${funcionario.status ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                    {funcionario.status ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
                    {funcionario.status ? 'Cadastro Ativo' : 'Inativo'}
                </span>
            </div>
         </div>
         
         {/* Ações de Topo */}
         {isAdmin && vacinasPendentes.length > 0 && (
             <Button variant="secondary" onClick={handleNotify} disabled={isNotifying} className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                 {isNotifying ? 'Enviando...' : 'Cobrar Pendências'} <BellRing size={16} className="ml-2"/>
             </Button>
         )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* COLUNA 1: Dados Pessoais */}
        <motion.div variants={itemVariants} className="rounded-xl bg-bg-surface p-6 shadow-sm border border-border">
          <h2 className="mb-6 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
            <User size={20} className="text-primary"/> Dados Pessoais
          </h2>
          <div className="space-y-4">
            <InfoField icon={User} label="Nome" value={funcionario.nome} />
            <InfoField icon={Mail} label="Email" value={funcionario.email} />
            {canViewSensitiveData ? (
                <>
                  <InfoField icon={CalendarDays} label="Registro" value={String(funcionario.numeroRegistro)} />
                  <InfoField icon={Shield} label="CPF" value={funcionario.cpf} isMuted />
                </>
            ) : (
                <div className="p-3 bg-bg-base rounded text-xs text-text-muted text-center italic border border-dashed border-border">
                    Dados sensíveis ocultos por segurança.
                </div>
            )}
          </div>
        </motion.div>

        {/* COLUNA 2: Status & Pendências */}
        <motion.div variants={itemVariants} className="rounded-xl bg-bg-surface p-6 shadow-sm border border-border flex flex-col">
           <h2 className="mb-4 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
             <Syringe size={20} className="text-primary"/> Situação Vacinal
           </h2>

           <div className="flex items-center justify-between mb-4">
               <div>
                  <p className="text-sm text-text-muted">Conformidade</p>
                  <p className={`text-2xl font-bold ${statusColor}`}>{statusGeral}</p>
               </div>
               <div className="text-right">
                  <p className="text-sm text-text-muted">Progresso</p>
                  <p className="text-2xl font-bold text-text-base">{percentualConformidade}%</p>
               </div>
           </div>
           <ProgressBar value={percentualConformidade} />

           <div className="mt-6 flex-grow">
               <p className="text-xs font-bold uppercase text-text-muted mb-2">O que falta tomar:</p>
               {vacinasPendentes.length > 0 ? (
                   <ul className="space-y-2">
                       {vacinasPendentes.map(v => (
                           <li key={v.id} className="flex items-center justify-between p-2 rounded bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900">
                               <span className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center gap-2">
                                   <AlertTriangle size={14}/> {v.nome}
                               </span>
                               {isAdmin && (
                                   <button onClick={() => router.push('/agenda')} className="text-xs text-red-600 hover:underline flex items-center">
                                       Agendar <ChevronRight size={12} />
                                   </button>
                               )}
                           </li>
                       ))}
                   </ul>
               ) : (
                   <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900 rounded flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
                       <ThumbsUp size={16} /> Nenhuma pendência obrigatória!
                   </div>
               )}
           </div>
        </motion.div>

        {/* COLUNA 3: Ações Rápidas */}
        <motion.div variants={itemVariants} className="rounded-xl bg-bg-surface p-6 shadow-sm border border-border flex flex-col justify-center gap-4">
            <div className="text-center mb-2">
                <Shield size={48} className="mx-auto text-primary/20 mb-2"/>
                <h3 className="font-bold text-text-base">Área de Ações</h3>
                <p className="text-xs text-text-muted">Gerencie os documentos e agenda deste colaborador.</p>
            </div>

            {isAdmin && (
                <Button variant="secondary" className="w-full justify-between group" onClick={() => router.push('/agenda')}>
                    <span className="flex items-center gap-2"><CalendarDays size={18}/> Agendar Dose</span>
                    <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform"/>
                </Button>
            )}
            
            {/* BOTÃO COM TOAST: Carteirinha */}
            <Button 
                onClick={() => {
                    setIsCarteirinhaOpen(true);
                    toast.info("Carregando documento...", { duration: 1000 });
                }}
                className="w-full justify-between bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm group"
            >
                <span className="flex items-center gap-2"><FileBadge size={18}/> Carteirinha Digital</span>
                <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform"/>
            </Button>
            
            {/* BOTÃO IMPRIMIR DIRETO */}
            <Button variant="secondary" className="w-full justify-between group" onClick={handlePrint} disabled={isPrinting}>
                 <span className="flex items-center gap-2"><Printer size={18}/> {isPrinting ? 'Imprimindo...' : 'Imprimir Ficha'}</span>
            </Button>
        </motion.div>
      </div>

      {/* --- Histórico --- */}
      <motion.div variants={itemVariants} className="rounded-xl bg-bg-surface p-6 shadow-sm border border-border">
        <h2 className="mb-4 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
          <HistoryIcon size={20} className="text-primary"/> Histórico Completo
        </h2>
        <HistoricoTabela aplicacoes={aplicacoesRecentes} />
      </motion.div>

      {/* --- MODAL CARTEIRINHA --- */}
      <AnimatePresence>
         {isCarteirinhaOpen && funcionario && (
            <Modal 
                isOpen={isCarteirinhaOpen} 
                onClose={() => setIsCarteirinhaOpen(false)} 
                title="Documento Oficial"
            >
                <div className="flex flex-col gap-4">
                    <div className="max-h-[60vh] overflow-y-auto border border-gray-200 rounded-lg shadow-inner bg-gray-50">
                        <CarteirinhaVacina 
                            ref={componentRef} 
                            funcionario={funcionario} 
                            aplicacoes={funcionario.aplicacoes} 
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsCarteirinhaOpen(false)}>Fechar</Button>
                        <Button onClick={handlePrint} disabled={isPrinting} className="flex items-center gap-2 shadow-md">
                            <Printer size={18} /> Imprimir
                        </Button>
                    </div>
                </div>
            </Modal>
         )}
       </AnimatePresence>

    </motion.div>
  )
}

// --- Sub-componentes ---
function InfoField({ label, value, icon: Icon, isMuted }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-bg-base transition-colors">
       <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-bg-base text-text-muted border border-border">
          <Icon size={18} />
       </div>
       <div className="flex-grow min-w-0">
          <p className="text-[10px] font-bold uppercase text-text-muted tracking-wide">{label}</p>
          <p className={`text-sm font-medium truncate ${isMuted ? 'text-text-muted font-mono' : 'text-text-base'}`}>{value}</p>
       </div>
    </div>
  );
}

function HistoricoTabela({ aplicacoes }: { aplicacoes: IAplicacaoAPI[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-base">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Imunizante</TableHead>
            <TableHead>Data Aplicação</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Responsável</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {aplicacoes.length === 0 && (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-text-muted py-12">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="p-4 bg-bg-surface rounded-full"><Syringe size={32} /></div>
                        <span>Nenhum registro encontrado.</span>
                    </div>
                </TableCell>
            </TableRow>
            )}
            {aplicacoes.map((app) => (
            <TableRow key={app.id} className="hover:bg-bg-surface transition-colors">
                <TableCell className="font-medium text-text-base flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm"></div>
                    {app.vacina.nome}
                </TableCell>
                <TableCell className="text-text-base">{format(new Date(app.dataAplicacao), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                <TableCell><span className="font-mono text-xs bg-bg-surface border border-border px-2 py-1 rounded text-text-muted">{app.lote || 'N/A'}</span></TableCell>
                <TableCell className="text-text-muted text-sm italic">{app.responsavel || "Sistema"}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}