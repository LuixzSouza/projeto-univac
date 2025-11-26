'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Search, Filter, Download, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Button } from '@/components/ui/Button'

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/auditoria')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setLogs(data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filteredLogs = logs.filter(log => 
    log.detalhe.toLowerCase().includes(filter.toLowerCase()) ||
    log.autor.toLowerCase().includes(filter.toLowerCase()) ||
    log.acao.toLowerCase().includes(filter.toLowerCase())
  )

  // Helper para cor da badge
  const getActionColor = (action: string) => {
      if (action.includes('DELETE') || action.includes('EXCLUSAO')) return 'bg-red-100 text-red-700 border-red-200';
      if (action.includes('UPDATE') || action.includes('EDICAO')) return 'bg-blue-100 text-blue-700 border-blue-200';
      if (action.includes('CREATE') || action.includes('CADASTRO')) return 'bg-green-100 text-green-700 border-green-200';
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                <ShieldAlert className="text-primary" size={32} /> Auditoria do Sistema
            </h1>
            <p className="text-text-muted">Registro de segurança e rastreabilidade de ações.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
            <Download size={18} /> Exportar Logs
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-sm flex items-center gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
            <input 
                type="text" 
                placeholder="Filtrar por usuário, ação ou detalhe..." 
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-bg-base focus:ring-2 focus:ring-primary/20 outline-none"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
        </div>
        <Button variant="ghost" className="shrink-0">
            <Filter size={18} className="mr-2"/> Filtros Avançados
        </Button>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-bg-base text-text-muted font-medium uppercase text-xs border-b border-border">
                <tr>
                    <th className="px-6 py-3">Data / Hora</th>
                    <th className="px-6 py-3">Autor</th>
                    <th className="px-6 py-3">Ação</th>
                    <th className="px-6 py-3">Recurso</th>
                    <th className="px-6 py-3">Detalhe</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {isLoading ? (
                     <tr><td colSpan={5} className="p-8 text-center">Carregando logs...</td></tr>
                ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan={5} className="p-8 text-center text-text-muted">Nenhum registro encontrado.</td></tr>
                ) : (
                    filteredLogs.map((log) => (
                        <motion.tr key={log.id} variants={itemVariants} className="hover:bg-bg-base transition-colors">
                            <td className="px-6 py-3 font-mono text-xs text-text-muted">
                                {format(new Date(log.data), "dd/MM/yyyy HH:mm:ss")}
                            </td>
                            <td className="px-6 py-3 font-medium text-text-base">
                                {log.autor}
                            </td>
                            <td className="px-6 py-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${getActionColor(log.acao)}`}>
                                    {log.acao}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-text-muted">
                                {log.recurso}
                            </td>
                            <td className="px-6 py-3 text-text-base truncate max-w-md">
                                {log.detalhe}
                            </td>
                        </motion.tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

    </motion.div>
  )
}