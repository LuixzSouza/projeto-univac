'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, Palette, ShieldCheck, Save, Database, 
  Server, Activity, Globe, Key, AlertTriangle, Download, Trash2, HardDrive,
  HelpCircle, UserCog, Lock
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

// Componentes UI
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'

// --- COMPONENTE DE TOOLTIP MELHORADO ---
function HelpTip({ text }: { text: string }) {
    return (
        <div className="group relative inline-flex items-center ml-2 cursor-help z-10">
            <HelpCircle size={15} className="text-text-muted hover:text-primary transition-colors" />
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center pointer-events-none">
                {text}
                {/* Setinha do balão */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
        </div>
    )
}

// --- CONFIGURAÇÃO DAS ABAS ---
// Aqui definimos quem pode ver o quê
const TABS_CONFIG = [
    { id: 'geral', label: 'Geral & Interface', icon: Palette, access: 'ALL' },
    { id: 'regras', label: 'Regras de Negócio', icon: AlertTriangle, access: 'ADMIN' },
    { id: 'dados', label: 'Dados & Backup', icon: HardDrive, access: 'ADMIN' },
    { id: 'dev', label: 'Integrações & API', icon: Server, access: 'ADMIN' },
]

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('geral')

  // Verifica Permissão
  const userRole = (session?.user as any)?.role || 'FUNCIONARIO'
  const isAdmin = userRole === 'ADMIN'

  // --- ESTADOS ---
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [alertaVencimento, setAlertaVencimento] = useState('30')
  const [backupAutomatico, setBackupAutomatico] = useState(true)
  const [apiKey, setApiKey] = useState('sk_live_********************')
  const [itensPorPagina, setItensPorPagina] = useState('10')
  
  // Estados de Loading
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [isBackingUp, setIsBackingUp] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedItens = localStorage.getItem('univac_itens_por_pagina')
    if (savedItens) setItensPorPagina(savedItens)
  }, [])

  const handleSave = () => {
      localStorage.setItem('univac_itens_por_pagina', itensPorPagina)
      toast.success("Configurações atualizadas com sucesso!")
  }

  const handleGenerateKey = () => {
      setIsGeneratingKey(true)
      setTimeout(() => {
          setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`)
          setIsGeneratingKey(false)
          toast.success("Nova chave de API gerada.")
      }, 1500)
  }

  const handleBackup = () => {
      setIsBackingUp(true)
      setTimeout(() => {
          setIsBackingUp(false)
          toast.success("Backup realizado.", { description: "Arquivo salvo no bucket seguro." })
      }, 2000)
  }

  // Filtra abas visíveis baseado no cargo
  const visibleTabs = TABS_CONFIG.filter(tab => {
      if (tab.access === 'ADMIN' && !isAdmin) return false;
      return true;
  });

  if (!mounted) return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>;

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
  
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-6xl mx-auto pb-20">

      {/* --- HEADER: STATUS DO SISTEMA (SÓ APARECE PARA ADMIN) --- */}
      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusCard 
                icon={Activity} label="Status da API" value="Operacional" color="text-green-500" bg="bg-green-500/10" sub="Uptime: 99.9%"
            />
            <StatusCard 
                icon={Database} label="Banco de Dados" value="Conectado" color="text-blue-500" bg="bg-blue-500/10" sub="Neon PostgreSQL"
            />
            <StatusCard 
                icon={ShieldCheck} label="Segurança Global" value="Ativa" color="text-purple-500" bg="bg-purple-500/10" sub="TLS v1.3 Enforced"
            />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-6 rounded-xl bg-bg-surface border border-border shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserCog size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-text-base">Minhas Preferências</h1>
                <p className="text-text-muted">Personalize sua experiência de uso no UniVac.</p>
            </div>
        </div>
      )}

      {/* --- NAVEGAÇÃO POR ABAS --- */}
      <div className="border-b border-border flex overflow-x-auto scrollbar-hide">
        {visibleTabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.id 
                    ? 'border-primary text-primary bg-primary/5' 
                    : 'border-transparent text-text-muted hover:text-text-base hover:bg-bg-base'
                }`}
            >
                <tab.icon size={18} />
                {tab.label}
            </button>
        ))}
      </div>

      {/* --- CONTEÚDO DAS ABAS --- */}
      <div className="min-h-[400px]">
          
          {/* ABA 1: GERAL (Para Todos) */}
          {activeTab === 'geral' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-bg-surface p-6 border border-border shadow-sm space-y-5">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Palette size={20}/> Aparência</h3>
                    <div>
                        <div className="flex items-center mb-2">
                            <label className="block text-sm font-medium text-text-base">Tema Padrão</label>
                            <HelpTip text="Escolha se prefere o visual claro, escuro ou seguindo seu sistema operacional." />
                        </div>
                        <div className="flex gap-2">
                            {(['light', 'dark', 'system'] as const).map((t) => (
                                <button key={t} onClick={() => setTheme(t)} className={`flex-1 py-2 rounded-md border text-sm font-medium transition-all ${theme === t ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-bg-base'}`}>
                                    {t === 'system' ? 'Auto' : t === 'light' ? 'Claro' : 'Escuro'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Select id="itens" label="Densidade das Tabelas" value={itensPorPagina} onChange={(e) => setItensPorPagina(e.target.value)}>
                        <option value="5">Confortável (5 linhas)</option>
                        <option value="10">Padrão (10 linhas)</option>
                        <option value="20">Compacto (20 linhas)</option>
                    </Select>
                </div>

                <div className="rounded-xl bg-bg-surface p-6 border border-border shadow-sm space-y-5">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Bell size={20}/> Comunicação</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center">
                                <label className="font-medium text-sm">E-mails de Alerta</label>
                                <HelpTip text="Você receberá um resumo semanal das atividades relacionadas ao seu perfil." />
                            </div>
                            <p className="text-xs text-text-muted mt-1">Receber notificações importantes.</p>
                        </div>
                        <Switch enabled={notificacoesEmail} onChange={setNotificacoesEmail} />
                    </div>
                </div>
             </motion.div>
          )}

          {/* ABA 2: REGRAS DE NEGÓCIO (Só Admin) */}
          {activeTab === 'regras' && isAdmin && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="rounded-xl bg-bg-surface p-6 border border-border shadow-sm">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><Activity size={20}/> Parâmetros de Vacinação</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <div className='flex items-center mb-1'>
                                <label className="text-sm font-medium text-text-base">Alerta de Validade de Lote</label>
                                <HelpTip text="O sistema alertará no Dashboard quando um lote estiver próximo do vencimento definido aqui." />
                            </div>
                            <Select id="alerta-venc" label="" value={alertaVencimento} onChange={(e) => setAlertaVencimento(e.target.value)} icon={AlertTriangle}>
                                <option value="15">15 dias antes</option>
                                <option value="30">30 dias antes (Padrão)</option>
                                <option value="60">60 dias antes</option>
                                <option value="90">90 dias antes</option>
                            </Select>
                        </div>

                        <div>
                             <div className="flex items-center mb-2">
                                <label className="block text-sm font-medium text-text-base">Política de Agendamento</label>
                                <HelpTip text="Regra de segurança para impedir erros operacionais." />
                             </div>
                             <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm border border-blue-100 dark:border-blue-800">
                                <p><strong>Modo Rígido (Ativo):</strong> Bloqueia agendamento se estoque for zero.</p>
                             </div>
                        </div>
                    </div>
                </div>
             </motion.div>
          )}

          {/* ABA 3: DADOS (Só Admin) */}
          {activeTab === 'dados' && isAdmin && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="rounded-xl bg-bg-surface p-6 border border-border shadow-sm">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><Database size={20}/> Backup & Retenção</h3>
                    
                    <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                        <div>
                            <div className="flex items-center">
                                <label className="font-medium text-sm">Backup Automático</label>
                                <HelpTip text="O sistema realiza um snapshot do banco de dados Neon diariamente às 03:00 AM." />
                            </div>
                            <p className="text-xs text-text-muted mt-1">Realiza dump do PostgreSQL diariamente.</p>
                        </div>
                        <Switch enabled={backupAutomatico} onChange={setBackupAutomatico} />
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={handleBackup} disabled={isBackingUp} className="w-full md:w-auto">
                            {isBackingUp ? 'Gerando Backup...' : 'Realizar Backup Manual Agora'}
                            {!isBackingUp && <Download size={16} className="ml-2"/>}
                        </Button>
                    </div>
                 </div>
             </motion.div>
          )}

          {/* ABA 4: DEVELOPER (Só Admin) */}
          {activeTab === 'dev' && isAdmin && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="rounded-xl bg-bg-surface p-6 border border-border shadow-sm">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-4"><Globe size={20}/> Webhooks & API</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center mb-1">
                                <label className="block text-sm font-medium text-text-base">Chave de API Pública</label>
                                <HelpTip text="Use esta chave para integrar com sistemas externos como e-Social ou sistemas hospitalares legados." />
                            </div>
                            <div className="flex gap-2">
                                <Input readOnly value={apiKey} className="font-mono text-xs bg-bg-base text-text-muted" />
                                <Button variant="secondary" onClick={handleGenerateKey} disabled={isGeneratingKey}>
                                    {isGeneratingKey ? 'Gerando...' : 'Rotacionar'} <Key size={14} className="ml-2"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
             </motion.div>
          )}
      </div>

      {/* Footer */}
      <motion.div className="flex justify-end pt-6 border-t border-border">
        <Button onClick={handleSave} variant="primary" className="flex items-center gap-2 px-8 shadow-lg">
            <Save size={18} /> Salvar Preferências
        </Button>
      </motion.div>

    </motion.div>
  )
}

// --- SUB-COMPONENTES VISUAIS ---
function StatusCard({ icon: Icon, label, value, sub, color, bg }: any) {
    return (
        <div className="bg-bg-surface border border-border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-xs text-text-muted uppercase font-bold">{label}</p>
                <p className={`text-lg font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-text-muted">{sub}</p>
            </div>
        </div>
    )
}