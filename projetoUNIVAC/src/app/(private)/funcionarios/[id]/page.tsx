'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Shield, Syringe, CalendarDays, Loader2, Edit3, CheckCircle, History as HistoryIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { mockFuncionarios, mockAplicacoes, IFuncionario, IAplicacao } from '@/lib/mock-data'
import { Button } from '@/components/ui/Button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { ProgressBar } from '@/components/ui/ProgressBar'

const verificarStatusGeral = (func: IFuncionario) => {
    return func?.statusVacinacao === 'completo' ? 'Em Dia' : func?.statusVacinacao === 'parcial' ? 'Parcial' : 'Pendente';
}

export default function FuncionarioDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const { id } = params
    const [isLoading, setIsLoading] = useState(true)
    const [funcionario, setFuncionario] = useState<IFuncionario | null>(null)
    const [aplicacoesRecentes, setAplicacoesRecentes] = useState<IAplicacao[]>([])

    // 1. Lógica de Carregamento e Busca de Dados
    useEffect(() => {
        setIsLoading(true);
        const funcId = Number(id);

        const timer = setTimeout(() => {
            const foundFunc = mockFuncionarios.find(f => f.id === funcId);

            if (foundFunc) {
                const funcAplicacoes = mockAplicacoes
                    .filter(app => app.funcionarioNome === foundFunc.nome)
                    .sort((a, b) => b.dataAplicacao.getTime() - a.dataAplicacao.getTime());

                setFuncionario(foundFunc);
                setAplicacoesRecentes(funcAplicacoes);
            }

            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [id]);

    // Calcula o percentual de vacinação (MOCK)
    const percentualVacinacao = useMemo(() => {
        if (!funcionario) return 0;
        const totalAplicacoes = aplicacoesRecentes.length;
        return Math.min(Math.round((totalAplicacoes / 3) * 100), 100);
    }, [funcionario, aplicacoesRecentes]);


    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
    const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    if (isLoading) {
        return (
            <div className="flex h-full min-h-[60vh] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
            </div>
        );
    }

    if (!funcionario) {
        return (
            <div className="mx-auto max-w-4xl p-6 text-center bg-bg-surface rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-red-500">404 - Funcionário Não Encontrado</h1>
                <p className="mt-4 text-text-muted">O ID "{id}" não corresponde a nenhum registro.</p>
                <Button onClick={() => router.push('/funcionarios')} className="mt-6" variant="secondary">
                    <ArrowLeft size={18} /> Voltar para a Gestão
                </Button>
            </div>
        );
    }

    const statusGeral = verificarStatusGeral(funcionario);
    const statusColor = statusGeral === 'Em Dia' ? 'text-primary' : statusGeral === 'Parcial' ? 'text-yellow-500' : 'text-red-500';

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">

            <motion.div variants={itemVariants} className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <Button onClick={() => router.back()} variant="secondary" className="flex items-center gap-2">
                    <ArrowLeft size={18} /> Voltar
                </Button>
                <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                    {funcionario.nome}
                </h1>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <motion.div variants={itemVariants} className="lg:col-span-2 rounded-lg bg-bg-surface p-6 shadow-lg border border-border">
                    <h2 className="mb-6 text-xl font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
                        <User size={20} className="text-primary"/> Dados Pessoais
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {/* Campo: Nome */}
                        <InfoField icon={User} label="Nome Completo" value={funcionario.nome} />
                        {/* Campo: Email */}
                        <InfoField icon={Mail} label="Email" value={funcionario.email} />
                        {/* Campo: Registro */}
                        <InfoField icon={CalendarDays} label="Nº de Registro" value={String(funcionario.numeroRegistro)} />
                        {/* Campo: CPF (Muted) */}
                        <InfoField icon={Shield} label="CPF" value={funcionario.cpf} isMuted />
                        {/* Campo: Perfil */}
                        <InfoField icon={User} label="Perfil de Acesso" value={funcionario.role === 'ADMIN' ? 'Administrador' : 'Funcionário'} />
                        {/* Campo: Status (Ativo/Inativo) */}
                        <InfoField icon={CheckCircle} label="Status" value={funcionario.status ? 'Ativo' : 'Inativo'} statusColor={funcionario.status ? 'text-primary' : 'text-red-500'} />
                    </div>
                </motion.div>

                {/* COLUNA 3: Status de Conformidade */}
                <motion.div variants={itemVariants} className="lg:col-span-1 rounded-lg bg-bg-surface p-6 shadow-lg border border-border flex flex-col justify-center">
                    <h2 className="mb-4 text-xl font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
                        <Syringe size={20} className="text-primary"/> Status de Vacinação
                    </h2>

                    <div className="text-center">
                        <p className={`text-4xl font-extrabold ${statusColor}`}>{statusGeral}</p>
                        <p className="text-sm text-text-muted mt-2 mb-4">Conformidade obrigatória.</p>

                        <div className="space-y-2">
                            <p className="text-sm font-medium text-text-base">Progresso Geral ({percentualVacinacao}%)</p>
                            <ProgressBar value={percentualVacinacao} />
                        </div>
                    </div>

                    <Button variant="secondary" className="mt-6 w-full" onClick={() => router.push('/agenda')}>
                        Ver Próximos Agendamentos
                    </Button>
                </motion.div>
            </div>

            {/* --- Histórico de Aplicações --- */}
            <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-lg border border-border">
                <h2 className="mb-4 text-xl font-semibold text-text-base border-b border-border pb-3 flex items-center gap-2">
                    <HistoryIcon size={20} className="text-primary"/> Histórico de Aplicações
                </h2>

                <HistoricoTabela aplicacoes={aplicacoesRecentes} />
            </motion.div>

        </motion.div>
    )
}

// --- Componentes Auxiliares ---
// Componente para exibir um campo de informação
interface InfoFieldProps {
    label: string;
    value: string;
    icon: React.ElementType;
    isMuted?: boolean;
    statusColor?: string;
}
function InfoField({ label, value, icon: Icon, isMuted, statusColor }: InfoFieldProps) {
    return (
        <div className="border-l-4 border-primary/50 pl-3">
            <p className="text-xs font-medium uppercase text-text-muted">{label}</p>
            <div className="flex items-center gap-2 mt-1">
                <Icon size={16} className={statusColor || (isMuted ? 'text-text-muted' : 'text-text-base')} />
                <p className={`text-sm font-semibold break-words ${statusColor || (isMuted ? 'text-text-muted' : 'text-text-base')}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}


// Tabela de Histórico Simples
interface HistoricoTabelaProps {
    aplicacoes: IAplicacao[];
}
function HistoricoTabela({ aplicacoes }: HistoricoTabelaProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Vacina</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Lote</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {aplicacoes.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-text-muted py-6">Nenhum registro de vacinação encontrado.</TableCell>
                    </TableRow>
                )}
                {aplicacoes.map((app) => (
                    <TableRow key={app.id}>
                        <TableCell className="font-medium text-text-base">{app.tipoVacina}</TableCell>
                        <TableCell>{format(app.dataAplicacao, 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell className="text-text-muted">{app.responsavel}</TableCell>
                        <TableCell className="text-text-muted">{app.lote}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}