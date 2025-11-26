'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, User, Mail, Shield, Syringe, CalendarDays, 
  CheckCircle, History as HistoryIcon, AlertCircle, FileBadge, Printer 
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useSession } from 'next-auth/react' // ✨ Importe de Sessão

// Componentes UI
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { CarteirinhaVacina } from '@/components/features/funcionarios/CarteirinhaVacina'

// --- Interfaces (Mantidas) ---
interface IAplicacaoAPI {
  id: number
  dataAplicacao: string 
  lote: string
  responsavel?: string 
  vacina: { nome: string }
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

// --- Helpers (Mantidos) ---
const verificarStatusGeral = (totalAplicacoes: number) => {
  if (totalAplicacoes >= 3) return 'Em Dia'; 
  if (totalAplicacoes > 0) return 'Parcial';
  return 'Pendente';
}

function getInitials(name: string) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function FuncionarioDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const { data: session } = useSession() // ✨ Pegamos a sessão
  
  // Estados
  const [isLoading, setIsLoading] = useState(true)
  const [funcionario, setFuncionario] = useState<IFuncionarioDetalhado | null>(null)
  const [isCarteirinhaOpen, setIsCarteirinhaOpen] = useState(false)
  
  // Ref para Impressão
  const componentRef = useRef<HTMLDivElement>(null)
  
  // ✨ RBAC & ID DO USUÁRIO LOGADO
  const isAdmin = (session?.user as any)?.role === 'ADMIN';
  const currentUserId = (session?.user as any)?.id;

  // 1. Busca de Dados (Mantido)
  const fetchFuncionario = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/funcionarios/${id}`)
      
      if (!res.ok) {
        if (res.status === 404) setFuncionario(null)
        else throw new Error('Erro ao buscar')
        return
      }

      const data = await res.json()
      setFuncionario(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchFuncionario()
  }, [fetchFuncionario])

  // 2. Função de Impressão (Mantido)
  const handlePrint = () => {
    const content = componentRef.current
    if (!content) return

    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
        printWindow.document.write('<html><head><title>Imprimir Carteirinha</title>')
        printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>')
        printWindow.document.write('</head><body >')
        printWindow.document.write(content.outerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        
        setTimeout(() => {
            printWindow.focus()
            printWindow.print()
            printWindow.close()
        }, 500)
    }
  }

  // 3. Cálculos de Status
  const aplicacoesRecentes = funcionario?.aplicacoes || [];
  
  const percentualVacinacao = useMemo(() => {
    if (!funcionario) return 0;
    const total = aplicacoesRecentes.length;
    return Math.min(Math.round((total / 3) * 100), 100);
  }, [funcionario, aplicacoesRecentes]);

  const statusGeral = verificarStatusGeral(aplicacoesRecentes.length);
  const statusColor = statusGeral === 'Em Dia' ? 'text-primary' : statusGeral === 'Parcial' ? 'text-yellow-500' : 'text-red-500';

  // ✨ VERIFICA SE ESTÁ VENDO O PRÓPRIO PERFIL (ID da URL == ID da Sessão)
  const isViewingOwnProfile = String(funcionario?.id) === currentUserId;
  const canViewSensitiveData = isAdmin || isViewingOwnProfile;

  // Animações
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  // --- Renderização: Loading (Mantido) ---
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
      </div>
    );
  }

  // --- Renderização: 404 (Mantido) ---
  if (!funcionario) {
    return (
      <div className="mx-auto max-w-lg p-8 text-center bg-bg-surface rounded-xl shadow-lg border border-border mt-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-500">
            <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-text-base">Funcionário não encontrado</h1>
        <p className="mt-2 text-text-muted">Não conseguimos localizar o registro com ID "{id}".</p>
        <Button onClick={() => router.push('/funcionarios')} className="mt-6 w-full" variant="secondary">
          <ArrowLeft size={18} className="mr-2"/> Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-10">

      {/* CABEÇALHO DE PERFIL */}
      <motion.div variants={itemVariants} className="flex items-center gap-5 border-b border-border pb-6">
         <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-green-600 text-2xl font-bold text-white shadow-md border-4 border-bg-surface">
            {getInitials(funcionario.nome)}
         </div>
         <div>
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
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* COLUNA 1 e 2: Dados Pessoais */}
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-xl bg-bg-surface p-6 shadow-sm border border-border">
          <h2 className="mb-6 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
            <User size={20} className="text-primary"/> Informações Cadastrais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <InfoField icon={User} label="Nome Completo" value={funcionario.nome} />
            <InfoField icon={Mail} label="Email Corporativo" value={funcionario.email} />
            
            {/* ✨ CPF/REGISTRO: Visível para Admin OU Próprio Usuário */}
            {canViewSensitiveData ? (
                <>
                  <InfoField icon={CalendarDays} label="Nº de Registro" value={String(funcionario.numeroRegistro)} />
                  <InfoField icon={Shield} label="CPF" value={funcionario.cpf} isMuted />
                </>
            ) : (
                /* Placeholder para Manter Layout */
                <>
                  <InfoField icon={CalendarDays} label="Nº de Registro" value="Acesso Restrito" isMuted />
                  <InfoField icon={Shield} label="CPF" value="Acesso Restrito" isMuted />
                </>
            )}
          </div>
        </motion.div>

        {/* COLUNA 3: Status e Ações */}
        <motion.div variants={itemVariants} className="lg:col-span-1 rounded-xl bg-bg-surface p-6 shadow-sm border border-border flex flex-col justify-between h-full">
          <div>
              <h2 className="mb-4 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
                <Syringe size={20} className="text-primary"/> Status Vacinal
              </h2>

              <div className="text-center py-2">
                <p className={`text-4xl font-extrabold tracking-tight ${statusColor}`}>{statusGeral}</p>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wide font-semibold">Situação Atual</p>
                
                <div className="mt-6 space-y-2 text-left">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Conformidade</span>
                        <span className="font-medium text-text-base">{percentualVacinacao}%</span>
                    </div>
                    <ProgressBar value={percentualVacinacao} />
                </div>
              </div>
          </div>

          <div className="space-y-3 mt-8">
            {/* ✨ RBAC: Botão Agendar Dose só aparece para Admin */}
            {isAdmin && (
                <Button variant="secondary" className="w-full justify-start" onClick={() => router.push('/agenda')}>
                    <CalendarDays size={18} className="mr-2 text-text-muted"/> Agendar Dose
                </Button>
            )}
            
            <Button 
                onClick={() => setIsCarteirinhaOpen(true)}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white border-none shadow-sm"
            >
                <FileBadge size={18} className="mr-2"/> Carteirinha Digital
            </Button>
          </div>
        </motion.div>
      </div>

      {/* --- Histórico de Aplicações --- */}
      <motion.div variants={itemVariants} className="rounded-xl bg-bg-surface p-6 shadow-sm border border-border">
        <h2 className="mb-4 text-lg font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
          <HistoryIcon size={20} className="text-primary"/> Histórico de Aplicações
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

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setIsCarteirinhaOpen(false)}>
                            Fechar Visualização
                        </Button>
                        <Button onClick={handlePrint} className="flex items-center gap-2 shadow-md">
                            <Printer size={18} /> Imprimir / Salvar PDF
                        </Button>
                    </div>
                </div>
            </Modal>
         )}
       </AnimatePresence>

    </motion.div>
  )
}

// --- Sub-componentes de Apresentação (Mantidos) ---

interface InfoFieldProps {
  label: string;
  value: string;
  icon: React.ElementType;
  isMuted?: boolean;
}
function InfoField({ label, value, icon: Icon, isMuted }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-4">
       <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg-base text-text-muted border border-border shadow-sm">
          <Icon size={20} />
       </div>
       <div>
          <p className="text-xs font-bold uppercase text-text-muted tracking-wide mb-1">{label}</p>
          <p className={`text-base font-medium break-all ${isMuted ? 'text-text-muted font-mono' : 'text-text-base'}`}>
             {value}
          </p>
       </div>
    </div>
  );
}

interface HistoricoTabelaProps {
  aplicacoes: IAplicacaoAPI[];
}
function HistoricoTabela({ aplicacoes }: HistoricoTabelaProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-base">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Imunizante</TableHead>
            <TableHead>Data Aplicação</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Responsável Técnico</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {aplicacoes.length === 0 && (
            <TableRow>
                <TableCell colSpan={4} className="text-center text-text-muted py-12">
                    <div className="flex flex-col items-center justify-center gap-3 opacity-50">
                        <div className="p-4 bg-bg-surface rounded-full"><Syringe size={32} /></div>
                        <span>Nenhum registro de vacinação encontrado no histórico.</span>
                    </div>
                </TableCell>
            </TableRow>
            )}
            {aplicacoes.map((app) => (
            <TableRow key={app.id} className="hover:bg-bg-surface transition-colors">
                <TableCell className="font-medium text-text-base flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm shadow-primary/50"></div>
                    {app.vacina.nome}
                </TableCell>
                <TableCell className="text-text-base">
                    {format(new Date(app.dataAplicacao), "dd 'de' MMM, yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>
                    <span className="font-mono text-xs bg-bg-surface border border-border px-2 py-1 rounded text-text-muted">
                        {app.lote || 'N/A'}
                    </span>
                </TableCell>
                <TableCell className="text-text-muted text-sm italic">
                    {app.responsavel || "Sistema"} 
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}