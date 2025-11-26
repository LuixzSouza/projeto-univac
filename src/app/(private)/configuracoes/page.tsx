'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Palette, ShieldCheck, Languages, Save, LogOut, Lock, UserCog } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import { toast } from 'sonner'

// Componentes UI
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input' // Certifique-se de ter este componente

export default function ConfiguracoesPage() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  // --- ESTADOS DE PREFERÊNCIAS (Persistência Local) ---
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [idioma, setIdioma] = useState('pt-BR')
  const [itensPorPagina, setItensPorPagina] = useState('10')

  // --- ESTADOS DE SEGURANÇA (Alterar Senha) ---
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Carregar preferências do LocalStorage ao iniciar
  useEffect(() => {
    setMounted(true)
    const savedItens = localStorage.getItem('univac_itens_por_pagina')
    const savedNotif = localStorage.getItem('univac_notificacoes')
    
    if (savedItens) setItensPorPagina(savedItens)
    if (savedNotif) setNotificacoesEmail(JSON.parse(savedNotif))
  }, [])

  // --- AÇÃO 1: SALVAR PREFERÊNCIAS VISUAIS ---
  const handleSavePreferences = () => {
    // Salva no navegador
    localStorage.setItem('univac_itens_por_pagina', itensPorPagina)
    localStorage.setItem('univac_notificacoes', JSON.stringify(notificacoesEmail))
    
    // Simula delay visual
    toast.success("Preferências salvas com sucesso!", {
        description: "Suas configurações visuais foram atualizadas."
    })
  }

// --- AÇÃO 2: ALTERAR SENHA (API REAL) ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (novaSenha.length < 6) {
        toast.warning("A nova senha deve ter pelo menos 6 caracteres.")
        return
    }
    if (novaSenha !== confirmarSenha) {
        toast.error("As senhas não coincidem.")
        return
    }

    // 🔧 CORREÇÃO 1: Type Casting aqui
    const usuarioId = (session?.user as any)?.id;

    if (!usuarioId) {
        toast.error("Erro de sessão. Tente fazer login novamente.")
        return;
    }

    setIsSavingPassword(true)

    try {
        // 🔧 CORREÇÃO 2: Usando a variável segura aqui
        const res = await fetch(`/api/funcionarios/${usuarioId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                senha: novaSenha 
            })
        })

        if (!res.ok) throw new Error('Erro ao atualizar senha')

        toast.success("Senha alterada com sucesso!")
        setSenhaAtual('')
        setNovaSenha('')
        setConfirmarSenha('')
    } catch (error) {
        console.error(error)
        toast.error("Não foi possível alterar a senha.")
    } finally {
        setIsSavingPassword(false)
    }
  }

  // Animações
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  if (!mounted) return <div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div></div>;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 max-w-4xl mx-auto pb-10">

      {/* Cabeçalho */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-text-base flex items-center gap-2">
                <UserCog className="text-primary" size={32}/> Configurações
            </h1>
            <p className="text-text-muted">Gerencie suas preferências e segurança da conta.</p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2">
        
        {/* COLUNA DA ESQUERDA: Preferências Visuais */}
        <div className="space-y-6">
            
            {/* Card: Aparência */}
            <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md border border-border space-y-4">
                <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <Palette size={20}/> Aparência </h2>
                <div>
                    <label className="block text-sm font-medium text-text-base mb-2">Tema da Interface</label>
                    <div className="flex flex-col gap-2">
                        {(['light', 'dark', 'system'] as const).map((t) => (
                            <button key={t} onClick={() => setTheme(t)}
                                className={`w-full rounded-md border px-4 py-2 text-sm font-medium transition-all flex items-center justify-between ${
                                theme === t
                                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary'
                                    : 'border-border text-text-muted hover:bg-bg-base hover:text-text-base'
                                }`}
                            >
                                <span className="capitalize">{t === 'system' ? 'Automático (Sistema)' : t === 'light' ? 'Modo Claro' : 'Modo Escuro'}</span>
                                {theme === t && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Card: Preferências Gerais */}
            <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md border border-border space-y-4">
                <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> <Languages size={20}/> Geral </h2>
                
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-sm font-medium text-text-base">Notificações por Email</label>
                        <p className="text-xs text-text-muted">Receber alertas de vacinas.</p>
                    </div>
                    <Switch enabled={notificacoesEmail} onChange={setNotificacoesEmail} />
                </div>

                <div>
                    <Select id="idioma" label="Idioma do Sistema" value={idioma} onChange={(e) => setIdioma(e.target.value)}>
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US" disabled>Inglês (EUA)</option>
                    </Select>
                </div>

                <div>
                    <Select id="itens" label="Linhas por página (Tabelas)" value={itensPorPagina} onChange={(e) => setItensPorPagina(e.target.value)}>
                        <option value="5">5 itens</option>
                        <option value="10">10 itens</option>
                        <option value="20">20 itens</option>
                        <option value="50">50 itens</option>
                    </Select>
                </div>

                <Button onClick={handleSavePreferences} variant="secondary" className="w-full mt-2">
                    <Save size={16} className="mr-2"/> Salvar Preferências
                </Button>
            </motion.div>
        </div>

        {/* COLUNA DA DIREITA: Segurança */}
        <div className="space-y-6">
            
            {/* Card: Alterar Senha */}
            <motion.div variants={itemVariants} className="rounded-lg bg-bg-surface p-6 shadow-md border border-border space-y-4">
                <h2 className="text-xl font-semibold text-text-base flex items-center gap-2 border-b pb-3 border-border"> 
                    <ShieldCheck size={20} className="text-primary"/> Segurança 
                </h2>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <p className="text-sm text-text-muted">Alterar a senha da conta atual.</p>
                    
                    <Input 
                        id="senhaAtual" 
                        label="Senha Atual (Simulado)" 
                        type="password" 
                        value={senhaAtual} 
                        onChange={(e) => setSenhaAtual(e.target.value)} 
                        placeholder="••••••••"
                    />
                    
                    <div className="grid gap-4">
                        <Input 
                            id="novaSenha" 
                            label="Nova Senha" 
                            type="password" 
                            value={novaSenha} 
                            onChange={(e) => setNovaSenha(e.target.value)} 
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                        <Input 
                            id="confirmarSenha" 
                            label="Confirmar Nova Senha" 
                            type="password" 
                            value={confirmarSenha} 
                            onChange={(e) => setConfirmarSenha(e.target.value)} 
                            placeholder="Repita a nova senha"
                            required
                        />
                    </div>

                    <div className="pt-2">
                        <Button type="submit" variant="primary" className="w-full" disabled={isSavingPassword}>
                            {isSavingPassword ? 'Atualizando...' : 'Atualizar Senha'}
                        </Button>
                    </div>
                </form>
            </motion.div>

            {/* Card: Sessão */}
            <motion.div variants={itemVariants} className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900 p-6">
                <h3 className="text-red-800 dark:text-red-400 font-semibold flex items-center gap-2 mb-2">
                    <Lock size={18}/> Zona de Sessão
                </h3>
                <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                    Deseja sair do sistema? Você precisará fazer login novamente.
                </p>
                <Button 
                    onClick={() => signOut({ callbackUrl: '/login' })} 
                    variant="danger" 
                    className="w-full flex items-center justify-center gap-2"
                >
                    <LogOut size={18}/> Sair do Sistema
                </Button>
            </motion.div>

        </div>
      </div>

    </motion.div>
  )
}