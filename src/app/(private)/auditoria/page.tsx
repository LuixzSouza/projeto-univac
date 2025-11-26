'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ShieldAlert, Search, Filter, Download, RefreshCw, 
  Trash2, Edit, PlusCircle, LogIn, FileText, Activity, Users, AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

import { Button } from '@/components/ui/Button'

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState('')

  // --- BUSCA LOGS ---
  const fetchLogs = useCallback(async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true)
      
      const res = await fetch('/api/auditoria')
      if (!res.ok) throw new Error('Falha ao buscar logs')
      
      const data = await res.json()
      if(Array.isArray(data)) setLogs(data)
      
      if (showToast) toast.success("Logs atualizados.")
    } catch (error) {
      toast.error("Erro ao carregar auditoria.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  // --- FILTRAGEM ---
  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.detalhe.toLowerCase().includes(filter.toLowerCase()) ||
      log.autor.toLowerCase().includes(filter.toLowerCase()) ||
      log.acao.toLowerCase().includes(filter.toLowerCase())
    )
  }, [logs, filter])

  // --- ESTATÍSTICAS RÁPIDAS (KPIs) ---
  const stats = useMemo(() => {
    return {
        total: filteredLogs.length,
        criticos: filteredLogs.filter(l => l.acao === 'EXCLUSAO' || l.acao === 'DELETE').length,
        usuarios: new Set(filteredLogs.map(l => l.autor)).size
    }
  }, [filteredLogs])

  // --- EXPORTAÇÃO CSV ---
  const handleExport = () => {
    const csvHeader = "Data,Autor,Acao,Recurso,Detalhe\n";
    const csvRows = filteredLogs.map(log => 
        `"${format(new Date(log.data), "dd/MM/yyyy HH:mm")}", "${log.autor}", "${log.acao}", "${log.recurso}", "${log.detalhe}"`
    ).join("\n");
    
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_univac_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Relatório de auditoria baixado.");
  }

  // --- HELPERS VISUAIS ---
  const getActionStyle = (action: string) => {
      if (action.includes('DELETE') || action.includes('EXCLUSAO')) 
        return { color: 'bg-red-100 text-red-700 border-red-200', icon: Trash2 };
      
      if (action.includes('UPDATE') || action.includes('EDICAO')) 
        return { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Edit };
      
      if (action.includes('CREATE') || action.includes('CADASTRO') || action.includes('APLICACAO')) 
        return { color: 'bg-green-100 text-green-700 border-green-200', icon: PlusCircle };
      
      if (action.includes('LOGIN')) 
        return { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: LogIn };

      return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText };
  }

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  const itemVariants = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                <ShieldAlert className="text-primary" size={32} /> Auditoria & Logs
            </h1>
            <p className="text-text-muted">Rastreabilidade completa de todas as ações do sistema.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" onClick={() => fetchLogs(true)} disabled={isRefreshing}>
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            </Button>
            <Button variant="secondary" onClick={handleExport} className="flex items-center gap-2">
                <Download size={18} /> Exportar Relatório
            </Button>
        </div>
      </div>

      {/* KPIs de Auditoria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg"><Activity size={24} /></div>
              <div>
                  <p className="text-2xl font-bold text-text-base">{stats.total}</p>
                  <p className="text-xs text-text-muted uppercase font-bold">Eventos Registrados</p>
              </div>
          </div>
          <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
              <div>
                  <p className="text-2xl font-bold text-text-base">{stats.criticos}</p>
                  <p className="text-xs text-text-muted uppercase font-bold">Ações Críticas</p>
              </div>
          </div>
          <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg"><Users size={24} /></div>
              <div>
                  <p className="text-2xl font-bold text-text-base">{stats.usuarios}</p>
                  <p className="text-xs text-text-muted uppercase font-bold">Usuários Ativos</p>
              </div>
          </div>
      </div>

      {/* Filtros */}
      <div className="bg-bg-surface p-4 rounded-lg border border-border shadow-sm flex items-center gap-4">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
            <input 
                type="text" 
                placeholder="Pesquisar por usuário, ação ou detalhe..." 
                className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-bg-base focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
        </div>
        <div className="text-xs text-text-muted hidden sm:block">
            Mostrando últimos 50 eventos
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-bg-base text-text-muted font-medium uppercase text-xs border-b border-border">
                    <tr>
                        <th className="px-6 py-3">Data / Hora</th>
                        <th className="px-6 py-3">Usuário</th>
                        <th className="px-6 py-3">Ação</th>
                        <th className="px-6 py-3">Recurso</th>
                        <th className="px-6 py-3">Detalhe da Operação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {isLoading ? (
                        <tr><td colSpan={5} className="p-8 text-center"><div className="flex justify-center items-center gap-2"><RefreshCw className="animate-spin" size={16}/> Carregando audit trail...</div></td></tr>
                    ) : filteredLogs.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-text-muted flex flex-col items-center opacity-60"><ShieldAlert size={32} className="mb-2"/>Nenhum registro encontrado para o filtro.</td></tr>
                    ) : (
                        filteredLogs.map((log) => {
                            const style = getActionStyle(log.acao);
                            const Icon = style.icon;
                            return (
                                <motion.tr key={log.id} variants={itemVariants} className="hover:bg-bg-base transition-colors group">
                                    <td className="px-6 py-3 font-mono text-xs text-text-muted group-hover:text-text-base">
                                        {format(new Date(log.data), "dd/MM/yyyy HH:mm")}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-text-base">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold">
                                                {log.autor.charAt(0).toUpperCase()}
                                            </div>
                                            {log.autor}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border flex items-center gap-1 w-fit ${style.color}`}>
                                            <Icon size={12} />
                                            {log.acao}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-text-muted font-medium">
                                        {log.recurso}
                                    </td>
                                    <td className="px-6 py-3 text-text-base max-w-xs truncate" title={log.detalhe}>
                                        {log.detalhe}
                                    </td>
                                </motion.tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </motion.div>
  )
}